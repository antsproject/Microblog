from django.core.management.base import BaseCommand
from posts.models import CategoryModel

fixed_category = [
    'Other',
    'Science',
    'Money',
    'Life',
    'Tech',
]


class Command(BaseCommand):
    help = "Create fixed Categories"

    def handle(self, *args, **kwargs):
        for name in fixed_category:
            CategoryModel.objects.get_or_create(name=name)

            self.stdout.write(
                self.style.SUCCESS(f'Fixed Category: "{name}" created successfully [CATEGORY SUCCESS].'))
