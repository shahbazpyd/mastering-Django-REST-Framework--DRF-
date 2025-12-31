# # students/tasks.py
# from celery import shared_task
# from django.core.mail import send_mail
# from django.conf import settings

# @shared_task
# def send_welcome_email_task(student_name, student_email):
#     print("send_welcome_email_task called")
#     subject = "Welcome to Academy"
#     message = f"Welcome {student_name}! Your account is active."
#     from_email = settings.DEFAULT_FROM_EMAIL
#     recipient_list = [student_email]

#     print(">>> SENDING EMAIL TASK")
#     print("Subject:", subject)
#     print("From:", from_email)
#     print("To:", recipient_list)

#     send_mail(subject, message, from_email, recipient_list, fail_silently=False)

#     print(">>> EMAIL SENT (if no exception)")

#     return f"Email sent to {student_email}"



# # from celery import shared_task
# # import time

# # @shared_task
# # def generate_report_task(student_id):
# #     # Simulate a heavy report generation
# #     print(f">>> GENERATING REPORT for student {student_id}")
# #     time.sleep(5)
# #     print(f">>> REPORT READY for student {student_id}")
# #     return f"Report generated for student {student_id}"

# from celery import shared_task
# from asgiref.sync import async_to_sync
# from channels.layers import get_channel_layer
# import time


# @shared_task
# def generate_report_task(student_id, user_id=None):
#     print(f">>> GENERATING REPORT for student {student_id}")
#     time.sleep(5)
#     print(f">>> REPORT READY for student {student_id}")

#     # Send WebSocket notification
#     channel_layer = get_channel_layer()
#     if channel_layer and user_id is not None:
#         group_name = f"user_{user_id}"
#         async_to_sync(channel_layer.group_send)(
#             group_name,
#             {
#                 "type": "report_finished",  # must match consumer method name
#                 "message": f"Report for student {student_id} is ready",
#             },
#         )

#     return f"Report generated for student {student_id}"


from celery import shared_task
from django.core.mail import send_mail
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


@shared_task
def send_welcome_email_task(student_id, email, name):
    subject = "Welcome to Academy"
    message = f"Hi {name}, your student profile (ID: {student_id}) has been created."
    send_mail(
        subject=subject,
        message=message,
        from_email=None,      # DEFAULT_FROM_EMAIL
        recipient_list=[email],
        fail_silently=True,
    )


@shared_task
def send_student_created_ws_task(student_id, user_id):
    channel_layer = get_channel_layer()
    if not channel_layer or user_id is None:
        return

    group_name = f"user_{user_id}"

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "notification",
            "payload": {
                "kind": "student_created",
                "student_id": student_id,
                "text": f"Student {student_id} has been created.",
            },
        },
    )

