webpackJsonp([2],{182:function(e,t,n){n(476);var r=n(83)(n(360),n(495),null,null);e.exports=r.exports},197:function(e,t,n){"use strict";n.d(t,"c",function(){return r}),n.d(t,"a",function(){return o});var r="",o=void 0;r="",o="/static/",t.b={token:""}},199:function(e,t,n){"use strict";n.d(t,"J",function(){return o}),n.d(t,"H",function(){return a}),n.d(t,"I",function(){return i}),n.d(t,"b",function(){return u}),n.d(t,"a",function(){return s}),n.d(t,"c",function(){return c}),n.d(t,"d",function(){return l}),n.d(t,"E",function(){return d}),n.d(t,"F",function(){return f}),n.d(t,"G",function(){return p}),n.d(t,"B",function(){return m}),n.d(t,"C",function(){return v}),n.d(t,"D",function(){return b}),n.d(t,"w",function(){return h}),n.d(t,"y",function(){return g}),n.d(t,"t",function(){return x}),n.d(t,"u",function(){return y}),n.d(t,"A",function(){return _}),n.d(t,"v",function(){return k}),n.d(t,"f",function(){return w}),n.d(t,"l",function(){return F}),n.d(t,"q",function(){return T}),n.d(t,"j",function(){return O}),n.d(t,"k",function(){return S}),n.d(t,"s",function(){return P}),n.d(t,"n",function(){return E}),n.d(t,"m",function(){return $}),n.d(t,"p",function(){return j}),n.d(t,"o",function(){return C}),n.d(t,"z",function(){return z}),n.d(t,"r",function(){return M}),n.d(t,"i",function(){return q}),n.d(t,"e",function(){return A}),n.d(t,"g",function(){return D}),n.d(t,"x",function(){return I}),n.d(t,"h",function(){return L});var r=n(204),o=function(e){return n.i(r.a)("/admin/login",e,"POST")},a=function(e){return n.i(r.a)("/admin/signup",e,"POST")},i=function(e){return n.i(r.a)("/admin/forgetpasswd",e,"POST")},u=function(){return n.i(r.a)("/admin/refresh_token")},s=function(){return n.i(r.a)("/admin/info")},c=function(e){return n.i(r.a)("/admin/change_password",e,"POST")},l=function(e){return n.i(r.a)("/statis/jobinfo",{query_time:e},"POST")},d=function(){return n.i(r.a)("/statis/all_store_size")},f=function(){return n.i(r.a)("/statis/all_rc_size")},p=function(){return n.i(r.a)("/statis/all_remoterc_size")},m=function(e){return n.i(r.a)("/statis/store_size",{query_time:e},"POST")},v=function(e){return n.i(r.a)("/statis/rc_size",{query_time:e},"POST")},b=function(e){return n.i(r.a)("/statis/remoterc_size",{query_time:e},"POST")},h=function(e){return n.i(r.a)("/policy/assign",e,"POST")},g=function(){return n.i(r.a)("/policy/getname")},x=function(){return n.i(r.a)("/policy/count")},y=function(e){return n.i(r.a)("/policy",e)},_=function(e){return n.i(r.a)("/policy/add",e,"POST")},k=function(e){return n.i(r.a)("/policy/"+e,{},"DELETE")},w=function(){return n.i(r.a)("/vm/getname")},F=function(e){return n.i(r.a)("/vm/sess/"+e)},T=function(e){return n.i(r.a)("/vm/installkey/"+e)},O=function(){return n.i(r.a)("/vm/count")},S=function(e){return n.i(r.a)("/vm",e)},P=function(e){return n.i(r.a)("/vm/add",e,"POST")},E=function(e){return n.i(r.a)("/vm/recovery",e,"POST")},$=function(e){return n.i(r.a)("/vm/"+e,{},"DELETE")},j=function(e){return n.i(r.a)("/undepolyvm",e)},C=function(){return n.i(r.a)("/undepolyvm/count")},z=function(e){return n.i(r.a)("/undepolyvm/add",e,"POST")},M=function(e){return n.i(r.a)("/undepolyvm/"+e,{},"DELETE")},q=function(e){return n.i(r.a)("/instantvm/bindvm",e,"POST")},A=function(){return n.i(r.a)("/instantvm/count")},D=function(e){return n.i(r.a)("/instantvm",e)},I=function(e){return n.i(r.a)("/instantvm/add",e,"POST")},L=function(e){return n.i(r.a)("/instantvm/"+e,{},"DELETE")}},204:function(e,t,n){"use strict";var r=n(82),o=n.n(r),a=n(21),i=n.n(a),u=n(84),s=n.n(u),c=n(205),l=n.n(c),d=n(206),f=n.n(d),p=n(81),m=n.n(p),v=n(197),b=this;t.a=function(){var e=m()(o.a.mark(function e(){var t,n,r,a,u=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},d=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET",p=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"fetch";return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(d=d.toUpperCase(),u=v.c+u,"GET"==d&&(t="",f()(c).forEach(function(e){t+=e+"="+c[e]+"&"}),""!==t&&(t=t.substr(0,t.lastIndexOf("&")),u=u+"?"+t)),!window.fetch||"fetch"!=p){e.next=21;break}return n={credentials:"include",method:d,headers:{Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer "+v.b.token},mode:"cors",cache:"no-cache"},"POST"==d&&Object.defineProperty(n,"body",{value:l()(c)}),e.prev=6,e.next=9,fetch(u,n);case 9:return r=e.sent,e.next=12,r.json();case 12:return a=e.sent,e.abrupt("return",a);case 16:throw e.prev=16,e.t0=e.catch(6),new Error(e.t0);case 19:e.next=22;break;case 21:return e.abrupt("return",new s.a(function(e,t){var n=void 0;n=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject;var r="";"POST"==d&&(r=l()(c)),n.open(d,u,!0),n.setRequestHeader("Content-type","application/x-www-form-urlencoded"),n.send(r),n.onreadystatechange=function(){if(4==n.readyState)if(200==n.status){var r=n.response;"object"!==(void 0===r?"undefined":i()(r))&&(r=JSON.parse(r)),e(r)}else t(n)}}));case 22:case"end":return e.stop()}},e,b,[[6,16]])}));return function(){return e.apply(this,arguments)}}()},205:function(e,t,n){e.exports={default:n(207),__esModule:!0}},206:function(e,t,n){e.exports={default:n(208),__esModule:!0}},207:function(e,t,n){var r=n(5),o=r.JSON||(r.JSON={stringify:JSON.stringify});e.exports=function(e){return o.stringify.apply(o,arguments)}},208:function(e,t,n){n(210),e.exports=n(5).Object.keys},209:function(e,t,n){var r=n(13),o=n(5),a=n(17);e.exports=function(e,t){var n=(o.Object||{})[e]||Object[e],i={};i[e]=t(n),r(r.S+r.F*a(function(){n(1)}),"Object",i)}},210:function(e,t,n){var r=n(30),o=n(22);n(209)("keys",function(){return function(e){return o(r(e))}})},215:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(82),o=n.n(r),a=n(81),i=n.n(a),u=n(49),s=n.n(u),c=(n(199),n(197)),l=n(85);t.default={data:function(){return{baseImgPath:c.a}},created:function(){this.adminInfo.id||this.getAdminData()},computed:s()({},n.i(l.b)(["adminInfo"])),methods:s()({},n.i(l.c)(["getAdminData"]),{handleCommand:function(e){var t=this;return i()(o.a.mark(function n(){return o.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:"home"==e?t.$router.push("/manage"):"signout"==e&&(t.$message({type:"success",message:"退出成功"}),t.$router.push("/"),c.b.token="");case 1:case"end":return n.stop()}},n,t)}))()}})}},216:function(e,t,n){t=e.exports=n(178)(!1),t.push([e.i,".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}.header_container{background-color:#eff2f7;height:60px;display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:center;align-items:center;padding-left:20px}.avator{width:36px;height:36px;border-radius:50%;margin-right:37px}.el-dropdown-menu__item{text-align:center}",""])},218:function(e,t,n){var r=n(216);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);n(179)("019239ba",r,!0)},219:function(e,t,n){n(218);var r=n(83)(n(215),n(220),null,null);e.exports=r.exports},220:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"header_container"},[n("el-breadcrumb",{attrs:{separator:"/"}},[n("el-breadcrumb-item",{attrs:{to:{path:"/manage"}}},[e._v("首页")]),e._v(" "),e._l(e.$route.meta,function(t,r){return n("el-breadcrumb-item",{key:r},[e._v(e._s(t))])})],2),e._v(" "),n("el-dropdown",{attrs:{"menu-align":"start"},on:{command:e.handleCommand}},[n("img",{staticClass:"avator",attrs:{src:e.baseImgPath+e.adminInfo.avatar}}),e._v(" "),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[n("el-dropdown-item",{attrs:{command:"home"}},[e._v("首页")]),e._v(" "),n("el-dropdown-item",{attrs:{command:"signout"}},[e._v("退出")])],1)],1)],1)},staticRenderFns:[]}},360:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(375),o=n.n(r),a=n(49),i=n.n(a),u=n(82),s=n.n(u),c=n(81),l=n.n(c),d=n(219),f=n.n(d),p=n(199),m=n(197);t.default={data:function(){return{baseUrl:m.c,baseImgPath:m.a,restaurant_id:1,categoryForm:{vmname:"",area:1048833,s3area:1048833,priv:5,policy:"",startTime:""},foodForm:{vmname:"",area:1048833,s3area:1048833,priv:5,policy:"",startTime:"",image_path:""},foodrules:{vmname:[{required:!0,message:"请输入虚拟机名称",trigger:"blur"}]},area:[{value:1048833,label:"阿里云北京"},{value:1049089,label:"阿里云上海"},{value:2097409,label:"腾讯云北京"},{value:2097665,label:"腾讯云上海"}],s3area:[{value:1048833,label:"阿里云北京"},{value:2097665,label:"腾讯云上海"}],priv:[{value:9,label:"低"},{value:5,label:"中"},{value:1,label:"高"}],policy:[{}],showAddCategory:!1,dialogFormVisible:!1}},components:{headTop:f.a},created:function(){},activated:function(){this.initData()},computed:{},methods:{initData:function(){var e=this;return l()(s.a.mark(function t(){var r,o,a;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,n.i(p.b)();case 3:r=t.sent,r.token&&(m.b.token=r.token),t.next=14;break;case 7:t.prev=7,t.t0=t.catch(0),o="会话过期，请重新登录",e.$router.push("/"),m.b.token="",e.$message({type:"error",message:o}),console.log("获取数据失败",t.t0);case 14:return t.prev=14,t.next=17,n.i(p.y)();case 17:a=t.sent,1==a.status?(a.category_list.map(function(e,t){e.value=e.name,e.label=e.name}),e.categoryForm.policy=a.category_list,e.policy=a.category_list):console.log(a),t.next=24;break;case 21:t.prev=21,t.t1=t.catch(14),console.log(t.t1);case 24:case"end":return t.stop()}},t,e,[[0,7],[14,21]])}))()},addCategoryFun:function(){this.showAddCategory=!this.showAddCategory},addUndepolyVM:function(e){var t=this;this.$refs[e].validate(function(){var e=l()(s.a.mark(function e(r){var a,u,c,l;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!r){e.next=26;break}return a=i()({},t.foodForm),e.prev=2,e.next=5,n.i(p.z)(a);case 5:if(u=e.sent,1!=u.status){e.next=17;break}return console.log(u),t.$message({type:"success",message:"添加成功"}),t.foodForm=(c={vmname:"",area:1048833,s3area:1048833,priv:5,policy:"",startTime:"",description:""},o()(c,"startTime",""),o()(c,"image_path",""),o()(c,"activity",""),o()(c,"attributes",[]),o()(c,"specs",[{specs:"默认",packing_fee:0,price:20}]),c),e.next=12,n.i(p.b)();case 12:l=e.sent,l.token&&(m.b.token=l.token),t.$router.push("undepolyvmList"),e.next=19;break;case 17:void 0==u.message&&(t.$router.push("/"),u.message="会话过期，请重新登录",m.b.token=""),t.$message({type:"error",message:u.message});case 19:e.next=24;break;case 21:e.prev=21,e.t0=e.catch(2),console.log(e.t0);case 24:e.next=28;break;case 26:return t.$notify.error({title:"错误",message:"请检查输入是否正确",offset:100}),e.abrupt("return",!1);case 28:case"end":return e.stop()}},e,t,[[2,21]])}));return function(t){return e.apply(this,arguments)}}())}}}},374:function(e,t,n){e.exports={default:n(378),__esModule:!0}},375:function(e,t,n){"use strict";t.__esModule=!0;var r=n(374),o=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=function(e,t,n){return t in e?(0,o.default)(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}},378:function(e,t,n){n(381);var r=n(5).Object;e.exports=function(e,t,n){return r.defineProperty(e,t,n)}},381:function(e,t,n){var r=n(13);r(r.S+r.F*!n(6),"Object",{defineProperty:n(9).f})},389:function(e,t,n){t=e.exports=n(178)(!1),t.push([e.i,".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}.form{min-width:400px;margin-bottom:30px}.form:hover{box-shadow:0 0 8px 0 rgba(232,237,250,.6),0 2px 4px 0 rgba(232,237,250,.5);border-radius:6px;transition:all .4s}.food_form{border:1px solid #eaeefb;padding:10px 10px 0}.form_header{text-align:center;margin-bottom:10px}.category_select{border:1px solid #eaeefb;padding:10px 30px 10px 10px;border-top-right-radius:6px;border-top-left-radius:6px}.add_category_row{height:0;overflow:hidden;transition:all .4s;background:#f9fafc}.showEdit{height:185px}.add_category{background:#f9fafc;padding:10px 30px 0 10px;border:1px solid #eaeefb;border-top:none}.add_category_button{text-align:center;line-height:40px;border-bottom-right-radius:6px;border-bottom-left-radius:6px;border:1px solid #eaeefb;border-top:none;transition:all .4s}.add_category_button:hover{background:#f9fafc}.add_category_button:hover .edit_icon,.add_category_button:hover span{color:#20a0ff}.add_category_button span{font-size:14px;color:#999;transition:all .4s}.add_category_button .edit_icon{color:#ccc;transition:all .4s}.avatar-uploader .el-upload{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden}.avatar-uploader .el-upload:hover{border-color:#20a0ff}.avatar-uploader-icon{font-size:28px;color:#8c939d;width:120px;height:120px;line-height:120px;text-align:center}.avatar{width:120px;height:120px;display:block}.cell{text-align:center}",""])},476:function(e,t,n){var r=n(389);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);n(179)("4fdaef8d",r,!0)},495:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("head-top"),e._v(" "),n("el-row",{staticStyle:{"margin-top":"20px"}},[n("el-col",{attrs:{span:14,offset:4}},[n("header",{staticClass:"form_header"},[e._v("添加待部署虚拟机")]),e._v(" "),n("el-form",{ref:"foodForm",staticClass:"form food_form",attrs:{model:e.foodForm,rules:e.foodrules,"label-width":"110px"}},[n("el-form-item",{attrs:{label:"虚拟机名称",prop:"vmname"}},[n("el-input",{model:{value:e.foodForm.vmname,callback:function(t){e.$set(e.foodForm,"vmname",t)},expression:"foodForm.vmname"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"虚拟机所在区域",prop:"area"}},[n("el-select",{attrs:{placeholder:"请选择"},model:{value:e.foodForm.area,callback:function(t){e.$set(e.foodForm,"area",t)},expression:"foodForm.area"}},e._l(e.area,function(e){return n("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),n("el-form-item",{attrs:{label:"备份数据至",prop:"s3area"}},[n("el-select",{attrs:{placeholder:"请选择"},model:{value:e.foodForm.s3area,callback:function(t){e.$set(e.foodForm,"s3area",t)},expression:"foodForm.s3area"}},e._l(e.s3area,function(e){return n("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),n("el-form-item",{attrs:{label:"备份优先级",prop:"priv"}},[n("el-select",{attrs:{placeholder:"请选择"},model:{value:e.foodForm.priv,callback:function(t){e.$set(e.foodForm,"priv",t)},expression:"foodForm.priv"}},e._l(e.priv,function(e){return n("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),n("el-form-item",{attrs:{label:"备份策略",prop:"policy"}},[n("el-select",{attrs:{placeholder:"请选择"},model:{value:e.foodForm.policy,callback:function(t){e.$set(e.foodForm,"policy",t)},expression:"foodForm.policy"}},e._l(e.policy,function(e){return n("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),n("el-form-item",{staticStyle:{"white-space":"nowrap"},attrs:{label:"首次备份",prop:"startTime"}},[n("el-time-select",{attrs:{placeholder:"执行时间","picker-options":{start:"00:00",step:"00:15",end:"23:45"}},model:{value:e.foodForm.startTime,callback:function(t){e.$set(e.foodForm,"startTime",t)},expression:"foodForm.startTime"}})],1),e._v(" "),n("el-form-item",[n("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.addUndepolyVM("foodForm")}}},[e._v("确认添加待部署虚拟机")])],1)],1)],1)],1)],1)},staticRenderFns:[]}}});