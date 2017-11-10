from employees.models import Employees
from employees.serializers import EmployeesSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class EmployeesList(APIView):
    def get(self, request, format=None):
        user_id = request.user.id
        events = Employees.objects.filter(manager_id=user_id)
        serializer = EmployeesSerializer(events, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = EmployeesSerializer(data=request.data,
                                         context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
