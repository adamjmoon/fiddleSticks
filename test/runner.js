requirejs.config({
  paths: {
    'FiddleSticks' : '//raw.github.com/adamjmoon/fiddleSticks/master/fiddleSticks',
    'benchmark' : '//raw.github.com/bestiejs/benchmark.js/master/benchmark',
    'lodash' : '//raw.github.com/bestiejs/benchmark.js/master/vendor/lodash/lodash',
    'platform' : '//raw.github.com/bestiejs/benchmark.js/master/vendor/platform.js/platform'
  }
});

define("context", [], function() {
  return function context() {
    context.prototype.ArrayProto = function () {
            return Array.prototype.slice.call(arguments, 0);
        };    
      context.prototype.EmptyArray = function () {
             return [].slice.call(arguments, 0);
        };
  };
});

require(['FiddleSticks', 'context'], function(fiddleSticks, context) {
 var suite = new (new fiddleSticks()).Suite('Array.prototype.slice.call(arguments, 0) or [].slice.call(arguments, 0)', context);
 
  suite.add(10, function(c) {return c.ArrayProto(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).length;})
       .add(10, function(c) {return c.EmptyArray(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).length;})
       .run();
    
});
