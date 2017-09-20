from datetime import timedelta, date, datetime
from dateutil.parser import parse
from event.models import Event
from django.views.decorators.csrf import csrf_exempt
from event.serializers import EventSerializer
from rest_framework.decorators import api_view
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class EventList(APIView):
    def get(self, request, format=None):
        date_selected = request.GET.get('start_date')
        start_date = parse(date_selected)
        end_date = start_date + timedelta(hours=23, minutes=59, seconds=59)
        events = Event.objects.filter(start_date__range=(start_date, end_date))
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        print request.data
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        sunday = int(request.GET.get('day', 0))

        start_date = date(year, month, sunday)
        end_date = start_date + timedelta(days=6)

        events = Event.objects.filter(date__range=(start_date, end_date))
        serializer = EventSerializer(events, many=True)

        return Response(serializer.data)

    def post(self, request, format=None):
        print request
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
