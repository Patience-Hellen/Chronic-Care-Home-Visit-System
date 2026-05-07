from django.urls import path
from .views import VisitCoordinationView

urlpatterns = [
    path('visits/', VisitCoordinationView.as_view(), name='visit-coordination'),
]