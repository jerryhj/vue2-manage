<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="策略名称">
                        <span>{{ props.row.name }}</span>
                      </el-form-item>
                      <el-form-item label="是否加密">
                        <span>{{ props.row.address }}</span>
                      </el-form-item>
                      <el-form-item label="年备份">
                        <span>{{ props.row.year }}</span>
                      </el-form-item>
                      <el-form-item label="月备份">
                        <span>{{ props.row.month }}</span>
                      </el-form-item>
                      <el-form-item label="周备份">
                        <span>{{ props.row.week }}</span>
                      </el-form-item>
                      <el-form-item label="日备份">
                        <span>{{ props.row.day }}</span>
                      </el-form-item>
                      <el-form-item label="粒度备份">
                        <span>{{ props.row.hour }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="策略名称"
                  prop="name">
                </el-table-column>
                <el-table-column
                  label="是否加密"
                  prop="address">
                </el-table-column>
                <el-table-column
                  label="策略详情"
                  prop="description">
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                      size="mini"
                      type="Success"
                      @click="addFood(scope.$index, scope.row)">添加食品</el-button>
                    <el-button
                      size="mini"
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
            <el-dialog title="修改备份策略" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="策略名称" label-width="100px">
                        <el-input v-model="selectTable.name" auto-complete="off"></el-input>
                    </el-form-item>

					<el-form-item label="策略密码" label-width="100px">
						<el-radio class="radio" v-model="selectTable.encrypt" label="noencrypt">不加密</el-radio>
  						<el-radio class="radio" v-model="selectTable.encrypt" label="default_encrypt">使用缺省密码</el-radio>
  						<el-radio class="radio" v-model="selectTable.encrypt" label="use_encrpt">设定密码</el-radio>
					</el-form-item>
					<el-row v-if="selectTable.encrypt == 'use_encrpt'">
						<el-form-item label="设置密码" prop="encrpt_password">
							<el-input v-model="selectTable.encrpt_password"></el-input>
						</el-form-item>
					</el-row>
					<el-form-item label="设置年备份" label-width="100px" style="white-space: nowrap;">
						<el-switch on-text="" off-text="" v-model="selectTable.is_year"></el-switch>
					</el-form-item>
					<el-row v-if="selectTable.is_year == true">
						<el-form-item label="备份时间" label-width="100px" prop="year_time">
							<el-input-number v-model="selectTable.year_time" :min="1" :max="365"></el-input-number>
						</el-form-item>
						<el-form-item label="备份间隔" label-width="100px" prop="year_gap">
							<el-input-number v-model="selectTable.year_gap" :min="1" :max="12"></el-input-number>
						</el-form-item>
						<el-form-item label="保留备份副本数" label-width="100px" prop="year_num">
							<el-input-number v-model="selectTable.year_num" :min="1" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="备份特性" label-width="100px" style="white-space: nowrap;">
							<span>强制全备份</span>
							<el-switch on-text="" off-text="" v-model="selectTable.year_force_full"></el-switch>
							<span>执行一致性备份</span>
							<el-switch on-text="" off-text="" v-model="selectTable.year_quiesce"></el-switch>
							<span>备份验证</span>
							<el-switch on-text="" off-text="" v-model="selectTable.year_ensurance"></el-switch>
						</el-form-item>
					</el-row>
					<el-form-item label="设置月备份" label-width="100px" style="white-space: nowrap;">
						<el-switch on-text="" off-text="" v-model="selectTable.is_month"></el-switch>
					</el-form-item>
					<el-row v-if="selectTable.is_month == true">
						<el-form-item label="备份时间" label-width="100px" prop="month_time">
							<el-input-number v-model="selectTable.month_time" :min="1" :max="31"></el-input-number>
						</el-form-item>
						<el-form-item label="备份间隔" label-width="100px" prop="month_gap">
							<el-input-number v-model="selectTable.month_gap" :min="1" :max="12"></el-input-number>
						</el-form-item>
						<el-form-item label="保留备份副本数" label-width="100px" prop="month_num">
							<el-input-number v-model="selectTable.month_num" :min="1" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="备份特性" label-width="100px" style="white-space: nowrap;">
							<span>强制全备份</span>
							<el-switch on-text="" off-text="" v-model="selectTable.month_force_full"></el-switch>
							<span>执行一致性备份</span>
							<el-switch on-text="" off-text="" v-model="selectTable.month_quiesce"></el-switch>
							<span>备份验证</span>
							<el-switch on-text="" off-text="" v-model="selectTable.month_ensurance"></el-switch>
						</el-form-item>
					</el-row>
					<el-form-item label="设置周备份" label-width="100px" style="white-space: nowrap;">
						<el-switch on-text="" off-text="" v-model="selectTable.is_week"></el-switch>
					</el-form-item>
					<el-row v-if="selectTable.is_week == true">
						<el-form-item label="备份时间" label-width="100px" prop="week_time">
							<el-input-number v-model="selectTable.week_time" :min="1" :max="7"></el-input-number>
						</el-form-item>
						<el-form-item label="备份间隔" label-width="100px" prop="week_gap">
							<el-input-number v-model="selectTable.week_gap" :min="1" :max="12"></el-input-number>
						</el-form-item>
						<el-form-item label="保留备份副本数" label-width="100px" prop="week_num">
							<el-input-number v-model="selectTable.week_num" :min="1" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="备份特性" label-width="100px" style="white-space: nowrap;">
							<span>强制全备份</span>
							<el-switch on-text="" off-text="" v-model="selectTable.week_force_full"></el-switch>
							<span>执行一致性备份</span>
							<el-switch on-text="" off-text="" v-model="selectTable.week_quiesce"></el-switch>
							<span>备份验证</span>
							<el-switch on-text="" off-text="" v-model="selectTable.week_ensurance"></el-switch>
						</el-form-item>
					</el-row>
					<el-form-item label="设置日备份" label-width="100px" style="white-space: nowrap;">
						<el-switch on-text="" off-text="" v-model="selectTable.is_day"></el-switch>
					</el-form-item>
					<el-row v-if="selectTable.is_day == true">
						<el-form-item label="备份间隔" label-width="100px" prop="day_gap">
							<el-input-number v-model="selectTable.day_gap" :min="1" :max="12"></el-input-number>
						</el-form-item>
						<el-form-item label="保留备份副本数" label-width="100px" prop="day_num">
							<el-input-number v-model="selectTable.day_num" :min="1" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="备份特性" label-width="100px" style="white-space: nowrap;">
							<span>强制全备份</span>
							<el-switch on-text="" off-text="" v-model="selectTable.day_force_full"></el-switch>
							<span>执行一致性备份</span>
							<el-switch on-text="" off-text="" v-model="selectTable.day_quiesce"></el-switch>
							<span>备份验证</span>
							<el-switch on-text="" off-text="" v-model="selectTable.day_ensurance"></el-switch>
						</el-form-item>
					</el-row>
					<el-form-item label="设置粒度备份" label-width="100px" style="white-space: nowrap;">
						<el-switch on-text="" off-text="" v-model="selectTable.is_hour"></el-switch>
					</el-form-item>
					<el-row v-if="selectTable.is_hour == true">
						<el-form-item label="备份间隔" label-width="100px">
							<el-select v-model="activityValue" @change="selectActivity" :placeholder="activityValue">
								<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="保留备份副本数" label-width="100px" prop="hour_num">
							<el-input-number v-model="selectTable.hour_num" :min="1" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="备份特性" label-width="100px" style="white-space: nowrap;">
							<span>强制全备份</span>
							<el-switch on-text="" off-text="" v-model="selectTable.hour_force_full"></el-switch>
							<span>执行一致性备份</span>
							<el-switch on-text="" off-text="" v-model="selectTable.hour_quiesce"></el-switch>
							<span>备份验证</span>
							<el-switch on-text="" off-text="" v-model="selectTable.hour_ensurance"></el-switch>
						</el-form-item>
					</el-row>

                    <el-form-item label="详细地址" label-width="100px">
                        <el-autocomplete
                          v-model="address.address"
                          :fetch-suggestions="querySearchAsync"
                          placeholder="请输入地址"
                          style="width: 100%;"
                          @select="addressSelect"
                        ></el-autocomplete>
                        <span>当前城市：{{city.name}}</span>
                    </el-form-item>
                    <el-form-item label="店铺介绍" label-width="100px">
                        <el-input v-model="selectTable.description"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" label-width="100px">
                        <el-input v-model="selectTable.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺分类" label-width="100px">
                        <el-cascader
                          :options="categoryOptions"
                          v-model="selectedCategory"
                          change-on-select
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="商铺图片" label-width="100px">
                        <el-upload
                          class="avatar-uploader"
                          :action="baseUrl + '/v1/addimg/shop'"
                          :show-file-list="false"
                          :on-success="handleServiceAvatarScucess"
                          :before-upload="beforeAvatarUpload">
                          <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateShop">确 定</el-button>
              </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getResturants, getPolicyCount, foodCategory, updateResturant, searchplace, deleteResturant} from '@/api/getData'
    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                city: {},
                offset: 0,
                limit: 20,
                count: 0,
                tableData: [],
                currentPage: 1,
                selectTable: {},
                dialogFormVisible: false,
                categoryOptions: [],
                selectedCategory: [],
                address: {},
            }
        },
        created(){
            this.initData();
            console.log(11111)
        },
    	components: {
    		headTop,
    	},
        methods: {
            async initData(){
                try{
                    //this.city = await cityGuess();
                    const countData = await getPolicyCount();
                    if (countData.status == 1) {
                        this.count = countData.count;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    this.getResturants();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            async getCategory(){
                try{
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
                    console.log('获取商铺种类失败', err);
                }
            },
            async getResturants(){
                //const {latitude, longitude} = this.city;
                const restaurants = await getResturants({offset: this.offset, limit: this.limit});
                this.tableData = [];
                restaurants.forEach(item => {
                    const tableData = {};
                    tableData.name = item.name;
                    tableData.address = item.address;
                    tableData.description = item.description;
                    tableData.id = item.id;
                    tableData.year = item.yearly_sched_id;
                    //tableData.phone = item.phone;
                    //tableData.rating = item.rating;
                    //tableData.recent_order_num = item.recent_order_num;
                    //tableData.category = item.category;
                    tableData.image_path = item.image_path;
                    this.tableData.push(tableData);
                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getResturants()
            },
            handleEdit(index, row) {
                this.selectTable = row;
                this.address.address = row.address;
                this.dialogFormVisible = true;
                this.selectedCategory = row.category.split('/');
                if (!this.categoryOptions.length) {
                    this.getCategory();
                }
            },
            addFood(index, row){
                this.$router.push({ path: 'addGoods', query: { restaurant_id: row.id }})
            },
            async handleDelete(index, row) {
                try{
                    const res = await deleteResturant(row.id);
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除备份策略成功'
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
                    console.log('删除备份策略失败')
                }
            },
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
            addressSelect(vale){
                const {address, latitude, longitude} = vale;
                this.address = {address, latitude, longitude};
            },
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
            async updateShop(){
                this.dialogFormVisible = false;
                try{
                    Object.assign(this.selectTable, this.address);
                    this.selectTable.category = this.selectedCategory.join('/');
                    const res = await updateResturant(this.selectTable)
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新店铺信息成功'
                        });
                        this.getResturants();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新餐馆信息失败', err);
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
