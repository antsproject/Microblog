from django.core.management.base import BaseCommand

from users.models import CustomUser


class Command(BaseCommand):
    help = 'Create a superuser if it does not exist.'

    def handle(self, *args, **options):
        # Проверяем, существует ли пользователь с заданным username
        if not CustomUser.objects.filter(username='moderator').exists():
            # Создаем суперпользователя, если пользователь с таким username не существует
            superuser = CustomUser.objects.create_admin(
                username='admin',
                email='admin@example.com',
                password='adminpassword'
            )

            self.stdout.write(self.style.SUCCESS(f'User {superuser.username} created successfully.'))
        else:
            self.stdout.write(self.style.SUCCESS('User with username "admin" already exists.'))
