define("Suite", ['Test', 'benchmark'], function(Test, Benchmark) {
  return function(desc, js) {
  	var self = this;  
	self.suiteDesc = ko.observable(desc);
	self.jsContext = new js();
	self.jsContextStr = ko.observable(js.toString());
	self.tests = ko.observableArray([]);
	self.testCases = ko.observableArray([]);
	setupTestCases(self.jsContext,'context');
	function setupTestCases(context, base){
		for (var prop in context){
			if(context[prop] instanceof Function){
				try{
				        var tc = { name: base + '.' + prop, value: context[prop].toString()};
					self.testCases.push(tc);	
				} catch(err){
					
				}
				
			} else if (context[prop] instanceof Object){
				if(Object.toSource){
					var tc = { name: prop, value: context[prop].toSource()};	
					self.testCases.push(tc);	
				}
				
			}
			if(context[prop] && context[prop].prototype){
				setupTestCases(context[prop].prototype, base + '.' + prop + '.prototype');	
			}
		
		}
	
	}
	
	self.shouldShow = ko.observable(true);
	self.benchmarks = ko.observableArray([]);
	self.benchmarksStatus = ko.observable('Running...');
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
	   self.benchmarks.sort(function(left, right) { return left.hz == right.hz ? 0 : (left.hz > right.hz ? -1 : 1) })
	   self.benchmarksStatus('Completed');
	});
	
	self.add = function(shouldEqual, expression){
		var  test = new Test(shouldEqual, expression, self.jsContext);
	    	self.tests.push(test);	    	
	    	self.benchmarkSuite.add(test.expression, function() { expression(self.jsContext);});
	    	return self;
	};
	
	self.shouldEqual = function(shouldEqual){
		self.shouldEqualValue = shouldEqual;
		return self;
	}
	
	self.compare = function(){
		for (var prop in self.jsContext){
			self.tests.push(new Test(self.shouldEqualValue, 
			  self.jsContext[prop](arguments), prop, arguments));	
		}
		return self;
	}
	
	self.run = function(){
		self.benchmarkSuite.run({ 'async': true });
	}
  };
});

define("Test", [], function() {
  return function(shouldEqual, expression, context, name, args) {
  	var re = /\[p\]/g;
  	var expressionStr = expression.toString().trim();  
  	
  	if(this.name){
  		this.name = name;
		this.expression = expressionStr.replace(re,'.' + name);		
  	} else{
  		this.name = '';
  		this.expression = expressionStr;
  	}
  	
  	this.shouldEqual = shouldEqual;
	this.actual = expression(context, args, name);
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
  return function FiddleSticks() {
	  FiddleSticks.prototype.Suite = Suite;
	  FiddleSticks.prototype.Test = Test;
	  FiddleSticks.prototype.Spy = Spy;
	  FiddleSticks.prototype.Verify = Verify;
  };
});

