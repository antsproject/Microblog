from django.core.management.base import BaseCommand

from users.models import CustomUser


class Command(BaseCommand):
    help = 'Create a 5 test users'

    def handle(self, *args, **options):

        for i in range(1, 6):
            if not CustomUser.objects.filter(username=f'user_{i}').exists():
                user = CustomUser.objects.create_user(
                    username=f'user_{i}',
                    email=f'user_{i}@example.com',
                    password='userpassword',
                    is_active=True
                )
                self.stdout.write(self.style.SUCCESS(f'User {user.username} created successfully.'))
            else:
                self.stdout.write(self.style.SUCCESS(f'User with username "user_{i}" already exists.'))

