import atexit
import contextlib

# Import the background scheduler class
from apscheduler.schedulers.background import BackgroundScheduler

# Create the lock decorator
def lock(path=None):
    # Generate the random lock path
    pass

# Create the background scheduler
scheduler = BackgroundScheduler()
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())