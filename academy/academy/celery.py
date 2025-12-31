# academy/celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'academy.settings')

app = Celery('academy')

# Read CELERY_ settings from Django settings with 'CELERY_' prefix
app.config_from_object('django.conf:settings', namespace='CELERY')

# Autodiscover tasks.py in installed apps
app.autodiscover_tasks()
