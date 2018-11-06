/* *
* 背景管理
* 地面 (HorizonLine)
* 云朵 (Cloud)
* 昼夜更替 (NightMode)
* 障碍物 (Obstacle)*
* */


/* *
* canvas : 画布
* spritePos : 地面在雪碧图中的坐标
* */

// 雪碧图
const imgSprite = document.getElementById('imgSprite')
const imgSprite_2x = document.getElementById('imgSprite_2x')


const dimensions = {
	WIDTH: 600,
	HEIGHT: 12,
	YPOS: 127
}
const spriteDefinition = {
	HORIZON: {
		x: 2,
		y: 54
	}
}


function HorizonLine(canvas,spritePos){
	this.spritePos = spritePos;
	this.canvas = canvas;
	this.canvas.width = document.body.offsetWidth
	this.canvas.height = 600
	this.ctx = canvas.getContext("2d");
	this.dimensions = dimensions;
	// 在雪碧图中坐标为2和602处分别为不同的地形
	this.sourceXPos = [this.spritePos.x,this.spritePos.x + this.dimensions.WIDTH];
	// 地面在画布中的x坐标
	this.xPos = [];
	// 地面在画布中的y坐标
	this.yPos = 0;
	// 随机地形系数
	this.bumpThreshold = 0.5;
	this.setSourceDimesions();
	this.draw();
}

HorizonLine.prototype = {
	// 地面在画布上的位置
	setSourceDimesions: function(){
		this.xPos = [0,this.dimensions.WIDTH]
		this.yPos = this.dimensions.YPOS;
	},
	// 随机地形
	getRandomType: function (){
		return (Math.random() > this.bumpThreshold) ? this.dimensions.WIDTH : 0
	},
	// 制图
	draw: function(){
		console.log(this.ctx)
		this.ctx.drawImage(imgSprite, this.sourceXPos[0], this.spritePos.y, this.dimensions.WIDTH, this.dimensions.HEIGHT, this.xPos[0], this.yPos, this.dimensions.WIDTH,this.dimensions.HEIGHT)
		this.ctx.drawImage(imgSprite, this.sourceXPos[1], this.spritePos.y, this.dimensions.WIDTH, this.dimensions.HEIGHT, this.xPos[1], this.yPos, this.dimensions.WIDTH,this.dimensions.HEIGHT)
	},
	// 更新X位置
	updateXPos: function(pos, increment){
		let line1 = pos
		let line2 = pos === 0 ? 1 : 0
		this.xPos[line1] -= increment
		this.xPos[line2] = this.xPos[line1] + this.dimensions.WIDTH
		// 若第一段地面完全移出canvas外
		if(this.xPos[line1] <= -this.dimensions.WIDTH){
			//则将其移动至canvas外右侧
			this.xPos[line1] += this.dimensions.WIDTH * 2
			//同时将第二段地面移动至canvas内
			this.xPos[line2] = this.xPos[line1] - this.dimensions.WIDTH
			//选择随机地形
			this.sourceXPos[line1] = this.getRandomType() + this.spritePos.x;
		}
	}


}



window.onload = function(){
	let h = new HorizonLine(document.getElementById('canvas'), spriteDefinition.HORIZON);
	let startTime = 0;
	(function draw(time) {
		ctx.clearRect(0,0,600,150)
		time = time || 0
		h.update(time - startTime, 3);
		startTime = time;
		window.requestAnimationFrame(draw);
	})
}
