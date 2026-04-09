from django.db import models

class Patient(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    condition = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class HealthReading(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    systolic = models.FloatField()
    diastolic = models.FloatField()
    glucose = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

class Alert(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=50)
    message = models.TextField()
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

class HomeVisit(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    assigned_chw = models.CharField(max_length=100)
    visit_date = models.DateTimeField()
    status = models.CharField(max_length=20, default="scheduled")

class VisitNote(models.Model):
    visit = models.ForeignKey(HomeVisit, on_delete=models.CASCADE)
    notes = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
