import os
import glob
import shlex
import logging
import argparse
import subprocess
import configparser

# Setup the logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

# Create the argument parser
parser = argparse.ArgumentParser()
parser.add_argument("-c", "--configuration", default="/etc/entrypoint/entrypoint.conf")

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
devnull = None
processes = dict()

try:
    # Open devnull for reading as stdin for subprocesses
    devnull = os.open(os.devnull, os.O_RDONLY)

    # Loop over sections and parse them
    for name in configuration.sections():
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

    # Find the stopped process
    stopped_process_name, _ = processes[stopped_process_id]

    # Log the killed process
    logging.error("Process %s has stopped - exit code %d", stopped_process_name, stopped_process_exit_code)
finally:
    # Loop over all processes
    for (process_name, process) in processes.values():
        # Make sure process is stopped
        if process.poll() is not None:
            continue

        # Log termination
        logging.warning("Terminating %s (%d)", process_name, process.pid)

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
    if devnull is not None:
        os.close(devnull)
