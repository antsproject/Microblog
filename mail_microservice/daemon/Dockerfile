FROM python:3.11-alpine
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 PYTHONUNBUFFERED=1
LABEL maintainer="Vladimir Zhelnov <neatek@icloud.com>"
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
WORKDIR /code/app
COPY ./app /code/app
CMD ["celery", "-A", "mail", "worker", "--concurrency", "8", "-Q", "mail", "--loglevel", "INFO"]
