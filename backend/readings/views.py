from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny 
from .models import HealthReading 
from alerts.models import Alert
from django.utils import timezone
from datetime import timedelta

class ReadingCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Fetch last 20 readings for the Patient Dashboard
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
        try:
            data = request.data
            rtype = data.get('type') 
            symptoms = data.get('symptoms', [])
            p_name = "Waweru Kimani"
            
            # --- 1. DATA VALIDATION (REJECT ILLOGICAL VALUES PER TABLE) ---
            if rtype == 'hypertension':
                sys = int(data.get('systolic', 0))
                dia = int(data.get('diastolic', 0))
                if sys <= dia:
                    return Response({"status": "error", "message": "Invalid BP Relationship: Systolic must be higher than Diastolic."}, status=400)
                if sys > 250 or dia > 150:
                    return Response({"status": "error", "message": "Invalid BP Range: Input exceeds physiological limits (Max 250/150)."}, status=400)
                if sys < 40 or dia < 30:
                    return Response({"status": "error", "message": "Invalid BP Range: Input below physiological limits (Min 40/30)."}, status=400)
            elif rtype == 'diabetes':
                glc = float(data.get('glucose', 0))
                if glc < 2.0 or glc > 33.3:
                    return Response({"status": "error", "message": "Invalid Glucose: Meter range is 2.0 - 33.3 mmol/L."}, status=400)

            # --- 2. SAVE DATA ---
            reading = HealthReading.objects.create(
                patient_id=1,
                reading_type=rtype,
                systolic=data.get('systolic'),
                diastolic=data.get('diastolic'),
                glucose=data.get('glucose')
            )

            # --- 3. TEMPORAL/CONSECUTIVE LOGIC (LOOK BACK) ---
            prev_reading = HealthReading.objects.filter(patient_id=1, reading_type=rtype).exclude(id=reading.id).order_by('-timestamp').first()
            is_cur_bad = False
            is_prev_bad = False

            if rtype == 'hypertension':
                cur_sys, cur_dia = int(data.get('systolic')), int(data.get('diastolic'))
                if cur_sys >= 140 or cur_dia >= 90 or cur_sys < 90: is_cur_bad = True
                if prev_reading and (prev_reading.systolic >= 140 or prev_reading.systolic < 90): is_prev_bad = True
            else:
                cur_glc = float(data.get('glucose'))
                if cur_glc < 4.0 or cur_glc > 10.0: is_cur_bad = True
                if prev_reading and (prev_reading.glucose < 4.0 or prev_reading.glucose > 10.0): is_prev_bad = True

            prefix = "ESCALATED (Consecutive): " if (is_cur_bad and is_prev_bad) else ""

            # --- 4. CLASSIFICATION & COORDINATION SIGNALS ---
            alerts_to_doctor = []
            patient_advisory = "" 

            if rtype == 'hypertension':
                sys, dia = int(data.get('systolic')), int(data.get('diastolic'))
                if sys >= 180 or dia >= 120:
                    alerts_to_doctor.append(f"{prefix}CRITICAL HYPERTENSION: {sys}/{dia}")
                    patient_advisory = "⚠️ SYSTEM ALERT: Critical reading detected. Your doctor and CHW have been notified for immediate coordination."
                elif (140 <= sys < 180) or (90 <= dia < 120):
                    alerts_to_doctor.append(f"{prefix}HYPERTENSION WARNING: {sys}/{dia}")
                    patient_advisory = "HIGH BP: Your reading has been flagged for clinical review and CHW dispatch."
                elif sys < 90 or dia < 60:
                    alerts_to_doctor.append(f"{prefix}HYPOTENSION RISK: {sys}/{dia}")
                    patient_advisory = "LOW BP: System has flagged this for coordination review."

            elif rtype == 'diabetes':
                glc = float(data.get('glucose'))
                if 2.0 <= glc < 4.0:
                    alerts_to_doctor.append(f"{prefix}HYPOGLYCEMIA: {glc} mmol/L")
                    patient_advisory = "⚠️ LOW SUGAR ALERT: Emergency coordination signal sent to provider."
                elif 10.1 <= glc < 16.7:
                    alerts_to_doctor.append(f"{prefix}HYPERGLYEMIA WARNING: {glc} mmol/L")
                    patient_advisory = "HIGH SUGAR: Flagged for CHW follow-up."
                elif 16.7 <= glc <= 33.3:
                    alerts_to_doctor.append(f"{prefix}CRITICAL HYPERGLYCEMIA: {glc} mmol/L")
                    patient_advisory = "⚠️ CRITICAL SUGAR: High-priority coordination initiated."

            # --- 5. CREATE ALERTS ---
            for msg in alerts_to_doctor:
                Alert.objects.create(patient_id=1, message=f"{p_name}: {msg}", is_resolved=False)

            # --- 6. RETURN INSTANT HISTORY (To prevent vanishing data) ---
            all_r = HealthReading.objects.all().order_by('-id')[:20]
            history = [{
                "id": r.id, "date": r.timestamp.strftime("%b %d"), 
                "metric": "BLOOD PRESSURE" if r.reading_type == 'hypertension' else "BLOOD GLUCOSE", 
                "val": f"{r.systolic}/{r.diastolic}" if r.reading_type == 'hypertension' else f"{r.glucose}", 
                "type": "bp" if r.reading_type == 'hypertension' else "glucose"
            } for r in all_r]

            return Response({"status": "success", "advisory": patient_advisory, "history": history})
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=500)