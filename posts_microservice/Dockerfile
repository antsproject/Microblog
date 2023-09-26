FROM python:3.11-alpine
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN mkdir /app
WORKDIR /app
COPY ./app /app
RUN pip install -r /app/requirements.txt
VOLUME /app
EXPOSE 8082
CMD python manage.py migrate && \
    python manage.py create_test_category && \
#   python manage.py create_test_post && \
    python manage.py runserver 0.0.0.0:8000

