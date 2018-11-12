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
		for (let i = 0; i < NightMode.config.NUM_STARS; i++) {
			this.stars[i] = {}
			// 随机x坐标
			this.stars[i].x = getRandomNum(round * i, round * (i + 1));
			// 随机y坐标
			this.stars[i].y = getRandomNum(0, NightMode.config.STAR_MAX_Y);
			this.stars[i].sourceY = spriteDefinition.STAR.y + NightMode.config.STAR_SIZE * i;
		}
	},
	invert: function (deltaTime) {
		if(NIGHT_START === false){
			return
		}
		// 黑夜持续时间 5秒
		if(NightMode.invertTimer >= NightMode.INVERT_FADE_DURATION){ // 大于5秒 重置
			NightMode.invertTimer = 0;
			NightMode.invertTrigger = false;
			NightMode.inverted = A.classList.toggle('inverted',NightMode.invertTrigger);
			NIGHT_START = false
		}else if(NightMode.invertTimer < NightMode.INVERT_FADE_DURATION && NightMode.invertTimer > 0){ // 小于5秒 继续执行
			NightMode.invertTimer += deltaTime;
		}else{ // 黑夜初始化
			NightMode.invertTrigger = true
			NightMode.inverted = A.classList.toggle('inverted',NightMode.invertTrigger);
			NightMode.invertTimer += deltaTime;
		}
		this.update(NightMode.inverted);
	},
	update: function (activated) {
		// 🌙月亮周期更新
		if (activated === true && this.opacity === 0) {
			this.currentPhase++;
			if (this.currentPhase >= NightMode.phases.length) {
				this.currentPhase = 0;
			}
		}
		// 淡入
		if (activated === true && (this.opacity < 1 || this.opacity === 0)) {
			this.opacity += NightMode.config.FADE_SPEED;
		}else if(this.opacity > 0){ //淡出
			this.opacity -= NightMode.config.FADE_SPEED;
		}

		//当opacity大于0时移动月亮位置
		if(this.opacity > 0){
			this.xPos = this.updateXPos(this.xPos, NightMode.config.MOON_SPEED);
			// 移动星星
			if(this.drawStars === true){
				for (var i = 0; i < NightMode.config.NUM_STARS; i++){
					this.stars[i].x = this.updateXPos(this.stars[i].x, NightMode.config.STAR_SPEED);
				}
				this.draw();
			}else{
				this.opacity = 0;
				this.init();
			}
			this.drawStars = true;
		}
	},
	updateXPos: function (currentPos, speed){
		// 判断物体 是否出了边界
		if (currentPos < -NightMode.config.WIDTH){
			// 返回右侧
			currentPos = this.containerWidth;
		}else{
			currentPos -= speed;
		}
		return currentPos;
	},
	draw: function () {
		//周期为3时画满月
		var moonSourceWidth = this.currentPhase == 3 ? NightMode.config.WIDTH * 2 : NightMode.config.WIDTH;
		var moonSourceHeight = NightMode.config.HEIGHT;
		//从雪碧图上获取月亮正确的形状
		var moonSourceX = this.spritePos.x + NightMode.phases[this.currentPhase];
		var moonOutputWidth = moonSourceWidth;
		var starSize = NightMode.config.STAR_SIZE;
		var starSourceX = spriteDefinition.STAR.x;
		this.ctx.save();
		this.ctx.globalAlpha = this.opacity;
		if(this.drawStars === true){
			for (var i = 0; i < NightMode.config.NUM_STARS; i++) {
				this.ctx.drawImage(this.img, starSourceX, this.stars[i].sourceY, starSize, starSize, Math.round(this.stars[i].x), this.stars[i].y, NightMode.config.STAR_SIZE, NightMode.config.STAR_SIZE);
			}
		}
		this.ctx.drawImage(this.img, moonSourceX, this.spritePos.y, moonSourceWidth, moonSourceHeight, Math.round(this.xPos), this.yPos, moonOutputWidth, NightMode.config.HEIGHT)
		this.ctx.restore()
	}



}

