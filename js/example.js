
// Create contact views with json data

// data would normally come from the server
// If the result of a server operation has errors, the data will have an errors hash 
// that contains attribute names and corresponding error messages.
var ok_data = { name: 'Alice' }; // data with no errors
var err_data = { name: 'Bob', errors: { 'name': 'name is already taken' } }; // data with errors

var ok_view = new ContactView({model: new Contact(ok_data)});
var err_view = new ContactView({model: new Contact(err_data)});

$(document).ready(function() {
  // render both contacts
  $('#ok-contact-form').append(ok_view.render().el);
  $('#err-contact-form').append(err_view.render().el);
});

