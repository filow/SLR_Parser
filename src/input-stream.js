(function(global,undefined){
  function InputStream(input){
    this.pos = 0;
    this.line = 1;
    this.col = 0;
    this.input = input;
  }

  InputStream.fn = InputStream.prototype;
  InputStream.fn.next = function(){
    var ch = this.input.charAt(this.pos++);
    if (ch == "\n"){
      this.line++;
      this.col = 0;
    }else{
      this.col++;
    }
    return ch;
  };
  InputStream.fn.getPos = function(){
    return {line: this.line, col: this.col}
  };
  InputStream.fn.peek = function(){
    return this.input.charAt(this.pos);
  };
  InputStream.fn.eof = function() {
    return this.peek() === "";
  };
  InputStream.fn.croak = function (msg) {
    throw new Error(msg + " (" + this.line + ":" + this.col + ")");
  };

  if(typeof module === 'object' && typeof module.exports === 'object'){
    module.exports = InputStream;
  }else{
    global.InputStream = InputStream;
  }
})(typeof window !== 'undefined'? window : this);