var ContactView = Backbone.View.extend({
  tagName: 'div',
  initialize: function() {
    this.template = contact_template;
  },
  render: function() {
    $(this.el).append(this.template({contact: this.model}));
    return this;
  }
});


