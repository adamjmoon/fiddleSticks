define("Suite", [], function() {
  return function(desc, js) {
    this.suiteDesc = ko.observable(desc);
    this.jsUnderTest = ko.observable(js)
    this.tests = ko.observableArray([]);
  };
});

define("Test", [], function() {
  return function(shouldEqual, expression) {
    var expressionStr;
    var actual = expression();
    expressionStr = expression.toString();
    this.expression = expressionStr.substring(25, expressionStr.length - 5);
    this.typeOf = typeof (actual);
    this.actual = actual;
    this.shouldEqual = shouldEqual;
  };
});

define("FiddleSticks", ['Suite', 'Test'], function(Suite, Test) {
  function FiddleSticks() {};

  FiddleSticks.prototype.Suite = Suite;
  FiddleSticks.prototype.Test = Test;

  return FiddleSticks;
});


