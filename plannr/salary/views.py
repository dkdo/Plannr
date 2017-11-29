import calendar
from datetime import date, datetime, timedelta
from dateutil.parser import parse
from employees.models import Employees
from employees.serializers import EmployeesSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from profil.models import Profile
from profil.serializers import ProfileSerializer
from event.models import Event
from event.serializers import EventSerializer
from position.models import Position


class SalaryCompWeek(APIView):
    def get(self, request, format=None):
        selected_date = request.GET.get('selected_date')
        selected_date = parse(selected_date)

        user_id = request.user.id
        profile = Profile.objects.get(user_id=user_id)
        position_id = profile.position_id

        response = {'week_hours': 0,
                    'week_salary': 0,
                    'month_hours': 0,
                    'month_salary': 0,
                    'hourly_salary': 0}

        if not position_id:
            return Response(response)

        today = datetime.today()
        events_week = get_week_events(selected_date, user_id)
        events_month = get_month_events(today, user_id)

        position = Position.objects.get(id=position_id)
        hourly_salary = position.salary

        week_serializer = EventSerializer(events_week, many=True)
        month_serializer = EventSerializer(events_month, many=True)

        week_hours, week_salary = get_total_salary(week_serializer, hourly_salary)
        month_hours, month_salary = get_total_salary(month_serializer, hourly_salary)

        response = {'week_hours': week_hours,
                    'week_salary': week_salary,
                    'month_hours': month_hours,
                    'month_salary': month_salary,
                    'hourly_salary': hourly_salary}

        return Response(response)


class SalaryCompMonth(APIView):
    def get(self, request, format=None):
        selected_date = request.GET.get('selected_date')
        selected_date = parse(selected_date)

        user_id = request.user.id
        profile = Profile.objects.get(user_id=user_id)
        position_id = profile.position_id

        response = {'week_hours': 0,
                    'week_salary': 0,
                    'month_hours': 0,
                    'month_salary': 0,
                    'hourly_salary': 0}

        if not position_id:
            return Response(response)

        today = datetime.today()
        events_week = get_week_events(today, user_id)
        events_month = get_month_events(selected_date, user_id)

        position = Position.objects.get(id=position_id)
        hourly_salary = position.salary

        week_serializer = EventSerializer(events_week, many=True)
        month_serializer = EventSerializer(events_month, many=True)

        week_hours, week_salary = get_total_salary(week_serializer, hourly_salary)
        month_hours, month_salary = get_total_salary(month_serializer, hourly_salary)

        response = {'week_hours': week_hours,
                    'week_salary': week_salary,
                    'month_hours': month_hours,
                    'month_salary': month_salary,
                    'hourly_salary': hourly_salary}

        return Response(response)


def get_week_events(selected_date, user_id):
    week_start = selected_date - timedelta(days=selected_date.weekday())
    week_end = week_start + timedelta(days=7, hours=23, minutes=59,
                                      seconds=59)
    events_week = Event.objects.filter(start_date__range=(week_start, week_end),
                                       employee_id=user_id)

    return events_week


def get_month_events(selected_date, user_id):
    month_selected = selected_date.month
    year_selected = selected_date.year

    [month_start, month_end] = calendar.monthrange(year_selected,
                                                   month_selected)
    month_start = date(year_selected, month_selected, 1)
    month_end = (date(year_selected, month_selected, month_end) +
                 timedelta(hours=23, minutes=59, seconds=59))

    events_month = Event.objects.filter(start_date__range=(month_start, month_end),
                                        employee_id=user_id)

    return events_month


def get_total_salary(events_serializer, hourly_salary):
    total_hours = 0.0

    for event in events_serializer.data:
        start_hour = parse(event.get('start_date'))
        end_hour = parse(event.get('end_date'))
        delta = (end_hour - start_hour).total_seconds() / 3600.0
        total_hours += delta

    total_salary = total_hours * hourly_salary

    return (total_hours, total_salary)
