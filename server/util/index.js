String.prototype.upperFirst = function() {
  return this[0].toUpperCase() + this.substring(1).toLowerCase();
};