from django.core.management.base import BaseCommand
from posts.models import CategoryModel


class Command(BaseCommand):
    help = "Create fixed Category's"

    def handle(self, *args, **kwargs):
        fixed_category = [
            'Other',
            'Science',
            'Money',
            'Life',
            'Tech',
        ]

        for name in fixed_category:
            CategoryModel.objects.get_or_create(name=name)

        self.stdout.write(
            self.style.SUCCESS('Fixed Category created successfully [CATEGORY SUCCESS].')
        )
