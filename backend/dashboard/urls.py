from django.urls import path
from . import views

urlpatterns = [
    path("summary/", views.SummaryView.as_view()),
    path("analytics/", views.AnalyticsView.as_view()),
]
