# backend/alerts/utils.py
from .models import Alert

def generate_alert(reading):
    """
    Checks clinical thresholds and saves alerts to the database.
    Thresholds confirmed against WHO/AHA standards.
    """
    alerts_to_create = []

    # 1. Blood Pressure Logic (PDF Page 7)
    if reading.systolic and reading.diastolic:
        if reading.systolic >= 180 or reading.diastolic >= 120:
            alerts_to_create.append({
                "type": "Hypertension",
                "severity": "critical",
                "message": f"CRITICAL HYPERTENSION: {reading.systolic}/{reading.diastolic} mmHg detected."
            })
        elif reading.systolic >= 140 or reading.diastolic >= 90:
            alerts_to_create.append({
                "type": "Hypertension",
                "severity": "high",
                "message": f"HIGH BLOOD PRESSURE: {reading.systolic}/{reading.diastolic} mmHg detected."
            })

    # 2. Blood Glucose Logic (PDF Page 7)
    if reading.glucose:
        if reading.glucose < 3.9:
            alerts_to_create.append({
                "type": "Diabetes",
                "severity": "critical",
                "message": f"HYPOGLYCEMIA: Low glucose ({reading.glucose} mmol/L) detected."
            })
        elif reading.glucose > 15:
            alerts_to_create.append({
                "type": "Diabetes",
                "severity": "high",
                "message": f"HYPERGLYCEMIA: High glucose ({reading.glucose} mmol/L) detected."
            })

    # Save alerts to Database
    for item in alerts_to_create:
        Alert.objects.create(
            patient=reading.patient,
            alert_type=item["type"],
            severity=item["severity"],
            message=item["message"],
            status="pending"
        )