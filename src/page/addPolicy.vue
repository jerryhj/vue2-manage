<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="12" :offset="4">
		        <el-form :model="formData" :rules="rules" ref="formData" label-width="110px" class="demo-formData">
					<el-form-item label="策略名称" prop="name">
						<el-input v-model="formData.name"></el-input>
					</el-form-item>
					<el-form-item label="策略密码">
						<el-radio class="radio" v-model="formData.encrypt" label="noencrypt">不加密</el-radio>
  						<el-radio class="radio" v-model="formData.encrypt" label="default_encrypt">使用缺省密码</el-radio>
  						<el-radio class="radio" v-model="formData.encrypt" label="use_encrpt">设定密码</el-radio>
					</el-form-item>
					<el-row v-if="formData.encrypt == 'use_encrpt'">
						<el-form-item label="设置密码" prop="encrpt_password">
							<el-input v-model="formData.encrpt_password"></el-input>
						</el-form-item>
					</el-row>
					<el-form-item label="设置年备份" style="white-space: nowrap;">
						<el-switch on-text="" off-text="" v-model="formData.is_year"></el-switch>
					</el-form-item>
					<el-row v-if="formData.is_year == true">
						<el-form-item label="备份时间" prop="year_time">
							<el-input-number v-model="formData.year_time" :min="1" :max="365"></el-input-number>
						</el-form-item>
						<el-form-item label="备份间隔" prop="year_gap">
							<el-input-number v-model="formData.year_gap" :min="1" :max="12"></el-input-number>
						</el-form-item>
						<el-form-item label="保留备份副本数" prop="year_num">
							<el-input-number v-model="formData.year_num" :min="1" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="备份特性" style="white-space: nowrap;">
							<span>强制全备份</span>
							<el-switch on-text="" off-text="" v-model="formData.year_force_full"></el-switch>
							<span>执行一致性备份</span>
							<el-switch on-text="" off-text="" v-model="formData.year_quiesce"></el-switch>
							<span>副本实时待机</span>
							<el-switch on-text="" off-text="" v-model="formData.year_ensurance"></el-switch>
						</el-form-item>
					</el-row>
					<el-form-item label="设置月备份" style="white-space: nowrap;">
						<el-switch on-text="" off-text="" v-model="formData.is_month"></el-switch>
					</el-form-item>
					<el-row v-if="formData.is_month == true">
						<el-form-item label="备份时间" prop="month_time">
							<el-input-number v-model="formData.month_time" :min="1" :max="31"></el-input-number>
						</el-form-item>
						<el-form-item label="备份间隔" prop="month_gap">
							<el-input-number v-model="formData.month_gap" :min="1" :max="12"></el-input-number>
						</el-form-item>
						<el-form-item label="保留备份副本数" prop="month_num">
							<el-input-number v-model="formData.month_num" :min="1" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="备份特性" style="white-space: nowrap;">
							<span>强制全备份</span>
							<el-switch on-text="" off-text="" v-model="formData.month_force_full"></el-switch>
							<span>执行一致性备份</span>
							<el-switch on-text="" off-text="" v-model="formData.month_quiesce"></el-switch>
							<span>副本实时待机</span>
							<el-switch on-text="" off-text="" v-model="formData.month_ensurance"></el-switch>
						</el-form-item>
					</el-row>
					<el-form-item label="设置周备份" style="white-space: nowrap;">
						<el-switch on-text="" off-text="" v-model="formData.is_week"></el-switch>
					</el-form-item>
					<el-row v-if="formData.is_week == true">
						<el-form-item label="备份时间" prop="week_time">
							<el-input-number v-model="formData.week_time" :min="1" :max="7"></el-input-number>
						</el-form-item>
						<el-form-item label="备份间隔" prop="week_gap">
							<el-input-number v-model="formData.week_gap" :min="1" :max="12"></el-input-number>
						</el-form-item>
						<el-form-item label="保留备份副本数" prop="week_num">
							<el-input-number v-model="formData.week_num" :min="1" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="备份特性" style="white-space: nowrap;">
							<span>强制全备份</span>
							<el-switch on-text="" off-text="" v-model="formData.week_force_full"></el-switch>
							<span>执行一致性备份</span>
							<el-switch on-text="" off-text="" v-model="formData.week_quiesce"></el-switch>
							<span>副本实时待机</span>
							<el-switch on-text="" off-text="" v-model="formData.week_ensurance"></el-switch>
						</el-form-item>
					</el-row>
					<el-form-item label="设置日备份" style="white-space: nowrap;">
						<el-switch on-text="" off-text="" v-model="formData.is_day"></el-switch>
					</el-form-item>
					<el-row v-if="formData.is_day == true">
						<el-form-item label="备份间隔" prop="day_gap">
							<el-input-number v-model="formData.day_gap" :min="1" :max="12"></el-input-number>
						</el-form-item>
						<el-form-item label="保留备份副本数" prop="day_num">
							<el-input-number v-model="formData.day_num" :min="1" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="备份特性" style="white-space: nowrap;">
							<span>强制全备份</span>
							<el-switch on-text="" off-text="" v-model="formData.day_force_full"></el-switch>
							<span>执行一致性备份</span>
							<el-switch on-text="" off-text="" v-model="formData.day_quiesce"></el-switch>
							<span>副本实时待机</span>
							<el-switch on-text="" off-text="" v-model="formData.day_ensurance"></el-switch>
						</el-form-item>
					</el-row>
					<el-form-item label="设置粒度备份" style="white-space: nowrap;">
						<el-switch on-text="" off-text="" v-model="formData.is_hour"></el-switch>
					</el-form-item>
					<el-row v-if="formData.is_hour == true">
						<el-form-item label="备份间隔">
							<el-select v-model="activityValue" @change="selectActivity" :placeholder="activityValue">
								<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="保留备份副本数" prop="hour_num">
							<el-input-number v-model="formData.hour_num" :min="1" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="备份特性" style="white-space: nowrap;">
							<span>强制全备份</span>
							<el-switch on-text="" off-text="" v-model="formData.hour_force_full"></el-switch>
							<span>执行一致性备份</span>
							<el-switch on-text="" off-text="" v-model="formData.hour_quiesce"></el-switch>
							<span>副本实时待机</span>
							<el-switch on-text="" off-text="" v-model="formData.hour_ensurance"></el-switch>
						</el-form-item>
					</el-row>
					<el-form-item class="button_submit">
						<el-button type="primary" @click="submitForm('formData')">立即创建</el-button>
					</el-form-item>
				</el-form>
  			</el-col>
  		</el-row>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {addPolicy, searchplace, foodCategory} from '@/api/getData'
    import {baseUrl, baseImgPath} from '@/config/env'
    export default {
    	data(){
    		return {
    			city: {},
    			formData: {
					name: '', //策略名称
					encrypt: 'noencrypt',
					encrpt_password: '',
					year_time: 1,
					month_time: 1,
					day_time: 1,
					year_gap: 1,
					month_gap: 1,
					week_gap: 1,
					day_gap: 1,
					hour_gap: 1,
					year_num: 10,
					month_num: 12,
					week_num: 4,
					day_num: 7,
					hour_num: 10,
					is_year: false,
					is_month: false,
					is_week: false,
					is_day: true,
					is_hour: false,
					year_force_full: false,
					month_force_full: false,
					week_force_full: false,
					day_force_full: false,
					hour_force_full: false,
					year_quiesce: false,
					month_quiesce: false,
					week_quiesce: false,
					day_quiesce: false,
					hour_quiesce: false,
					year_ensurance: false,
					month_ensurance: false,
					week_ensurance: false,
					day_ensurance: false,
					hour_ensurance: false,
       	 			image_path: '',
       	 			business_license_image: '',
       	 			catering_service_license_image: '',

		        },
		        rules: {
					name: [
						{ required: true, message: '请输入策略名称', trigger: 'blur' },
					],
				},
				options: [{
		          	value: '3',
		          	label: '15分钟'
		        }, {
		          	value: '6',
		          	label: '30分钟'
		        }, {
		          	value: '12',
		          	label: '1小时'
		        }, {
		          	value: '24',
		          	label: '2小时'
		        }, {
		          	value: '48',
		          	label: '4小时'
		        }, {
		          	value: '96',
		          	label: '8小时'
		        }, {
		          	value: '144',
		          	label: '12小时'
		        }],
       	 		activityValue: '15分钟',
			    baseUrl,
			    baseImgPath,
			    categoryOptions: [],
    		}
    	},
    	components: {
    		headTop,
    	},
    	//mounted(){
    	//	this.initData();
    	//},
    	methods: {
/*
    		async initData(){
    			try{
    				//this.city = await cityGuess();
    				const categories = await foodCategory();
    				categories.forEach(item => {
    					if (item.sub_categories.length) {
    						const addnew = {
    							value: item.name,
						        label: item.name,
						        children: []
    						}
    						item.sub_categories.forEach((subitem, index) => {
    							if (index == 0) {
    								return
    							}
    							addnew.children.push({
    								value: subitem.name,
						        	label: subitem.name,
    							})
    						})
    						this.categoryOptions.push(addnew)

    					}
    				})
    			}catch(err){
    				console.log(err);
    			}
			},
*/
    		async querySearchAsync(queryString, cb) {
    			if (queryString) {
	    			try{
	    				const cityList = await searchplace(this.city.id, queryString);
	    				if (cityList instanceof Array) {
		    				cityList.map(item => {
		    					item.value = item.address;
		    					return item;
		    				})
		    				cb(cityList)
	    				}
	    			}catch(err){
	    				console.log(err)
	    			}
    			}
		    },
		    addressSelect(address){
		    	this.formData.latitude = address.latitude;
		    	this.formData.longitude = address.longitude;
		    	console.log(this.formData.latitude, this.formData.longitude)
		    },
			handleShopAvatarScucess(res, file) {
				if (res.status == 1) {
					this.formData.image_path = res.image_path;
				}else{
					this.$message.error('上传图片失败！');
				}
			},
			handleBusinessAvatarScucess(res, file) {
				if (res.status == 1) {
					this.formData.business_license_image = res.image_path;
				}else{
					this.$message.error('上传图片失败！');
				}
			},
			handleServiceAvatarScucess(res, file) {
				if (res.status == 1) {
					this.formData.catering_service_license_image = res.image_path;
				}else{
					this.$message.error('上传图片失败！');
				}
			},
			beforeAvatarUpload(file) {
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
			tableRowClassName(row, index) {
		        if (index === 1) {
		        	return 'info-row';
		        } else if (index === 3) {
		        	return 'positive-row';
		        }
		        return '';
		    },
		    selectActivity(){
		    	this.$prompt('请输入活动详情', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		        }).then(({ value }) => {
		        	if (value == null) {
		        		this.$message({
				            type: 'info',
				            message: '请输入活动详情'
				        });
		        		return
		        	}
		          	let newObj = {};
		          	switch(this.activityValue){
		          		case '满减优惠':
		          			newObj= {
		          				icon_name: '减',
					        	name: '满减优惠',
					        	description: value,
		          			}
		          			break;
		          		case '优惠大酬宾':
		          			newObj= {
		          				icon_name: '特',
					        	name: '优惠大酬宾',
					        	description: value,
		          			}
		          			break;
		          		case '新用户立减':
		          			newObj= {
		          				icon_name: '新',
					        	name: '新用户立减',
					        	description: value,
		          			}
		          			break;
		          		case '进店领券':
		          			newObj= {
		          				icon_name: '领',
					        	name: '进店领券',
					        	description: value,
		          			}
		          			break;
		          	}
		          	this.activities.push(newObj);
		        }).catch(() => {
		          	this.$message({
		            	type: 'info',
		            	message: '取消输入'
		          	});
		        });
		    },
		    handleDelete(index){
		    	this.activities.splice(index, 1)
		    },
		    submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						try{
							let result = await addPolicy(this.formData);
							if (result.status == 1) {
								this.$message({
					            	type: 'success',
					            	message: '添加成功'
					          	});
					          	this.formData = {
									name: '', //店铺名称
									encrypt: '',
									encrpt_password: '',
									year_time: 1,
									month_time: 1,
									day_time: 1,
									year_gap: 1,
									month_gap: 1,
									week_gap: 1,
									day_gap: 1,
									hour_gap: 1,
									year_num: 10,
									month_num: 12,
									week_num: 4,
									day_num: 7,
									hour_num: 10,
									is_year: false,
									is_month: false,
									is_week: false,
									is_day: true,
									is_hour: false,
									year_force_full: false,
									month_force_full: false,
									week_force_full: false,
									day_force_full: false,
									hour_force_full: false,
									year_quiesce: false,
									month_quiesce: false,
									week_quiesce: false,
									day_quiesce: false,
									hour_quiesce: false,
									year_ensurance: false,
									month_ensurance: false,
									week_ensurance: false,
									day_ensurance: false,
									hour_ensurance: false,
				       	 			image_path: '',
				       	 			business_license_image: '',
				       	 			catering_service_license_image: '',
						        };
							}else{
								this.$message({
					            	type: 'error',
					            	message: result.message
					          	});
							}
							console.log(result)
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
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.button_submit{
		text-align: center;
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
	.el-table .info-row {
	    background: #c9e5f5;
	}

	.el-table .positive-row {
	    background: #e2f0e4;
	}
</style>
