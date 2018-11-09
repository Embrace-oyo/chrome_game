/* *
* 背景管理
* 地面 (HorizonLine)
* 云朵 (Cloud)
* 昼夜更替 (NightMode)
* 障碍物 (Obstacle)*
* */

NightMode.config = {
	FADE_SPEED: 0.035,	//淡入淡出速度
	HEIGHT: 40,	//月亮高度
	MOON_SPEED: 0.25,	//月亮移动速度
	NUM_STARS: 2,	//星星数量
	STAR_SIZE: 9,	//星星宽度
	STAR_SPEED: 0.3,//星星速度
	STAR_MAX_Y: 70,	//星星在画布上出现的位置
	WIDTH: 20	//半个月度宽度
};
//月亮在不同时期有不同的位置
NightMode.phases = [140,120,100,60,40,20,0];
NightMode.invertTimer = 0;
NightMode.inverted = false;
NightMode.invertTrigger = false;
NightMode.INVERT_FADE_DURATION = 5000;

function NightMode( spritePos ) {
	this.img = IMG;
	this.spritePos = spritePos;
	this.canvas = CANVAS;
	this.ctx = CANVAS.getContext("2d");
	this.containerWidth = DEFAULT_WIDTH;
	this.xPos = DEFAULT_WIDTH - 50;	//月亮的x坐标
	this.yPos = 30;	//月亮的y坐标
	this.currentPhase = 0;
	this.opacity = 0;
	this.stars = [];	//用于存储星星
	this.drawStars = false; //是否绘制星星
	this.init();	//放置星星
}

NightMode.prototype = {
	init: function () {
		var round = Math.round(this.containerWidth / NightMode.config.NUM_STARS);
		console.log(round)
		for(let i = 0; i < NightMode.config.NUM_STARS.length; i++){
			this.config.NUM_STARS[i] = {}
			// 随机x坐标
			this.config.NUM_STARS[i].x = getRandomNum(round * i, round * (i + 1));
			// 随机y坐标
			this.config.NUM_STARS[i].y = getRandomNum(0, NightMode.config.STAR_MAX_Y);
			this.stars[i].sourceY = spriteDefinition.STAR.y + NightMode.config.STAR_SIZE * i;
		}
	}
}

