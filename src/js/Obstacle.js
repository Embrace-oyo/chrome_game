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
		frameRate: 1000/6,  //动画帧的切换速率，这里为一秒6帧
		speedOffset: .8 //速度修正
	}
]

function Obstacle(spritePos) {
	this.img = IMG;
	this.ctx = CANVAS.getContext('2d');
	this.spritePos = spritePos
	//障碍物类型(仙人掌、翼龙)
	this.typeConfig = Obstacle.types[0];
	this.gapCoefficient = 0.6;
	//每个障碍物的数量(1~3)
	this.size = getRandomNum(1,Obstacle.MAX_OBSTACLE_LENGTH);
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
	this.init(speed);
}

Obstacle.prototype = {
	getGap: function(gapCoefficient, speed){
		var minGap = Math.round(this.width * speed + this.typeConfig.minGap * gapCoefficient)
		var maxGap = Math.round(minGap * Obstacle.MAX_GAP_COEFFICIENT);
		return getRandomNum(minGap, maxGap);
	},
	//判断障碍物是否移出屏幕外
	isVisible: function(){
		return this.xPos + this.width > 0;
	},
	init: function(speed){
		//如果随机障碍物是翼龙，则只出现一只
		if (this.size > 1 && this.typeConfig.multipleSpeed > speed){
			this.size = 1;
		}
		//障碍物的总宽度等于单个障碍物的宽度乘以个数
		this.width = this.typeConfig.width * this.size;
		//若障碍物的纵坐标是一个数组 则随机选取一个
		if (Array.isArray(this.typeConfig.yPos)){
			var yPosConfig = this.typeConfig.yPos;
			this.yPos = yPosConfig[getRandomNum(0, yPosConfig.length - 1)];
		}else{
			this.yPos = this.typeConfig.yPos;
		}
		//对翼龙的速度进行修正，让它看起来有的飞得快一些，有些飞得慢一些
		if (this.typeConfig.speedOffset){
			this.speedOffset = Math.random() > 0.5 ? this.typeConfig.speedOffset : -this.typeConfig.speedOffset;
		}
		//障碍物之间的间隙，与游戏速度有关
		this.gap = this.getGap(this.gapCoefficient, speed);
	},
	draw: function () {
		//障碍物宽高
		var sourceWidth = this.typeConfig.width;
		var sourceHeight = this.typeConfig.height;
		//根据障碍物数量计算障碍物在雪碧图上的x坐标
		//this.size的取值范围是1~3
		var sourceX = (sourceWidth * this.size) * (0.5 * (this.size - 1)) + this.spritePos.x;
		// 如果当前动画帧大于0，说明障碍物类型是翼龙
		// 更新翼龙的雪碧图x坐标使其匹配第二帧动画
		if (this.currentFrame > 0) {
			sourceX += sourceWidth * this.currentFrame;
		}
		this.ctx.drawImage(this.img, sourceX, this.spritePos.y, sourceWidth * this.size, sourceHeight, this.xPos, this.yPos, sourceWidth * this.size, sourceHeight)
	},
	//管理多个障碍物移动
	updateObstacles: function (deltaTime, currentSpeed) {
		//保存一个障碍物列表的副本
		var updatedObstacles = Obstacle.obstacles.slice(0);
		for (var i = 0; i < Obstacle.obstacles.length; i++){
			var obstacle = Obstacle.obstacles[i];
			obstacle.update(deltaTime, currentSpeed);
			//移除被标记为删除的障碍物
			if(obstacle.remove){
				updatedObstacles.shift();
			}
		}
		Obstacle.obstacles = updatedObstacles;
		if(Obstacle.obstacles.length > 0){
			//获取障碍物列表中的最后一个障碍物
			var lastObstacle = Obstacle.obstacles[Obstacle.obstacles.length - 1];
			if(lastObstacle && lastObstacle.isVisible() && (lastObstacle.xPos + lastObstacle.width + lastObstacle.gap) < this.dimensions.WIDTH){
				this.addNewObstacle(currentSpeed);
			}
		}else{ //若障碍物列表中没有障碍物则立即添加
			this.addNewObstacle(currentSpeed);
		}
	},
	// 随机添加障碍
	addNewObstacle: function(currentSpeed){
		//随机选取一种类型的障碍
		var obstacleTypeIndex = getRandomNum(0,Obstacle.types.length - 1);
		var obstacleType = Obstacle.types[obstacleTypeIndex];
		//检查随机取到的障碍物类型是否与前两个重复
		//或者检查其速度是否合法，这样可以保证游戏在低速时不出现翼龙
		//如果检查不通过，则重新再选一次直到通过为止
		if(this.duplicateObstacleCheck(obstacleType.type) || currentSpeed < obstacleType.minSpeed){

		}
	}

}



