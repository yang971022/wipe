var canvas = document.getElementById("cas")
var context= canvas.getContext("2d");
var _w = canvas.width;
var _h = canvas.height;
var t =0;
var raduis = 20;//涂抹半径
var moveX = 0;var moveY = 0;
var isMouseDown = false;
//表示鼠标的状态，是否按下，默认为未按下false，按下true
//生成画布上的遮罩，默认颜色为#666
function drawMask(context){
	context.fillStyle = "#666";
	context.fill();
	context.fillRect(0,0,_w,_h);
	context.globalCompositeOperation = "destination-out";
}
//在画布上画半径为30的圆
function drawPoint(context,moveX,moveY){
	context.save();
	context.beginPath();
	context.arc(moveX,moveY,raduis,0,2*Math.PI);
	context.fillStyle = "rgba(255,0,0,255)";
	context.fill();
	context.stroke();
}
// var X1=0;var Y1 =0;var X2=0;var Y2 =0;
function drawLine(context,x1,y1,x2,y2){
	if (isMouseDown) {
		context.save();
		//转换，向右下方移动
		//以原点为起点，绘制一条线
		context.beginPath();
		context.moveTo(x1,y1);
		context.lineTo(x2,y2);
		context.lineWidth=raduis*2;
		context.lineCap="round";
		context.stroke();
		//恢复原有绘图状态
		context.restore();
	}	
}
	//在canvas画布上监听自定义事件"mousedown",调用drawPoint函数
cas.addEventListener("mousedown",function(evt){
	isMouseDown = true;
	var event = evt || window.event;
	//获取鼠标在视口的坐标，传递参数到drawPoint
	moveX = event.clientX;
	moveY = event.clientY;
	drawPoint(context,moveX,moveY);
	cas.addEventListener("mousemove",fn1,false);
},false);
//触摸拖拽开始

function fn1(evt){
	//判断当isMOuseDown为true时，才执行下面操作
	// if( !isMouseDown){
	// 	isMouseDown = true;
	// }else{
		var event = evt || window.event;
		var x2 = event.clientX;
		var y2 = event.clientY;
		drawLine(context,moveX,moveY,x2,y2);
		//每次的结束点变成下一次开始的点
		moveX = x2;
		moveY = y2;
	// }	
};
		
cas.addEventListener('mouseup',function(evt){
	// cas.removeEventListener("mouseup",fn1,false);
	// isMouseDown还原为false
	isMouseDown = false;
	if(getTransparencyPercent(context)>50){
		// alert("超过了50%的面积");
		alert("这是我曾血拼打下的江山，曾经追她穷如狗，现在看她嫌她丑，扔之可惜，牵之傻逼!!!")
		// drawMask(context);
		clearRect(context);
	}
},false);

function clearRect(context){
	context.clearRect(0,0,_w,_h);
}
function getTransparencyPercent(context){
	var imgData = context.getImageData(0,0,_w,_h);
	for(var i=0;i<imgData.data.length;i+=4){
		var a = imgData.data[i+3];
		if ( a == 0){
			t++;
		}
	}	
	var percent = (t / (_w*_h) )*100;
	console.log("透明点个数：" + t + "个");
	console.log("占总面积"+ Math.ceil(percent)+"%");
	return Math.ceil(percent);
};
window.onload = function(){
	drawMask(context);
	// drawPoint(context);
	drawLine(context);
};