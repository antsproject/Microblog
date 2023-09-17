#!/bin/sh
python manage.py makemigrations
python manage.py migrate
python manage.py create_superuser
python manage.py create_moderator
exec "$@"