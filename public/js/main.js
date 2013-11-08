;(function() {
  'use strict';

  requirejs.config({
    baseUrl: '/js',
    paths: {
      jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min'
    }
  });

  require(['jquery'], function($) {
    $('.remove-one').on('click', function() {
      if(!window.confirm('are you sure?')) return;
      
      var id = this.dataset.id;

      var m = document.location.pathname.match(/\/(\w+)\/?/);

      if(m) {
        var u = '/' + m[1] + '/' + id + '/';

        $.ajax({
          url: u,
          type: 'DELETE',
          dataType: 'json'
        }).then(function(res) {
          if(res && res.recode == 0) return $(this).parents('tr').remove();

          return alert('删除失败');
        }.bind(this), function() {
          return alert('删除失败');
        });
      }
    });
  });
})();