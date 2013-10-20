from django.conf.urls import patterns, include, url


from rest_framework import routers


from views import PageView
from api import PageViewSet


router = routers.DefaultRouter()
router.register(r'pages', PageViewSet)

urlpatterns = patterns('',
    url(r'^publishing/api/', include(router.urls)),
    url(r'^(?P<url>[-\w\d\/]*)', PageView.as_view(), name='page_view'),
)
