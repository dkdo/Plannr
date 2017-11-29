from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from profil.views import is_manager
from event.models import Event
from stats.models import Stat
from stats.serializers import StatSerializer
from employees.models import Employees

class StatList(APIView):
    def patch(self, request, format=None):
        is_user_manager = is_manager(request)
        if not is_user_manager:
            user_id = request.user.id
            stat_serializer = update_stats(user_id)
            if stat_serializer is not None:
                if stat_serializer.is_valid():
                    print "stat_serializer is valid"
                    stat_serializer.save()
                    return Response(stat_serializer.data)
                return Response(stat_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

class EmployeesStats(APIView):
    def get(self, request, format=None):
        if is_manager(request):
            user_id = request.user.id
            employees = Employees.objects.filter(manager_id=user_id).values('employee_id')
            print employees
            for emp in employees:
                stat_serializer = update_stats(emp['employee_id'])
                if stat_serializer is not None:
                    if stat_serializer.is_valid():
                        stat_serializer.save()
            employee_stats = Stat.objects.filter(user_id__in=employees).order_by('user_id')
            stats_serializer = StatSerializer(employee_stats, many=True)
            return Response(stats_serializer.data)

def update_stats(user_id):
    print '{} {}'.format('user_id of stats: ', user_id)
    events = Event.objects.filter(end_date__lte=timezone.now(), employee_id=user_id)
    total_hours = 0.0
    shifts = 0
    if events:
        for e in events:
            event_seconds = e.end_date - e.start_date
            print '{} {}'.format('event_seconds', event_seconds.seconds)
            event_hours = float(event_seconds.seconds) / float(3600)
            total_hours += event_hours
            shifts += 1
        print '{} {}'.format('total_hours:', total_hours)
    if Stat.objects.filter(user_id=user_id):
        print "this user has stats"
        stat = Stat.objects.get(user_id=user_id)
        stat_data = {'hours': total_hours, 'shifts': shifts}
        print '{} {}'.format('stat_data: ', stat_data)
        stat_serializer = StatSerializer(stat, data=stat_data, context={'situation': 'other'}, partial=True)
        return stat_serializer
    return None
