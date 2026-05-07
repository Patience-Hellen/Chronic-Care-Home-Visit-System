from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from alerts.models import Alert
from .models import HomeVisit, VisitNote
from django.utils import timezone

class VisitCoordinationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # 1. Fetch data
        active_alerts = Alert.objects.filter(is_resolved=False).order_by('-id')
        visits = HomeVisit.objects.all().order_by('-id')
        
        # 2. Format Alerts for Doctor View
        alert_data = []
        for a in active_alerts:
            alert_data.append({
                "id": a.id,
                "patient": "Waweru Kimani",
                "msg": a.message
            })

        # 3. Format Visits for CHW Calendar & Doctor Review
        visit_data = []
        for v in visits:
            note_obj = v.details.first() # Get clinical notes if CHW has saved them
            note_text = note_obj.notes if note_obj else ""
            
            visit_data.append({
                "id": v.id,
                "patient": v.patient_name,
                "chw": v.chw_name,
                "status": v.status,
                "date": v.created_at.strftime("%b %d").upper(), # "MAY 07"
                "date_obj": v.created_at.isoformat(), # Essential for CHW Calendar highlight
                "notes": note_text,
                "outcome": note_text, # Duplicate for component compatibility
                "reason": "Clinical Follow-up"
            })
        
        return Response({
            "alerts": alert_data,
            "visits": visit_data
        })

    def post(self, request):
        data = request.data
        action = data.get('action')

        if action == 'dispatch':
            # Doctor sends CHW to Patient
            HomeVisit.objects.create(
                patient_name=data.get('patient_name', 'Waweru Kimani'), 
                chw_name=data.get('chw_name', 'CHW Brian'), 
                status="SCHEDULED"
            )
            # Resolve the alert so it leaves the Doctor's Urgent list
            alert_id = data.get('alert_id')
            if alert_id:
                Alert.objects.filter(id=alert_id).update(is_resolved=True)
            
        elif action == 'complete':
            # CHW finishes the visit
            try:
                v = HomeVisit.objects.get(id=data.get('visit_id'))
                v.status = "VERIFIED"
                v.save()
                
                # Save the documentation notes
                VisitNote.objects.create(
                    visit=v, 
                    notes=data.get('notes', 'No notes provided.')
                )
            except HomeVisit.DoesNotExist:
                return Response({"error": "Visit not found"}, status=404)
                
        return Response({"status": "success"})