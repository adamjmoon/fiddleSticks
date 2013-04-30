define("suiteViewModel", ['Test', 'benchmark'], function(Test, Benchmark) {
  return function(desc, js) {
  	var self = this;  
	self.suiteDesc = ko.observable(desc);