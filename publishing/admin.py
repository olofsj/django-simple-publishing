from django.contrib import admin


from .models import Page


class PageAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['parent', 'title', 'slug', 'content', 'summary',
        'author', 'status', 'publish_date', 'type']}),
    ]
    list_display = ['title', 'status', 'publish_date', 'type']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}


admin.site.register(Page, PageAdmin)

