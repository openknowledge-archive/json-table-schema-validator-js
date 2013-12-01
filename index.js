require('es6-shim');

var validators = require('./lib/validators')  
  , util = require('util')
  , clone = require('clone')
  , stringify = require('json-stable-stringify')
  , Transform = require("stream").Transform;

/**
 * referenced is an object containing for each field having a foreign key
 * a key of field.name and a value of an ES6 Set containing all the
 * possible values of the field.
 */

function Validator(schema, referenced, options) {
  schema.fields = schema.fields || [];

  if(arguments.length < 3){
    options = referenced;
  }
  this._referenced = {};
  
  options = clone(options) || {};
  options.objectMode = true;

  Transform.call(this, options);

  this._validator = {};
  schema.fields.forEach(function(x){
    this._validator[x.name] = validators(x.type);
  }, this);

  //validate foreign keys
  for (var key in referenced){
    this._referenced[key] = new Set();
    referenced[key].forEach(function(x){
      this._referenced[key].add(_checkable(x));
    }, this);
  }
};


util.inherits(Validator, Transform);

Validator.prototype._transform = function(obj, encoding, callback){

  for(var key in obj){
    if(key in this._validator){
      var inp = obj[key];
      try {
        obj[key] = this._validator[key](inp);
      } catch(e) {
        this.emit('error', e);
      }
    }

    //validate foreignkey
    if(key in this._referenced){
      if(!this._referenced[key].has(_checkable(obj[key]))){
        this.emit('error', new Error(inp + ' is not a valid value according to its foreignkey'));
      }
    }
  }

  this.push(obj);
  callback();
};


/**
 * convert x into a value that can be safely (i.e deterministicaly, by
 * value...) used in a Set.has(value) test
 */
function _checkable(x){
  var type = Object.prototype.toString.call(x);

  if ( (type === '[object Object]') || (type === '[object Array]')){
    return stringify(x);
  } else if (type === '[object Date]'){
    return x.getTime();
  }

  return x;
};


module.exports = Validator;
