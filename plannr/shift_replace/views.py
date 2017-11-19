from datetime import datetime

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from event.models import Event
from event.serializers import EventSerializer
from profil.models import Profile
from profil.views import is_manager
from shift_replace.models import Shift
from shift_replace.serializers import ShiftSerializer


class ShiftCenterList(APIView):
    def get(self, request, format=None):
        today = datetime.today()

        user_id = request.user.id
        profile = Profile.objects.get(user_id=user_id)
        organization_id = profile.organization_id
        shifts = Shift.objects.filter(organization_id=organization_id, manager_approved=False)
        shifts_serializers = ShiftSerializer(shifts, many=True)

        events_ids = shifts.values('event')
        shifts_details = Event.objects.filter(id__in=events_ids)
        shifts_details_serializer = EventSerializer(shifts_details, many=True)

        current_shifts = Event.objects.filter(start_date__gte=today, employee_id=user_id)
        current_shifts = current_shifts.exclude(id__in=events_ids)
        current_shifts = EventSerializer(current_shifts, many=True)

        shifts = {'current_shifts': [],
                  'searching': [],
                  'waiting_approval': []}

        shifts['current_shifts'] = current_shifts.data

        for shift in shifts_serializers.data:
            shift_detail = next((sd for sd in shifts_details_serializer.data if sd.get('id') == shift.get('event_id')), None)
            if shift.get('searching'):
                shifts['searching'].append({'shift': shift, 'shift_detail': shift_detail})
            elif not shift.get('manager_approved'):
                shifts['waiting_approval'].append({'shift': shift, 'shift_detail': shift_detail})

        return Response(shifts)


class ShiftSearchReplace(APIView):
    def post(self, request, format=None):
        user_id = request.user.id
        event_id = request.POST.get('event_id')

        profile = Profile.objects.get(user_id=user_id)
        organization_id = profile.organization_id

        shift_data = {'event_id': event_id, 'organization_id': organization_id}

        shift_serializer = ShiftSerializer(data=shift_data)

        if shift_serializer.is_valid():
            shift_serializer.save()
            return Response(shift_serializer.data, status=status.HTTP_201_CREATED)

        return Response(shift_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShiftReplaceRequest(APIView):
    def patch(self, request, format=None):
        user_id = request.user.id
        shift_id = request.POST.get('shift_id')

        shift = Shift.objects.get(id=shift_id)

        if not shift.interested_emp_id:
            shift_data = {'interested_emp_id': user_id, 'searching': False}
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        shift_serializer = ShiftSerializer(shift, data=shift_data, partial=True)

        if shift_serializer.is_valid():
            shift_serializer.save()
            return Response(shift_serializer.data)

        return Response(shift_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShiftManagerApprove(APIView):
    def patch(self, request, format=None):
        if request.user.is_authenticated() and is_manager(request):
            shift_id = request.POST.get('shift_id')

            shift = Shift.objects.get(id=shift_id)
            shift_data = {'manager_approved': True}
            shift_serializer = ShiftSerializer(shift, data=shift_data, partial=True)

            event = Event.objects.get(id=shift.event_id)
            event_data = {'employee_id': shift.interested_emp_id}
            event_serializer = EventSerializer(event, data=event_data, partial=True)

            if shift_serializer.is_valid() and event_serializer.is_valid():
                shift_serializer.save()
                event_serializer.save()
                return Response(shift_serializer.data)

        return Response(shift_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
