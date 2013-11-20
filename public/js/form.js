/**
 * Serialize form fields into JSON
 **/
 
require(['jquery'], function($){
 
  $.fn.serializeJSON = function(){
    var json = {}
    var form = $(this);
    form.find('input, select, textarea').each(function() {
      if (!this.name) return;
 
      if ('radio' === this.type) {
        if (json[this.name]) { return; }
 
        json[this.name] = this.checked ? this.value : '';
      } else if ('checkbox' === this.type) {
        json[this.name] = $.prop(this, 'checked');
      } else {
        var val = json[this.name];

        if(!val) return json[this.name] = this.value;

        if(!$.isArray(val)) json[this.name] = Array(json[this.name]);
        json[this.name].push(this.value);
      }
    })
    return json;
  };

/*
  var rCRLF = /\r?\n/g,
    rsubmittable = /^(?:input|select|textarea|keygen)/i,
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    manipulation_rcheckableType = /^(?:checkbox|radio)$/i;

  $.fn.extend({
    serialize: function() {
      return $.param( this.serializeArray() );
    },
    serializeArray: function() {
      return this.map(function(){
        // Can add propHook for "elements" to filter or add form elements
        var elements = $.prop( this, "elements" );
        return elements ? $.makeArray( elements ) : this;
      })
      .filter(function(){
        var type = this.type;
        // Use .is(":disabled") so that fieldset[disabled] works
        return this.name && !$( this ).is( ":disabled" ) &&
          rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
          ( this.checked || !manipulation_rcheckableType.test( type ) );
      })
      .map(function( i, elem ){
        var val = $( this ).val() || $.prop(this, 'checked');

        return 'boolean' == typeof val ? { name: elem.name, value: val } : val == null ?
          null :
          $.isArray( val ) ?
            $.map( val, function( val ){
              return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
            }) :
            { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
      }).get();
    }
  });
*/
});