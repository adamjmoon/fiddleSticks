define("Suite", ['Test', 'benchmark'], function(Test, Benchmark) {
  return function(desc, js) {
  	var self = this;  
	self.suiteDesc = ko.observable(desc);
	
	self.prototype.context = function(){};
	
	if(js){
		self.context = js;		
	}
	self.jsContextStr = ko.observable(self.context.toString());
	
	self.testCases = function(){
	        return Object.getOwnPropertyNames(self.context);
	}
	self.tests = ko.observableArray([]);
	self.shouldShow = ko.observable(true);
	self.benchmarks = ko.observableArray([]);
	self.benchmarksStatus = ko.observable();
	self.benchmarkSuite = new Benchmark.Suite;
	self.benchmarkPlatform = ko.observable(Benchmark.platform.description);
	ko.applyBindings(self);
 	self.benchmarkSuite.on('cycle', function(event) {
          event.target.slowest=false;
          event.target.fastest=false;
          event.target.timesFaster=false;
 	  self.benchmarks.push(event.target);
	})
	.on('complete', function() {
	   var slowestBenchmark = this.filter('slowest')[0];
	   slowestBenchmark.slowest = true;
	   var slowestHz = slowestBenchmark.hz;
	   var fastestBenchmark = this.filter('fastest')[0];	   
	   fastestBenchmark.fastest = true;
	   self.benchmarks.remove(slowestBenchmark);
	   self.benchmarks.remove(fastestBenchmark);
	   var benchmarksCopy = self.benchmarks().slice();
	   self.benchmarks.removeAll();
	   
	   function timesFaster(benchmarkHz, slowestHz){
	   	return (benchmarkHz/slowestHz).toFixed(3);
	   }
	   
	   fastestBenchmark.timesFaster = timesFaster(fastestBenchmark.hz, slowestHz);
	   self.benchmarks.push(fastestBenchmark);	   
	   for (var i = 0; i < benchmarksCopy.length; i++) {
	        benchmarksCopy[i].timesFaster = timesFaster(benchmarksCopy[i].hz, slowestHz);
	        self.benchmarks.push(benchmarksCopy[i]); 
	   }	   
	   self.benchmarks.push(slowestBenchmark);
	   self.benchmarksStatus('Completed');
	});
	
	self.add = function(shouldEqual, expression){
		var test = new Test(shouldEqual, expression, self.jsContext);
	    	self.tests.push(test);	    	
	    	self.benchmarkSuite.add(test.expression, function() { expression(self.jsContext);});
	    	return self;
	};
	
	self.run = function(){
		self.benchmarkSuite.run({ 'async': true });
		self.benchmarksStatus('Running...');
	}
  };
});

define("Test", [], function() {
  return function(shouldEqual, expression, context) {
  	var expressionStr = expression.toString();
  	//this.expression =  expression.toString();
  	this.name = expression.name;
	this.expression = expressionStr.substring(20, expressionStr.length - 1);
	this.shouldEqual = shouldEqual;
	this.actual = expression(context);
	this.typeOf = typeof(this.actual);
  };
});

define("Spy", [], function() {
	return function(F) {
		function G() {
			var args = Array.prototype.slice.call(arguments);
			G.calls.push(args);
			F.apply(this, args);
		}
	
		G.prototype = F.prototype;
		G.calls = [];
	
		return G;
  };
});

define("Verify", [], function() {
	return function(F) {
		return function () {
			var args = Array.prototype.slice.call(arguments),
				i,
				j,
				call,
				count = 0,
				matched;

			for (i = 0; i < F.calls.length; i += 1) {
				call = F.calls[i];
				matched = true;
				for (j = 0; j < args.length; j += 1) {
					if (args[j] !== call[j]) {
						matched = false;
						break;
					}
				}
				if (matched) {
					count += 1;
				}
			}

			return count > 0;
		};
	};
});

define("FiddleSticks", ['Suite', 'Test', 'Spy', 'Verify'], function(Suite, Test, Spy, Verify) {
  function FiddleSticks() {};
  FiddleSticks.prototype.Suite = Suite;
  FiddleSticks.prototype.Test = Test;
  FiddleSticks.prototype.Spy = Spy;
  FiddleSticks.prototype.Verify = Verify;
  return FiddleSticks;
});


