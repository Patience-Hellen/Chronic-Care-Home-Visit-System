from django.contrib import admin
from .models import Patient, HealthReading, Alert, HomeVisit, VisitNote

admin.site.register(Patient)
admin.site.register(HealthReading)
admin.site.register(Alert)
admin.site.register(HomeVisit)
admin.site.register(VisitNote)
