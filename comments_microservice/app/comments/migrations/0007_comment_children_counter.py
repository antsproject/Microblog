# Generated by Django 4.2.4 on 2023-10-18 10:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0006_remove_comment_username_comment_user_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='children_counter',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
