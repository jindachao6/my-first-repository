//棋盘，用于存储棋盘上各个点是否有落子
var chessBoard = [];
//我方标记true，电脑方false
var me = true;
//对局是否结束标记
var over = false;
//赢法数组
var wins = [];
//我方赢法的统计数组
var myWin = [];
//电脑方的赢法统计数组
var computerWin = [];
// var btn = document.getElementById("btn");

//初始化棋盘
for( var i = 0;i < 15;i ++){
    chessBoard[i] = [];
    for(var j = 0; j < 15; j ++){
        chessBoard[i][j] = 0;
    }
}

//初始化赢法数组
for(var i = 0 ; i < 15 ; i ++){
    wins[i] = [];
    for(var j = 0 ; j < 15 ; j ++){
        wins[i][j] = [];
    }
}

//所有横线的赢法
var count = 0;
for( var i = 0 ; i < 15 ; i ++){
    for(var j = 0 ; j < 11 ; j ++){
        for(var k = 0 ; k < 5 ; k ++){
            wins[i][j+k][count] = true;
        }
        count ++;
    }
}

//所有竖线的赢法
for( var i = 0 ; i < 15 ; i ++){
    for(var j = 0 ; j < 11 ; j ++){
        for(var k = 0 ; k < 5 ; k ++){
            wins[j + k][i][count] = true;
        }
        count ++;
    }
}

//所有斜线的赢法
for( var i = 0 ; i < 11 ; i ++){
    for(var j = 0 ; j < 11 ; j ++){
        for(var k = 0 ; k < 5 ; k ++){
            wins[i + k][j + k][count] = true;
        }
        count ++;
    }
}

//所有反斜线的赢法
for( var i = 0 ; i < 11 ; i ++){
    for(var j = 14 ; j > 3 ; j --){
        for(var k = 0 ; k < 5 ; k ++){
            wins[i + k][j - k][count] = true;
        }
        count ++;
    }
}

//console.log(count);

//赢法计数，分别计算选手获胜的可能
for(var i = 0 ; i < count ; i ++){
    myWin[i] = 0;
    computerWin[i] = 0;
}

var chess = document.getElementById("chess");
var context = chess.getContext('2d');

//设置线条颜色
context.strokeStyle = "#BFBFBF";
//创建背景图片
var logo = new Image();
logo.src = "img/1.jpg";

logo.onload = function () {
    context.drawImage(logo,0,0,450,450);
    drawChessBoard();
    // oneStop(0,0,true);
    // oneStop(1,1,false);

}

//绘制棋盘
var drawChessBoard = function(){
    for(var i = 0; i< 15;i++){
        //横
        context.moveTo(15 + i*30, 15);
        context.lineTo(15 + i*30,435);
        context.stroke();
        //竖
        context.moveTo(15,15 + i*30);
        context.lineTo(435,15 + i*30);
        context.stroke();

    }
}

//落子实现
var oneStop = function(i,j,me){

    //画棋子
    context.beginPath();
    context.arc(15 + i*30,15 + j*30,13,0,2 * Math.PI);
    context.closePath();
    //生成渐变样式
    var gradient = context.createRadialGradient(15 + i*30 + 2,15 + j*30 - 2,13,15 + i*30 + 2,15 + j*30 - 2,0);
    if(me){
       gradient.addColorStop(0,"#0A0A0A");
       gradient.addColorStop(1,"#676767");
    }else{
       gradient.addColorStop(0,"#D1D1D1");
       gradient.addColorStop(1,"#F9F9F9");
    }
    context.fillStyle = gradient;
    context.fill();
}

//开始游戏
chess.onclick = function (ev) {

    //禁用当前按钮
    // btn.disabled = true;
    // btn.style.color = "darkgrey";

    //判断对局是否完成或是否轮到自己下棋
    if(over){
        btn.disabled = false;
        btn.style.color = "brown";
        return;
    }
    if(!me){
        return;
    }
    //获取鼠标点击位置坐标，并转换为落点坐标
    var x = ev.offsetX;
    var y = ev.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    //判断当前落点是否已有妻子，如果没有则落子成功
    if(chessBoard[i][j] == 0){
        oneStop(i,j,me);
        chessBoard[i][j] = 1;

        for(var k = 0 ; k < count ; k ++){
            if(wins[i][j][k]){
                myWin[k] ++;
                computerWin[k] = 999;

                if(myWin[k] == 5){
                    window.alert("你赢了");
                    over = true;

                }
            }
        }
        //如果游戏未结束
        if(!over){
            //游戏权交由对方
            me = !me;
            //计算机执行AI算法
            computerAI();
        }
    }

}
//电脑AI
var computerAI = function(){
    //定义变量，分数统计数组和坐标存储变量
    var myScore = [];
    var computerScore = [];

    var max = 0;
    var u = 0 ,v = 0;
    //分数统计初始化
    for(var i = 0 ; i < 15 ; i ++){
        myScore[i] = [];
        computerScore[i] = [];
        for(var j = 0; j < 15 ; j ++){
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    //分数（权重统计）&计算，获取坐标
    for(var i = 0 ; i < 15 ; i ++){
        for(var j = 0 ; j < 15; j ++){
            //判断当前位置是否没有落子
            if(chessBoard[i][j] == 0){
                //计算分数
                for(var k = 0; k < count ; k ++){
                    if(wins[i][j][k]){
                        if(myWin[k] == 1){
                            myScore[i][j] += 200;
                        }else if(myWin[k] == 2){
                            myScore[i][j] += 400;
                        }else if(myWin[k] == 3){
                            myScore[i][j] += 2000;
                        }else if(myWin[k] == 4){
                            myScore[i][j] += 10000;
                        }

                        if(computerWin[k] == 1){
                            computerScore[i][j] += 220;
                        }else if(computerWin[k] == 2){
                            computerScore[i][j] += 420;
                        }else if(computerWin[k] == 3){
                            computerScore[i][j] += 2100;
                        }else if(computerWin[k] == 4){
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                //通过判断获取最优的落子点
                if(myScore[i][j] > max){
                    max = myScore[i][j];
                    u = i;
                    v = j;
                }else if(myScore[i][j] == max){
                    if(computerScore[i][j] > computerScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
                if(computerScore[i][j] > max){
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                }else if(computerScore[i][j] == max){
                    if(myScore[i][j] > myScore[u][v]){
                        u = i;
                        v = j;
                    }
                }


            }
        }
    }

    oneStop(u,v,false);
    chessBoard[u][v] = 2;

    for(var k = 0 ; k < count ; k ++){
        if(wins[u][v][k]){
            computerWin[k] ++;
            myWin[k] = 999;
            if(computerWin[k] == 5){
                window.alert("计算机赢了");
                over = true;

            }
        }
    }
    if(!over){
        me = !me;
    }
}

// btn.onclick = function(){
//     window.location.reload();
// }