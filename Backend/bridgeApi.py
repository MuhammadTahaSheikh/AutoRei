import requests
import json

# API token and base URL
API_TOKEN = "d290fabaa8e6aa20dc4b8e853022f0c5"
BASE_URL = "https://api.bridgedataoutput.com/api/v2/OData/stellar/Property"

# Construct the full URL with the access token
url = f"{BASE_URL}?access_token={API_TOKEN}"

try:
    # Make the GET request to the API
    response = requests.get(url)
    
    # Raise an exception for bad status codes
    response.raise_for_status()
    
    # Print the response in JSON format
    data = response.json()
    print(data)

except requests.exceptions.HTTPError as http_err:
    # Return the error response from the external API
    error_data = response.json() if response.content else str(http_err)
    print(json.dumps({'error': error_data}), response.status_code)

except requests.exceptions.RequestException as req_err:
    # Return a generic error message for other request exceptions
    print(json.dumps({'error': str(req_err)}), 500)
