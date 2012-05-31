(function() {
  var helper = {
    
    init: function(opts) {
      this.error_position = opts['error_position'];
      this.error_fn_top = opts['error_fn_top'];
      this.error_field_class = opts['error_field_class'];
    },

    // The `form` function calls its second argument (`form_body_fn`), 
    // with an object that contains the model.
    // The tag functions will be called on this object.
    form: function(model, form_body_fn) {
      
      // Use a blank model if the one passed in is null.
      if (_.isUndefined(model) || _.isNull(model)) {
        model = new Backbone.Model();
      }

      // Create an object with the model and the helper functions, 
      // The tag functions are called on this object.
      // This object is the `this` reference within the tag functions. 
      var form_obj = {
        model: model,
        
        // ##Functions that are used to render HTML tags##
        
        // form begin
        begin: function(opts) {
          return '<form name="' + opts['name'] + 
            '" id="' + opts['id'] + '">';
        },
       
       // form end
        end: function(opts) {
          return '</form>';
        },
        
        // input type="text"
        text: function(field, opts) {
          var tag_open = '<input type="text" ';
          var body_str = '';
          var tag_end = '';
          return this.tag('text', field, opts, tag_open, 
          body_str, tag_end);
        },

        // input type="date"
        date: function(field, opts) {
          var tag_open = '<input type="date" ';
          var body_str = '';
          var tag_end = '';
          return this.tag('date', field, opts, tag_open, 
          body_str, tag_end);
        },

        // label
        label: function(field, label_text, opts) {
          var tag_open = '<label for="' + field +  '" ';
          var body_str = label_text;
          var tag_end = '</label>';
          return this.tag('label', field, opts, tag_open, 
          body_str, tag_end);
        },

        // textarea
        textarea: function(field, text, opts) {
          opts = _.isUndefined(opts) ? {} : opts;
          var tag_open = '<textarea ';
          var body_str = this.model.escape(field);
          var tag_end = '</textarea>';
          return this.tag('textarea', field, opts, tag_open, 
          body_str, tag_end);
        },

        // input type="hidden"
        hidden: function(field, opts) {
          var tag_open = '<input type="hidden" ';
          var body_str = '';
          var tag_end = '';
          return this.tag('hidden', field, opts, tag_open, 
          body_str, tag_end);
        },
        
        // input type="password"
        password: function(field, opts) {
          var tag_open = '<input type="password" ';
          var body_str = '';
          var tag_end = '';
          return this.tag('password', field, opts, tag_open, 
          body_str, tag_end);
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
          return this.tag('checkbox', field, opts, tag_open, 
          body_str, tag_end);
        },

        // Generic tag function to generate tag id, value, name, 
        // and options. 
        tag: function(tag_name, field, opts, tag_open, 
        body_str, tag_end) {
          opts = _.isUndefined(opts) ? {} : opts;
          // get the value, name, id, and options parts of the tag
          var val_str = this.get_val_str(this.model, field, tag_name, 
          opts);
          var id_str = this.get_id_str(this.model, field, tag_name, 
          opts);
          var name_str = this.get_name_str(this.model, field, tag_name, 
          opts);
          var opts_str = this.get_opt_str(opts);
          // combine the tag open and end with the above parts 
          // to create the tag.
          var tag_str = tag_open + val_str + name_str + id_str + 
            opts_str + '>' + body_str + tag_end;
          // pass the tag to `wrap_errors` that adds error span if 
          // the errors hash contains an error for this field.
          return this.wrap_errors(this.model, field, tag_str, tag_name);
        },

        // select tag
        select: function(field, options_array, opts) {
          tag = '<select name="' + field + '"> ';
          var _this = this;
          _.each(options_array, function(o) {
            tag += '<option value="' + o.value + '" ';
            if (_this.model.get(field) == o.value) {
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
            checked = (this.model.get(field) == o.value) ? 
            'checked ' : ' ';
            input_style='style = "display: inline" ';
            label_style='style = "display: inline" ';
            id = 'id = "' + field + '_' + index + '" ';
            type = 'type = "radio" ';
            input_name = 'name = "' + field + '" ';
            value = 'value = "' + o.value + '" ';
            tag += '<input ' + checked + input_style + id + 
            type + input_name + value + '>';
            tag += '<label ' + label_style + '>' + o.name + '</label>';
            tag += '&nbsp;&nbsp;';
          });
          return tag;
        },

        // ## Utility functions ##

        // A function that generates an array of option hashes.
        // Each hash has name and value keys, whose values are 
        // obtained from the `name_attr` and `value_attr` attributes 
        // of each model of the input `collection`.
        // `include_none` is a boolean attribute that if true, 
        // generates a `none` option for the option array. 
        // The name for the `none` option is taken from `opts.none` 
        // if present, and is "(none)" otherwise
        generate_options_array: function(collection, name_attr, 
        value_attr, include_none, opts) {
          options = [];

          if (!_.isUndefined(include_none) && include_none == true) {
            none_opt = opts.none;
            if (!_.isUndefined(none_opt) && !_.isNull(none_opt)) {
              options.push({name: none_opt, value: ''});
            } else {
              options.push({name: '(none)', value: ""});
            }
          }
          collection.each(function(o) {
            options.push({name: o.escape(name_attr), 
              value: o.escape(value_attr)});
          });
          return options;
        },
        
        // A function that combine the keys and values in the 
        // options hash into a string of the form 
        // `key1 = "value1" key2="value2"`
        get_opt_str: function(opts) {
          if (opts != undefined) {
            var opt_str = _.reduce(_.keys(opts), function(s, k) {
              return s + k + '="' + opts[k] + '" ';
            }, '');
            return opt_str;
          }
        },

        // A function that creates the value part of the html tag, 
        // for example value = "Bob"
        // The value is the value of the `field` attribute of the 
        // input model. 
        // This can be overriden by passing in a `value` option in opts.
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

        // A function that creates the name part of the html tag.
        // The name value is the value of the `field` attribute 
        // of the input model. 
        // (For a label, '_label' is appended to the above value).
        // The value can be overriden by passing in a `name` option 
        // in opts.
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

        // A function that creates the id part of the html tag.
        // The id value is the value of the `field` attribute of 
        // the input model. 
        // (For a label, '_label' is appended to the above value).
        // The value can be overriden by passing in an `id` option in opts.
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
          if (model.get('errors') != undefined && 
          model.get('errors')[field] != undefined) {
            var e = model.get('errors');
            var x = e[field];
            if (tag_name != 'label' && 
            BackboneFormHelper.error_position == 'field') {
              // if not label tag, show error message
              return '<span class="' + BackboneFormHelper.error_field_class + '">' + tag_str + '&nbsp;<span class="field-error-message">' + model.get('errors')[field] + '</span></span>'; 
            } else {
              return '<span class="' + BackboneFormHelper.error_field_class + '">' + tag_str + '</span>'; 
            }
          } else {
            return tag_str;
          }
        },
        
        print_errors: function() {
          if (BackboneFormHelper.error_position == 'top') {
            if (_.isFunction(BackboneFormHelper.error_fn_top)) {
              return BackboneFormHelper.error_fn_top(model);
            } else {
              var errors = this.model.get('errors');
              var attrs = this.model.toJSON();
              var s = '';
              var err_str = _.reduce(_.keys(attrs), function(s, attr) {
                var tmp = ''
                if (errors[attr] != undefined) {
                  tmp = s + '<span class="field-error-message">' + 
                    errors[attr] + '</span><br>';
                } else {
                  tmp = s;
                }
                return tmp;
              }, s);
              return err_str;
            }
          } else {
            return '';
          }
        }
      };

      // Call the function passing in the above object.
      form_body_fn(form_obj);
    },

  };
  this.BackboneFormHelper = helper;
})();

