from django.db import models

class Alert(models.Model):
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=50)
    message = models.TextField()
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)