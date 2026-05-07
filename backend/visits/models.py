from django.db import models

class HomeVisit(models.Model):
    triggered_by_alert = models.ForeignKey('alerts.Alert', on_delete=models.SET_NULL, null=True, blank=True)
    patient_name = models.CharField(max_length=200)
    chw_name = models.CharField(max_length=200, default="CHW User")
    status = models.CharField(max_length=50, default="Completed")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Visit: {self.patient_name} ({self.created_at.strftime('%Y-%m-%d')})"

class VisitNote(models.Model):
    # This links the clinical notes to the visit above
    visit = models.ForeignKey(HomeVisit, on_delete=models.CASCADE, related_name='details')
    notes = models.TextField()
    is_urgent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notes for {self.visit.patient_name}"