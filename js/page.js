// ###This file contains the backbone model and view used in the example page.###

// A function to load templates from html. In a Rails application, these would be 
// in jst files that are made available in the front end in the JST variable.
// For this standalone app, they are defined in the html in a 
// `<script type="text/html">...</script>` tag.
var templates = {};
function load_templates() {
  // templates are underscore templates defined in script elements with type 'text/html'.
  scripts = document.getElementsByTagName('script');
  _.each(scripts, function(script) {
    if (script && script.innerHTML && script.id && (script.type === "text/html" )) {
      // compile the template with underscore and store it.
      templates[script.id] = _.template(script.innerHTML);
    }
  })
}

// ###We now define a Backbone model and a view.###

// ####Contact model####
var Contact = Backbone.Model.extend();

// ####Contact view####
var ContactView = Backbone.View.extend({
  tagName: 'div',
  initialize: function() {
    // Set the template for this view.  
    // The template is available in the `templates` variable. In a Rails application,
    // it would be in the JST variable.
    this.template = templates['contact_template'];
  },
  render: function() {
    // render the template with the model passed in during view creation.
    $(this.el).append(this.template({contact: this.model}));
    return this;
  }
});

// ###Data###
// JSON that represents contact data (that would normally come from the server).  
// If the result of a server operation has errors, the data has an errors hash 
// that contains attribute names and corresponding error messages.
var data = { 
  id: 1,
  first_name: 'John',
  last_name: 'Smith',
  email: 'jsmith@example.com',
  about: 'a description for this user account',
  street_1: '123 California Way',
  street_2: 'Apt 456',
  city: 'San Francisco',
  state: 'California',
  zip: '94111',
  is_admin: true,
  // errors hash that contains an error for the email field
  errors: { 'email': 'An account with this email address already exists' } 
}; 

// ###Render the view###
// On document load, render the view.
$(document).ready(function() {
  
  // load the templates.
  load_templates();
 
  // Create contact views with json data
  var view = new ContactView({model: new Contact(data)});
  
  // render the contact
  $('#contact-form').append(view.render().el);

});

