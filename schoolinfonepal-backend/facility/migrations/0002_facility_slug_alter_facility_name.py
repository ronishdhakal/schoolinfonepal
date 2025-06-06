# Generated by Django 5.1.5 on 2025-06-04 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='facility',
            name='slug',
            field=models.SlugField(blank=True, max_length=110, unique=True),
        ),
        migrations.AlterField(
            model_name='facility',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
