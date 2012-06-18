(function() {
  var helper = {
    
    init: function(opts) {
      // Error placement: can be 'top' or 'field'.
      // If placement is 'top', f.errorMessages must be called 
      // in the template to print error messages.
      this.errorPlacement = opts['errorPlacement'];
      // The wrapper element that is used to wrap each error message
      // if the placement is 'top'.
      // To get a list of error messages, the wrapper should be
      // &lt;li&gt;, and the error\_messages can be called inside 
      // a ul or ol like this:
      //
      // &lt;ul&gt;
      //     <%= f.error_messages %>
      // &lt;/ul&gt;
      this.wrapper = opts['wrapper'];
      // The element that is used to create error messages.
      // default is 'label'
      this.errorElement = opts['errorElement'];
      // The error class that should be added to each input field with 
      // an error. Default is 'error'
      this.errorFieldClass = opts['errorFieldClass'];
      // The error class that should be added to each input field label 
      // with an error. Default is 'error'
      this.errorLabelClass = opts['errorLabelClass'];
      this.errorFn = opts['errorFn'];
      this.tagBuilderWrapper = $('<div>');
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
        
        text: function(field, opts) {
          return this.tagBuilder(
            $('<input>').attr({type: 'text'}), 'text', field, opts
          );
        },

        // input type="date"
        date: function(field, opts) {
          return this.tagBuilder(
            $('<input>').attr({type: 'date'}), 'text', field, opts
          );
        },

        // label
        label: function(field, opts) {
          if (_.include(_.keys(opts), 'value')) {
            opts['body'] = opts['value'];
            delete opts['value'];
          }
          return this.tagBuilder(
            $('<label>').attr({'for': field}), 'label', field, opts
          );
        },

        // textarea
        textarea: function(field, opts) {
          // set the body from either opts value or model field value.
          if (_.include(_.keys(opts), 'value')) {
            opts['body'] = opts['value'];
            delete opts['value'];
          } else {
            opts['body'] = model.escape(field);
          }
          return this.tagBuilder(
            $('<textarea>'), 'textarea', field, opts
          );
        },

        // input type="hidden"
        hidden: function(field, opts) {
          return this.tagBuilder(
            $('<input>').attr({type: 'hidden'}), 'hidden', field, opts
          );
        },
        
        // input type="password"
        password: function(field, opts) {
          return this.tagBuilder(
            $('<input>').attr({type: 'password'}), 'password', field, opts
          );
        },

        // input type="checkbox"
        checkbox: function(field, opts) {
          var tag = $('<input>').attr({type: 'checkbox'});
          if (this.model.get(field) == true) {
            tag.attr({checked: 'true'});
          }
          return this.tagBuilder(tag, 'checkbox', field, opts);
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


        tagBuilder: function(tag, tagName, field, opts) {
          opts = _.isUndefined(opts) ? {} : opts;
          // set name, value and id.
          tag.attr({
            name: this.getName(this.model, field, tagName, opts),
            value: this.getValue(this.model, field, tagName, opts),
            id: this.getId(this.model, field, tagName, opts),
          });  
          // set body from opts.
          if (_.include(_.keys(opts), 'body')) {
            if (!_.isNull(opts['body'])) {
              tag.append(opts['body']);
            }
            delete opts['body'];
          }
          // set additional options.
          tag.attr(opts);
          tag = this.highlightErrors(tag, tagName, field);
          return BackboneFormHelper.tagBuilderWrapper.html(tag).html();
        },


        // ## Utility functions ##

        // get value for html tag, for example value = "Bob"
        // The value is the value of the `field` attribute of the 
        // input model. 
        // This can be overriden by passing in a `value` option in opts.
        // For a textarea return an empty string if not overriden in opts.
        getValue: function(model, field, tagName, opts) {
          value = '';
          if (_.include(_.keys(opts), 'value')) {
            value = opts['value'];
            delete opts['value'];
          } else {
            if (tagName != 'textarea') {
              value = model.escape(field);
            }
          } 
          return value;
        },

        // Creates the name part of the html tag.
        // The name value is the value of the `field` attribute 
        // of the input model. 
        // (For a label, '_label' is appended to the above value).
        // The value can be overriden by passing in a `name` option 
        // in opts.
        getName: function(model, field, tagName, opts) {
          var name = "";
          if (_.include(_.keys(opts), 'name')) {
            name = opts['name'];
            delete opts['name'];
          } else {
            if (!_.isNull(field)) {
              name = (tagName == 'label') ? field + '_label' : field;
            } 
          }
          return name;
        },

        // Create the id part of the html tag.
        // The id value is the value of the `field` attribute of 
        // the input model. 
        // (For a label, '_label' is appended to the above value).
        // The value can be overriden by passing in an `id` option in opts.
        getId: function(model, field, tagName, opts) {
          var id = "";
          if (_.include(_.keys(opts), 'id')) {
            id = opts['id'];
            delete opts['id'];
          } else {
            if (!_.isNull(id)) {
              id = (tagName == 'label') ? field + '_label' : field;
            }
          }
          return id;
        },

        // Prints error messages 
        errorMessages: function() {
          if (BackboneFormHelper.errorPlacement == 'top') {
            if (!_.isUndefined(BackboneFormHelper.errorFn)) {
              return BackboneFormHelper.errorFn(model);  
            } else {
              var s = '';
              var attrs = this.model.toJSON();
              var _this = this;
              var errStr = _.reduce(
                _.keys(attrs), _this.makeErrMsgFromAttr, s, _this
              );
              return errStr;
            } 
          } else {
            return '';
          }
        },

        // Internal helper functions - not meant to be called directly.
        
        highlightErrors: function(tag, tagName, field) {
          if (this.model.get('errors') != undefined && 
          this.model.get('errors')[field] != undefined) {
            var e = this.model.get('errors');
            var error = e[field];
            if (tagName == 'label') {
              tag.addClass(BackboneFormHelper.errorLabelClass);
            } else if (BackboneFormHelper.errorPlacement == 'field') {
              if (!_.isUndefined(BackboneFormHelper.errorFn)) {
                tag = BackboneFormHelper.errorFn(tag, error);
              } else {
                tag.addClass(BackboneFormHelper.errorFieldClass);
                error_label = $('<label>').addClass(
                BackboneFormHelper.errorLabelClass).html(error);
                // create new element and append the tag and error label.
                tag = $('<span>').append(tag).append(error_label);
              }
            } else {
              tag.addClass(BackboneFormHelper.errorFieldClass);
            }
          }
          return tag;
        },
        
        // creates the error message for an attribute
        makeErrMsgFromAttr: function(s, attr) {
          var errors = this.model.get('errors');
          var attrs = this.model.toJSON();
          var tmp = ''
          // if errors contain error for attr, generate error message
          // for attr.
          if (errors[attr] != undefined) {
            // if wrapper is defined, put error message for attr 
            // in wrapper.
            if (!_.isUndefined(BackboneFormHelper.wrapper)) {
              var errElem = $(BackboneFormHelper.wrapper);
              errElem.html(
                '<span class="' + 
                  BackboneFormHelper.errorLabelClass + '">' + 
                  errors[attr] + '</span><br>'
              );
              tmp = s + errElem.html();
            } else {
              // no wrapper, append error message for attr directly 
              // to string.
              tmp = s + '<span class="' + 
                BackboneFormHelper.errorLabelClass + '">' + 
                errors[attr] + '</span>'
            }
          } else {
            // no error for attr, return original string
            tmp = s;
          }
          return tmp;
        },
        
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
        //getOptsStr: function(opts) {
          //if (opts != undefined) {
            //var optsStr = _.reduce(_.keys(opts), function(s, k) {
              //return s + k + '="' + opts[k] + '" ';
            //}, '');
            //return optsStr;
          //}
        //},
      
      }; // end form object.

      
      // Call the function passing in the above object.
      formBodyFn(formObj);

    },

  };
  this.BackboneFormHelper = helper;
})();

