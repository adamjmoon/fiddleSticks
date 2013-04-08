define("Suite", [], function(test) {
  return function(desc, js) {
    this.suiteDesc = ko.observable(desc);
    this.jsUnderTest = ko.observable(js);
    this.tests = ko.observableArray([]);
  };
});