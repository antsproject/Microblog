FROM python:3.11-alpine
LABEL maintainer="Vladimir Zhelnov <neatek@icloud.com>"
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
WORKDIR /code/app
COPY ./app /code/app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
