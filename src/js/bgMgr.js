/* *
* 背景管理
* 地面 (HorizonLine)
* 云朵 (Cloud)
* 昼夜更替 (NightMode)
* 障碍物 (Obstacle)*
* */




const CANVAS = document.getElementById('canvas');
const CTX = CANVAS.getContext('2d');
const IMG =  document.getElementById('sprite');
const FPS = 60
const DEFAULT_WIDTH = 800
const DEFAULT_HEIGHT = 600
const SPRITEWIDTH = 1200
const DIMENSIONS = {
	// 宽800
	width: DEFAULT_WIDTH,
	// 高12像素
	height: 12,
	// 在画布Y轴中的位置
	yPos: 560
}
const HORIZON = {x: 2, y: 54}
CANVAS.width = DEFAULT_WIDTH
CANVAS.height = DEFAULT_HEIGHT

	/* *
	* CANVAS : 画布
	* spritePos : 地面在雪碧图中的坐标
	* */
function HorizonLine( spritePos ) {
	this.img = IMG
	this.spritePos = spritePos;
	this.canvas = CANVAS;
	this.ctx = CTX
	this.dimensions = DIMENSIONS;
	this.sourceXPos = [spritePos.x, (this.spritePos.x + SPRITEWIDTH - DIMENSIONS.width)];
	this.xPos = [];
	this.yPos = 0;
	this.bumpThreshold = 0.5;	//地形系数
	this.setSourceDimensions();
	this.draw();
}

HorizonLine.prototype = {
	setSourceDimensions: function() {
		//地面在画布上的位置
		this.xPos = [0, this.dimensions.width];
		this.yPos = this.dimensions.yPos;
	},
	//随机地形
	getRandomType: function() {
		//返回第一段地形或者第二段地形
		return Math.random() > this.bumpThreshold ? SPRITEWIDTH - this.dimensions.width : 0;
	},
	draw: function() {
		this.ctx.drawImage(this.img, this.sourceXPos[0], this.spritePos.y, this.dimensions.width, this.dimensions.height, this.xPos[0], this.yPos, this.dimensions.width, this.dimensions.height);
		this.ctx.drawImage(this.img, this.sourceXPos[1], this.spritePos.y, this.dimensions.width, this.dimensions.height, this.xPos[1], this.yPos, this.dimensions.width, this.dimensions.height);
	},
	updateXPos: function(pos,increment) {

		var line1 = pos;
		var line2 = pos === 0 ? 1 : 0;
		// 计算出下一次绘制在X轴
		this.xPos[line1] = this.xPos[line1] -  increment;
		this.xPos[line2] = this.xPos[line1] + this.dimensions.width;
		// 若第一段地面完全移出canvas外
		if(this.xPos[line1] <= -this.dimensions.width) {
			// 则将其移动至canvas外右侧
			this.xPos[line1] = this.xPos[line1] + this.dimensions.width * 2;
			// 同时将第二段地面移动至canvas内
			this.xPos[line2] = this.xPos[line1] - this.dimensions.width;
			// 选择随机地形
			this.sourceXPos[line1] = this.getRandomType() + this.spritePos.x;
		}
	},
	update: function(deltaTime,speed) {
		var increment = Math.floor(speed * (FPS / 1000) * deltaTime);
		//交换地面一和二
		if(this.xPos[0] <= 0) {
			this.updateXPos(0, increment);
		} else {
			this.updateXPos(1, increment);
		}
		this.draw();
	},
	reset: function() {
		this.xPos[0] = 0;
		this.xPos[1] = this.dimensions.width;
	}
}

