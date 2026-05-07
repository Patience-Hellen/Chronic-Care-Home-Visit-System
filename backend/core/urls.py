from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('readings.urls')), # Your readings app
    path('api/', include('visits.urls')),   # <--- THIS IS WHAT TRIGGERS THE ERROR IF MISSING
]