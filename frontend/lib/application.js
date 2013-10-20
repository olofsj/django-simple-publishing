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
  parent: DS.belongsTo('page'),

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
      return 'Draft';
    } else if (status == 'p') {
      if (publish_date < now) {
        return 'Published ' + moment(publish_date).fromNow();
      } else {
        return 'Scheduled for ' + moment(publish_date).format('MMMM Do');
      }
    } else {
      return 'Withdrawn';
    }

  }.property('isPublished')
});

// Router
App.Router.map(function() {
  this.resource('pages', function() {
    this.resource('page', { path: ':page_id' });
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
  }
});

App.PagesIndexRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('pages');
  },
  renderTemplate: function() {
    this.render('pages.index', {
      into: 'application',
      outlet: 'main',
      controller: 'pages'
    });
  }
});

App.PageRoute = Ember.Route.extend({
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
    save: function() {
      var page = this.modelFor('page');
      if (!!page && page.get('isDirty')) {
        page.save();
      }
    }
  }

});

