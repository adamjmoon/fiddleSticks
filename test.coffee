define "Test", [], ->
  (shouldEqual, expression, context) ->
    expressionStr = expression.toString()        
    @name = expression.name
    @expression = expressionStr.substring(23, expressionStr.length - 2)
    @shouldEqual = shouldEqual
    @actual = expression(context)
    @typeOf = typeof (@actual)
