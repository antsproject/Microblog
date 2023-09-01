from django.core.management.base import BaseCommand

from users.models import CustomUser


class Command(BaseCommand):
    help = 'Create a moderator if it does not exist.'

    def handle(self, *args, **options):
        # Проверяем, существует ли пользователь с заданным username
        if not CustomUser.objects.filter(username='moderator').exists():
            # Создаем суперпользователя, если пользователь с таким username не существует
            superuser = CustomUser.objects.create_moderator(
                username='moderator',
                email='mod@example.com',
                password='moderatorpassword'
            )

            self.stdout.write(self.style.SUCCESS(f'User {superuser.username} created successfully.'))
        else:
            self.stdout.write(self.style.SUCCESS('User with username "moderator" already exists.'))