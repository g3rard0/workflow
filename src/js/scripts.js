global.jQuery = require('jquery');
bootstrap = require('bootstrap');
mustache = require('mustache');


jQuery(document).ready(function () {
  var jqxhr = jQuery.getJSON('data.json', function (data) {
    var template = jQuery("#template").html();
    var showTemplate = mustache.render(template, data);
    jQuery("#gallery").html(showTemplate);
  });
});
