var assert = require("assert");
var InputStream = require('../src/input-stream');

describe('InputStream',function(){
  var input = '12+34*56';

  it('#next',function(){
    var is = new InputStream(input);
    for(var i = 0; i<input.length; i++){
      assert.equal(is.next(),input[i]);
    }
    assert.equal(is.next(),';');
    assert.equal(is.next(),'');
  });

  it('#getPos',function(){
    var is = new InputStream(input);
    for(var i = 0; i<3; i++){ is.next(); }
    assert.deepEqual(is.getPos(),{line: 1, col: 4});
  });

  it('#peek',function(){
    var is = new InputStream(input);
    for(var i = 0; i<3; i++){ is.next(); }
    assert.equal(is.peek(),'3');
    is.next();
    assert.equal(is.peek(),'4');
  });

  it('#eof',function(){
    var is = new InputStream(input);
    for(var i = 0; i<3; i++){ is.next(); }
    assert.equal(is.eof(),false);
    for(i = 0; i<input.length-3+1; i++){ is.next(); }
    assert.equal(is.eof(),true);
  });


});