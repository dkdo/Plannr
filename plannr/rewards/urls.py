from . import views
from django.conf.urls import url

app_name = 'rewards'
urlpatterns = [
    url(r'^rewardList/$', views.RewardList.as_view()),
]
