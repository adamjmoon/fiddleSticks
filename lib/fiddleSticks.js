define("FiddleSticks", ['Suite', 'Test', 'Spy', 'Verify'], function(Suite, Test, Spy, Verify) {
  return function FiddleSticks() {
	  FiddleSticks.prototype.Suite = Suite;
	  FiddleSticks.prototype.Test = Test;
	  FiddleSticks.prototype.Spy = Spy;
	  FiddleSticks.prototype.Verify = Verify;
  };
});