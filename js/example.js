// Define a Contact model
var Contact = Backbone.Model.extend();

// Define a Contact view
var ContactView = Backbone.View.extend({
  tagName: 'div',
  initialize: function() {
    this.template = templates['contact_template'];
  },
  render: function() {
    $(this.el).append(this.template({contact: this.model}));
    return this;
  }
});

// Function to load templates from html
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

// Sample data (that would normally come from the server)
// If the result of a server operation has errors, the data will have an errors hash 
// that contains attribute names and corresponding error messages.
var ok_data = { name: 'Alice' }; // data with no errors
var err_data = { name: 'Bob', errors: { 'name': 'name is already taken' } }; // data with errors

$(document).ready(function() {
  
  // load the templates.
  load_templates();
  
  // Create contact views with json data
  var ok_view = new ContactView({model: new Contact(ok_data)});
  var err_view = new ContactView({model: new Contact(err_data)});
  
  // render both contacts
  $('#ok-contact-form').append(ok_view.render().el);
  $('#err-contact-form').append(err_view.render().el);

});

