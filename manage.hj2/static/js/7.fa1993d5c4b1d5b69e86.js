webpackJsonp([7],{183:function(t,e,r){r(477);var n=r(83)(r(361),r(496),null,null);t.exports=n.exports},197:function(t,e,r){"use strict";r.d(e,"c",function(){return n}),r.d(e,"a",function(){return o});var n="",o=void 0;n="",o="/static/",e.b={token:""}},199:function(t,e,r){"use strict";r.d(e,"J",function(){return o}),r.d(e,"H",function(){return a}),r.d(e,"I",function(){return i}),r.d(e,"b",function(){return s}),r.d(e,"a",function(){return u}),r.d(e,"c",function(){return c}),r.d(e,"d",function(){return d}),r.d(e,"E",function(){return f}),r.d(e,"F",function(){return l}),r.d(e,"G",function(){return p}),r.d(e,"B",function(){return m}),r.d(e,"C",function(){return b}),r.d(e,"D",function(){return v}),r.d(e,"w",function(){return h}),r.d(e,"y",function(){return g}),r.d(e,"t",function(){return x}),r.d(e,"u",function(){return _}),r.d(e,"A",function(){return w}),r.d(e,"v",function(){return y}),r.d(e,"f",function(){return k}),r.d(e,"l",function(){return F}),r.d(e,"q",function(){return O}),r.d(e,"j",function(){return P}),r.d(e,"k",function(){return S}),r.d(e,"s",function(){return T}),r.d(e,"n",function(){return $}),r.d(e,"m",function(){return E}),r.d(e,"p",function(){return j}),r.d(e,"o",function(){return C}),r.d(e,"z",function(){return q}),r.d(e,"r",function(){return z}),r.d(e,"i",function(){return A}),r.d(e,"e",function(){return D}),r.d(e,"g",function(){return I}),r.d(e,"x",function(){return J}),r.d(e,"h",function(){return L});var n=r(204),o=function(t){return r.i(n.a)("/admin/login",t,"POST")},a=function(t){return r.i(n.a)("/admin/signup",t,"POST")},i=function(t){return r.i(n.a)("/admin/forgetpasswd",t,"POST")},s=function(){return r.i(n.a)("/admin/refresh_token")},u=function(){return r.i(n.a)("/admin/info")},c=function(t){return r.i(n.a)("/admin/change_password",t,"POST")},d=function(t){return r.i(n.a)("/statis/jobinfo",{query_time:t},"POST")},f=function(){return r.i(n.a)("/statis/all_store_size")},l=function(){return r.i(n.a)("/statis/all_rc_size")},p=function(){return r.i(n.a)("/statis/all_remoterc_size")},m=function(t){return r.i(n.a)("/statis/store_size",{query_time:t},"POST")},b=function(t){return r.i(n.a)("/statis/rc_size",{query_time:t},"POST")},v=function(t){return r.i(n.a)("/statis/remoterc_size",{query_time:t},"POST")},h=function(t){return r.i(n.a)("/policy/assign",t,"POST")},g=function(){return r.i(n.a)("/policy/getname")},x=function(){return r.i(n.a)("/policy/count")},_=function(t){return r.i(n.a)("/policy",t)},w=function(t){return r.i(n.a)("/policy/add",t,"POST")},y=function(t){return r.i(n.a)("/policy/"+t,{},"DELETE")},k=function(){return r.i(n.a)("/vm/getname")},F=function(t){return r.i(n.a)("/vm/sess/"+t)},O=function(t){return r.i(n.a)("/vm/installkey/"+t)},P=function(){return r.i(n.a)("/vm/count")},S=function(t){return r.i(n.a)("/vm",t)},T=function(t){return r.i(n.a)("/vm/add",t,"POST")},$=function(t){return r.i(n.a)("/vm/recovery",t,"POST")},E=function(t){return r.i(n.a)("/vm/"+t,{},"DELETE")},j=function(t){return r.i(n.a)("/undepolyvm",t)},C=function(){return r.i(n.a)("/undepolyvm/count")},q=function(t){return r.i(n.a)("/undepolyvm/add",t,"POST")},z=function(t){return r.i(n.a)("/undepolyvm/"+t,{},"DELETE")},A=function(t){return r.i(n.a)("/instantvm/bindvm",t,"POST")},D=function(){return r.i(n.a)("/instantvm/count")},I=function(t){return r.i(n.a)("/instantvm",t)},J=function(t){return r.i(n.a)("/instantvm/add",t,"POST")},L=function(t){return r.i(n.a)("/instantvm/"+t,{},"DELETE")}},204:function(t,e,r){"use strict";var n=r(82),o=r.n(n),a=r(21),i=r.n(a),s=r(84),u=r.n(s),c=r(205),d=r.n(c),f=r(206),l=r.n(f),p=r(81),m=r.n(p),b=r(197),v=this;e.a=function(){var t=m()(o.a.mark(function t(){var e,r,n,a,s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},f=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET",p=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"fetch";return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(f=f.toUpperCase(),s=b.c+s,"GET"==f&&(e="",l()(c).forEach(function(t){e+=t+"="+c[t]+"&"}),""!==e&&(e=e.substr(0,e.lastIndexOf("&")),s=s+"?"+e)),!window.fetch||"fetch"!=p){t.next=21;break}return r={credentials:"include",method:f,headers:{Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer "+b.b.token},mode:"cors",cache:"no-cache"},"POST"==f&&Object.defineProperty(r,"body",{value:d()(c)}),t.prev=6,t.next=9,fetch(s,r);case 9:return n=t.sent,t.next=12,n.json();case 12:return a=t.sent,t.abrupt("return",a);case 16:throw t.prev=16,t.t0=t.catch(6),new Error(t.t0);case 19:t.next=22;break;case 21:return t.abrupt("return",new u.a(function(t,e){var r=void 0;r=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject;var n="";"POST"==f&&(n=d()(c)),r.open(f,s,!0),r.setRequestHeader("Content-type","application/x-www-form-urlencoded"),r.send(n),r.onreadystatechange=function(){if(4==r.readyState)if(200==r.status){var n=r.response;"object"!==(void 0===n?"undefined":i()(n))&&(n=JSON.parse(n)),t(n)}else e(r)}}));case 22:case"end":return t.stop()}},t,v,[[6,16]])}));return function(){return t.apply(this,arguments)}}()},205:function(t,e,r){t.exports={default:r(207),__esModule:!0}},206:function(t,e,r){t.exports={default:r(208),__esModule:!0}},207:function(t,e,r){var n=r(5),o=n.JSON||(n.JSON={stringify:JSON.stringify});t.exports=function(t){return o.stringify.apply(o,arguments)}},208:function(t,e,r){r(210),t.exports=r(5).Object.keys},209:function(t,e,r){var n=r(13),o=r(5),a=r(17);t.exports=function(t,e){var r=(o.Object||{})[t]||Object[t],i={};i[t]=e(r),n(n.S+n.F*a(function(){r(1)}),"Object",i)}},210:function(t,e,r){var n=r(30),o=r(22);r(209)("keys",function(){return function(t){return o(n(t))}})},215:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(82),o=r.n(n),a=r(81),i=r.n(a),s=r(49),u=r.n(s),c=(r(199),r(197)),d=r(85);e.default={data:function(){return{baseImgPath:c.a}},created:function(){this.adminInfo.id||this.getAdminData()},computed:u()({},r.i(d.b)(["adminInfo"])),methods:u()({},r.i(d.c)(["getAdminData"]),{handleCommand:function(t){var e=this;return i()(o.a.mark(function r(){return o.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:"home"==t?e.$router.push("/manage"):"signout"==t&&(e.$message({type:"success",message:"退出成功"}),e.$router.push("/"),c.b.token="");case 1:case"end":return r.stop()}},r,e)}))()}})}},216:function(t,e,r){e=t.exports=r(178)(!1),e.push([t.i,".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}.header_container{background-color:#eff2f7;height:60px;display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:center;align-items:center;padding-left:20px}.avator{width:36px;height:36px;border-radius:50%;margin-right:37px}.el-dropdown-menu__item{text-align:center}",""])},218:function(t,e,r){var n=r(216);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);r(179)("019239ba",n,!0)},219:function(t,e,r){r(218);var n=r(83)(r(215),r(220),null,null);t.exports=n.exports},220:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"header_container"},[r("el-breadcrumb",{attrs:{separator:"/"}},[r("el-breadcrumb-item",{attrs:{to:{path:"/manage"}}},[t._v("首页")]),t._v(" "),t._l(t.$route.meta,function(e,n){return r("el-breadcrumb-item",{key:n},[t._v(t._s(e))])})],2),t._v(" "),r("el-dropdown",{attrs:{"menu-align":"start"},on:{command:t.handleCommand}},[r("img",{staticClass:"avator",attrs:{src:t.baseImgPath+t.adminInfo.avatar}}),t._v(" "),r("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[r("el-dropdown-item",{attrs:{command:"home"}},[t._v("首页")]),t._v(" "),r("el-dropdown-item",{attrs:{command:"signout"}},[t._v("退出")])],1)],1)],1)},staticRenderFns:[]}},361:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(49),o=r.n(n),a=r(82),i=r.n(a),s=r(81),u=r.n(s),c=r(219),d=r.n(c),f=r(199),l=r(197);e.default={data:function(){return{baseUrl:l.c,baseImgPath:l.a,foodForm:{username:"",role:"",balance:5},foodrules:{old_password:[{required:!0,message:"请输入原始密码",trigger:"blur"}],new_password:[{required:!0,message:"请输入新密码",trigger:"blur"}],new_password2:[{required:!0,message:"请输入新密码",trigger:"blur"}]},showAddCategory:!1,dialogFormVisible:!1}},components:{headTop:d.a},created:function(){},activated:function(){this.initData()},computed:{},methods:{initData:function(){var t=this;return u()(i.a.mark(function e(){var n,o;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,r.i(f.a)();case 3:return t.foodForm=e.sent,e.next=6,r.i(f.b)();case 6:if(n=e.sent,!n.token){e.next=11;break}l.b.token=n.token,e.next=12;break;case 11:throw new Error("获取数据失败");case 12:e.next=21;break;case 14:e.prev=14,e.t0=e.catch(0),o="会话过期，请重新登录",t.$router.push("/"),l.b.token="",t.$message({type:"error",message:o}),console.log("获取数据失败",e.t0);case 21:case"end":return e.stop()}},e,t,[[0,14]])}))()},addCategoryFun:function(){this.showAddCategory=!this.showAddCategory},changePassword:function(t){var e=this;this.$refs[t].validate(function(){var t=u()(i.a.mark(function t(n){var a,s;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!n){t.next=14;break}return a=o()({},e.foodForm),t.prev=2,t.next=5,r.i(f.c)(a);case 5:s=t.sent,1==s.status?(console.log(s),e.$message({type:"success",message:"修改成功"}),e.$router.push("/"),l.b.token=""):(void 0==s.message&&(e.$router.push("/"),s.message="会话过期，请重新登录",l.b.token=""),e.$message({type:"error",message:s.message})),t.next=12;break;case 9:t.prev=9,t.t0=t.catch(2),console.log(t.t0);case 12:t.next=16;break;case 14:return e.$notify.error({title:"错误",message:"请检查输入是否正确",offset:100}),t.abrupt("return",!1);case 16:case"end":return t.stop()}},t,e,[[2,9]])}));return function(e){return t.apply(this,arguments)}}())}}}},390:function(t,e,r){e=t.exports=r(178)(!1),e.push([t.i,".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}.form{min-width:400px;margin-bottom:30px}.form:hover{box-shadow:0 0 8px 0 rgba(232,237,250,.6),0 2px 4px 0 rgba(232,237,250,.5);border-radius:6px;transition:all .4s}.food_form{border:1px solid #eaeefb;padding:10px 10px 0}.form_header{text-align:center;margin-bottom:10px}.category_select{border:1px solid #eaeefb;padding:10px 30px 10px 10px;border-top-right-radius:6px;border-top-left-radius:6px}.add_category_row{height:0;overflow:hidden;transition:all .4s;background:#f9fafc}.showEdit{height:185px}.add_category{background:#f9fafc;padding:10px 30px 0 10px;border:1px solid #eaeefb;border-top:none}.add_category_button{text-align:center;line-height:40px;border-bottom-right-radius:6px;border-bottom-left-radius:6px;border:1px solid #eaeefb;border-top:none;transition:all .4s}.add_category_button:hover{background:#f9fafc}.add_category_button:hover .edit_icon,.add_category_button:hover span{color:#20a0ff}.add_category_button span{font-size:14px;color:#999;transition:all .4s}.add_category_button .edit_icon{color:#ccc;transition:all .4s}.avatar-uploader .el-upload{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden}.avatar-uploader .el-upload:hover{border-color:#20a0ff}.avatar-uploader-icon{font-size:28px;color:#8c939d;width:120px;height:120px;line-height:120px;text-align:center}.avatar{width:120px;height:120px;display:block}.cell{text-align:center}",""])},477:function(t,e,r){var n=r(390);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);r(179)("6254595a",n,!0)},496:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("head-top"),t._v(" "),r("el-row",{staticStyle:{"margin-top":"20px"}},[r("el-col",{attrs:{span:14,offset:4}},[r("header",{staticClass:"form_header"},[t._v("用户信息")]),t._v(" "),r("el-form",{ref:"foodForm",staticClass:"form food_form",attrs:{model:t.foodForm,rules:t.foodrules,"label-width":"110px"}},[r("el-form-item",{attrs:{label:"用户名",prop:"username"}},[r("el-input",{attrs:{disabled:""},model:{value:t.foodForm.username,callback:function(e){t.$set(t.foodForm,"username",e)},expression:"foodForm.username"}})],1),t._v(" "),r("el-form-item",{attrs:{label:"权限",prop:"role"}},[r("el-input",{attrs:{disabled:""},model:{value:t.foodForm.role,callback:function(e){t.$set(t.foodForm,"role",e)},expression:"foodForm.role"}})],1),t._v(" "),r("el-form-item",{attrs:{label:"上次充值金额",prop:"recharge"}},[r("el-input",{attrs:{disabled:""},model:{value:t.foodForm.recharge,callback:function(e){t.$set(t.foodForm,"recharge",e)},expression:"foodForm.recharge"}})],1),t._v(" "),r("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"上次充值时间",prop:"recharge_time"}},[r("el-input",{attrs:{disabled:""},model:{value:t.foodForm.recharge_time,callback:function(e){t.$set(t.foodForm,"recharge_time",e)},expression:"foodForm.recharge_time"}})],1),t._v(" "),r("el-form-item",{attrs:{label:"账户余额",prop:"balance"}},[r("el-input",{attrs:{disabled:""},model:{value:t.foodForm.balance,callback:function(e){t.$set(t.foodForm,"balance",e)},expression:"foodForm.balance"}})],1),t._v(" "),r("el-form-item",{attrs:{label:"原始密码",prop:"old_password"}},[r("el-input",{attrs:{type:"password"},model:{value:t.foodForm.old_password,callback:function(e){t.$set(t.foodForm,"old_password",e)},expression:"foodForm.old_password"}})],1),t._v(" "),r("el-form-item",{attrs:{label:"新密码",prop:"new_password"}},[r("el-input",{attrs:{type:"password"},model:{value:t.foodForm.new_password,callback:function(e){t.$set(t.foodForm,"new_password",e)},expression:"foodForm.new_password"}})],1),t._v(" "),r("el-form-item",{attrs:{label:"确认新密码",prop:"new_password2"}},[r("el-input",{attrs:{type:"password"},model:{value:t.foodForm.new_password2,callback:function(e){t.$set(t.foodForm,"new_password2",e)},expression:"foodForm.new_password2"}})],1),t._v(" "),r("el-form-item",[r("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.changePassword("foodForm")}}},[t._v("确认修改密码")])],1)],1)],1)],1)],1)},staticRenderFns:[]}}});