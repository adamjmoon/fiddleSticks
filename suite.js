define("Suite", ['Test', 'benchmark'], function(Test, Benchmark) {
  return function(desc, js) {
    var self = this;  
	self.suiteDesc = ko.observable(desc);
	self.jsContext = new js();
	self.jsContextStr = ko.observable(js.toString());
	self.tests = ko.observableArray([]);
	self.testCases = ko.observableArray([]);
	for (var prop in self.jsContext){
		var tc = {
			name: prop,
			func: self.jsContext[prop]
		};

		self.testCases.push(tc);			
	}

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
