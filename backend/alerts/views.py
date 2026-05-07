from rest_framework.views import APIView
from rest_framework.response import Response
from ..readings.serializers import HealthReadingSerializer

class ReadingCreateView(APIView):
    def post(self, request):
        serializer = HealthReadingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(patient=request.user) # Link to logged-in user
            return Response({"message": "Logged successfully!"}, status=201)
        return Response(serializer.errors, status=400)