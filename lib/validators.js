function isNA(str){
  return (str === 'NA' || str === 'NaN' || str === '' || str === 'undefined' || str === 'null' || str === 'NAN' || str === 'n.d.' || str === 'nd' || str === null);
};

/**
 * returns a validation function to validate the type. The validation
 * function typicaly receive a string as input **but** it can also
 * receive a coerced value.
 */
module.exports = function(type){
  type == type || 'any';

  var f;

  switch(type){

  case 'string':
    f = function(inp){
      if (typeof inp == "string"){
        return inp;
      } else {
        throw new Error(inp + ' is not a string');
      };    
    };
    break;

  case 'number':
    f = function(inp){
      if(typeof inp === 'number'){
        return inp;
      }
      if(isNA(inp)){
        return null;
      } else if (inp.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/)){
        return parseFloat(inp);
      } else {
        throw new Error(inp + ' is not a number');      
      }
    };
    break;

  case 'integer':
    f = function(inp){
      if(isNA(inp)){
        return null;
      }

      if ((typeof inp === 'number') || inp.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/)){
        var x = parseFloat(inp);
        if (x % 1 === 0) {
          return x;
        }
      }
      throw new Error(inp + ' is not an integer');
    };
    break;

  case 'date':
    f = function(inp){
      if(Object.prototype.toString.call(inp) === "[object Date]"){
        return inp;
      }
      var x = Date.parse(inp);      
      if(/^\d{4}-[01]\d-[0-3]\d$/.test(inp) && !isNaN(x)){
        var splt = inp.split('-');
        var utc = new Date(Date.UTC(splt[0], splt[1]-1, splt[2], 0, 0, 0, 0));
        return utc;       
      } else {
        throw new Error(inp + ' is not an ISO 8601 date');
      }
    };
    break;

  case 'datetime':
    f = function(inp){
      if(Object.prototype.toString.call(inp) === "[object Date]"){
        return inp;
      }

      //from http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
      var iso = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
      
      var x = Date.parse(inp);
      if (iso.test(inp) && !isNaN(x)) {
        return new Date(inp);
      } else {
        throw new Error(inp + ' is not an ISO 8601 datetime');
      }
    };
    break;

  case 'boolean':
    f = function(inp){
      if ( (inp === 'true') || (inp == '1')){ //note the == (as opposed to ===) for the test with '1' -> takes into account true and 1
        return true;
      } else if ((inp === 'false') || (inp == '0')) {
        return false;
      } else {
        throw new Error(inp + ' is not a boolean');
      }
    }; 
    break;
    
  case 'json':
    f = function(inp){
      if(typeof inp === 'object'){
        return inp;
      }

      try {
        var x = JSON.parse(inp);
      } catch(e) {
        throw new Error(inp + ' is not JSON');
      }
      return x;
    };
    break;

  default:   
    f = function(inp){
      return inp;
    }
    break;
  }

  return f;

};
