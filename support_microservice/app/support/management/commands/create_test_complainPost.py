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
        for comp in range(1, 4):
            ComplainPost.objects.get_or_create(
                email=f'test{comp}@gmail.com',
                user_id=comp,
                post_id=comp+1,
                complain_type=Complain.objects.get(type=fixed_complains[comp])
            )

            self.stdout.write(
                self.style.SUCCESS(f'Fixed Complain to Post "{fixed_complains[comp]}" to Post: "{comp+1}" created successfully [COMPLAIN SUCCESS].'))
