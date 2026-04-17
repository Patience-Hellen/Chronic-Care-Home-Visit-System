from django.db import models

class HomeVisit(models.Model):
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    assigned_chw = models.CharField(max_length=100)
    visit_date = models.DateTimeField()
    status = models.CharField(max_length=20, default="scheduled")

class VisitNote(models.Model):
    visit = models.ForeignKey(HomeVisit, on_delete=models.CASCADE)
    notes = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)