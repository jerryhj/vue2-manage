webpackJsonp([4],{191:function(t,e,n){n(468);var r=n(83)(n(370),n(488),null,null);t.exports=r.exports},198:function(t,e,n){"use strict";n.d(e,"c",function(){return r}),n.d(e,"a",function(){return a});var r="",a=void 0;r="",a="/static/",e.b={token:""}},200:function(t,e,n){"use strict";n.d(e,"K",function(){return a}),n.d(e,"I",function(){return i}),n.d(e,"J",function(){return o}),n.d(e,"L",function(){return s}),n.d(e,"H",function(){return c}),n.d(e,"b",function(){return u}),n.d(e,"a",function(){return l}),n.d(e,"c",function(){return d}),n.d(e,"d",function(){return f}),n.d(e,"E",function(){return p}),n.d(e,"F",function(){return m}),n.d(e,"G",function(){return v}),n.d(e,"B",function(){return b}),n.d(e,"C",function(){return h}),n.d(e,"D",function(){return g}),n.d(e,"w",function(){return _}),n.d(e,"y",function(){return x}),n.d(e,"t",function(){return y}),n.d(e,"u",function(){return w}),n.d(e,"A",function(){return k}),n.d(e,"v",function(){return T}),n.d(e,"f",function(){return P}),n.d(e,"l",function(){return O}),n.d(e,"q",function(){return S}),n.d(e,"j",function(){return E}),n.d(e,"k",function(){return C}),n.d(e,"s",function(){return j}),n.d(e,"n",function(){return $}),n.d(e,"m",function(){return z}),n.d(e,"p",function(){return D}),n.d(e,"o",function(){return F}),n.d(e,"z",function(){return q}),n.d(e,"r",function(){return I}),n.d(e,"i",function(){return V}),n.d(e,"e",function(){return L}),n.d(e,"g",function(){return M}),n.d(e,"x",function(){return A}),n.d(e,"h",function(){return J});var r=n(204),a=function(t){return n.i(r.a)("/admin/login",t,"POST")},i=function(t){return n.i(r.a)("/admin/signup",t,"POST")},o=function(t){return n.i(r.a)("/admin/forgetpasswd",t,"POST")},s=function(){return n.i(r.a)("/admin/gets3count")},c=function(t){return n.i(r.a)("/admin/adds3",t,"POST")},u=function(){return n.i(r.a)("/admin/refresh_token")},l=function(){return n.i(r.a)("/admin/info")},d=function(t){return n.i(r.a)("/admin/change_password",t,"POST")},f=function(t){return n.i(r.a)("/statis/jobinfo",{query_time:t},"POST")},p=function(){return n.i(r.a)("/statis/all_store_size")},m=function(){return n.i(r.a)("/statis/all_rc_size")},v=function(){return n.i(r.a)("/statis/all_remoterc_size")},b=function(t){return n.i(r.a)("/statis/store_size",{query_time:t},"POST")},h=function(t){return n.i(r.a)("/statis/rc_size",{query_time:t},"POST")},g=function(t){return n.i(r.a)("/statis/remoterc_size",{query_time:t},"POST")},_=function(t){return n.i(r.a)("/policy/assign",t,"POST")},x=function(){return n.i(r.a)("/policy/getname")},y=function(){return n.i(r.a)("/policy/count")},w=function(t){return n.i(r.a)("/policy",t)},k=function(t){return n.i(r.a)("/policy/add",t,"POST")},T=function(t){return n.i(r.a)("/policy/"+t,{},"DELETE")},P=function(){return n.i(r.a)("/vm/getname")},O=function(t){return n.i(r.a)("/vm/sess/"+t)},S=function(t){return n.i(r.a)("/vm/installkey/"+t)},E=function(){return n.i(r.a)("/vm/count")},C=function(t){return n.i(r.a)("/vm",t)},j=function(t){return n.i(r.a)("/vm/add",t,"POST")},$=function(t){return n.i(r.a)("/vm/recovery",t,"POST")},z=function(t){return n.i(r.a)("/vm/"+t,{},"DELETE")},D=function(t){return n.i(r.a)("/undepolyvm",t)},F=function(){return n.i(r.a)("/undepolyvm/count")},q=function(t){return n.i(r.a)("/undepolyvm/add",t,"POST")},I=function(t){return n.i(r.a)("/undepolyvm/"+t,{},"DELETE")},V=function(t){return n.i(r.a)("/instantvm/bindvm",t,"POST")},L=function(){return n.i(r.a)("/instantvm/count")},M=function(t){return n.i(r.a)("/instantvm",t)},A=function(t){return n.i(r.a)("/instantvm/add",t,"POST")},J=function(t){return n.i(r.a)("/instantvm/"+t,{},"DELETE")}},204:function(t,e,n){"use strict";var r=n(82),a=n.n(r),i=n(21),o=n.n(i),s=n(84),c=n.n(s),u=n(205),l=n.n(u),d=n(206),f=n.n(d),p=n(81),m=n.n(p),v=n(198),b=this;e.a=function(){var t=m()(a.a.mark(function t(){var e,n,r,i,s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",u=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},d=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET",p=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"fetch";return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(d=d.toUpperCase(),s=v.c+s,"GET"==d&&(e="",f()(u).forEach(function(t){e+=t+"="+u[t]+"&"}),""!==e&&(e=e.substr(0,e.lastIndexOf("&")),s=s+"?"+e)),!window.fetch||"fetch"!=p){t.next=21;break}return n={credentials:"include",method:d,headers:{Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer "+v.b.token},mode:"cors",cache:"no-cache"},"POST"==d&&Object.defineProperty(n,"body",{value:l()(u)}),t.prev=6,t.next=9,fetch(s,n);case 9:return r=t.sent,t.next=12,r.json();case 12:return i=t.sent,t.abrupt("return",i);case 16:throw t.prev=16,t.t0=t.catch(6),new Error(t.t0);case 19:t.next=22;break;case 21:return t.abrupt("return",new c.a(function(t,e){var n=void 0;n=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject;var r="";"POST"==d&&(r=l()(u)),n.open(d,s,!0),n.setRequestHeader("Content-type","application/x-www-form-urlencoded"),n.send(r),n.onreadystatechange=function(){if(4==n.readyState)if(200==n.status){var r=n.response;"object"!==(void 0===r?"undefined":o()(r))&&(r=JSON.parse(r)),t(r)}else e(n)}}));case 22:case"end":return t.stop()}},t,b,[[6,16]])}));return function(){return t.apply(this,arguments)}}()},205:function(t,e,n){t.exports={default:n(207),__esModule:!0}},206:function(t,e,n){t.exports={default:n(208),__esModule:!0}},207:function(t,e,n){var r=n(5),a=r.JSON||(r.JSON={stringify:JSON.stringify});t.exports=function(t){return a.stringify.apply(a,arguments)}},208:function(t,e,n){n(210),t.exports=n(5).Object.keys},209:function(t,e,n){var r=n(13),a=n(5),i=n(17);t.exports=function(t,e){var n=(a.Object||{})[t]||Object[t],o={};o[t]=e(n),r(r.S+r.F*i(function(){n(1)}),"Object",o)}},210:function(t,e,n){var r=n(30),a=n(22);n(209)("keys",function(){return function(t){return a(r(t))}})},216:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(82),a=n.n(r),i=n(81),o=n.n(i),s=n(49),c=n.n(s),u=(n(200),n(198)),l=n(85);e.default={data:function(){return{baseImgPath:u.a}},created:function(){this.adminInfo.id||this.getAdminData()},computed:c()({},n.i(l.b)(["adminInfo"])),methods:c()({},n.i(l.c)(["getAdminData"]),{handleCommand:function(t){var e=this;return o()(a.a.mark(function n(){return a.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:"home"==t?e.$router.push("/manage"):"signout"==t&&(e.$message({type:"success",message:"退出成功"}),e.$router.push("/"),u.b.token="");case 1:case"end":return n.stop()}},n,e)}))()}})}},217:function(t,e,n){e=t.exports=n(178)(!1),e.push([t.i,".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}.header_container{background-color:#eff2f7;height:60px;display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:center;align-items:center;padding-left:20px}.avator{width:36px;height:36px;border-radius:50%;margin-right:37px}.el-dropdown-menu__item{text-align:center}",""])},219:function(t,e,n){var r=n(217);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);n(179)("019239ba",r,!0)},220:function(t,e,n){n(219);var r=n(83)(n(216),n(221),null,null);t.exports=r.exports},221:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"header_container"},[n("el-breadcrumb",{attrs:{separator:"/"}},[n("el-breadcrumb-item",{attrs:{to:{path:"/manage"}}},[t._v("首页")]),t._v(" "),t._l(t.$route.meta,function(e,r){return n("el-breadcrumb-item",{key:r},[t._v(t._s(e))])})],2),t._v(" "),n("el-dropdown",{attrs:{"menu-align":"start"},on:{command:t.handleCommand}},[n("img",{staticClass:"avator",attrs:{src:t.baseImgPath+t.adminInfo.avatar}}),t._v(" "),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[n("el-dropdown-item",{attrs:{command:"home"}},[t._v("首页")]),t._v(" "),n("el-dropdown-item",{attrs:{command:"signout"}},[t._v("退出")])],1)],1)],1)},staticRenderFns:[]}},370:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(82),a=n.n(r),i=n(81),o=n.n(i),s=n(220),c=n.n(s),u=n(198),l=n(200);e.default={data:function(){return{baseUrl:u.c,baseImgPath:u.a,city:{},offset:0,limit:20,count:0,tableData:[],priv:[{value:9,label:"低"},{value:5,label:"中"},{value:1,label:"高"}],vmnamelist:[{}],currentPage:1,selectTable:{},dialogFormVisible:!1,categoryOptions:[],selectedCategory:[]}},created:function(){},activated:function(){this.initData()},components:{headTop:c.a},methods:{initData:function(){var t=this;return o()(a.a.mark(function e(){var r,i,o,s;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,n.i(l.t)();case 3:if(r=e.sent,1!=r.status){e.next=8;break}t.count=r.count,e.next=9;break;case 8:throw new Error("获取数据失败");case 9:return t.getPolicies(),e.next=12,n.i(l.b)();case 12:i=e.sent,i.token&&(u.b.token=i.token),e.next=23;break;case 16:e.prev=16,e.t0=e.catch(0),o="会话过期，请重新登录",t.$router.push("/"),u.b.token="",t.$message({type:"error",message:o}),console.log("获取数据失败",e.t0);case 23:return e.prev=23,e.next=26,n.i(l.f)();case 26:s=e.sent,1==s.status?(s.category_list.map(function(t,e){t.value=t.vmname,t.label=t.vmname}),t.selectTable.vmnamelist=s.category_list,t.vmnamelist=s.category_list):console.log(s),e.next=33;break;case 30:e.prev=30,e.t1=e.catch(23),console.log(e.t1);case 33:case"end":return e.stop()}},e,t,[[0,16],[23,30]])}))()},getPolicies:function(){var t=this;return o()(a.a.mark(function e(){var r;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.i(l.u)({offset:t.offset,limit:t.limit});case 2:r=e.sent,t.tableData=[],r.forEach(function(e){var n={};n.name=e.name,n.id=e.id,n.is_cdp=-1==e.cdp_retain_time?"N":"Y",n.is_crypt=0==e.is_crypt?"N":"Y",n.year=e.year,n.month=e.month,n.week=e.week,n.day=e.day,n.hour=e.hour,n.image_path=e.image_path,t.tableData.push(n)});case 5:case"end":return e.stop()}},e,t)}))()},handleSizeChange:function(t){console.log("每页 "+t+" 条")},handleCurrentChange:function(t){this.currentPage=t,this.offset=(t-1)*this.limit,this.getPolicies()},handleEdit:function(t,e){this.selectTable=e,this.selectTable.priv=5,this.dialogFormVisible=!0},handleDelete:function(t,e){var r=this;return o()(a.a.mark(function i(){var o;return a.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,n.i(l.v)(e.id);case 3:if(o=a.sent,1!=o.status){a.next=9;break}r.$message({type:"success",message:"删除备份策略成功"}),r.tableData.splice(t,1),a.next=10;break;case 9:throw new Error(o.message);case 10:a.next=16;break;case 12:a.prev=12,a.t0=a.catch(0),r.$message({type:"error",message:a.t0.message}),console.log("删除备份策略失败");case 16:case"end":return a.stop()}},i,r,[[0,12]])}))()},assignPolicy:function(){var t=this;return o()(a.a.mark(function e(){var r;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.dialogFormVisible=!1,e.prev=1,e.next=4,n.i(l.w)(t.selectTable);case 4:r=e.sent,1==r.status?(t.$message({type:"success",message:"分配备份策略成功"}),t.getPolicies()):t.$message({type:"error",message:r.message}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1),console.log("分配备份策略失败",e.t0);case 11:case"end":return e.stop()}},e,t,[[1,8]])}))()}}}},380:function(t,e,n){e=t.exports=n(178)(!1),e.push([t.i,".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}.demo-table-expand{font-size:0}.demo-table-expand label{width:90px;color:#99a9bf}.demo-table-expand .el-form-item{margin-right:0;margin-bottom:0;width:50%}.table_container{padding:20px}.Pagination{display:-ms-flexbox;display:flex;-ms-flex-pack:start;justify-content:flex-start;margin-top:8px}.avatar-uploader .el-upload{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden}.avatar-uploader .el-upload:hover{border-color:#20a0ff}.avatar-uploader-icon{font-size:28px;color:#8c939d;width:120px;height:120px;line-height:120px;text-align:center}.avatar{width:120px;height:120px;display:block}",""])},468:function(t,e,n){var r=n(380);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);n(179)("26ec8680",r,!0)},488:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"fillcontain"},[n("head-top"),t._v(" "),n("div",{staticClass:"table_container"},[n("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData}},[n("el-table-column",{attrs:{type:"expand"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-form",{staticClass:"demo-table-expand",attrs:{"label-position":"left",inline:""}},[n("el-form-item",{attrs:{label:"年备份"}},[n("span",[t._v(t._s(e.row.year))])]),t._v(" "),n("el-form-item",{attrs:{label:"月备份"}},[n("span",[t._v(t._s(e.row.month))])]),t._v(" "),n("el-form-item",{attrs:{label:"周备份"}},[n("span",[t._v(t._s(e.row.week))])]),t._v(" "),n("el-form-item",{attrs:{label:"日备份"}},[n("span",[t._v(t._s(e.row.day))])]),t._v(" "),n("el-form-item",{attrs:{label:"粒度备份"}},[n("span",[t._v(t._s(e.row.hour))])])],1)]}}])}),t._v(" "),n("el-table-column",{attrs:{label:"策略名称",prop:"name"}}),t._v(" "),n("el-table-column",{attrs:{label:"是否加密",prop:"is_crypt"}}),t._v(" "),n("el-table-column",{attrs:{label:"使用持续数据保护特性",prop:"is_cdp"}}),t._v(" "),n("el-table-column",{attrs:{label:"操作",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{size:"mini"},on:{click:function(n){return t.handleEdit(e.$index,e.row)}}},[t._v("绑定")]),t._v(" "),n("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(n){return t.handleDelete(e.$index,e.row)}}},[t._v("删除")])]}}])})],1),t._v(" "),n("div",{staticClass:"Pagination"},[n("el-pagination",{attrs:{"current-page":t.currentPage,"page-size":20,layout:"total, prev, pager, next",total:t.count},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1),t._v(" "),n("el-dialog",{attrs:{title:"修改备份策略"},model:{value:t.dialogFormVisible,callback:function(e){t.dialogFormVisible=e},expression:"dialogFormVisible"}},[n("el-form",{attrs:{model:t.selectTable}},[n("el-form-item",{attrs:{label:"策略名称","label-width":"100px"}},[n("el-input",{attrs:{"auto-complete":"off",disabled:""},model:{value:t.selectTable.name,callback:function(e){t.$set(t.selectTable,"name",e)},expression:"selectTable.name"}})],1),t._v(" "),n("el-form-item",{attrs:{label:"绑定的VM","label-width":"100px",prop:"vmnamelist"}},[n("el-select",{attrs:{placeholder:"请选择"},model:{value:t.selectTable.vmname,callback:function(e){t.$set(t.selectTable,"vmname",e)},expression:"selectTable.vmname"}},t._l(t.vmnamelist,function(t){return n("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}),1)],1),t._v(" "),n("el-form-item",{attrs:{label:"备份优先级","label-width":"100px",prop:"priv"}},[n("el-select",{attrs:{placeholder:"请选择"},model:{value:t.selectTable.priv,callback:function(e){t.$set(t.selectTable,"priv",e)},expression:"selectTable.priv"}},t._l(t.priv,function(t){return n("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}),1)],1)],1),t._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:function(e){t.dialogFormVisible=!1}}},[t._v("取 消")]),t._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:t.assignPolicy}},[t._v("确 定")])],1)],1)],1)],1)},staticRenderFns:[]}}});