from django.db import models

class HealthReading(models.Model):
    patient_id = models.IntegerField(default=1)
    reading_type = models.CharField(max_length=20) # 'hypertension' or 'diabetes'
    systolic = models.IntegerField(null=True, blank=True)
    diastolic = models.IntegerField(null=True, blank=True)
    glucose = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reading_type} for Patient {self.patient_id}"
    
    