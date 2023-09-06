import os
import ssl
import smtplib
from celery import Celery
from jinja2 import Environment, FileSystemLoader
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Celery(
    "mail",
    backend=f"redis://{os.environ['REDIS_HOST']}:{os.environ['REDIS_PORT']}/0",
    broker=f"pyamqp://guest@{os.environ['RABBITMQ_HOST']}:{os.environ['RABBITMQ_PORT']}//",
    broker_connection_retry_on_startup=True,
)

jinja_env = Environment(loader=FileSystemLoader("templates"))


# FUNCTIONS
def get_html_template(mail_template: str, data: dict()):
    """Получение HTML содержимого письма"""
    template = jinja_env.get_template(mail_template)
    return template.render(data=data)


def send_mail_via_ssl(receiver: str, topic: str, template: str, data: dict()):
    """Отсылка HTML письма"""
    context = ssl.create_default_context()
    message = MIMEMultipart("alternative")
    message["Subject"] = topic
    message["From"] = os.environ["SMTP_SENDER_MAIL"]
    message["To"] = receiver
    text = get_html_template(f"{template}.text.html", data)
    html = get_html_template(f"{template}.html", data)
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)
    with smtplib.SMTP_SSL(os.environ["SMTP_SERVER"], 465, context=context) as server:
        try:
            server.login(os.environ["SMTP_SENDER_MAIL"], os.environ["SMTP_PASSWORD"])
            server.sendmail(
                os.environ["SMTP_SENDER_MAIL"], receiver, message.as_string()
            )
            return True
        except smtplib.SMTPAuthenticationError as e:
            print(
                "Wrong SMTP Auth",
                os.environ["SMTP_SERVER"],
                os.environ["SMTP_SENDER_MAIL"],
                os.environ["SMTP_PASSWORD"],
            )
            return False
    return False


@app.task
def send(receiver: str, topic: str, template: str, data: dict):
    result = send_mail_via_ssl(receiver, topic, template, data)
    return result


if __name__ == "__main__":
    app.start()

