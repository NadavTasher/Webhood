#!/usr/bin/env python

import os
import sys
import time
import shlex
import signal
import typing
import logging
import argparse
import subprocess
import dataclasses
import configparser

# Setup the logging
logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(process)d] [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S %z")


@dataclasses.dataclass(frozen=True)
class Program:

    name: str
    count: int
    signal: int
    command: str
    directory: str


def parse() -> typing.Tuple[typing.List[Program], int]:
    # Create the argument parser
    parser = argparse.ArgumentParser()
    parser.add_argument("-t", "--timeout", type=int, default=10, help="Timeout for graceful exit")
    parser.add_argument("-c", "--configuration", type=str, default="/etc/entrypoint.conf", help="Path to entrypoint configuration")
    parser.add_argument("names", type=str, nargs="*", help="Names of programs to run")

    # Parse the arguments
    arguments = parser.parse_args()

    # Create configuration parser and load the configuration
    configuration = configparser.ConfigParser()
    configuration.read(arguments.configuration)

    # Create a list of programs
    programs: typing.List[Program] = []

    # Loop over configuration entries and create programs
    for section in configuration.sections():
        # If the section is not whitelisted, skip
        if arguments.names and section not in arguments.names:
            continue

        # Fetch the section values
        configuration_section = configuration[section]

        # Initialize default values
        program_count = 1
        program_signal = signal.SIGINT

        # Count is an optional value
        if "count" in configuration_section:
            program_count = int(configuration_section["count"])

        # Signal is an optional value
        if "signal" in configuration_section:
            program_signal = signal.Signals[configuration_section["signal"]]

        # Must-have configuration values
        program_command = str(configuration_section["command"])
        program_directory = str(configuration_section["directory"])

        # Create the program entry
        programs.append(Program(section, program_count, program_signal, program_command, program_directory))

    # Return the program list
    return programs, arguments.timeout


def run(programs: typing.List[Program], timeout: int = 5) -> int:
    # Initialize dictionary of processes
    processes: typing.Dict[int, typing.Tuple[Program, subprocess.Popen]] = {}

    try:
        # Loop over programs and create processes
        for program in programs:
            # Create as many replicas as needed
            for replica in range(program.count):
                # Create the process
                # pylint: disable-next=consider-using-with, subprocess-popen-preexec-fn
                process = subprocess.Popen(shlex.split(program.command), stdin=subprocess.DEVNULL, cwd=program.directory, preexec_fn=os.setpgrp)

                # Register the process
                processes[process.pid] = (program, process)

                # Log the replica
                logging.info("Started replica %d for %r", replica + 1, program.name)

        # Wait for any process to finish
        process_id, exit_code = os.wait()

        # Loop until the stopped process is one of our processes
        while process_id not in processes:
            # Wait for any process to finish
            process_id, exit_code = os.wait()

        # Find the program
        program, _ = processes[process_id]

        # Log the killed process
        logging.error("Process %d of %r has exited with %d", process_id, program.name, exit_code)

        # Ungraceful exit, exit code should be as of process
        return exit_code
    except KeyboardInterrupt:
        # Log keyboard interrupt
        logging.critical("Received shutdown signal")

        # Graceful exit, exit code should be 0
        return 0
    except:  # pylint: disable=bare-except
        # Log the exception
        logging.exception("An exception has occured")

        # Ungraceful exit, exit code should be 1
        return 1
    finally:
        # Try interrupting all processes
        for program, process in processes.values():
            # Only interrupt if not stopped
            if process.poll() is None:
                # Send the termination signal
                process.send_signal(program.signal)

        # Mark end time
        end_time = time.time() + timeout

        # Wait for all processes
        for _, process in processes.values():
            # Only wait if not stopped
            if process.poll() is None:
                # Calculate the time left
                time_left = max(end_time - time.time(), 0)

                # Wait for the process
                process.wait(time_left)

        # Timeout exceeded, terminate all remaining processes
        for program, process in processes.values():
            # Only terminate if still running
            if process.poll() is None:
                # Terminate the process
                process.terminate()

                # Log termination
                logging.warning("Terminated %d of %r because of timeout", process.pid, program.name)


def main() -> None:
    # Parse the arguments and configuration
    programs, timeout = parse()

    # Execute the programs and wait for an exit code
    exit_code = run(programs, timeout)

    # Exit with the error code
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
