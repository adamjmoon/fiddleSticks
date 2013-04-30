requirejs.config({
  //baseUrl: '/',
  paths: {
    'FiddleSticks' : 'fiddleSticks.min',
    'benchmark' : 'scripts.min',
    'knockout' : 'scripts.min',
    'jquery' : 'scripts.min'
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

define('benchmark',['scripts.min'], function (Benchmark) {return Benchmark});

require(['knockout','jquery','benchmark','FiddleSticks','context'], function(ko, $, Benchmark, fs, context) {
	
	 var suite = new (new fs())
	            .Suite('DateTime tests', context); 
	 suite.shouldEqual(1).compare(function(c, tc){return c[tc]();}).run();
	
});
