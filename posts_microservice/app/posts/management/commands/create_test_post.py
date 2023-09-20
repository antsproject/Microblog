from django.core.management.base import BaseCommand
from posts.models import PostModel, Tag


class Command(BaseCommand):
    help = 'Create test post'

    def handle(self, *args, **kwargs):
        science_tag = Tag.objects.get(tag_name='Science')
        other_tag = Tag.objects.get(tag_name='Other')

        example_posts = [
            {
                "user_id": 12374,
                "title": "Example Post 1",
                "content": "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. "
                           "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. "
                           "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat",
                "tag": science_tag
            },
            {
                "user_id": 1,
                "title": "Example Post 2",
                "content": "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. "
                           "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. "
                           "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat",
                "tag": other_tag
            },
        ]
        if not PostModel.objects.filter(title='Example Post 2'):
            for post_data in example_posts:
                PostModel.objects.create(**post_data)

        self.stdout.write(
            self.style.SUCCESS('Example posts created successfully.')
        )
