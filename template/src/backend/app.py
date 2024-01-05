from runtypes import *
from router import router
from scheduler import scheduler, lock




@router.get("/api/ping")
def _ping():
    return "Pong"

def scheduled_task():
    with open("/tmp/test", "ab") as f:
        f.write(b"AAAAAAAAA\n")

scheduler.add_job(func=scheduled_task, trigger="interval", seconds=10)