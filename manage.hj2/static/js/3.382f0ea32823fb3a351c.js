webpackJsonp([3],{192:function(e,t,n){n(473);var a=n(83)(n(370),n(492),null,null);e.exports=a.exports},197:function(e,t,n){"use strict";n.d(t,"c",function(){return a}),n.d(t,"a",function(){return r});var a="",r=void 0;a="",r="/static/",t.b={token:""}},199:function(e,t,n){"use strict";n.d(t,"J",function(){return r}),n.d(t,"H",function(){return i}),n.d(t,"I",function(){return o}),n.d(t,"b",function(){return s}),n.d(t,"a",function(){return l}),n.d(t,"c",function(){return c}),n.d(t,"d",function(){return u}),n.d(t,"E",function(){return d}),n.d(t,"F",function(){return f}),n.d(t,"G",function(){return p}),n.d(t,"B",function(){return m}),n.d(t,"C",function(){return b}),n.d(t,"D",function(){return v}),n.d(t,"w",function(){return h}),n.d(t,"y",function(){return x}),n.d(t,"t",function(){return g}),n.d(t,"u",function(){return _}),n.d(t,"A",function(){return y}),n.d(t,"v",function(){return w}),n.d(t,"f",function(){return k}),n.d(t,"l",function(){return T}),n.d(t,"q",function(){return S}),n.d(t,"j",function(){return O}),n.d(t,"k",function(){return P}),n.d(t,"s",function(){return $}),n.d(t,"n",function(){return E}),n.d(t,"m",function(){return C}),n.d(t,"p",function(){return D}),n.d(t,"o",function(){return j}),n.d(t,"z",function(){return z}),n.d(t,"r",function(){return I}),n.d(t,"i",function(){return V}),n.d(t,"e",function(){return M}),n.d(t,"g",function(){return q}),n.d(t,"x",function(){return F}),n.d(t,"h",function(){return R});var a=n(204),r=function(e){return n.i(a.a)("/admin/login",e,"POST")},i=function(e){return n.i(a.a)("/admin/signup",e,"POST")},o=function(e){return n.i(a.a)("/admin/forgetpasswd",e,"POST")},s=function(){return n.i(a.a)("/admin/refresh_token")},l=function(){return n.i(a.a)("/admin/info")},c=function(e){return n.i(a.a)("/admin/change_password",e,"POST")},u=function(e){return n.i(a.a)("/statis/jobinfo",{query_time:e},"POST")},d=function(){return n.i(a.a)("/statis/all_store_size")},f=function(){return n.i(a.a)("/statis/all_rc_size")},p=function(){return n.i(a.a)("/statis/all_remoterc_size")},m=function(e){return n.i(a.a)("/statis/store_size",{query_time:e},"POST")},b=function(e){return n.i(a.a)("/statis/rc_size",{query_time:e},"POST")},v=function(e){return n.i(a.a)("/statis/remoterc_size",{query_time:e},"POST")},h=function(e){return n.i(a.a)("/policy/assign",e,"POST")},x=function(){return n.i(a.a)("/policy/getname")},g=function(){return n.i(a.a)("/policy/count")},_=function(e){return n.i(a.a)("/policy",e)},y=function(e){return n.i(a.a)("/policy/add",e,"POST")},w=function(e){return n.i(a.a)("/policy/"+e,{},"DELETE")},k=function(){return n.i(a.a)("/vm/getname")},T=function(e){return n.i(a.a)("/vm/sess/"+e)},S=function(e){return n.i(a.a)("/vm/installkey/"+e)},O=function(){return n.i(a.a)("/vm/count")},P=function(e){return n.i(a.a)("/vm",e)},$=function(e){return n.i(a.a)("/vm/add",e,"POST")},E=function(e){return n.i(a.a)("/vm/recovery",e,"POST")},C=function(e){return n.i(a.a)("/vm/"+e,{},"DELETE")},D=function(e){return n.i(a.a)("/undepolyvm",e)},j=function(){return n.i(a.a)("/undepolyvm/count")},z=function(e){return n.i(a.a)("/undepolyvm/add",e,"POST")},I=function(e){return n.i(a.a)("/undepolyvm/"+e,{},"DELETE")},V=function(e){return n.i(a.a)("/instantvm/bindvm",e,"POST")},M=function(){return n.i(a.a)("/instantvm/count")},q=function(e){return n.i(a.a)("/instantvm",e)},F=function(e){return n.i(a.a)("/instantvm/add",e,"POST")},R=function(e){return n.i(a.a)("/instantvm/"+e,{},"DELETE")}},204:function(e,t,n){"use strict";var a=n(82),r=n.n(a),i=n(21),o=n.n(i),s=n(84),l=n.n(s),c=n(205),u=n.n(c),d=n(206),f=n.n(d),p=n(81),m=n.n(p),b=n(197),v=this;t.a=function(){var e=m()(r.a.mark(function e(){var t,n,a,i,s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},d=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET",p=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"fetch";return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(d=d.toUpperCase(),s=b.c+s,"GET"==d&&(t="",f()(c).forEach(function(e){t+=e+"="+c[e]+"&"}),""!==t&&(t=t.substr(0,t.lastIndexOf("&")),s=s+"?"+t)),!window.fetch||"fetch"!=p){e.next=21;break}return n={credentials:"include",method:d,headers:{Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer "+b.b.token},mode:"cors",cache:"no-cache"},"POST"==d&&Object.defineProperty(n,"body",{value:u()(c)}),e.prev=6,e.next=9,fetch(s,n);case 9:return a=e.sent,e.next=12,a.json();case 12:return i=e.sent,e.abrupt("return",i);case 16:throw e.prev=16,e.t0=e.catch(6),new Error(e.t0);case 19:e.next=22;break;case 21:return e.abrupt("return",new l.a(function(e,t){var n=void 0;n=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject;var a="";"POST"==d&&(a=u()(c)),n.open(d,s,!0),n.setRequestHeader("Content-type","application/x-www-form-urlencoded"),n.send(a),n.onreadystatechange=function(){if(4==n.readyState)if(200==n.status){var a=n.response;"object"!==(void 0===a?"undefined":o()(a))&&(a=JSON.parse(a)),e(a)}else t(n)}}));case 22:case"end":return e.stop()}},e,v,[[6,16]])}));return function(){return e.apply(this,arguments)}}()},205:function(e,t,n){e.exports={default:n(207),__esModule:!0}},206:function(e,t,n){e.exports={default:n(208),__esModule:!0}},207:function(e,t,n){var a=n(5),r=a.JSON||(a.JSON={stringify:JSON.stringify});e.exports=function(e){return r.stringify.apply(r,arguments)}},208:function(e,t,n){n(210),e.exports=n(5).Object.keys},209:function(e,t,n){var a=n(13),r=n(5),i=n(17);e.exports=function(e,t){var n=(r.Object||{})[e]||Object[e],o={};o[e]=t(n),a(a.S+a.F*i(function(){n(1)}),"Object",o)}},210:function(e,t,n){var a=n(30),r=n(22);n(209)("keys",function(){return function(e){return r(a(e))}})},215:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(82),r=n.n(a),i=n(81),o=n.n(i),s=n(49),l=n.n(s),c=(n(199),n(197)),u=n(85);t.default={data:function(){return{baseImgPath:c.a}},created:function(){this.adminInfo.id||this.getAdminData()},computed:l()({},n.i(u.b)(["adminInfo"])),methods:l()({},n.i(u.c)(["getAdminData"]),{handleCommand:function(e){var t=this;return o()(r.a.mark(function n(){return r.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:"home"==e?t.$router.push("/manage"):"signout"==e&&(t.$message({type:"success",message:"退出成功"}),t.$router.push("/"),c.b.token="");case 1:case"end":return n.stop()}},n,t)}))()}})}},216:function(e,t,n){t=e.exports=n(178)(!1),t.push([e.i,".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}.header_container{background-color:#eff2f7;height:60px;display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:center;align-items:center;padding-left:20px}.avator{width:36px;height:36px;border-radius:50%;margin-right:37px}.el-dropdown-menu__item{text-align:center}",""])},218:function(e,t,n){var a=n(216);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);n(179)("019239ba",a,!0)},219:function(e,t,n){n(218);var a=n(83)(n(215),n(220),null,null);e.exports=a.exports},220:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"header_container"},[n("el-breadcrumb",{attrs:{separator:"/"}},[n("el-breadcrumb-item",{attrs:{to:{path:"/manage"}}},[e._v("首页")]),e._v(" "),e._l(e.$route.meta,function(t,a){return n("el-breadcrumb-item",{key:a},[e._v(e._s(t))])})],2),e._v(" "),n("el-dropdown",{attrs:{"menu-align":"start"},on:{command:e.handleCommand}},[n("img",{staticClass:"avator",attrs:{src:e.baseImgPath+e.adminInfo.avatar}}),e._v(" "),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[n("el-dropdown-item",{attrs:{command:"home"}},[e._v("首页")]),e._v(" "),n("el-dropdown-item",{attrs:{command:"signout"}},[e._v("退出")])],1)],1)],1)},staticRenderFns:[]}},370:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(49),r=n.n(a),i=n(82),o=n.n(i),s=n(81),l=n.n(s),c=n(219),u=n.n(c),d=n(197),f=n(199);t.default={data:function(){return{baseUrl:d.c,baseImgPath:d.a,restaurant_id:null,city:{},offset:0,limit:20,count:0,tableData:[],privlist:{9:"低",5:"中",1:"高"},arealist:{0:"未知",1048833:"阿里云北京",1049089:"阿里云上海",1049345:"阿里云深圳",1049601:"阿里云杭州",1049857:"阿里云青岛",1050113:"阿里云张家口",1050369:"阿里云呼和浩特",1050625:"阿里云成都",2097409:"腾讯云北京",2097665:"腾讯云上海",2097921:"腾讯云广州",2098177:"腾讯云南京",2098433:"腾讯云成都",2098689:"腾讯云重庆",3145985:"华为云北京",3146241:"华为云上海",3146497:"华为云广州",3146753:"华为云贵阳",4194561:"百度云北京",4194817:"百度云苏州",4195073:"百度云广州",4195329:"百度云保定"},s3arealist:{0:"未知",1048833:"阿里云北京",1049089:"阿里云上海",1049345:"阿里云深圳",1049601:"阿里云杭州",1049857:"阿里云青岛",1050113:"阿里云张家口",1050369:"阿里云呼和浩特",2097409:"腾讯云北京",2097665:"腾讯云上海",2097921:"腾讯云广州",2098177:"腾讯云南京",2098433:"腾讯云成都",2098689:"腾讯云重庆"},_priv:[{value:9,label:"低"},{value:5,label:"中"},{value:1,label:"高"}],currentPage:1,selectTable:{is_local:!1},is_local:!1,dialogFormVisible:!1,menuOptions:[],selectMenu:{},selectIndex:null,foodrules:{ipaddr:[{required:!0,message:"请输入虚拟机IP地址",trigger:"blur"}],username:[{required:!0,message:"请输入用户名",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}]},specsFormVisible:!1,expendRow:[]}},created:function(){},activated:function(){this.restaurant_id=this.$route.query.restaurant_id,this.initData()},computed:{},components:{headTop:u.a},methods:{initData:function(){var e=this;return l()(o.a.mark(function t(){var a,r,i;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,n.i(f.o)();case 3:if(a=t.sent,1!=a.status){t.next=8;break}e.count=a.count,t.next=9;break;case 8:throw new Error("获取数据失败");case 9:return e.getUndepolyVMs(),t.next=12,n.i(f.b)();case 12:r=t.sent,r.token&&(d.b.token=r.token),t.next=23;break;case 16:t.prev=16,t.t0=t.catch(0),i="会话过期，请重新登录",e.$router.push("/"),d.b.token="",e.$message({type:"error",message:i}),console.log("获取数据失败",t.t0);case 23:case"end":return t.stop()}},t,e,[[0,16]])}))()},getUndepolyVMs:function(){var e=this;return l()(o.a.mark(function t(){var a;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.i(f.p)({offset:e.offset,limit:e.limit});case 2:a=t.sent,e.tableData=[],a.forEach(function(t,n){var a={};a.vmname=t.vmname,a.item_id=t.id,a.policy_name=t.policy_name,a.policy=t.policy_name,a.priority=t.priority,a._priv=e.privlist[t.priority],a._area=e.arealist[t.area],a._s3area=e.s3arealist[t.s3area],a.trigger_time=t.trigger_time,a.image_path=t.image_path,a.specfoods=t.specfoods,a.index=n,e.tableData.push(a)});case 5:case"end":return t.stop()}},t,e)}))()},tableRowClassName:function(e,t){return 1===t?"info-row":3===t?"positive-row":""},handleSizeChange:function(e){console.log("每页 "+e+" 条")},handleCurrentChange:function(e){this.currentPage=e,this.offset=(e-1)*this.limit,this.getUndepolyVMs()},expand:function(e,t){if(t)this.getSelectItemData(e);else{var n=this.expendRow.indexOf(e.index);this.expendRow.splice(n,1)}},handleEdit:function(e){var t=this;return l()(o.a.mark(function a(){var r,i;return o.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return t.getSelectItemData(e,"edit"),t.dialogFormVisible=!0,a.prev=2,a.next=5,n.i(f.q)(e.item_id);case 5:r=a.sent,1==r.status?(t.selectTable.installkey=r.message,t.installkey=r.message):console.log(r),a.next=15;break;case 9:a.prev=9,a.t0=a.catch(2),i="会话过期，请重新登录",t.$router.push("/"),d.b.token="",console.log(a.t0);case 15:case"end":return a.stop()}},a,t,[[2,9]])}))()},getSelectItemData:function(e,t){var n=this;return l()(o.a.mark(function t(){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:n.selectTable=r()({},e),n.tableData.splice(e.index,1,r()({},n.selectTable)),n.$nextTick(function(){n.expendRow.push(e.index)});case 3:case"end":return t.stop()}},t,n)}))()},handleSelect:function(e){this.selectIndex=e,this.selectMenu=this.menuOptions[e]},handleDelete:function(e,t){var a=this;return l()(o.a.mark(function r(){var i;return o.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,n.i(f.r)(t.item_id);case 3:if(i=r.sent,1!=i.status){r.next=9;break}a.$message({type:"success",message:"删除待部署虚拟机成功"}),a.tableData.splice(e,1),r.next=10;break;case 9:throw new Error(i.message);case 10:r.next=16;break;case 12:r.prev=12,r.t0=r.catch(0),a.$message({type:"error",message:r.t0.message}),console.log("删除待部署虚拟机失败");case 16:case"end":return r.stop()}},r,a,[[0,12]])}))()},addVM:function(e){var t=this;return l()(o.a.mark(function a(){return o.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:t.$refs[e].validate(function(){var e=l()(o.a.mark(function e(a){var i,s,l;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!a){e.next=16;break}return t.dialogFormVisible=!1,i=r()({},t.selectTable),e.prev=3,s=r()({},t.selectTable),e.next=7,n.i(f.s)(s);case 7:l=e.sent,1==l.status?t.$message({type:"success",message:"开始部署"}):t.$message({type:"error",message:l.message}),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(3),console.log("部署VM失败",e.t0);case 14:e.next=18;break;case 16:return t.$notify.error({title:"错误",message:"请检查输入是否正确",offset:100}),e.abrupt("return",!1);case 18:case"end":return e.stop()}},e,t,[[3,11]])}));return function(t){return e.apply(this,arguments)}}());case 1:case"end":return a.stop()}},a,t)}))()}}}},386:function(e,t,n){t=e.exports=n(178)(!1),t.push([e.i,".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}.demo-table-expand{font-size:0}.demo-table-expand label{width:90px;color:#99a9bf}.demo-table-expand .el-form-item{margin-right:0;margin-bottom:0;width:50%}.table_container{padding:20px}.Pagination{display:-ms-flexbox;display:flex;-ms-flex-pack:start;justify-content:flex-start;margin-top:8px}.avatar-uploader .el-upload{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden}.avatar-uploader .el-upload:hover{border-color:#20a0ff}.avatar-uploader-icon{font-size:28px;color:#8c939d;width:120px;height:120px;line-height:120px;text-align:center}.avatar{width:120px;height:120px;display:block}",""])},473:function(e,t,n){var a=n(386);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);n(179)("11fe7238",a,!0)},492:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"fillcontain"},[n("head-top"),e._v(" "),n("div",{staticClass:"table_container"},[n("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,"expand-row-keys":e.expendRow,"row-key":function(e){return e.index}},on:{expand:e.expand}},[n("el-table-column",{attrs:{type:"expand"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-form",{staticClass:"demo-table-expand",attrs:{"label-position":"left",inline:""}},[n("el-form-item",{attrs:{label:"所在区域"}},[n("span",[e._v(e._s(t.row._area))])]),e._v(" "),n("el-form-item",{attrs:{label:"备份至"}},[n("span",[e._v(e._s(t.row._s3area))])]),e._v(" "),n("el-form-item",{attrs:{label:"首次备份时间"}},[n("span",[e._v(e._s(t.row.trigger_time))])])],1)]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"被保护虚拟机名称",prop:"vmname"}}),e._v(" "),n("el-table-column",{attrs:{label:"当前策略",prop:"policy_name"}}),e._v(" "),n("el-table-column",{attrs:{label:"备份优先级",prop:"_priv"}}),e._v(" "),n("el-table-column",{attrs:{label:"操作",width:"160"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-button",{attrs:{size:"small"},on:{click:function(n){return e.handleEdit(t.row)}}},[e._v("部署")]),e._v(" "),n("el-button",{attrs:{size:"small",type:"danger"},on:{click:function(n){return e.handleDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],1),e._v(" "),n("div",{staticClass:"Pagination"},[n("el-pagination",{attrs:{"current-page":e.currentPage,"page-size":20,layout:"total, prev, pager, next",total:e.count},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1),e._v(" "),n("el-dialog",{attrs:{title:"部署被保护虚拟机"},model:{value:e.dialogFormVisible,callback:function(t){e.dialogFormVisible=t},expression:"dialogFormVisible"}},[n("el-form",{ref:"selectTable",attrs:{model:e.selectTable,rules:e.foodrules}},[n("el-form-item",{attrs:{label:"待部署的VM","label-width":"100px"}},[n("el-input",{attrs:{"auto-complete":"off",disabled:""},model:{value:e.selectTable.vmname,callback:function(t){e.$set(e.selectTable,"vmname",t)},expression:"selectTable.vmname"}})],1),e._v(" "),n("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"获取本地部署Key"}},[n("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.is_local,callback:function(t){e.$set(e.selectTable,"is_local",t)},expression:"selectTable.is_local"}})],1),e._v(" "),1==e.selectTable.is_local?n("el-row",[n("el-form-item",{attrs:{label:"本地部署Key","label-width":"100px"}},[n("el-input",{attrs:{"auto-complete":"off",readonly:""},model:{value:e.selectTable.installkey,callback:function(t){e.$set(e.selectTable,"installkey",t)},expression:"selectTable.installkey"}})],1)],1):e._e(),e._v(" "),n("el-form-item",{attrs:{label:"IP地址","label-width":"100px",prop:"ipaddr"}},[n("el-input",{model:{value:e.selectTable.ipaddr,callback:function(t){e.$set(e.selectTable,"ipaddr",t)},expression:"selectTable.ipaddr"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"用户名","label-width":"100px",prop:"username"}},[n("el-input",{model:{value:e.selectTable.username,callback:function(t){e.$set(e.selectTable,"username",t)},expression:"selectTable.username"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"密码","label-width":"100px",prop:"password"}},[n("el-input",{attrs:{type:"password"},model:{value:e.selectTable.password,callback:function(t){e.$set(e.selectTable,"password",t)},expression:"selectTable.password"}})],1),e._v(" "),n("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"设置云访问权限"}},[n("el-switch",{attrs:{"on-text":"","off-text":""},model:{value:e.selectTable.is_cloud,callback:function(t){e.$set(e.selectTable,"is_cloud",t)},expression:"selectTable.is_cloud"}})],1),e._v(" "),1==e.selectTable.is_cloud?n("el-row",[n("el-form-item",{attrs:{label:"AccessKey","label-width":"100px",prop:"accesskey"}},[n("el-input",{model:{value:e.selectTable.accesskey,callback:function(t){e.$set(e.selectTable,"accesskey",t)},expression:"selectTable.accesskey"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"SecretKey","label-width":"100px",prop:"secretkey"}},[n("el-input",{model:{value:e.selectTable.secretkey,callback:function(t){e.$set(e.selectTable,"secretkey",t)},expression:"selectTable.secretkey"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"VPC ID","label-width":"100px",prop:"vpcid"}},[n("el-input",{model:{value:e.selectTable.vpcid,callback:function(t){e.$set(e.selectTable,"vpcid",t)},expression:"selectTable.vpcid"}})],1)],1):e._e()],1),e._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v("取 消")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.addVM("selectTable")}}},[e._v("确 定")])],1)],1)],1)],1)},staticRenderFns:[]}}});