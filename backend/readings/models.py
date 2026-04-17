from django.db import models

class HealthReading(models.Model):
    # Link to the Patient model in the 'patients' app
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    systolic = models.FloatField()
    diastolic = models.FloatField()
    glucose = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)