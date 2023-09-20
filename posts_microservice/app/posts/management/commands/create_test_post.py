from django.core.management.base import BaseCommand
from posts.models import PostModel, Tag


class Command(BaseCommand):
    help = 'Create test post'

    def handle(self, *args, **kwargs):
        science_tag = Tag.objects.get(tag_name='Science')
        other_tag = Tag.objects.get(tag_name='Other')

        example_posts = [
            {
                "username": "Test_user_1",
                "title": "Example Post 1",
                "content": "Content of Example Post 1",
                "tag": science_tag
            },
            {
                "username": "Test_user_2",
                "title": "Example Post 2",
                "content": "Content of Example Post 2",
                "tag": other_tag
            },
        ]
        if not PostModel.objects.filter(title='Example Post 2'):
            for post_data in example_posts:
                PostModel.objects.create(**post_data)

        self.stdout.write(
            self.style.SUCCESS('Example posts created successfully.')
        )
