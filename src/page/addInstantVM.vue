<template>
    <div>
     	<head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="14" :offset="4">
	  			<header class="form_header">添加即时恢复虚拟机</header>
	  			<el-form :model="foodForm" :rules="foodrules" ref="foodForm" label-width="110px" class="form food_form">
	  				<el-form-item label="虚拟机IP" prop="vmname">
						<el-input v-model="foodForm.vmname"></el-input>
					</el-form-item>
					<el-form-item label="虚拟机所在区域" prop="area">
						<el-select v-model="foodForm.area" placeholder="请选择">
						    <el-option
						      	v-for="item in area"
						      	:key="item.value"
						      	:label="item.label"
						      	:value="item.value">
						    </el-option>
					 	</el-select>
					</el-form-item>
					<el-form-item label="用户名" prop="username">
						<el-input v-model="foodForm.username"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input type="password" v-model="foodForm.password"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addInstantVM('foodForm')">确认添加即时恢复虚拟机</el-button>
					</el-form-item>
	  			</el-form>
  			</el-col>
  		</el-row>
    </div>
</template>

<script>
 	import headTop from '@/components/headTop'
    import {refresh, addInstantVM} from '@/api/getData'
    import {baseUrl, baseImgPath} from '@/config/env'
	import env from '@/config/env'
    export default {
    	data(){
    		return {
    			baseUrl,
    			baseImgPath,
    			restaurant_id: 1,
    			categoryForm: {
    				vmname: '',
    				area: 0x00100101,
    			},
    			foodForm: {
    				vmname: '',
    				area: 0x00100101,
    				username: '',
    				password: '',
    			},
    			foodrules: {
    				vmname: [
						{ required: true, message: '请输入虚拟机IP地址', trigger: 'blur' },
					],
    				//area: [
					//	{ required: true, message: '请选择虚拟机所在区域', trigger: 'blur' },
					//],
    				username: [
						{ required: true, message: '请输入用户名', trigger: 'blur' },
					],
    				password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
					],
    			},
    			area: [{
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
    			showAddCategory: false,
    			foodSpecs: 'one',
				dialogFormVisible: false,
/*
		        specsForm: {
		          	specs: '',
		          	packing_fee: 0,
		          	price: 20,
				},
		        specsFormrules: {
		        	specs: [
						{ required: true, message: '请输入规格', trigger: 'blur' },
					],
				}
*/
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
                    const res = await refresh();
					if (res.token) {
                        env.token = res.token;
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
/*
    			try{
    				const result = await getPolicyName();
	    			if (result.status == 1) {
	    				result.category_list.map((item, index) => {
	    					item.value = item.name;
	    					item.label = item.name;
	    				})
						this.categoryForm.policy = result.category_list;
						this.policy = result.category_list;
	    			}else{
	    				console.log(result)
	    			}
    			}catch(err){
    				console.log(err)
				}
*/
			},
		    addCategoryFun(){
		    	this.showAddCategory = !this.showAddCategory;
			},
/*
		    submitcategoryForm(categoryForm) {
				this.$refs[categoryForm].validate(async (valid) => {
					if (valid) {
						const params = {
							name: this.categoryForm.name,
							area: this.categoryForm.area,
						}
						try{
							const result = await addCategory(params);
							if (result.status == 1) {
								//this.initData();
								this.categoryForm.name = '';
								this.categoryForm.area = 0x00100101;
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
*/
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
		    addInstantVM(foodForm){
		    	this.$refs[foodForm].validate(async (valid) => {
					if (valid) {
						const params = {
							...this.foodForm,
							//category_id: this.selectValue.id,
							//restaurant_id: this.restaurant_id,
						}
						try{
							const result = await addInstantVM(params);
							if (result.status == 1) {
								console.log(result)
								this.$message({
					            	type: 'success',
					            	message: '添加成功'
					          	});
					          	this.foodForm = {
				    				vmname: '',
									area: 0x00100101,
				    				username: '',
				    				password: '',
								}
								const res = await refresh();
								if (res.token) {
									env.token = res.token;
								}
								this.$router.push('instantvmlist')
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
