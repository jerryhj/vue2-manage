<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin">
		  		<div class="manage_tip">
		  			<p>添加S3对象存储</p>
		  		</div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm">
					<el-form-item label="S3对象存储" prop="s3area">
						<el-select v-model="loginForm.s3area" placeholder="请选择">
						    <el-option
						      	v-for="item in s3area"
						      	:key="item.value"
						      	:label="item.label"
						      	:value="item.value">
						    </el-option>
					 	</el-select>
					</el-form-item>
	  				<el-form-item label="bucket名称" prop="bucketname">
						<el-input v-model="loginForm.bucketname"></el-input>
					</el-form-item>
	  				<el-form-item label="AccessKey" prop="accesskey">
						<el-input v-model="loginForm.accesskey"></el-input>
					</el-form-item>
	  				<el-form-item label="SecretKey" prop="secretkey">
						<el-input v-model="loginForm.secretkey"></el-input>
					</el-form-item>
					<el-form-item>
                        <el-button @click="cancel">取 消</el-button>
				    	<el-button type="primary" @click="submitForm('loginForm')">提 交</el-button>
				  	</el-form-item>
				</el-form>
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
	import env from '@/config/env'
	import {addS3} from '@/api/getData'
	import {mapActions, mapState} from 'vuex'

	export default {
	    data(){
			return {
				loginForm: {
	   				bucketname: '',
    				s3area: 0x00100101,
    				accesskey: '',
					secretkey: '',
    			},
				rules: {
					bucketname: [
			            { required: true, message: '请输入bucket名称', trigger: 'blur' },
			        ],
					accesskey: [
			            { required: true, message: '请输入AccessKey', trigger: 'blur' },
			        ],
					secretkey: [
			            { required: true, message: '请输入SecretKey', trigger: 'blur' },
			        ],
				},
    			s3area: [{
		          	value: 0x00100101,
		          	label: '阿里云北京'
		        }, {
		          	value: 0x00100201,
		          	label: '阿里云上海'
		        }, {
		          	value: 0x00100301,
		          	label: '阿里云深圳'
		        }, {
		          	value: 0x00100401,
		          	label: '阿里云杭州'
		        }, {
		          	value: 0x00100501,
		          	label: '阿里云青岛'
		        }, {
		          	value: 0x00100601,
		          	label: '阿里云张家口'
		        }, {
		          	value: 0x00100701,
		          	label: '阿里云呼和浩特'
		        }, {
		          	value: 0x00200101,
		          	label: '腾讯云北京'
		        }, {
		          	value: 0x00200201,
		          	label: '腾讯云上海'
		        }, {
		          	value: 0x00200301,
		          	label: '腾讯云广州'
		        }, {
		          	value: 0x00200401,
		          	label: '腾讯云南京'
		        }, {
		          	value: 0x00200501,
		          	label: '腾讯云成都'
		        }, {
		          	value: 0x00200601,
		          	label: '腾讯云重庆'
		        }, {
		          	value: 0x00300101,
		          	label: '华为云北京'
		        }, {
		          	value: 0x00300201,
		          	label: '华为云上海'
		        }, {
		          	value: 0x00300301,
		          	label: '华为云广州'
		        }, {
		          	value: 0x00300401,
		          	label: '华为云贵阳'
		        }, {
		          	value: 0x00400101,
		          	label: '百度云北京'
		        }, {
		          	value: 0x00400201,
		          	label: '百度云苏州'
		        }, {
		          	value: 0x00400301,
		          	label: '百度云广州'
		        }, {
		          	value: 0x00400401,
		          	label: '百度云保定'
		        }, {
		          	value: 0x00500101,
		          	label: 'UCloud北京'
		        }, {
		          	value: 0x00500201,
		          	label: 'UCloud上海'
		        }, {
		          	value: 0x00500301,
		          	label: 'UCloud广州'
		        }, {
		          	value: 0x00600101,
		          	label: 'KSCloud北京'
		        }, {
		          	value: 0x00600201,
		          	label: 'KSCloud上海'
		        }, {
		          	value: 0x00600301,
		          	label: 'KSCloud广州'
		        }, {
		          	value: 0x00700101,
		          	label: '天翼云贵州'
		        }, {
		          	value: 0x00800101,
		          	label: '移动云北京'
		        }, {
		          	value: 0x10100101,
		          	label: 'AWS北京'
		        }, {
		          	value: 0x10100201,
		          	label: 'AWS宁夏'
				},],
				showLogin: false,
			}
		},
		mounted(){
			this.showLogin = true;
		},
		computed: {
		},
		methods: {
			async submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						const params = {
							...this.loginForm,
							//category_id: this.selectValue.id,
							//restaurant_id: this.restaurant_id,
						}
						const res = await addS3(params)
						if (res.status) {
							env.token = res.token
							this.$router.push('manage')
						}else{
							this.$message({
		                        type: 'error',
		                        message: res.message
		                    });
							this.$router.push('/')
						}
						return false;
					} else {
						this.$notify.error({
							title: '错误',
							message: '添加S3对象存储失败',
							offset: 100
						});
						this.$router.push('/')
						return false;
					}
				});
			},
            async cancel(){
				this.$router.push('/')
            },
		},
	}
</script>

<style lang="less" scoped>
	@import '../style/mixin';
	.login_page{
		background-color: #324057;
	}
	.manage_tip{
		position: absolute;
		width: 100%;
		top: -100px;
		left: 0;
		text-align: center;
		p{
			font-size: 34px;
			color: #fff;
		}
	}
	.form_contianer{
		.wh(480px, 360px);
		.ctp(480px, 360px);
		padding: 25px;
		border-radius: 5px;
		text-align: right;
		background-color: #fff;
		.submit_btn{
			width: 100%;
			font-size: 16px;
		}
	}
	.tip{
		font-size: 12px;
		color: red;
	}
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
</style>
