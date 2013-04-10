define("Suite", ['Test', 'benchmark'], function(Test, Benchmark) {
  return function(desc, js) {
  	var self = this;  
	self.suiteDesc = ko.observable(desc);
	self.jsContext = js();
	self.jsContextStr = ko.observable(js.toString());
	self.tests = ko.observableArray([]);
	self.shouldShow = ko.observable(true);
	self.benchmarkIndex=0;
	self.benchmarks = ko.observableArray([]);
	self.benchmarkSuite = new Benchmark.Suite;
	self.benchmarkPlatform = new ko.observable(Benchmark.platform.desc);
 	self.benchmarkSuite.on('cycle', function(event) {
          event.target.slowest=false;        
 	  event.target.benchmarkIndex = self.benchmarkIndex;
 	  self.benchmarkIndex+=1;
 	  self.benchmarks[self.benchmarkIndex] = event.target; 
	})
	.on('complete', function() {	   
	   self.benchmarks[this.filter('slowest')[0].benchmarkIndex].slowest = true;
	});
	
	self.add = function(shouldEqual, expression){
		var test = new Test(shouldEqual, expression, self.jsContext);
	    	self.tests.push(test);
	    	self.index+=1;
	    	self.benchmarkSuite.add(test.expression, function() { expression(self.jsContext);});
    		return self;   
	};    	
  };
});

define("Test", [], function() {
  return function(shouldEqual, expression, context) {
  	var expressionStr = expression.toString();
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


