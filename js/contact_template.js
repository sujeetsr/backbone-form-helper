tmpl = '<% BackboneFormHelper.form(contact, function(form) { %>' +
  '<%= form.label(\'name\', \'Contact Name\') %>' +
  ': ' +
  '<%= form.text(\'name\', {placeholder: \'Contact Name\'}) %>' +
  '<% }) %>';
var contact_template = _.template(tmpl);

