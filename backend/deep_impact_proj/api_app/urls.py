from django.urls import path
from .views import (
    Sentry,
    OpenAI,
)

urlpatterns = [
    path('sentry/', Sentry.as_view(), name='sentry'),
    path('openai/', OpenAI.as_view(), name='openai'),
]
