import datetime


from django.db import models
from django.db.models.query import QuerySet, EmptyQuerySet
from django.utils.timezone import now


class PageQuerySet(QuerySet):

    def published(self, *args, **kwargs):
        """ Returns a QuerySet with published pages """
        return self.filter(status='p', publish_date__lte=now())


class EmptyPageQuerySet(EmptyQuerySet):

    def published(self, *args, **kwargs):
        return self


class PageManager(models.Manager):

    def get_query_set(self):
        return PageQuerySet(self.model, using=self._db)

