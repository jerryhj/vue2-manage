<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                @expand='expand'
                :expand-row-keys='expendRow'
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="所在区域">
                        <span>{{ props.row._area }}</span>
                      </el-form-item>
                      <el-form-item label="备份至">
                        <span>{{ props.row._s3area }}</span>
                      </el-form-item>
                      <el-form-item label="首次备份时间">
                        <span>{{ props.row.next_time }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="被保护虚拟机名称"
                  prop="vmname">
                </el-table-column>
                <el-table-column
                  label="当前策略"
                  prop="policy_name">
                </el-table-column>
                <el-table-column
                  label="备份优先级"
                  prop="_priv">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      @click="handleEdit(scope.row)">部署</el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>
            <el-dialog title="部署被保护虚拟机" v-model="dialogFormVisible">
                <el-form :model="selectTable" :rules="foodrules" ref="selectTable">
                    <el-form-item label="待部署的VM" label-width="100px">
                        <el-input v-model="selectTable.vmname" auto-complete="off" disabled></el-input>
                    </el-form-item>
					<el-form-item label="获取本地部署Key" style="white-space: nowrap;">
						<el-switch on-text="" off-text="" v-model="selectTable.is_local"></el-switch>
					</el-form-item>
					<el-row v-if="selectTable.is_local == true">
                        <el-form-item label="本地部署Key" label-width="100px">
                            <el-input v-model="selectTable.installkey" auto-complete="off" readonly></el-input>
                        </el-form-item>
					</el-row>
                    <el-form-item label="IP地址"  label-width="100px" prop="ipaddr">
                        <el-input v-model="selectTable.ipaddr"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名"  label-width="100px" prop="username">
                        <el-input v-model="selectTable.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码"  label-width="100px" prop="password">
                        <el-input type="password" v-model="selectTable.password"></el-input>
                    </el-form-item>
					<el-form-item label="设置云访问权限" style="white-space: nowrap;">
						<el-switch on-text="" off-text="" v-model="selectTable.is_cloud"></el-switch>
					</el-form-item>
					<el-row v-if="selectTable.is_cloud == true">
                        <el-form-item label="AccessKey"  label-width="100px" prop="accesskey">
                            <el-input v-model="selectTable.accesskey"></el-input>
                        </el-form-item>
                        <el-form-item label="SecretKey"  label-width="100px" prop="secretkey">
                            <el-input v-model="selectTable.secretkey"></el-input>
                        </el-form-item>
                        <el-form-item label="VPC ID"  label-width="100px" prop="vpcid">
                            <el-input v-model="selectTable.vpcid"></el-input>
                        </el-form-item>
					</el-row>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addVM('selectTable')">确 定</el-button>
              </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
	import env from '@/config/env'
    import {refresh, getUndepolyVMs, getUndepolyVMCount, getVMInstallKey, addVM, deleteUndepolyVM} from '@/api/getData'
    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                restaurant_id: null,
                city: {},
                offset: 0,
                limit: 20,
                count: 0,
                tableData: [],
  				privlist: {
		          	9: '低',
		          	5: '中',
		          	1: '高',
		        },
     			arealist: {
                    0: '未知',
                    0x00100101: '阿里云北京',
                    0x00100201: '阿里云上海',
                    0x00100301: '阿里云深圳',
                    0x00100401: '阿里云杭州',
                    0x00100501: '阿里云青岛',
                    0x00100601: '阿里云张家口',
                    0x00100701: '阿里云呼和浩特',
                    0x00100801: '阿里云成都',
                    0x00200101: '腾讯云北京',
                    0x00200201: '腾讯云上海',
                    0x00200301: '腾讯云广州',
                    0x00200401: '腾讯云南京',
                    0x00200501: '腾讯云成都',
                    0x00200601: '腾讯云重庆',
                    0x00300101: '华为云北京',
                    0x00300201: '华为云上海',
                    0x00300301: '华为云广州',
                    0x00300401: '华为云贵阳',
                    0x00400101: '百度云北京',
                    0x00400201: '百度云苏州',
                    0x00400301: '百度云广州',
                    0x00400401: '百度云保定',
		        },
     			s3arealist: {
                    0: '未知',
                    0x00100101: '阿里云北京',
                    0x00100201: '阿里云上海',
                    0x00100301: '阿里云深圳',
                    0x00100401: '阿里云杭州',
                    0x00100501: '阿里云青岛',
                    0x00100601: '阿里云张家口',
                    0x00100701: '阿里云呼和浩特',
                    0x00200101: '腾讯云北京',
                    0x00200201: '腾讯云上海',
                    0x00200301: '腾讯云广州',
                    0x00200401: '腾讯云南京',
                    0x00200501: '腾讯云成都',
                    0x00200601: '腾讯云重庆',
		        },
    			_priv: [{
		          	value: 9,
		          	label: '低'
		        }, {
		          	value: 5,
		          	label: '中'
		        }, {
		          	value: 1,
		          	label: '高'
		        },],
                currentPage: 1,
                selectTable: {
                    is_local: false,
                },
                is_local: false,
                dialogFormVisible: false,
                menuOptions: [],
                selectMenu: {},
                selectIndex: null,
                foodrules: {
    				ipaddr: [
						{ required: true, message: '请输入虚拟机IP地址', trigger: 'blur' },
					],
    				username: [
						{ required: true, message: '请输入用户名', trigger: 'blur' },
					],
    				password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
					],
		        },
		        specsFormVisible: false,
                expendRow: [],
            }
        },
        created(){
        	//this.restaurant_id = this.$route.query.restaurant_id;
            //this.initData();
        },
        activated(){
        	this.restaurant_id = this.$route.query.restaurant_id;
            this.initData();
        },
        computed: {
/*
        	specs: function (){
        		let specs = [];
        		if (this.selectTable.specfoods) {
	        		this.selectTable.specfoods.forEach(item => {
	        			specs.push({
	        				specs: item.specs_name,
	        				packing_fee: item.packing_fee,
	        				price: item.price,
	        			})
	        		})
        		}
        		return specs
            }
*/
        },
    	components: {
    		headTop,
    	},
        methods: {
            async initData(){
                try{
                    const countData = await getUndepolyVMCount();
                    if (countData.status == 1) {
                        this.count = countData.count;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    this.getUndepolyVMs();
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
						this.selectTable.policy = result.category_list;
						this.policy = result.category_list;
	    			}else{
	    				console.log(result)
	    			}
    			}catch(err){
    				console.log(err)
                }
*/
            },
/*
            async getMenu(){
            	this.menuOptions = [];
                try{
                    const menu = await getMenu({restaurant_id: this.selectTable.restaurant_id, allMenu: true});
                    menu.forEach((item, index) => {
                        this.menuOptions.push({
                        	label: item.name,
                        	value: item.id,
                        	index,
                        })
                    })
                }catch(err){
                    console.log('获取食品种类失败', err);
                }
            },
*/
            async getUndepolyVMs(){
                const Foods = await getUndepolyVMs({offset: this.offset, limit: this.limit});
                this.tableData = [];
                Foods.forEach((item, index) => {
                    const tableData = {};
                    tableData.vmname = item.vmname;
                    tableData.item_id = item.id;
                    tableData.policy_name = item.policy_name;
                    tableData.policy = item.policy_name;
                    tableData.priority = item.priority;
                    tableData._priv = this.privlist[item.priority];
                    tableData._area = this.arealist[item.area];
                    tableData._s3area = this.s3arealist[item.s3area];
                    tableData.next_time = item.next_time;
                    tableData.image_path = item.image_path;
                    tableData.specfoods = item.specfoods;
                    tableData.index = index;
                    this.tableData.push(tableData);
                })
            },
            tableRowClassName(row, index) {
		        if (index === 1) {
		        	return 'info-row';
		        } else if (index === 3) {
		        	return 'positive-row';
		        }
		        return '';
            },
/*
		    addspecs(){
				this.specs.push({...this.specsForm});
				this.specsForm.specs = '';
				this.specsForm.packing_fee = 0;
				this.specsForm.price = 20;
				this.specsFormVisible = false;
			},
			deleteSpecs(index){
				this.specs.splice(index, 1);
            },
*/
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getUndepolyVMs()
            },
            expand(row, status){
            	if (status) {
            		this.getSelectItemData(row)
            	}else{
                    const index = this.expendRow.indexOf(row.index);
                    this.expendRow.splice(index, 1)
                }
            },
            async handleEdit(row) {
            	this.getSelectItemData(row, 'edit')
                //this.selectTable = row;
                this.dialogFormVisible = true;

    			try{
    				const result = await getVMInstallKey(row.item_id);
	    			if (result.status == 1) {
						this.selectTable.installkey = result.message;
						this.installkey = result.message;
	    			}else{
	    				console.log(result)
	    			}
    			}catch(err){
                    const message = "会话过期，请重新登录"
                    this.$router.push('/');
                    env.token = ''
    				console.log(err)
    			}
            },
            async getSelectItemData(row, type){
            	//const restaurant = await getResturantDetail(row.restaurant_id);
            	//const category = await getMenuById(row.category_id)
                this.selectTable = {...row};
                //this.selectTable.is_local = false;

                //this.selectMenu = {label: category.name, value: row.category_id}
                this.tableData.splice(row.index, 1, {...this.selectTable});
                this.$nextTick(() => {
                    this.expendRow.push(row.index);
                })
                //if (type == 'edit' && this.restaurant_id != row.restaurant_id) {
                //	this.getMenu();
                //}
            },
            handleSelect(index){
            	this.selectIndex = index;
            	this.selectMenu = this.menuOptions[index];
            },
            async handleDelete(index, row) {
                try{
                    const res = await deleteUndepolyVM(row.item_id);
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除待部署虚拟机成功'
                        });
                        this.tableData.splice(index, 1);
                    }else{
                        throw new Error(res.message)
                    }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除待部署虚拟机失败')
                }
            },
/*
            handleServiceAvatarScucess(res, file) {
                if (res.status == 1) {
                    this.selectTable.image_path = res.image_path;
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
*/
            async addVM(selectTable){
		    	this.$refs[selectTable].validate(async (valid) => {
					if (valid) {
                        this.dialogFormVisible = false;
						const params = {
							...this.selectTable,
							//category_id: this.selectValue.id,
							//restaurant_id: this.restaurant_id,
						}
                        try{
                            //const subData = {new_category_id: this.selectMenu.value, specs: this.specs};
                            //const postData = {...this.selectTable, ...subData};
                            const postData = {...this.selectTable};
                            const res = await addVM(postData)
                            if (res.status == 1) {
                                this.$message({
                                    type: 'success',
                                    message: '开始部署'
                                });
                                //this.getVMs();
								//this.$router.push('vmlist')
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: res.message
                                });
                            }
                        }catch(err){
                            console.log('部署VM失败', err);
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
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
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
</style>
