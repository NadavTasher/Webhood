#!/usr/bin/env python

import os
import glob
import shlex
import signal
import logging
import argparse
import subprocess
import configparser

# Setup the logging
logging.basicConfig(level=logging.INFO, format="%(process)d:E %(asctime)s * %(message)s", datefmt="%d %b %Y %H:%M:%S.000")

# Create the argument parser
parser = argparse.ArgumentParser()
parser.add_argument("-t", "--timeout", type=int, default=10)
parser.add_argument("-c", "--configuration", type=str, default="/etc/entrypoint/entrypoint.conf")
parser.add_argument("programs", type=str, nargs="*")

# Parse the arguments
arguments = parser.parse_args()

# Create configuration parser
configuration = configparser.ConfigParser()

# Load the configuration
configuration.read(arguments.configuration)

# Check whether should include more files
if configuration.has_section("include"):
    # Get the extra configuration glob
    extra_files = glob.glob(configuration.get("include", "files"))

    # Load all of these files
    for extra_file in extra_files:
        configuration.read(extra_file)

    # Pop the include section
    configuration.pop("include")

# Create list of processes
processes = {}

# Open devnull to use as the children's stdin
devnull = os.open(os.devnull, os.O_RDONLY)

# Create a placeholder for the exit code
exit_code = 0

try:
    # Loop over sections and parse them
    for name in configuration.sections():
        # Check if the program should be ran
        if arguments.programs and name not in arguments.programs:
            continue

        # Fetch the configuration
        program_configuration = configuration[name]

        # Create the processes
        for worker in range(int(program_configuration.get("replication", 1))):
            # Create the process using the values
            process = subprocess.Popen(shlex.split(program_configuration["command"]), stdin=devnull, cwd=program_configuration.get("directory"))

            # Add the process to the dictionary
            processes[process.pid] = ("%s_%d" % (name, worker + 1), process)

            # Log the startup
            logging.info("Started worker %d for %s", worker + 1, name)

    # Wait for any process to finish
    stopped_process_id, stopped_process_exit_code = os.wait()

    # Loop until the stopped process is one of our processes
    while stopped_process_id not in processes:
        # Wait for any process to finish
        stopped_process_id, stopped_process_exit_code = os.wait()

    # Find the stopped process
    stopped_process_name, _ = processes[stopped_process_id]

    # Log the killed process
    logging.error("Process %s has stopped - exit code %d", stopped_process_name, stopped_process_exit_code)

    # Set the exit code
    exit_code = stopped_process_exit_code
except KeyboardInterrupt:
    # Log the container shutdown
    logging.critical("Received shutdown signal")
finally:
    # Loop over all processes
    for (process_name, process) in processes.values():
        # Make sure process is stopped
        if process.poll() is not None:
            continue

        # Log termination
        logging.info("Terminating %s (%d)", process_name, process.pid)

        # Stop running process
        process.terminate()

    # Wait for all processes to finish
    for (process_name, process) in processes.values():
        # Log wait for termination
        if process.poll() is None:
            logging.info("Waiting for %s (%d) to terminate", process_name, process.pid)

        # Wait for termination
        process.wait()

    # Close the devnull
    os.close(devnull)

    # Exit with the error code
    exit(exit_code)
