# from django.urls import re_path
# 

# websocket_urlpatterns = [
#     re_path(r"ws/hello/$", HelloConsumer.as_asgi()),
# ]
from django.urls import re_path
from .consumers import NotificationConsumer
from .consumers import HelloConsumer

websocket_urlpatterns = [
    re_path(r"ws/notifications/$", NotificationConsumer.as_asgi()),
    re_path(r"ws/hello/$", HelloConsumer.as_asgi()),
]
