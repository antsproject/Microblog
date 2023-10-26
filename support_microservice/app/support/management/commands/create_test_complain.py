from django.core.management.base import BaseCommand
from support.models import Complain

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
    help = "Create fixed Complains"

    def handle(self, *args, **kwargs):
        for type_comp in fixed_complains:
            Complain.objects.get_or_create(type=type_comp)

            self.stdout.write(
                self.style.SUCCESS(f'Fixed Complain: "{type_comp}" created successfully [COMPLAIN SUCCESS].'))
