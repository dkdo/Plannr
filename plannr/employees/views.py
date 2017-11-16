from employees.models import Employees
from employees.serializers import EmployeesSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from profil.models import Profile
from profil.serializers import ProfileSerializer


class EmployeesList(APIView):
    def get(self, request, format=None):
        user_id = request.user.id
        employees = Employees.objects.filter(manager_id=user_id).values('employee_id')
        employee_profiles = Profile.objects.filter(user_id__in=employees)
        serializer = ProfileSerializer(employee_profiles, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = EmployeesSerializer(data=request.data,
                                         context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
