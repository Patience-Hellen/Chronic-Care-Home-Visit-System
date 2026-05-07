from rest_framework import serializers
from .models import HealthReading

class HealthReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthReading
        # Added 'medication_taken' and 'symptoms' to match your React data
        fields = ['id', 'systolic', 'diastolic', 'glucose', 'medication_taken', 'symptoms', 'notes', 'timestamp']
        read_only_fields = ['id', 'timestamp']