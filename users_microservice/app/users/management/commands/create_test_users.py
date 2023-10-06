from django.core.management.base import BaseCommand
from mimesis import Person
from users.models import CustomUser


class Command(BaseCommand):
    help = 'Create a 5 test users'

    def handle(self, *args, **options):
        person = Person('ru')

        for i in range(1, 6):
            username = person.username()
            email = person.email(domains=['example.com'])

            if not CustomUser.objects.filter(username=username).exists():
                user = CustomUser.objects.create_user(
                    username=username,
                    email=email,
                    password='userpassword',
                    is_active=True
                )
                self.stdout.write(self.style.SUCCESS(f'User {user.username} created successfully.'))
            else:
                self.stdout.write(self.style.SUCCESS(f'User with username "{username}" already exists.'))


