define("Suite", ['Test', 'benchmark','knockout'], function(Test, Benchmark, ko) {
return function(desc, js) {
  	var self = this;  
	self.suiteDesc = ko.observable(desc);
	self.jsContext = new js();
	self.jsContextStr = ko.observable(js.toString());
	self.tests = ko.observableArray([]);
	self.testCases = ko.observableArray([]);
	self.shouldShow = ko.observable(true);
	self.benchmarks = ko.observableArray([]);
	self.benchmarksDone = ko.observable(false);
	self.benchmarkSuite = new Benchmark.Suite;
	self.benchmarkPlatform = ko.observable(Benchmark.platform.description);
	
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
	

 	self.benchmarkSuite.on('cycle', function(event) {
 	  var b = event.target;          
          
          self.benchmarks.push( {
          	name: ko.observable(b.name.replace(/context\.(.*?)\(\)\;/gi,'$1')),
          	expression: ko.observable(b.name),
          	hz: ko.observable(b.hz.toFixed(0)),
          	relativateMarginError: ko.observable(b.stats.rme.toFixed(2) + '%'),
          	timesFaster: ko.observable('pending...'),
          	slowest: ko.observable(false),
          	fastest: ko.observable(false),
          	iterationPerSampleCycle: ko.observable(b.count),
          	numAnalysisCycles: ko.observable(b.cycles), 
          	numSampleCycles: ko.observable(b.stats.sample.length)
          });
	})
	.on('complete', function() {          
	   
	  self.benchmarks.sort(function(left, right) { 
	  	var leftHz = parseInt(left.hz());
	  	var rightHz =  parseInt(right.hz());
	  	return leftHz == rightHz ? 0 : (leftHz > rightHz ? -1 : 1) 
	  	});
	  // var benchmarksCopy = self.benchmarks().slice();
	  // self.benchmarks.removeAll();
	  self.benchmarks()[0].fastest(true);	
	  var length = self.benchmarks().length;	  
	  self.benchmarks()[length-1].slowest(true);
	  var slowestHz = self.benchmarks()[length-1].hz();
	  for (var i = 0; i < length; i++) {
		self.benchmarks()[i].timesFaster((self.benchmarks()[i].hz()/slowestHz).toFixed(3));		
  	  }	
	  self.benchmarksDone(true);
	});
	
	self.add = function(shouldEqual, expression, name){
		var  test = new Test(shouldEqual, expression, self.jsContext, name);
	    	self.tests.push(test);	    	
	    	self.benchmarkSuite.add(test.expression, function() { expression(self.jsContext,name);}, { 'async': true, 'queued': true, 'minSamples': 100});
	    	return self;
	};
	
	self.shouldEqual = function(shouldEqual){
		self.shouldEqualValue = shouldEqual;
		return self;
	};
	
	self.compare = function(func){
		for (var testcase in self.jsContext){
		     self.add(self.shouldEqualValue, func, testcase);	
		}
		return self;
	};
	
	function $(id) {
	    return typeof id == 'string' ? document.getElementById(id) : id;
	}
	
	function createElement(tagName) {
	    return document.createElement(tagName);
	}
	
	function setHTML(element, html) {
	    if ((element = $(element))) {
	      element.innerHTML = html == null ? '' : html;
	    }
	    return element;
  	}
	
	self.run = function(){
		self.benchmarksDone(false);
		self.benchmarks.removeAll();
		self.benchmarkSuite.run();
		
	};
	
	ko.applyBindings(self);
  };
});
