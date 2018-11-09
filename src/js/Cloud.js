/* *
* 背景管理
* 地面 (HorizonLine)
* 云朵 (Cloud)
* 昼夜更替 (NightMode)
* 障碍物 (Obstacle)*
* */

Cloud.config = {
	HEIGHT: 14,  //云朵sprite的高度
	MAX_CLOUD_GAP: 400,  //两朵云之间的最大间隙
	MAX_SKY_LEVEL: 30,   //云朵的最大高度
	MIN_CLOUD_GAP: 100,  //两朵云之间的最小间隙
	MIN_SKY_LEVEL: 71,   //云朵的最小高度
	WIDTH: 46,    //云朵sprite的宽度
	MAX_CLOUDS: 6,//最大云朵数量
	CLOUD_FREQUENCY: 0.5 //云朵出现频率
}
//用于存储云朵
Cloud.clouds = []

function Cloud(spritePos){
	this.img = IMG
	this.canvas = CANVAS;
	this.ctx = CANVAS.getContext("2d");
	this.spritePos = spritePos;
	this.containerWidth = DEFAULT_WIDTH;
	this.xPos = DEFAULT_WIDTH; //云朵初始x坐标在屏幕外
	this.yPos = 0;  //云朵初始高度
	this.remove = false;    //是否移除
	//云朵之间的间隙400~100
	this.cloudGap = getRandomNum(Cloud.config.MIN_CLOUD_GAP,Cloud.config.MAX_CLOUD_GAP);
	this.init();
}

Cloud.prototype = {
	init: function () {
		this.yPos = getRandomNum(Cloud.config.MAX_SKY_LEVEL,Cloud.config.MIN_SKY_LEVEL);
		this.draw();
	},
	draw: function () {
		this.ctx.save();
		this.ctx.drawImage(this.img, this.spritePos.x, this.spritePos.y, Cloud.config.WIDTH, Cloud.config.HEIGHT, this.xPos, this.yPos, Cloud.config.WIDTH, Cloud.config.HEIGHT);
		this.ctx.restore();
	},
	updateClouds: function (speed) {
		var numClouds = Cloud.clouds.length;
		if(numClouds){
			for(var i = numClouds - 1; i >= 0; i--){
				Cloud.clouds[i].update(speed);
			}
			var lastCloud = Cloud.clouds[numClouds - 1];
			//若当前存在的云朵数量小于最大云朵数量 并且云朵位置大于间隙时 随机添加云朵
			if(numClouds < Cloud.config.MAX_CLOUDS && (DEFAULT_WIDTH - lastCloud.xPos) > lastCloud.cloudGap && Cloud.config.CLOUD_FREQUENCY > Math.random()){
				this.addCloud();
			}
			//过滤掉已经移出屏幕外的云朵
			Cloud.clouds = Cloud.clouds.filter(function(obj){
        return !obj.remove;
      });
		}else{
			this.addCloud();
		}
	},
	update: function(speed) {
		if(!this.remove) {
			//向左移动
			this.xPos -= Math.ceil(speed);
			this.draw();
			if(!this.isVisible()) {
				this.remove = true;
			}
		}
	},
	//判断云朵是否移出屏幕外
	isVisible: function() {
	   return this.xPos + Cloud.config.WIDTH > 0;
	},
  //将云朵添加至数组
  addCloud: function () {
	   var cloud = new Cloud(spriteDefinition.CLOUD);
	   Cloud.clouds.push(cloud);
	}
}
