import re


from django.db import models, transaction, IntegrityError
from django.utils.timezone import now
from django.utils.translation import ugettext as _
from django.contrib.auth.models import User


from managers import PageManager


STATUS_CHOICES = (
  ('d', _('Draft')),
  ('p', _('Published')),
  ('w', _('Withdrawn')),
)


class Page(models.Model):
    parent = models.ForeignKey('self', related_name='children',
        verbose_name=_('parent'), null=True, blank=True)
    title = models.CharField(_('title'), max_length=255)
    slug = models.SlugField(_('slug'), max_length=50)
    url = models.CharField(_('url'), max_length=2048, unique=True)
    content = models.TextField(_('content'), blank=True)
    summary = models.TextField(_('summary'), blank=True)
    html = models.TextField(_('html'), blank=True)
    author = models.ForeignKey(User, verbose_name=_('author'), null=True)
    status = models.CharField(_('status'), max_length=1, choices=STATUS_CHOICES, default='d')
    publish_date = models.DateTimeField(_('publish date'), null=True)
    created = models.DateTimeField(_('created'), auto_now_add=True)
    modified = models.DateTimeField(_('modified'), auto_now=True)

    objects = PageManager()

    class Meta:
        verbose_name = _('page')
        verbose_name_plural = _('pages')

    def __unicode__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.set_url()
        self.set_published()
        try:
            # Try to save as usual
            sid = transaction.savepoint()
            super(Page, self).save(*args, **kwargs)
            transaction.savepoint_commit(sid)
        except IntegrityError as e:
            # Slug is not unique enough so generate a new one and retry save
            transaction.savepoint_rollback(sid)
            self.set_slug()
            self.save(*args, **kwargs)
        self.update_children()

    def set_published(self):
        """
        Set the published date to 'now' if no publish date is set and the
        status is 'Published'
        """
        if self.status == 'p' and self.publish_date is None:
            self.publish_date = now()

    def set_slug(self):
        """ Set a slug that is unique among the page's siblings """
        slugs = Page.objects.filter(parent=self.parent).values_list('slug', flat=True)
        max_length = self._meta.get_field('slug').max_length
        suffix_finder = re.compile(r'-\d+$')
        base_slug = re.sub(suffix_finder, '', self.slug)
        suffix = 1
        while self.slug in slugs:
            suffix_string = "-%d" % suffix
            length = max_length - len(suffix_string)
            self.slug = base_slug[:length] + suffix_string
            suffix += 1

    def set_url(self):
        """ Set the page url from the parent url and the page's slug """
        if self.parent is None:
            self.url = '/'
        else:
            self.url = self.parent.url + self.slug + '/'

    def update_children(self):
        """ Update all children if the url has changed """
        for child in self.children.all():
            if not child.url == self.url + child.slug + '/':
                child.save()

