var assert = require("assert");
var InputStream = require('../src/input-stream');
var Lexer = require('../src/lexer');
var Parser = require('../src/parser');



describe('单条四则运算', function(){
  function parse_value(input){
    var ll = new Lexer(new InputStream(input));
    var pser = new Parser(ll);
    var value = pser.parse().value;
    return value.substr(0,value.length-1);
  }
  describe('#二元运算', function(){
    it('加法', function(){
      assert.equal(parse_value('2+3'), '5');
    });
    it('减法', function(){
      assert.equal(parse_value('30-10'), '20');
    });
    it('乘法', function(){
      assert.equal(parse_value('4*5'), '20');
    });
    it('除法', function(){
      assert.equal(parse_value('100/5'), '20');
      assert.equal(parse_value('100 div 5'), '20');
    });
    it('取余', function(){
      assert.equal(parse_value('100 mod 5'), '0');
    });
  });


  describe('#四则运算',function(){
    it('加减乘除', function(){
      assert.equal(parse_value('2+3-8*2/4'), '1');
    });
    it('加减乘除取余', function(){
      assert.equal(parse_value('100+3-8*2/4 mod 2'), '103');
    });
    it('带括号的四则运算', function(){
      assert.equal(parse_value('(100+(3-8)*2/4) mod 2'), '1.5');
    });
  });


});

describe('多式运算', function(){
  it('三式', function(){
    var ll = new Lexer(new InputStream('1;1+1;1+1-2+3'));
    var pser = new Parser(ll);
    var value = pser.parse().value;
    assert.equal(value,'1 2 3 ');
  });
});

describe('后缀表达式', function(){
  function parse_re(input){
    var ll = new Lexer(new InputStream(input));
    var pser = new Parser(ll);
    return pser.parse().re;
  }
  it('简单四则运算',function(){
    assert.equal(parse_re('1+2*5/(4-2)'), '1 2 5 * 4 2 - / +  ;');
  });

  it('多式运算',function(){
    assert.equal(parse_re('1+2*5/(4-2); (5*4-3+2) mod 3'), '1 2 5 * 4 2 - / + 5 4 * 3 - 2 + 3 mod  ; ;');
  });
});