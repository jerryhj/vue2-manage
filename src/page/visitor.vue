<template>
    <div>
        <head-top></head-top>
        <visitor-pie :pieData="pieData"></visitor-pie>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
    import visitorPie from '@/components/visitorPie'
	import env from '@/config/env'
	import {getJobInfo} from '@/api/getData'
    export default {
    	data(){
    		return {
    			pieData: {},
    		}
    	},
    	components: {
    		headTop,
            visitorPie,
    	},
    	mounted(){
    		this.initData();
    	},
    	methods: {
    		async initData(){
    			try{
    				const res = await getJobInfo();
    				if (res.status == 1) {
    					this.pieData = res.jobinfo;
    				}else{
    					throw new Error(res)
    				}
    			}catch(err){
                    const message = "会话过期，请重新登录"
                    this.$router.push('/');
                    env.token = ''
                    this.$message({
                        type: 'error',
                        message: message
                        });
                    console.log('获取数据失败', err);
    				//console.log('获取任务信息失败',err);
    			}
    		},
    	}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	
</style>
