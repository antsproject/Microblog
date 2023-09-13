# Generated by Django 4.2.4 on 2023-09-13 15:14

from django.db import migrations
import django_resized.forms


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_customuser_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='avatar',
            field=django_resized.forms.ResizedImageField(blank=True, crop=None, default='avatars/default_avatar.jpg', force_format='JPEG', keep_meta=True, null=True, quality=100, scale=None, size=[300, 300], upload_to='avatars/'),
        ),
    ]
