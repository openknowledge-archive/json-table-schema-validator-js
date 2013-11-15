var validators = require('../lib/validators')
  , Validator = require('../index')
  , Readable = require('stream').Readable
  , assert = require('assert');

describe('json schema table validator', function(){

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
      assert.deepEqual(f('2013-11-13'), new Date('2013-11-13'));
      assert.throws(
        function(){
          f('2013/11/13');
        }, /2013\/11\/13 is not an ISO 8601 date/
      );
    });

    it('should validate datetime', function(){
      var f = validators('datetime');
      assert.deepEqual(f('2013-11-13T20:11:21+01:00'), new Date('2013-11-13T20:11:21+01:00'));
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


  describe('validator transform stream', function(){
    var schema = {
      "fields": [
        {"name": "a", "type": "string"},
        {"name": "b", "type": "integer"},
        {"name": "c", "type": "number"},
        {"name": "d", "type": "date"}
      ]
    };

    it('should create a validator transform stream properly coercing the values', function(done){
      var data = [
        {"a": "a", "b": "1", "c": "1.2", "d": "2013-11-13"},
        {"a": "x", "b": "2", "c": "2.3", "d": "2013-11-14"},
        {"a": "y", "b": "3", "c": "3.4", "d": "2013-11-15"}
      ];

      var expected = [
        {"a": "a", "b": 1, "c": 1.2, "d": new Date("2013-11-13")},
        {"a": "x", "b": 2, "c": 2.3, "d": new Date("2013-11-14")},
        {"a": "y", "b": 3, "c": 3.4, "d": new Date("2013-11-15")}
      ];

      var s = new Readable({objectMode:true});
      data.forEach(function(x){
        s.push(x);
      });
      s.push(null);

      var v = s.pipe(new Validator(schema));
      v.on('error', function(err){ throw err;});

      var counter = 0;
      v.on('data', function(obj){
        for(var key in obj){
          if(key === 'd'){
            assert.deepEqual(obj[key], expected[counter][key]);          
          } else {
            assert.strictEqual(obj[key], expected[counter][key]);          
          }
        }
        counter++;
      });

      v.on('end', done);
    });


    it('should throw on validation error', function(done){
      var s = new Readable({objectMode:true});
      s.push({"a": "y", "b": "3", "c": "3.4", "d": "2013/11/15"});
      s.push(null);

      var v = s.pipe(new Validator(schema));
      v.on('error', function(err){
        assert.equal('2013/11/15 is not an ISO 8601 date', err.message);
        done();
      });
    });

    it('should work when schema is {}', function(done){
      var expected = {"a": "y", "b": "3", "c": "3.4", "d": "2013/11/15"};
      var s = new Readable({objectMode:true});
      s.push(expected);
      s.push(null);

      var v = s.pipe(new Validator({}));
      v.on('data', function(data){
        assert.deepEqual(data, expected);
      });
      v.on('error', function(err) {throw err;});
      v.on('end', done);
    });


  });

});
