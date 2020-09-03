import fetch from '@/config/fetch'

/**
 * 登录
 */

export const login = data => fetch('/admin/login', data, 'POST');

/**
 * 退出
 */

export const signout = () => fetch('/admin/signout');

/**
 * 刷新
 */

export const refresh = () => fetch('/admin/refresh_token');

/**
 * 获取用户信息
 */

export const getAdminInfo = () => fetch('/admin/info');

/**
 * api请求量
 */

export const apiCount = date => fetch('/statis/api/' + date + '/count');

/**
 * 所有api请求量
 */

export const apiAllCount = () => fetch('/statis/api/count');


/**
 * 所有api请求信息
 */

export const apiAllRecord = () => fetch('/statis/api/all');

/**
 * 用户注册量
 */

export const userCount = date => fetch('/statis/user/' + date + '/count');

/**
 * 某一天订单数量
 */

export const orderCount = date => fetch('/statis/order/' + date + '/count');


/**
 * 某一天管理员注册量
 */

export const adminDayCount = date => fetch('/statis/admin/' + date + '/count');

/**
 * 管理员列表
 */

export const adminList = data => fetch('/admin/all', data);

/**
 * 管理员数量
 */

export const adminCount = () => fetch('/admin/count');

/**
 * 获取定位城市
 */
/*
export const cityGuess = () => fetch('/v1/cities', {
	type: 'guess'
});
*/

/**
 * 获取搜索地址
 */
/*
export const searchplace = (cityid, value) => fetch('/v1/pois', {
	type: 'search',
	city_id: cityid,
	keyword: value
});
*/
/**
 * 添加食品种类
 */

export const addCategory = data => fetch('/shopping/addcategory', data, 'POST');


/**
 * category 种类列表
 */

//export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category');

/**
 * 获取餐馆详细信息
 */

//export const getResturantDetail = restaurant_id => fetch('/shopping/' + restaurant_id);

/**
 * 获取备份策略名称
 */

export const getPolicyName = () => fetch('/policy/getname');

/**
 * 获取备份策略数量
 */

export const getPolicyCount = () => fetch('/policy/count');

/**
 * 获取备份策略列表
 */

export const getPolicies = data => fetch('/policy', data);

/**
 * 添加备份策略
 */

export const addPolicy = data => fetch('/policy/add', data, 'POST');

/**
 * 删除备份策略
 */

export const deletePolicy = restaurant_id => fetch('/policy/' + restaurant_id, {}, 'DELETE');

/**
 * 更新餐馆信息
 */

export const updateResturant = data => fetch('/shopping/updateshop', data, 'POST');

/**
 * 获取VM名称
 */

export const getVMName = () => fetch('/vm/getname');

/**
 * 获取VM数量
 */

export const getVMCount = () => fetch('/vm/count');

/**
 * 获取VM列表
 */

export const getVMs = data => fetch('/vm', data);

/**
 * 添加VM
 */

export const addVM = data => fetch('/vm/add', data, 'POST');

/**
 * 删除VM
 */

export const deleteVM = food_id => fetch('/vm/' + food_id, {}, 'DELETE');


/**
 * 获取UndepolyVM列表
 */

export const getUndepolyVMs = data => fetch('/undepolyvm', data);

/**
 * 获取UndepolyVM数量
 */

export const getUndepolyVMCount = () => fetch('/undepolyvm/count');

/**
 * 添加UNdepolyVM
 */

export const addUndepolyVM = data => fetch('/undepolyvm/add', data, 'POST');

/**
 * 绑定VM
 */

export const bindVM = data => fetch('/instantvm/bindvm', data, 'POST');

/**
 * 获取InstantVM数量
 */

export const getInstantVMCount = () => fetch('/instantvm/count');

/**
 * 获取VM列表
 */

export const getInstantVMs = data => fetch('/instantvm', data);

/**
 * 添加VM
 */

export const addInstantVM = data => fetch('/instantvm/add', data, 'POST');

/**
 * 删除VM
 */

export const deleteInstantVM = food_id => fetch('/instantvm/' + food_id, {}, 'DELETE');


/**
 * 获取menu列表
 */

//export const getMenu = data => fetch('/shopping/v2/menu', data);

/**
 * 获取menu详情
 */

//export const getMenuById = category_id => fetch('/shopping/v2/menu/' + category_id);

/**
 * 更新食品信息
 */

export const updateFood = data => fetch('/shopping/v2/updatefood', data, 'POST');


/**
 * 获取用户列表
 */

export const getUserList = data => fetch('/v1/users/list', data);

/**
 * 获取用户数量
 */

export const getUserCount = data => fetch('/v1/users/count', data);

/**
 * 获取订单列表
 */

//export const getOrderList = data => fetch('/bos/orders', data);

/**
 * 获取订单数量
 */

export const getOrderCount = data => fetch('/bos/orders/count', data);

/**
 * 获取用户信息
 */

//export const getUserInfo = user_id => fetch('/v1/user/' + user_id);

/**
 * 获取地址信息
 */

//export const getAddressById = address_id => fetch('/v1/addresse/' + address_id);

/**
 * 获取用户分布信息
 */

export const getUserCity = () => fetch('/v1/user/city/count');
