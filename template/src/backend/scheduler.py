import os
import fcntl
import atexit
import contextlib

# Import the background scheduler class
from apscheduler.schedulers.background import BackgroundScheduler

# Create the lock decorator
    # Create decorator
def lock(function):
    def wrapper(*args, **kwargs):

        # Use a file lock to ensure the task is executed by only one worker
        with open(path, "w") as lock_file:
            try:
                # Try locking the file
                fcntl.flock(lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except IOError:
                # Check whether the error should be ignored
                if ignore:
                    return
                
                # Re-raise the exception
                raise

            try:
                return function(*args, **kwargs)
            finally:
                # Remove the lock path
                os.remove(path)
    return wrapper

# Create the background scheduler
scheduler = BackgroundScheduler()
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())