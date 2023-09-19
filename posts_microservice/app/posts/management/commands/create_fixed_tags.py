from django.core.management.base import BaseCommand
from posts.models import Tag


class Command(BaseCommand):
    help = 'Create fixed tags'

    def handle(self, *args, **kwargs):
        fixed_tags = [
            'Science',
            'Money',
            'Life',
            'Other'
        ]

        for tag_name in fixed_tags:
            Tag.objects.get_or_create(tag_name=tag_name)

        self.stdout.write(
            self.style.SUCCESS('Fixed tags created successfully.')
        )
