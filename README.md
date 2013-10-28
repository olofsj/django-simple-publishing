# django-simple-publishing

A simple publishing app for Django that is easy to integrate when you need
some editable pages for your Django-driven site.
It features a custom editor that makes it easy to focus on the content when
writing.

Let's say you have a nice website built with Django.
But then you realize you want some static pages to complement your main application, say a
blog, maybe a nice start page, an about page and perhaps some help pages.
Just add django-simple-publishing, set up some templates and start writing!

The goal for django-simple-publishing is to be easy to integrate into other
projects, to be simple to use and to play nicely with your other apps.


## Features

- Custom editor for writing your content based on Ember.js featuring
    - Markdown for formatting content
    - Real-time preview of the generated content
    - Easy creation of multiple levels of pages, eg. /help/, /help/topic/, /help/topic/answer/
- Uses Django templates to render your pages
- Different types of pages that can use different templates (can be defined in your settings)
- Can be used for the root of your site or only a part, eg. /blog/


## Planned featues

Here's some stuff that's planned, but not done yet:

- Uploading images and adding them to your pages.
- Optional offline generation (like [Jekyll](http://jekyllrb.com/)) that
  pre-generates the whole site and saves it in eg. Redis or the database.
- Tagging support


## Installation and usage

pip can install directly from Github:

    pip install -e git+git://github.com/olofsj/django-simple-publishing.git#egg=django-simple-publishing

Add to `installed_apps` in `settings.py`:

    installed_apps = [
        ...
        'publishing',
    ]

If you want to use it to serve your site root add the following to your url config in `urls.py`:

    urlpatterns = patterns('',
        ...

        # Simple publishing (should be last)
        url(r'^', include('publishing.urls')),
    )

If you only want to use it to only serve eg. /blog/ add the following to your url config in `urls.py`:

    urlpatterns = patterns('',
        ...

        # Simple publishing
        url(r'^blog/', include('publishing.urls')),
    )

Run `python manage.py migrate` and you should be done!
You can now access the editor at /publishing/, or /blog/publishing/ if you used the second alternative.

## Dependencies

Python requirements:

- [markdown](https://pypi.python.org/pypi/Markdown)
- [django-rest-framework](https://github.com/tomchristie/django-rest-framework)

The editor is built using the following Javascript libraries:

- [Ember.js](https://github.com/emberjs/ember.js/)
- [Ember Data](https://github.com/emberjs/data)
- [ember-data-django-rest-adapter](https://github.com/toranb/ember-data-django-rest-adapter/commits/ember1.0)
- [Showdown](https://github.com/coreyti/showdown) for Markdown preview
- [Moment.js](http://momentjs.com/)
- [Twitter Bootstrap](http://getbootstrap.com/)

A pre-built version of the editor Javascript and CSS is bundled with the app and
is ready to use when installed. If you want to modify the editor or it's CSS there is a
Gruntfile for building the finished files.
