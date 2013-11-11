from rest_framework import viewsets
from rest_framework.permissions import DjangoModelPermissions


from .serializers import PageSerializer
from .models import Page


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = (DjangoModelPermissions,)

