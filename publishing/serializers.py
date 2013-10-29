from rest_framework import serializers


from models import Page


class PageSerializer(serializers.ModelSerializer):
    parent = serializers.PrimaryKeyRelatedField(required=False)
    children = serializers.PrimaryKeyRelatedField(many=True, required=False, read_only=True)

    class Meta:
        model = Page
        fields = (
            'id',
            'parent',
            'children',
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

