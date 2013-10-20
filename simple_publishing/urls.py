from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView


from rest_framework import routers


from views import PageView
from api import PageViewSet


router = routers.DefaultRouter()
router.register(r'pages', PageViewSet)

urlpatterns = patterns('',
    url(r'^publishing/api/', include(router.urls)),
    url(r'^publishing/$', login_required(TemplateView.as_view(
      template_name="simple_publishing/editor.html"))),
    url(r'^(?P<url>[-\w\d\/]*)', PageView.as_view(), name='page_view'),
)
