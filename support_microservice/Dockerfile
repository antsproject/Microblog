FROM python:3.11-alpine

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir /app
WORKDIR /app
COPY app /app

RUN pip install -r /app/requirements.txt

VOLUME /app
EXPOSE 8080

# COPY entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh
# python manage.py makemigrations &&
CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8000
