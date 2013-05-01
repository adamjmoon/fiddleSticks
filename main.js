requirejs.config({
  paths: {
    'FiddleSticks' : 'https://raw.github.com/adamjmoon/fiddleSticks/master/fiddleSticks',
    'lodash' : 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/1.2.0/lodash.min',
    'platform' : 'https://cdnjs.cloudflare.com/ajax/libs/platform/0.4.0/platform.min',
    'benchmark' : 'https://raw.github.com/bestiejs/benchmark.js/master/benchmark',
    'knockout' : 'http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1'
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