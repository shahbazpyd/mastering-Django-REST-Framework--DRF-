import requests

url = 'http://127.0.0.1:8000/api/viewset-students/'

# PASTE YOUR COPIED TOKEN HERE
# token = '9b0a7d95811a3f733a76ae39a03db94e2da39452' 
token = '5d54ab319b098ec0ec490201b1e4749ba111fc87'
headers = {
    'Authorization': f'Token {token}'
}

response = requests.get(url, headers=headers)

print("Status Code:", response.status_code)
print("Data:", response.json())
