# Generated by Django 4.2.4 on 2023-10-04 13:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0005_comment_like_counter'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='username',
        ),
        migrations.AddField(
            model_name='comment',
            name='user_id',
            field=models.BigIntegerField(default=2),
            preserve_default=False,
        ),
    ]
