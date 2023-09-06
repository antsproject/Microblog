import os
from celery import Celery
from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI()
celery_client = Celery(
    "fastapi",
    backend=f"redis://{os.environ['REDIS_HOST']}:{os.environ['REDIS_PORT']}/0",
    broker=f"pyamqp://guest@{os.environ['RABBITMQ_HOST']}:{os.environ['RABBITMQ_PORT']}//",
    broker_connection_retry_on_startup=True,
)
celery_client.conf.task_routes = {
    "mail.*": {"queue": "mail"},
}


class MailFormatData(BaseModel):
    receiver: str
    topic: str
    template: str
    data: dict


@app.post("/send")
async def send(data: MailFormatData):
    try:
        result = celery_client.send_task(
            "mail.send",
            (data.receiver, data.topic, data.template, data.data),
            time_limit=10,
            soft_time_limit=5,
        )
        return {
            "id": result.id,
            "receiver": data.receiver,
            "template": data.template,
            "data": data.data,
            "success": True,
        }
    except BaseException as e:
        return {
            "id": None,
            "receiver": data.receiver,
            "template": data.template,
            "data": data.data,
            "success": False,
        }
