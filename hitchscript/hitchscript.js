if (Meteor.isClient) {

  Template.hitchscript.created = function(){
    var theme = 'cyborg';
    if(window.location.search.length>1){
      theme = window.location.search.split("=")[1];
    }

    var themeFile = "https://raw.github.com/adamjmoon/fiddleSticks/master/theme/" + theme + "/bootstrap.min.css";
    
    var fileref=document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", themeFile);
   
    if (typeof fileref!="undefined")
      var head = document.getElementsByTagName("head")[0];
      head.insertBefore(fileref,head.firstChild);
    }

  Template.hitchscript.rendered = function() {
    
    requirejs.config({
      baseUrl: 'http://',
      paths: {  
        'FiddleSticks' : 'raw.github.com/adamjmoon/fiddleSticks/master/fiddleSticks',
        'lodash' : 'cdnjs.cloudflare.com/ajax/libs/lodash.js/1.2.0/lodash.min',
        'platform' : 'cdnjs.cloudflare.com/ajax/libs/platform/0.4.0/platform.min',
        'benchmark' : 'raw.github.com/bestiejs/benchmark.js/master/benchmark',
        'knockout' : 'ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1'
      }
    });
    define("context", function() {
      return function context() {
          this.currentDateTime1 = 
          function() {
              var time = new Date().getTime();
              var date = new Date(time);
              return date.toString();      
          };
          
          this.currentDateTime2 = 
          function() {
              return new Date().toLocaleString();          
          };
          this.dateFromMilliseconds = function(){
              return new Date(Date(('/Date(1366831535554)/').replace(/\/Date\((.*?)\)\//gi, "$1")).toString()).toLocaleString();
          };
          
          this.currentDateMillesondsFrom_Midnight_JUNE_1_1970 = 
          function() {
              return new Date().getTime().toString();
          };
      };
    });

    require(['FiddleSticks','context'], function(fs, context) {
      
       var suite = new (new fs())
                  .Suite('DateTime tests', context); 
       suite.shouldEqual(1).compare(function(c, tc){return c[tc]();}).run();
      
    });

    
    
  }
};

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
