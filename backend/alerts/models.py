from django.db import models

class Alert(models.Model):
    # We use a simple Integer for now to avoid "Patient not found" crashes
    patient_id = models.IntegerField(default=1) 
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"Alert: {self.message}"