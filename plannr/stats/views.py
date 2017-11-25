from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from profil.views import is_manager
from event.models import Event
from stats.models import Stat
from stats.serializers import StatSerializer

class StatList(APIView):
    def patch(self, request, format=None):
        is_user_manager = is_manager(request)
        if not is_user_manager:
            user_id = request.user.id
            events = Event.objects.filter(end_date__lte=timezone.now(), employee_id=user_id)
            print '{} {}'.format('total events:', events)
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
            stat = Stat.objects.get(user_id=user_id)
            stat_data = {'hours': total_hours, 'shifts': shifts}
            stat_serializer = StatSerializer(stat, data=stat_data, context={'situation': 'other'}, partial=True)

            if stat_serializer.is_valid():
                stat_serializer.save()
                return Response(stat_serializer.data)
            return Response(stat_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)
