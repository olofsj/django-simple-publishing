/*
 * An Ember.js application for editing pages in Django simple publising.
 */

// Application namespace
var App = Ember.Application.create({
  ready: function() {
    // Make it possible to bind to App.currentTime
    setInterval( function() {
      App.set('currentTime', new Date());
    }, 60*1000);

    // Make it possible to bind to App.windowSize
    var $window = this.$(window);
    $window.on('resize.diaryapp', function() {
      App.set('windowSize', [$window.width(), $window.height()]);
    });
  },
  typeChoices: PUBLISHING_PAGE_TYPE_CHOICES,
  statusChoices: PUBLISHING_STATUS_CHOICES
});

// Markdown handlebar helper
App.showdown = new Showdown.converter();
Ember.Handlebars.helper('markdown', function(value, options) {
  if (value) {
    return new Ember.Handlebars.SafeString(App.showdown.makeHtml(value));
  }
});

// Helper function for creating slugs
App.slugify = function(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "åãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to   = "aaaaaaeeeeeiiiiooooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
};

// Ember-data store using the Django Tastypie adapter
App.ApplicationAdapter = DS.DjangoRESTAdapter.extend({
  namespace: PUBLISHING_API_URL.replace(/(^\/|\/$)/g, '')
});

// ISO date format for serializing dates
DS.IsodateTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    if (serialized) {
      return moment(serialized).toDate();
    } else {
      return null;
    }
  },
  serialize: function(deserialized) {
    if (deserialized) {
      return moment.utc(deserialized).format("YYYY-MM-DDTHH:mm:ssZ");
    } else {
      return null;
    }
  }
});
App.register('transform:isodate', DS.IsodateTransform);

// Models
App.User = DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),

  fullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName')
});

App.Page = DS.Model.extend({
  title: DS.attr('string'),
  slug: DS.attr('string'),
  url: DS.attr('string'),
  content: DS.attr('string'),
  summary: DS.attr('string'),
  status: DS.attr('string'),
  type: DS.attr('string'),
  publish_date: DS.attr('isodate'),
  created: DS.attr('isodate'),
  modified: DS.attr('isodate'),
  author: DS.belongsTo('user'),
  parent: DS.belongsTo('page', {inverse: 'children'}),
  children: DS.hasMany('page', {inverse: 'parent'}),

  absoluteUrl: function() {
    return PUBLISHING_ROOT.replace(/\/$/, '') + this.get('url');
  }.property('url'),

  titleChanged: function() {
    var status = this.get('status');
    var id = this.get('id');

    // Auto-update the slug for drafts
    if (!id || status == 'd') {
      this.set('slug', App.slugify(this.get('title')));
    }
  }.observes('title'),

  isClean: function() {
    return !this.get('isDirty');
  }.property('isDirty'),

  isPublished: function() {
    var status = this.get('status');
    var publish_date = this.get('publish_date');
    var now = new Date();
    return status == 'p' && publish_date < now;
  }.property('status', 'publish_date', 'currenttime'),

  dontDelete: function() {
    // Stop published and saved pages from being deleted
    var id = this.get('id');
    var status = this.get('status');
    return (status == 'p' && !!id);
  }.property('status', 'id'),

  statusDisplay: function() {
    var status = this.get('status');
    var publish_date = this.get('publish_date');
    var now = new Date();
    if (status == 'd') {
      return new Ember.Handlebars.SafeString('<span class="text-warning">Draft</span>');
    } else if (status == 'p') {
      if (!publish_date) {
        return 'To be published';
      } else if (publish_date < now) {
        return 'Published ' + moment(publish_date).calendar();
      } else {
        return 'Scheduled for ' + moment(publish_date).calendar();
      }
    } else {
      return new Ember.Handlebars.SafeString('<span class="text-warning">Withdrawn</span>');
    }
  }.property('status', 'publish_date', 'currenttime')
});

// Router
App.Router.map(function() {
  this.resource('pages', function() {
    this.resource('parent', { path: ':parent_id' }, function() {
      this.resource('page', { path: 'page/:page_id' }, function() {
        this.resource('page.settings', { path: 'settings' });
      });
    });
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('pages.index');
  }
});

App.PagesRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('page');
  },
  renderTemplate: function() {
    this.render('pages.list', {
      into: 'application',
      outlet: 'sidebar',
      controller: this.controller
    });
  },
  actions: {
    add: function() {
      var parent = this.controllerFor('pages').get('parent');
      var page = this.get('store').createRecord('page', {
        parent: parent, status: 'd', content: '', summary: '', type: 'detail'
      });
      this.transitionTo('page', page);
    }
  }
});

App.PagesIndexRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('page', { parent: null});
  },
  afterModel: function(model, transition) {
    var page = model.objectAt(0);
    if (!page) {
      page = this.get('store').createRecord('page', {
        parent: null, status: 'd', content: '', summary: '', type: 'detail'
      });
    }
    this.transitionTo('parent', page);
  }
});

App.ParentRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('page', params.parent_id);
  },
  setupController: function(controller, parent) {
    controller.set('model', parent);
    this.controllerFor('pages').set('parent', parent);
    this.controllerFor('pages').set('model', parent.get('children'));
  }
});

App.PageRoute = Ember.Route.extend({
  serialize: function(model) {
    return { parent_id: model.get('parent.id') || model.get('id'), page_id: model.get('id') };
  },
  setupController: function(controller, model) {
    controller.set('model', model);
    this.controllerFor('pages').set('currentPage', model);
  },
  actions: {
    remove: function() {
      var page = this.modelFor('page');
      if (!!page) {
        var parent = page.get('parent');
        page.deleteRecord();
        if (page.get('id')) {
          page.save();
        }
        this.transitionTo('parent', parent);
      }
    },
    revert: function() {
      var page = this.modelFor('page');
      if (!!page && page.get('isDirty')) {
        page.rollback();
      }
    },
    save: function() {
      var page = this.modelFor('page');
      if (!!page && page.get('isDirty')) {
        var route = this;
        page.save().then(function(result) {
          route.transitionTo('page', result);
        });
      }
    }
  }
});

App.PageIndexRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('pages.detail', {
      into: 'application',
      outlet: 'main',
      controller: 'page'
    });
  }
});

App.PageSettingsRoute = Ember.Route.extend({
  serialize: function(model) {
    return { parent_id: model.get('parent.id') || model.get('id'), page_id: model.get('id') };
  },
  setupController: function(controller, model) {
    controller.set('model', this.controllerFor('page').get('model'));
  },
  renderTemplate: function() {
    this.render('pages.settings', {
      into: 'application',
      outlet: 'main',
      controller: 'page'
    });
  },
  actions: {
    save: function() {
      var page = this.modelFor('page');
      if (!!page && page.get('isDirty')) {
        var route = this;
        page.save().then(function(result) {
          route.transitionTo('page.settings', result);
        });
      }
    }
  }
});

App.DateInput = Ember.TextField.extend({
  setDate: function() {
    var value = this.get('value');
    var m = moment(value);
    var date = this.get('date');
    var current = '';
    if (!!date) {
      current = moment(date).format("YYYY-MM-DD HH:mm");
    }
    if (m.isValid() && value != current) {
      this.set('date', m.toDate());
    }
  }.observes('value'),

  value: function() {
    var date = this.get('date');
    if (!!date) {
      return moment(date).format("YYYY-MM-DD HH:mm");
    } else {
      return '';
    }
  }.property('date')
});

App.PagesController = Ember.ArrayController.extend({
  sortProperties: ['publish_date'],
  sortAscending: false
});
