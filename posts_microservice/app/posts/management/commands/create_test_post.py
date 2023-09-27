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

            fake_content = {
                "id": generic.random.randint(1, 100),
                "type": "paragraph",
                "props": {
                    "textColor": "black",
                    "backgroundColor": "white",
                    "textAlignment": generic.random.choice(["left", "center", "right"]),
                },
                "content": [
                    {
                        "type": "text",
                        "text": fake_text,
                        "styles": {
                            "fontFamily": generic.text.word(),
                            "fontSize": generic.random.randint(12, 24),
                        },
                    }
                ],
                "children": [],
            }

            fake_json_content = json.dumps(fake_content, indent=4)

            example_post = {
                "user_id": generic.random.randint(1, 7),
                "category": generic.random.choice(categories),
                "title": fake_title,
                "content": fake_json_content
            }

            PostModel.objects.create(**example_post)

            self.stdout.write(
                self.style.SUCCESS(f'{_}/{TEST_POST_COUNT} Example post created successfully [SUCCESS].'))
