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


class SalaryComp(APIView):
    def get(self, request, format=None):
        user_id = request.user.id
        profile = Profile.objects.get(user_id=user_id)
        position_id = profile.position_id

        if not position_id:
            return Response(0)

        # date_selected = request.GET.get('selected_date')
        today = datetime.today()
        today_start = datetime(today.year, today.month, today.day)
        today_end = today_start + timedelta(hours=23, minutes=59, seconds=59)

        month_selected = today.month
        year_selected = today.year

        week_start = date(year_selected, month_selected, today.day)
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=7, hours=23, minutes=59,
                                          seconds=59)

        [month_start, month_end] = calendar.monthrange(year_selected,
                                                       month_selected)
        month_start = date(year_selected, month_selected, month_start)
        month_end = (date(year_selected, month_selected, month_end) +
                     timedelta(hours=23, minutes=59, seconds=59))

        events_today = Event.objects.filter(start_date__range=(today_start, today_end),
                                            employee_id=user_id)
        events_week = Event.objects.filter(start_date__range=(week_start, week_end),
                                           employee_id=user_id)
        events_month = Event.objects.filter(start_date__range=(month_start, month_end),
                                            employee_id=user_id)

        position = Position.objects.get(id=position_id)
        hourly_salary = position.salary

        today_serializer = EventSerializer(events_today, many=True)
        week_serializer = EventSerializer(events_week, many=True)
        month_serializer = EventSerializer(events_month, many=True)

        today_hours, today_salary = self.get_total_salary(today_serializer, hourly_salary)
        week_hours, week_salary = self.get_total_salary(week_serializer, hourly_salary)
        month_hours, month_salary = self.get_total_salary(month_serializer, hourly_salary)

        response = {'today_hours': today_hours,
                    'today_salary': today_salary,
                    'week_hours': week_hours,
                    'week_salary': week_salary,
                    'month_hours': month_hours,
                    'month_salary': month_salary,
                    'hourly_salary': hourly_salary}

        return Response(response)

    def get_total_salary(self, events_serializer, hourly_salary):
        total_hours = 0.0

        for event in events_serializer.data:
            start_hour = parse(event.get('start_date'))
            end_hour = parse(event.get('end_date'))
            delta = (end_hour - start_hour).total_seconds() / 3600.0
            total_hours += delta

        total_salary = total_hours * hourly_salary

        return (total_hours, total_salary)
