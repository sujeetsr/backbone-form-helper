// ###This file contains the backbone model and view used in the 
// example page.###

// A function to load templates from html. In a Rails application, 
// these would be in jst files that are made available in the front end
// in the JST variable.
// For this standalone app, they are defined in the html in a 
// `<script type="text/html">...</script>` tag.
var templates = {};
function load_templates() {
  // templates are underscore templates defined in script elements 
  // with type 'text/html'.
  scripts = document.getElementsByTagName('script');
  _.each(scripts, function(script) {
    if (script && script.innerHTML && script.id && 
      (script.type === "text/html" )) {
      // compile the template with underscore and store it.
      templates[script.id] = _.template(script.innerHTML);
    }
  })
}

// ###We now define a Backbone model and a view.###

// ####Contact model####
var Contact = Backbone.Model.extend({ });

// ####Contact view####
var ContactView = Backbone.View.extend({
  tagName: 'div',
  events: {
    'click #submit_contact_form': 'save'
  },

  initialize: function() {
    // Set the template for this view.  
    // The template is available in the `templates` variable. 
    // In a Rails application, it would be in the JST variable.
    this.template = templates['contact_template'];
  },
  render: function() {
    // render the template with the model passed in during view creation.
    $(this.el).empty();
    $(this.el).append(this.template({contact: this.model}));
    return this;
  },
  // empty save function.
  save: function(event) {
    event.preventDefault();
    console.log('save called');
  }

});

var Address = Backbone.Model.extend();

// ###Data###
// JSON that represents contact data (that would normally come from 
// the server).  
// If the result of a server operation has errors, 
// the data has an errors hash that contains attribute names and 
// corresponding error messages.
var contact_data = { 
  id: 1,
  first_name: 'John',
  last_name: 'Smith',
  email: 'jsmith@example.com',
  about: 'a description for this user account',
  is_admin: true,
  // errors hash that contains an error for the email field
  errors: { 
    'email': 'An account with this email address already exists',
  } 
}; 

var address_data = {
  street_1: '123 California Way',
  street_2: '',
  city: 'San Francisco',
  state: 'California',
  country: 'US',
  zip: '94111',
  errors: { 
    'street_2': 'Street 2 cannot be empty'
  } 
};

var countries = [
  {name: 'United States', value: 'US'},
  {name: 'Canada', value: 'CA'},
  {name: 'Mexico', value: 'MX'}
];

var contact_model = new Contact(contact_data);
var address_model = new Address(address_data);
// set address for the contact
contact_model.set({'address': address_model});


