(function() {
  var helper = {
    
    init: function(opts) {
      this.errorPlacement = opts['errorPlacement'];
      this.errorFnTop = opts['errorFnTop'];
      this.errorClass = opts['errorClass'];
    },

    // The `form` function calls its second argument (`formBodyFn`), 
    // with an object that contains the model.
    // The tag functions will be called on this object.
    form: function(model, formBodyFn) {
      
      // Use a blank model if the one passed in is null.
      if (_.isUndefined(model) || _.isNull(model)) {
        model = new Backbone.Model();
      }

      // Create an object with the model and the helper functions, 
      // The tag functions are called on this object.
      // This object is the `this` reference within the tag functions. 
      var formObj = {
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
          var tagOpen = '<input type="text" ';
          var bodyStr = '';
          var tagEnd = '';
          return this.tag('text', field, opts, tagOpen, 
          bodyStr, tagEnd);
        },

        // input type="date"
        date: function(field, opts) {
          var tagOpen = '<input type="date" ';
          var bodyStr = '';
          var tagEnd = '';
          return this.tag('date', field, opts, tagOpen, 
          bodyStr, tagEnd);
        },

        // label
        label: function(field, labelText, opts) {
          var tagOpen = '<label for="' + field +  '" ';
          var bodyStr = labelText;
          var tagEnd = '</label>';
          return this.tag('label', field, opts, tagOpen, 
          bodyStr, tagEnd);
        },

        // textarea
        textarea: function(field, text, opts) {
          opts = _.isUndefined(opts) ? {} : opts;
          var tagOpen = '<textarea ';
          var bodyStr = this.model.escape(field);
          var tagEnd = '</textarea>';
          return this.tag('textarea', field, opts, tagOpen, 
          bodyStr, tagEnd);
        },

        // input type="hidden"
        hidden: function(field, opts) {
          var tagOpen = '<input type="hidden" ';
          var bodyStr = '';
          var tagEnd = '';
          return this.tag('hidden', field, opts, tagOpen, 
          bodyStr, tagEnd);
        },
        
        // input type="password"
        password: function(field, opts) {
          var tagOpen = '<input type="password" ';
          var bodyStr = '';
          var tagEnd = '';
          return this.tag('password', field, opts, tagOpen, 
          bodyStr, tagEnd);
        },

        // input type="checkbox"
        checkbox: function(field, opts) {
          var tagOpen = '<input type="checkbox" ';
          var checked = '';
          if (this.model.get(field) == true) {
            checked = 'checked="true" ';
          }
          tagOpen += checked;
          var bodyStr = '';
          var tagEnd = '';
          return this.tag('checkbox', field, opts, tagOpen, 
          bodyStr, tagEnd);
        },

        // Generic tag function to generate tag id, value, name, 
        // and options. 
        tag: function(tagName, field, opts, tagOpen, 
        bodyStr, tagEnd) {
          opts = _.isUndefined(opts) ? {} : opts;
          // get the value, name, id, and options parts of the tag
          var valStr = this.getValStr(this.model, field, tagName, 
          opts);
          var idStr = this.getIdStr(this.model, field, tagName, 
          opts);
          var nameStr = this.getNameStr(this.model, field, tagName, 
          opts);
          var optsStr = this.getOptsStr(opts);
          // combine the tag open and end with the above parts 
          // to create the tag.
          var tagStr = tagOpen + valStr + nameStr + idStr + 
            optsStr + '>' + bodyStr + tagEnd;
          // pass the tag to `wrapErrors` that adds error span if 
          // the errors hash contains an error for this field.
          return this.wrapErrors(this.model, field, tagStr, tagName);
        },

        // select tag
        select: function(field, optionsArray, opts) {
          tag = '<select name="' + field + '"> ';
          var _this = this;
          _.each(optionsArray, function(o) {
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
        radio: function(field, optionsArray, opts) {
          tag = '';
          _.each(optionsArray, function(o, index) {
            checked = (this.model.get(field) == o.value) ? 
            'checked ' : ' ';
            inputStyle='style = "display: inline" ';
            labelStyle='style = "display: inline" ';
            id = 'id = "' + field + '_' + index + '" ';
            type = 'type = "radio" ';
            inputName = 'name = "' + field + '" ';
            value = 'value = "' + o.value + '" ';
            tag += '<input ' + checked + inputStyle + id + 
            type + inputName + value + '>';
            tag += '<label ' + labelStyle + '>' + o.name + '</label>';
            tag += '&nbsp;&nbsp;';
          });
          return tag;
        },

        // ## Utility functions ##

        // A function that generates an array of option hashes.
        // Each hash has name and value keys, whose values are 
        // obtained from the `nameAttr` and `nameAttr` attributes 
        // of each model of the input `collection`.
        // `include_none` is a boolean attribute that if true, 
        // generates a `none` option for the option array. 
        // The name for the `none` option is taken from `opts.none` 
        // if present, and is "(none)" otherwise
        generateOptionsArray: function(collection, name_attr, 
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
            options.push({name: o.escape(nameAttr), 
              value: o.escape(valueAttr)});
          });
          return options;
        },
        
        // A function that combine the keys and values in the 
        // options hash into a string of the form 
        // `key1 = "value1" key2="value2"`
        getOptsStr: function(opts) {
          if (opts != undefined) {
            var optsStr = _.reduce(_.keys(opts), function(s, k) {
              return s + k + '="' + opts[k] + '" ';
            }, '');
            return optsStr;
          }
        },

        // A function that creates the value part of the html tag, 
        // for example value = "Bob"
        // The value is the value of the `field` attribute of the 
        // input model. 
        // This can be overriden by passing in a `value` option in opts.
        getValStr: function(model, field, tagName, opts) {
          value = ""
          if (_.include(_.keys(opts), 'value')) {
            value = opts['value'];
            delete opts['value'];
          } else {
            if (tagName != 'textarea') {
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
        getNameStr: function(model, field, tagName, opts) {
          var name = "";
          if (_.include(_.keys(opts), 'name')) {
            name = opts['name'];
            delete opts['name'];
          } else {
            name = (tagName == 'label') ? field + '_label' : field;
          }
          return 'name="' + name + '" ';
        },

        // A function that creates the id part of the html tag.
        // The id value is the value of the `field` attribute of 
        // the input model. 
        // (For a label, '_label' is appended to the above value).
        // The value can be overriden by passing in an `id` option in opts.
        getIdStr: function(model, field, tagName, opts) {
          var id = "";
          if (_.include(_.keys(opts), 'id')) {
            id = opts['id'];
            delete opts['id'];
          } else {
            id = (tagName == 'label') ? field + '_label' : field;
          }
          return 'id="' + id + '" ';
        },
        // wrap tag in field-with-error span if errors present
        wrapErrors: function(model, field, tagStr, tagName) {
          if (model.get('errors') != undefined && 
          model.get('errors')[field] != undefined) {
            var e = model.get('errors');
            var x = e[field];
            if (tagName != 'label' && 
            BackboneFormHelper.errorPlacement == 'field') {
              // if not label tag, show error message
              return '<span class="' + BackboneFormHelper.errorClass + '">' + tagStr + '&nbsp;<span class="field-error-message">' + model.get('errors')[field] + '</span></span>'; 
            } else {
              return '<span class="' + BackboneFormHelper.errorClass + '">' + tagStr + '</span>'; 
            }
          } else {
            return tagStr;
          }
        },
        
        printErrors: function() {
          if (BackboneFormHelper.errorPlacement == 'top') {
            if (_.isFunction(BackboneFormHelper.errorFnTop)) {
              return BackboneFormHelper.errorFnTop(model);
            } else {
              var errors = this.model.get('errors');
              var attrs = this.model.toJSON();
              var s = '';
              var errStr = _.reduce(_.keys(attrs), function(s, attr) {
                var tmp = ''
                if (errors[attr] != undefined) {
                  tmp = s + '<span class="field-error-message">' + 
                    errors[attr] + '</span><br>';
                } else {
                  tmp = s;
                }
                return tmp;
              }, s);
              return errStr;
            }
          } else {
            return '';
          }
        }
      };

      // Call the function passing in the above object.
      formBodyFn(formObj);
    },

  };
  this.BackboneFormHelper = helper;
})();

