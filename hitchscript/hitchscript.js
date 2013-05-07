if (Meteor.isClient) {

  Template.hitchscript.created = function() {

    requirejs.config({
      baseUrl: 'https://',
      paths: {  
        'FiddleSticks' : 'raw.github.com/adamjmoon/fiddleSticks/master/fiddleSticks.min',
        'ThemeManager' : 'raw.github.com/adamjmoon/fiddleSticks/master/fiddleSticks.min',
        'lodash' : 'cdnjs.cloudflare.com/ajax/libs/lodash.js/1.2.0/lodash.min',
        'platform' : 'cdnjs.cloudflare.com/ajax/libs/platform/0.4.0/platform.min',
        'benchmark' : 'raw.github.com/bestiejs/benchmark.js/master/benchmark',
        'knockout' : 'ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1'
      }
    });
    

    require(['FiddleSticks','context'], function(fs, context) {
       var fs = new fs();
       var suite = new fs.Suite('DateTime tests', context); 
       suite.shouldEqual(1)
            .compare(function(c, tc){return c[tc]();})
            .run();
      
    });
  }
};

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
