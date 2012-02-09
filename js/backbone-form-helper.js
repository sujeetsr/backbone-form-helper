(function() {
  var helper = {
    

    // A function that calls its second argument (`form_body_fn`), 
    // with an object that has current context (including current model)
    // The tag functions will be called on this object.
    form: function(model, form_body_fn) {
      // Use a blank model if the passed in one is null.
      if (_.isUndefined(model) || _.isNull(model)) {
        model = new Backbone.Model();
      }

      // Create an object with the model and helper functions, which will
      // be the `this` reference within the tag functions. 
      var form_obj = {
        model: model,
        get_opt_str: helper.get_opt_str,
        get_val_str: helper.get_val_str,
        get_id_str: helper.get_id_str,
        get_name_str: helper.get_name_str,
        wrap_errors: helper.wrap_errors,
        tag: helper.tag,
        text: helper.text,
        label: helper.label,
        date: helper.date,
        textarea: helper.textarea,
        hidden: helper.hidden,
        password: helper.password,
        checkbox: helper.checkbox,
        generate_options_array: helper.generate_options_array,
        select: helper.select,
        radio: helper.radio,
      };

      // Call the function passing in the above object.
      form_body_fn(form_obj);
    },


    // ##Functions that are used to render HTML tags##
   
    // input type="text"
    text: function(field, opts) {
      var tag_open = '<input type="text" ';
      var body_str = '';
      var tag_end = '';
      return this.tag('text', field, opts, tag_open, body_str, tag_end);
    },

    // input type="date"
    date: function(field, opts) {
      var tag_open = '<input type="date" ';
      var body_str = '';
      var tag_end = '';
      return this.tag('date', field, opts, tag_open, body_str, tag_end).tag_string();
    },

    // label
    label: function(field, label_text, opts) {
      var tag_open = '<label for="' + field +  '" ';
      var body_str = label_text;
      var tag_end = '</label>';
      return this.tag('label', field, opts, tag_open, body_str, tag_end);
    },

    // textarea
    textarea: function(field, text, opts) {
      opts = _.isUndefined(opts) ? {} : opts;
      var tag_open = '<textarea ';
      var body_str = this.model.escape(field);
      var tag_end = '</textarea>';
      return this.tag('textarea', field, opts, tag_open, body_str, tag_end);
    },

    // input type="hidden"
    hidden: function(field, opts) {
      var tag_open = '<input type="hidden" ';
      var body_str = '';
      var tag_end = '';
      return this.tag('hidden', field, opts, tag_open, body_str, tag_end);
    },

    // input type="password"
    password: function(field, opts) {
      var tag_open = '<input type="password" ';
      var body_str = '';
      var tag_end = '';
      return this.tag('password', field, opts, tag_open, body_str, tag_end).tag_string();
    },

    // input type="checkbox"
    checkbox: function(field, opts) {
      var tag_open = '<input type="checkbox" ';
      var checked = '';
      if (this.model.get(field) == true) {
        checked = 'checked="true" ';
      }
      tag_open += checked;
      var body_str = '';
      var tag_end = '';
      return this.tag('checkbox', field, opts, tag_open, body_str, tag_end);
    },

    // A function that is called from the above functions to combine parts of the tag and 
    // produce the tag. 
    tag: function(tag_name, field, opts, tag_open, body_str, tag_end) {
      opts = _.isUndefined(opts) ? {} : opts;
      // get the value, name, id, and options parts of the tag
      var val_str = this.get_val_str(this.model, field, tag_name, opts);
      var id_str = this.get_id_str(this.model, field, tag_name, opts);
      var name_str = this.get_name_str(this.model, field, tag_name, opts);
      var opts_str = this.get_opt_str(opts);
      // combine the tag open and end with the above parts to create the tag.
      var tag_str = tag_open + val_str + name_str + id_str + opts_str + '>' + body_str + tag_end;
      // pass the tag to `wrap_errors` that adds error span if the errors hash contains
      // an error for this field.
      return this.wrap_errors(this.model, field, tag_str, tag_name);
    },


    // select tag
    select: function(field, options_array, opts) {
      tag = '<select name="' + field + '"> ';
      _.each(options_array, function(o) {
        tag += '<option value="' + o.value + '" ';
        if (this.model.get(field) == o.value) {
          tag += 'selected = "selected"';
        }
        tag += '>' + o.name + '</option>';
      })
      tag += '</select>';
      return tag;
    },
  
    // radio
    radio: function(field, options_array, opts) {
      tag = '';
      _.each(options_array, function(o, index) {
        checked = (this.model.get(field) == o.value) ? 'checked ' : ' ';
        input_style='style = "display: inline" ';
        label_style='style = "display: inline" ';
        id = 'id = "' + field + '_' + index + '" ';
        type = 'type = "radio" ';
        input_name = 'name = "' + field + '" ';
        value = 'value = "' + o.value + '" ';
        tag += '<input ' + checked + input_style + id + type + input_name + value + '>';
        tag += '<label ' + label_style + '>' + o.name + '</label>';
        tag += '&nbsp;&nbsp;';
      });
      return tag;
    },
   
    // ## Utility functions ##
    
    // function that generates an array of option hashes.
    // each hash has name and value keys.
    generate_options_array: function(collection, name_attr, value_attr, include_none) {
      options = [];
      if (!_.isUndefined(include_none) && include_none == true) {
        options.push({name: '(none)', value: ""});
      }
      collection.each(function(o) {
        options.push({name: o.escape(name_attr), value: o.escape(value_attr)});
      });
      return options;
    },

    // Combine options into a string of the form 'key = value'
    get_opt_str: function(opts) {
      if (opts != undefined) {
        var opt_str = _.reduce(_.keys(opts), function(s, k) {
          return s + k + '="' + opts[k] + '" ';
        }, '');
        return opt_str;
      }
    },

    // Create value part of tag string (value = "<value>")
    get_val_str: function(model, field, tag_name, opts) {
      value = ""
      if (_.include(_.keys(opts), 'value')) {
        value = opts['value'];
        delete opts['value'];
      } else {
        if (tag_name != 'textarea') {
          value = model.escape(field);
        }
      }
      return 'value="' + value + '" ';
    },

    get_name_str: function(model, field, tag_name, opts) {
      var name = "";
      if (_.include(_.keys(opts), 'name')) {
        name = opts['name'];
        delete opts['name'];
      } else {
        name = (tag_name == 'label') ? field + '_label' : field;
      }
      return 'name="' + name + '" ';
    },

    get_id_str: function(model, field, tag_name, opts) {
      var id = "";
      if (_.include(_.keys(opts), 'id')) {
        id = opts['id'];
        delete opts['id'];
      } else {
        id = (tag_name == 'label') ? field + '_label' : field;
      }
      return 'id="' + id + '" ';
    },

    // wrap tag in field-with-error span if errors present
    wrap_errors: function(model, field, tag_str, tag_name) {
      if (model.get('errors') != undefined && model.get('errors')[field] != undefined) {
        var e = model.get('errors');
        var x = e[field];
        if (tag_name != 'label') {
          // if not label tag, show error message
          return '<span class="field-with-error">' + tag_str + '&nbsp;<span class="field-error-message">' + model.get('errors')[field] + '</span></span>'; 
        } else {
          return '<span class="field-with-error">' + tag_str + '</span>'; 
        }
      } else {
        return tag_str;
      }
    },

  };
  this.BackboneFormHelper = helper;
})();

