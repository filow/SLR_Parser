var InputStream = require('./input-stream');
var Lexer = require('./lexer');
var Parser = require('./parser');
var ll = new Lexer(new InputStream("4*5;6*()"));
var pser = new Parser(ll);
try{
  console.log(pser.parse());
}catch(e){
  console.error(e.toString());
}

//var result;
//while(result = ll.readNext()){
//    console.log(result);
//}
