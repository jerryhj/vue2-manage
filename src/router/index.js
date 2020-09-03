import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const addPolicy = r => require.ensure([], () => r(require('@/page/addPolicy')), 'addPolicy');
const addVM = r => require.ensure([], () => r(require('@/page/addVM')), 'addVM');
const addInstantVM = r => require.ensure([], () => r(require('@/page/addInstantVM')), 'addInstantVM');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const policyList = r => require.ensure([], () => r(require('@/page/policyList')), 'policyList');
const undepolyvmList = r => require.ensure([], () => r(require('@/page/undepolyvmList')), 'undepolyvmList');
const vmList = r => require.ensure([], () => r(require('@/page/vmList')), 'vmList');
const instantvmList = r => require.ensure([], () => r(require('@/page/instantvmList')), 'instantvmList');
const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList');
const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor');
const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember');
const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg');
const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit');
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');
const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');

const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '',
			component: home,
			meta: [],
		},{
			path: '/addPolicy',
			component: addPolicy,
			meta: ['添加项目', '添加备份策略'],
		},{
			path: '/addVM',
			component: addVM,
			meta: ['添加项目', '添加待部署虚拟机'],
		},{
			path: '/addInstantVM',
			component: addInstantVM,
			meta: ['添加项目', '添加即时恢复虚拟机'],
/*
		},{
			path: '/userList',
			component: userList,
			meta: ['列表管理', '用户列表'],
*/
		},{
			path: '/policyList',
			component: policyList,
			meta: ['列表管理', '备份策略列表'],
		},{
			path: '/undepolyvmList',
			component: undepolyvmList,
			meta: ['列表管理', '待部署虚拟机列表'],
		},{
			path: '/vmList',
			component: vmList,
			meta: ['列表管理', '被保护虚拟机列表'],
		},{
			path: '/instantvmList',
			component: instantvmList,
			meta: ['列表管理', '即时恢复虚拟机列表'],
/*
		},{
			path: '/adminList',
			component: adminList,
			meta: ['列表管理', '管理员列表'],
*/
		},{
			path: '/visitor',
			component: visitor,
			meta: ['图表', '被保护虚拟机'],
		},{
			path: '/newMember',
			component: newMember,
			meta: ['图表', '用户数据'],
/*
		},{
			path: '/uploadImg',
			component: uploadImg,
			meta: ['文本编辑', 'MarkDown'],
		},{
			path: '/vueEdit',
			component: vueEdit,
			meta: ['编辑', '文本编辑'],
		},{
*/
			path: '/adminSet',
			component: adminSet,
			meta: ['设置', '管理员设置'],
		},{
			path: '/sendMessage',
			component: sendMessage,
			meta: ['设置', '发送通知'],
		},{
			path: '/explain',
			component: explain,
			meta: ['关于', '关于'],
		}]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
