define("Test", [], function() {
  return function(shouldEqual, func, context, testCaseName) {
    
  	var expressionStr = func.toString().trim();  
  	
  	if(testCaseName){  		
  		this.name = testCaseName;
		this.expression =  expressionStr.replace(/\n    /,'')
  				  	       	.replace(/{ return/,'{return')
  				                .replace(/(function \(c, tc\)\{return c\[tc\])/gi,'context.' + testCaseName).replace(/\}/,'');
	        this.actual = func(context,testCaseName);
		
  	} else{
  		this.expression = expressionStr.replace(/\n    /,'')
  				         .replace(/{ return/,'{return')
  					 .replace(/function \(c\) {return /,'')
  					 .replace(/c\./gi,'context.')  					 
  					 .replace(/\}/,'');
  		this.name = this.expression.replace(/context\./g,'')
  					   .replace(/\;/,'');
  		this.actual = func(context);
  	}
  	
  	this.shouldEqual = shouldEqual;	
	this.typeOf = typeof(this.actual);
  };
});
