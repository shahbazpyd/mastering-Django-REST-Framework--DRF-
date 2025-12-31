import requests

# 1. Define the ID of the student you want to delete
STUDENT_ID_TO_DELETE = 5

url = f'http://127.0.0.1:8000/api/viewset-students/{STUDENT_ID_TO_DELETE}/'

# PASTE YOUR COPIED TOKEN HERE
token = '9b0a7d95811a3f733a76ae39a03db94e2da39452' 
# token = '5d54ab319b098ec0ec490201b1e4749ba111fc87'
headers = {
    'Authorization': f'Token {token}'
}

# data = {
#     "name": "robin",
#     "age": 34,
#     "email": "robin@gmail.com"
# }


response = requests.delete(url, headers=headers)
# response = requests.post(url, headers=headers, json=data)
# response = requests.get(url, headers=headers)

print("Status Code:", response.status_code)
if response.status_code == 204:
    print("Data: Successfully Deleted (204 No Content)")
else:
    try:
        print("Data:", response.json())
    except requests.exceptions.JSONDecodeError:
        print("Data: No JSON content in response body.")