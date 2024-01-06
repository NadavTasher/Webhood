import threading

# Create stop event
EVENT = threading.Event()

# Loop until finished
while not EVENT.is_set():
    # Wait for event
    EVENT.wait(10)