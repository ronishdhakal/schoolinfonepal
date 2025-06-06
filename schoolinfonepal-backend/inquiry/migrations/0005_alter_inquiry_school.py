# Generated by Django 5.2.2 on 2025-06-07 16:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inquiry', '0004_remove_inquiry_updated_at_and_more'),
        ('school', '0007_school_admin_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inquiry',
            name='school',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='inquiries', to='school.school'),
        ),
    ]
