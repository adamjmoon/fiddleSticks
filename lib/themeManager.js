define("ThemeManager", [], function() {
  return function() {
    self = this;
    self.previousTheme = '';
    self.currentTheme = 'cyborg';

    this.setTheme = function(newTheme){
    	if(newTheme != self.currentTheme){
    		self.previousTheme = self.currentTheme;
	    	self.currentTheme = newTheme;
			var currentThemeStyle = document.getElementById(newTheme);
			currentThemeStyle.innerHtml = currentThemeStyle.innerHtml.replace(/\/\*(.*?)\*\//g, "$1");
			if(self.previousTheme != ''){
				var previousThemeStyle = document.getElementById(self.previousTheme);
				previousThemeStyle.innerHtml = '/*' + previousThemeStyle.innerHtml + '*/';
			}
    	}
  	};
  };
});