json-table-schema-validator
===========================

A validator for tabular data following the JSON Table Schema RFC available as a transform stream operating in object mode.

[![NPM](https://nodei.co/npm/jts-validator.png)](https://nodei.co/npm/jts-validator/)

Usage
=====

Given a [JSON Table Schema](http://dataprotocols.org/json-table-schema/)
for instance:

     var schema = {
      "fields": [
        {"name": "a", "type": "string"},
        {"name": "b", "type": "integer"},
        {"name": "c", "type": "number"},
        {"name": "d", "type": "date"}
      ]
    };

one can create a validator transform stream with:

    var Validator = require('jts-validator');
    var v = new Validator(schema);
    s.pipe(v); //s is a readable stream operating in object mode;
    v.on('data', function(coercedRow){
      //do smtg with coerced row;
    });
    v.on('error', function(err){
      //oops validation error
    });

## Foreign keys support

A ```referenced``` object can be passed to the constructor to check
that the values of a field are inluded into the set of value provided
in the referenced Set. ```referenced``` is an object with:
- key equal to ```fields.name```
- values equal to an ES6 Set containing all the possible values of the filed.


Tests
=====

    npm test


Licence
=======

MIT
