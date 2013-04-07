define("TestSuite", [], function(test) {
  return function(desc, code) {
    this.suiteDesc = ko.observable(desc);
    this.jsUnderTest = ko.observable(code);
    this.tests = ko.observableArray([]);
  };
});