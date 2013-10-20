Ember.TEMPLATES['application'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n  <div class=\"navbar-header\">\n    <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-ex1-collapse\">\n      <span class=\"sr-only\">Toggle navigation</span>\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n    </button>\n    <a class=\"navbar-brand\" href=\"#\">Simple Publishing</a>\n  </div>\n  <div class=\"collapse navbar-collapse navbar-ex1-collapse\">\n    ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "navbar", options) : helperMissing.call(depth0, "outlet", "navbar", options))));
  data.buffer.push("\n  </div>\n</div>\n\n<div class=\"sidebar\">\n  ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "sidebar", options) : helperMissing.call(depth0, "outlet", "sidebar", options))));
  data.buffer.push("\n</div>\n<div class=\"main\">\n  ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "main", options) : helperMissing.call(depth0, "outlet", "main", options))));
  data.buffer.push("\n</div>\n\n");
  return buffer;
  
});Ember.TEMPLATES['pages/detail'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n  <div class=\"main-header\">\n    <h4 class=\"area-heading\">Title</h4>\n    <div class=\"area-content\">\n      ");
  hashContexts = {'value': depth0,'placeholder': depth0,'classNames': depth0};
  hashTypes = {'value': "ID",'placeholder': "STRING",'classNames': "STRING"};
  options = {hash:{
    'value': ("page.title"),
    'placeholder': ("A nice title goes here..."),
    'classNames': ("form-control")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n    </div>\n  </div>\n  <div class=\"main-left\">\n    <h4 class=\"area-heading\">\n      Edit\n      <a href=\"http://daringfireball.net/projects/markdown/syntax\" target=\"_blank\" class=\"pull-right\"><i class=\"icon-question-sign\"></i></a>\n    </h4>\n    <div class=\"area-content\">\n      ");
  hashContexts = {'value': depth0,'placeholder': depth0,'classNames': depth0};
  hashTypes = {'value': "ID",'placeholder': "STRING",'classNames': "STRING"};
  options = {hash:{
    'value': ("page.content"),
    'placeholder': ("Here's where you write something..."),
    'classNames': ("form-control")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.textarea || depth0.textarea),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
  data.buffer.push("\n    </div>\n  </div>\n  <div class=\"main-right\">\n    <h4 class=\"area-heading\">\n      Preview\n      ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "page.url", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    </h4>\n    <div class=\"area-content\">\n      <div class=\"preview\">\n        ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.markdown || depth0.markdown),stack1 ? stack1.call(depth0, "page.content", options) : helperMissing.call(depth0, "markdown", "page.content", options))));
  data.buffer.push("\n      </div>\n    </div>\n  </div>\n  <div class=\"main-footer\">\n    <button class=\"btn btn-success btn-sm pull-right\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" ");
  hashContexts = {'disabled': depth0};
  hashTypes = {'disabled': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'disabled': ("page.isClean")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Save</button>\n  </div>\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n      <a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'href': ("page.url")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" target=\"_blank\" class=\"pull-right\"><i class=\"icon-external-link-sign\"></i></a>\n      ");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['with'].call(depth0, "content", "as", "page", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});Ember.TEMPLATES['pages/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<h2>Choose a page to edit in the list on the right.</h2>\n");
  
});Ember.TEMPLATES['pages/list'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n      ");
  hashContexts = {'classNames': depth0};
  hashTypes = {'classNames': "STRING"};
  options = {hash:{
    'classNames': ("list-group-item")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "page", "page", options) : helperMissing.call(depth0, "linkTo", "page", "page", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n        <h4 class=\"list-group-item-heading\">\n          ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "page.title", {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </h4>\n        <p class=\"list-group-item-text text-muted\">\n          ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "page.statusDisplay", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n          ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "page.isDirty", {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </p>\n      ");
  return buffer;
  }
function program3(depth0,data) {
  
  var hashTypes, hashContexts;
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "page.title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  }

function program5(depth0,data) {
  
  
  data.buffer.push("New Page");
  }

function program7(depth0,data) {
  
  
  data.buffer.push("<span class=\"label label-danger pull-right\">Not Saved</span>");
  }

  data.buffer.push("<h4 class=\"area-heading\">\n  Pages\n  <a class=\"pull-right\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "add", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("><i class=\"icon-plus-sign\"></i></a>\n</h4>\n<div class=\"area-content\">\n  <div class=\"list-group\">\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "page", "in", "controller", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </div>\n</div>\n");
  return buffer;
  
});