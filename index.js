var InputStream = require('./src/input-stream');
var Lexer = require('./src/lexer');
var Parser = require('./src/parser');
var readline = require('readline');


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.question("请输入一个四则运算表达式:  ", function(input) {
  var ll = new Lexer(new InputStream(input));
  var pser = new Parser(ll);
  try{
    var result = pser.parse();
    console.log("结果:  ",result.value);
    console.log("后缀表达式:  ",result.re);
  }catch(e){
    console.error(e.toString());
  }

  rl.close();
});
