from django.core.management.base import BaseCommand
from comments.models import CommentModel


class Command(BaseCommand):
    help = 'Creates test comments in the database'

    def handle(self, *args, **kwargs):
        comment1 = CommentModel.objects.create(
            username=f'VasiaKiller',
            post_id=1,
            text_content='Фильм 13/10, господи')

        comment2 = CommentModel.objects.create(
            username='Cан Саныч',
            text_content='Согласен',
            post_id=1,
            parent=comment1)

        comment3 = CommentModel.objects.create(
            username='Серёга1997',
            text_content='Я такое смотреть не буду',
            post_id=1,
            parent=comment1)

        comment4 = CommentModel.objects.create(
            username=f'Дим Юрич',
            post_id=2,
            text_content='Я вас категорически приветствую')

        comment5 = CommentModel.objects.create(
            username='Клим Саныч',
            text_content='Дементий, неси свиней',
            post_id=2,
            parent=comment4)

        comment6 = CommentModel.objects.create(
            username='Дементий',
            text_content='Хрю',
            post_id=2,
            parent=comment4)

        self.stdout.write(self.style.SUCCESS('Successfully created test comments'))
