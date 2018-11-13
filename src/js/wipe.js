var cas = document.getElementById('cas');
var context = cas.getContext("2d");
var _w = cas.width;
var _h = cas.height;
var moveX = 0;
var moveY = 0;
var radius = 20;//涂抹的半径
var isMouseDown = false;//表示鼠标的状态,是否按下,默认未按下false,按下true
var device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
// 判断是手机端还是PC端
var clickEvtName = device ? "touchstart" : "mousedown";
var moveEvtName = device ? "touchmove" : "mousemove";
var endEvtName = device ? "touchend" : "mouseup";
function drawRect(context){
	context.save();
	context.beginPath();
	context.fillStyle = "#666";
	context.fillRect(0,0,_w,_h);
	context.globalCompositeOperation = "destination-out";
}
function drawarv(context,moveX,moveY){
	console.log("传递的实参个数"+arguments.length);
	context.save();
	context.beginPath();
	context.arc(moveX,moveY,radius,0,2*Math.PI);
	context.fillStyle = "red";
	context.fill();
	context.restore();
}
function drawLine(context,x1,y1,x2,y2){
	console.log("传递的实参个数"+arguments.length);
	context.save();
	context.lineCap = "round";
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.lineWidth = radius*2;
	context.stroke();
	context.restore();
}
function arguments(context,x1,y1,x2,y2){
	
}
// 在canvas画布上监听自定义事件"mousedown",调用drawPoint函数
cas.addEventListener(clickEvtName,function(evt){
	var event = evt || window.event;
	//获取鼠标在视口的坐标,传递参数到drawPoint
	x1 = device ? event.touches[0].clientX : event.clientX;
	y1 = device ? event.touches[0].clientY : event.clientY;
	isMouseDown = true;
	drawarv(context,x1,y1);
},false);
cas.addEventListener(moveEvtName,function(evt){
	if (!isMouseDown ) {
		return false;
	}else{
		var event = evt || window.event;
		event.preventDefault();
		x2 = device ? event.touches[0].clientX : event.clientX;
		y2 = device ? event.touches[0].clientY : event.clientY;
		//drawPoint(context,a,b);
		drawLine(context,x1,y1,x2,y2);
		//每次的结束点变成下一次划线的开始点
		x1 = x2;
		y1 = y2;
	}
},false);
// 手势触摸
// cas.addEventListener("touchstart",function(evt){
// 	isMouseDown=true;
// 	var event = evt || window.event;
// 	//获取鼠标在视口的坐标,传递参数到drawPoint
// 	moveX = event.touches[0].clientX;
// 	moveY = event.touches[0].clientY;
// 	drawarv(context,moveX,moveY);
// },false);
// 手势滑动
// cas.addEventListener("touchmove",fn1,false);
// function fn1(evt){
// 	//判断,当isMouseDown为true时,才执行下面的操作
// 	if (!isMouseDown ) {
// 		return false;
// 	}else{
// 		var event = evt || window.event;
// 		event.preventDefault();
// 		var x2 = event.touches[0].clientX;
// 		var y2 = event.touches[0].clientY;
// 		//drawPoint(context,a,b);
// 		drawLine(context,x1,y1,x2,y2);
// 		//每次的结束点变成下一次划线的开始点
// 		x1 = x2;
// 		y1 = y2;
// 	}
// }
cas.addEventListener(endEvtName,function(){
	var c = 0;
	var a = context.getImageData(0,0,_w,_h);
		console.log(a);
	for (var j = 0; j < _h; j++) {
		for (var i = 0; i < _w; i++) {
			var f = ((_w*j)+i)*4+3;
			if (a.data[f] == 0) {	
				c++;
			}
		}
	}
	var tmb = c/(_w*_h)*100;
	console.log("占总面积"+ Math.round(tmb) +"%");
	if (tmb > 50) {
		clearRect(context);
		alert("超过了50%的面积");
	}
	isMouseDown = false;
},false);
// cas.addEventListener("touchend",function(){
// 	var c = 0;
// 	var a = context.getImageData(0,0,_w,_h);
// 		console.log(a);
// 	for (var j = 0; j < _h; j++) {
// 		for (var i = 0; i < _w; i++) {
// 			var f = ((_w*j)+i)*4+3;
// 			if (a.data[f] == 0) {	
// 				c++;
// 			}
// 		}
// 	}
// 	var tmb = c/(_w*_h)*100;
// 	console.log(Math.round(tmb));
// 	if (tmb > 60) {
// 		clearRect(context);
// 	}
// 	isMouseDown = false;
// },false);
function clearRect(context){
	context.clearRect(0,0,_w,_h);
}
window.onload = function(){
	drawRect(context);
};