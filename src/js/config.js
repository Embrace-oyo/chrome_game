const A = document.getElementById('a');
const CANVAS = document.getElementById('canvas');
const CTX = CANVAS.getContext('2d');
const IMG =  document.getElementById('sprite');
const IMG2 =  document.getElementById('2x@sprite');
const HORIZON = {x: 2, y: 54}
const FPS = 60
const DEFAULT_WIDTH = 600
const DEFAULT_HEIGHT = 150
const SPRITEWIDTH = 1200
const DIMENSIONS = {
	// 宽800
	width: DEFAULT_WIDTH,
	// 高12像素
	height: 12,
	// 在画布Y轴中的位置
	yPos: 130
}
const spriteDefinition = {
	CACTUS_LARGE: {x: 332, y: 2},	//大仙人掌
	CACTUS_SMALL: {x: 228, y: 2},	//小仙人掌
	CLOUD: {x: 86, y: 2},			//云
	HORIZON: {x: 2, y: 54},			//地面
	MOON: {x: 484, y: 2},			//月亮
	PTERODACTYL: {x: 134, y: 2},	//翼龙
	RESTART: {x: 2, y: 2},			//重新开始按钮
	TEXT_SPRITE: {x: 655, y: 2},	//分数
	TREX: {x: 848, y: 2},			//霸王龙
	STAR: {x: 645, y: 2}			//星星
}
const gameFrame = 0;
const dimensions = {WIDTH:600}
const opt_xOffset = 1
const speed = 1
let NIGHT_START = false;
CANVAS.width = DEFAULT_WIDTH
CANVAS.height = DEFAULT_HEIGHT
