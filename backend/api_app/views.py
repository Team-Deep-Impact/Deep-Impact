from django.shortcuts import render
from django.core.exceptions import ValidationError
import os
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_204_NO_CONTENT,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)
from .utils import get_sentry

sentry_api_key = os.environ.get("SENTRY_API_KEY")



# Create your views here.
class Sentry(APIView):
    def get(self, request):
        return get_sentry()


class OpenAI(APIView):
    pass
