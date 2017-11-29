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

        employee_id = request.data.get('employee_id')
        employee_profile = Profile.objects.get(user_id=employee_id)
        profile_serializer = ProfileSerializer(employee_profile)

        if serializer.is_valid():
            serializer.save()
            add_event_data = serializer.data
            add_event_data.update({'employee_profile': profile_serializer.data})
            return Response(add_event_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MonthEvents(APIView):
    def get(self, request, format=None):
        date_selected = request.GET.get('month_date')
        date_selected = parse(date_selected)

        if date_selected.hour != 0:
            offset = timedelta(hours=date_selected.hour)
        else:
            offset = timedelta(hours=0)

        month_selected = date_selected.month
        year_selected = date_selected.year

        [month_start, month_end] = calendar.monthrange(year_selected,
                                                       month_selected)

        start_date = datetime(year_selected, month_selected, 1) + offset
        end_date = (datetime(year_selected, month_selected, month_end) +
                    timedelta(hours=24) + offset)

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

        events_list = [[] for x in range(month_end + 1)]

        for event in serializer.data:
            if parse(event.get('start_date')).month != month_selected:
                day = month_end
            else:
                day = (parse(event.get('start_date')) - offset).day

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
        week_monday = request.GET.get('week_monday')
        week_monday = parse(week_monday)

        if week_monday.hour != 0:
            offset = timedelta(hours=week_monday.hour, seconds=1)
        else:
            offset = timedelta(hours=0)

        start_date = datetime(week_monday.year, week_monday.month, week_monday.day)
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
            weekday = (parse(event.get('start_date')) - offset).weekday()

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
