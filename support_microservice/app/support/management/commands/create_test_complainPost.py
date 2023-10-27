from django.core.management.base import BaseCommand
from support.models import ComplainPost, Complain

fixed_complains = [
    'Мне это не нравится',
    'Это спам',
    'Изображение обнаженного тела или действий сексуального характера',
    'Враждебные высказывания или символы',
    'Насилие или опасные организации',
    'Ложная информация',
    'Мошенничество или обман',
    'Травля или преследование',
    'Нарушение прав на интеллектуальную собственность',
    'Самоубийство или нанесение себе увечий',
    'Продажа незаконных или подлежащих правовому регулированию товаров',
    'Расстройства пищевого поведения',
    'Другое',
]


class Command(BaseCommand):
    help = "Create fixed Complains to Post"

    def handle(self, *args, **kwargs):
        # Создаем объекты Complain, если они еще не созданы
        for complain_type in fixed_complains:
            Complain.objects.get_or_create(type=complain_type)

        # Создаем ComplainPost и связываем их с соответствующими Complain
        for comp in range(1, 4):
            email = f'test{comp}@gmail.com'
            user_id = comp
            post_id = comp + 1

            complain_post = ComplainPost.objects.create(
                email=email,
                user_id=user_id,
                post_id=post_id,
            )

            # Получаем соответствующие Complain объекты и добавляем их к complain_post
            complain_types_posts = Complain.objects.filter(type=fixed_complains[comp - 1])
            complain_post.complain_types.set(complain_types_posts)

            self.stdout.write(
                self.style.SUCCESS(f'Fixed Complain "{fixed_complains[comp - 1]}" to Post: "{comp+1}" '
                                   f'created successfully [COMPLAIN SUCCESS].'))




