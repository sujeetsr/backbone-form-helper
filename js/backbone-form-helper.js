(function() {
  var helper = {
    
    // Combine options into a string of the form 'key = value'
    get_opt_str: function(opts) {
      if (opts != undefined) {
        var opt_str = _.reduce(_.keys(opts), function(s, k) {
          return s + k + '="' + opts[k] + '" ';
        }, '');
        return opt_str;
      }
    },

    // Create value part of tag string
    get_val_str: function(model, field) {
      return 'value="' + model.escape(field) + '" ';
    },

    get_name_str: function(model, field, tag_name) {
      var name = (tag_name == 'label') ? field + '_label' : field;
      return 'name="' + name + '" ';
    },

    get_id_str: function(model, field, tag_name) {
      var id = (tag_name == 'label') ? field + '_label' : field;
      return 'id="' + id + '" ';
    },

    // wrap tag in field-with-error span if errors present
    wrap_errors: function(model, field, tag, tag_name) {
      if (model.get('errors') != undefined && model.get('errors')[field] != undefined) {
        if (tag_name != 'label') {
          // if not label tag, show error message
          return '<span class="field-with-error">' + tag + '&nbsp;<span class="field-error-message">' + model.get('errors')[field] + '</span></span>'; 
        } else {
          return '<span class="field-with-error">' + tag + '</span>'; 
        }
      } else {
        return tag;
      }
    },

    tag: function(tag_name, model, field, opts, prefix, tag_open, body_str, tag_end) {
      var tag_obj = {};
      tag_obj.tag_string = function() {
        opts = _.isUndefined(opts) ? {} : opts;
        var val_str = ( tag_name == 'textarea') ? '' : helper.get_val_str(model, field);
        var opts_str = helper.get_opt_str(opts);
        var id_str = helper.get_id_str(model, field, tag_name);
        var name_str = helper.get_name_str(model, field, tag_name);
        var tag = tag_open + val_str + name_str + id_str + opts_str + '>' + body_str + tag_end;
        return helper.wrap_errors(model, field, tag, tag_name);
      };
      return tag_obj;
    },

    // input type="text"
    text: function(model, field, opts, prefix) {
      var tag_open = '<input type="text" ';
      var body_str = '';
      var tag_end = '';
      return helper.tag('text', model, field, opts, prefix, tag_open, body_str, tag_end).tag_string();
    },

    //input type="date"
    date: function(model, field, opts, prefix) {
      var tag_open = '<input type="date" ';
      var body_str = '';
      var tag_end = '';
      return helper.tag('date', model, field, opts, prefix, tag_open, body_str, tag_end).tag_string();
    },

    // label
    label: function(model, field, label_text, opts, prefix) {
      var tag_open = '<label for="' + field +  '" ';
      var body_str = label_text;
      var tag_end = '</label>';
      return helper.tag('label', model, field, opts, prefix, tag_open, body_str, tag_end).tag_string();
    },

    // textarea
    textarea: function(model, field, text, opts, prefix) {
      opts = _.isUndefined(opts) ? {} : opts;
      var tag_open = '<textarea ';
      var body_str = model.escape(field);
      var tag_end = '</textarea>';
      return helper.tag('textarea', model, field, opts, prefix, tag_open, body_str, tag_end).tag_string();
    },

    // input type="hidden"
    hidden: function(model, field, opts, prefix) {
      var tag_open = '<input type="hidden" ';
      var body_str = '';
      var tag_end = '';
      return helper.tag('hidden', model, field, opts, prefix, tag_open, body_str, tag_end).tag_string();
    },

    // input type="password"
    password: function(model, field, opts, prefix) {
      var tag_open = '<input type="password" ';
      var body_str = '';
      var tag_end = '';
      return helper.tag('password', model, field, opts, prefix, tag_open, body_str, tag_end).tag_string();
    },

    // input type="checkbox"
    checkbox: function(model, field, opts, prefix) {
      var tag_open = '<input type="checkbox" ';
      var checked = '';
      if (model.get(field) == true) {
        checked = 'checked="true" ';
      }
      tag_open += checked;
      var body_str = '';
      var tag_end = '';
      return helper.tag('checkbox', model, field, opts, prefix, tag_open, body_str, tag_end).tag_string();
    },

    // options for select tag
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

    // select tag
    select: function(model, field, options_array, opts, prefix) {
      tag = '<select name="' + field + '"> ';
      _.each(options_array, function(o) {
        tag += '<option value="' + o.value + '" ';
        if (model.get(field) == o.value) {
          tag += 'selected = "selected"';
        }
        tag += '>' + o.name + '</option>';
      })
      tag += '</select>';
      return tag;
    },
  
    // radio
    radio: function(model, field, options_array, opts, prefix) {
      tag = '';
      _.each(options_array, function(o, index) {
        checked = (model.get(field) == o.value) ? 'checked ' : ' ';
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
    }

  };
  this.BackboneFormHelper = helper;
})();

