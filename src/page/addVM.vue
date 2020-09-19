<template>
    <div>
     	<head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="14" :offset="4">
	  			<header class="form_header">添加待部署虚拟机</header>
	  			<el-form :model="foodForm" :rules="foodrules" ref="foodForm" label-width="110px" class="form food_form">
	  				<el-form-item label="虚拟机名称" prop="vmname">
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
					<el-form-item label="备份数据至" prop="s3area">
						<el-select v-model="foodForm.s3area" placeholder="请选择">
						    <el-option
						      	v-for="item in s3area"
						      	:key="item.value"
						      	:label="item.label"
						      	:value="item.value">
						    </el-option>
					 	</el-select>
					</el-form-item>
					<el-form-item label="备份优先级" prop="priv">
						<el-select v-model="foodForm.priv" placeholder="请选择">
						    <el-option
						      	v-for="item in priv"
						      	:key="item.value"
						      	:label="item.label"
						      	:value="item.value">
						    </el-option>
					 	</el-select>
					</el-form-item>
					<el-form-item label="备份策略" prop="policy">
						<el-select v-model="foodForm.policy" placeholder="请选择">
						    <el-option
						      	v-for="item in policy"
						      	:key="item.value"
						      	:label="item.label"
						      	:value="item.value">
						    </el-option>
					 	</el-select>
					</el-form-item>
					<el-form-item label="首次备份" prop="startTime" style="white-space: nowrap;">
						<el-time-select
							placeholder="执行时间"
							v-model="foodForm.startTime"
							:picker-options="{
							start: '00:00',
							step: '00:15',
							end: '23:45'
							}">
						</el-time-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addVM('foodForm')">确认添加待部署虚拟机</el-button>
					</el-form-item>
	  			</el-form>
  			</el-col>
  		</el-row>
    </div>
</template>

<script>
 	import headTop from '@/components/headTop'
    import {refresh, getPolicyName, addVM} from '@/api/getData'
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
    				s3area: 0x00100101,
    				priv: 5,
    				policy: '',
					startTime: '',
    			},
    			foodForm: {
    				vmname: '',
    				area: 0x00100101,
    				s3area: 0x00100101,
    				priv: 5,
    				policy: '',
					startTime: '',
    				image_path: '',
    			},
    			foodrules: {
    				vmname: [
						{ required: true, message: '请输入虚拟机名称', trigger: 'blur' },
					],
    				//area: [
					//	{ required: true, message: '请选择虚拟机所在区域', trigger: 'blur' },
					//],
    			},
    			area: [{
		          	value: 0x00100101,
		          	label: '阿里云北京'
		        }, {
		          	value: 0x00100201,
		          	label: '阿里云上海'
		        }, {
		          	value: 0x00200101,
		          	label: '腾讯云北京'
		        }, {
		          	value: 0x00200201,
		          	label: '腾讯云上海'
		        },],
    			s3area: [{
		          	value: 0x00100101,
		          	label: '阿里云北京'
		        }, {
		          	value: 0x00200201,
		          	label: '腾讯云上海'
				},],
  				priv: [{
		          	value: 9,
		          	label: '低'
		        }, {
		          	value: 5,
		          	label: '中'
		        }, {
		          	value: 1,
		          	label: '高'
		        },],
    			policy: [{
		        },],
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
		    addVM(foodForm){
		    	this.$refs[foodForm].validate(async (valid) => {
					if (valid) {
						const params = {
							...this.foodForm,
							//category_id: this.selectValue.id,
							//restaurant_id: this.restaurant_id,
						}
						try{
							const result = await addVM(params);
							if (result.status == 1) {
								console.log(result)
								this.$message({
					            	type: 'success',
					            	message: '添加成功'
					          	});
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
								const res = await refresh();
								if (res.token) {
									env.token = res.token;
								}
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
