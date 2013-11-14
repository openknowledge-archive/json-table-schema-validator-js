function isNa(str){
  return (str === 'NA' || str === 'NaN' || str === '' || str === 'undefined' || str === 'null' || str === 'NAN' || str === 'n.d.' || str === 'nd');
};

/**
 * returns a validation function to validate the type
 */
module.exports = function(type){
  type == type || 'any';

  var f;

  switch(type){

  case 'string':
    f = function(str){
      if (typeof str == "string"){
        return str;
      } else {
        throw new Error(str + ' is not a string');
      };    
    };
    break;

  case 'number':
    f = function(str){
      if(typeof str === 'number'){
        return str;
      }
      if(isNa(str)){
        return null;
      } else if (str.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/)){
        return parseFloat(str);
      } else {
        throw new Error(str + ' is not a number');      
      }
    };
    break;

  case 'integer':
    f = function(str){
      if(isNa(str)){
        return null;
      }

      if ((typeof str === 'number') || str.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/)){
        var x = parseFloat(str);
        if (x % 1 === 0) {
          return x;
        }
      }
      throw new Error(str + ' is not an integer');
    };
    break;

  case 'date':
    f = function(str){
      var x = Date.parse(str);      
      if(/^\d{4}-[01]\d-[0-3]\d$/.test(str) && !isNaN(x)){
        return new Date(str);
      } else {
        throw new Error(str + ' is not an ISO 8601 date');
      }
    };
    break;

  case 'datetime':
    f = function(str){
      //from http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
      var iso = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
      
      var x = Date.parse(str);
      if (iso.test(str) && !isNaN(x)) {
        return new Date(str);
      } else {
        throw new Error(str + ' is not an ISO 8601 datetime');
      }
    };
    break;

  case 'boolean':
    f = function(str){
      if ((str === 'true') || (str == '1')){
        return true;
      } else if ((str === 'false') || (str == '0')) {
        return false;
      } else {
        throw new Error(str + ' is not a boolean');
      }
    }; 
    break;
    
  case 'json':
    f = function(str){
      try {
        var x = JSON.parse(str);
      } catch(e) {
        throw new Error(str + ' is not JSON');
      }
      return x;
    };
    break;

  default:   
    f = function(str){
      return str;
    }
    break;
  }

  return f;

};
