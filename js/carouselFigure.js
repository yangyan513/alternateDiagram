function carouselFigure(element,params){
	var cf = this;
	var ele = $(element);//初始元素
	var newEle;//修改以后的元素
	var index = 0;
	var isPC;
	var autoScroll;
	this.obj = {};
	this.onOff = {
		changePageEvent:true,//前后切换页事件绑定
		loop:true,//是否循环
		autoLoop:false,//自动滚动
		autoLoopTime:3000,//自动滚动间隔时间
		resizeEvent:false,//是否随屏幕大小改变
		paginationEvent:true,//页码点是否绑定跳转事件
	};
	this.init = function(){
		isPC = cf.pcFlag();
		if(ele.length == 0){
			console.log("对象元素没有传值");
			return;
		}else{
			if(params && (params.constructor == Object)){
				for(var key in params){
					cf.onOff[key] = params[key];
				}
			}else{
				console.log("参数格式不对，应该为Object");
			}
			cf.obj.width = ele.width();
			cf.obj.height = ele.height();
			cf.setInitPosition(); 
		}
	};
	this.setInitPosition = function(){
		var liList = ele.find(".carouseFigureBox-img li"),//不包含重新创建的收尾两张图片
			len = liList.length;
		if(len == 0){
			console.log("没有可循环的图片信息");
			return;
		}
		liList.css("width",(cf.obj.width)+"px");
		cf.obj.liList = liList;
		cf.paginationEvent();
		cf.obj.pagination = newEle.find(".carouseFigureBox-pagination span");
		if(len > 1){
			cf.autoScroll();
			if(cf.onOff.loop == true){
				cf.loop();
				liList.eq(1).addClass("activeC");
				index++;
				ele.find(".carouseFigureBox-img").css({"transform":"translateX("+(-cf.obj.width*index)+"px)","transition-duration":"300ms"});
				ele.find(".carouseFigureBox-img").css("width",(100 * (len+2))+"%");
			}else{
				liList.eq(1).addClass("activeC");
				ele.find(".carouseFigureBox-img").css("width",(100 * len)+"%");
			}
			cf.eventBind();
		}
		if(cf.onOff.changePageEvent == true){
			cf.pageBind();
		}
		if(cf.onOff.resizeEvent == true){
			cf.resizeEvent();
		}
	};
	//窗口大小改变时，轮番图也随着改变
	this.resizeEvent = function(){
		window.onresize = function(){
			newEle = $(ele);
			cf.obj.width = newEle.width();
			cf.obj.height = newEle.height();
			newEle.find(".carouseFigureBox-img li").css("width",(cf.obj.width)+"px");
			newEle.find(".carouseFigureBox-img").css({"transform":"translateX("+ (-cf.obj.width * index) +"px)","transition-duration":"0ms"});
		};
	};
	//跳转页面信息
	this.paginationEvent = function(){
		ele.find(".carouseFigureBox-pagination span");
		var content = "";
		for(var i=0;i<cf.obj.liList.length;i++){
			content += "<span "+(i==0?"class='activeS'":'')+"></span>";
		}
		ele.find(".carouseFigureBox-pagination").html(content);
		newEle = $(element);
		if(cf.onOff.paginationEvent == true){
			var pagination = newEle.find(".carouseFigureBox-pagination span");
			pagination.on("click",function(){
				var pagIndex = pagination.index(this)+1;
				if(index == pagIndex) return;
				index = pagIndex;
				cf.autoScrollFun();
			});
		}
	};
	//首尾循环连接
	this.loop = function(){
		var liList = cf.obj.liList;
		var firstImg = liList.eq(0).find("img").attr("src");
		var lastImg = liList.eq(liList.length-1).find("img").attr("src");
		ele.find(".carouseFigureBox-img").append('<li style="width:'+cf.obj.width+'px;"><img src="'+firstImg+'"/></li>');
		ele.find(".carouseFigureBox-img").prepend('<li style="width:'+cf.obj.width+'px;"><img src="'+lastImg+'"/></li>');
		newEle = $(element);
	};
	//自动滚动
	this.autoScroll = function(){
		if(cf.onOff.autoLoop){
			autoScroll = setInterval(function(){
				index++;
				cf.autoScrollFun();
			},cf.onOff.autoLoopTime);
		}
	};
	//停止自动滚动
	this.stopAutoScroll = function(){
		clearInterval(autoScroll);
	};
	this.autoScrollFun = function(){
		var liList = cf.obj.liList,
			pagination = cf.obj.pagination;
		var preIndex,
			nextIndex,
			maxIndex = newEle.find(".carouseFigureBox-img li").length - 1;
		if(index > maxIndex || index < 0){
			index = 0;
		}
		preIndex = index - 1;
		nextIndex = index + 1;
		if(preIndex < 0){
			preIndex = maxIndex;
		}
		if(nextIndex > maxIndex){
			nextIndex = 0;
		}
		console.log(index);
		liList.removeClass();
		newEle.find(".carouseFigureBox-img").css({"transform":"translateX("+(-cf.obj.width*index)+"px)","transition-duration":"300ms"});
		if(index == maxIndex){
			setTimeout(function(){
				newEle.find(".carouseFigureBox-img").css({"transform":"translateX("+(-cf.obj.width)+"px)","transition-duration":"0ms"});
			},300);
			pagination.eq(0).addClass("activeS").siblings().removeClass("activeS");
			index = 1;
		}else if(index == 0){
			setTimeout(function(){
				newEle.find(".carouseFigureBox-img").css({"transform":"translateX("+(-cf.obj.width*(maxIndex-1))+"px)","transition-duration":"0ms"});
			},300);
			pagination.eq(maxIndex-1).addClass("activeS").siblings().removeClass("activeS");
			index = maxIndex-1;
		}else{
			pagination.eq(index-1).addClass("activeS").siblings().removeClass("activeS");
		}
	};
	//图片上下切换
	this.pageBind = function(){
		var carouseFigurePre = newEle.find(".carouseFigurePre");
		if(carouseFigurePre.length > 0){
			carouseFigurePre.on("click",function(){
				index--;
				cf.autoScrollFun();
			});
		}
		var carouseFigureNext = newEle.find(".carouseFigureNext");
		if(carouseFigureNext.length > 0){
			carouseFigureNext.on("click",function(){
				index++;
				cf.autoScrollFun();
			});
		}
	};
	//图片拽动事件
	this.eventBind = function(){
		var startP,endP;
		var flag = false;
		if(isPC){//PC端
			ele.on({"mousedown":function(e){
				flag = true;
				cf.stopAutoScroll();
				startP = cf.position(e,$(this));
				endP = undefined;
				ele.on("mousemove",move);
			},
			"mouseup":function(){
				moveout();
			},
			"mouseout":function(){
				$(".carouseFigurePre,.carouseFigureNext").css("display","none");
				moveout();
			},
			"mouseover":function(){
				$(".carouseFigurePre,.carouseFigureNext").css("display","inline-block");
			}
			});
		}else{//移动端
			ele.on({"touchstart":function(e){
				e.preventDefault();
				flag = true;
				clearInterval(autoScroll);
				startP = cf.position(e,$(this));
				endP = undefined;
				ele.on("touchmove",move);
			},
			"touchend":function(){
				moveout();
			},
			});
		}
		ele.find("img").on("mousedown",function(e){
			if (e.preventDefault) {
			    e.preventDefault();
		   	}else {
		        e.returnvalue = false;
		    }
		});
		function move(e){
			endP = cf.position(e,$(this));
			var d_value = (endP.x - startP.x);
			var x = -cf.obj.width * index + d_value;
			newEle.find(".carouseFigureBox-img").css({"transform":"translateX("+ x +"px)","transition-duration":"0ms"});
		}
		//松开，或者移除
		function moveout(){
			if(isPC){
				ele.off("mousemove");			
			}else{
				ele.off("touchmove");
			}
			if(flag){
				flag = false;
				if(!endP) return;
				var d_value = (endP.x - startP.x);
				if(d_value < -cf.obj.width/5){//下一张
					index++;
				}else if(d_value > cf.obj.width/5){//上一张
					index--;
				}
				cf.autoScrollFun();
				cf.autoScroll();
			}
		}
	};
	//获取位置
	this.position = function(e,obj){
		var  position;
	    if(isPC){//PC端
		var offSet = obj.offset();
		position = {x:e.pageX - offSet.left,
	                y:e.pageY -  offSet.top
	            };
	    }else{
	    	var touches = e.originalEvent.touches;
	        var touch = touches[0]; //获取第一个触点
	        var tx = Number(touch.pageX); //页面触点X坐标
	        var ty = Number(touch.pageY); //页面触点Y坐标
	        position = {x:tx,y:ty};
	    }
	    return position;
	};
	//判断是否为pc端
	this.pcFlag = function(){
	    var userAgentInfo = navigator.userAgent;
	    var Agents = ["Android", "iPhone",
	                "SymbianOS", "Windows Phone",
	                "iPad", "iPod"];
	    var flag = true;
	    for (var v = 0; v < Agents.length; v++) {
	        if (userAgentInfo.indexOf(Agents[v]) > 0) {
	            flag = false;
	            break;
	        }
	    }
	    return flag;
	}
}
