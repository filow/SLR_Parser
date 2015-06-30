var InputStream = require('./input-stream');
var Lexer = require('./lexer');
var Parser = require('./parser');
var $ = require('jquery');
$(document).ready(function(){
  $('#inputArea').focus();
  $('#inputArea').keyup(function(){
    var ll = new Lexer(new InputStream($(this).text()));
    var pser = new Parser(ll);
    try{
      var result = pser.parse();
      $('#rorder').html(result.re);
      $('#result').html('<div class="success">'+result.value+"</div>");
    }catch(e){
      $('#result').html('<div class="error">'+e.toString().replace('\n',"<br>")+"</div>");
    }
  });

});