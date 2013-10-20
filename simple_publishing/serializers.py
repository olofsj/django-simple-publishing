from rest_framework import serializers


from models import Page


class PageSerializer(serializers.ModelSerializer):
    parent = serializers.PrimaryKeyRelatedField(required=False)

    class Meta:
        model = Page
        fields = (
            'id',
            'parent',
            'title',
            'slug',
            'url',
            'content',
            'summary',
            'author',
            'status',
            'publish_date',
            'type',
            'created',
            'modified'
        )

