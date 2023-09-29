from django.core.management.base import BaseCommand
from posts.models import PostModel, CategoryModel
from mimesis import Generic
from mimesis.locales import Locale
from mimesis import Text
import json

TEST_POST_COUNT = 10

generic = Generic(locale=Locale.RU)
categories = CategoryModel.objects.all().order_by('id')


class Command(BaseCommand):
    help = f'Create {TEST_POST_COUNT} test posts'

    def handle(self, *args, **kwargs):
        for _ in range(1, TEST_POST_COUNT + 1):
            sentences = generic.random.randint(3, 10)
            fake_title = Text().title()
            fake_text = Text().text(sentences)

            fake_content = [
                {
                    "id": "d7dbabba-1cab-4889-9aa6-b5219b1f2efe",
                    "type": "paragraph",
                    "props": {
                        "textColor": "default",
                        "backgroundColor": "default",
                        "textAlignment": "left"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": fake_text,
                            "styles": {}
                        }
                    ],
                    "children": []
                },
                {
                    "id": "1d8e35d9-ef12-40de-9a6d-1ebcd598b2f4",
                    "type": "paragraph",
                    "props": {
                        "textColor": "default",
                        "backgroundColor": "default",
                        "textAlignment": "left"
                    },
                    "content": [],
                    "children": []
                }
            ]

            example_post = {
                "user_id": generic.random.randint(1, 7),
                "category": generic.random.choice(categories),
                "title": fake_title,
                "content": fake_content
            }

            PostModel.objects.create(**example_post)

            self.stdout.write(
                self.style.SUCCESS(f'{_}/{TEST_POST_COUNT} Example post created successfully [SUCCESS].'))
