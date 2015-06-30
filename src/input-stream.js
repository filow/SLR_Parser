(function(global,undefined){
  function InputStream(input){
    // 存储当前的输入点位置
    this.pos = 0;
    this.line = 1;
    this.col = 0;
    this.input = input;
  }

  InputStream.fn = InputStream.prototype;

  // 获得下一个输入的字符
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

  // 获得当前的输入点位置
  InputStream.fn.getPos = function(){
    return {line: this.line, col: this.col}
  };
  // 获得当前字符
  InputStream.fn.peek = function(){
    return this.input.charAt(this.pos);
  };
  // 判断是否已读完
  InputStream.fn.eof = function() {
    return this.peek() === "";
  };
  // 输出错误
  InputStream.fn.croak = function (msg) {
    throw new Error(msg + " (" + this.line + ":" + this.col + ")");
  };

  if(typeof module === 'object' && typeof module.exports === 'object'){
    module.exports = InputStream;
  }else{
    global.InputStream = InputStream;
  }
})(typeof window !== 'undefined'? window : this);