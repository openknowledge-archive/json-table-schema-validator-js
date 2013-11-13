var validators = require('../lib/validators')
  , assert = require('assert');

describe('validators', function(){

  it('should validate string', function(){
    var f = validators('string');
    assert.equal(f('a'), 'a');
    assert.throws(
      function(){
        f(1);
      }, /1 is not a string/
    );  
  });

  it('should validate number', function(){
    var f = validators('number');
    assert.equal(f('1.1e3'), 1.1e3);
    assert.equal(f('0.001'), 0.001);
    assert.equal(f('NA'), null);
    assert.throws(
      function(){
        f('a');
      }, /a is not a number/
    );  
  });

  it('should validate integer', function(){
    var f = validators('integer');
    assert.equal(f('1.1e3'), 1100);
    assert.equal(f('0'), 0);
    assert.equal(f('1.0'), 1);
    assert.throws(
      function(){
        f('0.1');
      }, /0.1 is not an integer/
    );
    assert.throws(
      function(){
        f('a');
      }, /a is not an integer/
    );
  });

  it('should validate date', function(){
    var f = validators('date');
    assert.equal(f('2013-11-13'), Date.parse('2013-11-13'));
    assert.throws(
      function(){
        f('2013/11/13');
      }, /2013\/11\/13 is not an ISO 8601 date/
    );
  });

  it('should validate datetime', function(){
    var f = validators('datetime');
    assert.equal(f('2013-11-13T20:11:21+01:00'), Date.parse('2013-11-13T20:11:21+01:00'));
  });

  it('should validate boolean', function(){
    var f = validators('boolean');
    assert.equal(f('true'), true);
    assert.equal(f('1'), true);
    assert.equal(f('false'), false);
    assert.equal(f('0'), false);
    assert.throws(
      function(){
        f('a');
      }, /a is not a boolean/
    );
  });

  it('should validate JSON', function(){
    var f = validators('json');
    assert.deepEqual(f('{"a":1}'), {a:1});
    assert.deepEqual(f('[1,2]'), [1,2]);
    assert.throws(
      function(){
        f('a');
      }, /a is not JSON/
    );
  });

  it('should validate everything else', function(){
    var f = validators('whatever');
    assert.deepEqual(f('x'), 'x');
  });

});
