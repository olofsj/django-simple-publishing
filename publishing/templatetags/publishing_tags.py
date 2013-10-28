from django import template


from ..models import PAGE_TYPES, STATUS_CHOICES


register = template.Library()


@register.assignment_tag
def get_page_type_choices():
    return ((pt['name'], pt['verbose_name']) for pt in PAGE_TYPES)


@register.assignment_tag
def get_status_choices():
    return STATUS_CHOICES

