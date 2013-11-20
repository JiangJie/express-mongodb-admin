;(function() {
  'use strict';

  requirejs.config({
    baseUrl: '/js',
    paths: {
      jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min',
      d3: 'http://d3js.org/d3.v3'
    }
  });

  require(['jquery', 'd3', 'form'], function($) {

    var $doc = $(document);

    $('.remove-one').on('click', function() {
      if(!window.confirm('are you sure?')) return;
      
      var id = this.dataset.id;

      var m = document.location.pathname.match(/\/view\/(\w+)\/?/);

      if(m) {
        var u = '/view/' + m[1] + '/' + id + '/';

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

    $doc.delegate('#editForm', 'submit', function(e) {
      e.preventDefault();
      console.log($(this).serializeJSON());
      console.log($(this).serializeArray());
      console.log($(this).serialize());

      var data = $(this).serializeJSON();

      $.ajax({
        url: document.location.href,
        type: 'PUT',
        dataType: 'json',
        data: data
      }).then(function(res) {
        console.log(res);
        
      }, function() {
        return alert('删除失败');
      });
      
    });

    $doc.delegate('#delOne', 'click', function(e) {
      e.preventDefault();

      if(!window.confirm('are you sure?')) return;

      $.ajax({
        url: document.location.href,
        type: 'DELETE',
        dataType: 'json'
      }).then(function(res) {
        if(res && res.recode == 0) {
          var m = document.location.pathname.match(/\/(\w+)\/?/);
          if(m && m[1]) return document.location.href = '/' + m[1] + '/';
        }

        return alert('删除失败');
      }, function() {
        return alert('删除失败');
      });
    });
  });
})();