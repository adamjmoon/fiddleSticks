if (Meteor.isClient) {

  Template.hitchscript.created = function(){
    // var cssNode=document.createElement("link");
    // cssNode.type = 'text/css';
    // cssNode.rel = 'stylesheet';
    // cssNode.href = themeFile;
    // cssNode.media = 'all';
    // cssNode.disabled = false;
    // cssNode.targe = '_parent';
    // var head = document.getElementsByTagName("head")[0];
    // head.insertBefore(cssNode,head.firstChild);
    
    
  };

  Template.hitchscript.rendered = function() {

    requirejs.config({
      baseUrl: 'https://',
      paths: {  
        'FiddleSticks' : 'raw.github.com/adamjmoon/fiddleSticks/master/fiddleSticks',
        'ThemeManager' : 'raw.github.com/adamjmoon/fiddleSticks/master/fiddleSticks',
        'lodash' : 'cdnjs.cloudflare.com/ajax/libs/lodash.js/1.2.0/lodash.min',
        'platform' : 'cdnjs.cloudflare.com/ajax/libs/platform/0.4.0/platform.min',
        'benchmark' : 'raw.github.com/bestiejs/benchmark.js/master/benchmark',
        'knockout' : 'ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1',
      }//,
      // config: {
      //     text: {
      //         useXhr: function (url, protocol, hostname, port) {
      //             //Override function for determining if XHR should be used.
      //             //url: the URL being requested
      //             //protocol: protocol of page text.js is running on
      //             //hostname: hostname of page text.js is running on
      //             //port: port of page text.js is running on
      //             //Use protocol, hostname, and port to compare against the url
      //             //being requested.
      //             //Return true or false. true means "use xhr", false means
      //             //"fetch the .js version of this resource".
      //             return false;
      //         }
      //     }
      // }
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
      
       var fs = new fs();
       var suite = new fs.Suite('DateTime tests', context); 
       suite.shouldEqual(1).compare(function(c, tc){return c[tc]();}).run();
      
    });

    
    
  }
};

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
