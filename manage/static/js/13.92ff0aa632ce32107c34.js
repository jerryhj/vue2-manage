webpackJsonp([13],{186:function(n,t,e){e(472);var r=e(83)(e(365),e(492),"data-v-2a060559",null);n.exports=r.exports},198:function(n,t,e){"use strict";e.d(t,"c",function(){return r}),e.d(t,"a",function(){return i});var r="",i=void 0;r="",i="/static/",t.b={token:""}},200:function(n,t,e){"use strict";e.d(t,"K",function(){return i}),e.d(t,"I",function(){return o}),e.d(t,"J",function(){return a}),e.d(t,"L",function(){return u}),e.d(t,"H",function(){return c}),e.d(t,"b",function(){return s}),e.d(t,"a",function(){return f}),e.d(t,"c",function(){return d}),e.d(t,"d",function(){return l}),e.d(t,"E",function(){return p}),e.d(t,"F",function(){return m}),e.d(t,"G",function(){return v}),e.d(t,"B",function(){return g}),e.d(t,"C",function(){return h}),e.d(t,"D",function(){return b}),e.d(t,"w",function(){return x}),e.d(t,"y",function(){return y}),e.d(t,"t",function(){return _}),e.d(t,"u",function(){return w}),e.d(t,"A",function(){return O}),e.d(t,"v",function(){return T}),e.d(t,"f",function(){return S}),e.d(t,"l",function(){return k}),e.d(t,"q",function(){return P}),e.d(t,"j",function(){return E}),e.d(t,"k",function(){return j}),e.d(t,"s",function(){return F}),e.d(t,"n",function(){return z}),e.d(t,"m",function(){return L}),e.d(t,"p",function(){return q}),e.d(t,"o",function(){return $}),e.d(t,"z",function(){return C}),e.d(t,"r",function(){return J}),e.d(t,"i",function(){return D}),e.d(t,"e",function(){return M}),e.d(t,"g",function(){return N}),e.d(t,"x",function(){return A}),e.d(t,"h",function(){return H});var r=e(204),i=function(n){return e.i(r.a)("/admin/login",n,"POST")},o=function(n){return e.i(r.a)("/admin/signup",n,"POST")},a=function(n){return e.i(r.a)("/admin/forgetpasswd",n,"POST")},u=function(){return e.i(r.a)("/admin/gets3count")},c=function(n){return e.i(r.a)("/admin/adds3",n,"POST")},s=function(){return e.i(r.a)("/admin/refresh_token")},f=function(){return e.i(r.a)("/admin/info")},d=function(n){return e.i(r.a)("/admin/change_password",n,"POST")},l=function(n){return e.i(r.a)("/statis/jobinfo",{query_time:n},"POST")},p=function(){return e.i(r.a)("/statis/all_store_size")},m=function(){return e.i(r.a)("/statis/all_rc_size")},v=function(){return e.i(r.a)("/statis/all_remoterc_size")},g=function(n){return e.i(r.a)("/statis/store_size",{query_time:n},"POST")},h=function(n){return e.i(r.a)("/statis/rc_size",{query_time:n},"POST")},b=function(n){return e.i(r.a)("/statis/remoterc_size",{query_time:n},"POST")},x=function(n){return e.i(r.a)("/policy/assign",n,"POST")},y=function(){return e.i(r.a)("/policy/getname")},_=function(){return e.i(r.a)("/policy/count")},w=function(n){return e.i(r.a)("/policy",n)},O=function(n){return e.i(r.a)("/policy/add",n,"POST")},T=function(n){return e.i(r.a)("/policy/"+n,{},"DELETE")},S=function(){return e.i(r.a)("/vm/getname")},k=function(n){return e.i(r.a)("/vm/sess/"+n)},P=function(n){return e.i(r.a)("/vm/installkey/"+n)},E=function(){return e.i(r.a)("/vm/count")},j=function(n){return e.i(r.a)("/vm",n)},F=function(n){return e.i(r.a)("/vm/add",n,"POST")},z=function(n){return e.i(r.a)("/vm/recovery",n,"POST")},L=function(n){return e.i(r.a)("/vm/"+n,{},"DELETE")},q=function(n){return e.i(r.a)("/undepolyvm",n)},$=function(){return e.i(r.a)("/undepolyvm/count")},C=function(n){return e.i(r.a)("/undepolyvm/add",n,"POST")},J=function(n){return e.i(r.a)("/undepolyvm/"+n,{},"DELETE")},D=function(n){return e.i(r.a)("/instantvm/bindvm",n,"POST")},M=function(){return e.i(r.a)("/instantvm/count")},N=function(n){return e.i(r.a)("/instantvm",n)},A=function(n){return e.i(r.a)("/instantvm/add",n,"POST")},H=function(n){return e.i(r.a)("/instantvm/"+n,{},"DELETE")}},204:function(n,t,e){"use strict";var r=e(82),i=e.n(r),o=e(21),a=e.n(o),u=e(84),c=e.n(u),s=e(205),f=e.n(s),d=e(206),l=e.n(d),p=e(81),m=e.n(p),v=e(198),g=this;t.a=function(){var n=m()(i.a.mark(function n(){var t,e,r,o,u=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},d=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET",p=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"fetch";return i.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(d=d.toUpperCase(),u=v.c+u,"GET"==d&&(t="",l()(s).forEach(function(n){t+=n+"="+s[n]+"&"}),""!==t&&(t=t.substr(0,t.lastIndexOf("&")),u=u+"?"+t)),!window.fetch||"fetch"!=p){n.next=21;break}return e={credentials:"include",method:d,headers:{Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer "+v.b.token},mode:"cors",cache:"no-cache"},"POST"==d&&Object.defineProperty(e,"body",{value:f()(s)}),n.prev=6,n.next=9,fetch(u,e);case 9:return r=n.sent,n.next=12,r.json();case 12:return o=n.sent,n.abrupt("return",o);case 16:throw n.prev=16,n.t0=n.catch(6),new Error(n.t0);case 19:n.next=22;break;case 21:return n.abrupt("return",new c.a(function(n,t){var e=void 0;e=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject;var r="";"POST"==d&&(r=f()(s)),e.open(d,u,!0),e.setRequestHeader("Content-type","application/x-www-form-urlencoded"),e.send(r),e.onreadystatechange=function(){if(4==e.readyState)if(200==e.status){var r=e.response;"object"!==(void 0===r?"undefined":a()(r))&&(r=JSON.parse(r)),n(r)}else t(e)}}));case 22:case"end":return n.stop()}},n,g,[[6,16]])}));return function(){return n.apply(this,arguments)}}()},205:function(n,t,e){n.exports={default:e(207),__esModule:!0}},206:function(n,t,e){n.exports={default:e(208),__esModule:!0}},207:function(n,t,e){var r=e(5),i=r.JSON||(r.JSON={stringify:JSON.stringify});n.exports=function(n){return i.stringify.apply(i,arguments)}},208:function(n,t,e){e(210),n.exports=e(5).Object.keys},209:function(n,t,e){var r=e(13),i=e(5),o=e(17);n.exports=function(n,t){var e=(i.Object||{})[n]||Object[n],a={};a[n]=t(e),r(r.S+r.F*o(function(){e(1)}),"Object",a)}},210:function(n,t,e){var r=e(30),i=e(22);e(209)("keys",function(){return function(n){return i(r(n))}})},365:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=e(82),i=e.n(r),o=e(81),a=e.n(o),u=e(198),c=e(200);e(85);t.default={data:function(){return{loginForm:{email:""},rules:{email:[{required:!0,message:"请输入邮箱地址",trigger:"blur"}]},showLogin:!1}},mounted:function(){this.showLogin=!0},computed:{},methods:{submitForm:function(n){var t=this;return a()(i.a.mark(function r(){return i.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:t.$refs[n].validate(function(){var n=a()(i.a.mark(function n(r){var o;return i.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(!r){n.next=7;break}return n.next=3,e.i(c.J)({email:t.loginForm.email});case 3:o=n.sent,o.status?(t.$message({type:"success",message:"请检查邮箱获取新密码"}),u.b.token=o.token,t.$router.push("/")):t.$message({type:"error",message:o.message}),n.next=9;break;case 7:return t.$notify.error({title:"错误",message:"请输入正确的邮箱地址",offset:100}),n.abrupt("return",!1);case 9:case"end":return n.stop()}},n,t)}));return function(t){return n.apply(this,arguments)}}());case 1:case"end":return r.stop()}},r,t)}))()},cancel:function(){var n=this;return a()(i.a.mark(function t(){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:n.$router.push("/");case 1:case"end":return t.stop()}},t,n)}))()}}}},384:function(n,t,e){t=n.exports=e(178)(!1),t.push([n.i,".allcover[data-v-2a060559]{position:absolute;top:0;right:0}.ctt[data-v-2a060559]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.tb[data-v-2a060559]{position:absolute;top:50%;transform:translateY(-50%)}.lr[data-v-2a060559]{position:absolute;left:50%;transform:translateX(-50%)}.login_page[data-v-2a060559]{background-color:#324057}.manage_tip[data-v-2a060559]{position:absolute;width:100%;top:-100px;left:0;text-align:center}.manage_tip p[data-v-2a060559]{font-size:34px;color:#fff}.form_contianer[data-v-2a060559]{width:480px;height:100px;position:absolute;top:50%;left:50%;margin-top:-50px;margin-left:-240px;padding:25px;border-radius:5px;text-align:right;background-color:#fff}.form_contianer .submit_btn[data-v-2a060559]{width:100%;font-size:16px}.tip[data-v-2a060559]{font-size:12px;color:red}.form-fade-enter-active[data-v-2a060559],.form-fade-leave-active[data-v-2a060559]{transition:all 1s}.form-fade-enter[data-v-2a060559],.form-fade-leave-active[data-v-2a060559]{transform:translate3d(0,-50px,0);opacity:0}",""])},472:function(n,t,e){var r=e(384);"string"==typeof r&&(r=[[n.i,r,""]]),r.locals&&(n.exports=r.locals);e(179)("047beeb6",r,!0)},492:function(n,t){n.exports={render:function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"login_page fillcontain"},[e("transition",{attrs:{name:"form-fade",mode:"in-out"}},[e("section",{directives:[{name:"show",rawName:"v-show",value:n.showLogin,expression:"showLogin"}],staticClass:"form_contianer"},[e("div",{staticClass:"manage_tip"},[e("p",[n._v("取回密码")])]),n._v(" "),e("el-form",{ref:"loginForm",attrs:{model:n.loginForm,rules:n.rules}},[e("el-form-item",{attrs:{prop:"email"}},[e("el-input",{attrs:{placeholder:"邮箱地址"},model:{value:n.loginForm.email,callback:function(t){n.$set(n.loginForm,"email",t)},expression:"loginForm.email"}},[e("span",[n._v("dsfsf")])])],1),n._v(" "),e("el-form-item",[e("el-button",{on:{click:n.cancel}},[n._v("取 消")]),n._v(" "),e("el-button",{attrs:{type:"primary"},on:{click:function(t){return n.submitForm("loginForm")}}},[n._v("提 交")])],1)],1)],1)])],1)},staticRenderFns:[]}}});