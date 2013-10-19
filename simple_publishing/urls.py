from django.conf.urls import patterns
from django.conf.urls.defaults import url


from views import PageView


urlpatterns = patterns('',
    url(r'^(?P<url>[-\w\d\/]*)', PageView.as_view(), name='page_view'),
)
