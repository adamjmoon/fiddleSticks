define("Test", [], function() {
  return function(shouldEqual, expression, context) {
    var expressionStr = expression.toString();  	
  	this.name = expression.name;
  	this.expression = expressionStr.substring(23, expressionStr.length - 2);
  	this.shouldEqual = shouldEqual;
  	this.actual = expression(context);
  	this.typeOf = typeof(this.actual);
  };
});
