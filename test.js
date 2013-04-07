define("Test", [], function() {
  return function(shouldEqual, shouldBeA, expression) {
    var expressionStr;
    expressionStr = expression.toString();
    this.expression = expressionStr.substring(25, expressionStr.length - 3);
    this.typeOf = typeof (expression());
    this.actual = expression();
    this.shouldEqual = shouldEqual;
    this.shouldBeA = shouldBeA;
  };
});
