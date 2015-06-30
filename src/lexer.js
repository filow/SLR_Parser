(function(global,undefined){
  var _ = require('underscore');

  // 构造函数
  function Lexer(input){
    this.input = input;
  }

  // 为Lexer动态添加实例函数
  Lexer.extend = function(fun_list){
    for(var fun in fun_list){
      if(_.isFunction(fun_list[fun])){
        Lexer.prototype[fun] = fun_list[fun];
      }
    }
  };

  // 添加检查器函数
  Lexer.addChecker =  function (name, pattern){
    if(typeof pattern === 'string'){
      checker = function (char){
        return pattern.indexOf(char) >= 0;
      };
    }else{
      checker = function (char){
        return pattern.test(char);
      };
    }
    Lexer["is" + name] = checker;
  };

  // 批量添加检查器
  Lexer.addCheckers = function (checkers){
    _.each(checkers,function(val, key){
      Lexer.addChecker(key, val);
    });
  };

  Lexer.addCheckers({
    Space: ' \t\n\r',
    Digit: /[0-9]/,
    Letter: /[a-zA-Z]/,
    Oper: '+-*/();'
  });

  Lexer.extend({
    setInput: function (another){
      this.input = another;
    },
    getPos: function(){
      return this.input.getPos();
    },
    // 一直读取输入直到eof或者判断函数不成立
    readWhile: function (checker){
      var str = "";
      while(!this.input.eof() && checker(this.input.peek())){
        str += this.input.next();
      }
      return str;
    },
    // 读取数字,支持小数
    readNumber: function (){
      var has_dot = false;
      var number = this.readWhile(function(ch){
        if (ch === '.'){
          if(has_dot) return false;
          has_dot = true;
          return true;
        }
        return Lexer.isDigit(ch);
      });
      return { type: 'NUM', value: parseFloat(number)};

    },

    // 读取标示符,会自动把关键字识别出来
    readIdent: function(){
      var id = this.readWhile(function(ch){
        return /[a-zA-Z0-9]/.test(ch);
      });
      switch(id.toLowerCase()){
        case 'div':
        case 'mod':
          return {type: 'OP2', value: id.toLowerCase()};
      }
      return {type: 'ID', value: id};
    },

    readNext: function (){
      // 直接读取所有空白符
      this.readWhile(Lexer.isSpace);
      // 如果输入流已经结束,就返回空
      if (this.input.eof()) return {type: '#', value:'#'};

      var ch = this.input.peek();

      // 去除注释
      if (ch === '#'){
        this.readWhile(function(c){
          return c!='\n';
        });
        this.input.next();
        this.readWhile(Lexer.isSpace);
        ch = this.input.peek();
      }
      // 首先读入数字常量
      if (Lexer.isDigit(ch)) return this.readNumber();
      // 其次读取标识符
      if (Lexer.isLetter(ch)) return this.readIdent();

      // 读取运算符
      if (Lexer.isOper(ch)){
        //var oper = this.readWhile(Lexer.isOper);
        var oper = ch;
        this.input.next();
        if(oper == '+' || oper == '-'){
          return {type: 'OP1', value: oper}
        }else if(oper == '*' || oper == '/'){
          return {type: 'OP2', value: oper}
        }else{
          return {type: oper, value: oper}
        }
      }

      this.input.croak("词法错误: " + ch + "是一个非法字符");
    }
  });

  if(typeof module === 'object' && typeof module.exports === 'object'){
    module.exports = Lexer;
  }else{
    global.InputStream = Lexer;
  }
})(typeof window !== 'undefined'? window : this);