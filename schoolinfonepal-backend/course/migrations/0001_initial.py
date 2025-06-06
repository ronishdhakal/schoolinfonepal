# Generated by Django 5.1.5 on 2025-06-04 11:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('discipline', '0001_initial'),
        ('level', '0001_initial'),
        ('university', '0002_university_foreign_affiliated'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('abbreviation', models.CharField(blank=True, max_length=50)),
                ('slug', models.SlugField(blank=True, max_length=220, unique=True)),
                ('duration', models.CharField(blank=True, max_length=100)),
                ('short_description', models.TextField(blank=True)),
                ('outcome', models.TextField(blank=True)),
                ('eligibility', models.TextField(blank=True)),
                ('curriculum', models.TextField(blank=True)),
                ('meta_title', models.CharField(blank=True, max_length=255)),
                ('meta_description', models.TextField(blank=True)),
                ('og_title', models.CharField(blank=True, max_length=255)),
                ('og_description', models.TextField(blank=True)),
                ('og_image', models.ImageField(blank=True, null=True, upload_to='course/og/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('disciplines', models.ManyToManyField(blank=True, related_name='courses', to='discipline.discipline')),
                ('level', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='courses', to='level.level')),
                ('university', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='courses', to='university.university')),
            ],
        ),
        migrations.CreateModel(
            name='CourseAttachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='course/attachments/')),
                ('description', models.CharField(blank=True, max_length=255)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attachments', to='course.course')),
            ],
        ),
    ]
