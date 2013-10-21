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
  }
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
  namespace: 'publishing/api'
});

// ISO date format for serializing dates
DS.IsodateTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    return moment(serialized).toDate();
  },
  serialize: function(deserialized) {
    return moment.utc(deserialized).format("YYYY-MM-DDTHH:mm:ssZ");
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
  publish_date: DS.attr('isodate'),
  created: DS.attr('isodate'),
  modified: DS.attr('isodate'),
  author: DS.belongsTo('user'),
  parent: DS.belongsTo('page', {inverse: 'children'}),
  children: DS.hasMany('page', {inverse: 'parent'}),

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

  statusDisplay: function() {
    var status = this.get('status');
    var publish_date = this.get('publish_date');
    var now = new Date();
    if (status == 'd') {
      return new Ember.Handlebars.SafeString('<span class="text-warning">Draft</span>');
    } else if (status == 'p') {
      if (publish_date < now) {
        return 'Published ' + moment(publish_date).calendar();
      } else {
        return 'Scheduled for ' + moment(publish_date).calendar();
      }
    } else {
      return new Ember.Handlebars.SafeString('<span class="text-warning">Withdrawn</span>');
    }

  }.property('isPublished')
});

// Router
App.Router.map(function() {
  this.resource('pages', function() {
    this.resource('parent', { path: ':parent_id' }, function() {
      this.resource('page', { path: 'page/:page_id' });
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
        parent: parent, status: 'd', content: '', summary: ''
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
    this.transitionTo('parent', model.objectAt(0));
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
    return { parent_id: model.get('parent.id'), page_id: model.get('id') };
  },
  setupController: function(controller, model) {
    controller.set('model', model);
    this.controllerFor('pages').set('currentPage', model);
  },
  renderTemplate: function() {
    this.render('pages.detail', {
      into: 'application',
      outlet: 'main',
      controller: 'page'
    });
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

