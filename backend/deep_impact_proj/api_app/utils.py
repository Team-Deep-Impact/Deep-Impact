from django.core.exceptions import ValidationError
import os
import requests
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_204_NO_CONTENT,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)


sentry_api_key = os.environ.get("SENTRY_API_KEY")

def get_sentry():
    try:
        response = requests.get(f'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key={sentry_api_key}')
        response.raise_for_status()
        data = response.json()
        return Response(data, status=HTTP_200_OK)
    except ValidationError as e:
        print(e)
        return Response(e, status=HTTP_400_BAD_REQUEST)