from django.core.paginator import Paginator
from django.http import Http404, HttpResponseRedirect
from django.views.generic import TemplateView


from models import Page


PER_PAGE = 10


class PageView(TemplateView):

    def get(self, request, *args, **kwargs):
        # Fetch the page for this url
        url = '/' + kwargs.get('url', '')
        try:
            self.page = Page.objects.get(url=url)
        except Page.DoesNotExist:
            raise Http404

        # Preview for page author
        if not self.page.is_published() and not request.user.has_perm('publishing.change_page'):
            raise Http404

        # Fetch context data
        children = self.page.children.all().published().order_by('-publish_date')
        paginator = Paginator(children, PER_PAGE)
        page_number = kwargs.get('page', 1)
        try:
            list_page = paginator.page(page_number)
        except PageNotAnInteger, EmptyPage:
            return HttpResponseRedirect(self.page.url)

        context = {
            'page': self.page,
            'paginator': paginator,
            'list_page': list_page,
        }
        return self.render_to_response(context)

    def get_template_names(self):
        return [self.page.get_template_name()]
