var validators = require('./lib/validators')
  , util = require('util')
  , Transform = require("stream").Transform;

function Validator(schema, options) {
  options = options || {};
  options.objectMode = true;

  Transform.call(this, options);

  this._validator = {};
  schema.fields.forEach(function(x){
    this._validator[x.name] = validators(x.type);
  }, this);

}

util.inherits(Validator, Transform);


Validator.prototype._transform = function(obj, encoding, callback){

  for(var key in obj){
    if(key in this._validator){
      try {
        obj[key] = this._validator[key](obj[key]);
      } catch(e) {
        this.emit('error', e);
      }
    }
  }

  this.push(obj);
  callback();
};

module.exports = Validator;
