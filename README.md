##Backbone Form Helper##

A library to render html form fields using backbone.js, similar to Rails form helpers.  
Given a Backbone model `contact`, form fields can be generated within underscore templates like this:  

        <% BackboneFormHelper.form(contact, function(f) { %>
                <!-- A label -->
                <td><%= f.label('first_name', 'First Name') %> </td>
                <!-- A textfield -->
                <td><%= f.text('first_name', {placeholder: 'First Name'}) %></td>
        <% } %>

Examples of usage are in the 'examples' folder.
The docs directory contains [docco](http://jashkenas.github.com/docco/) generated documentation for `backbone-form-helper.js`, (the file that you need to include to use the form helpers), and `data.js` (javascript for the examples).

