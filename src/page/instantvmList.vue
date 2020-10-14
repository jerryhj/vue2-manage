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
                        <span>{{ props.row.area }}</span>
                      </el-form-item>
                      <el-form-item label="最近恢复的会话">
                        <span>{{ props.row.sessnum }}</span>
                      </el-form-item>
                      <el-form-item label="最近恢复完成时间">
                        <span>{{ props.row.latest_recovery_time }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="即时恢复虚拟机IP"
                  prop="ipaddr">
                </el-table-column>
                <el-table-column
                  label="绑定的VM"
                  prop="vmname">
                </el-table-column>
                <el-table-column
                  label="当前状态"
                  prop="status">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      @click="handleEdit(scope.row)">绑定</el-button>
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
            <el-dialog title="绑定即时恢复虚拟机" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="IP地址" label-width="100px">
                        <el-input v-model="selectTable.ipaddr" auto-complete="off" disabled></el-input>
                    </el-form-item>
					<el-form-item label="绑定的VM" label-width="100px" prop="vmnamelist">
						<el-select v-model="selectTable.vmname" placeholder="请选择">
						    <el-option
						      	v-for="item in vmnamelist"
						      	:key="item.value"
						      	:label="item.label"
						      	:value="item.value">
						    </el-option>
					 	</el-select>
					</el-form-item>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="bindVM">确 定</el-button>
              </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
	import env from '@/config/env'
    import {refresh, getInstantVMs, getInstantVMCount, getVMName, bindVM, deleteInstantVM} from '@/api/getData'
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
     			vmnamelist: [{
		        },],
               currentPage: 1,
                selectTable: {},
                dialogFormVisible: false,
                menuOptions: [],
                selectMenu: {},
                selectIndex: null,
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
        },
    	components: {
    		headTop,
    	},
        methods: {
            async initData(){
                try{
                    const countData = await getInstantVMCount();
                    if (countData.status == 1) {
                        this.count = countData.count;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    this.getInstantVMs();
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
    				const result = await getVMName();
	    			if (result.status == 1) {
	    				result.category_list.map((item, index) => {
	    					item.value = item.vmname;
	    					item.label = item.vmname;
	    				})
						this.selectTable.vmnamelist = result.category_list;
						this.vmnamelist = result.category_list;
	    			}else{
	    				console.log(result)
	    			}
    			}catch(err){
    				console.log(err)
                }
            },
            async getInstantVMs(){
                const InstantVMs = await getInstantVMs({offset: this.offset, limit: this.limit});
                this.tableData = [];
                InstantVMs.forEach((item, index) => {
                    const tableData = {};
                    tableData.ipaddr = item.ipaddr;
                    tableData.vmname = item.vmname;
                    tableData.sessnum = item.sessnum;
                    tableData.item_id = item.id;
                    tableData.status = item.status;
                    tableData.area = item.area;
                    tableData.latest_recovery_time = item.latest_recovery_time;
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
                this.getInstantVMs()
            },
            expand(row, status){
/*
            	if (status) {
            		this.getSelectItemData(row)
            	}else{
                    const index = this.expendRow.indexOf(row.index);
                    this.expendRow.splice(index, 1)
                }
*/
            },
            handleEdit(row) {
            	this.getSelectItemData(row, 'edit')
                this.selectTable = row;
                this.dialogFormVisible = true;
            },
            async getSelectItemData(row, type){
            	//const restaurant = await getResturantDetail(row.restaurant_id);
            	//const category = await getMenuById(row.category_id)
                this.selectTable = {...row};

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
                    const res = await deleteInstantVM(row.item_id);
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除即时恢复虚拟机成功'
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
                    console.log('删除被保护虚拟机失败')
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
            async bindVM(){
                this.dialogFormVisible = false;
                try{
                	const subData = {new_category_id: this.selectMenu.value, specs: this.specs};
                	const postData = {...this.selectTable, ...subData};
                    const res = await bindVM(postData)
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '绑定VM成功'
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                    this.getInstantVMs();
                }catch(err){
                    console.log('绑定VM失败', err);
                }
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
