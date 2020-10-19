<template>
    <div>
     	<head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="14" :offset="4">
	  			<header class="form_header">用户信息</header>
	  			<el-form :model="foodForm" :rules="foodrules" ref="foodForm" label-width="110px" class="form food_form">
	  				<el-form-item label="用户名" prop="username">
						<el-input v-model="foodForm.username" disabled></el-input>
					</el-form-item>
	  				<el-form-item label="权限" prop="role">
						<el-input v-model="foodForm.role" disabled></el-input>
					</el-form-item>
	  				<el-form-item label="上次充值金额" prop="recharge">
						<el-input v-model="foodForm.recharge" disabled></el-input>
					</el-form-item>
					<el-form-item label="上次充值时间" prop="recharge_time" style="white-space: nowrap;">
						<el-input v-model="foodForm.recharge_time" disabled></el-input>
					</el-form-item>
	  				<el-form-item label="账户余额" prop="balance">
						<el-input v-model="foodForm.balance" disabled></el-input>
					</el-form-item>
	  				<el-form-item label="原始密码" prop="old_password">
						<el-input type="password" v-model="foodForm.old_password" ></el-input>
					</el-form-item>
	  				<el-form-item label="新密码" prop="new_password">
						<el-input type="password" v-model="foodForm.new_password" ></el-input>
					</el-form-item>
	  				<el-form-item label="确认新密码" prop="new_password2">
						<el-input type="password" v-model="foodForm.new_password2" ></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="changePassword('foodForm')">确认修改密码</el-button>
					</el-form-item>
	  			</el-form>
  			</el-col>
  		</el-row>
    </div>
</template>

<script>
 	import headTop from '@/components/headTop'
    import {refresh, getUserInfo, changePassword} from '@/api/getData'
    import {baseUrl, baseImgPath} from '@/config/env'
	import env from '@/config/env'
    export default {
    	data(){
    		return {
    			baseUrl,
    			baseImgPath,
    			foodForm: {
    				username: '',
    				role: '',
    				balance: 5,
    			},
    			foodrules: {
    				old_password: [
						{ required: true, message: '请输入原始密码', trigger: 'blur' },
					],
    				new_password: [
						{ required: true, message: '请输入新密码', trigger: 'blur' },
					],
    				new_password2: [
						{ required: true, message: '请输入新密码', trigger: 'blur' },
					],
    			},
    			showAddCategory: false,
    			dialogFormVisible: false,
    		}
    	},
    	components: {
    		headTop,
    	},
    	created(){
/*
    		if (this.$route.query.restaurant_id) {
    			this.restaurant_id = this.$route.query.restaurant_id;
    		}else{
    			this.restaurant_id = Math.ceil(Math.random()*10);
    			this.$msgbox({
		          title: '提示',
		          message: '添加被保护虚拟机需要选择一个备份策略，先去就去选择备份策略吗？',
		          showCancelButton: true,
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          beforeClose: (action, instance, done) => {
		            if (action === 'confirm') {
		              this.$router.push('/policyList');
		              done();
		            } else {
		            	this.$message({
				            type: 'info',
				            message: '取消'
				        });
		              	done();
		            }
		          }
		        })
			}
*/
    		//this.initData();
    	},
        activated(){
            this.initData();
        },
    	computed: {
    		//selectValue: function (){
    		//	return this.categoryForm.categoryList[this.categoryForm.categorySelect]||{}
    		//}
    	},
    	methods: {
    		async initData(){
                try{
                    this.foodForm = await getUserInfo();
                    const res = await refresh();
					if (res.token) {
                        env.token = res.token;
                    }else{
                        throw new Error('获取数据失败');
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
				}
			},
		    addCategoryFun(){
		    	this.showAddCategory = !this.showAddCategory;
            },
/*
		    submitcategoryForm(categoryForm) {
				this.$refs[categoryForm].validate(async (valid) => {
					if (valid) {
						const params = {
							vmname: this.categoryForm.vmname,
							area: this.categoryForm.area,
							s3area: this.categoryForm.s3area,
							priv: this.categoryForm.priv,
							policy: this.categoryForm.policy,
							startTime: this.categoryForm.startTime,
						}
						try{
							const result = await addCategory(params);
							if (result.status == 1) {
								this.initData();
								this.categoryForm.vmname = '';
								this.categoryForm.area = 0x00100101;
								this.categoryForm.s3area = 0x00100101;
								this.categoryForm.priv = '中';
								this.categoryForm.policy = '';
								this.categoryForm.startTime = '';
								this.categoryForm.description = '';
								this.showAddCategory = false;
								this.$message({
					            	type: 'success',
					            	message: '添加成功'
					          	});
							}
						}catch(err){
							console.log(err)
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请检查输入是否正确',
							offset: 100
						});
						return false;
					}
				});
			},

			uploadImg(res, file) {
				if (res.status == 1) {
					this.foodForm.image_path = res.image_path;
				}else{
					this.$message.error('上传图片失败！');
				}
			},
			beforeImgUpload(file) {
				const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isRightType) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isRightType && isLt2M;
			},
			addspecs(){
				this.foodForm.specs.push({...this.specsForm});
				this.specsForm.specs = '';
				this.specsForm.packing_fee = 0;
				this.specsForm.price = 20;
				this.dialogFormVisible = false;
			},
			handleDelete(index){
				this.foodForm.specs.splice(index, 1);
			},
			tableRowClassName(row, index) {
		        if (index === 1) {
		        	return 'info-row';
		        } else if (index === 3) {
		        	return 'positive-row';
		        }
		        return '';
			},
*/
		    changePassword(foodForm){
		    	this.$refs[foodForm].validate(async (valid) => {
					if (valid) {
						const params = {
							...this.foodForm,
							//category_id: this.selectValue.id,
							//restaurant_id: this.restaurant_id,
						}
						try{
							const result = await changePassword(params);
							if (result.status == 1) {
								console.log(result)
								this.$message({
					            	type: 'success',
					            	message: '修改成功'
                                  });
/*
					          	this.foodForm = {
				    				vmname: '',
									area: 0x00100101,
									s3area: 0x00100101,
									priv: 5,
									policy: '',
									startTime: '',
				    				description: '',
									startTime: '',
				    				image_path: '',
				    				activity: '',
				    				attributes: [],
				    				specs: [{
				    					specs: '默认',
							          	packing_fee: 0,
							          	price: 20,
				    				}],
                                }
*/
                                this.$router.push('/');
                                env.token = ''
							}else{
								if (result.message == undefined) {
									this.$router.push('/');
									result.message = "会话过期，请重新登录"
									env.token = ''
								}
								this.$message({
					            	type: 'error',
					            	message: result.message
								  });
							}
						}catch(err){
							console.log(err)
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请检查输入是否正确',
							offset: 100
						});
						return false;
					}
				});
		    }
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.form{
		min-width: 400px;
		margin-bottom: 30px;
		&:hover{
			box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
			border-radius: 6px;
			transition: all 400ms;
		}
	}
	.food_form{
		border: 1px solid #eaeefb;
		padding: 10px 10px 0;
	}
	.form_header{
		text-align: center;
		margin-bottom: 10px;
	}
	.category_select{
		border: 1px solid #eaeefb;
		padding: 10px 30px 10px 10px;
		border-top-right-radius: 6px;
		border-top-left-radius: 6px;
	}
	.add_category_row{
		height: 0;
		overflow: hidden;
		transition: all 400ms;
		background: #f9fafc;
	}
	.showEdit{
		height: 185px;
	}
	.add_category{
		background: #f9fafc;
		padding: 10px 30px 0px 10px;
		border: 1px solid #eaeefb;
		border-top: none;
	}
	.add_category_button{
		text-align: center;
		line-height: 40px;
		border-bottom-right-radius: 6px;
		border-bottom-left-radius: 6px;
		border: 1px solid #eaeefb;
		border-top: none;
		transition: all 400ms;
		&:hover{
			background: #f9fafc;
			span, .edit_icon{
				color: #20a0ff;
			}
		}
		span{
			.sc(14px, #999);
			transition: all 400ms;
		}
		.edit_icon{
			color: #ccc;
			transition: all 400ms;
		}
	}
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
	    border-color: #20a0ff;
	}
	.avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 120px;
	    height: 120px;
	    line-height: 120px;
	    text-align: center;
	}
	.avatar {
	    width: 120px;
	    height: 120px;
	    display: block;
	}
	.cell{
		text-align: center;
	}
</style>
