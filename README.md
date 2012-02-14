##Backbone Form Helper##

A library to render html form fields using backbone, similar to Rails form helpers.  
Given a Backbone model `contact`, form fields can be generated within underscore templates like this:  

        <% BackboneFormHelper.form(contact, function(f) { %>
                <!-- A label -->
                <td><%= f.label('first_name', 'First Name') %> </td>
                <!-- A textfield -->
                <td><%= f.text('first_name', {placeholder: 'First Name'}) %></td>
        <% } %>


