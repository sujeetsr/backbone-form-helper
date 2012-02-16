##Backbone Form Helper##

A library to render html form fields using backbone, similar to Rails form helpers.  
Given a Backbone model `contact`, form fields can be generated within underscore templates like this:  

        <% BackboneFormHelper.form(contact, function(f) { %>
                <!-- A label -->
                <td><%= f.label('first_name', 'First Name') %> </td>
                <!-- A textfield -->
                <td><%= f.text('first_name', {placeholder: 'First Name'}) %></td>
        <% } %>

To see an example, git clone git://github.com/sujeetsr/backbone-form-helper.git, and open `example.html` in a browser. View the source to see usage for various types of input fields.  
The docs directory contains [docco](http://jashkenas.github.com/docco/) generated documentation for `backbone-form-helper.js`, (the file that you need to include to use the form helpers), and `page.js` (javascript for the example page).

