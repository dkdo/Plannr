import calendar
from datetime import timedelta, date, datetime
from dateutil.parser import parse

from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from event.models import Event
from event.serializers import EventSerializer
from profil.models import Profile
from profil.serializers import ProfileSerializer
from profil.views import is_manager


class EventList(APIView):
    def get(self, request, format=None):
        date_selected = request.GET.get('start_date')
        start_date = parse(date_selected)
        end_date = start_date + timedelta(hours=23, minutes=59, seconds=59)

        user_id = request.user.id
        user_manager = is_manager(request)

        if user_manager:
            events = Event.objects.filter(start_date__range=(start_date, end_date),
                                          manager_id=user_id)
        else:
            events = Event.objects.filter(start_date__range=(start_date, end_date),
                                          employee_id=user_id)

        serializer = EventSerializer(events, many=True)

        employees = events.values('employee_id')
        employee_profiles = Profile.objects.filter(user_id__in=employees)

        for event in serializer.data:
            event_employee = next((e for e in employee_profiles if e.user_id == event.get('employee_id')), None)
            event_employee = ProfileSerializer(event_employee)
            event.update({'employee_profile': event_employee.data})

        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = EventSerializer(data=request.data,
                                     context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MonthEvents(APIView):
    def get(self, request, format=None):
        date_selected = request.GET.get('month_date')
        month_selected = parse(date_selected).month
        year_selected = parse(date_selected).year

        [month_start, month_end] = calendar.monthrange(year_selected,
                                                       month_selected)

        start_date = date(year_selected, month_selected, month_start)
        end_date = (date(year_selected, month_selected, month_end) +
                    timedelta(hours=23, minutes=59, seconds=59))

        user_id = request.user.id
        user_manager = is_manager(request)

        if user_manager:
            events = Event.objects.filter(start_date__range=(start_date, end_date),
                                          manager_id=user_id)
        else:
            events = Event.objects.filter(start_date__range=(start_date, end_date),
                                          employee_id=user_id)

        serializer = EventSerializer(events, many=True)

        employees = events.values('employee_id')
        employee_profiles = Profile.objects.filter(user_id__in=employees)

        events_list = [[] for x in range(month_end)]

        for event in serializer.data:
            day = parse(event.get('start_date')).day
            event_employee = next((e for e in employee_profiles if e.user_id == event.get('employee_id')), None)
            event_employee = ProfileSerializer(event_employee)
            event.update({'employee_profile': event_employee.data})
            events_list[day].append(event)

        return Response(events_list)


class EventDetail(APIView):
    def get_object(self, pk):
        try:
            return Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        event = self.get_object(pk)
        serializer = EventSerializer(event)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        event = self.get_object(pk)
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        event = self.get_object(pk)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WeekEvents(APIView):
    def get(self, request, format=None):
        year = int(request.GET.get('year', 0))
        month = int(request.GET.get('month', 0))
        month = month + 1
        monday = int(request.GET.get('day', 0))

        start_date = datetime(year, month, monday, 0, 0, 0)

        end_date = start_date + timedelta(days=7)

        user_id = request.user.id
        user_manager = is_manager(request)

        if user_manager:
            events = Event.objects.filter(start_date__range=(start_date, end_date),
                                          manager_id=user_id).order_by('start_date')
        else:
            events = Event.objects.filter(start_date__range=(start_date, end_date),
                                          employee_id=user_id).order_by('start_date')

        serializer = EventSerializer(events, many=True)

        employees = events.values('employee_id')
        employee_profiles = Profile.objects.filter(user_id__in=employees)

        events_list = [[] for x in range(7)]

        for event in serializer.data:
            weekday = parse(event.get('start_date')).weekday()

            event_employee = next((e for e in employee_profiles if e.user_id == event.get('employee_id')), None)
            event_employee = ProfileSerializer(event_employee)
            event.update({'employee_profile': event_employee.data})

            events_list[weekday].append(event)

        return Response(events_list)

    def post(self, request, format=None):
        serializer = EventSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
