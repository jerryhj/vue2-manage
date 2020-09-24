<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin">
		  		<div class="manage_tip">
		  			<p>注册新用户</p>
		  		</div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm">
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" placeholder="用户名"><span>dsfsf</span></el-input>
					</el-form-item>
					<el-form-item prop="email">
						<el-input v-model="loginForm.email" placeholder="邮箱地址"><span>dsfsf</span></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
					</el-form-item>
					<el-form-item prop="password2">
						<el-input type="password" placeholder="再次输入密码" v-model="loginForm.password2"></el-input>
					</el-form-item>
					<el-form-item>
                        <el-button @click="cancel">取 消</el-button>
		                <el-button type="primary" @click="submitForm('loginForm')">注 册</el-button>
				  	</el-form-item>
				</el-form>
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
	import env from '@/config/env'
	import {signup} from '@/api/getData'
	import {mapActions, mapState} from 'vuex'

	export default {
	    data(){
			return {
				loginForm: {
					username: '',
					email: '',
					password: '',
					password2: '',
				},
				rules: {
					username: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
			        ],
					email: [
			            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
			        ],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
					password2: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
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
						const res = await signup({username: this.loginForm.username, email: this.loginForm.email, password: this.loginForm.password, password2: this.loginForm.password2})
						if (res.token) {
							this.$message({
		                        type: 'success',
		                        message: '注册成功'
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
							message: '请输入正确的注册信息',
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
		.wh(480px, 260px);
		.ctp(480px, 260px);
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
