from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny 
from .models import HealthReading 
from alerts.models import Alert
from django.utils import timezone

class ReadingCreateView(APIView):
    permission_classes = [AllowAny] # Essential for prototype testing

    def get(self, request):
        # Fetch last 20 readings for the Patient Dashboard charts
        readings = HealthReading.objects.all().order_by('-id')[:20]
        history_data = []
        
        for r in readings:
            is_bp = r.reading_type == 'hypertension'
            history_data.append({
                "id": r.id,
                "date": r.timestamp.strftime("%b %d"), 
                "metric": "BLOOD PRESSURE" if is_bp else "BLOOD GLUCOSE", 
                "val": f"{r.systolic}/{r.diastolic}" if is_bp else f"{r.glucose}", 
                "type": "bp" if is_bp else "glucose"
            })
        return Response(history_data)

    def post(self, request):
        data = request.data
        rtype = data.get('type') # 'hypertension' or 'diabetes'
        symptoms = data.get('symptoms', []) # e.g., ['Dizziness', 'Headache']
        
        # 1. Save reading to DB
        reading = HealthReading.objects.create(
            patient_id=1,
            reading_type=rtype,
            systolic=data.get('systolic'),
            diastolic=data.get('diastolic'),
            glucose=data.get('glucose')
        )

        alerts_to_doctor = []
        p_name = "Waweru Kimani"
        patient_advisory = "" # Sent to frontend for the alert() popup

        # 2. Clinical Logic (From Research Proposal)
        if rtype == 'hypertension':
            sys = int(data.get('systolic', 0) or 0)
            dia = int(data.get('diastolic', 0) or 0)
            
            if sys >= 180 or dia >= 120:
                msg = f"CRITICAL HYPERTENSION: {sys}/{dia} mmHg"
                alerts_to_doctor.append(msg)
                
                # Emergency Stroke/Crisis Check
                emergency_symp = ['Dizziness', 'Confusion', 'Blurred Vision', 'Headache']
                if any(s in symptoms for s in emergency_symp):
                    patient_advisory = "⚠️ EMERGENCY: Signs of Hypertensive Crisis/Stroke detected. Please go to the hospital immediately."
                else:
                    patient_advisory = "CRITICAL: Your blood pressure is dangerously high. Rest and re-check in 15 mins."
            
            elif sys >= 140 or dia >= 90:
                alerts_to_doctor.append(f"HIGH BLOOD PRESSURE: {sys}/{dia} mmHg")
                
        elif rtype == 'diabetes':
            glc = float(data.get('glucose', 0) or 0)
            if glc >= 15:
                alerts_to_doctor.append(f"HYPERGLYCEMIA: {glc} mmol/L")
                patient_advisory = "HIGH: Blood sugar is high. Take medication and drink water."
            elif glc <= 3.9:
                alerts_to_doctor.append(f"HYPOGLYCEMIA: {glc} mmol/L")
                patient_advisory = "⚠️ CRITICAL: Low blood sugar. Consume fast-acting sugar (juice/honey) immediately."

        # 3. Create Alerts for Doctor Dashboard
        for alert_msg in alerts_to_doctor:
            Alert.objects.create(
                patient_id=1, 
                message=f"{p_name}: {alert_msg}", 
                is_resolved=False
            )

        return Response({
            "status": "success", 
            "advisory": patient_advisory 
        })