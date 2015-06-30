# 基于SLR文法的四则运算解释器  -- JS 实现

演示地址: 
## 使用方法

### 在网页上使用
1. 首先安装gulp,nodejs与npm请自行安装

        npm install -g gulp
    
2. 在项目目录运行

        npm install

3. 再运行gulp命令,开启一个服务器

        gulp
    
4. 打开浏览器,输入 http://localhost:5000/, 即可查看演示页面

5. 如果希望对其中的某些文件做一些更改,可以直接编辑,然后再浏览器上刷新即可.如果您使用chrome浏览器并安装了livereload插件,则页面会自动更新

6. 如果需要部署,可以先运行gulp dist命令来生成生产环境下的资源文件. 您仅需要上传index.html与dist文件夹到服务器即可.

### 在命令行中使用
    
    var InputStream = require('./src/input-stream');
    var Lexer = require('./src/lexer');
    var Parser = require('./src/parser');

    // 首先实例化InputStream和Lexer
    var ll = new Lexer(new InputStream(input));
    // 其次实例化parser
    var pser = new Parser(ll);
    // 由于出错信息会通过异常方式抛出,所以最好用try...catch...块包裹
    try{
      // 使用parser的parse命令,可得到解释的结果和一个后缀表达式
      var result = pser.parse();
      console.log("结果:  ",result.value);
      console.log("后缀表达式:  ",result.re);
    }catch(e){
      console.error(e.toString());
    }

更多用法您可以在test文件夹中找到


## 文法

    0  S->L
    1  L->E;L
    2  L->null
    3  E->E op1 T
    4  E-> T
    5  T->T op2 F
    6  T->F
    7  F->(E)
    8  F->id
    9  F->num
    id-> (letter)(letter|digit)*
    num-> (digit)+
    op1-> +|-
    op2-> *|/|mod|div
    
## 通过创建识别活前缀的有穷自动机而制作的表格

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
