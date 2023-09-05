import os
import ssl
import smtplib
from dotenv import load_dotenv
from celery import Celery
from jinja2 import Environment, FileSystemLoader
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()

# ENVIRONMENT
RABBITMQ_HOST = (
    os.environ["RABBITMQ_HOST"] if "RABBITMQ_HOST" in os.environ else "rabbitmq"
)
RABBITMQ_PORT = os.environ["RABBITMQ_PORT"] if "RABBITMQ_PORT" in os.environ else "5672"
REDIS_HOST = os.environ["REDIS_HOST"] if "REDIS_HOST" in os.environ else "redis"
REDIS_PORT = os.environ["REDIS_PORT"] if "REDIS_PORT" in os.environ else "6379"
SMTP_SERVER = (
    os.environ["SMTP_SERVER"] if "SMTP_SERVER" in os.environ else "FILL_PLEASE_ENV_FILE"
)
SMTP_SENDER_MAIL = (
    os.environ["SMTP_SENDER_MAIL"]
    if "SMTP_SENDER_MAIL" in os.environ
    else "FILL_PLEASE_ENV_FILE"
)
SMTP_PASSWORD = (
    os.environ["SMTP_PASSWORD"]
    if "SMTP_PASSWORD" in os.environ
    else "FILL_PLEASE_ENV_FILE"
)

# CELERY
app = Celery(
    "mailerApp",
    backend="redis://" + REDIS_HOST + ":" + REDIS_PORT + "/0",
    broker="pyamqp://guest@" + RABBITMQ_HOST + ":" + RABBITMQ_PORT + "/",
)


# FUNCTIONS
def get_html_template(mail_template: str, data: dict()):
    """Получение HTML содержимого письма"""
    env = Environment(loader=FileSystemLoader("templates"))
    template = env.get_template(mail_template)
    return template.render(data=data)


def send_mail_via_ssl(receiver: str, topic: str, template: str, data: dict()):
    """Отсылка HTML письма"""
    context = ssl.create_default_context()
    message = MIMEMultipart("alternative")
    message["Subject"] = topic
    message["From"] = SMTP_SENDER_MAIL
    message["To"] = receiver
    text = ""
    html = get_html_template(template, data)
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)
    with smtplib.SMTP_SSL(SMTP_SERVER, 465, context=context) as server:
        server.login(SMTP_SENDER_MAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_SENDER_MAIL, receiver, message.as_string())


# Ex:
# data = {"username": "Hello World!", "link": "https://"}
# send_mail_via_ssl("neatek@icloud.com", "Activation", "activate.html", data)


@app.task
def list():
    return False
