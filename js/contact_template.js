tmpl = '<% BackboneFormHelper.form(contact, function(f) { %>' +
  '<%= f.label(\'name\', \'Contact Name\') %>' +
  ': ' +
  '<%= f.text(\'name\', {placeholder: \'Contact Name\'}) %>' +
  '<% }) %>';
var contact_template = _.template(tmpl);

