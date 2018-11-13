//存储障碍物的数组
Obstacle.obstacles = [];
//记录障碍物数组中障碍物的类型
Obstacle.obstacleHistory = [];
//障碍物最大间距系数
Obstacle.MAX_GAP_COEFFICIENT = 1.5;
//每组障碍物的最大数量
Obstacle.MAX_OBSTACLE_LENGTH = 3;
//相邻的障碍物类型的最大重复数
Obstacle.MAX_OBSTACLE_DUPLICATION = 2;

Obstacle.types = [
	{
		type: 'CACTUS_SMALL', //小仙人掌
		width: 17,  //宽
		height: 35, //高
		yPos: 105,  //在画布上的y坐标
		multipleSpeed: 4,
		minGap: 120,    //最小间距
		minSpeed: 0    //最低速度
	},
	{
		type: 'CACTUS_LARGE',   //大仙人掌
		width: 25,
		height: 50,
		yPos: 90,
		multipleSpeed: 7,
		minGap: 120,
		minSpeed: 0
	},
	{
		type: 'PTERODACTYL',    //翼龙
		width: 46,
		height: 40,
		yPos: [ 100, 75, 50 ], //有高、中、低三种高度
		multipleSpeed: 999,
		minSpeed: 8.5,
		minGap: 150,
		numFrames: 2,   //有两个动画帧
		frameRate: 1000 / 60,  //动画帧的切换速率，这里为一秒6帧
		speedOffset: .8 //速度修正
	}
]

function Obstacle(pos, obs) {
	this.img = IMG;
	this.ctx = CANVAS.getContext('2d');
	this.spritePos = pos
	//障碍物类型(仙人掌、翼龙)
	this.typeConfig = obs
	this.gapCoefficient = 0.6;
	//每个障碍物的数量(1~3)
	this.size = getRandomNum(1, Obstacle.MAX_OBSTACLE_LENGTH);
	//表示该障碍物是否可以被移除
	this.remove = false;
	//水平坐标
	this.xPos = dimensions.WIDTH + (opt_xOffset || 0);
	this.yPos = 0;
	this.width = 0;
	this.gap = 0;
	this.speedOffset = 0;   //速度修正
	//障碍物的动画帧
	this.currentFrame = 0;
	//动画帧切换的计时器
	this.timer = 0;
}
Obstacle.prototype = {
	init: function (deltaTime, speed) {
		let obsArry = Obstacle.obstacles;
		let obsArr = Obstacle.obstacles.slice(0);
		// 移除被标记的障碍
		for(let i = 0; i < obsArry.length; i++){
			if(obsArry[i].remove === true){
				obsArry.shift()
			}
			obsArry[i].update(deltaTime, speed)
		}
		if(obsArry.length < Obstacle.MAX_OBSTACLE_LENGTH) {
			this.addObs()
		}
	},
	addObs: function () {
		// 获取随机数
		let index = getRandomNum(0, Obstacle.types.length - 1);
		// 取得障碍物
		let type = Obstacle.types[index];
		let pos = spriteDefinition[type.type]
		// 判断是否重复 如果重复继续进入addObs 判断
		if(this.typeRepeat(type) === true){
			this.addObs()
		}else{
			// 存入数组
			Obstacle.obstacles.push(new Obstacle(pos, type))
			// 存入历史
			Obstacle.obstacleHistory.unshift(type);
		}
	},
	typeRepeat(type){
		let obsArry = Obstacle.obstacles
		let num = 0;
		for(let i = 0; i < obsArry.length; i++){
			if(obsArry[i].typeConfig.type === type.type){
				num++
			}
		}
		if(type.type === 'PTERODACTYL' && num >= 1){
			return true
		}else if(num > 2){
			return true
		}else{
			return false
		}
	},
	update: function (deltaTime, speed) {
		// 判断有没有超出边界
		if(this.xPos < -this.typeConfig.width){
			this.remove = true
		}else{
			this.xPos -= Math.floor((speed * FPS / 1000) * deltaTime);
		}
		// 更新动画帧
		if(this.typeConfig.numFrames){
			// 获取当前进行的时间
			this.timer += deltaTime;
			if(this.timer >= this.typeConfig.frameRate){
				//在两个动画帧之间来回切换以达到动画效果
				this.currentFrame == (this.currentFrame === (this.typeConfig.numFrames - 1)) ? 0 : this.currentFrame + 1;
				this.timer = 0
			}
		}
		this.draw();
	},
	draw: function () {
		let obsW = this.typeConfig.width;
		let obsH = this.typeConfig.height;
		// 根据障碍物数量计算障碍物在雪碧图上的x坐标
		if(this.typeConfig.type === 'PTERODACTYL'){
			this.size = 1
		}
		var sourceX = (obsW * this.size) * (0.5 * (this.size - 1)) + 	this.spritePos.x;

		this.ctx.drawImage(this.img, sourceX, this.spritePos.y, obsW * this.size, obsH, this.xPos, this.yPos)
	}


}





