(function(global,undefined){
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
  var unparsed_action = [
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
  // 将给定的规则表解析为计算机容易使用的格式
  var action = [];
  for(var i = 0; i< unparsed_action.length; i++){
    action[i] = [];
    for(var j = 0;j<terminals.length; j++){
      var v = unparsed_action[i][j];
      // 移进项
      if (v.indexOf("S")==0){
        action[i][terminals[j]] = {action: 'shift', code: parseInt(v.substr(1))}
      }else if(v.indexOf("R")==0){
        action[i][terminals[j]] = {action: 'reduce', code: parseInt(v.substr(1))}
      }else if(v == 'AC'){
        action[i][terminals[j]] = {action: 'success'}
      }else{
        action[i][terminals[j]] = {action: 'error'}
      }
    }
  }

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
    this.action = action;
  }
  Parser.extend = function(fun_list){
    for(var fun in fun_list){
      if(typeof fun_list[fun] === 'function'){
        Parser.prototype[fun] = fun_list[fun];
      }
    }
  };
  Parser.extend({
    // 获得在当前状态下下一个非终结符为nonT的情况下应当推入栈的状态
    _getGoto: function(nonT){
      return goto[this.codeStack.peek().code][nonTerminals.indexOf(nonT)];
    },
    // 将新状态推入栈
    _pushState: function(nonT, value, re){
      // re表示后缀表达式字符串
      var rexpression = re.map(function(item){
        return item.re;
      }).join(' ');
      this.codeStack.push({code: this._getGoto(nonT), value: value,re: rexpression});
    },
    // 从状态栈中取出一个状态
    _pop:function(){
      return this.codeStack.pop();
    },
    // reduce1-9,用于规约相应的规则
    _reduce1:function(){
      var L = this._pop();
      var f = this._pop();
      var E = this._pop();
      this._pushState('L',E.value.toString()+' '+ L.value.toString(),[E, L, f]);
    },
    _reduce2:function(){
      this._pushState('L','',[]);
    },
    _reduce3:function(){
      var T = this._pop();
      var op1 = this._pop();
      var E = this._pop();
      var result;
      switch(op1.value){
        case '+':
          result = E.value + T.value;
          break;
        case '-':
          result = E.value - T.value;
      }
      this._pushState('E',result,[E, T, op1]);
    },
    _reduce4:function(){
      var num = this._pop();
      this._pushState('E',num.value,[num]);
    },
    _reduce5:function(){
      var num1 = this._pop();
      var op2 = this._pop();
      var num2 = this._pop();
      var result;
      switch(op2.value){
        case '*':
          result = num2.value * num1.value;
          break;
        case '/':
        case 'div':
          if(num1 != 0){
            result = num2.value / num1.value;
          }else{
            throw new Error('运行时错误: 除数不能为零');
          }

          break;
        case 'mod':
          result = num2.value % num1.value;
      }

      this._pushState('T',result,[num2,num1,op2]);
    },
    _reduce6:function(){
      var num = this._pop();
      this._pushState('T',num.value,[num]);
    },
    _reduce7:function(){
      var l = this._pop();
      var num = this._pop();
      var r = this._pop();
      this._pushState('F',num.value,[num]);
    },
    _reduce8:function(){
      var id = this._pop();
      if(id.value == 'pi'){
        this._pushState('F',3.14,[id]);
      }else{
        this._pushState('F',0,[id]);
      }

    },
    _reduce9:function(){
      var num = this._pop();
      this._pushState('F',num.value,[num]);
    }
  });
  Parser.extend({
    parse: function(){
      // 错误信息汇总
      var errorMsg = "";
      // 初始化状态栈
      this.codeStack = [{code:0,value: ''}];

      var word,action,isSuccess = false;
      // 为Array添加peek函数,方便使用
      Array.prototype.peek = function(){
        return this[this.length-1];
      };

      // 先取一个token
      word = this.lexer.readNext();
      var result;
      while(!isSuccess){
        // 取得状态栈第一个状态,并查找在输入为word的情况下对应的动作
        var cpeek = this.codeStack.peek();
        action = this.action[cpeek.code][word.type];

        switch (action["action"]){
          // 移进
          case 'shift':
            this.codeStack.push({code:action.code,value:word.value, re: word.value.toString()});
            word = this.lexer.readNext();
            break;
          // 规约
          case 'reduce':
            this['_reduce'+action.code]();
            break;
          // 接受
          case 'success':
            isSuccess = true;
            result = {value: cpeek.value, re: cpeek.re};
            break;
          // 错误处理
          case 'error':
            // 取得错误位置
            var errorPos = this.lexer.getPos();
            // 获得期望的符号串
            var expecting=[];
            for(var key in this.action[cpeek.code]){
              // 排除非所需属性的干扰
              if(!this.action[cpeek.code].hasOwnProperty(key)) continue;
              // 当对应的动作不是error时才推入
              if(this.action[cpeek.code][key]['action']!='error'){
                // 将op1 和op2转换回原来的符号
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
            // 拼接错误信息
            errorMsg+="\nUnexpected "+ word.value +
              " in Line:"+ errorPos.line +
              " col: "+ errorPos.col +
              ", expecting "+ expecting.join(', ');
            // 比对当前token和下一个token,如果都是#,那么认为已经到文件末尾,直接抛出异常
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