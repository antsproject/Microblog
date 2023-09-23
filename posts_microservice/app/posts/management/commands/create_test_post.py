from django.core.management.base import BaseCommand
from posts.models import PostModel, Tag
import random


class Command(BaseCommand):
    help = 'Create test post'

    def handle(self, *args, **kwargs):
        tags = Tag.objects.all()
        num_test_posts = 150

        for i in range(num_test_posts):
            example_posts = {
                "user_id": random.randint(0, 100000),
                "title": f"Example Post {i}",
                "content": "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium"
                           "voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati"
                           "cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi,"
                           "id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio."
                           "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id"
                           "quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus."
                           "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet "
                           "ut et voluptates repudiandae sint et molestiae non recusandae. "
                           "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores"
                           "alias consequatur aut perferendis doloribus asperiores repellat",
                "tag": random.choice(tags)
            }

            PostModel.objects.create(**example_posts)

        self.stdout.write(
            self.style.SUCCESS('Example posts created successfully.')
        )
