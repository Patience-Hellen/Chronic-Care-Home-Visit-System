# backend/readings/urls.py
from django.urls import path
from .views import ReadingCreateView

urlpatterns = [
    # If the prefix 'api/' is in core/urls.py, then this makes it '/api/readings/'
    path('readings/', ReadingCreateView.as_view(), name='readings-list'),
]