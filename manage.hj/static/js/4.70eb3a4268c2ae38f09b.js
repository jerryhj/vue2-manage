webpackJsonp([4],{205:function(e,t,a){a(499);var l=a(85)(a(377),a(525),null,null);e.exports=l.exports},220:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=a(51),s=a.n(l),r=a(50),n=a.n(r),o=a(52),c=a.n(o),i=(a(86),a(49)),u=a(87);t.default={data:function(){return{baseImgPath:i.c}},created:function(){this.adminInfo.id||this.getAdminData()},computed:c()({},a.i(u.b)(["adminInfo"])),methods:c()({},a.i(u.c)(["getAdminData"]),{handleCommand:function(e){var t=this;return n()(s.a.mark(function a(){return s.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:"home"==e?t.$router.push("/manage"):"signout"==e&&(t.$message({type:"success",message:"退出成功"}),t.$router.push("/"),i.b.token="");case 1:case"end":return a.stop()}},a,t)}))()}})}},221:function(e,t,a){t=e.exports=a(191)(!1),t.push([e.i,".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}.header_container{background-color:#eff2f7;height:60px;display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:center;align-items:center;padding-left:20px}.avator{width:36px;height:36px;border-radius:50%;margin-right:37px}.el-dropdown-menu__item{text-align:center}",""])},222:function(e,t,a){var l=a(221);"string"==typeof l&&(l=[[e.i,l,""]]),l.locals&&(e.exports=l.locals);a(192)("019239ba",l,!0)},223:function(e,t,a){a(222);var l=a(85)(a(220),a(224),null,null);e.exports=l.exports},224:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"header_container"},[a("el-breadcrumb",{attrs:{separator:"/"}},[a("el-breadcrumb-item",{attrs:{to:{path:"/manage"}}},[e._v("首页")]),e._v(" "),e._l(e.$route.meta,function(t,l){return a("el-breadcrumb-item",{key:l},[e._v(e._s(t))])})],2),e._v(" "),a("el-dropdown",{attrs:{"menu-align":"start"},on:{command:e.handleCommand}},[a("img",{staticClass:"avator",attrs:{src:e.baseImgPath+e.adminInfo.avatar}}),e._v(" "),a("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[a("el-dropdown-item",{attrs:{command:"home"}},[e._v("首页")]),e._v(" "),a("el-dropdown-item",{attrs:{command:"signout"}},[e._v("退出")])],1)],1)],1)},staticRenderFns:[]}},377:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=a(88),s=a.n(l),r=a(51),n=a.n(r),o=a(50),c=a.n(o),i=a(223),u=a.n(i),p=a(49),b=a(86);t.default={data:function(){return{baseUrl:p.a,baseImgPath:p.c,city:{},offset:0,limit:20,count:0,tableData:[],currentPage:1,selectTable:{},dialogFormVisible:!1,categoryOptions:[],selectedCategory:[],address:{}}},created:function(){this.initData(),console.log(11111)},components:{headTop:u.a},methods:{initData:function(){var e=this;return c()(n.a.mark(function t(){var l;return n.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,a.i(b.q)();case 3:if(l=t.sent,1!=l.status){t.next=8;break}e.count=l.count,t.next=9;break;case 8:throw new Error("获取数据失败");case 9:e.getResturants(),t.next=15;break;case 12:t.prev=12,t.t0=t.catch(0),console.log("获取数据失败",t.t0);case 15:case"end":return t.stop()}},t,e,[[0,12]])}))()},getCategory:function(){var e=this;return c()(n.a.mark(function t(){var l;return n.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,a.i(b.r)();case 3:l=t.sent,l.forEach(function(t){if(t.sub_categories.length){var a={value:t.name,label:t.name,children:[]};t.sub_categories.forEach(function(e,t){0!=t&&a.children.push({value:e.name,label:e.name})}),e.categoryOptions.push(a)}}),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.log("获取商铺种类失败",t.t0);case 10:case"end":return t.stop()}},t,e,[[0,7]])}))()},getResturants:function(){var e=this;return c()(n.a.mark(function t(){var l;return n.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,a.i(b.s)({offset:e.offset,limit:e.limit});case 2:l=t.sent,e.tableData=[],l.forEach(function(t){var a={};a.name=t.name,a.address=t.address,a.description=t.description,a.id=t.id,a.year=t.yearly_sched_id,a.image_path=t.image_path,e.tableData.push(a)});case 5:case"end":return t.stop()}},t,e)}))()},handleSizeChange:function(e){console.log("每页 "+e+" 条")},handleCurrentChange:function(e){this.currentPage=e,this.offset=(e-1)*this.limit,this.getResturants()},handleEdit:function(e,t){this.selectTable=t,this.address.address=t.address,this.dialogFormVisible=!0,this.selectedCategory=t.category.split("/"),this.categoryOptions.length||this.getCategory()},addFood:function(e,t){this.$router.push({path:"addGoods",query:{restaurant_id:t.id}})},handleDelete:function(e,t){var l=this;return c()(n.a.mark(function s(){var r;return n.a.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.prev=0,s.next=3,a.i(b.t)(t.id);case 3:if(r=s.sent,1!=r.status){s.next=9;break}l.$message({type:"success",message:"删除备份策略成功"}),l.tableData.splice(e,1),s.next=10;break;case 9:throw new Error(r.message);case 10:s.next=16;break;case 12:s.prev=12,s.t0=s.catch(0),l.$message({type:"error",message:s.t0.message}),console.log("删除备份策略失败");case 16:case"end":return s.stop()}},s,l,[[0,12]])}))()},querySearchAsync:function(e,t){var l=this;return c()(n.a.mark(function s(){var r;return n.a.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:if(!e){s.next=11;break}return s.prev=1,s.next=4,a.i(b.u)(l.city.id,e);case 4:r=s.sent,r instanceof Array&&(r.map(function(e){return e.value=e.address,e}),t(r)),s.next=11;break;case 8:s.prev=8,s.t0=s.catch(1),console.log(s.t0);case 11:case"end":return s.stop()}},s,l,[[1,8]])}))()},addressSelect:function(e){var t=e.address,a=e.latitude,l=e.longitude;this.address={address:t,latitude:a,longitude:l}},handleServiceAvatarScucess:function(e,t){1==e.status?this.selectTable.image_path=e.image_path:this.$message.error("上传图片失败！")},beforeAvatarUpload:function(e){var t="image/jpeg"===e.type||"image/png"===e.type,a=e.size/1024/1024<2;return t||this.$message.error("上传头像图片只能是 JPG 格式!"),a||this.$message.error("上传头像图片大小不能超过 2MB!"),t&&a},updateShop:function(){var e=this;return c()(n.a.mark(function t(){var l;return n.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.dialogFormVisible=!1,t.prev=1,s()(e.selectTable,e.address),e.selectTable.category=e.selectedCategory.join("/"),t.next=6,a.i(b.v)(e.selectTable);case 6:l=t.sent,1==l.status?(e.$message({type:"success",message:"更新店铺信息成功"}),e.getResturants()):e.$message({type:"error",message:l.message}),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(1),console.log("更新餐馆信息失败",t.t0);case 13:case"end":return t.stop()}},t,e,[[1,10]])}))()}}}},406:function(e,t,a){t=e.exports=a(191)(!1),t.push([e.i,".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}.demo-table-expand{font-size:0}.demo-table-expand label{width:90px;color:#99a9bf}.demo-table-expand .el-form-item{margin-right:0;margin-bottom:0;width:50%}.table_container{padding:20px}.Pagination{display:-ms-flexbox;display:flex;-ms-flex-pack:start;justify-content:flex-start;margin-top:8px}.avatar-uploader .el-upload{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden}.avatar-uploader .el-upload:hover{border-color:#20a0ff}.avatar-uploader-icon{font-size:28px;color:#8c939d;width:120px;height:120px;line-height:120px;text-align:center}.avatar{width:120px;height:120px;display:block}",""])},499:function(e,t,a){var l=a(406);"string"==typeof l&&(l=[[e.i,l,""]]),l.locals&&(e.exports=l.locals);a(192)("f7da7120",l,!0)},525:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"fillcontain"},[a("head-top"),e._v(" "),a("div",{staticClass:"table_container"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData}},[a("el-table-column",{attrs:{type:"expand"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-form",{staticClass:"demo-table-expand",attrs:{"label-position":"left",inline:""}},[a("el-form-item",{attrs:{label:"策略名称"}},[a("span",[e._v(e._s(t.row.name))])]),e._v(" "),a("el-form-item",{attrs:{label:"是否加密"}},[a("span",[e._v(e._s(t.row.address))])]),e._v(" "),a("el-form-item",{attrs:{label:"年备份"}},[a("span",[e._v(e._s(t.row.year))])]),e._v(" "),a("el-form-item",{attrs:{label:"月备份"}},[a("span",[e._v(e._s(t.row.month))])]),e._v(" "),a("el-form-item",{attrs:{label:"周备份"}},[a("span",[e._v(e._s(t.row.week))])]),e._v(" "),a("el-form-item",{attrs:{label:"日备份"}},[a("span",[e._v(e._s(t.row.day))])]),e._v(" "),a("el-form-item",{attrs:{label:"粒度备份"}},[a("span",[e._v(e._s(t.row.hour))])])],1)]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"策略名称",prop:"name"}}),e._v(" "),a("el-table-column",{attrs:{label:"是否加密",prop:"address"}}),e._v(" "),a("el-table-column",{attrs:{label:"策略详情",prop:"description"}}),e._v(" "),a("el-table-column",{attrs:{label:"操作",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"mini"},on:{click:function(a){return e.handleEdit(t.$index,t.row)}}},[e._v("编辑")]),e._v(" "),a("el-button",{attrs:{size:"mini",type:"Success"},on:{click:function(a){return e.addFood(t.$index,t.row)}}},[e._v("添加食品")]),e._v(" "),a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(a){return e.handleDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],1),e._v(" "),a("div",{staticClass:"Pagination"},[a("el-pagination",{attrs:{"current-page":e.currentPage,"page-size":20,layout:"total, prev, pager, next",total:e.count},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1),e._v(" "),a("el-dialog",{attrs:{title:"修改备份策略"},model:{value:e.dialogFormVisible,callback:function(t){e.dialogFormVisible=t},expression:"dialogFormVisible"}},[a("el-form",{attrs:{model:e.selectTable}},[a("el-form-item",{attrs:{label:"策略名称","label-width":"100px"}},[a("el-input",{attrs:{"auto-complete":"off"},model:{value:e.selectTable.name,callback:function(t){e.$set(e.selectTable,"name",t)},expression:"selectTable.name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"策略密码","label-width":"100px"}},[a("el-radio",{staticClass:"radio",attrs:{label:"noencrypt"},model:{value:e.selectTable.encrypt,callback:function(t){e.$set(e.selectTable,"encrypt",t)},expression:"selectTable.encrypt"}},[e._v("不加密")]),e._v(" "),a("el-radio",{staticClass:"radio",attrs:{label:"default_encrypt"},model:{value:e.selectTable.encrypt,callback:function(t){e.$set(e.selectTable,"encrypt",t)},expression:"selectTable.encrypt"}},[e._v("使用缺省密码")]),e._v(" "),a("el-radio",{staticClass:"radio",attrs:{label:"use_encrpt"},model:{value:e.selectTable.encrypt,callback:function(t){e.$set(e.selectTable,"encrypt",t)},expression:"selectTable.encrypt"}},[e._v("设定密码")])],1),e._v(" "),"use_encrpt"==e.selectTable.encrypt?a("el-row",[a("el-form-item",{attrs:{label:"设置密码",prop:"encrpt_password"}},[a("el-input",{model:{value:e.selectTable.encrpt_password,callback:function(t){e.$set(e.selectTable,"encrpt_password",t)},expression:"selectTable.encrpt_password"}})],1)],1):e._e(),e._v(" "),a("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"设置年备份","label-width":"100px"}},[a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.is_year,callback:function(t){e.$set(e.selectTable,"is_year",t)},expression:"selectTable.is_year"}})],1),e._v(" "),1==e.selectTable.is_year?a("el-row",[a("el-form-item",{attrs:{label:"备份时间","label-width":"100px",prop:"year_time"}},[a("el-input-number",{attrs:{min:1,max:365},model:{value:e.selectTable.year_time,callback:function(t){e.$set(e.selectTable,"year_time",t)},expression:"selectTable.year_time"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"备份间隔","label-width":"100px",prop:"year_gap"}},[a("el-input-number",{attrs:{min:1,max:12},model:{value:e.selectTable.year_gap,callback:function(t){e.$set(e.selectTable,"year_gap",t)},expression:"selectTable.year_gap"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"保留备份副本数","label-width":"100px",prop:"year_num"}},[a("el-input-number",{attrs:{min:1,max:100},model:{value:e.selectTable.year_num,callback:function(t){e.$set(e.selectTable,"year_num",t)},expression:"selectTable.year_num"}})],1),e._v(" "),a("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"备份特性","label-width":"100px"}},[a("span",[e._v("强制全备份")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.year_force_full,callback:function(t){e.$set(e.selectTable,"year_force_full",t)},expression:"selectTable.year_force_full"}}),e._v(" "),a("span",[e._v("执行一致性备份")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.year_quiesce,callback:function(t){e.$set(e.selectTable,"year_quiesce",t)},expression:"selectTable.year_quiesce"}}),e._v(" "),a("span",[e._v("备份验证")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.year_ensurance,callback:function(t){e.$set(e.selectTable,"year_ensurance",t)},expression:"selectTable.year_ensurance"}})],1)],1):e._e(),e._v(" "),a("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"设置月备份","label-width":"100px"}},[a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.is_month,callback:function(t){e.$set(e.selectTable,"is_month",t)},expression:"selectTable.is_month"}})],1),e._v(" "),1==e.selectTable.is_month?a("el-row",[a("el-form-item",{attrs:{label:"备份时间","label-width":"100px",prop:"month_time"}},[a("el-input-number",{attrs:{min:1,max:31},model:{value:e.selectTable.month_time,callback:function(t){e.$set(e.selectTable,"month_time",t)},expression:"selectTable.month_time"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"备份间隔","label-width":"100px",prop:"month_gap"}},[a("el-input-number",{attrs:{min:1,max:12},model:{value:e.selectTable.month_gap,callback:function(t){e.$set(e.selectTable,"month_gap",t)},expression:"selectTable.month_gap"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"保留备份副本数","label-width":"100px",prop:"month_num"}},[a("el-input-number",{attrs:{min:1,max:100},model:{value:e.selectTable.month_num,callback:function(t){e.$set(e.selectTable,"month_num",t)},expression:"selectTable.month_num"}})],1),e._v(" "),a("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"备份特性","label-width":"100px"}},[a("span",[e._v("强制全备份")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.month_force_full,callback:function(t){e.$set(e.selectTable,"month_force_full",t)},expression:"selectTable.month_force_full"}}),e._v(" "),a("span",[e._v("执行一致性备份")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.month_quiesce,callback:function(t){e.$set(e.selectTable,"month_quiesce",t)},expression:"selectTable.month_quiesce"}}),e._v(" "),a("span",[e._v("备份验证")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.month_ensurance,callback:function(t){e.$set(e.selectTable,"month_ensurance",t)},expression:"selectTable.month_ensurance"}})],1)],1):e._e(),e._v(" "),a("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"设置周备份","label-width":"100px"}},[a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.is_week,callback:function(t){e.$set(e.selectTable,"is_week",t)},expression:"selectTable.is_week"}})],1),e._v(" "),1==e.selectTable.is_week?a("el-row",[a("el-form-item",{attrs:{label:"备份时间","label-width":"100px",prop:"week_time"}},[a("el-input-number",{attrs:{min:1,max:7},model:{value:e.selectTable.week_time,callback:function(t){e.$set(e.selectTable,"week_time",t)},expression:"selectTable.week_time"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"备份间隔","label-width":"100px",prop:"week_gap"}},[a("el-input-number",{attrs:{min:1,max:12},model:{value:e.selectTable.week_gap,callback:function(t){e.$set(e.selectTable,"week_gap",t)},expression:"selectTable.week_gap"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"保留备份副本数","label-width":"100px",prop:"week_num"}},[a("el-input-number",{attrs:{min:1,max:100},model:{value:e.selectTable.week_num,callback:function(t){e.$set(e.selectTable,"week_num",t)},expression:"selectTable.week_num"}})],1),e._v(" "),a("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"备份特性","label-width":"100px"}},[a("span",[e._v("强制全备份")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.week_force_full,callback:function(t){e.$set(e.selectTable,"week_force_full",t)},expression:"selectTable.week_force_full"}}),e._v(" "),a("span",[e._v("执行一致性备份")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.week_quiesce,callback:function(t){e.$set(e.selectTable,"week_quiesce",t)},expression:"selectTable.week_quiesce"}}),e._v(" "),a("span",[e._v("备份验证")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.week_ensurance,callback:function(t){e.$set(e.selectTable,"week_ensurance",t)},expression:"selectTable.week_ensurance"}})],1)],1):e._e(),e._v(" "),a("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"设置日备份","label-width":"100px"}},[a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.is_day,callback:function(t){e.$set(e.selectTable,"is_day",t)},expression:"selectTable.is_day"}})],1),e._v(" "),1==e.selectTable.is_day?a("el-row",[a("el-form-item",{attrs:{label:"备份间隔","label-width":"100px",prop:"day_gap"}},[a("el-input-number",{attrs:{min:1,max:12},model:{value:e.selectTable.day_gap,callback:function(t){e.$set(e.selectTable,"day_gap",t)},expression:"selectTable.day_gap"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"保留备份副本数","label-width":"100px",prop:"day_num"}},[a("el-input-number",{attrs:{min:1,max:100},model:{value:e.selectTable.day_num,callback:function(t){e.$set(e.selectTable,"day_num",t)},expression:"selectTable.day_num"}})],1),e._v(" "),a("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"备份特性","label-width":"100px"}},[a("span",[e._v("强制全备份")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.day_force_full,callback:function(t){e.$set(e.selectTable,"day_force_full",t)},expression:"selectTable.day_force_full"}}),e._v(" "),a("span",[e._v("执行一致性备份")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.day_quiesce,callback:function(t){e.$set(e.selectTable,"day_quiesce",t)},expression:"selectTable.day_quiesce"}}),e._v(" "),a("span",[e._v("备份验证")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.day_ensurance,callback:function(t){e.$set(e.selectTable,"day_ensurance",t)},expression:"selectTable.day_ensurance"}})],1)],1):e._e(),e._v(" "),a("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"设置粒度备份","label-width":"100px"}},[a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.is_hour,callback:function(t){e.$set(e.selectTable,"is_hour",t)},expression:"selectTable.is_hour"}})],1),e._v(" "),1==e.selectTable.is_hour?a("el-row",[a("el-form-item",{attrs:{label:"备份间隔","label-width":"100px"}},[a("el-select",{attrs:{placeholder:e.activityValue},on:{change:e.selectActivity},model:{value:e.activityValue,callback:function(t){e.activityValue=t},expression:"activityValue"}},e._l(e.options,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"保留备份副本数","label-width":"100px",prop:"hour_num"}},[a("el-input-number",{attrs:{min:1,max:100},model:{value:e.selectTable.hour_num,callback:function(t){e.$set(e.selectTable,"hour_num",t)},expression:"selectTable.hour_num"}})],1),e._v(" "),a("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"备份特性","label-width":"100px"}},[a("span",[e._v("强制全备份")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.hour_force_full,callback:function(t){e.$set(e.selectTable,"hour_force_full",t)},expression:"selectTable.hour_force_full"}}),e._v(" "),a("span",[e._v("执行一致性备份")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.hour_quiesce,callback:function(t){e.$set(e.selectTable,"hour_quiesce",t)},expression:"selectTable.hour_quiesce"}}),e._v(" "),a("span",[e._v("备份验证")]),e._v(" "),a("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.hour_ensurance,callback:function(t){e.$set(e.selectTable,"hour_ensurance",t)},expression:"selectTable.hour_ensurance"}})],1)],1):e._e(),e._v(" "),a("el-form-item",{attrs:{label:"详细地址","label-width":"100px"}},[a("el-autocomplete",{staticStyle:{width:"100%"},attrs:{"fetch-suggestions":e.querySearchAsync,placeholder:"请输入地址"},on:{select:e.addressSelect},model:{value:e.address.address,callback:function(t){e.$set(e.address,"address",t)},expression:"address.address"}}),e._v(" "),a("span",[e._v("当前城市："+e._s(e.city.name))])],1),e._v(" "),a("el-form-item",{attrs:{label:"店铺介绍","label-width":"100px"}},[a("el-input",{model:{value:e.selectTable.description,callback:function(t){e.$set(e.selectTable,"description",t)},expression:"selectTable.description"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"联系电话","label-width":"100px"}},[a("el-input",{model:{value:e.selectTable.phone,callback:function(t){e.$set(e.selectTable,"phone",t)},expression:"selectTable.phone"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"店铺分类","label-width":"100px"}},[a("el-cascader",{attrs:{options:e.categoryOptions,"change-on-select":""},model:{value:e.selectedCategory,callback:function(t){e.selectedCategory=t},expression:"selectedCategory"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"商铺图片","label-width":"100px"}},[a("el-upload",{staticClass:"avatar-uploader",attrs:{action:e.baseUrl+"/v1/addimg/shop","show-file-list":!1,"on-success":e.handleServiceAvatarScucess,"before-upload":e.beforeAvatarUpload}},[e.selectTable.image_path?a("img",{staticClass:"avatar",attrs:{src:e.baseImgPath+e.selectTable.image_path}}):a("i",{staticClass:"el-icon-plus avatar-uploader-icon"})])],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.updateShop}},[e._v("确 定")])],1)],1)],1)],1)},staticRenderFns:[]}}});