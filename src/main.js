var InputStream = require('./input-stream');
var Lexer = require('./lexer');
var Parser = require('./parser');
var ll = new Lexer(new InputStream("(4 - 5) * 6 DIV 4 + 8 MOD 2 ; 4*5;pi;"));
var pser = new Parser(ll);
console.log(pser.parse());
//var result;
//while(result = ll.readNext()){
//    console.log(result);
//}
