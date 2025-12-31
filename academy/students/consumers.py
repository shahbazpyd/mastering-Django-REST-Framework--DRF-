# from channels.generic.websocket import AsyncWebsocketConsumer
# import json
# import asyncio

# class HelloConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()
#         await self.send_json({"message": "WebSocket connected"})

#         # simple counter demo
#         for i in range(1, 6):
#             await asyncio.sleep(1)
#             await self.send_json({"counter": i})

#     async def disconnect(self, close_code):
#         pass

#     async def receive(self, text_data=None, bytes_data=None):
#         # Echo back whatever client sends
#         if text_data:
#             await self.send_json({"echo": text_data})

#     async def send_json(self, data):
#         await self.send(text_data=json.dumps(data))

# from channels.generic.websocket import AsyncWebsocketConsumer
# import json
# import asyncio

# class HelloConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         user = self.scope.get("user", None)
#         if user is None or user.is_anonymous:
#             self.user_group_name = "user_anonymous"
#         else:
#             self.user_group_name = f"user_{user.id}"

#         await self.channel_layer.group_add(self.user_group_name, self.channel_name)
#         await self.accept()

#         await self.send_json({"message": "WebSocket connected", "group": self.user_group_name})

#         for i in range(1, 6):
#             await asyncio.sleep(1)
#             await self.send_json({"counter": i})

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.user_group_name, self.channel_name)

#     async def receive(self, text_data=None, bytes_data=None):
#         if text_data:
#             await self.send_json({"echo": text_data})

#     async def send_json(self, data):
#         await self.send(text_data=json.dumps(data))

#     async def report_finished(self, event):
#         await self.send_json({"notification": event["message"]})


from channels.generic.websocket import AsyncWebsocketConsumer
import json


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_anonymous:
            await self.close()
            return

        self.group_name = f"user_{user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def notification(self, event):
        # event["payload"] comes from Celery task
        await self.send(text_data=json.dumps(event["payload"]))
