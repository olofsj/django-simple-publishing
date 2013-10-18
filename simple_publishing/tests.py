import datetime


from django.test import TestCase
from django.utils.timezone import now


from models import Page


class PageSaveTestCase(TestCase):

    def test_slug_and_url_uniqueness(self):
        """ Check that urls are generated correctly and that duplicate slugs are given a suffix """
        # Test root page
        root = Page(title='Root', slug='')
        root.save()
        self.assertEqual(root.url, '/')

        # Test simple url generation
        page1 = Page(title='Page 1', slug='page-1', parent=root)
        page1.save()
        self.assertEqual(page1.url, '/page-1/')
        self.assertEqual(page1.slug, 'page-1')

        # Test slug collisions
        page2 = Page(title='Page 2', slug='page-1', parent=root)
        page2.save()
        self.assertEqual(page2.url, '/page-2/')
        self.assertEqual(page2.slug, 'page-2')

        # Test nested page url generation
        page3 = Page(title='Page 3', slug='page-3', parent=page1)
        page3.save()
        self.assertEqual(page3.url, '/page-1/page-3/')
        self.assertEqual(page3.slug, 'page-3')

        # Test regeneration of child urls when parent is updated
        page1.slug = 'page'
        page1.save()
        self.assertEqual(page1.url, '/page/')
        self.assertEqual(page1.slug, 'page')
        page3 = Page.objects.get(pk=page3.pk)
        self.assertEqual(page3.url, '/page/page-3/')
        self.assertEqual(page3.slug, 'page-3')


class PageLogicTestCase(TestCase):

    def setUp(self):
        root = Page(title='Root', slug='', status='p')
        root.save()
        earlier = now() + datetime.timedelta(days=-1)
        later = now() + datetime.timedelta(days=+1)
        page1 = Page(title='Page 1', slug='page-1', parent=root,
            status='p', publish_date=later)
        page1.save()
        page2 = Page(title='Page 2', slug='page-2', parent=root, status='d')
        page2.save()
        page3 = Page(title='Page 3', slug='page-3', parent=root,
            status='p', publish_date=earlier)
        page3.save()

    def test_published_status(self):
        """ Check that the published status is handled correctly """
        self.assertEqual(Page.objects.all().count(), 4)
        self.assertEqual(Page.objects.all().published().count(), 2)

