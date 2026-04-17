from django.contrib import admin
from .models import Alert
from patients.models import Patient
from readings.models import HealthReading
from visits.models import HomeVisit, VisitNote

admin.site.register(Patient)
admin.site.register(HealthReading)
admin.site.register(Alert)
admin.site.register(HomeVisit)
admin.site.register(VisitNote)
