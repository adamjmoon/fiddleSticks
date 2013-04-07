define "Test", [], ->
  (shouldEqual, shouldBeA, expression) ->
    expressionStr = expression.toString()
    console.log expressionStr
    @expression = expressionStr.substring 25,expressionStr.length-3
    @type = typeof (expression())
    @actual = expression()
    @shouldEqual = shouldEqual
    @shouldBeA = shouldBeA
    return