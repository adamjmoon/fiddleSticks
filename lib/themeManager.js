define("ThemeManager", [], function() {
  return function ThemeManager() {
    self = this;
    self.previousTheme = '';
    self.currentTheme = 'cyborg';

    ThemeManager.prototype.setTheme = function(newTheme){
    	if(newTheme != self.currentTheme){
    		self.previousTheme = self.currentTheme;
	    	self.currentTheme = newTheme;
			var currentThemeStyle = document.getElementById(newTheme);
			currentThemeStyle.innerHTML = currentThemeStyle.innerHTML.replace(/\/\*/g, "").replace(/\*\//g, "");
			if(self.previousTheme != ''){
				var previousThemeStyle = document.getElementById(self.previousTheme);
				previousThemeStyle.innerHTML = '/*' + previousThemeStyle.innerHTML + '*/';
			}
    	}
  	};
  };
});