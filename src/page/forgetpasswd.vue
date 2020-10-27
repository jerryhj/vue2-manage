<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin">
		  		<div class="manage_tip">
		  			<p>取回密码</p>
		  		</div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm">
					<el-form-item prop="email">
						<el-input v-model="loginForm.email" placeholder="邮箱地址"><span>dsfsf</span></el-input>
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
	import {forgetpasswd} from '@/api/getData'
	import {mapActions, mapState} from 'vuex'

	export default {
	    data(){
			return {
				loginForm: {
					email: '',
				},
				rules: {
					email: [
			            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
			        ],
				},
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
						const res = await forgetpasswd({email: this.loginForm.email})
						if (res.status) {
							this.$message({
		                        type: 'success',
		                        message: '请检查邮箱获取新密码'
							});
							env.token = res.token
							this.$router.push('/')
						}else{
							this.$message({
		                        type: 'error',
		                        message: res.message
		                    });
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请输入正确的邮箱地址',
							offset: 100
						});
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
		.wh(480px, 100px);
		.ctp(480px, 100px);
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
