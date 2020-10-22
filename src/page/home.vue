<template>
    <div>
        <head-top></head-top>
		<section class="data_section">
			<header class="section_title">数据统计</header>
			<el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="4"><div class="data_list today_head"><span class="data_num head">当日数据：</span></div></el-col>
				<el-col :span="4"><div class="data_list"><span class="data_num">{{store_size}}GB</span> 新增保护数据</div></el-col>
				<el-col :span="4"><div class="data_list"><span class="data_num">{{rc_size}}GB</span> 当日恢复数据</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{remoterc_size}}GB</span> 当日异地恢复数据</div></el-col>
			</el-row>
            <el-row :gutter="20">
                <el-col :span="4"><div class="data_list all_head"><span class="data_num head">总数据：</span></div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{all_store_size}}GB</span> 被保护数据</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{all_rc_size}}GB</span> 已恢复数据</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{all_remoterc_size}}GB</span> 异地恢复数据</div></el-col>
            </el-row>
		</section>
		<tendency :sevenDate='sevenDate' :sevenDay='sevenDay'></tendency>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
	import tendency from '../components/tendency' 
	import dtime from 'time-formater'
	import env from '@/config/env'
	import {getAllStoreSize, getAllRecoverySize, getAllRemoteRecoverySize, getStoreSize, getRecoverySize, getRemoteRecoverySize} from '@/api/getData'
    export default {
    	data(){
    		return {
    			store_size: null,
    			rc_size: null,
                remoterc_size: null,
                all_store_size: null,
                all_rc_size: null,
                all_remoterc_size: null,
    			sevenDay: [],
    			sevenDate: [[],[],[]],
    		}
    	},
    	components: {
    		headTop,
    		tendency,
    	},
    	mounted(){
    		this.initData();
    		for (let i = 6; i > -1; i--) {
    			const date = dtime(new Date().getTime() - 86400000*i).format('YYYY-MM-DD')
    			this.sevenDay.push(date)
    		}
    		this.getSevenData();
    	},
        computed: {

        },
    	methods: {
    		async initData(){
    			const today = dtime().format('YYYY-MM-DD')
    			Promise.all([getStoreSize(today), getRecoverySize(today), getRemoteRecoverySize(today), getAllStoreSize(), getAllRecoverySize(), getAllRemoteRecoverySize()])
    			.then(res => {
    				this.store_size = Math.round(res[0].count * 100 / 1024 / 1024 / 1024) / 100;
    				this.rc_size = Math.round(res[1].count * 100 / 1024 / 1024 / 1024) / 100;
                    this.remoterc_size = Math.round(res[2].count * 100 / 1024 / 1024 / 1024) / 100;
                    this.all_store_size = Math.round(res[3].count * 100 / 1024 / 1024 / 1024) / 100;
                    this.all_rc_size = Math.round(res[4].count * 100 / 1024 / 1024 / 1024) / 100;
                    this.all_remoterc_size = Math.round(res[5].count * 100 / 1024 / 1024 / 1024) / 100;
    			}).catch(err => {
                    const message = "会话过期，请重新登录"
                    this.$router.push('/');
                    env.token = ''
                    this.$message({
                        type: 'error',
                        message: message
                        });
                    console.log('获取数据失败', err);
				})
    		},
    		async getSevenData(){
    			const apiArr = [[],[],[]];
    			this.sevenDay.forEach(item => {
    				apiArr[0].push(getStoreSize(item))
    				apiArr[1].push(getRecoverySize(item))
                    apiArr[2].push(getRemoteRecoverySize(item))
    			})
    			const promiseArr = [...apiArr[0], ...apiArr[1], ...apiArr[2]]
    			Promise.all(promiseArr).then(res => {
    				const resArr = [[],[],[]];
					res.forEach((item, index) => {
						if (item.status == 1) {
							resArr[Math.floor(index/7)].push(item.count)
						}
					})
					this.sevenDate = resArr;
    			}).catch(err => {
    				console.log(err)
    			})
    		}
    	}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.data_section{
		padding: 20px;
		margin-bottom: 40px;
		.section_title{
			text-align: center;
			font-size: 30px;
			margin-bottom: 10px;
		}
		.data_list{
			text-align: center;
			font-size: 14px;
			color: #666;
            border-radius: 6px;
            background: #E5E9F2;
            .data_num{
                color: #333;
                font-size: 26px;

            }
            .head{
                border-radius: 6px;
                font-size: 22px;
                padding: 4px 0;
                color: #fff;
                display: inline-block;
            }
        }
        .today_head{
            background: #FF9800;
        }
        .all_head{
            background: #20A0FF;
        }
	}
    .wan{
        .sc(16px, #333)
    }
</style>
