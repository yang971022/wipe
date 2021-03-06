/*
author: wbf168@263.net
data：	2018-11-16
email:
*/
function Wipe(obj){
	this.conID = obj.id;
	this.cas = document.getElementById(this.conID);
	this.context = cas.getContext("2d");
	this._w = obj.width;
	this._h = obj.height;
	this.coverType = obj.coverType;//覆盖的是颜色还是图
	this.color = obj.color || "#666";//覆盖颜色
	this.imgUrl = obj.imgUrl; //覆盖图
	this.backImgUrl = obj.backImgUrl;//背景图
	this.cas.style.background = "url("+obj.backImgUrl+") center 0 no-repeat";
	this.cas.style.backgroundSize = "cover";
	this.radius = obj.radius;//涂抹的半径
	this.radius = 20; //涂抹的半径
	this.moveX = 0;
	this.moveY = 0;
	this.isMouseDown = false;//表示鼠标的状态，是否按下，默认为未按下false，按下true
	this.callback = obj.callback;
	this.transpercent = obj.transpercent;
	this.drawMask();
	this.addEvent();
}
//生成画布上的遮罩，默认为颜色#666
Wipe.prototype.drawMask=function(){
	if(this.coverType ==="color"){
		this.context.fillStyle=this.color;
		this.context.fillRect(0,0,this._w,this._h);
		this.context.globalCompositeOperation = "destination-out";
	}else if(this.coverType === "image"){
		//将imgurl指定的图片填充画布
		var img = new Image();
		var that =this;
		img.src = this.imgUrl;
		img.onload = function(){
		//裁剪图片
			that.context.drawImage(img,0,0,img.width,img.height,0,0,that._w,that._h);
			that.context.globalCompositeOperation = "destination-out";
	}
}
}
//drawT()画点和画线函数
//参数：如果只有两个参数，函数功能画圆，x1,y1即圆的中心坐标 
//如果传递四个参数，函数功能画线，x1,y1为起始坐标，x2,y2为结束坐标
Wipe.prototype.drawT = function(x1,y1,x2,y2){
	if( arguments.length === 2){
		//调用的是画点功能
		this.context.save();
		this.context.beginPath();
		this.context.arc(x1,y1,this.radius,0,2*Math.PI);
		this.context.fillStyle = "red";
		this.context.fill();
		this.context.restore();		
	}else if(arguments.length === 4){
		//调用的是画线功能
		this.context.save();
		this.context.lineCap = "round";
		this.context.lineWidth = this.radius*2;	
		this.context.beginPath();
		this.context.moveTo(x1,y1);
		this.context.lineTo(x2,y2);
		this.context.stroke();
		this.context.restore();		
	}else{
		return false;
	}	
}
//清除画布
Wipe.prototype.clearRect = function (){
	this.context.clearRect(0,0,this._w, this._h);
}
//获取透明点占整个画布的百分比
Wipe.prototype.getTransparencyPercent = function(){
	var t = 0;
	var imgData = this.context.getImageData(0,0,this._w,this._h);	
	for(var i =0; i<imgData.data.length; i+=4){
		var a = imgData.data[i+3];
		if( a === 0 ){
			t++;
		}
	}
	this.percent =  (t / (this._w*this._h) )*100;
	console.log("透明点的个数："+ t );
	console.log("占总面积"+ Math.ceil(this.percent) +"%" );	

	return this.percent.toFixed(2); //截取小数点两位
}
//添加自定义监听事件
Wipe.prototype.addEvent = function(){

	//device保存设备类型，如果是移动端则为true，PC端为false
	this.device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
	var clickEvtName = this.device ? "touchstart" : "mousedown";
	var moveEvtName = this.device ? "touchmove" : "mousemove";
	var endEvtName = this.device ? "touchend" : "mouseup";
	var that = this;
	this.cas.addEventListener(clickEvtName,function(evt){
		that.isMouseDown = true;
		var event = evt || window.event;
		//获取鼠标在视口的坐标，传递参数到drawPoint
		that.moveX = that.device ?  event.touches[0].clientX : event.clientX;
		that.moveY = that.device ?  event.touches[0].clientY : event.clientY;
		that.drawT(that.moveX,that.moveY);
	},false);
	//增加监听"mousemove",调用drawPoint函数
	this.cas.addEventListener(moveEvtName,function(evt){
		//判断，当isMouseDown为true时，才执行下面的操作
		if( !that.isMouseDown ){
			return false;
		}else{
			var event = evt || window.event;
			event.preventDefault();
			var x2 = this.device ? event.touches[0].clientX : event.clientX;
			var y2 = this.device ? event.touches[0].clientY : event.clientY;
			//drawPoint(context,a,b);
			that.drawT(that.moveX,that.moveY,x2,y2);
			//每次的结束点变成下一次划线的开始点
			that.moveX = x2;
			that.moveY = y2;
		}
	},false);
	this.cas.addEventListener(endEvtName,function(){
		//还原isMouseDown 为false
		that.isMouseDown = false;
		var percent = that.getTransparencyPercent();
		//调用同名的全局函数
		that.callback.call(null,percent);
		if( percent > that.transpercent){
			// alert("超过了50%的面积");
			//drawMask(context);
			that.clearRect();
		}		
	},false);
}
