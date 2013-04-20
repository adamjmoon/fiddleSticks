define("forVfor2Vsplice", function() {
  return function context() {
     context.prototype.ffor = function() {
      var i, len, ret;

      len = arguments.length;
      ret = new Array(len);
      i = 0;
      while (i < len) {
        ret[i] = arguments[i];
        i++;
      }
      return ret;
    };
    context.prototype.ffor2 = function() {
      var i, len, ret;

      len = arguments.length;
      ret = [];
      i = 0;
      while (i < len) {
        ret.push(arguments[i]);
        i++;
      }
      return ret;
    };
    context.prototype.fslice = function() {
      return Array.prototype.slice.call(arguments);
    };
      
  };
});
