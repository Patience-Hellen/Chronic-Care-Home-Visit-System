# backend/visits/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from alerts.models import Alert
from .models import HomeVisit, VisitNote
from readings.models import HealthReading 
from django.utils import timezone

class VisitCoordinationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            p_name = "Waweru Kimani"
            
            # 1. FETCH ALERTS (The "One at a Time" Rule)
            # Only show the latest alert that has NOT been resolved
            active_alerts = Alert.objects.filter(is_resolved=False).order_by('-id')
            alert_data = []
            if active_alerts.exists():
                a = active_alerts.first()
                alert_data.append({
                    "id": a.id,
                    "patient": p_name,
                    "msg": a.message
                })

            # 2. FETCH VISITS
            # We show visits for the CHW and for the Doctor's record
            visits = HomeVisit.objects.all().order_by('-id')
            visit_data = []
            for v in visits:
                note_obj = v.details.first()
                visit_data.append({
                    "id": v.id,
                    "patient": v.patient_name,
                    "chw": v.chw_name,
                    "status": v.status, # SCHEDULED or VERIFIED
                    "date": v.created_at.strftime("%b %d").upper() if v.created_at else "MAY 12",
                    "date_obj": v.created_at.isoformat() if v.created_at else None,
                    "notes": note_obj.notes if note_obj else "",
                    "outcome": note_obj.notes if note_obj else ""
                })
            
            return Response({"alerts": alert_data, "visits": visit_data})
        except Exception as e:
            return Response({"alerts": [], "visits": []})

    def post(self, request):
        data = request.data
        action = data.get('action')

        if action == 'dispatch':
            # STEP A: Create the Visit for the CHW
            HomeVisit.objects.create(
                patient_name=data.get('patient_name', 'Waweru Kimani'), 
                chw_name=data.get('chw_name', 'CHW Brian'), 
                status="SCHEDULED"
            )

            # STEP B: CLEAR THE ALERT(S)
            # We find all unresolved alerts for this patient and mark them RESOLVED
            # This ensures the "1" in the sidebar goes back to "0" immediately.
            Alert.objects.filter(patient_id=1, is_resolved=False).update(is_resolved=True)
            
            return Response({"status": "success", "message": "CHW Dispatched, Alert Cleared"})
            
        elif action == 'complete':
            # STEP C: CHW Completes the task
            try:
                v = HomeVisit.objects.get(id=data.get('visit_id'))
                v.status = "VERIFIED"
                v.save()
                
                VisitNote.objects.create(
                    visit=v, 
                    notes=data.get('notes', 'Visit completed and documented.')
                )
                return Response({"status": "success"})
            except HomeVisit.DoesNotExist:
                return Response({"error": "Visit not found"}, status=404)
                
        return Response({"status": "error", "message": "Invalid Action"}, status=400)