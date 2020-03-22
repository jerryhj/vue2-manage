<template>
    <div class="fillcontain">
        <head-top></head-top>
        <p class="explain_text">Clouvm虚拟机数据保护系统 v2.1</p>
        <p class="explain_text">跨云数据流动：私有云->公有云，公有云->公有云，公有云->私有云</p>
        <p class="explain_text">增量数据备份：有效减少备份数据容量</p>
        <p class="explain_text">持续数据保护：RPO=0</p>
        <p class="explain_text">秒级数据恢复：被恢复虚拟机及时可用</p>
    </div>
</template>
v2.1
<script>
	import headTop from '../components/headTop'
    export default {
    	components: {
    		headTop,
    	},
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.explain_text{
		margin-top: 20px;
		text-align: center;
		font-size: 20px;
		color: #333;
	}
</style>
