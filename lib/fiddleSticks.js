define("FiddleSticks", ['Suite', 'Test', 'Spy', 'Verify', 'ThemeManager'], function(Suite, Test, Spy, Verify, ThemeManager) {
  return function FiddleSticks() {
	  FiddleSticks.prototype.Suite = Suite;
	  FiddleSticks.prototype.Test = Test;
	  FiddleSticks.prototype.Spy = Spy;
	  FiddleSticks.prototype.Verify = Verify;
	  FiddleSticks.prototype.ThemeManager = ThemeManager;
  };
});