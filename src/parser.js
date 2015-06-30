(function(global,undefined){
  var _ = require('underscore');
  // rules
  // 0  S->L
  // 1  L->E;L
  // 2  L->null
  // 3  E->E op1 T
  // 4  E-> T
  // 5  T->T op2 F
  // 6  T->F
  // 7  F->(E)
  // 8  F->id
  // 9  F->num

  var terminals = ["ID","NUM",";","OP1","OP2","(",")","#"];
  var action = [
  //  id    num   ;     op1   op2    (    )     #
    ["S6", "S7", "  ", "  ", "  ", "S5", "  ", "R2"],  //0
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "AC"],  //1
    ["  ", "  ", "S8", "S9", "  ", "  ", "  ", "  "],  //2
    ["  ", "  ", "R4", "R4", "S10", "  ", "R4", "  "],  //3
    ["  ", "  ", "R6", "R6", "R6", "  ", "R6", "  "],  //4
    ["S6", "S7", "  ", "  ", "  ", "S5", "  ", "  "],  //5
    ["  ", "  ", "R8", "R8", "R8", "  ", "R8", "  "],  //6
    ["  ", "  ", "R9", "R9", "R9", "  ", "R9", "  "],  //7
    ["S6", "S7", "  ", "  ", "  ", "S5", "  ", "R2"],  //8
    ["S6", "S7", "  ", "  ", "  ", "S5", "  ", "  "],  //9
    ["S6", "S7", "  ", "  ", "  ", "S5", "  ", "  "],  //10
    ["  ", "  ", "  ", "S9", "  ", "  ", "S15", "  "],  //11
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "R1"],  //12
    ["  ", "  ", "R3", "R3", "S10", "  ", "R3", "  "],  //13
    ["  ", "  ", "R5", "R5", "R5", "  ", "R5", "  "],  //14
    ["  ", "  ", "R7", "R7", "R7", "  ", "R7", "  "]  //15
  ];
  var nonTerminals = ["L","E","T","F"];
  var goto = [
    // L   E   T   F
    [1,2,3,4],    // 0
    [],           //1
    [],           //2
    [],           //3
    [],           //4
    [null, 11,3,4], //5
    [],           //6
    [],           //7
    [12,2,3,4],   //8
    [null,null,13,4],//9
    [null,null,null,14],//10
    [],           //11
    [],           //12
    [],           //13
    [],           //14
    []            //15
  ];
  function Parser(lexer){
    this.lexer = lexer;

    // 将给定的规则表解析为计算机容易使用的格式
    var parsed_action = [];
    for(var i = 0; i< action.length; i++){
      parsed_action[i] = [];
      for(var j = 0;j<terminals.length; j++){
        var v = action[i][j];
        // 移进项
        if (v.indexOf("S")==0){
          parsed_action[i][terminals[j]] = {action: 'shift', code: parseInt(v.substr(1))}
        }else if(v.indexOf("R")==0){
          parsed_action[i][terminals[j]] = {action: 'reduce', code: parseInt(v.substr(1))}
        }else if(v == 'AC'){
          parsed_action[i][terminals[j]] = {action: 'success'}
        }else{
          parsed_action[i][terminals[j]] = {action: 'error'}
        }
      }
    }
    this.action = parsed_action;
  }
  Parser.extend = function(fun_list){
    for(var fun in fun_list){
      if(_.isFunction(fun_list[fun])){
        Parser.prototype[fun] = fun_list[fun];
      }
    }
  };
  Parser.extend({
    _getGoto: function(nonT){
      return goto[this.codeStack.peek().code][nonTerminals.indexOf(nonT)];
    },
    _pushState: function(nonT,value){
      this.codeStack.push({code: this._getGoto(nonT), value: value});
    },
    _pop:function(){
      return this.codeStack.pop();
    },
    _reduce1:function(){
      var L = this._pop();
      this._pop();
      var E = this._pop();
      this._pushState('L',E.value.toString()+' '+ L.value.toString());
    },
    _reduce2:function(){
      this._pushState('L','');
    },
    _reduce3:function(){
      var T = this._pop().value;
      var op1 = this._pop();
      var E = this._pop().value;
      var result;
      switch(op1.value){
        case '+':
          result = E + T;
          break;
        case '-':
          result = E - T;
      }
      this._pushState('E',result);
    },
    _reduce4:function(){
      var num = this._pop();
      this._pushState('E',num.value);
    },
    _reduce5:function(){
      var num1 = this._pop().value;
      var op2 = this._pop();
      var num2 = this._pop().value;
      var result;
      switch(op2.value){
        case '*':
          result = num2 * num1;
          break;
        case '/':
        case 'div':
          if(num1 != 0){
            result = num2 / num1;
          }else{
            throw new Error('运行时错误: 除数不能为零');
          }

          break;
        case 'mod':
          result = num2 % num1;
      }

      this._pushState('T',result);
    },
    _reduce6:function(){
      var num = this._pop();
      this._pushState('T',num.value);
    },
    _reduce7:function(){
      this._pop();
      var num = this._pop();
      this._pop();
      this._pushState('F',num.value);
    },
    _reduce8:function(){
      var id = this._pop();
      if(id.value == 'pi'){
        this._pushState('F',3.14);
      }else{
        this._pushState('F',0);
      }

    },
    _reduce9:function(){
      var num = this._pop();
      this._pushState('F',num.value);
    }
  });
  Parser.extend({
    parse: function(){
      var errorMsg = "";
      this.codeStack = [{code:0,value: ''}];
      var word,action,isSuccess = false;
      Array.prototype.peek = function(){
        return this[this.length-1];
      };
      word = this.lexer.readNext();
      var result;
      while(!isSuccess){
        var cpeek = this.codeStack.peek();
        action = this.action[cpeek.code][word.type];
        switch (action["action"]){
          case 'shift':
            this.codeStack.push({code:action.code,value:word.value});
            word = this.lexer.readNext();
            break;
          case 'reduce':
            this['_reduce'+action.code]();
            break;
          case 'success':
            isSuccess = true;
            result = cpeek.value;
            break;
          case 'error':
            var errorPos = this.lexer.getPos();
            var expecting=[];
            for(var key in this.action[cpeek.code]){
              if(!this.action[cpeek.code].hasOwnProperty(key)) continue;
              if(this.action[cpeek.code][key]['action']!='error'){
                if(key == 'OP1'){
                  expecting.push('+');
                  expecting.push('-');
                }else if(key == 'OP2'){
                  expecting.push('*');
                  expecting.push('/');
                  expecting.push('DIV');
                  expecting.push('MOD');
                }else{
                  expecting.push(key);
                }

              }
            }

            errorMsg+="\nUnexpected "+ word.value +
              " in Line:"+ errorPos.line +
              " col: "+ errorPos.col +
              ", expecting "+ expecting.join(', ');

            var nextword = this.lexer.readNext();
            if(word.value=='#' && nextword.value=='#'){
              throw new SyntaxError(errorMsg);
            }else{
              word = nextword;
            }
        }
      }
      if(errorMsg.length!=0){
        throw new SyntaxError(errorMsg);
      }
      return result;
    }
  });
  if(typeof module === 'object' && typeof module.exports === 'object'){
    module.exports = Parser;
  }else{
    global.InputStream = Parser;
  }
})(typeof window !== 'undefined'? window : this);