var assert = require("assert");
var InputStream = require('../src/input-stream');
var Lexer = require('../src/lexer.js');

describe('Lexer',function(){
  it('#setInput',function(){
    var input1 = new InputStream('11+22');
    var input2 = new InputStream('33+44');
    var lexer = new Lexer(input1);
    lexer.setInput(input2);
    assert.equal(lexer.input, input2);
  });

  it('#getPos',function(){
    var input = new InputStream('12+34');
    var lexer = new Lexer(input);
    lexer.readNext();
    assert.deepEqual(lexer.getPos(),{line: 1, col: 3});
  });

  describe('#readNext',function(){
    var input = new InputStream('');
    var lexer = new Lexer(input);
    it('num',function(){
      lexer.setInput(new InputStream('11 22 33'));
      assert.deepEqual(lexer.readNext(),{type: 'NUM', value: 11});
      assert.deepEqual(lexer.readNext(),{type: 'NUM', value: 22});
      assert.deepEqual(lexer.readNext(),{type: 'NUM', value: 33});
      assert.deepEqual(lexer.readNext(),{type: ';', value: ';'});
      assert.deepEqual(lexer.readNext(),{type: '#', value: '#'});
    });

    it('id',function(){
      lexer.setInput(new InputStream('pi haha'));
      assert.deepEqual(lexer.readNext(),{type: 'ID', value: 'pi'});
      assert.deepEqual(lexer.readNext(),{type: 'ID', value: 'haha'});
    });

    it('op1',function(){
      lexer.setInput(new InputStream('+ -'));
      assert.deepEqual(lexer.readNext(),{type: 'OP1', value: '+'});
      assert.deepEqual(lexer.readNext(),{type: 'OP1', value: '-'});
    });

    it('op2',function(){
      lexer.setInput(new InputStream('* / mod div'));
      assert.deepEqual(lexer.readNext(),{type: 'OP2', value: '*'});
      assert.deepEqual(lexer.readNext(),{type: 'OP2', value: '/'});
      assert.deepEqual(lexer.readNext(),{type: 'OP2', value: 'mod'});
      assert.deepEqual(lexer.readNext(),{type: 'OP2', value: 'div'});
    });

    it('space', function(){
      lexer.setInput(new InputStream('     \n  \t  1 \n 2  \n    \t'));
      assert.deepEqual(lexer.readNext(),{type: 'NUM', value: 1});
      assert.deepEqual(lexer.readNext(),{type: 'NUM', value: 2});
    });

    it('Comment', function(){
      lexer.setInput(new InputStream(' #hahahah\n  1 \n 2  \n #hhahha   \t'));
      assert.deepEqual(lexer.readNext(),{type: 'NUM', value: 1});
      assert.deepEqual(lexer.readNext(),{type: 'NUM', value: 2});
    });

    it('()', function(){
      lexer.setInput(new InputStream('()'));
      assert.deepEqual(lexer.readNext(),{type: '(', value: '('});
      assert.deepEqual(lexer.readNext(),{type: ')', value: ')'});
    });

    it(';', function(){
      lexer.setInput(new InputStream(';'));
      assert.deepEqual(lexer.readNext(),{type: ';', value: ';'});
      assert.deepEqual(lexer.readNext(),{type: '#', value: '#'});
    });
  });

});
