<template>
	<div class="wrapper">
		<canvas ref="canvas" id="canvas"></canvas>
		<div style="display: none">
			<img src="../assets/sprite.png" alt="" id="imgSprite">
			<img src="../assets/2x@sprite.png" alt="" id="imgSprite_2x">
		</div>
	</div>
</template>



<script>
export default {
	name: "index",
}

</script>


<style scoped lang="stylus">
	.wrapper
		position: absolute
		left: 0
		top: 0
		right: 0
		bottom: 0
</style>
