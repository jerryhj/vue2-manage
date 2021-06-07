webpackJsonp([1],Array(193).concat([
/* 193 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(484)

var Component = __webpack_require__(83)(
  /* script */
  __webpack_require__(371),
  /* template */
  __webpack_require__(503),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 194 */,
/* 195 */,
/* 196 */
/***/ (function(module, exports) {

/**
 * @module zrender/core/util
 */
// 用于处理merge时无法遍历Date等对象的问题
var BUILTIN_OBJECT = {
  '[object Function]': 1,
  '[object RegExp]': 1,
  '[object Date]': 1,
  '[object Error]': 1,
  '[object CanvasGradient]': 1,
  '[object CanvasPattern]': 1,
  // For node-canvas
  '[object Image]': 1,
  '[object Canvas]': 1
};
var TYPED_ARRAY = {
  '[object Int8Array]': 1,
  '[object Uint8Array]': 1,
  '[object Uint8ClampedArray]': 1,
  '[object Int16Array]': 1,
  '[object Uint16Array]': 1,
  '[object Int32Array]': 1,
  '[object Uint32Array]': 1,
  '[object Float32Array]': 1,
  '[object Float64Array]': 1
};
var objToString = Object.prototype.toString;
var arrayProto = Array.prototype;
var nativeForEach = arrayProto.forEach;
var nativeFilter = arrayProto.filter;
var nativeSlice = arrayProto.slice;
var nativeMap = arrayProto.map;
var nativeReduce = arrayProto.reduce; // Avoid assign to an exported variable, for transforming to cjs.

var methods = {};

function $override(name, fn) {
  methods[name] = fn;
}
/**
 * Those data types can be cloned:
 *     Plain object, Array, TypedArray, number, string, null, undefined.
 * Those data types will be assgined using the orginal data:
 *     BUILTIN_OBJECT
 * Instance of user defined class will be cloned to a plain object, without
 * properties in prototype.
 * Other data types is not supported (not sure what will happen).
 *
 * Caution: do not support clone Date, for performance consideration.
 * (There might be a large number of date in `series.data`).
 * So date should not be modified in and out of echarts.
 *
 * @param {*} source
 * @return {*} new
 */


function clone(source) {
  if (source == null || typeof source != 'object') {
    return source;
  }

  var result = source;
  var typeStr = objToString.call(source);

  if (typeStr === '[object Array]') {
    result = [];

    for (var i = 0, len = source.length; i < len; i++) {
      result[i] = clone(source[i]);
    }
  } else if (TYPED_ARRAY[typeStr]) {
    var Ctor = source.constructor;

    if (source.constructor.from) {
      result = Ctor.from(source);
    } else {
      result = new Ctor(source.length);

      for (var i = 0, len = source.length; i < len; i++) {
        result[i] = clone(source[i]);
      }
    }
  } else if (!BUILTIN_OBJECT[typeStr] && !isPrimitive(source) && !isDom(source)) {
    result = {};

    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        result[key] = clone(source[key]);
      }
    }
  }

  return result;
}
/**
 * @memberOf module:zrender/core/util
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overwrite=false]
 */


function merge(target, source, overwrite) {
  // We should escapse that source is string
  // and enter for ... in ...
  if (!isObject(source) || !isObject(target)) {
    return overwrite ? clone(source) : target;
  }

  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      var targetProp = target[key];
      var sourceProp = source[key];

      if (isObject(sourceProp) && isObject(targetProp) && !isArray(sourceProp) && !isArray(targetProp) && !isDom(sourceProp) && !isDom(targetProp) && !isBuiltInObject(sourceProp) && !isBuiltInObject(targetProp) && !isPrimitive(sourceProp) && !isPrimitive(targetProp)) {
        // 如果需要递归覆盖，就递归调用merge
        merge(targetProp, sourceProp, overwrite);
      } else if (overwrite || !(key in target)) {
        // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
        // NOTE，在 target[key] 不存在的时候也是直接覆盖
        target[key] = clone(source[key], true);
      }
    }
  }

  return target;
}
/**
 * @param {Array} targetAndSources The first item is target, and the rests are source.
 * @param {boolean} [overwrite=false]
 * @return {*} target
 */


function mergeAll(targetAndSources, overwrite) {
  var result = targetAndSources[0];

  for (var i = 1, len = targetAndSources.length; i < len; i++) {
    result = merge(result, targetAndSources[i], overwrite);
  }

  return result;
}
/**
 * @param {*} target
 * @param {*} source
 * @memberOf module:zrender/core/util
 */


function extend(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }

  return target;
}
/**
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overlay=false]
 * @memberOf module:zrender/core/util
 */


function defaults(target, source, overlay) {
  for (var key in source) {
    if (source.hasOwnProperty(key) && (overlay ? source[key] != null : target[key] == null)) {
      target[key] = source[key];
    }
  }

  return target;
}

var createCanvas = function () {
  return methods.createCanvas();
};

methods.createCanvas = function () {
  return document.createElement('canvas');
}; // FIXME


var _ctx;

function getContext() {
  if (!_ctx) {
    // Use util.createCanvas instead of createCanvas
    // because createCanvas may be overwritten in different environment
    _ctx = createCanvas().getContext('2d');
  }

  return _ctx;
}
/**
 * 查询数组中元素的index
 * @memberOf module:zrender/core/util
 */


function indexOf(array, value) {
  if (array) {
    if (array.indexOf) {
      return array.indexOf(value);
    }

    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === value) {
        return i;
      }
    }
  }

  return -1;
}
/**
 * 构造类继承关系
 *
 * @memberOf module:zrender/core/util
 * @param {Function} clazz 源类
 * @param {Function} baseClazz 基类
 */


function inherits(clazz, baseClazz) {
  var clazzPrototype = clazz.prototype;

  function F() {}

  F.prototype = baseClazz.prototype;
  clazz.prototype = new F();

  for (var prop in clazzPrototype) {
    clazz.prototype[prop] = clazzPrototype[prop];
  }

  clazz.prototype.constructor = clazz;
  clazz.superClass = baseClazz;
}
/**
 * @memberOf module:zrender/core/util
 * @param {Object|Function} target
 * @param {Object|Function} sorce
 * @param {boolean} overlay
 */


function mixin(target, source, overlay) {
  target = 'prototype' in target ? target.prototype : target;
  source = 'prototype' in source ? source.prototype : source;
  defaults(target, source, overlay);
}
/**
 * Consider typed array.
 * @param {Array|TypedArray} data
 */


function isArrayLike(data) {
  if (!data) {
    return;
  }

  if (typeof data == 'string') {
    return false;
  }

  return typeof data.length == 'number';
}
/**
 * 数组或对象遍历
 * @memberOf module:zrender/core/util
 * @param {Object|Array} obj
 * @param {Function} cb
 * @param {*} [context]
 */


function each(obj, cb, context) {
  if (!(obj && cb)) {
    return;
  }

  if (obj.forEach && obj.forEach === nativeForEach) {
    obj.forEach(cb, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, len = obj.length; i < len; i++) {
      cb.call(context, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        cb.call(context, obj[key], key, obj);
      }
    }
  }
}
/**
 * 数组映射
 * @memberOf module:zrender/core/util
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */


function map(obj, cb, context) {
  if (!(obj && cb)) {
    return;
  }

  if (obj.map && obj.map === nativeMap) {
    return obj.map(cb, context);
  } else {
    var result = [];

    for (var i = 0, len = obj.length; i < len; i++) {
      result.push(cb.call(context, obj[i], i, obj));
    }

    return result;
  }
}
/**
 * @memberOf module:zrender/core/util
 * @param {Array} obj
 * @param {Function} cb
 * @param {Object} [memo]
 * @param {*} [context]
 * @return {Array}
 */


function reduce(obj, cb, memo, context) {
  if (!(obj && cb)) {
    return;
  }

  if (obj.reduce && obj.reduce === nativeReduce) {
    return obj.reduce(cb, memo, context);
  } else {
    for (var i = 0, len = obj.length; i < len; i++) {
      memo = cb.call(context, memo, obj[i], i, obj);
    }

    return memo;
  }
}
/**
 * 数组过滤
 * @memberOf module:zrender/core/util
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */


function filter(obj, cb, context) {
  if (!(obj && cb)) {
    return;
  }

  if (obj.filter && obj.filter === nativeFilter) {
    return obj.filter(cb, context);
  } else {
    var result = [];

    for (var i = 0, len = obj.length; i < len; i++) {
      if (cb.call(context, obj[i], i, obj)) {
        result.push(obj[i]);
      }
    }

    return result;
  }
}
/**
 * 数组项查找
 * @memberOf module:zrender/core/util
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {*}
 */


function find(obj, cb, context) {
  if (!(obj && cb)) {
    return;
  }

  for (var i = 0, len = obj.length; i < len; i++) {
    if (cb.call(context, obj[i], i, obj)) {
      return obj[i];
    }
  }
}
/**
 * @memberOf module:zrender/core/util
 * @param {Function} func
 * @param {*} context
 * @return {Function}
 */


function bind(func, context) {
  var args = nativeSlice.call(arguments, 2);
  return function () {
    return func.apply(context, args.concat(nativeSlice.call(arguments)));
  };
}
/**
 * @memberOf module:zrender/core/util
 * @param {Function} func
 * @return {Function}
 */


function curry(func) {
  var args = nativeSlice.call(arguments, 1);
  return function () {
    return func.apply(this, args.concat(nativeSlice.call(arguments)));
  };
}
/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */


function isArray(value) {
  return objToString.call(value) === '[object Array]';
}
/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */


function isFunction(value) {
  return typeof value === 'function';
}
/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */


function isString(value) {
  return objToString.call(value) === '[object String]';
}
/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */


function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type === 'function' || !!value && type == 'object';
}
/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */


function isBuiltInObject(value) {
  return !!BUILTIN_OBJECT[objToString.call(value)];
}
/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */


function isDom(value) {
  return typeof value === 'object' && typeof value.nodeType === 'number' && typeof value.ownerDocument === 'object';
}
/**
 * Whether is exactly NaN. Notice isNaN('a') returns true.
 * @param {*} value
 * @return {boolean}
 */


function eqNaN(value) {
  return value !== value;
}
/**
 * If value1 is not null, then return value1, otherwise judget rest of values.
 * Low performance.
 * @memberOf module:zrender/core/util
 * @return {*} Final value
 */


function retrieve(values) {
  for (var i = 0, len = arguments.length; i < len; i++) {
    if (arguments[i] != null) {
      return arguments[i];
    }
  }
}

function retrieve2(value0, value1) {
  return value0 != null ? value0 : value1;
}

function retrieve3(value0, value1, value2) {
  return value0 != null ? value0 : value1 != null ? value1 : value2;
}
/**
 * @memberOf module:zrender/core/util
 * @param {Array} arr
 * @param {number} startIndex
 * @param {number} endIndex
 * @return {Array}
 */


function slice() {
  return Function.call.apply(nativeSlice, arguments);
}
/**
 * Normalize css liked array configuration
 * e.g.
 *  3 => [3, 3, 3, 3]
 *  [4, 2] => [4, 2, 4, 2]
 *  [4, 3, 2] => [4, 3, 2, 3]
 * @param {number|Array.<number>} val
 * @return {Array.<number>}
 */


function normalizeCssArray(val) {
  if (typeof val === 'number') {
    return [val, val, val, val];
  }

  var len = val.length;

  if (len === 2) {
    // vertical | horizontal
    return [val[0], val[1], val[0], val[1]];
  } else if (len === 3) {
    // top | horizontal | bottom
    return [val[0], val[1], val[2], val[1]];
  }

  return val;
}
/**
 * @memberOf module:zrender/core/util
 * @param {boolean} condition
 * @param {string} message
 */


function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

var primitiveKey = '__ec_primitive__';
/**
 * Set an object as primitive to be ignored traversing children in clone or merge
 */

function setAsPrimitive(obj) {
  obj[primitiveKey] = true;
}

function isPrimitive(obj) {
  return obj[primitiveKey];
}
/**
 * @constructor
 * @param {Object} obj Only apply `ownProperty`.
 */


function HashMap(obj) {
  obj && each(obj, function (value, key) {
    this.set(key, value);
  }, this);
} // Add prefix to avoid conflict with Object.prototype.


var HASH_MAP_PREFIX = '_ec_';
var HASH_MAP_PREFIX_LENGTH = 4;
HashMap.prototype = {
  constructor: HashMap,
  // Do not provide `has` method to avoid defining what is `has`.
  // (We usually treat `null` and `undefined` as the same, different
  // from ES6 Map).
  get: function (key) {
    return this[HASH_MAP_PREFIX + key];
  },
  set: function (key, value) {
    this[HASH_MAP_PREFIX + key] = value; // Comparing with invocation chaining, `return value` is more commonly
    // used in this case: `var someVal = map.set('a', genVal());`

    return value;
  },
  // Although util.each can be performed on this hashMap directly, user
  // should not use the exposed keys, who are prefixed.
  each: function (cb, context) {
    context !== void 0 && (cb = bind(cb, context));

    for (var prefixedKey in this) {
      this.hasOwnProperty(prefixedKey) && cb(this[prefixedKey], prefixedKey.slice(HASH_MAP_PREFIX_LENGTH));
    }
  },
  // Do not use this method if performance sensitive.
  removeKey: function (key) {
    delete this[HASH_MAP_PREFIX + key];
  }
};

function createHashMap(obj) {
  return new HashMap(obj);
}

function noop() {}

exports.$override = $override;
exports.clone = clone;
exports.merge = merge;
exports.mergeAll = mergeAll;
exports.extend = extend;
exports.defaults = defaults;
exports.createCanvas = createCanvas;
exports.getContext = getContext;
exports.indexOf = indexOf;
exports.inherits = inherits;
exports.mixin = mixin;
exports.isArrayLike = isArrayLike;
exports.each = each;
exports.map = map;
exports.reduce = reduce;
exports.filter = filter;
exports.find = find;
exports.bind = bind;
exports.curry = curry;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isString = isString;
exports.isObject = isObject;
exports.isBuiltInObject = isBuiltInObject;
exports.isDom = isDom;
exports.eqNaN = eqNaN;
exports.retrieve = retrieve;
exports.retrieve2 = retrieve2;
exports.retrieve3 = retrieve3;
exports.slice = slice;
exports.normalizeCssArray = normalizeCssArray;
exports.assert = assert;
exports.setAsPrimitive = setAsPrimitive;
exports.isPrimitive = isPrimitive;
exports.createHashMap = createHashMap;
exports.noop = noop;

/***/ }),
/* 197 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return baseUrl; });
/* unused harmony export routerMode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return baseImgPath; });

var token = '';
var baseUrl = '';
var routerMode = 'hash';
var baseImgPath = void 0;

baseUrl = '';
baseImgPath = '/static/';



/* harmony default export */ __webpack_exports__["b"] = ({
  token: token
});

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

var _config = __webpack_require__(211);

var __DEV__ = _config.__DEV__;

var zrender = __webpack_require__(272);

var zrUtil = __webpack_require__(196);

var colorTool = __webpack_require__(231);

var env = __webpack_require__(213);

var timsort = __webpack_require__(242);

var Eventful = __webpack_require__(227);

var GlobalModel = __webpack_require__(292);

var ExtensionAPI = __webpack_require__(279);

var CoordinateSystemManager = __webpack_require__(246);

var OptionManager = __webpack_require__(293);

var backwardCompat = __webpack_require__(300);

var ComponentModel = __webpack_require__(223);

var SeriesModel = __webpack_require__(252);

var ComponentView = __webpack_require__(277);

var ChartView = __webpack_require__(255);

var graphic = __webpack_require__(200);

var modelUtil = __webpack_require__(201);

var _throttle = __webpack_require__(248);

var throttle = _throttle.throttle;

var seriesColor = __webpack_require__(305);

var loadingDefault = __webpack_require__(291);

/*!
 * ECharts, a javascript interactive chart library.
 *
 * Copyright (c) 2015, Baidu Inc.
 * All rights reserved.
 *
 * LICENSE
 * https://github.com/ecomfe/echarts/blob/master/LICENSE.txt
 */
var each = zrUtil.each;
var parseClassType = ComponentModel.parseClassType;
var version = '3.8.5';
var dependencies = {
  zrender: '3.7.4'
};
var PRIORITY_PROCESSOR_FILTER = 1000;
var PRIORITY_PROCESSOR_STATISTIC = 5000;
var PRIORITY_VISUAL_LAYOUT = 1000;
var PRIORITY_VISUAL_GLOBAL = 2000;
var PRIORITY_VISUAL_CHART = 3000;
var PRIORITY_VISUAL_COMPONENT = 4000; // FIXME
// necessary?

var PRIORITY_VISUAL_BRUSH = 5000;
var PRIORITY = {
  PROCESSOR: {
    FILTER: PRIORITY_PROCESSOR_FILTER,
    STATISTIC: PRIORITY_PROCESSOR_STATISTIC
  },
  VISUAL: {
    LAYOUT: PRIORITY_VISUAL_LAYOUT,
    GLOBAL: PRIORITY_VISUAL_GLOBAL,
    CHART: PRIORITY_VISUAL_CHART,
    COMPONENT: PRIORITY_VISUAL_COMPONENT,
    BRUSH: PRIORITY_VISUAL_BRUSH
  }
}; // Main process have three entries: `setOption`, `dispatchAction` and `resize`,
// where they must not be invoked nestedly, except the only case: invoke
// dispatchAction with updateMethod "none" in main process.
// This flag is used to carry out this rule.
// All events will be triggered out side main process (i.e. when !this[IN_MAIN_PROCESS]).

var IN_MAIN_PROCESS = '__flagInMainProcess';
var HAS_GRADIENT_OR_PATTERN_BG = '__hasGradientOrPatternBg';
var OPTION_UPDATED = '__optionUpdated';
var ACTION_REG = /^[a-zA-Z0-9_]+$/;

function createRegisterEventWithLowercaseName(method) {
  return function (eventName, handler, context) {
    // Event name is all lowercase
    eventName = eventName && eventName.toLowerCase();
    Eventful.prototype[method].call(this, eventName, handler, context);
  };
}
/**
 * @module echarts~MessageCenter
 */


function MessageCenter() {
  Eventful.call(this);
}

MessageCenter.prototype.on = createRegisterEventWithLowercaseName('on');
MessageCenter.prototype.off = createRegisterEventWithLowercaseName('off');
MessageCenter.prototype.one = createRegisterEventWithLowercaseName('one');
zrUtil.mixin(MessageCenter, Eventful);
/**
 * @module echarts~ECharts
 */

function ECharts(dom, theme, opts) {
  opts = opts || {}; // Get theme by name

  if (typeof theme === 'string') {
    theme = themeStorage[theme];
  }
  /**
   * @type {string}
   */


  this.id;
  /**
   * Group id
   * @type {string}
   */

  this.group;
  /**
   * @type {HTMLElement}
   * @private
   */

  this._dom = dom;
  var defaultRenderer = 'canvas';

  /**
   * @type {module:zrender/ZRender}
   * @private
   */
  var zr = this._zr = zrender.init(dom, {
    renderer: opts.renderer || defaultRenderer,
    devicePixelRatio: opts.devicePixelRatio,
    width: opts.width,
    height: opts.height
  });
  /**
   * Expect 60 pfs.
   * @type {Function}
   * @private
   */

  this._throttledZrFlush = throttle(zrUtil.bind(zr.flush, zr), 17);
  var theme = zrUtil.clone(theme);
  theme && backwardCompat(theme, true);
  /**
   * @type {Object}
   * @private
   */

  this._theme = theme;
  /**
   * @type {Array.<module:echarts/view/Chart>}
   * @private
   */

  this._chartsViews = [];
  /**
   * @type {Object.<string, module:echarts/view/Chart>}
   * @private
   */

  this._chartsMap = {};
  /**
   * @type {Array.<module:echarts/view/Component>}
   * @private
   */

  this._componentsViews = [];
  /**
   * @type {Object.<string, module:echarts/view/Component>}
   * @private
   */

  this._componentsMap = {};
  /**
   * @type {module:echarts/CoordinateSystem}
   * @private
   */

  this._coordSysMgr = new CoordinateSystemManager();
  /**
   * @type {module:echarts/ExtensionAPI}
   * @private
   */

  this._api = createExtensionAPI(this);
  Eventful.call(this);
  /**
   * @type {module:echarts~MessageCenter}
   * @private
   */

  this._messageCenter = new MessageCenter(); // Init mouse events

  this._initEvents(); // In case some people write `window.onresize = chart.resize`


  this.resize = zrUtil.bind(this.resize, this); // Can't dispatch action during rendering procedure

  this._pendingActions = []; // Sort on demand

  function prioritySortFunc(a, b) {
    return a.prio - b.prio;
  }

  timsort(visualFuncs, prioritySortFunc);
  timsort(dataProcessorFuncs, prioritySortFunc);
  zr.animation.on('frame', this._onframe, this); // ECharts instance can be used as value.

  zrUtil.setAsPrimitive(this);
}

var echartsProto = ECharts.prototype;

echartsProto._onframe = function () {
  // Lazy update
  if (this[OPTION_UPDATED]) {
    var silent = this[OPTION_UPDATED].silent;
    this[IN_MAIN_PROCESS] = true;
    updateMethods.prepareAndUpdate.call(this);
    this[IN_MAIN_PROCESS] = false;
    this[OPTION_UPDATED] = false;
    flushPendingActions.call(this, silent);
    triggerUpdatedEvent.call(this, silent);
  }
};
/**
 * @return {HTMLElement}
 */


echartsProto.getDom = function () {
  return this._dom;
};
/**
 * @return {module:zrender~ZRender}
 */


echartsProto.getZr = function () {
  return this._zr;
};
/**
 * Usage:
 * chart.setOption(option, notMerge, lazyUpdate);
 * chart.setOption(option, {
 *     notMerge: ...,
 *     lazyUpdate: ...,
 *     silent: ...
 * });
 *
 * @param {Object} option
 * @param {Object|boolean} [opts] opts or notMerge.
 * @param {boolean} [opts.notMerge=false]
 * @param {boolean} [opts.lazyUpdate=false] Useful when setOption frequently.
 */


echartsProto.setOption = function (option, notMerge, lazyUpdate) {
  var silent;

  if (zrUtil.isObject(notMerge)) {
    lazyUpdate = notMerge.lazyUpdate;
    silent = notMerge.silent;
    notMerge = notMerge.notMerge;
  }

  this[IN_MAIN_PROCESS] = true;

  if (!this._model || notMerge) {
    var optionManager = new OptionManager(this._api);
    var theme = this._theme;
    var ecModel = this._model = new GlobalModel(null, null, theme, optionManager);
    ecModel.init(null, null, theme, optionManager);
  }

  this._model.setOption(option, optionPreprocessorFuncs);

  if (lazyUpdate) {
    this[OPTION_UPDATED] = {
      silent: silent
    };
    this[IN_MAIN_PROCESS] = false;
  } else {
    updateMethods.prepareAndUpdate.call(this); // Ensure zr refresh sychronously, and then pixel in canvas can be
    // fetched after `setOption`.

    this._zr.flush();

    this[OPTION_UPDATED] = false;
    this[IN_MAIN_PROCESS] = false;
    flushPendingActions.call(this, silent);
    triggerUpdatedEvent.call(this, silent);
  }
};
/**
 * @DEPRECATED
 */


echartsProto.setTheme = function () {
  console.log('ECharts#setTheme() is DEPRECATED in ECharts 3.0');
};
/**
 * @return {module:echarts/model/Global}
 */


echartsProto.getModel = function () {
  return this._model;
};
/**
 * @return {Object}
 */


echartsProto.getOption = function () {
  return this._model && this._model.getOption();
};
/**
 * @return {number}
 */


echartsProto.getWidth = function () {
  return this._zr.getWidth();
};
/**
 * @return {number}
 */


echartsProto.getHeight = function () {
  return this._zr.getHeight();
};
/**
 * @return {number}
 */


echartsProto.getDevicePixelRatio = function () {
  return this._zr.painter.dpr || window.devicePixelRatio || 1;
};
/**
 * Get canvas which has all thing rendered
 * @param {Object} opts
 * @param {string} [opts.backgroundColor]
 * @return {string}
 */


echartsProto.getRenderedCanvas = function (opts) {
  if (!env.canvasSupported) {
    return;
  }

  opts = opts || {};
  opts.pixelRatio = opts.pixelRatio || 1;
  opts.backgroundColor = opts.backgroundColor || this._model.get('backgroundColor');
  var zr = this._zr;
  var list = zr.storage.getDisplayList(); // Stop animations

  zrUtil.each(list, function (el) {
    el.stopAnimation(true);
  });
  return zr.painter.getRenderedCanvas(opts);
};
/**
 * Get svg data url
 * @return {string}
 */


echartsProto.getSvgDataUrl = function () {
  if (!env.svgSupported) {
    return;
  }

  var zr = this._zr;
  var list = zr.storage.getDisplayList(); // Stop animations

  zrUtil.each(list, function (el) {
    el.stopAnimation(true);
  });
  return zr.painter.pathToSvg();
};
/**
 * @return {string}
 * @param {Object} opts
 * @param {string} [opts.type='png']
 * @param {string} [opts.pixelRatio=1]
 * @param {string} [opts.backgroundColor]
 * @param {string} [opts.excludeComponents]
 */


echartsProto.getDataURL = function (opts) {
  opts = opts || {};
  var excludeComponents = opts.excludeComponents;
  var ecModel = this._model;
  var excludesComponentViews = [];
  var self = this;
  each(excludeComponents, function (componentType) {
    ecModel.eachComponent({
      mainType: componentType
    }, function (component) {
      var view = self._componentsMap[component.__viewId];

      if (!view.group.ignore) {
        excludesComponentViews.push(view);
        view.group.ignore = true;
      }
    });
  });
  var url = this._zr.painter.getType() === 'svg' ? this.getSvgDataUrl() : this.getRenderedCanvas(opts).toDataURL('image/' + (opts && opts.type || 'png'));
  each(excludesComponentViews, function (view) {
    view.group.ignore = false;
  });
  return url;
};
/**
 * @return {string}
 * @param {Object} opts
 * @param {string} [opts.type='png']
 * @param {string} [opts.pixelRatio=1]
 * @param {string} [opts.backgroundColor]
 */


echartsProto.getConnectedDataURL = function (opts) {
  if (!env.canvasSupported) {
    return;
  }

  var groupId = this.group;
  var mathMin = Math.min;
  var mathMax = Math.max;
  var MAX_NUMBER = Infinity;

  if (connectedGroups[groupId]) {
    var left = MAX_NUMBER;
    var top = MAX_NUMBER;
    var right = -MAX_NUMBER;
    var bottom = -MAX_NUMBER;
    var canvasList = [];
    var dpr = opts && opts.pixelRatio || 1;
    zrUtil.each(instances, function (chart, id) {
      if (chart.group === groupId) {
        var canvas = chart.getRenderedCanvas(zrUtil.clone(opts));
        var boundingRect = chart.getDom().getBoundingClientRect();
        left = mathMin(boundingRect.left, left);
        top = mathMin(boundingRect.top, top);
        right = mathMax(boundingRect.right, right);
        bottom = mathMax(boundingRect.bottom, bottom);
        canvasList.push({
          dom: canvas,
          left: boundingRect.left,
          top: boundingRect.top
        });
      }
    });
    left *= dpr;
    top *= dpr;
    right *= dpr;
    bottom *= dpr;
    var width = right - left;
    var height = bottom - top;
    var targetCanvas = zrUtil.createCanvas();
    targetCanvas.width = width;
    targetCanvas.height = height;
    var zr = zrender.init(targetCanvas);
    each(canvasList, function (item) {
      var img = new graphic.Image({
        style: {
          x: item.left * dpr - left,
          y: item.top * dpr - top,
          image: item.dom
        }
      });
      zr.add(img);
    });
    zr.refreshImmediately();
    return targetCanvas.toDataURL('image/' + (opts && opts.type || 'png'));
  } else {
    return this.getDataURL(opts);
  }
};
/**
 * Convert from logical coordinate system to pixel coordinate system.
 * See CoordinateSystem#convertToPixel.
 * @param {string|Object} finder
 *        If string, e.g., 'geo', means {geoIndex: 0}.
 *        If Object, could contain some of these properties below:
 *        {
 *            seriesIndex / seriesId / seriesName,
 *            geoIndex / geoId, geoName,
 *            bmapIndex / bmapId / bmapName,
 *            xAxisIndex / xAxisId / xAxisName,
 *            yAxisIndex / yAxisId / yAxisName,
 *            gridIndex / gridId / gridName,
 *            ... (can be extended)
 *        }
 * @param {Array|number} value
 * @return {Array|number} result
 */


echartsProto.convertToPixel = zrUtil.curry(doConvertPixel, 'convertToPixel');
/**
 * Convert from pixel coordinate system to logical coordinate system.
 * See CoordinateSystem#convertFromPixel.
 * @param {string|Object} finder
 *        If string, e.g., 'geo', means {geoIndex: 0}.
 *        If Object, could contain some of these properties below:
 *        {
 *            seriesIndex / seriesId / seriesName,
 *            geoIndex / geoId / geoName,
 *            bmapIndex / bmapId / bmapName,
 *            xAxisIndex / xAxisId / xAxisName,
 *            yAxisIndex / yAxisId / yAxisName
 *            gridIndex / gridId / gridName,
 *            ... (can be extended)
 *        }
 * @param {Array|number} value
 * @return {Array|number} result
 */

echartsProto.convertFromPixel = zrUtil.curry(doConvertPixel, 'convertFromPixel');

function doConvertPixel(methodName, finder, value) {
  var ecModel = this._model;

  var coordSysList = this._coordSysMgr.getCoordinateSystems();

  var result;
  finder = modelUtil.parseFinder(ecModel, finder);

  for (var i = 0; i < coordSysList.length; i++) {
    var coordSys = coordSysList[i];

    if (coordSys[methodName] && (result = coordSys[methodName](ecModel, finder, value)) != null) {
      return result;
    }
  }
}
/**
 * Is the specified coordinate systems or components contain the given pixel point.
 * @param {string|Object} finder
 *        If string, e.g., 'geo', means {geoIndex: 0}.
 *        If Object, could contain some of these properties below:
 *        {
 *            seriesIndex / seriesId / seriesName,
 *            geoIndex / geoId / geoName,
 *            bmapIndex / bmapId / bmapName,
 *            xAxisIndex / xAxisId / xAxisName,
 *            yAxisIndex / yAxisId / yAxisName,
 *            gridIndex / gridId / gridName,
 *            ... (can be extended)
 *        }
 * @param {Array|number} value
 * @return {boolean} result
 */


echartsProto.containPixel = function (finder, value) {
  var ecModel = this._model;
  var result;
  finder = modelUtil.parseFinder(ecModel, finder);
  zrUtil.each(finder, function (models, key) {
    key.indexOf('Models') >= 0 && zrUtil.each(models, function (model) {
      var coordSys = model.coordinateSystem;

      if (coordSys && coordSys.containPoint) {
        result |= !!coordSys.containPoint(value);
      } else if (key === 'seriesModels') {
        var view = this._chartsMap[model.__viewId];

        if (view && view.containPoint) {
          result |= view.containPoint(value, model);
        } else {}
      } else {}
    }, this);
  }, this);
  return !!result;
};
/**
 * Get visual from series or data.
 * @param {string|Object} finder
 *        If string, e.g., 'series', means {seriesIndex: 0}.
 *        If Object, could contain some of these properties below:
 *        {
 *            seriesIndex / seriesId / seriesName,
 *            dataIndex / dataIndexInside
 *        }
 *        If dataIndex is not specified, series visual will be fetched,
 *        but not data item visual.
 *        If all of seriesIndex, seriesId, seriesName are not specified,
 *        visual will be fetched from first series.
 * @param {string} visualType 'color', 'symbol', 'symbolSize'
 */


echartsProto.getVisual = function (finder, visualType) {
  var ecModel = this._model;
  finder = modelUtil.parseFinder(ecModel, finder, {
    defaultMainType: 'series'
  });
  var seriesModel = finder.seriesModel;
  var data = seriesModel.getData();
  var dataIndexInside = finder.hasOwnProperty('dataIndexInside') ? finder.dataIndexInside : finder.hasOwnProperty('dataIndex') ? data.indexOfRawIndex(finder.dataIndex) : null;
  return dataIndexInside != null ? data.getItemVisual(dataIndexInside, visualType) : data.getVisual(visualType);
};
/**
 * Get view of corresponding component model
 * @param  {module:echarts/model/Component} componentModel
 * @return {module:echarts/view/Component}
 */


echartsProto.getViewOfComponentModel = function (componentModel) {
  return this._componentsMap[componentModel.__viewId];
};
/**
 * Get view of corresponding series model
 * @param  {module:echarts/model/Series} seriesModel
 * @return {module:echarts/view/Chart}
 */


echartsProto.getViewOfSeriesModel = function (seriesModel) {
  return this._chartsMap[seriesModel.__viewId];
};

var updateMethods = {
  /**
   * @param {Object} payload
   * @private
   */
  update: function (payload) {
    // console.profile && console.profile('update');
    var ecModel = this._model;
    var api = this._api;
    var coordSysMgr = this._coordSysMgr;
    var zr = this._zr; // update before setOption

    if (!ecModel) {
      return;
    } // Fixme First time update ?


    ecModel.restoreData(); // TODO
    // Save total ecModel here for undo/redo (after restoring data and before processing data).
    // Undo (restoration of total ecModel) can be carried out in 'action' or outside API call.
    // Create new coordinate system each update
    // In LineView may save the old coordinate system and use it to get the orignal point

    coordSysMgr.create(this._model, this._api);
    processData.call(this, ecModel, api);
    stackSeriesData.call(this, ecModel);
    coordSysMgr.update(ecModel, api);
    doVisualEncoding.call(this, ecModel, payload);
    doRender.call(this, ecModel, payload); // Set background

    var backgroundColor = ecModel.get('backgroundColor') || 'transparent';
    var painter = zr.painter; // TODO all use clearColor ?

    if (painter.isSingleCanvas && painter.isSingleCanvas()) {
      zr.configLayer(0, {
        clearColor: backgroundColor
      });
    } else {
      // In IE8
      if (!env.canvasSupported) {
        var colorArr = colorTool.parse(backgroundColor);
        backgroundColor = colorTool.stringify(colorArr, 'rgb');

        if (colorArr[3] === 0) {
          backgroundColor = 'transparent';
        }
      }

      if (backgroundColor.colorStops || backgroundColor.image) {
        // Gradient background
        // FIXME Fixed layer？
        zr.configLayer(0, {
          clearColor: backgroundColor
        });
        this[HAS_GRADIENT_OR_PATTERN_BG] = true;
        this._dom.style.background = 'transparent';
      } else {
        if (this[HAS_GRADIENT_OR_PATTERN_BG]) {
          zr.configLayer(0, {
            clearColor: null
          });
        }

        this[HAS_GRADIENT_OR_PATTERN_BG] = false;
        this._dom.style.background = backgroundColor;
      }
    }

    each(postUpdateFuncs, function (func) {
      func(ecModel, api);
    }); // console.profile && console.profileEnd('update');
  },

  /**
   * @param {Object} payload
   * @private
   */
  updateView: function (payload) {
    var ecModel = this._model; // update before setOption

    if (!ecModel) {
      return;
    }

    ecModel.eachSeries(function (seriesModel) {
      seriesModel.getData().clearAllVisual();
    });
    doVisualEncoding.call(this, ecModel, payload);
    invokeUpdateMethod.call(this, 'updateView', ecModel, payload);
  },

  /**
   * @param {Object} payload
   * @private
   */
  updateVisual: function (payload) {
    var ecModel = this._model; // update before setOption

    if (!ecModel) {
      return;
    }

    ecModel.eachSeries(function (seriesModel) {
      seriesModel.getData().clearAllVisual();
    });
    doVisualEncoding.call(this, ecModel, payload, true);
    invokeUpdateMethod.call(this, 'updateVisual', ecModel, payload);
  },

  /**
   * @param {Object} payload
   * @private
   */
  updateLayout: function (payload) {
    var ecModel = this._model; // update before setOption

    if (!ecModel) {
      return;
    }

    doLayout.call(this, ecModel, payload);
    invokeUpdateMethod.call(this, 'updateLayout', ecModel, payload);
  },

  /**
   * @param {Object} payload
   * @private
   */
  prepareAndUpdate: function (payload) {
    var ecModel = this._model;
    prepareView.call(this, 'component', ecModel);
    prepareView.call(this, 'chart', ecModel);
    updateMethods.update.call(this, payload);
  }
};
/**
 * @private
 */

function updateDirectly(ecIns, method, payload, mainType, subType) {
  var ecModel = ecIns._model; // broadcast

  if (!mainType) {
    each(ecIns._componentsViews.concat(ecIns._chartsViews), callView);
    return;
  }

  var query = {};
  query[mainType + 'Id'] = payload[mainType + 'Id'];
  query[mainType + 'Index'] = payload[mainType + 'Index'];
  query[mainType + 'Name'] = payload[mainType + 'Name'];
  var condition = {
    mainType: mainType,
    query: query
  };
  subType && (condition.subType = subType); // subType may be '' by parseClassType;
  // If dispatchAction before setOption, do nothing.

  ecModel && ecModel.eachComponent(condition, function (model, index) {
    callView(ecIns[mainType === 'series' ? '_chartsMap' : '_componentsMap'][model.__viewId]);
  }, ecIns);

  function callView(view) {
    view && view.__alive && view[method] && view[method](view.__model, ecModel, ecIns._api, payload);
  }
}
/**
 * Resize the chart
 * @param {Object} opts
 * @param {number} [opts.width] Can be 'auto' (the same as null/undefined)
 * @param {number} [opts.height] Can be 'auto' (the same as null/undefined)
 * @param {boolean} [opts.silent=false]
 */


echartsProto.resize = function (opts) {
  this[IN_MAIN_PROCESS] = true;

  this._zr.resize(opts);

  var optionChanged = this._model && this._model.resetOption('media');

  var updateMethod = optionChanged ? 'prepareAndUpdate' : 'update';
  updateMethods[updateMethod].call(this); // Resize loading effect

  this._loadingFX && this._loadingFX.resize();
  this[IN_MAIN_PROCESS] = false;
  var silent = opts && opts.silent;
  flushPendingActions.call(this, silent);
  triggerUpdatedEvent.call(this, silent);
};
/**
 * Show loading effect
 * @param  {string} [name='default']
 * @param  {Object} [cfg]
 */


echartsProto.showLoading = function (name, cfg) {
  if (zrUtil.isObject(name)) {
    cfg = name;
    name = '';
  }

  name = name || 'default';
  this.hideLoading();

  if (!loadingEffects[name]) {
    return;
  }

  var el = loadingEffects[name](this._api, cfg);
  var zr = this._zr;
  this._loadingFX = el;
  zr.add(el);
};
/**
 * Hide loading effect
 */


echartsProto.hideLoading = function () {
  this._loadingFX && this._zr.remove(this._loadingFX);
  this._loadingFX = null;
};
/**
 * @param {Object} eventObj
 * @return {Object}
 */


echartsProto.makeActionFromEvent = function (eventObj) {
  var payload = zrUtil.extend({}, eventObj);
  payload.type = eventActionMap[eventObj.type];
  return payload;
};
/**
 * @pubilc
 * @param {Object} payload
 * @param {string} [payload.type] Action type
 * @param {Object|boolean} [opt] If pass boolean, means opt.silent
 * @param {boolean} [opt.silent=false] Whether trigger events.
 * @param {boolean} [opt.flush=undefined]
 *                  true: Flush immediately, and then pixel in canvas can be fetched
 *                      immediately. Caution: it might affect performance.
 *                  false: Not not flush.
 *                  undefined: Auto decide whether perform flush.
 */


echartsProto.dispatchAction = function (payload, opt) {
  if (!zrUtil.isObject(opt)) {
    opt = {
      silent: !!opt
    };
  }

  if (!actions[payload.type]) {
    return;
  } // Avoid dispatch action before setOption. Especially in `connect`.


  if (!this._model) {
    return;
  } // May dispatchAction in rendering procedure


  if (this[IN_MAIN_PROCESS]) {
    this._pendingActions.push(payload);

    return;
  }

  doDispatchAction.call(this, payload, opt.silent);

  if (opt.flush) {
    this._zr.flush(true);
  } else if (opt.flush !== false && env.browser.weChat) {
    // In WeChat embeded browser, `requestAnimationFrame` and `setInterval`
    // hang when sliding page (on touch event), which cause that zr does not
    // refresh util user interaction finished, which is not expected.
    // But `dispatchAction` may be called too frequently when pan on touch
    // screen, which impacts performance if do not throttle them.
    this._throttledZrFlush();
  }

  flushPendingActions.call(this, opt.silent);
  triggerUpdatedEvent.call(this, opt.silent);
};

function doDispatchAction(payload, silent) {
  var payloadType = payload.type;
  var escapeConnect = payload.escapeConnect;
  var actionWrap = actions[payloadType];
  var actionInfo = actionWrap.actionInfo;
  var cptType = (actionInfo.update || 'update').split(':');
  var updateMethod = cptType.pop();
  cptType = cptType[0] != null && parseClassType(cptType[0]);
  this[IN_MAIN_PROCESS] = true;
  var payloads = [payload];
  var batched = false; // Batch action

  if (payload.batch) {
    batched = true;
    payloads = zrUtil.map(payload.batch, function (item) {
      item = zrUtil.defaults(zrUtil.extend({}, item), payload);
      item.batch = null;
      return item;
    });
  }

  var eventObjBatch = [];
  var eventObj;
  var isHighDown = payloadType === 'highlight' || payloadType === 'downplay';
  each(payloads, function (batchItem) {
    // Action can specify the event by return it.
    eventObj = actionWrap.action(batchItem, this._model, this._api); // Emit event outside

    eventObj = eventObj || zrUtil.extend({}, batchItem); // Convert type to eventType

    eventObj.type = actionInfo.event || eventObj.type;
    eventObjBatch.push(eventObj); // light update does not perform data process, layout and visual.

    if (isHighDown) {
      // method, payload, mainType, subType
      updateDirectly(this, updateMethod, batchItem, 'series');
    } else if (cptType) {
      updateDirectly(this, updateMethod, batchItem, cptType.main, cptType.sub);
    }
  }, this);

  if (updateMethod !== 'none' && !isHighDown && !cptType) {
    // Still dirty
    if (this[OPTION_UPDATED]) {
      // FIXME Pass payload ?
      updateMethods.prepareAndUpdate.call(this, payload);
      this[OPTION_UPDATED] = false;
    } else {
      updateMethods[updateMethod].call(this, payload);
    }
  } // Follow the rule of action batch


  if (batched) {
    eventObj = {
      type: actionInfo.event || payloadType,
      escapeConnect: escapeConnect,
      batch: eventObjBatch
    };
  } else {
    eventObj = eventObjBatch[0];
  }

  this[IN_MAIN_PROCESS] = false;
  !silent && this._messageCenter.trigger(eventObj.type, eventObj);
}

function flushPendingActions(silent) {
  var pendingActions = this._pendingActions;

  while (pendingActions.length) {
    var payload = pendingActions.shift();
    doDispatchAction.call(this, payload, silent);
  }
}

function triggerUpdatedEvent(silent) {
  !silent && this.trigger('updated');
}
/**
 * Register event
 * @method
 */


echartsProto.on = createRegisterEventWithLowercaseName('on');
echartsProto.off = createRegisterEventWithLowercaseName('off');
echartsProto.one = createRegisterEventWithLowercaseName('one');
/**
 * @param {string} methodName
 * @private
 */

function invokeUpdateMethod(methodName, ecModel, payload) {
  var api = this._api; // Update all components

  each(this._componentsViews, function (component) {
    var componentModel = component.__model;
    component[methodName](componentModel, ecModel, api, payload);
    updateZ(componentModel, component);
  }, this); // Upate all charts

  ecModel.eachSeries(function (seriesModel, idx) {
    var chart = this._chartsMap[seriesModel.__viewId];
    chart[methodName](seriesModel, ecModel, api, payload);
    updateZ(seriesModel, chart);
    updateProgressiveAndBlend(seriesModel, chart);
  }, this); // If use hover layer

  updateHoverLayerStatus(this._zr, ecModel); // Post render

  each(postUpdateFuncs, function (func) {
    func(ecModel, api);
  });
}
/**
 * Prepare view instances of charts and components
 * @param  {module:echarts/model/Global} ecModel
 * @private
 */


function prepareView(type, ecModel) {
  var isComponent = type === 'component';
  var viewList = isComponent ? this._componentsViews : this._chartsViews;
  var viewMap = isComponent ? this._componentsMap : this._chartsMap;
  var zr = this._zr;

  for (var i = 0; i < viewList.length; i++) {
    viewList[i].__alive = false;
  }

  ecModel[isComponent ? 'eachComponent' : 'eachSeries'](function (componentType, model) {
    if (isComponent) {
      if (componentType === 'series') {
        return;
      }
    } else {
      model = componentType;
    } // Consider: id same and type changed.


    var viewId = '_ec_' + model.id + '_' + model.type;
    var view = viewMap[viewId];

    if (!view) {
      var classType = parseClassType(model.type);
      var Clazz = isComponent ? ComponentView.getClass(classType.main, classType.sub) : ChartView.getClass(classType.sub);

      if (Clazz) {
        view = new Clazz();
        view.init(ecModel, this._api);
        viewMap[viewId] = view;
        viewList.push(view);
        zr.add(view.group);
      } else {
        // Error
        return;
      }
    }

    model.__viewId = view.__id = viewId;
    view.__alive = true;
    view.__model = model;
    view.group.__ecComponentInfo = {
      mainType: model.mainType,
      index: model.componentIndex
    };
  }, this);

  for (var i = 0; i < viewList.length;) {
    var view = viewList[i];

    if (!view.__alive) {
      zr.remove(view.group);
      view.dispose(ecModel, this._api);
      viewList.splice(i, 1);
      delete viewMap[view.__id];
      view.__id = view.group.__ecComponentInfo = null;
    } else {
      i++;
    }
  }
}
/**
 * Processor data in each series
 *
 * @param {module:echarts/model/Global} ecModel
 * @private
 */


function processData(ecModel, api) {
  each(dataProcessorFuncs, function (process) {
    process.func(ecModel, api);
  });
}
/**
 * @private
 */


function stackSeriesData(ecModel) {
  var stackedDataMap = {};
  ecModel.eachSeries(function (series) {
    var stack = series.get('stack');
    var data = series.getData();

    if (stack && data.type === 'list') {
      var previousStack = stackedDataMap[stack]; // Avoid conflict with Object.prototype

      if (stackedDataMap.hasOwnProperty(stack) && previousStack) {
        data.stackedOn = previousStack;
      }

      stackedDataMap[stack] = data;
    }
  });
}
/**
 * Layout before each chart render there series, special visual encoding stage
 *
 * @param {module:echarts/model/Global} ecModel
 * @private
 */


function doLayout(ecModel, payload) {
  var api = this._api;
  each(visualFuncs, function (visual) {
    if (visual.isLayout) {
      visual.func(ecModel, api, payload);
    }
  });
}
/**
 * Encode visual infomation from data after data processing
 *
 * @param {module:echarts/model/Global} ecModel
 * @param {object} layout
 * @param {boolean} [excludesLayout]
 * @private
 */


function doVisualEncoding(ecModel, payload, excludesLayout) {
  var api = this._api;
  ecModel.clearColorPalette();
  ecModel.eachSeries(function (seriesModel) {
    seriesModel.clearColorPalette();
  });
  each(visualFuncs, function (visual) {
    (!excludesLayout || !visual.isLayout) && visual.func(ecModel, api, payload);
  });
}
/**
 * Render each chart and component
 * @private
 */


function doRender(ecModel, payload) {
  var api = this._api; // Render all components

  each(this._componentsViews, function (componentView) {
    var componentModel = componentView.__model;
    componentView.render(componentModel, ecModel, api, payload);
    updateZ(componentModel, componentView);
  }, this);
  each(this._chartsViews, function (chart) {
    chart.__alive = false;
  }, this); // Render all charts

  ecModel.eachSeries(function (seriesModel, idx) {
    var chartView = this._chartsMap[seriesModel.__viewId];
    chartView.__alive = true;
    chartView.render(seriesModel, ecModel, api, payload);
    chartView.group.silent = !!seriesModel.get('silent');
    updateZ(seriesModel, chartView);
    updateProgressiveAndBlend(seriesModel, chartView);
  }, this); // If use hover layer

  updateHoverLayerStatus(this._zr, ecModel); // Remove groups of unrendered charts

  each(this._chartsViews, function (chart) {
    if (!chart.__alive) {
      chart.remove(ecModel, api);
    }
  }, this);
}

var MOUSE_EVENT_NAMES = ['click', 'dblclick', 'mouseover', 'mouseout', 'mousemove', 'mousedown', 'mouseup', 'globalout', 'contextmenu'];
/**
 * @private
 */

echartsProto._initEvents = function () {
  each(MOUSE_EVENT_NAMES, function (eveName) {
    this._zr.on(eveName, function (e) {
      var ecModel = this.getModel();
      var el = e.target;
      var params; // no e.target when 'globalout'.

      if (eveName === 'globalout') {
        params = {};
      } else if (el && el.dataIndex != null) {
        var dataModel = el.dataModel || ecModel.getSeriesByIndex(el.seriesIndex);
        params = dataModel && dataModel.getDataParams(el.dataIndex, el.dataType) || {};
      } // If element has custom eventData of components
      else if (el && el.eventData) {
          params = zrUtil.extend({}, el.eventData);
        }

      if (params) {
        params.event = e;
        params.type = eveName;
        this.trigger(eveName, params);
      }
    }, this);
  }, this);
  each(eventActionMap, function (actionType, eventType) {
    this._messageCenter.on(eventType, function (event) {
      this.trigger(eventType, event);
    }, this);
  }, this);
};
/**
 * @return {boolean}
 */


echartsProto.isDisposed = function () {
  return this._disposed;
};
/**
 * Clear
 */


echartsProto.clear = function () {
  this.setOption({
    series: []
  }, true);
};
/**
 * Dispose instance
 */


echartsProto.dispose = function () {
  if (this._disposed) {
    return;
  }

  this._disposed = true;
  var api = this._api;
  var ecModel = this._model;
  each(this._componentsViews, function (component) {
    component.dispose(ecModel, api);
  });
  each(this._chartsViews, function (chart) {
    chart.dispose(ecModel, api);
  }); // Dispose after all views disposed

  this._zr.dispose();

  delete instances[this.id];
};

zrUtil.mixin(ECharts, Eventful);

function updateHoverLayerStatus(zr, ecModel) {
  var storage = zr.storage;
  var elCount = 0;
  storage.traverse(function (el) {
    if (!el.isGroup) {
      elCount++;
    }
  });

  if (elCount > ecModel.get('hoverLayerThreshold') && !env.node) {
    storage.traverse(function (el) {
      if (!el.isGroup) {
        el.useHoverLayer = true;
      }
    });
  }
}
/**
 * Update chart progressive and blend.
 * @param {module:echarts/model/Series|module:echarts/model/Component} model
 * @param {module:echarts/view/Component|module:echarts/view/Chart} view
 */


function updateProgressiveAndBlend(seriesModel, chartView) {
  // Progressive configuration
  var elCount = 0;
  chartView.group.traverse(function (el) {
    if (el.type !== 'group' && !el.ignore) {
      elCount++;
    }
  });
  var frameDrawNum = +seriesModel.get('progressive');
  var needProgressive = elCount > seriesModel.get('progressiveThreshold') && frameDrawNum && !env.node;

  if (needProgressive) {
    chartView.group.traverse(function (el) {
      // FIXME marker and other components
      if (!el.isGroup) {
        el.progressive = needProgressive ? Math.floor(elCount++ / frameDrawNum) : -1;

        if (needProgressive) {
          el.stopAnimation(true);
        }
      }
    });
  } // Blend configration


  var blendMode = seriesModel.get('blendMode') || null;
  chartView.group.traverse(function (el) {
    // FIXME marker and other components
    if (!el.isGroup) {
      el.setStyle('blend', blendMode);
    }
  });
}
/**
 * @param {module:echarts/model/Series|module:echarts/model/Component} model
 * @param {module:echarts/view/Component|module:echarts/view/Chart} view
 */


function updateZ(model, view) {
  var z = model.get('z');
  var zlevel = model.get('zlevel'); // Set z and zlevel

  view.group.traverse(function (el) {
    if (el.type !== 'group') {
      z != null && (el.z = z);
      zlevel != null && (el.zlevel = zlevel);
    }
  });
}

function createExtensionAPI(ecInstance) {
  var coordSysMgr = ecInstance._coordSysMgr;
  return zrUtil.extend(new ExtensionAPI(ecInstance), {
    // Inject methods
    getCoordinateSystems: zrUtil.bind(coordSysMgr.getCoordinateSystems, coordSysMgr),
    getComponentByElement: function (el) {
      while (el) {
        var modelInfo = el.__ecComponentInfo;

        if (modelInfo != null) {
          return ecInstance._model.getComponent(modelInfo.mainType, modelInfo.index);
        }

        el = el.parent;
      }
    }
  });
}
/**
 * @type {Object} key: actionType.
 * @inner
 */


var actions = {};
/**
 * Map eventType to actionType
 * @type {Object}
 */

var eventActionMap = {};
/**
 * Data processor functions of each stage
 * @type {Array.<Object.<string, Function>>}
 * @inner
 */

var dataProcessorFuncs = [];
/**
 * @type {Array.<Function>}
 * @inner
 */

var optionPreprocessorFuncs = [];
/**
 * @type {Array.<Function>}
 * @inner
 */

var postUpdateFuncs = [];
/**
 * Visual encoding functions of each stage
 * @type {Array.<Object.<string, Function>>}
 * @inner
 */

var visualFuncs = [];
/**
 * Theme storage
 * @type {Object.<key, Object>}
 */

var themeStorage = {};
/**
 * Loading effects
 */

var loadingEffects = {};
var instances = {};
var connectedGroups = {};
var idBase = new Date() - 0;
var groupIdBase = new Date() - 0;
var DOM_ATTRIBUTE_KEY = '_echarts_instance_';
var mapDataStores = {};

function enableConnect(chart) {
  var STATUS_PENDING = 0;
  var STATUS_UPDATING = 1;
  var STATUS_UPDATED = 2;
  var STATUS_KEY = '__connectUpdateStatus';

  function updateConnectedChartsStatus(charts, status) {
    for (var i = 0; i < charts.length; i++) {
      var otherChart = charts[i];
      otherChart[STATUS_KEY] = status;
    }
  }

  zrUtil.each(eventActionMap, function (actionType, eventType) {
    chart._messageCenter.on(eventType, function (event) {
      if (connectedGroups[chart.group] && chart[STATUS_KEY] !== STATUS_PENDING) {
        if (event && event.escapeConnect) {
          return;
        }

        var action = chart.makeActionFromEvent(event);
        var otherCharts = [];
        zrUtil.each(instances, function (otherChart) {
          if (otherChart !== chart && otherChart.group === chart.group) {
            otherCharts.push(otherChart);
          }
        });
        updateConnectedChartsStatus(otherCharts, STATUS_PENDING);
        each(otherCharts, function (otherChart) {
          if (otherChart[STATUS_KEY] !== STATUS_UPDATING) {
            otherChart.dispatchAction(action);
          }
        });
        updateConnectedChartsStatus(otherCharts, STATUS_UPDATED);
      }
    });
  });
}
/**
 * @param {HTMLElement} dom
 * @param {Object} [theme]
 * @param {Object} opts
 * @param {number} [opts.devicePixelRatio] Use window.devicePixelRatio by default
 * @param {string} [opts.renderer] Currently only 'canvas' is supported.
 * @param {number} [opts.width] Use clientWidth of the input `dom` by default.
 *                              Can be 'auto' (the same as null/undefined)
 * @param {number} [opts.height] Use clientHeight of the input `dom` by default.
 *                               Can be 'auto' (the same as null/undefined)
 */


function init(dom, theme, opts) {
  var existInstance = getInstanceByDom(dom);

  if (existInstance) {
    return existInstance;
  }

  var chart = new ECharts(dom, theme, opts);
  chart.id = 'ec_' + idBase++;
  instances[chart.id] = chart;

  if (dom.setAttribute) {
    dom.setAttribute(DOM_ATTRIBUTE_KEY, chart.id);
  } else {
    dom[DOM_ATTRIBUTE_KEY] = chart.id;
  }

  enableConnect(chart);
  return chart;
}
/**
 * @return {string|Array.<module:echarts~ECharts>} groupId
 */


function connect(groupId) {
  // Is array of charts
  if (zrUtil.isArray(groupId)) {
    var charts = groupId;
    groupId = null; // If any chart has group

    zrUtil.each(charts, function (chart) {
      if (chart.group != null) {
        groupId = chart.group;
      }
    });
    groupId = groupId || 'g_' + groupIdBase++;
    zrUtil.each(charts, function (chart) {
      chart.group = groupId;
    });
  }

  connectedGroups[groupId] = true;
  return groupId;
}
/**
 * @DEPRECATED
 * @return {string} groupId
 */


function disConnect(groupId) {
  connectedGroups[groupId] = false;
}
/**
 * @return {string} groupId
 */


var disconnect = disConnect;
/**
 * Dispose a chart instance
 * @param  {module:echarts~ECharts|HTMLDomElement|string} chart
 */

function dispose(chart) {
  if (typeof chart === 'string') {
    chart = instances[chart];
  } else if (!(chart instanceof ECharts)) {
    // Try to treat as dom
    chart = getInstanceByDom(chart);
  }

  if (chart instanceof ECharts && !chart.isDisposed()) {
    chart.dispose();
  }
}
/**
 * @param  {HTMLElement} dom
 * @return {echarts~ECharts}
 */


function getInstanceByDom(dom) {
  var key;

  if (dom.getAttribute) {
    key = dom.getAttribute(DOM_ATTRIBUTE_KEY);
  } else {
    key = dom[DOM_ATTRIBUTE_KEY];
  }

  return instances[key];
}
/**
 * @param {string} key
 * @return {echarts~ECharts}
 */


function getInstanceById(key) {
  return instances[key];
}
/**
 * Register theme
 */


function registerTheme(name, theme) {
  themeStorage[name] = theme;
}
/**
 * Register option preprocessor
 * @param {Function} preprocessorFunc
 */


function registerPreprocessor(preprocessorFunc) {
  optionPreprocessorFuncs.push(preprocessorFunc);
}
/**
 * @param {number} [priority=1000]
 * @param {Function} processorFunc
 */


function registerProcessor(priority, processorFunc) {
  if (typeof priority === 'function') {
    processorFunc = priority;
    priority = PRIORITY_PROCESSOR_FILTER;
  }

  dataProcessorFuncs.push({
    prio: priority,
    func: processorFunc
  });
}
/**
 * Register postUpdater
 * @param {Function} postUpdateFunc
 */


function registerPostUpdate(postUpdateFunc) {
  postUpdateFuncs.push(postUpdateFunc);
}
/**
 * Usage:
 * registerAction('someAction', 'someEvent', function () { ... });
 * registerAction('someAction', function () { ... });
 * registerAction(
 *     {type: 'someAction', event: 'someEvent', update: 'updateView'},
 *     function () { ... }
 * );
 *
 * @param {(string|Object)} actionInfo
 * @param {string} actionInfo.type
 * @param {string} [actionInfo.event]
 * @param {string} [actionInfo.update]
 * @param {string} [eventName]
 * @param {Function} action
 */


function registerAction(actionInfo, eventName, action) {
  if (typeof eventName === 'function') {
    action = eventName;
    eventName = '';
  }

  var actionType = zrUtil.isObject(actionInfo) ? actionInfo.type : [actionInfo, actionInfo = {
    event: eventName
  }][0]; // Event name is all lowercase

  actionInfo.event = (actionInfo.event || actionType).toLowerCase();
  eventName = actionInfo.event; // Validate action type and event name.

  zrUtil.assert(ACTION_REG.test(actionType) && ACTION_REG.test(eventName));

  if (!actions[actionType]) {
    actions[actionType] = {
      action: action,
      actionInfo: actionInfo
    };
  }

  eventActionMap[eventName] = actionType;
}
/**
 * @param {string} type
 * @param {*} CoordinateSystem
 */


function registerCoordinateSystem(type, CoordinateSystem) {
  CoordinateSystemManager.register(type, CoordinateSystem);
}
/**
 * Get dimensions of specified coordinate system.
 * @param {string} type
 * @return {Array.<string|Object>}
 */


function getCoordinateSystemDimensions(type) {
  var coordSysCreator = CoordinateSystemManager.get(type);

  if (coordSysCreator) {
    return coordSysCreator.getDimensionsInfo ? coordSysCreator.getDimensionsInfo() : coordSysCreator.dimensions.slice();
  }
}
/**
 * Layout is a special stage of visual encoding
 * Most visual encoding like color are common for different chart
 * But each chart has it's own layout algorithm
 *
 * @param {number} [priority=1000]
 * @param {Function} layoutFunc
 */


function registerLayout(priority, layoutFunc) {
  if (typeof priority === 'function') {
    layoutFunc = priority;
    priority = PRIORITY_VISUAL_LAYOUT;
  }

  visualFuncs.push({
    prio: priority,
    func: layoutFunc,
    isLayout: true
  });
}
/**
 * @param {number} [priority=3000]
 * @param {Function} visualFunc
 */


function registerVisual(priority, visualFunc) {
  if (typeof priority === 'function') {
    visualFunc = priority;
    priority = PRIORITY_VISUAL_CHART;
  }

  visualFuncs.push({
    prio: priority,
    func: visualFunc
  });
}
/**
 * @param {string} name
 */


function registerLoading(name, loadingFx) {
  loadingEffects[name] = loadingFx;
}
/**
 * @param {Object} opts
 * @param {string} [superClass]
 */


function extendComponentModel(opts
/*, superClass*/
) {
  // var Clazz = ComponentModel;
  // if (superClass) {
  //     var classType = parseClassType(superClass);
  //     Clazz = ComponentModel.getClass(classType.main, classType.sub, true);
  // }
  return ComponentModel.extend(opts);
}
/**
 * @param {Object} opts
 * @param {string} [superClass]
 */


function extendComponentView(opts
/*, superClass*/
) {
  // var Clazz = ComponentView;
  // if (superClass) {
  //     var classType = parseClassType(superClass);
  //     Clazz = ComponentView.getClass(classType.main, classType.sub, true);
  // }
  return ComponentView.extend(opts);
}
/**
 * @param {Object} opts
 * @param {string} [superClass]
 */


function extendSeriesModel(opts
/*, superClass*/
) {
  // var Clazz = SeriesModel;
  // if (superClass) {
  //     superClass = 'series.' + superClass.replace('series.', '');
  //     var classType = parseClassType(superClass);
  //     Clazz = ComponentModel.getClass(classType.main, classType.sub, true);
  // }
  return SeriesModel.extend(opts);
}
/**
 * @param {Object} opts
 * @param {string} [superClass]
 */


function extendChartView(opts
/*, superClass*/
) {
  // var Clazz = ChartView;
  // if (superClass) {
  //     superClass = superClass.replace('series.', '');
  //     var classType = parseClassType(superClass);
  //     Clazz = ChartView.getClass(classType.main, true);
  // }
  return ChartView.extend(opts);
}
/**
 * ZRender need a canvas context to do measureText.
 * But in node environment canvas may be created by node-canvas.
 * So we need to specify how to create a canvas instead of using document.createElement('canvas')
 *
 * Be careful of using it in the browser.
 *
 * @param {Function} creator
 * @example
 *     var Canvas = require('canvas');
 *     var echarts = require('echarts');
 *     echarts.setCanvasCreator(function () {
 *         // Small size is enough.
 *         return new Canvas(32, 32);
 *     });
 */


function setCanvasCreator(creator) {
  zrUtil.$override('createCanvas', creator);
}
/**
 * @param {string} mapName
 * @param {Object|string} geoJson
 * @param {Object} [specialAreas]
 *
 * @example
 *     $.get('USA.json', function (geoJson) {
 *         echarts.registerMap('USA', geoJson);
 *         // Or
 *         echarts.registerMap('USA', {
 *             geoJson: geoJson,
 *             specialAreas: {}
 *         })
 *     });
 */


function registerMap(mapName, geoJson, specialAreas) {
  if (geoJson.geoJson && !geoJson.features) {
    specialAreas = geoJson.specialAreas;
    geoJson = geoJson.geoJson;
  }

  if (typeof geoJson === 'string') {
    geoJson = typeof JSON !== 'undefined' && JSON.parse ? JSON.parse(geoJson) : new Function('return (' + geoJson + ');')();
  }

  mapDataStores[mapName] = {
    geoJson: geoJson,
    specialAreas: specialAreas
  };
}
/**
 * @param {string} mapName
 * @return {Object}
 */


function getMap(mapName) {
  return mapDataStores[mapName];
}

registerVisual(PRIORITY_VISUAL_GLOBAL, seriesColor);
registerPreprocessor(backwardCompat);
registerLoading('default', loadingDefault); // Default actions

registerAction({
  type: 'highlight',
  event: 'highlight',
  update: 'highlight'
}, zrUtil.noop);
registerAction({
  type: 'downplay',
  event: 'downplay',
  update: 'downplay'
}, zrUtil.noop); // For backward compatibility, where the namespace `dataTool` will
// be mounted on `echarts` is the extension `dataTool` is imported.

var dataTool = {};
exports.version = version;
exports.dependencies = dependencies;
exports.PRIORITY = PRIORITY;
exports.init = init;
exports.connect = connect;
exports.disConnect = disConnect;
exports.disconnect = disconnect;
exports.dispose = dispose;
exports.getInstanceByDom = getInstanceByDom;
exports.getInstanceById = getInstanceById;
exports.registerTheme = registerTheme;
exports.registerPreprocessor = registerPreprocessor;
exports.registerProcessor = registerProcessor;
exports.registerPostUpdate = registerPostUpdate;
exports.registerAction = registerAction;
exports.registerCoordinateSystem = registerCoordinateSystem;
exports.getCoordinateSystemDimensions = getCoordinateSystemDimensions;
exports.registerLayout = registerLayout;
exports.registerVisual = registerVisual;
exports.registerLoading = registerLoading;
exports.extendComponentModel = extendComponentModel;
exports.extendComponentView = extendComponentView;
exports.extendSeriesModel = extendSeriesModel;
exports.extendChartView = extendChartView;
exports.setCanvasCreator = setCanvasCreator;
exports.registerMap = registerMap;
exports.getMap = getMap;
exports.dataTool = dataTool;
var ___ec_export = __webpack_require__(289);
(function () {
    for (var key in ___ec_export) {
        if (___ec_export.hasOwnProperty(key)) {
            exports[key] = ___ec_export[key];
        }
    }
})();

/***/ }),
/* 199 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "J", function() { return login; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "H", function() { return signup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "I", function() { return forgetpasswd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return refresh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getUserInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return changePassword; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getJobInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "E", function() { return getAllStoreSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "F", function() { return getAllRecoverySize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "G", function() { return getAllRemoteRecoverySize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "B", function() { return getStoreSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "C", function() { return getRecoverySize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "D", function() { return getRemoteRecoverySize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return assignPolicy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return getPolicyName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return getPolicyCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return getPolicies; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return addPolicy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return deletePolicy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getVMName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return getVMSess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return getVMInstallKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return getVMCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return getVMs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return addVM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return recoveryVM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return deleteVM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return getUndepolyVMs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return getUndepolyVMCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "z", function() { return addUndepolyVM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return deleteUndepolyVM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return bindVM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getInstantVMCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return getInstantVMs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return addInstantVM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return deleteInstantVM; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_fetch__ = __webpack_require__(204);


var login = function login(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/admin/login', data, 'POST');
};

var signup = function signup(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/admin/signup', data, 'POST');
};

var forgetpasswd = function forgetpasswd(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/admin/forgetpasswd', data, 'POST');
};

var refresh = function refresh() {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/admin/refresh_token');
};

var getUserInfo = function getUserInfo() {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/admin/info');
};

var changePassword = function changePassword(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/admin/change_password', data, 'POST');
};

var getJobInfo = function getJobInfo(date) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/statis/jobinfo', { query_time: date }, 'POST');
};

var getAllStoreSize = function getAllStoreSize() {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/statis/all_store_size');
};

var getAllRecoverySize = function getAllRecoverySize() {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/statis/all_rc_size');
};

var getAllRemoteRecoverySize = function getAllRemoteRecoverySize() {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/statis/all_remoterc_size');
};

var getStoreSize = function getStoreSize(date) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/statis/store_size', { query_time: date }, 'POST');
};

var getRecoverySize = function getRecoverySize(date) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/statis/rc_size', { query_time: date }, 'POST');
};

var getRemoteRecoverySize = function getRemoteRecoverySize(date) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/statis/remoterc_size', { query_time: date }, 'POST');
};

var assignPolicy = function assignPolicy(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/policy/assign', data, 'POST');
};

var getPolicyName = function getPolicyName() {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/policy/getname');
};

var getPolicyCount = function getPolicyCount() {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/policy/count');
};

var getPolicies = function getPolicies(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/policy', data);
};

var addPolicy = function addPolicy(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/policy/add', data, 'POST');
};

var deletePolicy = function deletePolicy(restaurant_id) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/policy/' + restaurant_id, {}, 'DELETE');
};

var getVMName = function getVMName() {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/vm/getname');
};

var getVMSess = function getVMSess(vm_id) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/vm/sess/' + vm_id);
};

var getVMInstallKey = function getVMInstallKey(vm_id) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/vm/installkey/' + vm_id);
};

var getVMCount = function getVMCount() {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/vm/count');
};

var getVMs = function getVMs(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/vm', data);
};

var addVM = function addVM(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/vm/add', data, 'POST');
};

var recoveryVM = function recoveryVM(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/vm/recovery', data, 'POST');
};

var deleteVM = function deleteVM(food_id) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/vm/' + food_id, {}, 'DELETE');
};

var getUndepolyVMs = function getUndepolyVMs(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/undepolyvm', data);
};

var getUndepolyVMCount = function getUndepolyVMCount() {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/undepolyvm/count');
};

var addUndepolyVM = function addUndepolyVM(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/undepolyvm/add', data, 'POST');
};

var deleteUndepolyVM = function deleteUndepolyVM(food_id) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/undepolyvm/' + food_id, {}, 'DELETE');
};

var bindVM = function bindVM(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/instantvm/bindvm', data, 'POST');
};

var getInstantVMCount = function getInstantVMCount() {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/instantvm/count');
};

var getInstantVMs = function getInstantVMs(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/instantvm', data);
};

var addInstantVM = function addInstantVM(data) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/instantvm/add', data, 'POST');
};

var deleteInstantVM = function deleteInstantVM(food_id) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__config_fetch__["a" /* default */])('/instantvm/' + food_id, {}, 'DELETE');
};

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var pathTool = __webpack_require__(340);

var colorTool = __webpack_require__(231);

var matrix = __webpack_require__(228);

var vector = __webpack_require__(203);

var Path = __webpack_require__(212);

var Transformable = __webpack_require__(271);

var Image = __webpack_require__(265);

exports.Image = Image;

var Group = __webpack_require__(234);

exports.Group = Group;

var Text = __webpack_require__(325);

exports.Text = Text;

var Circle = __webpack_require__(331);

exports.Circle = Circle;

var Sector = __webpack_require__(337);

exports.Sector = Sector;

var Ring = __webpack_require__(336);

exports.Ring = Ring;

var Polygon = __webpack_require__(333);

exports.Polygon = Polygon;

var Polyline = __webpack_require__(334);

exports.Polyline = Polyline;

var Rect = __webpack_require__(335);

exports.Rect = Rect;

var Line = __webpack_require__(332);

exports.Line = Line;

var BezierCurve = __webpack_require__(330);

exports.BezierCurve = BezierCurve;

var Arc = __webpack_require__(329);

exports.Arc = Arc;

var CompoundPath = __webpack_require__(322);

exports.CompoundPath = CompoundPath;

var LinearGradient = __webpack_require__(323);

exports.LinearGradient = LinearGradient;

var RadialGradient = __webpack_require__(324);

exports.RadialGradient = RadialGradient;

var BoundingRect = __webpack_require__(214);

exports.BoundingRect = BoundingRect;
var round = Math.round;
var mathMax = Math.max;
var mathMin = Math.min;
var EMPTY_OBJ = {};
/**
 * Extend shape with parameters
 */

function extendShape(opts) {
  return Path.extend(opts);
}
/**
 * Extend path
 */


function extendPath(pathData, opts) {
  return pathTool.extendFromString(pathData, opts);
}
/**
 * Create a path element from path data string
 * @param {string} pathData
 * @param {Object} opts
 * @param {module:zrender/core/BoundingRect} rect
 * @param {string} [layout=cover] 'center' or 'cover'
 */


function makePath(pathData, opts, rect, layout) {
  var path = pathTool.createFromString(pathData, opts);
  var boundingRect = path.getBoundingRect();

  if (rect) {
    if (layout === 'center') {
      rect = centerGraphic(rect, boundingRect);
    }

    resizePath(path, rect);
  }

  return path;
}
/**
 * Create a image element from image url
 * @param {string} imageUrl image url
 * @param {Object} opts options
 * @param {module:zrender/core/BoundingRect} rect constrain rect
 * @param {string} [layout=cover] 'center' or 'cover'
 */


function makeImage(imageUrl, rect, layout) {
  var path = new Image({
    style: {
      image: imageUrl,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    },
    onload: function (img) {
      if (layout === 'center') {
        var boundingRect = {
          width: img.width,
          height: img.height
        };
        path.setStyle(centerGraphic(rect, boundingRect));
      }
    }
  });
  return path;
}
/**
 * Get position of centered element in bounding box.
 *
 * @param  {Object} rect         element local bounding box
 * @param  {Object} boundingRect constraint bounding box
 * @return {Object} element position containing x, y, width, and height
 */


function centerGraphic(rect, boundingRect) {
  // Set rect to center, keep width / height ratio.
  var aspect = boundingRect.width / boundingRect.height;
  var width = rect.height * aspect;
  var height;

  if (width <= rect.width) {
    height = rect.height;
  } else {
    width = rect.width;
    height = width / aspect;
  }

  var cx = rect.x + rect.width / 2;
  var cy = rect.y + rect.height / 2;
  return {
    x: cx - width / 2,
    y: cy - height / 2,
    width: width,
    height: height
  };
}

var mergePath = pathTool.mergePath;
/**
 * Resize a path to fit the rect
 * @param {module:zrender/graphic/Path} path
 * @param {Object} rect
 */

function resizePath(path, rect) {
  if (!path.applyTransform) {
    return;
  }

  var pathRect = path.getBoundingRect();
  var m = pathRect.calculateTransform(rect);
  path.applyTransform(m);
}
/**
 * Sub pixel optimize line for canvas
 *
 * @param {Object} param
 * @param {Object} [param.shape]
 * @param {number} [param.shape.x1]
 * @param {number} [param.shape.y1]
 * @param {number} [param.shape.x2]
 * @param {number} [param.shape.y2]
 * @param {Object} [param.style]
 * @param {number} [param.style.lineWidth]
 * @return {Object} Modified param
 */


function subPixelOptimizeLine(param) {
  var shape = param.shape;
  var lineWidth = param.style.lineWidth;

  if (round(shape.x1 * 2) === round(shape.x2 * 2)) {
    shape.x1 = shape.x2 = subPixelOptimize(shape.x1, lineWidth, true);
  }

  if (round(shape.y1 * 2) === round(shape.y2 * 2)) {
    shape.y1 = shape.y2 = subPixelOptimize(shape.y1, lineWidth, true);
  }

  return param;
}
/**
 * Sub pixel optimize rect for canvas
 *
 * @param {Object} param
 * @param {Object} [param.shape]
 * @param {number} [param.shape.x]
 * @param {number} [param.shape.y]
 * @param {number} [param.shape.width]
 * @param {number} [param.shape.height]
 * @param {Object} [param.style]
 * @param {number} [param.style.lineWidth]
 * @return {Object} Modified param
 */


function subPixelOptimizeRect(param) {
  var shape = param.shape;
  var lineWidth = param.style.lineWidth;
  var originX = shape.x;
  var originY = shape.y;
  var originWidth = shape.width;
  var originHeight = shape.height;
  shape.x = subPixelOptimize(shape.x, lineWidth, true);
  shape.y = subPixelOptimize(shape.y, lineWidth, true);
  shape.width = Math.max(subPixelOptimize(originX + originWidth, lineWidth, false) - shape.x, originWidth === 0 ? 0 : 1);
  shape.height = Math.max(subPixelOptimize(originY + originHeight, lineWidth, false) - shape.y, originHeight === 0 ? 0 : 1);
  return param;
}
/**
 * Sub pixel optimize for canvas
 *
 * @param {number} position Coordinate, such as x, y
 * @param {number} lineWidth Should be nonnegative integer.
 * @param {boolean=} positiveOrNegative Default false (negative).
 * @return {number} Optimized position.
 */


function subPixelOptimize(position, lineWidth, positiveOrNegative) {
  // Assure that (position + lineWidth / 2) is near integer edge,
  // otherwise line will be fuzzy in canvas.
  var doubledPosition = round(position * 2);
  return (doubledPosition + round(lineWidth)) % 2 === 0 ? doubledPosition / 2 : (doubledPosition + (positiveOrNegative ? 1 : -1)) / 2;
}

function hasFillOrStroke(fillOrStroke) {
  return fillOrStroke != null && fillOrStroke != 'none';
}

function liftColor(color) {
  return typeof color === 'string' ? colorTool.lift(color, -0.1) : color;
}
/**
 * @private
 */


function cacheElementStl(el) {
  if (el.__hoverStlDirty) {
    var stroke = el.style.stroke;
    var fill = el.style.fill; // Create hoverStyle on mouseover

    var hoverStyle = el.__hoverStl;
    hoverStyle.fill = hoverStyle.fill || (hasFillOrStroke(fill) ? liftColor(fill) : null);
    hoverStyle.stroke = hoverStyle.stroke || (hasFillOrStroke(stroke) ? liftColor(stroke) : null);
    var normalStyle = {};

    for (var name in hoverStyle) {
      // See comment in `doSingleEnterHover`.
      if (hoverStyle[name] != null) {
        normalStyle[name] = el.style[name];
      }
    }

    el.__normalStl = normalStyle;
    el.__hoverStlDirty = false;
  }
}
/**
 * @private
 */


function doSingleEnterHover(el) {
  if (el.__isHover) {
    return;
  }

  cacheElementStl(el);

  if (el.useHoverLayer) {
    el.__zr && el.__zr.addHover(el, el.__hoverStl);
  } else {
    var style = el.style;
    var insideRollbackOpt = style.insideRollbackOpt; // Consider case: only `position: 'top'` is set on emphasis, then text
    // color should be returned to `autoColor`, rather than remain '#fff'.
    // So we should rollback then apply again after style merging.

    insideRollbackOpt && rollbackInsideStyle(style); // styles can be:
    // {
    //     label: {
    //         normal: {
    //             show: false,
    //             position: 'outside',
    //             fontSize: 18
    //         },
    //         emphasis: {
    //             show: true
    //         }
    //     }
    // },
    // where properties of `emphasis` may not appear in `normal`. We previously use
    // module:echarts/util/model#defaultEmphasis to merge `normal` to `emphasis`.
    // But consider rich text and setOption in merge mode, it is impossible to cover
    // all properties in merge. So we use merge mode when setting style here, where
    // only properties that is not `null/undefined` can be set. The disadventage:
    // null/undefined can not be used to remove style any more in `emphasis`.

    style.extendFrom(el.__hoverStl); // Do not save `insideRollback`.

    if (insideRollbackOpt) {
      applyInsideStyle(style, style.insideOriginalTextPosition, insideRollbackOpt); // textFill may be rollbacked to null.

      if (style.textFill == null) {
        style.textFill = insideRollbackOpt.autoColor;
      }
    }

    el.dirty(false);
    el.z2 += 1;
  }

  el.__isHover = true;
}
/**
 * @inner
 */


function doSingleLeaveHover(el) {
  if (!el.__isHover) {
    return;
  }

  var normalStl = el.__normalStl;

  if (el.useHoverLayer) {
    el.__zr && el.__zr.removeHover(el);
  } else {
    // Consider null/undefined value, should use
    // `setStyle` but not `extendFrom(stl, true)`.
    normalStl && el.setStyle(normalStl);
    el.z2 -= 1;
  }

  el.__isHover = false;
}
/**
 * @inner
 */


function doEnterHover(el) {
  el.type === 'group' ? el.traverse(function (child) {
    if (child.type !== 'group') {
      doSingleEnterHover(child);
    }
  }) : doSingleEnterHover(el);
}

function doLeaveHover(el) {
  el.type === 'group' ? el.traverse(function (child) {
    if (child.type !== 'group') {
      doSingleLeaveHover(child);
    }
  }) : doSingleLeaveHover(el);
}
/**
 * @inner
 */


function setElementHoverStl(el, hoverStl) {
  // If element has sepcified hoverStyle, then use it instead of given hoverStyle
  // Often used when item group has a label element and it's hoverStyle is different
  el.__hoverStl = el.hoverStyle || hoverStl || {};
  el.__hoverStlDirty = true;

  if (el.__isHover) {
    cacheElementStl(el);
  }
}
/**
 * @inner
 */


function onElementMouseOver(e) {
  if (this.__hoverSilentOnTouch && e.zrByTouch) {
    return;
  } // Only if element is not in emphasis status


  !this.__isEmphasis && doEnterHover(this);
}
/**
 * @inner
 */


function onElementMouseOut(e) {
  if (this.__hoverSilentOnTouch && e.zrByTouch) {
    return;
  } // Only if element is not in emphasis status


  !this.__isEmphasis && doLeaveHover(this);
}
/**
 * @inner
 */


function enterEmphasis() {
  this.__isEmphasis = true;
  doEnterHover(this);
}
/**
 * @inner
 */


function leaveEmphasis() {
  this.__isEmphasis = false;
  doLeaveHover(this);
}
/**
 * Set hover style of element.
 * This method can be called repeatly without side-effects.
 * @param {module:zrender/Element} el
 * @param {Object} [hoverStyle]
 * @param {Object} [opt]
 * @param {boolean} [opt.hoverSilentOnTouch=false]
 *        In touch device, mouseover event will be trigger on touchstart event
 *        (see module:zrender/dom/HandlerProxy). By this mechanism, we can
 *        conviniently use hoverStyle when tap on touch screen without additional
 *        code for compatibility.
 *        But if the chart/component has select feature, which usually also use
 *        hoverStyle, there might be conflict between 'select-highlight' and
 *        'hover-highlight' especially when roam is enabled (see geo for example).
 *        In this case, hoverSilentOnTouch should be used to disable hover-highlight
 *        on touch device.
 */


function setHoverStyle(el, hoverStyle, opt) {
  el.__hoverSilentOnTouch = opt && opt.hoverSilentOnTouch;
  el.type === 'group' ? el.traverse(function (child) {
    if (child.type !== 'group') {
      setElementHoverStl(child, hoverStyle);
    }
  }) : setElementHoverStl(el, hoverStyle); // Duplicated function will be auto-ignored, see Eventful.js.

  el.on('mouseover', onElementMouseOver).on('mouseout', onElementMouseOut); // Emphasis, normal can be triggered manually

  el.on('emphasis', enterEmphasis).on('normal', leaveEmphasis);
}
/**
 * @param {Object|module:zrender/graphic/Style} normalStyle
 * @param {Object} emphasisStyle
 * @param {module:echarts/model/Model} normalModel
 * @param {module:echarts/model/Model} emphasisModel
 * @param {Object} opt Check `opt` of `setTextStyleCommon` to find other props.
 * @param {Object} [opt.defaultText]
 * @param {module:echarts/model/Model} [opt.labelFetcher] Fetch text by
 *      `opt.labelFetcher.getFormattedLabel(opt.labelDataIndex, 'normal'/'emphasis', null, opt.labelDimIndex)`
 * @param {module:echarts/model/Model} [opt.labelDataIndex] Fetch text by
 *      `opt.textFetcher.getFormattedLabel(opt.labelDataIndex, 'normal'/'emphasis', null, opt.labelDimIndex)`
 * @param {module:echarts/model/Model} [opt.labelDimIndex] Fetch text by
 *      `opt.textFetcher.getFormattedLabel(opt.labelDataIndex, 'normal'/'emphasis', null, opt.labelDimIndex)`
 * @param {Object} [normalSpecified]
 * @param {Object} [emphasisSpecified]
 */


function setLabelStyle(normalStyle, emphasisStyle, normalModel, emphasisModel, opt, normalSpecified, emphasisSpecified) {
  opt = opt || EMPTY_OBJ;
  var labelFetcher = opt.labelFetcher;
  var labelDataIndex = opt.labelDataIndex;
  var labelDimIndex = opt.labelDimIndex; // This scenario, `label.normal.show = true; label.emphasis.show = false`,
  // is not supported util someone requests.

  var showNormal = normalModel.getShallow('show');
  var showEmphasis = emphasisModel.getShallow('show'); // Consider performance, only fetch label when necessary.
  // If `normal.show` is `false` and `emphasis.show` is `true` and `emphasis.formatter` is not set,
  // label should be displayed, where text is fetched by `normal.formatter` or `opt.defaultText`.

  var baseText = showNormal || showEmphasis ? zrUtil.retrieve2(labelFetcher ? labelFetcher.getFormattedLabel(labelDataIndex, 'normal', null, labelDimIndex) : null, opt.defaultText) : null;
  var normalStyleText = showNormal ? baseText : null;
  var emphasisStyleText = showEmphasis ? zrUtil.retrieve2(labelFetcher ? labelFetcher.getFormattedLabel(labelDataIndex, 'emphasis', null, labelDimIndex) : null, baseText) : null; // Optimize: If style.text is null, text will not be drawn.

  if (normalStyleText != null || emphasisStyleText != null) {
    // Always set `textStyle` even if `normalStyle.text` is null, because default
    // values have to be set on `normalStyle`.
    // If we set default values on `emphasisStyle`, consider case:
    // Firstly, `setOption(... label: {normal: {text: null}, emphasis: {show: true}} ...);`
    // Secondly, `setOption(... label: {noraml: {show: true, text: 'abc', color: 'red'} ...);`
    // Then the 'red' will not work on emphasis.
    setTextStyle(normalStyle, normalModel, normalSpecified, opt);
    setTextStyle(emphasisStyle, emphasisModel, emphasisSpecified, opt, true);
  }

  normalStyle.text = normalStyleText;
  emphasisStyle.text = emphasisStyleText;
}
/**
 * Set basic textStyle properties.
 * @param {Object|module:zrender/graphic/Style} textStyle
 * @param {module:echarts/model/Model} model
 * @param {Object} [specifiedTextStyle] Can be overrided by settings in model.
 * @param {Object} [opt] See `opt` of `setTextStyleCommon`.
 * @param {boolean} [isEmphasis]
 */


function setTextStyle(textStyle, textStyleModel, specifiedTextStyle, opt, isEmphasis) {
  setTextStyleCommon(textStyle, textStyleModel, opt, isEmphasis);
  specifiedTextStyle && zrUtil.extend(textStyle, specifiedTextStyle);
  textStyle.host && textStyle.host.dirty && textStyle.host.dirty(false);
  return textStyle;
}
/**
 * Set text option in the style.
 * @deprecated
 * @param {Object} textStyle
 * @param {module:echarts/model/Model} labelModel
 * @param {string|boolean} defaultColor Default text color.
 *        If set as false, it will be processed as a emphasis style.
 */


function setText(textStyle, labelModel, defaultColor) {
  var opt = {
    isRectText: true
  };
  var isEmphasis;

  if (defaultColor === false) {
    isEmphasis = true;
  } else {
    // Support setting color as 'auto' to get visual color.
    opt.autoColor = defaultColor;
  }

  setTextStyleCommon(textStyle, labelModel, opt, isEmphasis);
  textStyle.host && textStyle.host.dirty && textStyle.host.dirty(false);
}
/**
 * {
 *      disableBox: boolean, Whether diable drawing box of block (outer most).
 *      isRectText: boolean,
 *      autoColor: string, specify a color when color is 'auto',
 *              for textFill, textStroke, textBackgroundColor, and textBorderColor.
 *              If autoColor specified, it is used as default textFill.
 *      useInsideStyle:
 *              `true`: Use inside style (textFill, textStroke, textStrokeWidth)
 *                  if `textFill` is not specified.
 *              `false`: Do not use inside style.
 *              `null/undefined`: use inside style if `isRectText` is true and
 *                  `textFill` is not specified and textPosition contains `'inside'`.
 *      forceRich: boolean
 * }
 */


function setTextStyleCommon(textStyle, textStyleModel, opt, isEmphasis) {
  // Consider there will be abnormal when merge hover style to normal style if given default value.
  opt = opt || EMPTY_OBJ;

  if (opt.isRectText) {
    var textPosition = textStyleModel.getShallow('position') || (isEmphasis ? null : 'inside'); // 'outside' is not a valid zr textPostion value, but used
    // in bar series, and magric type should be considered.

    textPosition === 'outside' && (textPosition = 'top');
    textStyle.textPosition = textPosition;
    textStyle.textOffset = textStyleModel.getShallow('offset');
    var labelRotate = textStyleModel.getShallow('rotate');
    labelRotate != null && (labelRotate *= Math.PI / 180);
    textStyle.textRotation = labelRotate;
    textStyle.textDistance = zrUtil.retrieve2(textStyleModel.getShallow('distance'), isEmphasis ? null : 5);
  }

  var ecModel = textStyleModel.ecModel;
  var globalTextStyle = ecModel && ecModel.option.textStyle; // Consider case:
  // {
  //     data: [{
  //         value: 12,
  //         label: {
  //             normal: {
  //                 rich: {
  //                     // no 'a' here but using parent 'a'.
  //                 }
  //             }
  //         }
  //     }],
  //     rich: {
  //         a: { ... }
  //     }
  // }

  var richItemNames = getRichItemNames(textStyleModel);
  var richResult;

  if (richItemNames) {
    richResult = {};

    for (var name in richItemNames) {
      if (richItemNames.hasOwnProperty(name)) {
        // Cascade is supported in rich.
        var richTextStyle = textStyleModel.getModel(['rich', name]); // In rich, never `disableBox`.

        setTokenTextStyle(richResult[name] = {}, richTextStyle, globalTextStyle, opt, isEmphasis);
      }
    }
  }

  textStyle.rich = richResult;
  setTokenTextStyle(textStyle, textStyleModel, globalTextStyle, opt, isEmphasis, true);

  if (opt.forceRich && !opt.textStyle) {
    opt.textStyle = {};
  }

  return textStyle;
} // Consider case:
// {
//     data: [{
//         value: 12,
//         label: {
//             normal: {
//                 rich: {
//                     // no 'a' here but using parent 'a'.
//                 }
//             }
//         }
//     }],
//     rich: {
//         a: { ... }
//     }
// }


function getRichItemNames(textStyleModel) {
  // Use object to remove duplicated names.
  var richItemNameMap;

  while (textStyleModel && textStyleModel !== textStyleModel.ecModel) {
    var rich = (textStyleModel.option || EMPTY_OBJ).rich;

    if (rich) {
      richItemNameMap = richItemNameMap || {};

      for (var name in rich) {
        if (rich.hasOwnProperty(name)) {
          richItemNameMap[name] = 1;
        }
      }
    }

    textStyleModel = textStyleModel.parentModel;
  }

  return richItemNameMap;
}

function setTokenTextStyle(textStyle, textStyleModel, globalTextStyle, opt, isEmphasis, isBlock) {
  // In merge mode, default value should not be given.
  globalTextStyle = !isEmphasis && globalTextStyle || EMPTY_OBJ;
  textStyle.textFill = getAutoColor(textStyleModel.getShallow('color'), opt) || globalTextStyle.color;
  textStyle.textStroke = getAutoColor(textStyleModel.getShallow('textBorderColor'), opt) || globalTextStyle.textBorderColor;
  textStyle.textStrokeWidth = zrUtil.retrieve2(textStyleModel.getShallow('textBorderWidth'), globalTextStyle.textBorderWidth);

  if (!isEmphasis) {
    if (isBlock) {
      // Always set `insideRollback`, for clearing previous.
      var originalTextPosition = textStyle.textPosition;
      textStyle.insideRollback = applyInsideStyle(textStyle, originalTextPosition, opt); // Save original textPosition, because style.textPosition will be repalced by
      // real location (like [10, 30]) in zrender.

      textStyle.insideOriginalTextPosition = originalTextPosition;
      textStyle.insideRollbackOpt = opt;
    } // Set default finally.


    if (textStyle.textFill == null) {
      textStyle.textFill = opt.autoColor;
    }
  } // Do not use `getFont` here, because merge should be supported, where
  // part of these properties may be changed in emphasis style, and the
  // others should remain their original value got from normal style.


  textStyle.fontStyle = textStyleModel.getShallow('fontStyle') || globalTextStyle.fontStyle;
  textStyle.fontWeight = textStyleModel.getShallow('fontWeight') || globalTextStyle.fontWeight;
  textStyle.fontSize = textStyleModel.getShallow('fontSize') || globalTextStyle.fontSize;
  textStyle.fontFamily = textStyleModel.getShallow('fontFamily') || globalTextStyle.fontFamily;
  textStyle.textAlign = textStyleModel.getShallow('align');
  textStyle.textVerticalAlign = textStyleModel.getShallow('verticalAlign') || textStyleModel.getShallow('baseline');
  textStyle.textLineHeight = textStyleModel.getShallow('lineHeight');
  textStyle.textWidth = textStyleModel.getShallow('width');
  textStyle.textHeight = textStyleModel.getShallow('height');
  textStyle.textTag = textStyleModel.getShallow('tag');

  if (!isBlock || !opt.disableBox) {
    textStyle.textBackgroundColor = getAutoColor(textStyleModel.getShallow('backgroundColor'), opt);
    textStyle.textPadding = textStyleModel.getShallow('padding');
    textStyle.textBorderColor = getAutoColor(textStyleModel.getShallow('borderColor'), opt);
    textStyle.textBorderWidth = textStyleModel.getShallow('borderWidth');
    textStyle.textBorderRadius = textStyleModel.getShallow('borderRadius');
    textStyle.textBoxShadowColor = textStyleModel.getShallow('shadowColor');
    textStyle.textBoxShadowBlur = textStyleModel.getShallow('shadowBlur');
    textStyle.textBoxShadowOffsetX = textStyleModel.getShallow('shadowOffsetX');
    textStyle.textBoxShadowOffsetY = textStyleModel.getShallow('shadowOffsetY');
  }

  textStyle.textShadowColor = textStyleModel.getShallow('textShadowColor') || globalTextStyle.textShadowColor;
  textStyle.textShadowBlur = textStyleModel.getShallow('textShadowBlur') || globalTextStyle.textShadowBlur;
  textStyle.textShadowOffsetX = textStyleModel.getShallow('textShadowOffsetX') || globalTextStyle.textShadowOffsetX;
  textStyle.textShadowOffsetY = textStyleModel.getShallow('textShadowOffsetY') || globalTextStyle.textShadowOffsetY;
}

function getAutoColor(color, opt) {
  return color !== 'auto' ? color : opt && opt.autoColor ? opt.autoColor : null;
}

function applyInsideStyle(textStyle, textPosition, opt) {
  var useInsideStyle = opt.useInsideStyle;
  var insideRollback;

  if (textStyle.textFill == null && useInsideStyle !== false && (useInsideStyle === true || opt.isRectText && textPosition // textPosition can be [10, 30]
  && typeof textPosition === 'string' && textPosition.indexOf('inside') >= 0)) {
    insideRollback = {
      textFill: null,
      textStroke: textStyle.textStroke,
      textStrokeWidth: textStyle.textStrokeWidth
    };
    textStyle.textFill = '#fff'; // Consider text with #fff overflow its container.

    if (textStyle.textStroke == null) {
      textStyle.textStroke = opt.autoColor;
      textStyle.textStrokeWidth == null && (textStyle.textStrokeWidth = 2);
    }
  }

  return insideRollback;
}

function rollbackInsideStyle(style) {
  var insideRollback = style.insideRollback;

  if (insideRollback) {
    style.textFill = insideRollback.textFill;
    style.textStroke = insideRollback.textStroke;
    style.textStrokeWidth = insideRollback.textStrokeWidth;
  }
}

function getFont(opt, ecModel) {
  // ecModel or default text style model.
  var gTextStyleModel = ecModel || ecModel.getModel('textStyle');
  return [// FIXME in node-canvas fontWeight is before fontStyle
  opt.fontStyle || gTextStyleModel && gTextStyleModel.getShallow('fontStyle') || '', opt.fontWeight || gTextStyleModel && gTextStyleModel.getShallow('fontWeight') || '', (opt.fontSize || gTextStyleModel && gTextStyleModel.getShallow('fontSize') || 12) + 'px', opt.fontFamily || gTextStyleModel && gTextStyleModel.getShallow('fontFamily') || 'sans-serif'].join(' ');
}

function animateOrSetProps(isUpdate, el, props, animatableModel, dataIndex, cb) {
  if (typeof dataIndex === 'function') {
    cb = dataIndex;
    dataIndex = null;
  } // Do not check 'animation' property directly here. Consider this case:
  // animation model is an `itemModel`, whose does not have `isAnimationEnabled`
  // but its parent model (`seriesModel`) does.


  var animationEnabled = animatableModel && animatableModel.isAnimationEnabled();

  if (animationEnabled) {
    var postfix = isUpdate ? 'Update' : '';
    var duration = animatableModel.getShallow('animationDuration' + postfix);
    var animationEasing = animatableModel.getShallow('animationEasing' + postfix);
    var animationDelay = animatableModel.getShallow('animationDelay' + postfix);

    if (typeof animationDelay === 'function') {
      animationDelay = animationDelay(dataIndex, animatableModel.getAnimationDelayParams ? animatableModel.getAnimationDelayParams(el, dataIndex) : null);
    }

    if (typeof duration === 'function') {
      duration = duration(dataIndex);
    }

    duration > 0 ? el.animateTo(props, duration, animationDelay || 0, animationEasing, cb, !!cb) : (el.stopAnimation(), el.attr(props), cb && cb());
  } else {
    el.stopAnimation();
    el.attr(props);
    cb && cb();
  }
}
/**
 * Update graphic element properties with or without animation according to the
 * configuration in series.
 *
 * Caution: this method will stop previous animation.
 * So if do not use this method to one element twice before
 * animation starts, unless you know what you are doing.
 *
 * @param {module:zrender/Element} el
 * @param {Object} props
 * @param {module:echarts/model/Model} [animatableModel]
 * @param {number} [dataIndex]
 * @param {Function} [cb]
 * @example
 *     graphic.updateProps(el, {
 *         position: [100, 100]
 *     }, seriesModel, dataIndex, function () { console.log('Animation done!'); });
 *     // Or
 *     graphic.updateProps(el, {
 *         position: [100, 100]
 *     }, seriesModel, function () { console.log('Animation done!'); });
 */


function updateProps(el, props, animatableModel, dataIndex, cb) {
  animateOrSetProps(true, el, props, animatableModel, dataIndex, cb);
}
/**
 * Init graphic element properties with or without animation according to the
 * configuration in series.
 *
 * Caution: this method will stop previous animation.
 * So if do not use this method to one element twice before
 * animation starts, unless you know what you are doing.
 *
 * @param {module:zrender/Element} el
 * @param {Object} props
 * @param {module:echarts/model/Model} [animatableModel]
 * @param {number} [dataIndex]
 * @param {Function} cb
 */


function initProps(el, props, animatableModel, dataIndex, cb) {
  animateOrSetProps(false, el, props, animatableModel, dataIndex, cb);
}
/**
 * Get transform matrix of target (param target),
 * in coordinate of its ancestor (param ancestor)
 *
 * @param {module:zrender/mixin/Transformable} target
 * @param {module:zrender/mixin/Transformable} [ancestor]
 */


function getTransform(target, ancestor) {
  var mat = matrix.identity([]);

  while (target && target !== ancestor) {
    matrix.mul(mat, target.getLocalTransform(), mat);
    target = target.parent;
  }

  return mat;
}
/**
 * Apply transform to an vertex.
 * @param {Array.<number>} target [x, y]
 * @param {Array.<number>|TypedArray.<number>|Object} transform Can be:
 *      + Transform matrix: like [1, 0, 0, 1, 0, 0]
 *      + {position, rotation, scale}, the same as `zrender/Transformable`.
 * @param {boolean=} invert Whether use invert matrix.
 * @return {Array.<number>} [x, y]
 */


function applyTransform(target, transform, invert) {
  if (transform && !zrUtil.isArrayLike(transform)) {
    transform = Transformable.getLocalTransform(transform);
  }

  if (invert) {
    transform = matrix.invert([], transform);
  }

  return vector.applyTransform([], target, transform);
}
/**
 * @param {string} direction 'left' 'right' 'top' 'bottom'
 * @param {Array.<number>} transform Transform matrix: like [1, 0, 0, 1, 0, 0]
 * @param {boolean=} invert Whether use invert matrix.
 * @return {string} Transformed direction. 'left' 'right' 'top' 'bottom'
 */


function transformDirection(direction, transform, invert) {
  // Pick a base, ensure that transform result will not be (0, 0).
  var hBase = transform[4] === 0 || transform[5] === 0 || transform[0] === 0 ? 1 : Math.abs(2 * transform[4] / transform[0]);
  var vBase = transform[4] === 0 || transform[5] === 0 || transform[2] === 0 ? 1 : Math.abs(2 * transform[4] / transform[2]);
  var vertex = [direction === 'left' ? -hBase : direction === 'right' ? hBase : 0, direction === 'top' ? -vBase : direction === 'bottom' ? vBase : 0];
  vertex = applyTransform(vertex, transform, invert);
  return Math.abs(vertex[0]) > Math.abs(vertex[1]) ? vertex[0] > 0 ? 'right' : 'left' : vertex[1] > 0 ? 'bottom' : 'top';
}
/**
 * Apply group transition animation from g1 to g2.
 * If no animatableModel, no animation.
 */


function groupTransition(g1, g2, animatableModel, cb) {
  if (!g1 || !g2) {
    return;
  }

  function getElMap(g) {
    var elMap = {};
    g.traverse(function (el) {
      if (!el.isGroup && el.anid) {
        elMap[el.anid] = el;
      }
    });
    return elMap;
  }

  function getAnimatableProps(el) {
    var obj = {
      position: vector.clone(el.position),
      rotation: el.rotation
    };

    if (el.shape) {
      obj.shape = zrUtil.extend({}, el.shape);
    }

    return obj;
  }

  var elMap1 = getElMap(g1);
  g2.traverse(function (el) {
    if (!el.isGroup && el.anid) {
      var oldEl = elMap1[el.anid];

      if (oldEl) {
        var newProp = getAnimatableProps(el);
        el.attr(getAnimatableProps(oldEl));
        updateProps(el, newProp, animatableModel, el.dataIndex);
      } // else {
      //     if (el.previousProps) {
      //         graphic.updateProps
      //     }
      // }

    }
  });
}
/**
 * @param {Array.<Array.<number>>} points Like: [[23, 44], [53, 66], ...]
 * @param {Object} rect {x, y, width, height}
 * @return {Array.<Array.<number>>} A new clipped points.
 */


function clipPointsByRect(points, rect) {
  return zrUtil.map(points, function (point) {
    var x = point[0];
    x = mathMax(x, rect.x);
    x = mathMin(x, rect.x + rect.width);
    var y = point[1];
    y = mathMax(y, rect.y);
    y = mathMin(y, rect.y + rect.height);
    return [x, y];
  });
}
/**
 * @param {Object} targetRect {x, y, width, height}
 * @param {Object} rect {x, y, width, height}
 * @return {Object} A new clipped rect. If rect size are negative, return undefined.
 */


function clipRectByRect(targetRect, rect) {
  var x = mathMax(targetRect.x, rect.x);
  var x2 = mathMin(targetRect.x + targetRect.width, rect.x + rect.width);
  var y = mathMax(targetRect.y, rect.y);
  var y2 = mathMin(targetRect.y + targetRect.height, rect.y + rect.height);

  if (x2 >= x && y2 >= y) {
    return {
      x: x,
      y: y,
      width: x2 - x,
      height: y2 - y
    };
  }
}
/**
 * @param {string} iconStr Support 'image://' or 'path://' or direct svg path.
 * @param {Object} [opt] Properties of `module:zrender/Element`, except `style`.
 * @param {Object} [rect] {x, y, width, height}
 * @return {module:zrender/Element} Icon path or image element.
 */


function createIcon(iconStr, opt, rect) {
  opt = zrUtil.extend({
    rectHover: true
  }, opt);
  var style = opt.style = {
    strokeNoScale: true
  };
  rect = rect || {
    x: -1,
    y: -1,
    width: 2,
    height: 2
  };

  if (iconStr) {
    return iconStr.indexOf('image://') === 0 ? (style.image = iconStr.slice(8), zrUtil.defaults(style, rect), new Image(opt)) : makePath(iconStr.replace('path://', ''), opt, rect, 'center');
  }
}

exports.extendShape = extendShape;
exports.extendPath = extendPath;
exports.makePath = makePath;
exports.makeImage = makeImage;
exports.mergePath = mergePath;
exports.resizePath = resizePath;
exports.subPixelOptimizeLine = subPixelOptimizeLine;
exports.subPixelOptimizeRect = subPixelOptimizeRect;
exports.subPixelOptimize = subPixelOptimize;
exports.setHoverStyle = setHoverStyle;
exports.setLabelStyle = setLabelStyle;
exports.setTextStyle = setTextStyle;
exports.setText = setText;
exports.getFont = getFont;
exports.updateProps = updateProps;
exports.initProps = initProps;
exports.getTransform = getTransform;
exports.applyTransform = applyTransform;
exports.transformDirection = transformDirection;
exports.groupTransition = groupTransition;
exports.clipPointsByRect = clipPointsByRect;
exports.clipRectByRect = clipRectByRect;
exports.createIcon = createIcon;

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var formatUtil = __webpack_require__(217);

var nubmerUtil = __webpack_require__(202);

var Model = __webpack_require__(221);

var each = zrUtil.each;
var isObject = zrUtil.isObject;
/**
 * If value is not array, then translate it to array.
 * @param  {*} value
 * @return {Array} [value] or value
 */

function normalizeToArray(value) {
  return value instanceof Array ? value : value == null ? [] : [value];
}
/**
 * Sync default option between normal and emphasis like `position` and `show`
 * In case some one will write code like
 *     label: {
 *         normal: {
 *             show: false,
 *             position: 'outside',
 *             fontSize: 18
 *         },
 *         emphasis: {
 *             show: true
 *         }
 *     }
 * @param {Object} opt
 * @param {Array.<string>} subOpts
 */


function defaultEmphasis(opt, subOpts) {
  if (opt) {
    var emphasisOpt = opt.emphasis = opt.emphasis || {};
    var normalOpt = opt.normal = opt.normal || {}; // Default emphasis option from normal

    for (var i = 0, len = subOpts.length; i < len; i++) {
      var subOptName = subOpts[i];

      if (!emphasisOpt.hasOwnProperty(subOptName) && normalOpt.hasOwnProperty(subOptName)) {
        emphasisOpt[subOptName] = normalOpt[subOptName];
      }
    }
  }
}

var TEXT_STYLE_OPTIONS = ['fontStyle', 'fontWeight', 'fontSize', 'fontFamily', 'rich', 'tag', 'color', 'textBorderColor', 'textBorderWidth', 'width', 'height', 'lineHeight', 'align', 'verticalAlign', 'baseline', 'shadowColor', 'shadowBlur', 'shadowOffsetX', 'shadowOffsetY', 'textShadowColor', 'textShadowBlur', 'textShadowOffsetX', 'textShadowOffsetY', 'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius', 'padding']; // modelUtil.LABEL_OPTIONS = modelUtil.TEXT_STYLE_OPTIONS.concat([
//     'position', 'offset', 'rotate', 'origin', 'show', 'distance', 'formatter',
//     'fontStyle', 'fontWeight', 'fontSize', 'fontFamily',
//     // FIXME: deprecated, check and remove it.
//     'textStyle'
// ]);

/**
 * data could be [12, 2323, {value: 223}, [1221, 23], {value: [2, 23]}]
 * This helper method retieves value from data.
 * @param {string|number|Date|Array|Object} dataItem
 * @return {number|string|Date|Array.<number|string|Date>}
 */

function getDataItemValue(dataItem) {
  // Performance sensitive.
  return dataItem && (dataItem.value == null ? dataItem : dataItem.value);
}
/**
 * data could be [12, 2323, {value: 223}, [1221, 23], {value: [2, 23]}]
 * This helper method determine if dataItem has extra option besides value
 * @param {string|number|Date|Array|Object} dataItem
 */


function isDataItemOption(dataItem) {
  return isObject(dataItem) && !(dataItem instanceof Array); // // markLine data can be array
  // && !(dataItem[0] && isObject(dataItem[0]) && !(dataItem[0] instanceof Array));
}
/**
 * This helper method convert value in data.
 * @param {string|number|Date} value
 * @param {Object|string} [dimInfo] If string (like 'x'), dimType defaults 'number'.
 */


function converDataValue(value, dimInfo) {
  // Performance sensitive.
  var dimType = dimInfo && dimInfo.type;

  if (dimType === 'ordinal') {
    return value;
  }

  if (dimType === 'time' // spead up when using timestamp
  && typeof value !== 'number' && value != null && value !== '-') {
    value = +nubmerUtil.parseDate(value);
  } // dimType defaults 'number'.
  // If dimType is not ordinal and value is null or undefined or NaN or '-',
  // parse to NaN.


  return value == null || value === '' ? NaN : +value; // If string (like '-'), using '+' parse to NaN
}
/**
 * Create a model proxy to be used in tooltip for edge data, markLine data, markPoint data.
 * @param {module:echarts/data/List} data
 * @param {Object} opt
 * @param {string} [opt.seriesIndex]
 * @param {Object} [opt.name]
 * @param {Object} [opt.mainType]
 * @param {Object} [opt.subType]
 */


function createDataFormatModel(data, opt) {
  var model = new Model();
  zrUtil.mixin(model, dataFormatMixin);
  model.seriesIndex = opt.seriesIndex;
  model.name = opt.name || '';
  model.mainType = opt.mainType;
  model.subType = opt.subType;

  model.getData = function () {
    return data;
  };

  return model;
} // PENDING A little ugly


var dataFormatMixin = {
  /**
   * Get params for formatter
   * @param {number} dataIndex
   * @param {string} [dataType]
   * @return {Object}
   */
  getDataParams: function (dataIndex, dataType) {
    var data = this.getData(dataType);
    var rawValue = this.getRawValue(dataIndex, dataType);
    var rawDataIndex = data.getRawIndex(dataIndex);
    var name = data.getName(dataIndex, true);
    var itemOpt = data.getRawDataItem(dataIndex);
    var color = data.getItemVisual(dataIndex, 'color');
    return {
      componentType: this.mainType,
      componentSubType: this.subType,
      seriesType: this.mainType === 'series' ? this.subType : null,
      seriesIndex: this.seriesIndex,
      seriesId: this.id,
      seriesName: this.name,
      name: name,
      dataIndex: rawDataIndex,
      data: itemOpt,
      dataType: dataType,
      value: rawValue,
      color: color,
      marker: formatUtil.getTooltipMarker(color),
      // Param name list for mapping `a`, `b`, `c`, `d`, `e`
      $vars: ['seriesName', 'name', 'value']
    };
  },

  /**
   * Format label
   * @param {number} dataIndex
   * @param {string} [status='normal'] 'normal' or 'emphasis'
   * @param {string} [dataType]
   * @param {number} [dimIndex]
   * @param {string} [labelProp='label']
   * @return {string}
   */
  getFormattedLabel: function (dataIndex, status, dataType, dimIndex, labelProp) {
    status = status || 'normal';
    var data = this.getData(dataType);
    var itemModel = data.getItemModel(dataIndex);
    var params = this.getDataParams(dataIndex, dataType);

    if (dimIndex != null && params.value instanceof Array) {
      params.value = params.value[dimIndex];
    }

    var formatter = itemModel.get([labelProp || 'label', status, 'formatter']);

    if (typeof formatter === 'function') {
      params.status = status;
      return formatter(params);
    } else if (typeof formatter === 'string') {
      return formatUtil.formatTpl(formatter, params);
    }
  },

  /**
   * Get raw value in option
   * @param {number} idx
   * @param {string} [dataType]
   * @return {Object}
   */
  getRawValue: function (idx, dataType) {
    var data = this.getData(dataType);
    var dataItem = data.getRawDataItem(idx);

    if (dataItem != null) {
      return isObject(dataItem) && !(dataItem instanceof Array) ? dataItem.value : dataItem;
    }
  },

  /**
   * Should be implemented.
   * @param {number} dataIndex
   * @param {boolean} [multipleSeries=false]
   * @param {number} [dataType]
   * @return {string} tooltip string
   */
  formatTooltip: zrUtil.noop
};
/**
 * Mapping to exists for merge.
 *
 * @public
 * @param {Array.<Object>|Array.<module:echarts/model/Component>} exists
 * @param {Object|Array.<Object>} newCptOptions
 * @return {Array.<Object>} Result, like [{exist: ..., option: ...}, {}],
 *                          index of which is the same as exists.
 */

function mappingToExists(exists, newCptOptions) {
  // Mapping by the order by original option (but not order of
  // new option) in merge mode. Because we should ensure
  // some specified index (like xAxisIndex) is consistent with
  // original option, which is easy to understand, espatially in
  // media query. And in most case, merge option is used to
  // update partial option but not be expected to change order.
  newCptOptions = (newCptOptions || []).slice();
  var result = zrUtil.map(exists || [], function (obj, index) {
    return {
      exist: obj
    };
  }); // Mapping by id or name if specified.

  each(newCptOptions, function (cptOption, index) {
    if (!isObject(cptOption)) {
      return;
    } // id has highest priority.


    for (var i = 0; i < result.length; i++) {
      if (!result[i].option // Consider name: two map to one.
      && cptOption.id != null && result[i].exist.id === cptOption.id + '') {
        result[i].option = cptOption;
        newCptOptions[index] = null;
        return;
      }
    }

    for (var i = 0; i < result.length; i++) {
      var exist = result[i].exist;

      if (!result[i].option // Consider name: two map to one.
      // Can not match when both ids exist but different.
      && (exist.id == null || cptOption.id == null) && cptOption.name != null && !isIdInner(cptOption) && !isIdInner(exist) && exist.name === cptOption.name + '') {
        result[i].option = cptOption;
        newCptOptions[index] = null;
        return;
      }
    }
  }); // Otherwise mapping by index.

  each(newCptOptions, function (cptOption, index) {
    if (!isObject(cptOption)) {
      return;
    }

    var i = 0;

    for (; i < result.length; i++) {
      var exist = result[i].exist;

      if (!result[i].option // Existing model that already has id should be able to
      // mapped to (because after mapping performed model may
      // be assigned with a id, whish should not affect next
      // mapping), except those has inner id.
      && !isIdInner(exist) // Caution:
      // Do not overwrite id. But name can be overwritten,
      // because axis use name as 'show label text'.
      // 'exist' always has id and name and we dont
      // need to check it.
      && cptOption.id == null) {
        result[i].option = cptOption;
        break;
      }
    }

    if (i >= result.length) {
      result.push({
        option: cptOption
      });
    }
  });
  return result;
}
/**
 * Make id and name for mapping result (result of mappingToExists)
 * into `keyInfo` field.
 *
 * @public
 * @param {Array.<Object>} Result, like [{exist: ..., option: ...}, {}],
 *                          which order is the same as exists.
 * @return {Array.<Object>} The input.
 */


function makeIdAndName(mapResult) {
  // We use this id to hash component models and view instances
  // in echarts. id can be specified by user, or auto generated.
  // The id generation rule ensures new view instance are able
  // to mapped to old instance when setOption are called in
  // no-merge mode. So we generate model id by name and plus
  // type in view id.
  // name can be duplicated among components, which is convenient
  // to specify multi components (like series) by one name.
  // Ensure that each id is distinct.
  var idMap = zrUtil.createHashMap();
  each(mapResult, function (item, index) {
    var existCpt = item.exist;
    existCpt && idMap.set(existCpt.id, item);
  });
  each(mapResult, function (item, index) {
    var opt = item.option;
    zrUtil.assert(!opt || opt.id == null || !idMap.get(opt.id) || idMap.get(opt.id) === item, 'id duplicates: ' + (opt && opt.id));
    opt && opt.id != null && idMap.set(opt.id, item);
    !item.keyInfo && (item.keyInfo = {});
  }); // Make name and id.

  each(mapResult, function (item, index) {
    var existCpt = item.exist;
    var opt = item.option;
    var keyInfo = item.keyInfo;

    if (!isObject(opt)) {
      return;
    } // name can be overwitten. Consider case: axis.name = '20km'.
    // But id generated by name will not be changed, which affect
    // only in that case: setOption with 'not merge mode' and view
    // instance will be recreated, which can be accepted.


    keyInfo.name = opt.name != null ? opt.name + '' : existCpt ? existCpt.name : '\0-'; // name may be displayed on screen, so use '-'.

    if (existCpt) {
      keyInfo.id = existCpt.id;
    } else if (opt.id != null) {
      keyInfo.id = opt.id + '';
    } else {
      // Consider this situatoin:
      //  optionA: [{name: 'a'}, {name: 'a'}, {..}]
      //  optionB [{..}, {name: 'a'}, {name: 'a'}]
      // Series with the same name between optionA and optionB
      // should be mapped.
      var idNum = 0;

      do {
        keyInfo.id = '\0' + keyInfo.name + '\0' + idNum++;
      } while (idMap.get(keyInfo.id));
    }

    idMap.set(keyInfo.id, item);
  });
}
/**
 * @public
 * @param {Object} cptOption
 * @return {boolean}
 */


function isIdInner(cptOption) {
  return isObject(cptOption) && cptOption.id && (cptOption.id + '').indexOf('\0_ec_\0') === 0;
}
/**
 * A helper for removing duplicate items between batchA and batchB,
 * and in themselves, and categorize by series.
 *
 * @param {Array.<Object>} batchA Like: [{seriesId: 2, dataIndex: [32, 4, 5]}, ...]
 * @param {Array.<Object>} batchB Like: [{seriesId: 2, dataIndex: [32, 4, 5]}, ...]
 * @return {Array.<Array.<Object>, Array.<Object>>} result: [resultBatchA, resultBatchB]
 */


function compressBatches(batchA, batchB) {
  var mapA = {};
  var mapB = {};
  makeMap(batchA || [], mapA);
  makeMap(batchB || [], mapB, mapA);
  return [mapToArray(mapA), mapToArray(mapB)];

  function makeMap(sourceBatch, map, otherMap) {
    for (var i = 0, len = sourceBatch.length; i < len; i++) {
      var seriesId = sourceBatch[i].seriesId;
      var dataIndices = normalizeToArray(sourceBatch[i].dataIndex);
      var otherDataIndices = otherMap && otherMap[seriesId];

      for (var j = 0, lenj = dataIndices.length; j < lenj; j++) {
        var dataIndex = dataIndices[j];

        if (otherDataIndices && otherDataIndices[dataIndex]) {
          otherDataIndices[dataIndex] = null;
        } else {
          (map[seriesId] || (map[seriesId] = {}))[dataIndex] = 1;
        }
      }
    }
  }

  function mapToArray(map, isData) {
    var result = [];

    for (var i in map) {
      if (map.hasOwnProperty(i) && map[i] != null) {
        if (isData) {
          result.push(+i);
        } else {
          var dataIndices = mapToArray(map[i], true);
          dataIndices.length && result.push({
            seriesId: i,
            dataIndex: dataIndices
          });
        }
      }
    }

    return result;
  }
}
/**
 * @param {module:echarts/data/List} data
 * @param {Object} payload Contains dataIndex (means rawIndex) / dataIndexInside / name
 *                         each of which can be Array or primary type.
 * @return {number|Array.<number>} dataIndex If not found, return undefined/null.
 */


function queryDataIndex(data, payload) {
  if (payload.dataIndexInside != null) {
    return payload.dataIndexInside;
  } else if (payload.dataIndex != null) {
    return zrUtil.isArray(payload.dataIndex) ? zrUtil.map(payload.dataIndex, function (value) {
      return data.indexOfRawIndex(value);
    }) : data.indexOfRawIndex(payload.dataIndex);
  } else if (payload.name != null) {
    return zrUtil.isArray(payload.name) ? zrUtil.map(payload.name, function (value) {
      return data.indexOfName(value);
    }) : data.indexOfName(payload.name);
  }
}
/**
 * Enable property storage to any host object.
 * Notice: Serialization is not supported.
 *
 * For example:
 * var get = modelUitl.makeGetter();
 *
 * function some(hostObj) {
 *      get(hostObj)._someProperty = 1212;
 *      ...
 * }
 *
 * @return {Function}
 */


var makeGetter = function () {
  var index = 0;
  return function () {
    var key = '\0__ec_prop_getter_' + index++;
    return function (hostObj) {
      return hostObj[key] || (hostObj[key] = {});
    };
  };
}();
/**
 * @param {module:echarts/model/Global} ecModel
 * @param {string|Object} finder
 *        If string, e.g., 'geo', means {geoIndex: 0}.
 *        If Object, could contain some of these properties below:
 *        {
 *            seriesIndex, seriesId, seriesName,
 *            geoIndex, geoId, geoName,
 *            bmapIndex, bmapId, bmapName,
 *            xAxisIndex, xAxisId, xAxisName,
 *            yAxisIndex, yAxisId, yAxisName,
 *            gridIndex, gridId, gridName,
 *            ... (can be extended)
 *        }
 *        Each properties can be number|string|Array.<number>|Array.<string>
 *        For example, a finder could be
 *        {
 *            seriesIndex: 3,
 *            geoId: ['aa', 'cc'],
 *            gridName: ['xx', 'rr']
 *        }
 *        xxxIndex can be set as 'all' (means all xxx) or 'none' (means not specify)
 *        If nothing or null/undefined specified, return nothing.
 * @param {Object} [opt]
 * @param {string} [opt.defaultMainType]
 * @param {Array.<string>} [opt.includeMainTypes]
 * @return {Object} result like:
 *        {
 *            seriesModels: [seriesModel1, seriesModel2],
 *            seriesModel: seriesModel1, // The first model
 *            geoModels: [geoModel1, geoModel2],
 *            geoModel: geoModel1, // The first model
 *            ...
 *        }
 */


function parseFinder(ecModel, finder, opt) {
  if (zrUtil.isString(finder)) {
    var obj = {};
    obj[finder + 'Index'] = 0;
    finder = obj;
  }

  var defaultMainType = opt && opt.defaultMainType;

  if (defaultMainType && !has(finder, defaultMainType + 'Index') && !has(finder, defaultMainType + 'Id') && !has(finder, defaultMainType + 'Name')) {
    finder[defaultMainType + 'Index'] = 0;
  }

  var result = {};
  each(finder, function (value, key) {
    var value = finder[key]; // Exclude 'dataIndex' and other illgal keys.

    if (key === 'dataIndex' || key === 'dataIndexInside') {
      result[key] = value;
      return;
    }

    var parsedKey = key.match(/^(\w+)(Index|Id|Name)$/) || [];
    var mainType = parsedKey[1];
    var queryType = (parsedKey[2] || '').toLowerCase();

    if (!mainType || !queryType || value == null || queryType === 'index' && value === 'none' || opt && opt.includeMainTypes && zrUtil.indexOf(opt.includeMainTypes, mainType) < 0) {
      return;
    }

    var queryParam = {
      mainType: mainType
    };

    if (queryType !== 'index' || value !== 'all') {
      queryParam[queryType] = value;
    }

    var models = ecModel.queryComponents(queryParam);
    result[mainType + 'Models'] = models;
    result[mainType + 'Model'] = models[0];
  });
  return result;
}
/**
 * @see {module:echarts/data/helper/completeDimensions}
 * @param {module:echarts/data/List} data
 * @param {string|number} dataDim
 * @return {string}
 */


function dataDimToCoordDim(data, dataDim) {
  var dimensions = data.dimensions;
  dataDim = data.getDimension(dataDim);

  for (var i = 0; i < dimensions.length; i++) {
    var dimItem = data.getDimensionInfo(dimensions[i]);

    if (dimItem.name === dataDim) {
      return dimItem.coordDim;
    }
  }
}
/**
 * @see {module:echarts/data/helper/completeDimensions}
 * @param {module:echarts/data/List} data
 * @param {string} coordDim
 * @return {Array.<string>} data dimensions on the coordDim.
 */


function coordDimToDataDim(data, coordDim) {
  var dataDim = [];
  each(data.dimensions, function (dimName) {
    var dimItem = data.getDimensionInfo(dimName);

    if (dimItem.coordDim === coordDim) {
      dataDim[dimItem.coordDimIndex] = dimItem.name;
    }
  });
  return dataDim;
}
/**
 * @see {module:echarts/data/helper/completeDimensions}
 * @param {module:echarts/data/List} data
 * @param {string} otherDim Can be `otherDims`
 *                        like 'label' or 'tooltip'.
 * @return {Array.<string>} data dimensions on the otherDim.
 */


function otherDimToDataDim(data, otherDim) {
  var dataDim = [];
  each(data.dimensions, function (dimName) {
    var dimItem = data.getDimensionInfo(dimName);
    var otherDims = dimItem.otherDims;
    var dimIndex = otherDims[otherDim];

    if (dimIndex != null && dimIndex !== false) {
      dataDim[dimIndex] = dimItem.name;
    }
  });
  return dataDim;
}

function has(obj, prop) {
  return obj && obj.hasOwnProperty(prop);
}

exports.normalizeToArray = normalizeToArray;
exports.defaultEmphasis = defaultEmphasis;
exports.TEXT_STYLE_OPTIONS = TEXT_STYLE_OPTIONS;
exports.getDataItemValue = getDataItemValue;
exports.isDataItemOption = isDataItemOption;
exports.converDataValue = converDataValue;
exports.createDataFormatModel = createDataFormatModel;
exports.dataFormatMixin = dataFormatMixin;
exports.mappingToExists = mappingToExists;
exports.makeIdAndName = makeIdAndName;
exports.isIdInner = isIdInner;
exports.compressBatches = compressBatches;
exports.queryDataIndex = queryDataIndex;
exports.makeGetter = makeGetter;
exports.parseFinder = parseFinder;
exports.dataDimToCoordDim = dataDimToCoordDim;
exports.coordDimToDataDim = coordDimToDataDim;
exports.otherDimToDataDim = otherDimToDataDim;

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var RADIAN_EPSILON = 1e-4;

function _trim(str) {
  return str.replace(/^\s+/, '').replace(/\s+$/, '');
}
/**
 * Linear mapping a value from domain to range
 * @memberOf module:echarts/util/number
 * @param  {(number|Array.<number>)} val
 * @param  {Array.<number>} domain Domain extent domain[0] can be bigger than domain[1]
 * @param  {Array.<number>} range  Range extent range[0] can be bigger than range[1]
 * @param  {boolean} clamp
 * @return {(number|Array.<number>}
 */


function linearMap(val, domain, range, clamp) {
  var subDomain = domain[1] - domain[0];
  var subRange = range[1] - range[0];

  if (subDomain === 0) {
    return subRange === 0 ? range[0] : (range[0] + range[1]) / 2;
  } // Avoid accuracy problem in edge, such as
  // 146.39 - 62.83 === 83.55999999999999.
  // See echarts/test/ut/spec/util/number.js#linearMap#accuracyError
  // It is a little verbose for efficiency considering this method
  // is a hotspot.


  if (clamp) {
    if (subDomain > 0) {
      if (val <= domain[0]) {
        return range[0];
      } else if (val >= domain[1]) {
        return range[1];
      }
    } else {
      if (val >= domain[0]) {
        return range[0];
      } else if (val <= domain[1]) {
        return range[1];
      }
    }
  } else {
    if (val === domain[0]) {
      return range[0];
    }

    if (val === domain[1]) {
      return range[1];
    }
  }

  return (val - domain[0]) / subDomain * subRange + range[0];
}
/**
 * Convert a percent string to absolute number.
 * Returns NaN if percent is not a valid string or number
 * @memberOf module:echarts/util/number
 * @param {string|number} percent
 * @param {number} all
 * @return {number}
 */


function parsePercent(percent, all) {
  switch (percent) {
    case 'center':
    case 'middle':
      percent = '50%';
      break;

    case 'left':
    case 'top':
      percent = '0%';
      break;

    case 'right':
    case 'bottom':
      percent = '100%';
      break;
  }

  if (typeof percent === 'string') {
    if (_trim(percent).match(/%$/)) {
      return parseFloat(percent) / 100 * all;
    }

    return parseFloat(percent);
  }

  return percent == null ? NaN : +percent;
}
/**
 * (1) Fix rounding error of float numbers.
 * (2) Support return string to avoid scientific notation like '3.5e-7'.
 *
 * @param {number} x
 * @param {number} [precision]
 * @param {boolean} [returnStr]
 * @return {number|string}
 */


function round(x, precision, returnStr) {
  if (precision == null) {
    precision = 10;
  } // Avoid range error


  precision = Math.min(Math.max(0, precision), 20);
  x = (+x).toFixed(precision);
  return returnStr ? x : +x;
}

function asc(arr) {
  arr.sort(function (a, b) {
    return a - b;
  });
  return arr;
}
/**
 * Get precision
 * @param {number} val
 */


function getPrecision(val) {
  val = +val;

  if (isNaN(val)) {
    return 0;
  } // It is much faster than methods converting number to string as follows
  //      var tmp = val.toString();
  //      return tmp.length - 1 - tmp.indexOf('.');
  // especially when precision is low


  var e = 1;
  var count = 0;

  while (Math.round(val * e) / e !== val) {
    e *= 10;
    count++;
  }

  return count;
}
/**
 * @param {string|number} val
 * @return {number}
 */


function getPrecisionSafe(val) {
  var str = val.toString(); // Consider scientific notation: '3.4e-12' '3.4e+12'

  var eIndex = str.indexOf('e');

  if (eIndex > 0) {
    var precision = +str.slice(eIndex + 1);
    return precision < 0 ? -precision : 0;
  } else {
    var dotIndex = str.indexOf('.');
    return dotIndex < 0 ? 0 : str.length - 1 - dotIndex;
  }
}
/**
 * Minimal dicernible data precisioin according to a single pixel.
 *
 * @param {Array.<number>} dataExtent
 * @param {Array.<number>} pixelExtent
 * @return {number} precision
 */


function getPixelPrecision(dataExtent, pixelExtent) {
  var log = Math.log;
  var LN10 = Math.LN10;
  var dataQuantity = Math.floor(log(dataExtent[1] - dataExtent[0]) / LN10);
  var sizeQuantity = Math.round(log(Math.abs(pixelExtent[1] - pixelExtent[0])) / LN10); // toFixed() digits argument must be between 0 and 20.

  var precision = Math.min(Math.max(-dataQuantity + sizeQuantity, 0), 20);
  return !isFinite(precision) ? 20 : precision;
}
/**
 * Get a data of given precision, assuring the sum of percentages
 * in valueList is 1.
 * The largest remainer method is used.
 * https://en.wikipedia.org/wiki/Largest_remainder_method
 *
 * @param {Array.<number>} valueList a list of all data
 * @param {number} idx index of the data to be processed in valueList
 * @param {number} precision integer number showing digits of precision
 * @return {number} percent ranging from 0 to 100
 */


function getPercentWithPrecision(valueList, idx, precision) {
  if (!valueList[idx]) {
    return 0;
  }

  var sum = zrUtil.reduce(valueList, function (acc, val) {
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  if (sum === 0) {
    return 0;
  }

  var digits = Math.pow(10, precision);
  var votesPerQuota = zrUtil.map(valueList, function (val) {
    return (isNaN(val) ? 0 : val) / sum * digits * 100;
  });
  var targetSeats = digits * 100;
  var seats = zrUtil.map(votesPerQuota, function (votes) {
    // Assign automatic seats.
    return Math.floor(votes);
  });
  var currentSum = zrUtil.reduce(seats, function (acc, val) {
    return acc + val;
  }, 0);
  var remainder = zrUtil.map(votesPerQuota, function (votes, idx) {
    return votes - seats[idx];
  }); // Has remainding votes.

  while (currentSum < targetSeats) {
    // Find next largest remainder.
    var max = Number.NEGATIVE_INFINITY;
    var maxId = null;

    for (var i = 0, len = remainder.length; i < len; ++i) {
      if (remainder[i] > max) {
        max = remainder[i];
        maxId = i;
      }
    } // Add a vote to max remainder.


    ++seats[maxId];
    remainder[maxId] = 0;
    ++currentSum;
  }

  return seats[idx] / digits;
} // Number.MAX_SAFE_INTEGER, ie do not support.


var MAX_SAFE_INTEGER = 9007199254740991;
/**
 * To 0 - 2 * PI, considering negative radian.
 * @param {number} radian
 * @return {number}
 */

function remRadian(radian) {
  var pi2 = Math.PI * 2;
  return (radian % pi2 + pi2) % pi2;
}
/**
 * @param {type} radian
 * @return {boolean}
 */


function isRadianAroundZero(val) {
  return val > -RADIAN_EPSILON && val < RADIAN_EPSILON;
}

var TIME_REG = /^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d\d)(?::(\d\d)(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/; // jshint ignore:line

/**
 * @param {string|Date|number} value These values can be accepted:
 *   + An instance of Date, represent a time in its own time zone.
 *   + Or string in a subset of ISO 8601, only including:
 *     + only year, month, date: '2012-03', '2012-03-01', '2012-03-01 05', '2012-03-01 05:06',
 *     + separated with T or space: '2012-03-01T12:22:33.123', '2012-03-01 12:22:33.123',
 *     + time zone: '2012-03-01T12:22:33Z', '2012-03-01T12:22:33+8000', '2012-03-01T12:22:33-05:00',
 *     all of which will be treated as local time if time zone is not specified
 *     (see <https://momentjs.com/>).
 *   + Or other string format, including (all of which will be treated as loacal time):
 *     '2012', '2012-3-1', '2012/3/1', '2012/03/01',
 *     '2009/6/12 2:00', '2009/6/12 2:05:08', '2009/6/12 2:05:08.123'
 *   + a timestamp, which represent a time in UTC.
 * @return {Date} date
 */

function parseDate(value) {
  if (value instanceof Date) {
    return value;
  } else if (typeof value === 'string') {
    // Different browsers parse date in different way, so we parse it manually.
    // Some other issues:
    // new Date('1970-01-01') is UTC,
    // new Date('1970/01/01') and new Date('1970-1-01') is local.
    // See issue #3623
    var match = TIME_REG.exec(value);

    if (!match) {
      // return Invalid Date.
      return new Date(NaN);
    } // Use local time when no timezone offset specifed.


    if (!match[8]) {
      // match[n] can only be string or undefined.
      // But take care of '12' + 1 => '121'.
      return new Date(+match[1], +(match[2] || 1) - 1, +match[3] || 1, +match[4] || 0, +(match[5] || 0), +match[6] || 0, +match[7] || 0);
    } // Timezoneoffset of Javascript Date has considered DST (Daylight Saving Time,
    // https://tc39.github.io/ecma262/#sec-daylight-saving-time-adjustment).
    // For example, system timezone is set as "Time Zone: America/Toronto",
    // then these code will get different result:
    // `new Date(1478411999999).getTimezoneOffset();  // get 240`
    // `new Date(1478412000000).getTimezoneOffset();  // get 300`
    // So we should not use `new Date`, but use `Date.UTC`.
    else {
        var hour = +match[4] || 0;

        if (match[8].toUpperCase() !== 'Z') {
          hour -= match[8].slice(0, 3);
        }

        return new Date(Date.UTC(+match[1], +(match[2] || 1) - 1, +match[3] || 1, hour, +(match[5] || 0), +match[6] || 0, +match[7] || 0));
      }
  } else if (value == null) {
    return new Date(NaN);
  }

  return new Date(Math.round(value));
}
/**
 * Quantity of a number. e.g. 0.1, 1, 10, 100
 *
 * @param  {number} val
 * @return {number}
 */


function quantity(val) {
  return Math.pow(10, quantityExponent(val));
}

function quantityExponent(val) {
  return Math.floor(Math.log(val) / Math.LN10);
}
/**
 * find a “nice” number approximately equal to x. Round the number if round = true,
 * take ceiling if round = false. The primary observation is that the “nicest”
 * numbers in decimal are 1, 2, and 5, and all power-of-ten multiples of these numbers.
 *
 * See "Nice Numbers for Graph Labels" of Graphic Gems.
 *
 * @param  {number} val Non-negative value.
 * @param  {boolean} round
 * @return {number}
 */


function nice(val, round) {
  var exponent = quantityExponent(val);
  var exp10 = Math.pow(10, exponent);
  var f = val / exp10; // 1 <= f < 10

  var nf;

  if (round) {
    if (f < 1.5) {
      nf = 1;
    } else if (f < 2.5) {
      nf = 2;
    } else if (f < 4) {
      nf = 3;
    } else if (f < 7) {
      nf = 5;
    } else {
      nf = 10;
    }
  } else {
    if (f < 1) {
      nf = 1;
    } else if (f < 2) {
      nf = 2;
    } else if (f < 3) {
      nf = 3;
    } else if (f < 5) {
      nf = 5;
    } else {
      nf = 10;
    }
  }

  val = nf * exp10; // Fix 3 * 0.1 === 0.30000000000000004 issue (see IEEE 754).
  // 20 is the uppper bound of toFixed.

  return exponent >= -20 ? +val.toFixed(exponent < 0 ? -exponent : 0) : val;
}
/**
 * Order intervals asc, and split them when overlap.
 * expect(numberUtil.reformIntervals([
 *     {interval: [18, 62], close: [1, 1]},
 *     {interval: [-Infinity, -70], close: [0, 0]},
 *     {interval: [-70, -26], close: [1, 1]},
 *     {interval: [-26, 18], close: [1, 1]},
 *     {interval: [62, 150], close: [1, 1]},
 *     {interval: [106, 150], close: [1, 1]},
 *     {interval: [150, Infinity], close: [0, 0]}
 * ])).toEqual([
 *     {interval: [-Infinity, -70], close: [0, 0]},
 *     {interval: [-70, -26], close: [1, 1]},
 *     {interval: [-26, 18], close: [0, 1]},
 *     {interval: [18, 62], close: [0, 1]},
 *     {interval: [62, 150], close: [0, 1]},
 *     {interval: [150, Infinity], close: [0, 0]}
 * ]);
 * @param {Array.<Object>} list, where `close` mean open or close
 *        of the interval, and Infinity can be used.
 * @return {Array.<Object>} The origin list, which has been reformed.
 */


function reformIntervals(list) {
  list.sort(function (a, b) {
    return littleThan(a, b, 0) ? -1 : 1;
  });
  var curr = -Infinity;
  var currClose = 1;

  for (var i = 0; i < list.length;) {
    var interval = list[i].interval;
    var close = list[i].close;

    for (var lg = 0; lg < 2; lg++) {
      if (interval[lg] <= curr) {
        interval[lg] = curr;
        close[lg] = !lg ? 1 - currClose : 1;
      }

      curr = interval[lg];
      currClose = close[lg];
    }

    if (interval[0] === interval[1] && close[0] * close[1] !== 1) {
      list.splice(i, 1);
    } else {
      i++;
    }
  }

  return list;

  function littleThan(a, b, lg) {
    return a.interval[lg] < b.interval[lg] || a.interval[lg] === b.interval[lg] && (a.close[lg] - b.close[lg] === (!lg ? 1 : -1) || !lg && littleThan(a, b, 1));
  }
}
/**
 * parseFloat NaNs numeric-cast false positives (null|true|false|"")
 * ...but misinterprets leading-number strings, particularly hex literals ("0x...")
 * subtraction forces infinities to NaN
 *
 * @param {*} v
 * @return {boolean}
 */


function isNumeric(v) {
  return v - parseFloat(v) >= 0;
}

exports.linearMap = linearMap;
exports.parsePercent = parsePercent;
exports.round = round;
exports.asc = asc;
exports.getPrecision = getPrecision;
exports.getPrecisionSafe = getPrecisionSafe;
exports.getPixelPrecision = getPixelPrecision;
exports.getPercentWithPrecision = getPercentWithPrecision;
exports.MAX_SAFE_INTEGER = MAX_SAFE_INTEGER;
exports.remRadian = remRadian;
exports.isRadianAroundZero = isRadianAroundZero;
exports.parseDate = parseDate;
exports.quantity = quantity;
exports.nice = nice;
exports.reformIntervals = reformIntervals;
exports.isNumeric = isNumeric;

/***/ }),
/* 203 */
/***/ (function(module, exports) {

var ArrayCtor = typeof Float32Array === 'undefined' ? Array : Float32Array;
/**
 * 创建一个向量
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @return {Vector2}
 */

function create(x, y) {
  var out = new ArrayCtor(2);

  if (x == null) {
    x = 0;
  }

  if (y == null) {
    y = 0;
  }

  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * 复制向量数据
 * @param {Vector2} out
 * @param {Vector2} v
 * @return {Vector2}
 */


function copy(out, v) {
  out[0] = v[0];
  out[1] = v[1];
  return out;
}
/**
 * 克隆一个向量
 * @param {Vector2} v
 * @return {Vector2}
 */


function clone(v) {
  var out = new ArrayCtor(2);
  out[0] = v[0];
  out[1] = v[1];
  return out;
}
/**
 * 设置向量的两个项
 * @param {Vector2} out
 * @param {number} a
 * @param {number} b
 * @return {Vector2} 结果
 */


function set(out, a, b) {
  out[0] = a;
  out[1] = b;
  return out;
}
/**
 * 向量相加
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */


function add(out, v1, v2) {
  out[0] = v1[0] + v2[0];
  out[1] = v1[1] + v2[1];
  return out;
}
/**
 * 向量缩放后相加
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {number} a
 */


function scaleAndAdd(out, v1, v2, a) {
  out[0] = v1[0] + v2[0] * a;
  out[1] = v1[1] + v2[1] * a;
  return out;
}
/**
 * 向量相减
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */


function sub(out, v1, v2) {
  out[0] = v1[0] - v2[0];
  out[1] = v1[1] - v2[1];
  return out;
}
/**
 * 向量长度
 * @param {Vector2} v
 * @return {number}
 */


function len(v) {
  return Math.sqrt(lenSquare(v));
}

var length = len; // jshint ignore:line

/**
 * 向量长度平方
 * @param {Vector2} v
 * @return {number}
 */

function lenSquare(v) {
  return v[0] * v[0] + v[1] * v[1];
}

var lengthSquare = lenSquare;
/**
 * 向量乘法
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */

function mul(out, v1, v2) {
  out[0] = v1[0] * v2[0];
  out[1] = v1[1] * v2[1];
  return out;
}
/**
 * 向量除法
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */


function div(out, v1, v2) {
  out[0] = v1[0] / v2[0];
  out[1] = v1[1] / v2[1];
  return out;
}
/**
 * 向量点乘
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {number}
 */


function dot(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1];
}
/**
 * 向量缩放
 * @param {Vector2} out
 * @param {Vector2} v
 * @param {number} s
 */


function scale(out, v, s) {
  out[0] = v[0] * s;
  out[1] = v[1] * s;
  return out;
}
/**
 * 向量归一化
 * @param {Vector2} out
 * @param {Vector2} v
 */


function normalize(out, v) {
  var d = len(v);

  if (d === 0) {
    out[0] = 0;
    out[1] = 0;
  } else {
    out[0] = v[0] / d;
    out[1] = v[1] / d;
  }

  return out;
}
/**
 * 计算向量间距离
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {number}
 */


function distance(v1, v2) {
  return Math.sqrt((v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1]));
}

var dist = distance;
/**
 * 向量距离平方
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {number}
 */

function distanceSquare(v1, v2) {
  return (v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1]);
}

var distSquare = distanceSquare;
/**
 * 求负向量
 * @param {Vector2} out
 * @param {Vector2} v
 */

function negate(out, v) {
  out[0] = -v[0];
  out[1] = -v[1];
  return out;
}
/**
 * 插值两个点
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {number} t
 */


function lerp(out, v1, v2, t) {
  out[0] = v1[0] + t * (v2[0] - v1[0]);
  out[1] = v1[1] + t * (v2[1] - v1[1]);
  return out;
}
/**
 * 矩阵左乘向量
 * @param {Vector2} out
 * @param {Vector2} v
 * @param {Vector2} m
 */


function applyTransform(out, v, m) {
  var x = v[0];
  var y = v[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
/**
 * 求两个向量最小值
 * @param  {Vector2} out
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 */


function min(out, v1, v2) {
  out[0] = Math.min(v1[0], v2[0]);
  out[1] = Math.min(v1[1], v2[1]);
  return out;
}
/**
 * 求两个向量最大值
 * @param  {Vector2} out
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 */


function max(out, v1, v2) {
  out[0] = Math.max(v1[0], v2[0]);
  out[1] = Math.max(v1[1], v2[1]);
  return out;
}

exports.create = create;
exports.copy = copy;
exports.clone = clone;
exports.set = set;
exports.add = add;
exports.scaleAndAdd = scaleAndAdd;
exports.sub = sub;
exports.len = len;
exports.length = length;
exports.lenSquare = lenSquare;
exports.lengthSquare = lengthSquare;
exports.mul = mul;
exports.div = div;
exports.dot = dot;
exports.scale = scale;
exports.normalize = normalize;
exports.distance = distance;
exports.dist = dist;
exports.distanceSquare = distanceSquare;
exports.distSquare = distSquare;
exports.negate = negate;
exports.lerp = lerp;
exports.applyTransform = applyTransform;
exports.min = min;
exports.max = max;

/***/ }),
/* 204 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_typeof__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_typeof___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_typeof__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_core_js_object_keys__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_core_js_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_core_js_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__env__ = __webpack_require__(197);







var _this = this;




/* harmony default export */ __webpack_exports__["a"] = ((function () {
	var _ref = __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_asyncToGenerator___default()(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
		var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
		var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
		var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'fetch';
		var dataStr, requestConfig, response, responseJson;
		return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						type = type.toUpperCase();
						url = __WEBPACK_IMPORTED_MODULE_6__env__["c" /* baseUrl */] + url;

						if (type == 'GET') {
							dataStr = '';

							__WEBPACK_IMPORTED_MODULE_4_babel_runtime_core_js_object_keys___default()(data).forEach(function (key) {
								dataStr += key + '=' + data[key] + '&';
							});

							if (dataStr !== '') {
								dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
								url = url + '?' + dataStr;
							}
						}

						if (!(window.fetch && method == 'fetch')) {
							_context.next = 21;
							break;
						}

						requestConfig = {
							credentials: 'include',
							method: type,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'Authorization': 'Bearer ' + __WEBPACK_IMPORTED_MODULE_6__env__["b" /* default */].token
							},
							mode: "cors",
							cache: "no-cache"
						};


						if (type == 'POST') {
							Object.defineProperty(requestConfig, 'body', {
								value: __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify___default()(data)
							});
						}

						_context.prev = 6;
						_context.next = 9;
						return fetch(url, requestConfig);

					case 9:
						response = _context.sent;
						_context.next = 12;
						return response.json();

					case 12:
						responseJson = _context.sent;
						return _context.abrupt('return', responseJson);

					case 16:
						_context.prev = 16;
						_context.t0 = _context['catch'](6);
						throw new Error(_context.t0);

					case 19:
						_context.next = 22;
						break;

					case 21:
						return _context.abrupt('return', new __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
							var requestObj = void 0;
							if (window.XMLHttpRequest) {
								requestObj = new XMLHttpRequest();
							} else {
								requestObj = new ActiveXObject();
							}

							var sendData = '';
							if (type == 'POST') {
								sendData = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify___default()(data);
							}

							requestObj.open(type, url, true);
							requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
							requestObj.send(sendData);

							requestObj.onreadystatechange = function () {
								if (requestObj.readyState == 4) {
									if (requestObj.status == 200) {
										var obj = requestObj.response;
										if ((typeof obj === 'undefined' ? 'undefined' : __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_typeof___default()(obj)) !== 'object') {
											obj = JSON.parse(obj);
										}
										resolve(obj);
									} else {
										reject(requestObj);
									}
								}
							};
						}));

					case 22:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this, [[6, 16]]);
	}));

	return function () {
		return _ref.apply(this, arguments);
	};
})());

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(207), __esModule: true };

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(208), __esModule: true };

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(5);
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(210);
module.exports = __webpack_require__(5).Object.keys;


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(13);
var core = __webpack_require__(5);
var fails = __webpack_require__(17);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(30);
var $keys = __webpack_require__(22);

__webpack_require__(209)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// (1) The code `if (__DEV__) ...` can be removed by build tool.
// (2) If intend to use `__DEV__`, this module should be imported. Use a global
// variable `__DEV__` may cause that miss the declaration (see #6535), or the
// declaration is behind of the using position (for example in `Model.extent`,
// And tools like rollup can not analysis the dependency if not import).
var dev; // In browser

if (typeof window !== 'undefined') {
  dev = window.__DEV__;
} // In node
else if (typeof global !== 'undefined') {
    dev = global.__DEV__;
  }

if (typeof dev === 'undefined') {
  dev = true;
}

var __DEV__ = dev;
exports.__DEV__ = __DEV__;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(31)))

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

var Displayable = __webpack_require__(243);

var zrUtil = __webpack_require__(196);

var PathProxy = __webpack_require__(235);

var pathContain = __webpack_require__(317);

var Pattern = __webpack_require__(266);

var getCanvasPattern = Pattern.prototype.getCanvasPattern;
var abs = Math.abs;
var pathProxyForDraw = new PathProxy(true);
/**
 * @alias module:zrender/graphic/Path
 * @extends module:zrender/graphic/Displayable
 * @constructor
 * @param {Object} opts
 */

function Path(opts) {
  Displayable.call(this, opts);
  /**
   * @type {module:zrender/core/PathProxy}
   * @readOnly
   */

  this.path = null;
}

Path.prototype = {
  constructor: Path,
  type: 'path',
  __dirtyPath: true,
  strokeContainThreshold: 5,
  brush: function (ctx, prevEl) {
    var style = this.style;
    var path = this.path || pathProxyForDraw;
    var hasStroke = style.hasStroke();
    var hasFill = style.hasFill();
    var fill = style.fill;
    var stroke = style.stroke;
    var hasFillGradient = hasFill && !!fill.colorStops;
    var hasStrokeGradient = hasStroke && !!stroke.colorStops;
    var hasFillPattern = hasFill && !!fill.image;
    var hasStrokePattern = hasStroke && !!stroke.image;
    style.bind(ctx, this, prevEl);
    this.setTransform(ctx);

    if (this.__dirty) {
      var rect; // Update gradient because bounding rect may changed

      if (hasFillGradient) {
        rect = rect || this.getBoundingRect();
        this._fillGradient = style.getGradient(ctx, fill, rect);
      }

      if (hasStrokeGradient) {
        rect = rect || this.getBoundingRect();
        this._strokeGradient = style.getGradient(ctx, stroke, rect);
      }
    } // Use the gradient or pattern


    if (hasFillGradient) {
      // PENDING If may have affect the state
      ctx.fillStyle = this._fillGradient;
    } else if (hasFillPattern) {
      ctx.fillStyle = getCanvasPattern.call(fill, ctx);
    }

    if (hasStrokeGradient) {
      ctx.strokeStyle = this._strokeGradient;
    } else if (hasStrokePattern) {
      ctx.strokeStyle = getCanvasPattern.call(stroke, ctx);
    }

    var lineDash = style.lineDash;
    var lineDashOffset = style.lineDashOffset;
    var ctxLineDash = !!ctx.setLineDash; // Update path sx, sy

    var scale = this.getGlobalScale();
    path.setScale(scale[0], scale[1]); // Proxy context
    // Rebuild path in following 2 cases
    // 1. Path is dirty
    // 2. Path needs javascript implemented lineDash stroking.
    //    In this case, lineDash information will not be saved in PathProxy

    if (this.__dirtyPath || lineDash && !ctxLineDash && hasStroke) {
      path.beginPath(ctx); // Setting line dash before build path

      if (lineDash && !ctxLineDash) {
        path.setLineDash(lineDash);
        path.setLineDashOffset(lineDashOffset);
      }

      this.buildPath(path, this.shape, false); // Clear path dirty flag

      if (this.path) {
        this.__dirtyPath = false;
      }
    } else {
      // Replay path building
      ctx.beginPath();
      this.path.rebuildPath(ctx);
    }

    hasFill && path.fill(ctx);

    if (lineDash && ctxLineDash) {
      ctx.setLineDash(lineDash);
      ctx.lineDashOffset = lineDashOffset;
    }

    hasStroke && path.stroke(ctx);

    if (lineDash && ctxLineDash) {
      // PENDING
      // Remove lineDash
      ctx.setLineDash([]);
    }

    this.restoreTransform(ctx); // Draw rect text

    if (style.text != null) {
      this.drawRectText(ctx, this.getBoundingRect());
    }
  },
  // When bundling path, some shape may decide if use moveTo to begin a new subpath or closePath
  // Like in circle
  buildPath: function (ctx, shapeCfg, inBundle) {},
  createPathProxy: function () {
    this.path = new PathProxy();
  },
  getBoundingRect: function () {
    var rect = this._rect;
    var style = this.style;
    var needsUpdateRect = !rect;

    if (needsUpdateRect) {
      var path = this.path;

      if (!path) {
        // Create path on demand.
        path = this.path = new PathProxy();
      }

      if (this.__dirtyPath) {
        path.beginPath();
        this.buildPath(path, this.shape, false);
      }

      rect = path.getBoundingRect();
    }

    this._rect = rect;

    if (style.hasStroke()) {
      // Needs update rect with stroke lineWidth when
      // 1. Element changes scale or lineWidth
      // 2. Shape is changed
      var rectWithStroke = this._rectWithStroke || (this._rectWithStroke = rect.clone());

      if (this.__dirty || needsUpdateRect) {
        rectWithStroke.copy(rect); // FIXME Must after updateTransform

        var w = style.lineWidth; // PENDING, Min line width is needed when line is horizontal or vertical

        var lineScale = style.strokeNoScale ? this.getLineScale() : 1; // Only add extra hover lineWidth when there are no fill

        if (!style.hasFill()) {
          w = Math.max(w, this.strokeContainThreshold || 4);
        } // Consider line width
        // Line scale can't be 0;


        if (lineScale > 1e-10) {
          rectWithStroke.width += w / lineScale;
          rectWithStroke.height += w / lineScale;
          rectWithStroke.x -= w / lineScale / 2;
          rectWithStroke.y -= w / lineScale / 2;
        }
      } // Return rect with stroke


      return rectWithStroke;
    }

    return rect;
  },
  contain: function (x, y) {
    var localPos = this.transformCoordToLocal(x, y);
    var rect = this.getBoundingRect();
    var style = this.style;
    x = localPos[0];
    y = localPos[1];

    if (rect.contain(x, y)) {
      var pathData = this.path.data;

      if (style.hasStroke()) {
        var lineWidth = style.lineWidth;
        var lineScale = style.strokeNoScale ? this.getLineScale() : 1; // Line scale can't be 0;

        if (lineScale > 1e-10) {
          // Only add extra hover lineWidth when there are no fill
          if (!style.hasFill()) {
            lineWidth = Math.max(lineWidth, this.strokeContainThreshold);
          }

          if (pathContain.containStroke(pathData, lineWidth / lineScale, x, y)) {
            return true;
          }
        }
      }

      if (style.hasFill()) {
        return pathContain.contain(pathData, x, y);
      }
    }

    return false;
  },

  /**
   * @param  {boolean} dirtyPath
   */
  dirty: function (dirtyPath) {
    if (dirtyPath == null) {
      dirtyPath = true;
    } // Only mark dirty, not mark clean


    if (dirtyPath) {
      this.__dirtyPath = dirtyPath;
      this._rect = null;
    }

    this.__dirty = true;
    this.__zr && this.__zr.refresh(); // Used as a clipping path

    if (this.__clipTarget) {
      this.__clipTarget.dirty();
    }
  },

  /**
   * Alias for animate('shape')
   * @param {boolean} loop
   */
  animateShape: function (loop) {
    return this.animate('shape', loop);
  },
  // Overwrite attrKV
  attrKV: function (key, value) {
    // FIXME
    if (key === 'shape') {
      this.setShape(value);
      this.__dirtyPath = true;
      this._rect = null;
    } else {
      Displayable.prototype.attrKV.call(this, key, value);
    }
  },

  /**
   * @param {Object|string} key
   * @param {*} value
   */
  setShape: function (key, value) {
    var shape = this.shape; // Path from string may not have shape

    if (shape) {
      if (zrUtil.isObject(key)) {
        for (var name in key) {
          if (key.hasOwnProperty(name)) {
            shape[name] = key[name];
          }
        }
      } else {
        shape[key] = value;
      }

      this.dirty(true);
    }

    return this;
  },
  getLineScale: function () {
    var m = this.transform; // Get the line scale.
    // Determinant of `m` means how much the area is enlarged by the
    // transformation. So its square root can be used as a scale factor
    // for width.

    return m && abs(m[0] - 1) > 1e-10 && abs(m[3] - 1) > 1e-10 ? Math.sqrt(abs(m[0] * m[3] - m[2] * m[1])) : 1;
  }
};
/**
 * 扩展一个 Path element, 比如星形，圆等。
 * Extend a path element
 * @param {Object} props
 * @param {string} props.type Path type
 * @param {Function} props.init Initialize
 * @param {Function} props.buildPath Overwrite buildPath method
 * @param {Object} [props.style] Extended default style config
 * @param {Object} [props.shape] Extended default shape config
 */

Path.extend = function (defaults) {
  var Sub = function (opts) {
    Path.call(this, opts);

    if (defaults.style) {
      // Extend default style
      this.style.extendFrom(defaults.style, false);
    } // Extend default shape


    var defaultShape = defaults.shape;

    if (defaultShape) {
      this.shape = this.shape || {};
      var thisShape = this.shape;

      for (var name in defaultShape) {
        if (!thisShape.hasOwnProperty(name) && defaultShape.hasOwnProperty(name)) {
          thisShape[name] = defaultShape[name];
        }
      }
    }

    defaults.init && defaults.init.call(this, opts);
  };

  zrUtil.inherits(Sub, Path); // FIXME 不能 extend position, rotation 等引用对象

  for (var name in defaults) {
    // Extending prototype values and methods
    if (name !== 'style' && name !== 'shape') {
      Sub.prototype[name] = defaults[name];
    }
  }

  return Sub;
};

zrUtil.inherits(Path, Displayable);
var _default = Path;
module.exports = _default;

/***/ }),
/* 213 */
/***/ (function(module, exports) {

/**
 * echarts设备环境识别
 *
 * @desc echarts基于Canvas，纯Javascript图表库，提供直观，生动，可交互，可个性化定制的数据统计图表。
 * @author firede[firede@firede.us]
 * @desc thanks zepto.
 */
var env = {};

if (typeof navigator === 'undefined') {
  // In node
  env = {
    browser: {},
    os: {},
    node: true,
    // Assume canvas is supported
    canvasSupported: true,
    svgSupported: true
  };
} else {
  env = detect(navigator.userAgent);
}

var _default = env; // Zepto.js
// (c) 2010-2013 Thomas Fuchs
// Zepto.js may be freely distributed under the MIT license.

function detect(ua) {
  var os = {};
  var browser = {}; // var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
  // var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  // var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  // var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  // var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
  // var webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
  // var touchpad = webos && ua.match(/TouchPad/);
  // var kindle = ua.match(/Kindle\/([\d.]+)/);
  // var silk = ua.match(/Silk\/([\d._]+)/);
  // var blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
  // var bb10 = ua.match(/(BB10).*Version\/([\d.]+)/);
  // var rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
  // var playbook = ua.match(/PlayBook/);
  // var chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);

  var firefox = ua.match(/Firefox\/([\d.]+)/); // var safari = webkit && ua.match(/Mobile\//) && !chrome;
  // var webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome;

  var ie = ua.match(/MSIE\s([\d.]+)/) // IE 11 Trident/7.0; rv:11.0
  || ua.match(/Trident\/.+?rv:(([\d.]+))/);
  var edge = ua.match(/Edge\/([\d.]+)/); // IE 12 and 12+

  var weChat = /micromessenger/i.test(ua); // Todo: clean this up with a better OS/browser seperation:
  // - discern (more) between multiple browsers on android
  // - decide if kindle fire in silk mode is android or not
  // - Firefox on Android doesn't specify the Android version
  // - possibly devide in os, device and browser hashes
  // if (browser.webkit = !!webkit) browser.version = webkit[1];
  // if (android) os.android = true, os.version = android[2];
  // if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
  // if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
  // if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
  // if (webos) os.webos = true, os.version = webos[2];
  // if (touchpad) os.touchpad = true;
  // if (blackberry) os.blackberry = true, os.version = blackberry[2];
  // if (bb10) os.bb10 = true, os.version = bb10[2];
  // if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
  // if (playbook) browser.playbook = true;
  // if (kindle) os.kindle = true, os.version = kindle[1];
  // if (silk) browser.silk = true, browser.version = silk[1];
  // if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
  // if (chrome) browser.chrome = true, browser.version = chrome[1];

  if (firefox) {
    browser.firefox = true;
    browser.version = firefox[1];
  } // if (safari && (ua.match(/Safari/) || !!os.ios)) browser.safari = true;
  // if (webview) browser.webview = true;


  if (ie) {
    browser.ie = true;
    browser.version = ie[1];
  }

  if (edge) {
    browser.edge = true;
    browser.version = edge[1];
  } // It is difficult to detect WeChat in Win Phone precisely, because ua can
  // not be set on win phone. So we do not consider Win Phone.


  if (weChat) {
    browser.weChat = true;
  } // os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
  //     (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
  // os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos ||
  //     (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
  //     (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));


  return {
    browser: browser,
    os: os,
    node: false,
    // 原生canvas支持，改极端点了
    // canvasSupported : !(browser.ie && parseFloat(browser.version) < 9)
    canvasSupported: !!document.createElement('canvas').getContext,
    svgSupported: typeof SVGRect !== 'undefined',
    // @see <http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript>
    // works on most browsers
    // IE10/11 does not support touch event, and MS Edge supports them but not by
    // default, so we dont check navigator.maxTouchPoints for them here.
    touchEventsSupported: 'ontouchstart' in window && !browser.ie && !browser.edge,
    // <http://caniuse.com/#search=pointer%20event>.
    pointerEventsSupported: 'onpointerdown' in window // Firefox supports pointer but not by default, only MS browsers are reliable on pointer
    // events currently. So we dont use that on other browsers unless tested sufficiently.
    // Although IE 10 supports pointer event, it use old style and is different from the
    // standard. So we exclude that. (IE 10 is hardly used on touch device)
    && (browser.edge || browser.ie && browser.version >= 11)
  };
}

module.exports = _default;

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

var vec2 = __webpack_require__(203);

var matrix = __webpack_require__(228);

/**
 * @module echarts/core/BoundingRect
 */
var v2ApplyTransform = vec2.applyTransform;
var mathMin = Math.min;
var mathMax = Math.max;
/**
 * @alias module:echarts/core/BoundingRect
 */

function BoundingRect(x, y, width, height) {
  if (width < 0) {
    x = x + width;
    width = -width;
  }

  if (height < 0) {
    y = y + height;
    height = -height;
  }
  /**
   * @type {number}
   */


  this.x = x;
  /**
   * @type {number}
   */

  this.y = y;
  /**
   * @type {number}
   */

  this.width = width;
  /**
   * @type {number}
   */

  this.height = height;
}

BoundingRect.prototype = {
  constructor: BoundingRect,

  /**
   * @param {module:echarts/core/BoundingRect} other
   */
  union: function (other) {
    var x = mathMin(other.x, this.x);
    var y = mathMin(other.y, this.y);
    this.width = mathMax(other.x + other.width, this.x + this.width) - x;
    this.height = mathMax(other.y + other.height, this.y + this.height) - y;
    this.x = x;
    this.y = y;
  },

  /**
   * @param {Array.<number>} m
   * @methods
   */
  applyTransform: function () {
    var lt = [];
    var rb = [];
    var lb = [];
    var rt = [];
    return function (m) {
      // In case usage like this
      // el.getBoundingRect().applyTransform(el.transform)
      // And element has no transform
      if (!m) {
        return;
      }

      lt[0] = lb[0] = this.x;
      lt[1] = rt[1] = this.y;
      rb[0] = rt[0] = this.x + this.width;
      rb[1] = lb[1] = this.y + this.height;
      v2ApplyTransform(lt, lt, m);
      v2ApplyTransform(rb, rb, m);
      v2ApplyTransform(lb, lb, m);
      v2ApplyTransform(rt, rt, m);
      this.x = mathMin(lt[0], rb[0], lb[0], rt[0]);
      this.y = mathMin(lt[1], rb[1], lb[1], rt[1]);
      var maxX = mathMax(lt[0], rb[0], lb[0], rt[0]);
      var maxY = mathMax(lt[1], rb[1], lb[1], rt[1]);
      this.width = maxX - this.x;
      this.height = maxY - this.y;
    };
  }(),

  /**
   * Calculate matrix of transforming from self to target rect
   * @param  {module:zrender/core/BoundingRect} b
   * @return {Array.<number>}
   */
  calculateTransform: function (b) {
    var a = this;
    var sx = b.width / a.width;
    var sy = b.height / a.height;
    var m = matrix.create(); // 矩阵右乘

    matrix.translate(m, m, [-a.x, -a.y]);
    matrix.scale(m, m, [sx, sy]);
    matrix.translate(m, m, [b.x, b.y]);
    return m;
  },

  /**
   * @param {(module:echarts/core/BoundingRect|Object)} b
   * @return {boolean}
   */
  intersect: function (b) {
    if (!b) {
      return false;
    }

    if (!(b instanceof BoundingRect)) {
      // Normalize negative width/height.
      b = BoundingRect.create(b);
    }

    var a = this;
    var ax0 = a.x;
    var ax1 = a.x + a.width;
    var ay0 = a.y;
    var ay1 = a.y + a.height;
    var bx0 = b.x;
    var bx1 = b.x + b.width;
    var by0 = b.y;
    var by1 = b.y + b.height;
    return !(ax1 < bx0 || bx1 < ax0 || ay1 < by0 || by1 < ay0);
  },
  contain: function (x, y) {
    var rect = this;
    return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
  },

  /**
   * @return {module:echarts/core/BoundingRect}
   */
  clone: function () {
    return new BoundingRect(this.x, this.y, this.width, this.height);
  },

  /**
   * Copy from another rect
   */
  copy: function (other) {
    this.x = other.x;
    this.y = other.y;
    this.width = other.width;
    this.height = other.height;
  },
  plain: function () {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
};
/**
 * @param {Object|module:zrender/core/BoundingRect} rect
 * @param {number} rect.x
 * @param {number} rect.y
 * @param {number} rect.width
 * @param {number} rect.height
 * @return {module:zrender/core/BoundingRect}
 */

BoundingRect.create = function (rect) {
  return new BoundingRect(rect.x, rect.y, rect.width, rect.height);
};

var _default = BoundingRect;
module.exports = _default;

/***/ }),
/* 215 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_getData__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config_env__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vuex__ = __webpack_require__(85);










/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			baseImgPath: __WEBPACK_IMPORTED_MODULE_4__config_env__["a" /* baseImgPath */]
		};
	},
	created: function created() {
		if (!this.adminInfo.id) {
			this.getAdminData();
		}
	},

	computed: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_vuex__["b" /* mapState */])(['adminInfo'])),
	methods: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_vuex__["c" /* mapActions */])(['getAdminData']), {
		handleCommand: function handleCommand(command) {
			var _this = this;

			return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
				return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								if (command == 'home') {
									_this.$router.push('/manage');
								} else if (command == 'signout') {
									_this.$message({
										type: 'success',
										message: '退出成功'
									});
									_this.$router.push('/');
									__WEBPACK_IMPORTED_MODULE_4__config_env__["b" /* default */].token = '';
								}

							case 1:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, _this);
			}))();
		}
	})
});

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(178)(false);
// imports


// module
exports.push([module.i, ".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}.header_container{background-color:#eff2f7;height:60px;display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:center;align-items:center;padding-left:20px}.avator{width:36px;height:36px;border-radius:50%;margin-right:37px}.el-dropdown-menu__item{text-align:center}", ""]);

// exports


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var textContain = __webpack_require__(225);

var numberUtil = __webpack_require__(202);

/**
 * 每三位默认加,格式化
 * @param {string|number} x
 * @return {string}
 */
function addCommas(x) {
  if (isNaN(x)) {
    return '-';
  }

  x = (x + '').split('.');
  return x[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + (x.length > 1 ? '.' + x[1] : '');
}
/**
 * @param {string} str
 * @param {boolean} [upperCaseFirst=false]
 * @return {string} str
 */


function toCamelCase(str, upperCaseFirst) {
  str = (str || '').toLowerCase().replace(/-(.)/g, function (match, group1) {
    return group1.toUpperCase();
  });

  if (upperCaseFirst && str) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }

  return str;
}

var normalizeCssArray = zrUtil.normalizeCssArray;

function encodeHTML(source) {
  return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

var TPL_VAR_ALIAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

var wrapVar = function (varName, seriesIdx) {
  return '{' + varName + (seriesIdx == null ? '' : seriesIdx) + '}';
};
/**
 * Template formatter
 * @param {string} tpl
 * @param {Array.<Object>|Object} paramsList
 * @param {boolean} [encode=false]
 * @return {string}
 */


function formatTpl(tpl, paramsList, encode) {
  if (!zrUtil.isArray(paramsList)) {
    paramsList = [paramsList];
  }

  var seriesLen = paramsList.length;

  if (!seriesLen) {
    return '';
  }

  var $vars = paramsList[0].$vars || [];

  for (var i = 0; i < $vars.length; i++) {
    var alias = TPL_VAR_ALIAS[i];
    var val = wrapVar(alias, 0);
    tpl = tpl.replace(wrapVar(alias), encode ? encodeHTML(val) : val);
  }

  for (var seriesIdx = 0; seriesIdx < seriesLen; seriesIdx++) {
    for (var k = 0; k < $vars.length; k++) {
      var val = paramsList[seriesIdx][$vars[k]];
      tpl = tpl.replace(wrapVar(TPL_VAR_ALIAS[k], seriesIdx), encode ? encodeHTML(val) : val);
    }
  }

  return tpl;
}
/**
 * simple Template formatter
 *
 * @param {string} tpl
 * @param {Object} param
 * @param {boolean} [encode=false]
 * @return {string}
 */


function formatTplSimple(tpl, param, encode) {
  zrUtil.each(param, function (value, key) {
    tpl = tpl.replace('{' + key + '}', encode ? encodeHTML(value) : value);
  });
  return tpl;
}
/**
 * @param {string} color
 * @param {string} [extraCssText]
 * @return {string}
 */


function getTooltipMarker(color, extraCssText) {
  return color ? '<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + encodeHTML(color) + ';' + (extraCssText || '') + '"></span>' : '';
}
/**
 * @param {string} str
 * @return {string}
 * @inner
 */


var s2d = function (str) {
  return str < 10 ? '0' + str : str;
};
/**
 * ISO Date format
 * @param {string} tpl
 * @param {number} value
 * @param {boolean} [isUTC=false] Default in local time.
 *           see `module:echarts/scale/Time`
 *           and `module:echarts/util/number#parseDate`.
 * @inner
 */


function formatTime(tpl, value, isUTC) {
  if (tpl === 'week' || tpl === 'month' || tpl === 'quarter' || tpl === 'half-year' || tpl === 'year') {
    tpl = 'MM-dd\nyyyy';
  }

  var date = numberUtil.parseDate(value);
  var utc = isUTC ? 'UTC' : '';
  var y = date['get' + utc + 'FullYear']();
  var M = date['get' + utc + 'Month']() + 1;
  var d = date['get' + utc + 'Date']();
  var h = date['get' + utc + 'Hours']();
  var m = date['get' + utc + 'Minutes']();
  var s = date['get' + utc + 'Seconds']();
  tpl = tpl.replace('MM', s2d(M)).replace('M', M).replace('yyyy', y).replace('yy', y % 100).replace('dd', s2d(d)).replace('d', d).replace('hh', s2d(h)).replace('h', h).replace('mm', s2d(m)).replace('m', m).replace('ss', s2d(s)).replace('s', s);
  return tpl;
}
/**
 * Capital first
 * @param {string} str
 * @return {string}
 */


function capitalFirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.substr(1) : str;
}

var truncateText = textContain.truncateText;
var getTextRect = textContain.getBoundingRect;
exports.addCommas = addCommas;
exports.toCamelCase = toCamelCase;
exports.normalizeCssArray = normalizeCssArray;
exports.encodeHTML = encodeHTML;
exports.formatTpl = formatTpl;
exports.formatTplSimple = formatTplSimple;
exports.getTooltipMarker = getTooltipMarker;
exports.formatTime = formatTime;
exports.capitalFirst = capitalFirst;
exports.truncateText = truncateText;
exports.getTextRect = getTextRect;

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(216);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(179)("019239ba", content, true);

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(218)

var Component = __webpack_require__(83)(
  /* script */
  __webpack_require__(215),
  /* template */
  __webpack_require__(220),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 220 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "header_container"
  }, [_c('el-breadcrumb', {
    attrs: {
      "separator": "/"
    }
  }, [_c('el-breadcrumb-item', {
    attrs: {
      "to": {
        path: '/manage'
      }
    }
  }, [_vm._v("首页")]), _vm._v(" "), _vm._l((_vm.$route.meta), function(item, index) {
    return _c('el-breadcrumb-item', {
      key: index
    }, [_vm._v(_vm._s(item))])
  })], 2), _vm._v(" "), _c('el-dropdown', {
    attrs: {
      "menu-align": "start"
    },
    on: {
      "command": _vm.handleCommand
    }
  }, [_c('img', {
    staticClass: "avator",
    attrs: {
      "src": _vm.baseImgPath + _vm.adminInfo.avatar
    }
  }), _vm._v(" "), _c('el-dropdown-menu', {
    attrs: {
      "slot": "dropdown"
    },
    slot: "dropdown"
  }, [_c('el-dropdown-item', {
    attrs: {
      "command": "home"
    }
  }, [_vm._v("首页")]), _vm._v(" "), _c('el-dropdown-item', {
    attrs: {
      "command": "signout"
    }
  }, [_vm._v("退出")])], 1)], 1)], 1)
},staticRenderFns: []}

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var env = __webpack_require__(213);

var clazzUtil = __webpack_require__(222);

var lineStyleMixin = __webpack_require__(298);

var areaStyleMixin = __webpack_require__(295);

var textStyleMixin = __webpack_require__(299);

var itemStyleMixin = __webpack_require__(297);

/**
 * @module echarts/model/Model
 */
var mixin = zrUtil.mixin;
/**
 * @alias module:echarts/model/Model
 * @constructor
 * @param {Object} option
 * @param {module:echarts/model/Model} [parentModel]
 * @param {module:echarts/model/Global} [ecModel]
 */

function Model(option, parentModel, ecModel) {
  /**
   * @type {module:echarts/model/Model}
   * @readOnly
   */
  this.parentModel = parentModel;
  /**
   * @type {module:echarts/model/Global}
   * @readOnly
   */

  this.ecModel = ecModel;
  /**
   * @type {Object}
   * @protected
   */

  this.option = option; // Simple optimization
  // if (this.init) {
  //     if (arguments.length <= 4) {
  //         this.init(option, parentModel, ecModel, extraOpt);
  //     }
  //     else {
  //         this.init.apply(this, arguments);
  //     }
  // }
}

Model.prototype = {
  constructor: Model,

  /**
   * Model 的初始化函数
   * @param {Object} option
   */
  init: null,

  /**
   * 从新的 Option merge
   */
  mergeOption: function (option) {
    zrUtil.merge(this.option, option, true);
  },

  /**
   * @param {string|Array.<string>} path
   * @param {boolean} [ignoreParent=false]
   * @return {*}
   */
  get: function (path, ignoreParent) {
    if (path == null) {
      return this.option;
    }

    return doGet(this.option, this.parsePath(path), !ignoreParent && getParent(this, path));
  },

  /**
   * @param {string} key
   * @param {boolean} [ignoreParent=false]
   * @return {*}
   */
  getShallow: function (key, ignoreParent) {
    var option = this.option;
    var val = option == null ? option : option[key];
    var parentModel = !ignoreParent && getParent(this, key);

    if (val == null && parentModel) {
      val = parentModel.getShallow(key);
    }

    return val;
  },

  /**
   * @param {string|Array.<string>} [path]
   * @param {module:echarts/model/Model} [parentModel]
   * @return {module:echarts/model/Model}
   */
  getModel: function (path, parentModel) {
    var obj = path == null ? this.option : doGet(this.option, path = this.parsePath(path));
    var thisParentModel;
    parentModel = parentModel || (thisParentModel = getParent(this, path)) && thisParentModel.getModel(path);
    return new Model(obj, parentModel, this.ecModel);
  },

  /**
   * If model has option
   */
  isEmpty: function () {
    return this.option == null;
  },
  restoreData: function () {},
  // Pending
  clone: function () {
    var Ctor = this.constructor;
    return new Ctor(zrUtil.clone(this.option));
  },
  setReadOnly: function (properties) {
    clazzUtil.setReadOnly(this, properties);
  },
  // If path is null/undefined, return null/undefined.
  parsePath: function (path) {
    if (typeof path === 'string') {
      path = path.split('.');
    }

    return path;
  },

  /**
   * @param {Function} getParentMethod
   *        param {Array.<string>|string} path
   *        return {module:echarts/model/Model}
   */
  customizeGetParent: function (getParentMethod) {
    clazzUtil.set(this, 'getParent', getParentMethod);
  },
  isAnimationEnabled: function () {
    if (!env.node) {
      if (this.option.animation != null) {
        return !!this.option.animation;
      } else if (this.parentModel) {
        return this.parentModel.isAnimationEnabled();
      }
    }
  }
};

function doGet(obj, pathArr, parentModel) {
  for (var i = 0; i < pathArr.length; i++) {
    // Ignore empty
    if (!pathArr[i]) {
      continue;
    } // obj could be number/string/... (like 0)


    obj = obj && typeof obj === 'object' ? obj[pathArr[i]] : null;

    if (obj == null) {
      break;
    }
  }

  if (obj == null && parentModel) {
    obj = parentModel.get(pathArr);
  }

  return obj;
} // `path` can be null/undefined


function getParent(model, path) {
  var getParentMethod = clazzUtil.get(model, 'getParent');
  return getParentMethod ? getParentMethod.call(model, path) : model.parentModel;
} // Enable Model.extend.


clazzUtil.enableClassExtend(Model);
mixin(Model, lineStyleMixin);
mixin(Model, areaStyleMixin);
mixin(Model, textStyleMixin);
mixin(Model, itemStyleMixin);
var _default = Model;
module.exports = _default;

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

var _config = __webpack_require__(211);

var __DEV__ = _config.__DEV__;

var zrUtil = __webpack_require__(196);

var TYPE_DELIMITER = '.';
var IS_CONTAINER = '___EC__COMPONENT__CONTAINER___';
var MEMBER_PRIFIX = '\0ec_\0';
/**
 * Hide private class member.
 * The same behavior as `host[name] = value;` (can be right-value)
 * @public
 */

function set(host, name, value) {
  return host[MEMBER_PRIFIX + name] = value;
}
/**
 * Hide private class member.
 * The same behavior as `host[name];`
 * @public
 */


function get(host, name) {
  return host[MEMBER_PRIFIX + name];
}
/**
 * For hidden private class member.
 * The same behavior as `host.hasOwnProperty(name);`
 * @public
 */


function hasOwn(host, name) {
  return host.hasOwnProperty(MEMBER_PRIFIX + name);
}
/**
 * Notice, parseClassType('') should returns {main: '', sub: ''}
 * @public
 */


function parseClassType(componentType) {
  var ret = {
    main: '',
    sub: ''
  };

  if (componentType) {
    componentType = componentType.split(TYPE_DELIMITER);
    ret.main = componentType[0] || '';
    ret.sub = componentType[1] || '';
  }

  return ret;
}
/**
 * @public
 */


function checkClassType(componentType) {
  zrUtil.assert(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(componentType), 'componentType "' + componentType + '" illegal');
}
/**
 * @public
 */


function enableClassExtend(RootClass, mandatoryMethods) {
  RootClass.$constructor = RootClass;

  RootClass.extend = function (proto) {
    var superClass = this;

    var ExtendedClass = function () {
      if (!proto.$constructor) {
        superClass.apply(this, arguments);
      } else {
        proto.$constructor.apply(this, arguments);
      }
    };

    zrUtil.extend(ExtendedClass.prototype, proto);
    ExtendedClass.extend = this.extend;
    ExtendedClass.superCall = superCall;
    ExtendedClass.superApply = superApply;
    zrUtil.inherits(ExtendedClass, this);
    ExtendedClass.superClass = superClass;
    return ExtendedClass;
  };
} // superCall should have class info, which can not be fetch from 'this'.
// Consider this case:
// class A has method f,
// class B inherits class A, overrides method f, f call superApply('f'),
// class C inherits class B, do not overrides method f,
// then when method of class C is called, dead loop occured.


function superCall(context, methodName) {
  var args = zrUtil.slice(arguments, 2);
  return this.superClass.prototype[methodName].apply(context, args);
}

function superApply(context, methodName, args) {
  return this.superClass.prototype[methodName].apply(context, args);
}
/**
 * @param {Object} entity
 * @param {Object} options
 * @param {boolean} [options.registerWhenExtend]
 * @public
 */


function enableClassManagement(entity, options) {
  options = options || {};
  /**
   * Component model classes
   * key: componentType,
   * value:
   *     componentClass, when componentType is 'xxx'
   *     or Object.<subKey, componentClass>, when componentType is 'xxx.yy'
   * @type {Object}
   */

  var storage = {};

  entity.registerClass = function (Clazz, componentType) {
    if (componentType) {
      checkClassType(componentType);
      componentType = parseClassType(componentType);

      if (!componentType.sub) {
        storage[componentType.main] = Clazz;
      } else if (componentType.sub !== IS_CONTAINER) {
        var container = makeContainer(componentType);
        container[componentType.sub] = Clazz;
      }
    }

    return Clazz;
  };

  entity.getClass = function (componentMainType, subType, throwWhenNotFound) {
    var Clazz = storage[componentMainType];

    if (Clazz && Clazz[IS_CONTAINER]) {
      Clazz = subType ? Clazz[subType] : null;
    }

    if (throwWhenNotFound && !Clazz) {
      throw new Error(!subType ? componentMainType + '.' + 'type should be specified.' : 'Component ' + componentMainType + '.' + (subType || '') + ' not exists. Load it first.');
    }

    return Clazz;
  };

  entity.getClassesByMainType = function (componentType) {
    componentType = parseClassType(componentType);
    var result = [];
    var obj = storage[componentType.main];

    if (obj && obj[IS_CONTAINER]) {
      zrUtil.each(obj, function (o, type) {
        type !== IS_CONTAINER && result.push(o);
      });
    } else {
      result.push(obj);
    }

    return result;
  };

  entity.hasClass = function (componentType) {
    // Just consider componentType.main.
    componentType = parseClassType(componentType);
    return !!storage[componentType.main];
  };
  /**
   * @return {Array.<string>} Like ['aa', 'bb'], but can not be ['aa.xx']
   */


  entity.getAllClassMainTypes = function () {
    var types = [];
    zrUtil.each(storage, function (obj, type) {
      types.push(type);
    });
    return types;
  };
  /**
   * If a main type is container and has sub types
   * @param  {string}  mainType
   * @return {boolean}
   */


  entity.hasSubTypes = function (componentType) {
    componentType = parseClassType(componentType);
    var obj = storage[componentType.main];
    return obj && obj[IS_CONTAINER];
  };

  entity.parseClassType = parseClassType;

  function makeContainer(componentType) {
    var container = storage[componentType.main];

    if (!container || !container[IS_CONTAINER]) {
      container = storage[componentType.main] = {};
      container[IS_CONTAINER] = true;
    }

    return container;
  }

  if (options.registerWhenExtend) {
    var originalExtend = entity.extend;

    if (originalExtend) {
      entity.extend = function (proto) {
        var ExtendedClass = originalExtend.call(this, proto);
        return entity.registerClass(ExtendedClass, proto.type);
      };
    }
  }

  return entity;
}
/**
 * @param {string|Array.<string>} properties
 */


function setReadOnly(obj, properties) {// FIXME It seems broken in IE8 simulation of IE11
  // if (!zrUtil.isArray(properties)) {
  //     properties = properties != null ? [properties] : [];
  // }
  // zrUtil.each(properties, function (prop) {
  //     var value = obj[prop];
  //     Object.defineProperty
  //         && Object.defineProperty(obj, prop, {
  //             value: value, writable: false
  //         });
  //     zrUtil.isArray(obj[prop])
  //         && Object.freeze
  //         && Object.freeze(obj[prop]);
  // });
}

exports.set = set;
exports.get = get;
exports.hasOwn = hasOwn;
exports.parseClassType = parseClassType;
exports.enableClassExtend = enableClassExtend;
exports.enableClassManagement = enableClassManagement;
exports.setReadOnly = setReadOnly;

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var Model = __webpack_require__(221);

var componentUtil = __webpack_require__(240);

var clazzUtil = __webpack_require__(222);

var layout = __webpack_require__(224);

var boxLayoutMixin = __webpack_require__(296);

/**
 * Component model
 *
 * @module echarts/model/Component
 */
var arrayPush = Array.prototype.push;
/**
 * @alias module:echarts/model/Component
 * @constructor
 * @param {Object} option
 * @param {module:echarts/model/Model} parentModel
 * @param {module:echarts/model/Model} ecModel
 */

var ComponentModel = Model.extend({
  type: 'component',

  /**
   * @readOnly
   * @type {string}
   */
  id: '',

  /**
   * @readOnly
   */
  name: '',

  /**
   * @readOnly
   * @type {string}
   */
  mainType: '',

  /**
   * @readOnly
   * @type {string}
   */
  subType: '',

  /**
   * @readOnly
   * @type {number}
   */
  componentIndex: 0,

  /**
   * @type {Object}
   * @protected
   */
  defaultOption: null,

  /**
   * @type {module:echarts/model/Global}
   * @readOnly
   */
  ecModel: null,

  /**
   * key: componentType
   * value:  Component model list, can not be null.
   * @type {Object.<string, Array.<module:echarts/model/Model>>}
   * @readOnly
   */
  dependentModels: [],

  /**
   * @type {string}
   * @readOnly
   */
  uid: null,

  /**
   * Support merge layout params.
   * Only support 'box' now (left/right/top/bottom/width/height).
   * @type {string|Object} Object can be {ignoreSize: true}
   * @readOnly
   */
  layoutMode: null,
  $constructor: function (option, parentModel, ecModel, extraOpt) {
    Model.call(this, option, parentModel, ecModel, extraOpt);
    this.uid = componentUtil.getUID('componentModel');
  },
  init: function (option, parentModel, ecModel, extraOpt) {
    this.mergeDefaultAndTheme(option, ecModel);
  },
  mergeDefaultAndTheme: function (option, ecModel) {
    var layoutMode = this.layoutMode;
    var inputPositionParams = layoutMode ? layout.getLayoutParams(option) : {};
    var themeModel = ecModel.getTheme();
    zrUtil.merge(option, themeModel.get(this.mainType));
    zrUtil.merge(option, this.getDefaultOption());

    if (layoutMode) {
      layout.mergeLayoutParam(option, inputPositionParams, layoutMode);
    }
  },
  mergeOption: function (option, extraOpt) {
    zrUtil.merge(this.option, option, true);
    var layoutMode = this.layoutMode;

    if (layoutMode) {
      layout.mergeLayoutParam(this.option, option, layoutMode);
    }
  },
  // Hooker after init or mergeOption
  optionUpdated: function (newCptOption, isInit) {},
  getDefaultOption: function () {
    if (!clazzUtil.hasOwn(this, '__defaultOption')) {
      var optList = [];
      var Class = this.constructor;

      while (Class) {
        var opt = Class.prototype.defaultOption;
        opt && optList.push(opt);
        Class = Class.superClass;
      }

      var defaultOption = {};

      for (var i = optList.length - 1; i >= 0; i--) {
        defaultOption = zrUtil.merge(defaultOption, optList[i], true);
      }

      clazzUtil.set(this, '__defaultOption', defaultOption);
    }

    return clazzUtil.get(this, '__defaultOption');
  },
  getReferringComponents: function (mainType) {
    return this.ecModel.queryComponents({
      mainType: mainType,
      index: this.get(mainType + 'Index', true),
      id: this.get(mainType + 'Id', true)
    });
  }
}); // Reset ComponentModel.extend, add preConstruct.
// clazzUtil.enableClassExtend(
//     ComponentModel,
//     function (option, parentModel, ecModel, extraOpt) {
//         // Set dependentModels, componentIndex, name, id, mainType, subType.
//         zrUtil.extend(this, extraOpt);
//         this.uid = componentUtil.getUID('componentModel');
//         // this.setReadOnly([
//         //     'type', 'id', 'uid', 'name', 'mainType', 'subType',
//         //     'dependentModels', 'componentIndex'
//         // ]);
//     }
// );
// Add capability of registerClass, getClass, hasClass, registerSubTypeDefaulter and so on.

clazzUtil.enableClassManagement(ComponentModel, {
  registerWhenExtend: true
});
componentUtil.enableSubTypeDefaulter(ComponentModel); // Add capability of ComponentModel.topologicalTravel.

componentUtil.enableTopologicalTravel(ComponentModel, getDependencies);

function getDependencies(componentType) {
  var deps = [];
  zrUtil.each(ComponentModel.getClassesByMainType(componentType), function (Clazz) {
    arrayPush.apply(deps, Clazz.prototype.dependencies || []);
  }); // Ensure main type

  return zrUtil.map(deps, function (type) {
    return clazzUtil.parseClassType(type).main;
  });
}

zrUtil.mixin(ComponentModel, boxLayoutMixin);
var _default = ComponentModel;
module.exports = _default;

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var BoundingRect = __webpack_require__(214);

var _number = __webpack_require__(202);

var parsePercent = _number.parsePercent;

var formatUtil = __webpack_require__(217);

// Layout helpers for each component positioning
var each = zrUtil.each;
/**
 * @public
 */

var LOCATION_PARAMS = ['left', 'right', 'top', 'bottom', 'width', 'height'];
/**
 * @public
 */

var HV_NAMES = [['width', 'left', 'right'], ['height', 'top', 'bottom']];

function boxLayout(orient, group, gap, maxWidth, maxHeight) {
  var x = 0;
  var y = 0;

  if (maxWidth == null) {
    maxWidth = Infinity;
  }

  if (maxHeight == null) {
    maxHeight = Infinity;
  }

  var currentLineMaxSize = 0;
  group.eachChild(function (child, idx) {
    var position = child.position;
    var rect = child.getBoundingRect();
    var nextChild = group.childAt(idx + 1);
    var nextChildRect = nextChild && nextChild.getBoundingRect();
    var nextX;
    var nextY;

    if (orient === 'horizontal') {
      var moveX = rect.width + (nextChildRect ? -nextChildRect.x + rect.x : 0);
      nextX = x + moveX; // Wrap when width exceeds maxWidth or meet a `newline` group
      // FIXME compare before adding gap?

      if (nextX > maxWidth || child.newline) {
        x = 0;
        nextX = moveX;
        y += currentLineMaxSize + gap;
        currentLineMaxSize = rect.height;
      } else {
        // FIXME: consider rect.y is not `0`?
        currentLineMaxSize = Math.max(currentLineMaxSize, rect.height);
      }
    } else {
      var moveY = rect.height + (nextChildRect ? -nextChildRect.y + rect.y : 0);
      nextY = y + moveY; // Wrap when width exceeds maxHeight or meet a `newline` group

      if (nextY > maxHeight || child.newline) {
        x += currentLineMaxSize + gap;
        y = 0;
        nextY = moveY;
        currentLineMaxSize = rect.width;
      } else {
        currentLineMaxSize = Math.max(currentLineMaxSize, rect.width);
      }
    }

    if (child.newline) {
      return;
    }

    position[0] = x;
    position[1] = y;
    orient === 'horizontal' ? x = nextX + gap : y = nextY + gap;
  });
}
/**
 * VBox or HBox layouting
 * @param {string} orient
 * @param {module:zrender/container/Group} group
 * @param {number} gap
 * @param {number} [width=Infinity]
 * @param {number} [height=Infinity]
 */


var box = boxLayout;
/**
 * VBox layouting
 * @param {module:zrender/container/Group} group
 * @param {number} gap
 * @param {number} [width=Infinity]
 * @param {number} [height=Infinity]
 */

var vbox = zrUtil.curry(boxLayout, 'vertical');
/**
 * HBox layouting
 * @param {module:zrender/container/Group} group
 * @param {number} gap
 * @param {number} [width=Infinity]
 * @param {number} [height=Infinity]
 */

var hbox = zrUtil.curry(boxLayout, 'horizontal');
/**
 * If x or x2 is not specified or 'center' 'left' 'right',
 * the width would be as long as possible.
 * If y or y2 is not specified or 'middle' 'top' 'bottom',
 * the height would be as long as possible.
 *
 * @param {Object} positionInfo
 * @param {number|string} [positionInfo.x]
 * @param {number|string} [positionInfo.y]
 * @param {number|string} [positionInfo.x2]
 * @param {number|string} [positionInfo.y2]
 * @param {Object} containerRect {width, height}
 * @param {string|number} margin
 * @return {Object} {width, height}
 */

function getAvailableSize(positionInfo, containerRect, margin) {
  var containerWidth = containerRect.width;
  var containerHeight = containerRect.height;
  var x = parsePercent(positionInfo.x, containerWidth);
  var y = parsePercent(positionInfo.y, containerHeight);
  var x2 = parsePercent(positionInfo.x2, containerWidth);
  var y2 = parsePercent(positionInfo.y2, containerHeight);
  (isNaN(x) || isNaN(parseFloat(positionInfo.x))) && (x = 0);
  (isNaN(x2) || isNaN(parseFloat(positionInfo.x2))) && (x2 = containerWidth);
  (isNaN(y) || isNaN(parseFloat(positionInfo.y))) && (y = 0);
  (isNaN(y2) || isNaN(parseFloat(positionInfo.y2))) && (y2 = containerHeight);
  margin = formatUtil.normalizeCssArray(margin || 0);
  return {
    width: Math.max(x2 - x - margin[1] - margin[3], 0),
    height: Math.max(y2 - y - margin[0] - margin[2], 0)
  };
}
/**
 * Parse position info.
 *
 * @param {Object} positionInfo
 * @param {number|string} [positionInfo.left]
 * @param {number|string} [positionInfo.top]
 * @param {number|string} [positionInfo.right]
 * @param {number|string} [positionInfo.bottom]
 * @param {number|string} [positionInfo.width]
 * @param {number|string} [positionInfo.height]
 * @param {number|string} [positionInfo.aspect] Aspect is width / height
 * @param {Object} containerRect
 * @param {string|number} [margin]
 *
 * @return {module:zrender/core/BoundingRect}
 */


function getLayoutRect(positionInfo, containerRect, margin) {
  margin = formatUtil.normalizeCssArray(margin || 0);
  var containerWidth = containerRect.width;
  var containerHeight = containerRect.height;
  var left = parsePercent(positionInfo.left, containerWidth);
  var top = parsePercent(positionInfo.top, containerHeight);
  var right = parsePercent(positionInfo.right, containerWidth);
  var bottom = parsePercent(positionInfo.bottom, containerHeight);
  var width = parsePercent(positionInfo.width, containerWidth);
  var height = parsePercent(positionInfo.height, containerHeight);
  var verticalMargin = margin[2] + margin[0];
  var horizontalMargin = margin[1] + margin[3];
  var aspect = positionInfo.aspect; // If width is not specified, calculate width from left and right

  if (isNaN(width)) {
    width = containerWidth - right - horizontalMargin - left;
  }

  if (isNaN(height)) {
    height = containerHeight - bottom - verticalMargin - top;
  }

  if (aspect != null) {
    // If width and height are not given
    // 1. Graph should not exceeds the container
    // 2. Aspect must be keeped
    // 3. Graph should take the space as more as possible
    // FIXME
    // Margin is not considered, because there is no case that both
    // using margin and aspect so far.
    if (isNaN(width) && isNaN(height)) {
      if (aspect > containerWidth / containerHeight) {
        width = containerWidth * 0.8;
      } else {
        height = containerHeight * 0.8;
      }
    } // Calculate width or height with given aspect


    if (isNaN(width)) {
      width = aspect * height;
    }

    if (isNaN(height)) {
      height = width / aspect;
    }
  } // If left is not specified, calculate left from right and width


  if (isNaN(left)) {
    left = containerWidth - right - width - horizontalMargin;
  }

  if (isNaN(top)) {
    top = containerHeight - bottom - height - verticalMargin;
  } // Align left and top


  switch (positionInfo.left || positionInfo.right) {
    case 'center':
      left = containerWidth / 2 - width / 2 - margin[3];
      break;

    case 'right':
      left = containerWidth - width - horizontalMargin;
      break;
  }

  switch (positionInfo.top || positionInfo.bottom) {
    case 'middle':
    case 'center':
      top = containerHeight / 2 - height / 2 - margin[0];
      break;

    case 'bottom':
      top = containerHeight - height - verticalMargin;
      break;
  } // If something is wrong and left, top, width, height are calculated as NaN


  left = left || 0;
  top = top || 0;

  if (isNaN(width)) {
    // Width may be NaN if only one value is given except width
    width = containerWidth - horizontalMargin - left - (right || 0);
  }

  if (isNaN(height)) {
    // Height may be NaN if only one value is given except height
    height = containerHeight - verticalMargin - top - (bottom || 0);
  }

  var rect = new BoundingRect(left + margin[3], top + margin[0], width, height);
  rect.margin = margin;
  return rect;
}
/**
 * Position a zr element in viewport
 *  Group position is specified by either
 *  {left, top}, {right, bottom}
 *  If all properties exists, right and bottom will be igonred.
 *
 * Logic:
 *     1. Scale (against origin point in parent coord)
 *     2. Rotate (against origin point in parent coord)
 *     3. Traslate (with el.position by this method)
 * So this method only fixes the last step 'Traslate', which does not affect
 * scaling and rotating.
 *
 * If be called repeatly with the same input el, the same result will be gotten.
 *
 * @param {module:zrender/Element} el Should have `getBoundingRect` method.
 * @param {Object} positionInfo
 * @param {number|string} [positionInfo.left]
 * @param {number|string} [positionInfo.top]
 * @param {number|string} [positionInfo.right]
 * @param {number|string} [positionInfo.bottom]
 * @param {number|string} [positionInfo.width] Only for opt.boundingModel: 'raw'
 * @param {number|string} [positionInfo.height] Only for opt.boundingModel: 'raw'
 * @param {Object} containerRect
 * @param {string|number} margin
 * @param {Object} [opt]
 * @param {Array.<number>} [opt.hv=[1,1]] Only horizontal or only vertical.
 * @param {Array.<number>} [opt.boundingMode='all']
 *        Specify how to calculate boundingRect when locating.
 *        'all': Position the boundingRect that is transformed and uioned
 *               both itself and its descendants.
 *               This mode simplies confine the elements in the bounding
 *               of their container (e.g., using 'right: 0').
 *        'raw': Position the boundingRect that is not transformed and only itself.
 *               This mode is useful when you want a element can overflow its
 *               container. (Consider a rotated circle needs to be located in a corner.)
 *               In this mode positionInfo.width/height can only be number.
 */


function positionElement(el, positionInfo, containerRect, margin, opt) {
  var h = !opt || !opt.hv || opt.hv[0];
  var v = !opt || !opt.hv || opt.hv[1];
  var boundingMode = opt && opt.boundingMode || 'all';

  if (!h && !v) {
    return;
  }

  var rect;

  if (boundingMode === 'raw') {
    rect = el.type === 'group' ? new BoundingRect(0, 0, +positionInfo.width || 0, +positionInfo.height || 0) : el.getBoundingRect();
  } else {
    rect = el.getBoundingRect();

    if (el.needLocalTransform()) {
      var transform = el.getLocalTransform(); // Notice: raw rect may be inner object of el,
      // which should not be modified.

      rect = rect.clone();
      rect.applyTransform(transform);
    }
  } // The real width and height can not be specified but calculated by the given el.


  positionInfo = getLayoutRect(zrUtil.defaults({
    width: rect.width,
    height: rect.height
  }, positionInfo), containerRect, margin); // Because 'tranlate' is the last step in transform
  // (see zrender/core/Transformable#getLocalTransfrom),
  // we can just only modify el.position to get final result.

  var elPos = el.position;
  var dx = h ? positionInfo.x - rect.x : 0;
  var dy = v ? positionInfo.y - rect.y : 0;
  el.attr('position', boundingMode === 'raw' ? [dx, dy] : [elPos[0] + dx, elPos[1] + dy]);
}
/**
 * @param {Object} option Contains some of the properties in HV_NAMES.
 * @param {number} hvIdx 0: horizontal; 1: vertical.
 */


function sizeCalculable(option, hvIdx) {
  return option[HV_NAMES[hvIdx][0]] != null || option[HV_NAMES[hvIdx][1]] != null && option[HV_NAMES[hvIdx][2]] != null;
}
/**
 * Consider Case:
 * When defulat option has {left: 0, width: 100}, and we set {right: 0}
 * through setOption or media query, using normal zrUtil.merge will cause
 * {right: 0} does not take effect.
 *
 * @example
 * ComponentModel.extend({
 *     init: function () {
 *         ...
 *         var inputPositionParams = layout.getLayoutParams(option);
 *         this.mergeOption(inputPositionParams);
 *     },
 *     mergeOption: function (newOption) {
 *         newOption && zrUtil.merge(thisOption, newOption, true);
 *         layout.mergeLayoutParam(thisOption, newOption);
 *     }
 * });
 *
 * @param {Object} targetOption
 * @param {Object} newOption
 * @param {Object|string} [opt]
 * @param {boolean|Array.<boolean>} [opt.ignoreSize=false] Used for the components
 *  that width (or height) should not be calculated by left and right (or top and bottom).
 */


function mergeLayoutParam(targetOption, newOption, opt) {
  !zrUtil.isObject(opt) && (opt = {});
  var ignoreSize = opt.ignoreSize;
  !zrUtil.isArray(ignoreSize) && (ignoreSize = [ignoreSize, ignoreSize]);
  var hResult = merge(HV_NAMES[0], 0);
  var vResult = merge(HV_NAMES[1], 1);
  copy(HV_NAMES[0], targetOption, hResult);
  copy(HV_NAMES[1], targetOption, vResult);

  function merge(names, hvIdx) {
    var newParams = {};
    var newValueCount = 0;
    var merged = {};
    var mergedValueCount = 0;
    var enoughParamNumber = 2;
    each(names, function (name) {
      merged[name] = targetOption[name];
    });
    each(names, function (name) {
      // Consider case: newOption.width is null, which is
      // set by user for removing width setting.
      hasProp(newOption, name) && (newParams[name] = merged[name] = newOption[name]);
      hasValue(newParams, name) && newValueCount++;
      hasValue(merged, name) && mergedValueCount++;
    });

    if (ignoreSize[hvIdx]) {
      // Only one of left/right is premitted to exist.
      if (hasValue(newOption, names[1])) {
        merged[names[2]] = null;
      } else if (hasValue(newOption, names[2])) {
        merged[names[1]] = null;
      }

      return merged;
    } // Case: newOption: {width: ..., right: ...},
    // or targetOption: {right: ...} and newOption: {width: ...},
    // There is no conflict when merged only has params count
    // little than enoughParamNumber.


    if (mergedValueCount === enoughParamNumber || !newValueCount) {
      return merged;
    } // Case: newOption: {width: ..., right: ...},
    // Than we can make sure user only want those two, and ignore
    // all origin params in targetOption.
    else if (newValueCount >= enoughParamNumber) {
        return newParams;
      } else {
        // Chose another param from targetOption by priority.
        for (var i = 0; i < names.length; i++) {
          var name = names[i];

          if (!hasProp(newParams, name) && hasProp(targetOption, name)) {
            newParams[name] = targetOption[name];
            break;
          }
        }

        return newParams;
      }
  }

  function hasProp(obj, name) {
    return obj.hasOwnProperty(name);
  }

  function hasValue(obj, name) {
    return obj[name] != null && obj[name] !== 'auto';
  }

  function copy(names, target, source) {
    each(names, function (name) {
      target[name] = source[name];
    });
  }
}
/**
 * Retrieve 'left', 'right', 'top', 'bottom', 'width', 'height' from object.
 * @param {Object} source
 * @return {Object} Result contains those props.
 */


function getLayoutParams(source) {
  return copyLayoutParams({}, source);
}
/**
 * Retrieve 'left', 'right', 'top', 'bottom', 'width', 'height' from object.
 * @param {Object} source
 * @return {Object} Result contains those props.
 */


function copyLayoutParams(target, source) {
  source && target && each(LOCATION_PARAMS, function (name) {
    source.hasOwnProperty(name) && (target[name] = source[name]);
  });
  return target;
}

exports.LOCATION_PARAMS = LOCATION_PARAMS;
exports.HV_NAMES = HV_NAMES;
exports.box = box;
exports.vbox = vbox;
exports.hbox = hbox;
exports.getAvailableSize = getAvailableSize;
exports.getLayoutRect = getLayoutRect;
exports.positionElement = positionElement;
exports.sizeCalculable = sizeCalculable;
exports.mergeLayoutParam = mergeLayoutParam;
exports.getLayoutParams = getLayoutParams;
exports.copyLayoutParams = copyLayoutParams;

/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

var BoundingRect = __webpack_require__(214);

var imageHelper = __webpack_require__(245);

var _util = __webpack_require__(196);

var getContext = _util.getContext;
var extend = _util.extend;
var retrieve2 = _util.retrieve2;
var retrieve3 = _util.retrieve3;
var textWidthCache = {};
var textWidthCacheCounter = 0;
var TEXT_CACHE_MAX = 5000;
var STYLE_REG = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;
var DEFAULT_FONT = '12px sans-serif'; // Avoid assign to an exported variable, for transforming to cjs.

var methods = {};

function $override(name, fn) {
  methods[name] = fn;
}
/**
 * @public
 * @param {string} text
 * @param {string} font
 * @return {number} width
 */


function getWidth(text, font) {
  font = font || DEFAULT_FONT;
  var key = text + ':' + font;

  if (textWidthCache[key]) {
    return textWidthCache[key];
  }

  var textLines = (text + '').split('\n');
  var width = 0;

  for (var i = 0, l = textLines.length; i < l; i++) {
    // textContain.measureText may be overrided in SVG or VML
    width = Math.max(measureText(textLines[i], font).width, width);
  }

  if (textWidthCacheCounter > TEXT_CACHE_MAX) {
    textWidthCacheCounter = 0;
    textWidthCache = {};
  }

  textWidthCacheCounter++;
  textWidthCache[key] = width;
  return width;
}
/**
 * @public
 * @param {string} text
 * @param {string} font
 * @param {string} [textAlign='left']
 * @param {string} [textVerticalAlign='top']
 * @param {Array.<number>} [textPadding]
 * @param {Object} [rich]
 * @param {Object} [truncate]
 * @return {Object} {x, y, width, height, lineHeight}
 */


function getBoundingRect(text, font, textAlign, textVerticalAlign, textPadding, rich, truncate) {
  return rich ? getRichTextRect(text, font, textAlign, textVerticalAlign, textPadding, rich, truncate) : getPlainTextRect(text, font, textAlign, textVerticalAlign, textPadding, truncate);
}

function getPlainTextRect(text, font, textAlign, textVerticalAlign, textPadding, truncate) {
  var contentBlock = parsePlainText(text, font, textPadding, truncate);
  var outerWidth = getWidth(text, font);

  if (textPadding) {
    outerWidth += textPadding[1] + textPadding[3];
  }

  var outerHeight = contentBlock.outerHeight;
  var x = adjustTextX(0, outerWidth, textAlign);
  var y = adjustTextY(0, outerHeight, textVerticalAlign);
  var rect = new BoundingRect(x, y, outerWidth, outerHeight);
  rect.lineHeight = contentBlock.lineHeight;
  return rect;
}

function getRichTextRect(text, font, textAlign, textVerticalAlign, textPadding, rich, truncate) {
  var contentBlock = parseRichText(text, {
    rich: rich,
    truncate: truncate,
    font: font,
    textAlign: textAlign,
    textPadding: textPadding
  });
  var outerWidth = contentBlock.outerWidth;
  var outerHeight = contentBlock.outerHeight;
  var x = adjustTextX(0, outerWidth, textAlign);
  var y = adjustTextY(0, outerHeight, textVerticalAlign);
  return new BoundingRect(x, y, outerWidth, outerHeight);
}
/**
 * @public
 * @param {number} x
 * @param {number} width
 * @param {string} [textAlign='left']
 * @return {number} Adjusted x.
 */


function adjustTextX(x, width, textAlign) {
  // FIXME Right to left language
  if (textAlign === 'right') {
    x -= width;
  } else if (textAlign === 'center') {
    x -= width / 2;
  }

  return x;
}
/**
 * @public
 * @param {number} y
 * @param {number} height
 * @param {string} [textVerticalAlign='top']
 * @return {number} Adjusted y.
 */


function adjustTextY(y, height, textVerticalAlign) {
  if (textVerticalAlign === 'middle') {
    y -= height / 2;
  } else if (textVerticalAlign === 'bottom') {
    y -= height;
  }

  return y;
}
/**
 * @public
 * @param {stirng} textPosition
 * @param {Object} rect {x, y, width, height}
 * @param {number} distance
 * @return {Object} {x, y, textAlign, textVerticalAlign}
 */


function adjustTextPositionOnRect(textPosition, rect, distance) {
  var x = rect.x;
  var y = rect.y;
  var height = rect.height;
  var width = rect.width;
  var halfHeight = height / 2;
  var textAlign = 'left';
  var textVerticalAlign = 'top';

  switch (textPosition) {
    case 'left':
      x -= distance;
      y += halfHeight;
      textAlign = 'right';
      textVerticalAlign = 'middle';
      break;

    case 'right':
      x += distance + width;
      y += halfHeight;
      textVerticalAlign = 'middle';
      break;

    case 'top':
      x += width / 2;
      y -= distance;
      textAlign = 'center';
      textVerticalAlign = 'bottom';
      break;

    case 'bottom':
      x += width / 2;
      y += height + distance;
      textAlign = 'center';
      break;

    case 'inside':
      x += width / 2;
      y += halfHeight;
      textAlign = 'center';
      textVerticalAlign = 'middle';
      break;

    case 'insideLeft':
      x += distance;
      y += halfHeight;
      textVerticalAlign = 'middle';
      break;

    case 'insideRight':
      x += width - distance;
      y += halfHeight;
      textAlign = 'right';
      textVerticalAlign = 'middle';
      break;

    case 'insideTop':
      x += width / 2;
      y += distance;
      textAlign = 'center';
      break;

    case 'insideBottom':
      x += width / 2;
      y += height - distance;
      textAlign = 'center';
      textVerticalAlign = 'bottom';
      break;

    case 'insideTopLeft':
      x += distance;
      y += distance;
      break;

    case 'insideTopRight':
      x += width - distance;
      y += distance;
      textAlign = 'right';
      break;

    case 'insideBottomLeft':
      x += distance;
      y += height - distance;
      textVerticalAlign = 'bottom';
      break;

    case 'insideBottomRight':
      x += width - distance;
      y += height - distance;
      textAlign = 'right';
      textVerticalAlign = 'bottom';
      break;
  }

  return {
    x: x,
    y: y,
    textAlign: textAlign,
    textVerticalAlign: textVerticalAlign
  };
}
/**
 * Show ellipsis if overflow.
 *
 * @public
 * @param  {string} text
 * @param  {string} containerWidth
 * @param  {string} font
 * @param  {number} [ellipsis='...']
 * @param  {Object} [options]
 * @param  {number} [options.maxIterations=3]
 * @param  {number} [options.minChar=0] If truncate result are less
 *                  then minChar, ellipsis will not show, which is
 *                  better for user hint in some cases.
 * @param  {number} [options.placeholder=''] When all truncated, use the placeholder.
 * @return {string}
 */


function truncateText(text, containerWidth, font, ellipsis, options) {
  if (!containerWidth) {
    return '';
  }

  var textLines = (text + '').split('\n');
  options = prepareTruncateOptions(containerWidth, font, ellipsis, options); // FIXME
  // It is not appropriate that every line has '...' when truncate multiple lines.

  for (var i = 0, len = textLines.length; i < len; i++) {
    textLines[i] = truncateSingleLine(textLines[i], options);
  }

  return textLines.join('\n');
}

function prepareTruncateOptions(containerWidth, font, ellipsis, options) {
  options = extend({}, options);
  options.font = font;
  var ellipsis = retrieve2(ellipsis, '...');
  options.maxIterations = retrieve2(options.maxIterations, 2);
  var minChar = options.minChar = retrieve2(options.minChar, 0); // FIXME
  // Other languages?

  options.cnCharWidth = getWidth('国', font); // FIXME
  // Consider proportional font?

  var ascCharWidth = options.ascCharWidth = getWidth('a', font);
  options.placeholder = retrieve2(options.placeholder, ''); // Example 1: minChar: 3, text: 'asdfzxcv', truncate result: 'asdf', but not: 'a...'.
  // Example 2: minChar: 3, text: '维度', truncate result: '维', but not: '...'.

  var contentWidth = containerWidth = Math.max(0, containerWidth - 1); // Reserve some gap.

  for (var i = 0; i < minChar && contentWidth >= ascCharWidth; i++) {
    contentWidth -= ascCharWidth;
  }

  var ellipsisWidth = getWidth(ellipsis);

  if (ellipsisWidth > contentWidth) {
    ellipsis = '';
    ellipsisWidth = 0;
  }

  contentWidth = containerWidth - ellipsisWidth;
  options.ellipsis = ellipsis;
  options.ellipsisWidth = ellipsisWidth;
  options.contentWidth = contentWidth;
  options.containerWidth = containerWidth;
  return options;
}

function truncateSingleLine(textLine, options) {
  var containerWidth = options.containerWidth;
  var font = options.font;
  var contentWidth = options.contentWidth;

  if (!containerWidth) {
    return '';
  }

  var lineWidth = getWidth(textLine, font);

  if (lineWidth <= containerWidth) {
    return textLine;
  }

  for (var j = 0;; j++) {
    if (lineWidth <= contentWidth || j >= options.maxIterations) {
      textLine += options.ellipsis;
      break;
    }

    var subLength = j === 0 ? estimateLength(textLine, contentWidth, options.ascCharWidth, options.cnCharWidth) : lineWidth > 0 ? Math.floor(textLine.length * contentWidth / lineWidth) : 0;
    textLine = textLine.substr(0, subLength);
    lineWidth = getWidth(textLine, font);
  }

  if (textLine === '') {
    textLine = options.placeholder;
  }

  return textLine;
}

function estimateLength(text, contentWidth, ascCharWidth, cnCharWidth) {
  var width = 0;
  var i = 0;

  for (var len = text.length; i < len && width < contentWidth; i++) {
    var charCode = text.charCodeAt(i);
    width += 0 <= charCode && charCode <= 127 ? ascCharWidth : cnCharWidth;
  }

  return i;
}
/**
 * @public
 * @param {string} font
 * @return {number} line height
 */


function getLineHeight(font) {
  // FIXME A rough approach.
  return getWidth('国', font);
}
/**
 * @public
 * @param {string} text
 * @param {string} font
 * @return {Object} width
 */


function measureText(text, font) {
  return methods.measureText(text, font);
} // Avoid assign to an exported variable, for transforming to cjs.


methods.measureText = function (text, font) {
  var ctx = getContext();
  ctx.font = font || DEFAULT_FONT;
  return ctx.measureText(text);
};
/**
 * @public
 * @param {string} text
 * @param {string} font
 * @param {Object} [truncate]
 * @return {Object} block: {lineHeight, lines, height, outerHeight}
 *  Notice: for performance, do not calculate outerWidth util needed.
 */


function parsePlainText(text, font, padding, truncate) {
  text != null && (text += '');
  var lineHeight = getLineHeight(font);
  var lines = text ? text.split('\n') : [];
  var height = lines.length * lineHeight;
  var outerHeight = height;

  if (padding) {
    outerHeight += padding[0] + padding[2];
  }

  if (text && truncate) {
    var truncOuterHeight = truncate.outerHeight;
    var truncOuterWidth = truncate.outerWidth;

    if (truncOuterHeight != null && outerHeight > truncOuterHeight) {
      text = '';
      lines = [];
    } else if (truncOuterWidth != null) {
      var options = prepareTruncateOptions(truncOuterWidth - (padding ? padding[1] + padding[3] : 0), font, truncate.ellipsis, {
        minChar: truncate.minChar,
        placeholder: truncate.placeholder
      }); // FIXME
      // It is not appropriate that every line has '...' when truncate multiple lines.

      for (var i = 0, len = lines.length; i < len; i++) {
        lines[i] = truncateSingleLine(lines[i], options);
      }
    }
  }

  return {
    lines: lines,
    height: height,
    outerHeight: outerHeight,
    lineHeight: lineHeight
  };
}
/**
 * For example: 'some text {a|some text}other text{b|some text}xxx{c|}xxx'
 * Also consider 'bbbb{a|xxx\nzzz}xxxx\naaaa'.
 *
 * @public
 * @param {string} text
 * @param {Object} style
 * @return {Object} block
 * {
 *      width,
 *      height,
 *      lines: [{
 *          lineHeight,
 *          width,
 *          tokens: [[{
 *              styleName,
 *              text,
 *              width,      // include textPadding
 *              height,     // include textPadding
 *              textWidth, // pure text width
 *              textHeight, // pure text height
 *              lineHeihgt,
 *              font,
 *              textAlign,
 *              textVerticalAlign
 *          }], [...], ...]
 *      }, ...]
 * }
 * If styleName is undefined, it is plain text.
 */


function parseRichText(text, style) {
  var contentBlock = {
    lines: [],
    width: 0,
    height: 0
  };
  text != null && (text += '');

  if (!text) {
    return contentBlock;
  }

  var lastIndex = STYLE_REG.lastIndex = 0;
  var result;

  while ((result = STYLE_REG.exec(text)) != null) {
    var matchedIndex = result.index;

    if (matchedIndex > lastIndex) {
      pushTokens(contentBlock, text.substring(lastIndex, matchedIndex));
    }

    pushTokens(contentBlock, result[2], result[1]);
    lastIndex = STYLE_REG.lastIndex;
  }

  if (lastIndex < text.length) {
    pushTokens(contentBlock, text.substring(lastIndex, text.length));
  }

  var lines = contentBlock.lines;
  var contentHeight = 0;
  var contentWidth = 0; // For `textWidth: 100%`

  var pendingList = [];
  var stlPadding = style.textPadding;
  var truncate = style.truncate;
  var truncateWidth = truncate && truncate.outerWidth;
  var truncateHeight = truncate && truncate.outerHeight;

  if (stlPadding) {
    truncateWidth != null && (truncateWidth -= stlPadding[1] + stlPadding[3]);
    truncateHeight != null && (truncateHeight -= stlPadding[0] + stlPadding[2]);
  } // Calculate layout info of tokens.


  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var lineHeight = 0;
    var lineWidth = 0;

    for (var j = 0; j < line.tokens.length; j++) {
      var token = line.tokens[j];
      var tokenStyle = token.styleName && style.rich[token.styleName] || {}; // textPadding should not inherit from style.

      var textPadding = token.textPadding = tokenStyle.textPadding; // textFont has been asigned to font by `normalizeStyle`.

      var font = token.font = tokenStyle.font || style.font; // textHeight can be used when textVerticalAlign is specified in token.

      var tokenHeight = token.textHeight = retrieve2( // textHeight should not be inherited, consider it can be specified
      // as box height of the block.
      tokenStyle.textHeight, getLineHeight(font));
      textPadding && (tokenHeight += textPadding[0] + textPadding[2]);
      token.height = tokenHeight;
      token.lineHeight = retrieve3(tokenStyle.textLineHeight, style.textLineHeight, tokenHeight);
      token.textAlign = tokenStyle && tokenStyle.textAlign || style.textAlign;
      token.textVerticalAlign = tokenStyle && tokenStyle.textVerticalAlign || 'middle';

      if (truncateHeight != null && contentHeight + token.lineHeight > truncateHeight) {
        return {
          lines: [],
          width: 0,
          height: 0
        };
      }

      token.textWidth = getWidth(token.text, font);
      var tokenWidth = tokenStyle.textWidth;
      var tokenWidthNotSpecified = tokenWidth == null || tokenWidth === 'auto'; // Percent width, can be `100%`, can be used in drawing separate
      // line when box width is needed to be auto.

      if (typeof tokenWidth === 'string' && tokenWidth.charAt(tokenWidth.length - 1) === '%') {
        token.percentWidth = tokenWidth;
        pendingList.push(token);
        tokenWidth = 0; // Do not truncate in this case, because there is no user case
        // and it is too complicated.
      } else {
        if (tokenWidthNotSpecified) {
          tokenWidth = token.textWidth; // FIXME: If image is not loaded and textWidth is not specified, calling
          // `getBoundingRect()` will not get correct result.

          var textBackgroundColor = tokenStyle.textBackgroundColor;
          var bgImg = textBackgroundColor && textBackgroundColor.image; // Use cases:
          // (1) If image is not loaded, it will be loaded at render phase and call
          // `dirty()` and `textBackgroundColor.image` will be replaced with the loaded
          // image, and then the right size will be calculated here at the next tick.
          // See `graphic/helper/text.js`.
          // (2) If image loaded, and `textBackgroundColor.image` is image src string,
          // use `imageHelper.findExistImage` to find cached image.
          // `imageHelper.findExistImage` will always be called here before
          // `imageHelper.createOrUpdateImage` in `graphic/helper/text.js#renderRichText`
          // which ensures that image will not be rendered before correct size calcualted.

          if (bgImg) {
            bgImg = imageHelper.findExistImage(bgImg);

            if (imageHelper.isImageReady(bgImg)) {
              tokenWidth = Math.max(tokenWidth, bgImg.width * tokenHeight / bgImg.height);
            }
          }
        }

        var paddingW = textPadding ? textPadding[1] + textPadding[3] : 0;
        tokenWidth += paddingW;
        var remianTruncWidth = truncateWidth != null ? truncateWidth - lineWidth : null;

        if (remianTruncWidth != null && remianTruncWidth < tokenWidth) {
          if (!tokenWidthNotSpecified || remianTruncWidth < paddingW) {
            token.text = '';
            token.textWidth = tokenWidth = 0;
          } else {
            token.text = truncateText(token.text, remianTruncWidth - paddingW, font, truncate.ellipsis, {
              minChar: truncate.minChar
            });
            token.textWidth = getWidth(token.text, font);
            tokenWidth = token.textWidth + paddingW;
          }
        }
      }

      lineWidth += token.width = tokenWidth;
      tokenStyle && (lineHeight = Math.max(lineHeight, token.lineHeight));
    }

    line.width = lineWidth;
    line.lineHeight = lineHeight;
    contentHeight += lineHeight;
    contentWidth = Math.max(contentWidth, lineWidth);
  }

  contentBlock.outerWidth = contentBlock.width = retrieve2(style.textWidth, contentWidth);
  contentBlock.outerHeight = contentBlock.height = retrieve2(style.textHeight, contentHeight);

  if (stlPadding) {
    contentBlock.outerWidth += stlPadding[1] + stlPadding[3];
    contentBlock.outerHeight += stlPadding[0] + stlPadding[2];
  }

  for (var i = 0; i < pendingList.length; i++) {
    var token = pendingList[i];
    var percentWidth = token.percentWidth; // Should not base on outerWidth, because token can not be placed out of padding.

    token.width = parseInt(percentWidth, 10) / 100 * contentWidth;
  }

  return contentBlock;
}

function pushTokens(block, str, styleName) {
  var isEmptyStr = str === '';
  var strs = str.split('\n');
  var lines = block.lines;

  for (var i = 0; i < strs.length; i++) {
    var text = strs[i];
    var token = {
      styleName: styleName,
      text: text,
      isLineHolder: !text && !isEmptyStr
    }; // The first token should be appended to the last line.

    if (!i) {
      var tokens = (lines[lines.length - 1] || (lines[0] = {
        tokens: []
      })).tokens; // Consider cases:
      // (1) ''.split('\n') => ['', '\n', ''], the '' at the first item
      // (which is a placeholder) should be replaced by new token.
      // (2) A image backage, where token likes {a|}.
      // (3) A redundant '' will affect textAlign in line.
      // (4) tokens with the same tplName should not be merged, because
      // they should be displayed in different box (with border and padding).

      var tokensLen = tokens.length;
      tokensLen === 1 && tokens[0].isLineHolder ? tokens[0] = token : // Consider text is '', only insert when it is the "lineHolder" or
      // "emptyStr". Otherwise a redundant '' will affect textAlign in line.
      (text || !tokensLen || isEmptyStr) && tokens.push(token);
    } // Other tokens always start a new line.
    else {
        // If there is '', insert it as a placeholder.
        lines.push({
          tokens: [token]
        });
      }
  }
}

function makeFont(style) {
  // FIXME in node-canvas fontWeight is before fontStyle
  // Use `fontSize` `fontFamily` to check whether font properties are defined.
  return (style.fontSize || style.fontFamily) && [style.fontStyle, style.fontWeight, (style.fontSize || 12) + 'px', // If font properties are defined, `fontFamily` should not be ignored.
  style.fontFamily || 'sans-serif'].join(' ') || style.textFont || style.font;
}

exports.DEFAULT_FONT = DEFAULT_FONT;
exports.$override = $override;
exports.getWidth = getWidth;
exports.getBoundingRect = getBoundingRect;
exports.adjustTextX = adjustTextX;
exports.adjustTextY = adjustTextY;
exports.adjustTextPositionOnRect = adjustTextPositionOnRect;
exports.truncateText = truncateText;
exports.getLineHeight = getLineHeight;
exports.measureText = measureText;
exports.parsePlainText = parsePlainText;
exports.parseRichText = parseRichText;
exports.makeFont = makeFont;

/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

var _vector = __webpack_require__(203);

var v2Create = _vector.create;
var v2DistSquare = _vector.distSquare;

/**
 * 曲线辅助模块
 * @module zrender/core/curve
 * @author pissang(https://www.github.com/pissang)
 */
var mathPow = Math.pow;
var mathSqrt = Math.sqrt;
var EPSILON = 1e-8;
var EPSILON_NUMERIC = 1e-4;
var THREE_SQRT = mathSqrt(3);
var ONE_THIRD = 1 / 3; // 临时变量

var _v0 = v2Create();

var _v1 = v2Create();

var _v2 = v2Create();

function isAroundZero(val) {
  return val > -EPSILON && val < EPSILON;
}

function isNotAroundZero(val) {
  return val > EPSILON || val < -EPSILON;
}
/**
 * 计算三次贝塞尔值
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} t
 * @return {number}
 */


function cubicAt(p0, p1, p2, p3, t) {
  var onet = 1 - t;
  return onet * onet * (onet * p0 + 3 * t * p1) + t * t * (t * p3 + 3 * onet * p2);
}
/**
 * 计算三次贝塞尔导数值
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} t
 * @return {number}
 */


function cubicDerivativeAt(p0, p1, p2, p3, t) {
  var onet = 1 - t;
  return 3 * (((p1 - p0) * onet + 2 * (p2 - p1) * t) * onet + (p3 - p2) * t * t);
}
/**
 * 计算三次贝塞尔方程根，使用盛金公式
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} val
 * @param  {Array.<number>} roots
 * @return {number} 有效根数目
 */


function cubicRootAt(p0, p1, p2, p3, val, roots) {
  // Evaluate roots of cubic functions
  var a = p3 + 3 * (p1 - p2) - p0;
  var b = 3 * (p2 - p1 * 2 + p0);
  var c = 3 * (p1 - p0);
  var d = p0 - val;
  var A = b * b - 3 * a * c;
  var B = b * c - 9 * a * d;
  var C = c * c - 3 * b * d;
  var n = 0;

  if (isAroundZero(A) && isAroundZero(B)) {
    if (isAroundZero(b)) {
      roots[0] = 0;
    } else {
      var t1 = -c / b; //t1, t2, t3, b is not zero

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }
    }
  } else {
    var disc = B * B - 4 * A * C;

    if (isAroundZero(disc)) {
      var K = B / A;
      var t1 = -b / a + K; // t1, a is not zero

      var t2 = -K / 2; // t2, t3

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }

      if (t2 >= 0 && t2 <= 1) {
        roots[n++] = t2;
      }
    } else if (disc > 0) {
      var discSqrt = mathSqrt(disc);
      var Y1 = A * b + 1.5 * a * (-B + discSqrt);
      var Y2 = A * b + 1.5 * a * (-B - discSqrt);

      if (Y1 < 0) {
        Y1 = -mathPow(-Y1, ONE_THIRD);
      } else {
        Y1 = mathPow(Y1, ONE_THIRD);
      }

      if (Y2 < 0) {
        Y2 = -mathPow(-Y2, ONE_THIRD);
      } else {
        Y2 = mathPow(Y2, ONE_THIRD);
      }

      var t1 = (-b - (Y1 + Y2)) / (3 * a);

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }
    } else {
      var T = (2 * A * b - 3 * a * B) / (2 * mathSqrt(A * A * A));
      var theta = Math.acos(T) / 3;
      var ASqrt = mathSqrt(A);
      var tmp = Math.cos(theta);
      var t1 = (-b - 2 * ASqrt * tmp) / (3 * a);
      var t2 = (-b + ASqrt * (tmp + THREE_SQRT * Math.sin(theta))) / (3 * a);
      var t3 = (-b + ASqrt * (tmp - THREE_SQRT * Math.sin(theta))) / (3 * a);

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }

      if (t2 >= 0 && t2 <= 1) {
        roots[n++] = t2;
      }

      if (t3 >= 0 && t3 <= 1) {
        roots[n++] = t3;
      }
    }
  }

  return n;
}
/**
 * 计算三次贝塞尔方程极限值的位置
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {Array.<number>} extrema
 * @return {number} 有效数目
 */


function cubicExtrema(p0, p1, p2, p3, extrema) {
  var b = 6 * p2 - 12 * p1 + 6 * p0;
  var a = 9 * p1 + 3 * p3 - 3 * p0 - 9 * p2;
  var c = 3 * p1 - 3 * p0;
  var n = 0;

  if (isAroundZero(a)) {
    if (isNotAroundZero(b)) {
      var t1 = -c / b;

      if (t1 >= 0 && t1 <= 1) {
        extrema[n++] = t1;
      }
    }
  } else {
    var disc = b * b - 4 * a * c;

    if (isAroundZero(disc)) {
      extrema[0] = -b / (2 * a);
    } else if (disc > 0) {
      var discSqrt = mathSqrt(disc);
      var t1 = (-b + discSqrt) / (2 * a);
      var t2 = (-b - discSqrt) / (2 * a);

      if (t1 >= 0 && t1 <= 1) {
        extrema[n++] = t1;
      }

      if (t2 >= 0 && t2 <= 1) {
        extrema[n++] = t2;
      }
    }
  }

  return n;
}
/**
 * 细分三次贝塞尔曲线
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} t
 * @param  {Array.<number>} out
 */


function cubicSubdivide(p0, p1, p2, p3, t, out) {
  var p01 = (p1 - p0) * t + p0;
  var p12 = (p2 - p1) * t + p1;
  var p23 = (p3 - p2) * t + p2;
  var p012 = (p12 - p01) * t + p01;
  var p123 = (p23 - p12) * t + p12;
  var p0123 = (p123 - p012) * t + p012; // Seg0

  out[0] = p0;
  out[1] = p01;
  out[2] = p012;
  out[3] = p0123; // Seg1

  out[4] = p0123;
  out[5] = p123;
  out[6] = p23;
  out[7] = p3;
}
/**
 * 投射点到三次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @param {number} x
 * @param {number} y
 * @param {Array.<number>} [out] 投射点
 * @return {number}
 */


function cubicProjectPoint(x0, y0, x1, y1, x2, y2, x3, y3, x, y, out) {
  // http://pomax.github.io/bezierinfo/#projections
  var t;
  var interval = 0.005;
  var d = Infinity;
  var prev;
  var next;
  var d1;
  var d2;
  _v0[0] = x;
  _v0[1] = y; // 先粗略估计一下可能的最小距离的 t 值
  // PENDING

  for (var _t = 0; _t < 1; _t += 0.05) {
    _v1[0] = cubicAt(x0, x1, x2, x3, _t);
    _v1[1] = cubicAt(y0, y1, y2, y3, _t);
    d1 = v2DistSquare(_v0, _v1);

    if (d1 < d) {
      t = _t;
      d = d1;
    }
  }

  d = Infinity; // At most 32 iteration

  for (var i = 0; i < 32; i++) {
    if (interval < EPSILON_NUMERIC) {
      break;
    }

    prev = t - interval;
    next = t + interval; // t - interval

    _v1[0] = cubicAt(x0, x1, x2, x3, prev);
    _v1[1] = cubicAt(y0, y1, y2, y3, prev);
    d1 = v2DistSquare(_v1, _v0);

    if (prev >= 0 && d1 < d) {
      t = prev;
      d = d1;
    } else {
      // t + interval
      _v2[0] = cubicAt(x0, x1, x2, x3, next);
      _v2[1] = cubicAt(y0, y1, y2, y3, next);
      d2 = v2DistSquare(_v2, _v0);

      if (next <= 1 && d2 < d) {
        t = next;
        d = d2;
      } else {
        interval *= 0.5;
      }
    }
  } // t


  if (out) {
    out[0] = cubicAt(x0, x1, x2, x3, t);
    out[1] = cubicAt(y0, y1, y2, y3, t);
  } // console.log(interval, i);


  return mathSqrt(d);
}
/**
 * 计算二次方贝塞尔值
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @return {number}
 */


function quadraticAt(p0, p1, p2, t) {
  var onet = 1 - t;
  return onet * (onet * p0 + 2 * t * p1) + t * t * p2;
}
/**
 * 计算二次方贝塞尔导数值
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @return {number}
 */


function quadraticDerivativeAt(p0, p1, p2, t) {
  return 2 * ((1 - t) * (p1 - p0) + t * (p2 - p1));
}
/**
 * 计算二次方贝塞尔方程根
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @param  {Array.<number>} roots
 * @return {number} 有效根数目
 */


function quadraticRootAt(p0, p1, p2, val, roots) {
  var a = p0 - 2 * p1 + p2;
  var b = 2 * (p1 - p0);
  var c = p0 - val;
  var n = 0;

  if (isAroundZero(a)) {
    if (isNotAroundZero(b)) {
      var t1 = -c / b;

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }
    }
  } else {
    var disc = b * b - 4 * a * c;

    if (isAroundZero(disc)) {
      var t1 = -b / (2 * a);

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }
    } else if (disc > 0) {
      var discSqrt = mathSqrt(disc);
      var t1 = (-b + discSqrt) / (2 * a);
      var t2 = (-b - discSqrt) / (2 * a);

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }

      if (t2 >= 0 && t2 <= 1) {
        roots[n++] = t2;
      }
    }
  }

  return n;
}
/**
 * 计算二次贝塞尔方程极限值
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @return {number}
 */


function quadraticExtremum(p0, p1, p2) {
  var divider = p0 + p2 - 2 * p1;

  if (divider === 0) {
    // p1 is center of p0 and p2
    return 0.5;
  } else {
    return (p0 - p1) / divider;
  }
}
/**
 * 细分二次贝塞尔曲线
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @param  {Array.<number>} out
 */


function quadraticSubdivide(p0, p1, p2, t, out) {
  var p01 = (p1 - p0) * t + p0;
  var p12 = (p2 - p1) * t + p1;
  var p012 = (p12 - p01) * t + p01; // Seg0

  out[0] = p0;
  out[1] = p01;
  out[2] = p012; // Seg1

  out[3] = p012;
  out[4] = p12;
  out[5] = p2;
}
/**
 * 投射点到二次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x
 * @param {number} y
 * @param {Array.<number>} out 投射点
 * @return {number}
 */


function quadraticProjectPoint(x0, y0, x1, y1, x2, y2, x, y, out) {
  // http://pomax.github.io/bezierinfo/#projections
  var t;
  var interval = 0.005;
  var d = Infinity;
  _v0[0] = x;
  _v0[1] = y; // 先粗略估计一下可能的最小距离的 t 值
  // PENDING

  for (var _t = 0; _t < 1; _t += 0.05) {
    _v1[0] = quadraticAt(x0, x1, x2, _t);
    _v1[1] = quadraticAt(y0, y1, y2, _t);
    var d1 = v2DistSquare(_v0, _v1);

    if (d1 < d) {
      t = _t;
      d = d1;
    }
  }

  d = Infinity; // At most 32 iteration

  for (var i = 0; i < 32; i++) {
    if (interval < EPSILON_NUMERIC) {
      break;
    }

    var prev = t - interval;
    var next = t + interval; // t - interval

    _v1[0] = quadraticAt(x0, x1, x2, prev);
    _v1[1] = quadraticAt(y0, y1, y2, prev);
    var d1 = v2DistSquare(_v1, _v0);

    if (prev >= 0 && d1 < d) {
      t = prev;
      d = d1;
    } else {
      // t + interval
      _v2[0] = quadraticAt(x0, x1, x2, next);
      _v2[1] = quadraticAt(y0, y1, y2, next);
      var d2 = v2DistSquare(_v2, _v0);

      if (next <= 1 && d2 < d) {
        t = next;
        d = d2;
      } else {
        interval *= 0.5;
      }
    }
  } // t


  if (out) {
    out[0] = quadraticAt(x0, x1, x2, t);
    out[1] = quadraticAt(y0, y1, y2, t);
  } // console.log(interval, i);


  return mathSqrt(d);
}

exports.cubicAt = cubicAt;
exports.cubicDerivativeAt = cubicDerivativeAt;
exports.cubicRootAt = cubicRootAt;
exports.cubicExtrema = cubicExtrema;
exports.cubicSubdivide = cubicSubdivide;
exports.cubicProjectPoint = cubicProjectPoint;
exports.quadraticAt = quadraticAt;
exports.quadraticDerivativeAt = quadraticDerivativeAt;
exports.quadraticRootAt = quadraticRootAt;
exports.quadraticExtremum = quadraticExtremum;
exports.quadraticSubdivide = quadraticSubdivide;
exports.quadraticProjectPoint = quadraticProjectPoint;

/***/ }),
/* 227 */
/***/ (function(module, exports) {

/**
 * 事件扩展
 * @module zrender/mixin/Eventful
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         pissang (https://www.github.com/pissang)
 */
var arrySlice = Array.prototype.slice;
/**
 * 事件分发器
 * @alias module:zrender/mixin/Eventful
 * @constructor
 */

var Eventful = function () {
  this._$handlers = {};
};

Eventful.prototype = {
  constructor: Eventful,

  /**
   * 单次触发绑定，trigger后销毁
   *
   * @param {string} event 事件名
   * @param {Function} handler 响应函数
   * @param {Object} context
   */
  one: function (event, handler, context) {
    var _h = this._$handlers;

    if (!handler || !event) {
      return this;
    }

    if (!_h[event]) {
      _h[event] = [];
    }

    for (var i = 0; i < _h[event].length; i++) {
      if (_h[event][i].h === handler) {
        return this;
      }
    }

    _h[event].push({
      h: handler,
      one: true,
      ctx: context || this
    });

    return this;
  },

  /**
   * 绑定事件
   * @param {string} event 事件名
   * @param {Function} handler 事件处理函数
   * @param {Object} [context]
   */
  on: function (event, handler, context) {
    var _h = this._$handlers;

    if (!handler || !event) {
      return this;
    }

    if (!_h[event]) {
      _h[event] = [];
    }

    for (var i = 0; i < _h[event].length; i++) {
      if (_h[event][i].h === handler) {
        return this;
      }
    }

    _h[event].push({
      h: handler,
      one: false,
      ctx: context || this
    });

    return this;
  },

  /**
   * 是否绑定了事件
   * @param  {string}  event
   * @return {boolean}
   */
  isSilent: function (event) {
    var _h = this._$handlers;
    return _h[event] && _h[event].length;
  },

  /**
   * 解绑事件
   * @param {string} event 事件名
   * @param {Function} [handler] 事件处理函数
   */
  off: function (event, handler) {
    var _h = this._$handlers;

    if (!event) {
      this._$handlers = {};
      return this;
    }

    if (handler) {
      if (_h[event]) {
        var newList = [];

        for (var i = 0, l = _h[event].length; i < l; i++) {
          if (_h[event][i]['h'] != handler) {
            newList.push(_h[event][i]);
          }
        }

        _h[event] = newList;
      }

      if (_h[event] && _h[event].length === 0) {
        delete _h[event];
      }
    } else {
      delete _h[event];
    }

    return this;
  },

  /**
   * 事件分发
   *
   * @param {string} type 事件类型
   */
  trigger: function (type) {
    if (this._$handlers[type]) {
      var args = arguments;
      var argLen = args.length;

      if (argLen > 3) {
        args = arrySlice.call(args, 1);
      }

      var _h = this._$handlers[type];
      var len = _h.length;

      for (var i = 0; i < len;) {
        // Optimize advise from backbone
        switch (argLen) {
          case 1:
            _h[i]['h'].call(_h[i]['ctx']);

            break;

          case 2:
            _h[i]['h'].call(_h[i]['ctx'], args[1]);

            break;

          case 3:
            _h[i]['h'].call(_h[i]['ctx'], args[1], args[2]);

            break;

          default:
            // have more than 2 given arguments
            _h[i]['h'].apply(_h[i]['ctx'], args);

            break;
        }

        if (_h[i]['one']) {
          _h.splice(i, 1);

          len--;
        } else {
          i++;
        }
      }
    }

    return this;
  },

  /**
   * 带有context的事件分发, 最后一个参数是事件回调的context
   * @param {string} type 事件类型
   */
  triggerWithContext: function (type) {
    if (this._$handlers[type]) {
      var args = arguments;
      var argLen = args.length;

      if (argLen > 4) {
        args = arrySlice.call(args, 1, args.length - 1);
      }

      var ctx = args[args.length - 1];
      var _h = this._$handlers[type];
      var len = _h.length;

      for (var i = 0; i < len;) {
        // Optimize advise from backbone
        switch (argLen) {
          case 1:
            _h[i]['h'].call(ctx);

            break;

          case 2:
            _h[i]['h'].call(ctx, args[1]);

            break;

          case 3:
            _h[i]['h'].call(ctx, args[1], args[2]);

            break;

          default:
            // have more than 2 given arguments
            _h[i]['h'].apply(ctx, args);

            break;
        }

        if (_h[i]['one']) {
          _h.splice(i, 1);

          len--;
        } else {
          i++;
        }
      }
    }

    return this;
  }
}; // 对象可以通过 onxxxx 绑定事件

/**
 * @event module:zrender/mixin/Eventful#onclick
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#onmouseover
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#onmouseout
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#onmousemove
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#onmousewheel
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#onmousedown
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#onmouseup
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#ondrag
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#ondragstart
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#ondragend
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#ondragenter
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#ondragleave
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#ondragover
 * @type {Function}
 * @default null
 */

/**
 * @event module:zrender/mixin/Eventful#ondrop
 * @type {Function}
 * @default null
 */

var _default = Eventful;
module.exports = _default;

/***/ }),
/* 228 */
/***/ (function(module, exports) {

/**
 * 3x2矩阵操作类
 * @exports zrender/tool/matrix
 */
var ArrayCtor = typeof Float32Array === 'undefined' ? Array : Float32Array;
/**
 * 创建一个单位矩阵
 * @return {Float32Array|Array.<number>}
 */

function create() {
  var out = new ArrayCtor(6);
  identity(out);
  return out;
}
/**
 * 设置矩阵为单位矩阵
 * @param {Float32Array|Array.<number>} out
 */


function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * 复制矩阵
 * @param {Float32Array|Array.<number>} out
 * @param {Float32Array|Array.<number>} m
 */


function copy(out, m) {
  out[0] = m[0];
  out[1] = m[1];
  out[2] = m[2];
  out[3] = m[3];
  out[4] = m[4];
  out[5] = m[5];
  return out;
}
/**
 * 矩阵相乘
 * @param {Float32Array|Array.<number>} out
 * @param {Float32Array|Array.<number>} m1
 * @param {Float32Array|Array.<number>} m2
 */


function mul(out, m1, m2) {
  // Consider matrix.mul(m, m2, m);
  // where out is the same as m2.
  // So use temp variable to escape error.
  var out0 = m1[0] * m2[0] + m1[2] * m2[1];
  var out1 = m1[1] * m2[0] + m1[3] * m2[1];
  var out2 = m1[0] * m2[2] + m1[2] * m2[3];
  var out3 = m1[1] * m2[2] + m1[3] * m2[3];
  var out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
  var out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = out3;
  out[4] = out4;
  out[5] = out5;
  return out;
}
/**
 * 平移变换
 * @param {Float32Array|Array.<number>} out
 * @param {Float32Array|Array.<number>} a
 * @param {Float32Array|Array.<number>} v
 */


function translate(out, a, v) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4] + v[0];
  out[5] = a[5] + v[1];
  return out;
}
/**
 * 旋转变换
 * @param {Float32Array|Array.<number>} out
 * @param {Float32Array|Array.<number>} a
 * @param {number} rad
 */


function rotate(out, a, rad) {
  var aa = a[0];
  var ac = a[2];
  var atx = a[4];
  var ab = a[1];
  var ad = a[3];
  var aty = a[5];
  var st = Math.sin(rad);
  var ct = Math.cos(rad);
  out[0] = aa * ct + ab * st;
  out[1] = -aa * st + ab * ct;
  out[2] = ac * ct + ad * st;
  out[3] = -ac * st + ct * ad;
  out[4] = ct * atx + st * aty;
  out[5] = ct * aty - st * atx;
  return out;
}
/**
 * 缩放变换
 * @param {Float32Array|Array.<number>} out
 * @param {Float32Array|Array.<number>} a
 * @param {Float32Array|Array.<number>} v
 */


function scale(out, a, v) {
  var vx = v[0];
  var vy = v[1];
  out[0] = a[0] * vx;
  out[1] = a[1] * vy;
  out[2] = a[2] * vx;
  out[3] = a[3] * vy;
  out[4] = a[4] * vx;
  out[5] = a[5] * vy;
  return out;
}
/**
 * 求逆矩阵
 * @param {Float32Array|Array.<number>} out
 * @param {Float32Array|Array.<number>} a
 */


function invert(out, a) {
  var aa = a[0];
  var ac = a[2];
  var atx = a[4];
  var ab = a[1];
  var ad = a[3];
  var aty = a[5];
  var det = aa * ad - ab * ac;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = ad * det;
  out[1] = -ab * det;
  out[2] = -ac * det;
  out[3] = aa * det;
  out[4] = (ac * aty - ad * atx) * det;
  out[5] = (ab * atx - aa * aty) * det;
  return out;
}

exports.create = create;
exports.identity = identity;
exports.copy = copy;
exports.mul = mul;
exports.translate = translate;
exports.rotate = rotate;
exports.scale = scale;
exports.invert = invert;

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

var _config = __webpack_require__(211);

var __DEV__ = _config.__DEV__;

var zrUtil = __webpack_require__(196);

var textContain = __webpack_require__(225);

var OrdinalScale = __webpack_require__(303);

var IntervalScale = __webpack_require__(239);

var Scale = __webpack_require__(232);

var numberUtil = __webpack_require__(202);

__webpack_require__(304);

__webpack_require__(302);

/**
 * Get axis scale extent before niced.
 * Item of returned array can only be number (including Infinity and NaN).
 */
function getScaleExtent(scale, model) {
  var scaleType = scale.type;
  var min = model.getMin();
  var max = model.getMax();
  var fixMin = min != null;
  var fixMax = max != null;
  var originalExtent = scale.getExtent();
  var axisDataLen;
  var boundaryGap;
  var span;

  if (scaleType === 'ordinal') {
    axisDataLen = (model.get('data') || []).length;
  } else {
    boundaryGap = model.get('boundaryGap');

    if (!zrUtil.isArray(boundaryGap)) {
      boundaryGap = [boundaryGap || 0, boundaryGap || 0];
    }

    if (typeof boundaryGap[0] === 'boolean') {
      boundaryGap = [0, 0];
    }

    boundaryGap[0] = numberUtil.parsePercent(boundaryGap[0], 1);
    boundaryGap[1] = numberUtil.parsePercent(boundaryGap[1], 1);
    span = originalExtent[1] - originalExtent[0] || Math.abs(originalExtent[0]);
  } // Notice: When min/max is not set (that is, when there are null/undefined,
  // which is the most common case), these cases should be ensured:
  // (1) For 'ordinal', show all axis.data.
  // (2) For others:
  //      + `boundaryGap` is applied (if min/max set, boundaryGap is
  //      disabled).
  //      + If `needCrossZero`, min/max should be zero, otherwise, min/max should
  //      be the result that originalExtent enlarged by boundaryGap.
  // (3) If no data, it should be ensured that `scale.setBlank` is set.
  // FIXME
  // (1) When min/max is 'dataMin' or 'dataMax', should boundaryGap be able to used?
  // (2) When `needCrossZero` and all data is positive/negative, should it be ensured
  // that the results processed by boundaryGap are positive/negative?


  if (min == null) {
    min = scaleType === 'ordinal' ? axisDataLen ? 0 : NaN : originalExtent[0] - boundaryGap[0] * span;
  }

  if (max == null) {
    max = scaleType === 'ordinal' ? axisDataLen ? axisDataLen - 1 : NaN : originalExtent[1] + boundaryGap[1] * span;
  }

  if (min === 'dataMin') {
    min = originalExtent[0];
  } else if (typeof min === 'function') {
    min = min({
      min: originalExtent[0],
      max: originalExtent[1]
    });
  }

  if (max === 'dataMax') {
    max = originalExtent[1];
  } else if (typeof max === 'function') {
    max = max({
      min: originalExtent[0],
      max: originalExtent[1]
    });
  }

  (min == null || !isFinite(min)) && (min = NaN);
  (max == null || !isFinite(max)) && (max = NaN);
  scale.setBlank(zrUtil.eqNaN(min) || zrUtil.eqNaN(max)); // Evaluate if axis needs cross zero

  if (model.getNeedCrossZero()) {
    // Axis is over zero and min is not set
    if (min > 0 && max > 0 && !fixMin) {
      min = 0;
    } // Axis is under zero and max is not set


    if (min < 0 && max < 0 && !fixMax) {
      max = 0;
    }
  }

  return [min, max];
}

function niceScaleExtent(scale, model) {
  var extent = getScaleExtent(scale, model);
  var fixMin = model.getMin() != null;
  var fixMax = model.getMax() != null;
  var splitNumber = model.get('splitNumber');

  if (scale.type === 'log') {
    scale.base = model.get('logBase');
  }

  var scaleType = scale.type;
  scale.setExtent(extent[0], extent[1]);
  scale.niceExtent({
    splitNumber: splitNumber,
    fixMin: fixMin,
    fixMax: fixMax,
    minInterval: scaleType === 'interval' || scaleType === 'time' ? model.get('minInterval') : null,
    maxInterval: scaleType === 'interval' || scaleType === 'time' ? model.get('maxInterval') : null
  }); // If some one specified the min, max. And the default calculated interval
  // is not good enough. He can specify the interval. It is often appeared
  // in angle axis with angle 0 - 360. Interval calculated in interval scale is hard
  // to be 60.
  // FIXME

  var interval = model.get('interval');

  if (interval != null) {
    scale.setInterval && scale.setInterval(interval);
  }
}
/**
 * @param {module:echarts/model/Model} model
 * @param {string} [axisType] Default retrieve from model.type
 * @return {module:echarts/scale/*}
 */


function createScaleByModel(model, axisType) {
  axisType = axisType || model.get('type');

  if (axisType) {
    switch (axisType) {
      // Buildin scale
      case 'category':
        return new OrdinalScale(model.getCategories(), [Infinity, -Infinity]);

      case 'value':
        return new IntervalScale();
      // Extended scale, like time and log

      default:
        return (Scale.getClass(axisType) || IntervalScale).create(model);
    }
  }
}
/**
 * Check if the axis corss 0
 */


function ifAxisCrossZero(axis) {
  var dataExtent = axis.scale.getExtent();
  var min = dataExtent[0];
  var max = dataExtent[1];
  return !(min > 0 && max > 0 || min < 0 && max < 0);
}
/**
 * @param {Array.<number>} tickCoords In axis self coordinate.
 * @param {Array.<string>} labels
 * @param {string} font
 * @param {number} axisRotate 0: towards right horizontally, clock-wise is negative.
 * @param {number} [labelRotate=0] 0: towards right horizontally, clock-wise is negative.
 * @return {number}
 */


function getAxisLabelInterval(tickCoords, labels, font, axisRotate, labelRotate) {
  var textSpaceTakenRect;
  var autoLabelInterval = 0;
  var accumulatedLabelInterval = 0;
  var rotation = (axisRotate - labelRotate) / 180 * Math.PI;
  var step = 1;

  if (labels.length > 40) {
    // Simple optimization for large amount of labels
    step = Math.floor(labels.length / 40);
  }

  for (var i = 0; i < tickCoords.length; i += step) {
    var tickCoord = tickCoords[i]; // Not precise, do not consider align and vertical align
    // and each distance from axis line yet.

    var rect = textContain.getBoundingRect(labels[i], font, 'center', 'top');
    rect.x += tickCoord * Math.cos(rotation);
    rect.y += tickCoord * Math.sin(rotation); // Magic number

    rect.width *= 1.3;
    rect.height *= 1.3;

    if (!textSpaceTakenRect) {
      textSpaceTakenRect = rect.clone();
    } // There is no space for current label;
    else if (textSpaceTakenRect.intersect(rect)) {
        accumulatedLabelInterval++;
        autoLabelInterval = Math.max(autoLabelInterval, accumulatedLabelInterval);
      } else {
        textSpaceTakenRect.union(rect); // Reset

        accumulatedLabelInterval = 0;
      }
  }

  if (autoLabelInterval === 0 && step > 1) {
    return step;
  }

  return (autoLabelInterval + 1) * step - 1;
}
/**
 * @param {Object} axis
 * @param {Function} labelFormatter
 * @return {Array.<string>}
 */


function getFormattedLabels(axis, labelFormatter) {
  var scale = axis.scale;
  var labels = scale.getTicksLabels();
  var ticks = scale.getTicks();

  if (typeof labelFormatter === 'string') {
    labelFormatter = function (tpl) {
      return function (val) {
        return tpl.replace('{value}', val != null ? val : '');
      };
    }(labelFormatter); // Consider empty array


    return zrUtil.map(labels, labelFormatter);
  } else if (typeof labelFormatter === 'function') {
    return zrUtil.map(ticks, function (tick, idx) {
      return labelFormatter(getAxisRawValue(axis, tick), idx);
    }, this);
  } else {
    return labels;
  }
}

function getAxisRawValue(axis, value) {
  // In category axis with data zoom, tick is not the original
  // index of axis.data. So tick should not be exposed to user
  // in category axis.
  return axis.type === 'category' ? axis.scale.getLabel(value) : value;
}

exports.getScaleExtent = getScaleExtent;
exports.niceScaleExtent = niceScaleExtent;
exports.createScaleByModel = createScaleByModel;
exports.ifAxisCrossZero = ifAxisCrossZero;
exports.getAxisLabelInterval = getAxisLabelInterval;
exports.getFormattedLabels = getFormattedLabels;
exports.getAxisRawValue = getAxisRawValue;

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

var Eventful = __webpack_require__(227);

exports.Dispatcher = Eventful;

var env = __webpack_require__(213);

/**
 * 事件辅助类
 * @module zrender/core/event
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 */
var isDomLevel2 = typeof window !== 'undefined' && !!window.addEventListener;
var MOUSE_EVENT_REG = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;

function getBoundingClientRect(el) {
  // BlackBerry 5, iOS 3 (original iPhone) don't have getBoundingRect
  return el.getBoundingClientRect ? el.getBoundingClientRect() : {
    left: 0,
    top: 0
  };
} // `calculate` is optional, default false


function clientToLocal(el, e, out, calculate) {
  out = out || {}; // According to the W3C Working Draft, offsetX and offsetY should be relative
  // to the padding edge of the target element. The only browser using this convention
  // is IE. Webkit uses the border edge, Opera uses the content edge, and FireFox does
  // not support the properties.
  // (see http://www.jacklmoore.com/notes/mouse-position/)
  // In zr painter.dom, padding edge equals to border edge.
  // FIXME
  // When mousemove event triggered on ec tooltip, target is not zr painter.dom, and
  // offsetX/Y is relative to e.target, where the calculation of zrX/Y via offsetX/Y
  // is too complex. So css-transfrom dont support in this case temporarily.

  if (calculate || !env.canvasSupported) {
    defaultGetZrXY(el, e, out);
  } // Caution: In FireFox, layerX/layerY Mouse position relative to the closest positioned
  // ancestor element, so we should make sure el is positioned (e.g., not position:static).
  // BTW1, Webkit don't return the same results as FF in non-simple cases (like add
  // zoom-factor, overflow / opacity layers, transforms ...)
  // BTW2, (ev.offsetY || ev.pageY - $(ev.target).offset().top) is not correct in preserve-3d.
  // <https://bugs.jquery.com/ticket/8523#comment:14>
  // BTW3, In ff, offsetX/offsetY is always 0.
  else if (env.browser.firefox && e.layerX != null && e.layerX !== e.offsetX) {
      out.zrX = e.layerX;
      out.zrY = e.layerY;
    } // For IE6+, chrome, safari, opera. (When will ff support offsetX?)
    else if (e.offsetX != null) {
        out.zrX = e.offsetX;
        out.zrY = e.offsetY;
      } // For some other device, e.g., IOS safari.
      else {
          defaultGetZrXY(el, e, out);
        }

  return out;
}

function defaultGetZrXY(el, e, out) {
  // This well-known method below does not support css transform.
  var box = getBoundingClientRect(el);
  out.zrX = e.clientX - box.left;
  out.zrY = e.clientY - box.top;
}
/**
 * 如果存在第三方嵌入的一些dom触发的事件，或touch事件，需要转换一下事件坐标.
 * `calculate` is optional, default false.
 */


function normalizeEvent(el, e, calculate) {
  e = e || window.event;

  if (e.zrX != null) {
    return e;
  }

  var eventType = e.type;
  var isTouch = eventType && eventType.indexOf('touch') >= 0;

  if (!isTouch) {
    clientToLocal(el, e, e, calculate);
    e.zrDelta = e.wheelDelta ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
  } else {
    var touch = eventType != 'touchend' ? e.targetTouches[0] : e.changedTouches[0];
    touch && clientToLocal(el, touch, e, calculate);
  } // Add which for click: 1 === left; 2 === middle; 3 === right; otherwise: 0;
  // See jQuery: https://github.com/jquery/jquery/blob/master/src/event.js
  // If e.which has been defined, if may be readonly,
  // see: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/which


  var button = e.button;

  if (e.which == null && button !== undefined && MOUSE_EVENT_REG.test(e.type)) {
    e.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
  }

  return e;
}

function addEventListener(el, name, handler) {
  if (isDomLevel2) {
    el.addEventListener(name, handler);
  } else {
    el.attachEvent('on' + name, handler);
  }
}

function removeEventListener(el, name, handler) {
  if (isDomLevel2) {
    el.removeEventListener(name, handler);
  } else {
    el.detachEvent('on' + name, handler);
  }
}
/**
 * preventDefault and stopPropagation.
 * Notice: do not do that in zrender. Upper application
 * do that if necessary.
 *
 * @memberOf module:zrender/core/event
 * @method
 * @param {Event} e : event对象
 */


var stop = isDomLevel2 ? function (e) {
  e.preventDefault();
  e.stopPropagation();
  e.cancelBubble = true;
} : function (e) {
  e.returnValue = false;
  e.cancelBubble = true;
};

function notLeftMouse(e) {
  // If e.which is undefined, considered as left mouse event.
  return e.which > 1;
} // 做向上兼容


exports.clientToLocal = clientToLocal;
exports.normalizeEvent = normalizeEvent;
exports.addEventListener = addEventListener;
exports.removeEventListener = removeEventListener;
exports.stop = stop;
exports.notLeftMouse = notLeftMouse;

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

var LRU = __webpack_require__(261);

var kCSSColorTable = {
  'transparent': [0, 0, 0, 0],
  'aliceblue': [240, 248, 255, 1],
  'antiquewhite': [250, 235, 215, 1],
  'aqua': [0, 255, 255, 1],
  'aquamarine': [127, 255, 212, 1],
  'azure': [240, 255, 255, 1],
  'beige': [245, 245, 220, 1],
  'bisque': [255, 228, 196, 1],
  'black': [0, 0, 0, 1],
  'blanchedalmond': [255, 235, 205, 1],
  'blue': [0, 0, 255, 1],
  'blueviolet': [138, 43, 226, 1],
  'brown': [165, 42, 42, 1],
  'burlywood': [222, 184, 135, 1],
  'cadetblue': [95, 158, 160, 1],
  'chartreuse': [127, 255, 0, 1],
  'chocolate': [210, 105, 30, 1],
  'coral': [255, 127, 80, 1],
  'cornflowerblue': [100, 149, 237, 1],
  'cornsilk': [255, 248, 220, 1],
  'crimson': [220, 20, 60, 1],
  'cyan': [0, 255, 255, 1],
  'darkblue': [0, 0, 139, 1],
  'darkcyan': [0, 139, 139, 1],
  'darkgoldenrod': [184, 134, 11, 1],
  'darkgray': [169, 169, 169, 1],
  'darkgreen': [0, 100, 0, 1],
  'darkgrey': [169, 169, 169, 1],
  'darkkhaki': [189, 183, 107, 1],
  'darkmagenta': [139, 0, 139, 1],
  'darkolivegreen': [85, 107, 47, 1],
  'darkorange': [255, 140, 0, 1],
  'darkorchid': [153, 50, 204, 1],
  'darkred': [139, 0, 0, 1],
  'darksalmon': [233, 150, 122, 1],
  'darkseagreen': [143, 188, 143, 1],
  'darkslateblue': [72, 61, 139, 1],
  'darkslategray': [47, 79, 79, 1],
  'darkslategrey': [47, 79, 79, 1],
  'darkturquoise': [0, 206, 209, 1],
  'darkviolet': [148, 0, 211, 1],
  'deeppink': [255, 20, 147, 1],
  'deepskyblue': [0, 191, 255, 1],
  'dimgray': [105, 105, 105, 1],
  'dimgrey': [105, 105, 105, 1],
  'dodgerblue': [30, 144, 255, 1],
  'firebrick': [178, 34, 34, 1],
  'floralwhite': [255, 250, 240, 1],
  'forestgreen': [34, 139, 34, 1],
  'fuchsia': [255, 0, 255, 1],
  'gainsboro': [220, 220, 220, 1],
  'ghostwhite': [248, 248, 255, 1],
  'gold': [255, 215, 0, 1],
  'goldenrod': [218, 165, 32, 1],
  'gray': [128, 128, 128, 1],
  'green': [0, 128, 0, 1],
  'greenyellow': [173, 255, 47, 1],
  'grey': [128, 128, 128, 1],
  'honeydew': [240, 255, 240, 1],
  'hotpink': [255, 105, 180, 1],
  'indianred': [205, 92, 92, 1],
  'indigo': [75, 0, 130, 1],
  'ivory': [255, 255, 240, 1],
  'khaki': [240, 230, 140, 1],
  'lavender': [230, 230, 250, 1],
  'lavenderblush': [255, 240, 245, 1],
  'lawngreen': [124, 252, 0, 1],
  'lemonchiffon': [255, 250, 205, 1],
  'lightblue': [173, 216, 230, 1],
  'lightcoral': [240, 128, 128, 1],
  'lightcyan': [224, 255, 255, 1],
  'lightgoldenrodyellow': [250, 250, 210, 1],
  'lightgray': [211, 211, 211, 1],
  'lightgreen': [144, 238, 144, 1],
  'lightgrey': [211, 211, 211, 1],
  'lightpink': [255, 182, 193, 1],
  'lightsalmon': [255, 160, 122, 1],
  'lightseagreen': [32, 178, 170, 1],
  'lightskyblue': [135, 206, 250, 1],
  'lightslategray': [119, 136, 153, 1],
  'lightslategrey': [119, 136, 153, 1],
  'lightsteelblue': [176, 196, 222, 1],
  'lightyellow': [255, 255, 224, 1],
  'lime': [0, 255, 0, 1],
  'limegreen': [50, 205, 50, 1],
  'linen': [250, 240, 230, 1],
  'magenta': [255, 0, 255, 1],
  'maroon': [128, 0, 0, 1],
  'mediumaquamarine': [102, 205, 170, 1],
  'mediumblue': [0, 0, 205, 1],
  'mediumorchid': [186, 85, 211, 1],
  'mediumpurple': [147, 112, 219, 1],
  'mediumseagreen': [60, 179, 113, 1],
  'mediumslateblue': [123, 104, 238, 1],
  'mediumspringgreen': [0, 250, 154, 1],
  'mediumturquoise': [72, 209, 204, 1],
  'mediumvioletred': [199, 21, 133, 1],
  'midnightblue': [25, 25, 112, 1],
  'mintcream': [245, 255, 250, 1],
  'mistyrose': [255, 228, 225, 1],
  'moccasin': [255, 228, 181, 1],
  'navajowhite': [255, 222, 173, 1],
  'navy': [0, 0, 128, 1],
  'oldlace': [253, 245, 230, 1],
  'olive': [128, 128, 0, 1],
  'olivedrab': [107, 142, 35, 1],
  'orange': [255, 165, 0, 1],
  'orangered': [255, 69, 0, 1],
  'orchid': [218, 112, 214, 1],
  'palegoldenrod': [238, 232, 170, 1],
  'palegreen': [152, 251, 152, 1],
  'paleturquoise': [175, 238, 238, 1],
  'palevioletred': [219, 112, 147, 1],
  'papayawhip': [255, 239, 213, 1],
  'peachpuff': [255, 218, 185, 1],
  'peru': [205, 133, 63, 1],
  'pink': [255, 192, 203, 1],
  'plum': [221, 160, 221, 1],
  'powderblue': [176, 224, 230, 1],
  'purple': [128, 0, 128, 1],
  'red': [255, 0, 0, 1],
  'rosybrown': [188, 143, 143, 1],
  'royalblue': [65, 105, 225, 1],
  'saddlebrown': [139, 69, 19, 1],
  'salmon': [250, 128, 114, 1],
  'sandybrown': [244, 164, 96, 1],
  'seagreen': [46, 139, 87, 1],
  'seashell': [255, 245, 238, 1],
  'sienna': [160, 82, 45, 1],
  'silver': [192, 192, 192, 1],
  'skyblue': [135, 206, 235, 1],
  'slateblue': [106, 90, 205, 1],
  'slategray': [112, 128, 144, 1],
  'slategrey': [112, 128, 144, 1],
  'snow': [255, 250, 250, 1],
  'springgreen': [0, 255, 127, 1],
  'steelblue': [70, 130, 180, 1],
  'tan': [210, 180, 140, 1],
  'teal': [0, 128, 128, 1],
  'thistle': [216, 191, 216, 1],
  'tomato': [255, 99, 71, 1],
  'turquoise': [64, 224, 208, 1],
  'violet': [238, 130, 238, 1],
  'wheat': [245, 222, 179, 1],
  'white': [255, 255, 255, 1],
  'whitesmoke': [245, 245, 245, 1],
  'yellow': [255, 255, 0, 1],
  'yellowgreen': [154, 205, 50, 1]
};

function clampCssByte(i) {
  // Clamp to integer 0 .. 255.
  i = Math.round(i); // Seems to be what Chrome does (vs truncation).

  return i < 0 ? 0 : i > 255 ? 255 : i;
}

function clampCssAngle(i) {
  // Clamp to integer 0 .. 360.
  i = Math.round(i); // Seems to be what Chrome does (vs truncation).

  return i < 0 ? 0 : i > 360 ? 360 : i;
}

function clampCssFloat(f) {
  // Clamp to float 0.0 .. 1.0.
  return f < 0 ? 0 : f > 1 ? 1 : f;
}

function parseCssInt(str) {
  // int or percentage.
  if (str.length && str.charAt(str.length - 1) === '%') {
    return clampCssByte(parseFloat(str) / 100 * 255);
  }

  return clampCssByte(parseInt(str, 10));
}

function parseCssFloat(str) {
  // float or percentage.
  if (str.length && str.charAt(str.length - 1) === '%') {
    return clampCssFloat(parseFloat(str) / 100);
  }

  return clampCssFloat(parseFloat(str));
}

function cssHueToRgb(m1, m2, h) {
  if (h < 0) {
    h += 1;
  } else if (h > 1) {
    h -= 1;
  }

  if (h * 6 < 1) {
    return m1 + (m2 - m1) * h * 6;
  }

  if (h * 2 < 1) {
    return m2;
  }

  if (h * 3 < 2) {
    return m1 + (m2 - m1) * (2 / 3 - h) * 6;
  }

  return m1;
}

function lerpNumber(a, b, p) {
  return a + (b - a) * p;
}

function setRgba(out, r, g, b, a) {
  out[0] = r;
  out[1] = g;
  out[2] = b;
  out[3] = a;
  return out;
}

function copyRgba(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

var colorCache = new LRU(20);
var lastRemovedArr = null;

function putToCache(colorStr, rgbaArr) {
  // Reuse removed array
  if (lastRemovedArr) {
    copyRgba(lastRemovedArr, rgbaArr);
  }

  lastRemovedArr = colorCache.put(colorStr, lastRemovedArr || rgbaArr.slice());
}
/**
 * @param {string} colorStr
 * @param {Array.<number>} out
 * @return {Array.<number>}
 * @memberOf module:zrender/util/color
 */


function parse(colorStr, rgbaArr) {
  if (!colorStr) {
    return;
  }

  rgbaArr = rgbaArr || [];
  var cached = colorCache.get(colorStr);

  if (cached) {
    return copyRgba(rgbaArr, cached);
  } // colorStr may be not string


  colorStr = colorStr + ''; // Remove all whitespace, not compliant, but should just be more accepting.

  var str = colorStr.replace(/ /g, '').toLowerCase(); // Color keywords (and transparent) lookup.

  if (str in kCSSColorTable) {
    copyRgba(rgbaArr, kCSSColorTable[str]);
    putToCache(colorStr, rgbaArr);
    return rgbaArr;
  } // #abc and #abc123 syntax.


  if (str.charAt(0) === '#') {
    if (str.length === 4) {
      var iv = parseInt(str.substr(1), 16); // TODO(deanm): Stricter parsing.

      if (!(iv >= 0 && iv <= 0xfff)) {
        setRgba(rgbaArr, 0, 0, 0, 1);
        return; // Covers NaN.
      }

      setRgba(rgbaArr, (iv & 0xf00) >> 4 | (iv & 0xf00) >> 8, iv & 0xf0 | (iv & 0xf0) >> 4, iv & 0xf | (iv & 0xf) << 4, 1);
      putToCache(colorStr, rgbaArr);
      return rgbaArr;
    } else if (str.length === 7) {
      var iv = parseInt(str.substr(1), 16); // TODO(deanm): Stricter parsing.

      if (!(iv >= 0 && iv <= 0xffffff)) {
        setRgba(rgbaArr, 0, 0, 0, 1);
        return; // Covers NaN.
      }

      setRgba(rgbaArr, (iv & 0xff0000) >> 16, (iv & 0xff00) >> 8, iv & 0xff, 1);
      putToCache(colorStr, rgbaArr);
      return rgbaArr;
    }

    return;
  }

  var op = str.indexOf('('),
      ep = str.indexOf(')');

  if (op !== -1 && ep + 1 === str.length) {
    var fname = str.substr(0, op);
    var params = str.substr(op + 1, ep - (op + 1)).split(',');
    var alpha = 1; // To allow case fallthrough.

    switch (fname) {
      case 'rgba':
        if (params.length !== 4) {
          setRgba(rgbaArr, 0, 0, 0, 1);
          return;
        }

        alpha = parseCssFloat(params.pop());
      // jshint ignore:line
      // Fall through.

      case 'rgb':
        if (params.length !== 3) {
          setRgba(rgbaArr, 0, 0, 0, 1);
          return;
        }

        setRgba(rgbaArr, parseCssInt(params[0]), parseCssInt(params[1]), parseCssInt(params[2]), alpha);
        putToCache(colorStr, rgbaArr);
        return rgbaArr;

      case 'hsla':
        if (params.length !== 4) {
          setRgba(rgbaArr, 0, 0, 0, 1);
          return;
        }

        params[3] = parseCssFloat(params[3]);
        hsla2rgba(params, rgbaArr);
        putToCache(colorStr, rgbaArr);
        return rgbaArr;

      case 'hsl':
        if (params.length !== 3) {
          setRgba(rgbaArr, 0, 0, 0, 1);
          return;
        }

        hsla2rgba(params, rgbaArr);
        putToCache(colorStr, rgbaArr);
        return rgbaArr;

      default:
        return;
    }
  }

  setRgba(rgbaArr, 0, 0, 0, 1);
  return;
}
/**
 * @param {Array.<number>} hsla
 * @param {Array.<number>} rgba
 * @return {Array.<number>} rgba
 */


function hsla2rgba(hsla, rgba) {
  var h = (parseFloat(hsla[0]) % 360 + 360) % 360 / 360; // 0 .. 1
  // NOTE(deanm): According to the CSS spec s/l should only be
  // percentages, but we don't bother and let float or percentage.

  var s = parseCssFloat(hsla[1]);
  var l = parseCssFloat(hsla[2]);
  var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
  var m1 = l * 2 - m2;
  rgba = rgba || [];
  setRgba(rgba, clampCssByte(cssHueToRgb(m1, m2, h + 1 / 3) * 255), clampCssByte(cssHueToRgb(m1, m2, h) * 255), clampCssByte(cssHueToRgb(m1, m2, h - 1 / 3) * 255), 1);

  if (hsla.length === 4) {
    rgba[3] = hsla[3];
  }

  return rgba;
}
/**
 * @param {Array.<number>} rgba
 * @return {Array.<number>} hsla
 */


function rgba2hsla(rgba) {
  if (!rgba) {
    return;
  } // RGB from 0 to 255


  var R = rgba[0] / 255;
  var G = rgba[1] / 255;
  var B = rgba[2] / 255;
  var vMin = Math.min(R, G, B); // Min. value of RGB

  var vMax = Math.max(R, G, B); // Max. value of RGB

  var delta = vMax - vMin; // Delta RGB value

  var L = (vMax + vMin) / 2;
  var H;
  var S; // HSL results from 0 to 1

  if (delta === 0) {
    H = 0;
    S = 0;
  } else {
    if (L < 0.5) {
      S = delta / (vMax + vMin);
    } else {
      S = delta / (2 - vMax - vMin);
    }

    var deltaR = ((vMax - R) / 6 + delta / 2) / delta;
    var deltaG = ((vMax - G) / 6 + delta / 2) / delta;
    var deltaB = ((vMax - B) / 6 + delta / 2) / delta;

    if (R === vMax) {
      H = deltaB - deltaG;
    } else if (G === vMax) {
      H = 1 / 3 + deltaR - deltaB;
    } else if (B === vMax) {
      H = 2 / 3 + deltaG - deltaR;
    }

    if (H < 0) {
      H += 1;
    }

    if (H > 1) {
      H -= 1;
    }
  }

  var hsla = [H * 360, S, L];

  if (rgba[3] != null) {
    hsla.push(rgba[3]);
  }

  return hsla;
}
/**
 * @param {string} color
 * @param {number} level
 * @return {string}
 * @memberOf module:zrender/util/color
 */


function lift(color, level) {
  var colorArr = parse(color);

  if (colorArr) {
    for (var i = 0; i < 3; i++) {
      if (level < 0) {
        colorArr[i] = colorArr[i] * (1 - level) | 0;
      } else {
        colorArr[i] = (255 - colorArr[i]) * level + colorArr[i] | 0;
      }
    }

    return stringify(colorArr, colorArr.length === 4 ? 'rgba' : 'rgb');
  }
}
/**
 * @param {string} color
 * @return {string}
 * @memberOf module:zrender/util/color
 */


function toHex(color) {
  var colorArr = parse(color);

  if (colorArr) {
    return ((1 << 24) + (colorArr[0] << 16) + (colorArr[1] << 8) + +colorArr[2]).toString(16).slice(1);
  }
}
/**
 * Map value to color. Faster than lerp methods because color is represented by rgba array.
 * @param {number} normalizedValue A float between 0 and 1.
 * @param {Array.<Array.<number>>} colors List of rgba color array
 * @param {Array.<number>} [out] Mapped gba color array
 * @return {Array.<number>} will be null/undefined if input illegal.
 */


function fastLerp(normalizedValue, colors, out) {
  if (!(colors && colors.length) || !(normalizedValue >= 0 && normalizedValue <= 1)) {
    return;
  }

  out = out || [];
  var value = normalizedValue * (colors.length - 1);
  var leftIndex = Math.floor(value);
  var rightIndex = Math.ceil(value);
  var leftColor = colors[leftIndex];
  var rightColor = colors[rightIndex];
  var dv = value - leftIndex;
  out[0] = clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv));
  out[1] = clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv));
  out[2] = clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv));
  out[3] = clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv));
  return out;
}
/**
 * @deprecated
 */


var fastMapToColor = fastLerp;
/**
 * @param {number} normalizedValue A float between 0 and 1.
 * @param {Array.<string>} colors Color list.
 * @param {boolean=} fullOutput Default false.
 * @return {(string|Object)} Result color. If fullOutput,
 *                           return {color: ..., leftIndex: ..., rightIndex: ..., value: ...},
 * @memberOf module:zrender/util/color
 */

function lerp(normalizedValue, colors, fullOutput) {
  if (!(colors && colors.length) || !(normalizedValue >= 0 && normalizedValue <= 1)) {
    return;
  }

  var value = normalizedValue * (colors.length - 1);
  var leftIndex = Math.floor(value);
  var rightIndex = Math.ceil(value);
  var leftColor = parse(colors[leftIndex]);
  var rightColor = parse(colors[rightIndex]);
  var dv = value - leftIndex;
  var color = stringify([clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv)), clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv)), clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv)), clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv))], 'rgba');
  return fullOutput ? {
    color: color,
    leftIndex: leftIndex,
    rightIndex: rightIndex,
    value: value
  } : color;
}
/**
 * @deprecated
 */


var mapToColor = lerp;
/**
 * @param {string} color
 * @param {number=} h 0 ~ 360, ignore when null.
 * @param {number=} s 0 ~ 1, ignore when null.
 * @param {number=} l 0 ~ 1, ignore when null.
 * @return {string} Color string in rgba format.
 * @memberOf module:zrender/util/color
 */

function modifyHSL(color, h, s, l) {
  color = parse(color);

  if (color) {
    color = rgba2hsla(color);
    h != null && (color[0] = clampCssAngle(h));
    s != null && (color[1] = parseCssFloat(s));
    l != null && (color[2] = parseCssFloat(l));
    return stringify(hsla2rgba(color), 'rgba');
  }
}
/**
 * @param {string} color
 * @param {number=} alpha 0 ~ 1
 * @return {string} Color string in rgba format.
 * @memberOf module:zrender/util/color
 */


function modifyAlpha(color, alpha) {
  color = parse(color);

  if (color && alpha != null) {
    color[3] = clampCssFloat(alpha);
    return stringify(color, 'rgba');
  }
}
/**
 * @param {Array.<number>} arrColor like [12,33,44,0.4]
 * @param {string} type 'rgba', 'hsva', ...
 * @return {string} Result color. (If input illegal, return undefined).
 */


function stringify(arrColor, type) {
  if (!arrColor || !arrColor.length) {
    return;
  }

  var colorStr = arrColor[0] + ',' + arrColor[1] + ',' + arrColor[2];

  if (type === 'rgba' || type === 'hsva' || type === 'hsla') {
    colorStr += ',' + arrColor[3];
  }

  return type + '(' + colorStr + ')';
}

exports.parse = parse;
exports.lift = lift;
exports.toHex = toHex;
exports.fastLerp = fastLerp;
exports.fastMapToColor = fastMapToColor;
exports.lerp = lerp;
exports.mapToColor = mapToColor;
exports.modifyHSL = modifyHSL;
exports.modifyAlpha = modifyAlpha;
exports.stringify = stringify;

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

var clazzUtil = __webpack_require__(222);

/**
 * // Scale class management
 * @module echarts/scale/Scale
 */

/**
 * @param {Object} [setting]
 */
function Scale(setting) {
  this._setting = setting || {};
  /**
   * Extent
   * @type {Array.<number>}
   * @protected
   */

  this._extent = [Infinity, -Infinity];
  /**
   * Step is calculated in adjustExtent
   * @type {Array.<number>}
   * @protected
   */

  this._interval = 0;
  this.init && this.init.apply(this, arguments);
}
/**
 * Parse input val to valid inner number.
 * @param {*} val
 * @return {number}
 */


Scale.prototype.parse = function (val) {
  // Notice: This would be a trap here, If the implementation
  // of this method depends on extent, and this method is used
  // before extent set (like in dataZoom), it would be wrong.
  // Nevertheless, parse does not depend on extent generally.
  return val;
};

Scale.prototype.getSetting = function (name) {
  return this._setting[name];
};

Scale.prototype.contain = function (val) {
  var extent = this._extent;
  return val >= extent[0] && val <= extent[1];
};
/**
 * Normalize value to linear [0, 1], return 0.5 if extent span is 0
 * @param {number} val
 * @return {number}
 */


Scale.prototype.normalize = function (val) {
  var extent = this._extent;

  if (extent[1] === extent[0]) {
    return 0.5;
  }

  return (val - extent[0]) / (extent[1] - extent[0]);
};
/**
 * Scale normalized value
 * @param {number} val
 * @return {number}
 */


Scale.prototype.scale = function (val) {
  var extent = this._extent;
  return val * (extent[1] - extent[0]) + extent[0];
};
/**
 * Set extent from data
 * @param {Array.<number>} other
 */


Scale.prototype.unionExtent = function (other) {
  var extent = this._extent;
  other[0] < extent[0] && (extent[0] = other[0]);
  other[1] > extent[1] && (extent[1] = other[1]); // not setExtent because in log axis it may transformed to power
  // this.setExtent(extent[0], extent[1]);
};
/**
 * Set extent from data
 * @param {module:echarts/data/List} data
 * @param {string} dim
 */


Scale.prototype.unionExtentFromData = function (data, dim) {
  this.unionExtent(data.getDataExtent(dim, true));
};
/**
 * Get extent
 * @return {Array.<number>}
 */


Scale.prototype.getExtent = function () {
  return this._extent.slice();
};
/**
 * Set extent
 * @param {number} start
 * @param {number} end
 */


Scale.prototype.setExtent = function (start, end) {
  var thisExtent = this._extent;

  if (!isNaN(start)) {
    thisExtent[0] = start;
  }

  if (!isNaN(end)) {
    thisExtent[1] = end;
  }
};
/**
 * @return {Array.<string>}
 */


Scale.prototype.getTicksLabels = function () {
  var labels = [];
  var ticks = this.getTicks();

  for (var i = 0; i < ticks.length; i++) {
    labels.push(this.getLabel(ticks[i]));
  }

  return labels;
};
/**
 * When axis extent depends on data and no data exists,
 * axis ticks should not be drawn, which is named 'blank'.
 */


Scale.prototype.isBlank = function () {
  return this._isBlank;
},
/**
 * When axis extent depends on data and no data exists,
 * axis ticks should not be drawn, which is named 'blank'.
 */
Scale.prototype.setBlank = function (isBlank) {
  this._isBlank = isBlank;
};
clazzUtil.enableClassExtend(Scale);
clazzUtil.enableClassManagement(Scale, {
  registerWhenExtend: true
});
var _default = Scale;
module.exports = _default;

/***/ }),
/* 233 */
/***/ (function(module, exports) {

var dpr = 1; // If in browser environment

if (typeof window !== 'undefined') {
  dpr = Math.max(window.devicePixelRatio || 1, 1);
}
/**
 * config默认配置项
 * @exports zrender/config
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 */

/**
 * debug日志选项：catchBrushException为true下有效
 * 0 : 不生成debug数据，发布用
 * 1 : 异常抛出，调试用
 * 2 : 控制台输出，调试用
 */


var debugMode = 0; // retina 屏幕优化

var devicePixelRatio = dpr;
exports.debugMode = debugMode;
exports.devicePixelRatio = devicePixelRatio;

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var Element = __webpack_require__(256);

var BoundingRect = __webpack_require__(214);

/**
 * Group是一个容器，可以插入子节点，Group的变换也会被应用到子节点上
 * @module zrender/graphic/Group
 * @example
 *     var Group = require('zrender/container/Group');
 *     var Circle = require('zrender/graphic/shape/Circle');
 *     var g = new Group();
 *     g.position[0] = 100;
 *     g.position[1] = 100;
 *     g.add(new Circle({
 *         style: {
 *             x: 100,
 *             y: 100,
 *             r: 20,
 *         }
 *     }));
 *     zr.add(g);
 */

/**
 * @alias module:zrender/graphic/Group
 * @constructor
 * @extends module:zrender/mixin/Transformable
 * @extends module:zrender/mixin/Eventful
 */
var Group = function (opts) {
  opts = opts || {};
  Element.call(this, opts);

  for (var key in opts) {
    if (opts.hasOwnProperty(key)) {
      this[key] = opts[key];
    }
  }

  this._children = [];
  this.__storage = null;
  this.__dirty = true;
};

Group.prototype = {
  constructor: Group,
  isGroup: true,

  /**
   * @type {string}
   */
  type: 'group',

  /**
   * 所有子孙元素是否响应鼠标事件
   * @name module:/zrender/container/Group#silent
   * @type {boolean}
   * @default false
   */
  silent: false,

  /**
   * @return {Array.<module:zrender/Element>}
   */
  children: function () {
    return this._children.slice();
  },

  /**
   * 获取指定 index 的儿子节点
   * @param  {number} idx
   * @return {module:zrender/Element}
   */
  childAt: function (idx) {
    return this._children[idx];
  },

  /**
   * 获取指定名字的儿子节点
   * @param  {string} name
   * @return {module:zrender/Element}
   */
  childOfName: function (name) {
    var children = this._children;

    for (var i = 0; i < children.length; i++) {
      if (children[i].name === name) {
        return children[i];
      }
    }
  },

  /**
   * @return {number}
   */
  childCount: function () {
    return this._children.length;
  },

  /**
   * 添加子节点到最后
   * @param {module:zrender/Element} child
   */
  add: function (child) {
    if (child && child !== this && child.parent !== this) {
      this._children.push(child);

      this._doAdd(child);
    }

    return this;
  },

  /**
   * 添加子节点在 nextSibling 之前
   * @param {module:zrender/Element} child
   * @param {module:zrender/Element} nextSibling
   */
  addBefore: function (child, nextSibling) {
    if (child && child !== this && child.parent !== this && nextSibling && nextSibling.parent === this) {
      var children = this._children;
      var idx = children.indexOf(nextSibling);

      if (idx >= 0) {
        children.splice(idx, 0, child);

        this._doAdd(child);
      }
    }

    return this;
  },
  _doAdd: function (child) {
    if (child.parent) {
      child.parent.remove(child);
    }

    child.parent = this;
    var storage = this.__storage;
    var zr = this.__zr;

    if (storage && storage !== child.__storage) {
      storage.addToStorage(child);

      if (child instanceof Group) {
        child.addChildrenToStorage(storage);
      }
    }

    zr && zr.refresh();
  },

  /**
   * 移除子节点
   * @param {module:zrender/Element} child
   */
  remove: function (child) {
    var zr = this.__zr;
    var storage = this.__storage;
    var children = this._children;
    var idx = zrUtil.indexOf(children, child);

    if (idx < 0) {
      return this;
    }

    children.splice(idx, 1);
    child.parent = null;

    if (storage) {
      storage.delFromStorage(child);

      if (child instanceof Group) {
        child.delChildrenFromStorage(storage);
      }
    }

    zr && zr.refresh();
    return this;
  },

  /**
   * 移除所有子节点
   */
  removeAll: function () {
    var children = this._children;
    var storage = this.__storage;
    var child;
    var i;

    for (i = 0; i < children.length; i++) {
      child = children[i];

      if (storage) {
        storage.delFromStorage(child);

        if (child instanceof Group) {
          child.delChildrenFromStorage(storage);
        }
      }

      child.parent = null;
    }

    children.length = 0;
    return this;
  },

  /**
   * 遍历所有子节点
   * @param  {Function} cb
   * @param  {}   context
   */
  eachChild: function (cb, context) {
    var children = this._children;

    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      cb.call(context, child, i);
    }

    return this;
  },

  /**
   * 深度优先遍历所有子孙节点
   * @param  {Function} cb
   * @param  {}   context
   */
  traverse: function (cb, context) {
    for (var i = 0; i < this._children.length; i++) {
      var child = this._children[i];
      cb.call(context, child);

      if (child.type === 'group') {
        child.traverse(cb, context);
      }
    }

    return this;
  },
  addChildrenToStorage: function (storage) {
    for (var i = 0; i < this._children.length; i++) {
      var child = this._children[i];
      storage.addToStorage(child);

      if (child instanceof Group) {
        child.addChildrenToStorage(storage);
      }
    }
  },
  delChildrenFromStorage: function (storage) {
    for (var i = 0; i < this._children.length; i++) {
      var child = this._children[i];
      storage.delFromStorage(child);

      if (child instanceof Group) {
        child.delChildrenFromStorage(storage);
      }
    }
  },
  dirty: function () {
    this.__dirty = true;
    this.__zr && this.__zr.refresh();
    return this;
  },

  /**
   * @return {module:zrender/core/BoundingRect}
   */
  getBoundingRect: function (includeChildren) {
    // TODO Caching
    var rect = null;
    var tmpRect = new BoundingRect(0, 0, 0, 0);
    var children = includeChildren || this._children;
    var tmpMat = [];

    for (var i = 0; i < children.length; i++) {
      var child = children[i];

      if (child.ignore || child.invisible) {
        continue;
      }

      var childRect = child.getBoundingRect();
      var transform = child.getLocalTransform(tmpMat); // TODO
      // The boundingRect cacluated by transforming original
      // rect may be bigger than the actual bundingRect when rotation
      // is used. (Consider a circle rotated aginst its center, where
      // the actual boundingRect should be the same as that not be
      // rotated.) But we can not find better approach to calculate
      // actual boundingRect yet, considering performance.

      if (transform) {
        tmpRect.copy(childRect);
        tmpRect.applyTransform(transform);
        rect = rect || tmpRect.clone();
        rect.union(tmpRect);
      } else {
        rect = rect || childRect.clone();
        rect.union(childRect);
      }
    }

    return rect || tmpRect;
  }
};
zrUtil.inherits(Group, Element);
var _default = Group;
module.exports = _default;

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

var curve = __webpack_require__(226);

var vec2 = __webpack_require__(203);

var bbox = __webpack_require__(262);

var BoundingRect = __webpack_require__(214);

var _config = __webpack_require__(233);

var dpr = _config.devicePixelRatio;

/**
 * Path 代理，可以在`buildPath`中用于替代`ctx`, 会保存每个path操作的命令到pathCommands属性中
 * 可以用于 isInsidePath 判断以及获取boundingRect
 *
 * @module zrender/core/PathProxy
 * @author Yi Shen (http://www.github.com/pissang)
 */
// TODO getTotalLength, getPointAtLength
var CMD = {
  M: 1,
  L: 2,
  C: 3,
  Q: 4,
  A: 5,
  Z: 6,
  // Rect
  R: 7
}; // var CMD_MEM_SIZE = {
//     M: 3,
//     L: 3,
//     C: 7,
//     Q: 5,
//     A: 9,
//     R: 5,
//     Z: 1
// };

var min = [];
var max = [];
var min2 = [];
var max2 = [];
var mathMin = Math.min;
var mathMax = Math.max;
var mathCos = Math.cos;
var mathSin = Math.sin;
var mathSqrt = Math.sqrt;
var mathAbs = Math.abs;
var hasTypedArray = typeof Float32Array != 'undefined';
/**
 * @alias module:zrender/core/PathProxy
 * @constructor
 */

var PathProxy = function (notSaveData) {
  this._saveData = !(notSaveData || false);

  if (this._saveData) {
    /**
     * Path data. Stored as flat array
     * @type {Array.<Object>}
     */
    this.data = [];
  }

  this._ctx = null;
};
/**
 * 快速计算Path包围盒（并不是最小包围盒）
 * @return {Object}
 */


PathProxy.prototype = {
  constructor: PathProxy,
  _xi: 0,
  _yi: 0,
  _x0: 0,
  _y0: 0,
  // Unit x, Unit y. Provide for avoiding drawing that too short line segment
  _ux: 0,
  _uy: 0,
  _len: 0,
  _lineDash: null,
  _dashOffset: 0,
  _dashIdx: 0,
  _dashSum: 0,

  /**
   * @readOnly
   */
  setScale: function (sx, sy) {
    this._ux = mathAbs(1 / dpr / sx) || 0;
    this._uy = mathAbs(1 / dpr / sy) || 0;
  },
  getContext: function () {
    return this._ctx;
  },

  /**
   * @param  {CanvasRenderingContext2D} ctx
   * @return {module:zrender/core/PathProxy}
   */
  beginPath: function (ctx) {
    this._ctx = ctx;
    ctx && ctx.beginPath();
    ctx && (this.dpr = ctx.dpr); // Reset

    if (this._saveData) {
      this._len = 0;
    }

    if (this._lineDash) {
      this._lineDash = null;
      this._dashOffset = 0;
    }

    return this;
  },

  /**
   * @param  {number} x
   * @param  {number} y
   * @return {module:zrender/core/PathProxy}
   */
  moveTo: function (x, y) {
    this.addData(CMD.M, x, y);
    this._ctx && this._ctx.moveTo(x, y); // x0, y0, xi, yi 是记录在 _dashedXXXXTo 方法中使用
    // xi, yi 记录当前点, x0, y0 在 closePath 的时候回到起始点。
    // 有可能在 beginPath 之后直接调用 lineTo，这时候 x0, y0 需要
    // 在 lineTo 方法中记录，这里先不考虑这种情况，dashed line 也只在 IE10- 中不支持

    this._x0 = x;
    this._y0 = y;
    this._xi = x;
    this._yi = y;
    return this;
  },

  /**
   * @param  {number} x
   * @param  {number} y
   * @return {module:zrender/core/PathProxy}
   */
  lineTo: function (x, y) {
    var exceedUnit = mathAbs(x - this._xi) > this._ux || mathAbs(y - this._yi) > this._uy // Force draw the first segment
    || this._len < 5;
    this.addData(CMD.L, x, y);

    if (this._ctx && exceedUnit) {
      this._needsDash() ? this._dashedLineTo(x, y) : this._ctx.lineTo(x, y);
    }

    if (exceedUnit) {
      this._xi = x;
      this._yi = y;
    }

    return this;
  },

  /**
   * @param  {number} x1
   * @param  {number} y1
   * @param  {number} x2
   * @param  {number} y2
   * @param  {number} x3
   * @param  {number} y3
   * @return {module:zrender/core/PathProxy}
   */
  bezierCurveTo: function (x1, y1, x2, y2, x3, y3) {
    this.addData(CMD.C, x1, y1, x2, y2, x3, y3);

    if (this._ctx) {
      this._needsDash() ? this._dashedBezierTo(x1, y1, x2, y2, x3, y3) : this._ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    }

    this._xi = x3;
    this._yi = y3;
    return this;
  },

  /**
   * @param  {number} x1
   * @param  {number} y1
   * @param  {number} x2
   * @param  {number} y2
   * @return {module:zrender/core/PathProxy}
   */
  quadraticCurveTo: function (x1, y1, x2, y2) {
    this.addData(CMD.Q, x1, y1, x2, y2);

    if (this._ctx) {
      this._needsDash() ? this._dashedQuadraticTo(x1, y1, x2, y2) : this._ctx.quadraticCurveTo(x1, y1, x2, y2);
    }

    this._xi = x2;
    this._yi = y2;
    return this;
  },

  /**
   * @param  {number} cx
   * @param  {number} cy
   * @param  {number} r
   * @param  {number} startAngle
   * @param  {number} endAngle
   * @param  {boolean} anticlockwise
   * @return {module:zrender/core/PathProxy}
   */
  arc: function (cx, cy, r, startAngle, endAngle, anticlockwise) {
    this.addData(CMD.A, cx, cy, r, r, startAngle, endAngle - startAngle, 0, anticlockwise ? 0 : 1);
    this._ctx && this._ctx.arc(cx, cy, r, startAngle, endAngle, anticlockwise);
    this._xi = mathCos(endAngle) * r + cx;
    this._yi = mathSin(endAngle) * r + cx;
    return this;
  },
  // TODO
  arcTo: function (x1, y1, x2, y2, radius) {
    if (this._ctx) {
      this._ctx.arcTo(x1, y1, x2, y2, radius);
    }

    return this;
  },
  // TODO
  rect: function (x, y, w, h) {
    this._ctx && this._ctx.rect(x, y, w, h);
    this.addData(CMD.R, x, y, w, h);
    return this;
  },

  /**
   * @return {module:zrender/core/PathProxy}
   */
  closePath: function () {
    this.addData(CMD.Z);
    var ctx = this._ctx;
    var x0 = this._x0;
    var y0 = this._y0;

    if (ctx) {
      this._needsDash() && this._dashedLineTo(x0, y0);
      ctx.closePath();
    }

    this._xi = x0;
    this._yi = y0;
    return this;
  },

  /**
   * Context 从外部传入，因为有可能是 rebuildPath 完之后再 fill。
   * stroke 同样
   * @param {CanvasRenderingContext2D} ctx
   * @return {module:zrender/core/PathProxy}
   */
  fill: function (ctx) {
    ctx && ctx.fill();
    this.toStatic();
  },

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @return {module:zrender/core/PathProxy}
   */
  stroke: function (ctx) {
    ctx && ctx.stroke();
    this.toStatic();
  },

  /**
   * 必须在其它绘制命令前调用
   * Must be invoked before all other path drawing methods
   * @return {module:zrender/core/PathProxy}
   */
  setLineDash: function (lineDash) {
    if (lineDash instanceof Array) {
      this._lineDash = lineDash;
      this._dashIdx = 0;
      var lineDashSum = 0;

      for (var i = 0; i < lineDash.length; i++) {
        lineDashSum += lineDash[i];
      }

      this._dashSum = lineDashSum;
    }

    return this;
  },

  /**
   * 必须在其它绘制命令前调用
   * Must be invoked before all other path drawing methods
   * @return {module:zrender/core/PathProxy}
   */
  setLineDashOffset: function (offset) {
    this._dashOffset = offset;
    return this;
  },

  /**
   *
   * @return {boolean}
   */
  len: function () {
    return this._len;
  },

  /**
   * 直接设置 Path 数据
   */
  setData: function (data) {
    var len = data.length;

    if (!(this.data && this.data.length == len) && hasTypedArray) {
      this.data = new Float32Array(len);
    }

    for (var i = 0; i < len; i++) {
      this.data[i] = data[i];
    }

    this._len = len;
  },

  /**
   * 添加子路径
   * @param {module:zrender/core/PathProxy|Array.<module:zrender/core/PathProxy>} path
   */
  appendPath: function (path) {
    if (!(path instanceof Array)) {
      path = [path];
    }

    var len = path.length;
    var appendSize = 0;
    var offset = this._len;

    for (var i = 0; i < len; i++) {
      appendSize += path[i].len();
    }

    if (hasTypedArray && this.data instanceof Float32Array) {
      this.data = new Float32Array(offset + appendSize);
    }

    for (var i = 0; i < len; i++) {
      var appendPathData = path[i].data;

      for (var k = 0; k < appendPathData.length; k++) {
        this.data[offset++] = appendPathData[k];
      }
    }

    this._len = offset;
  },

  /**
   * 填充 Path 数据。
   * 尽量复用而不申明新的数组。大部分图形重绘的指令数据长度都是不变的。
   */
  addData: function (cmd) {
    if (!this._saveData) {
      return;
    }

    var data = this.data;

    if (this._len + arguments.length > data.length) {
      // 因为之前的数组已经转换成静态的 Float32Array
      // 所以不够用时需要扩展一个新的动态数组
      this._expandData();

      data = this.data;
    }

    for (var i = 0; i < arguments.length; i++) {
      data[this._len++] = arguments[i];
    }

    this._prevCmd = cmd;
  },
  _expandData: function () {
    // Only if data is Float32Array
    if (!(this.data instanceof Array)) {
      var newData = [];

      for (var i = 0; i < this._len; i++) {
        newData[i] = this.data[i];
      }

      this.data = newData;
    }
  },

  /**
   * If needs js implemented dashed line
   * @return {boolean}
   * @private
   */
  _needsDash: function () {
    return this._lineDash;
  },
  _dashedLineTo: function (x1, y1) {
    var dashSum = this._dashSum;
    var offset = this._dashOffset;
    var lineDash = this._lineDash;
    var ctx = this._ctx;
    var x0 = this._xi;
    var y0 = this._yi;
    var dx = x1 - x0;
    var dy = y1 - y0;
    var dist = mathSqrt(dx * dx + dy * dy);
    var x = x0;
    var y = y0;
    var dash;
    var nDash = lineDash.length;
    var idx;
    dx /= dist;
    dy /= dist;

    if (offset < 0) {
      // Convert to positive offset
      offset = dashSum + offset;
    }

    offset %= dashSum;
    x -= offset * dx;
    y -= offset * dy;

    while (dx > 0 && x <= x1 || dx < 0 && x >= x1 || dx == 0 && (dy > 0 && y <= y1 || dy < 0 && y >= y1)) {
      idx = this._dashIdx;
      dash = lineDash[idx];
      x += dx * dash;
      y += dy * dash;
      this._dashIdx = (idx + 1) % nDash; // Skip positive offset

      if (dx > 0 && x < x0 || dx < 0 && x > x0 || dy > 0 && y < y0 || dy < 0 && y > y0) {
        continue;
      }

      ctx[idx % 2 ? 'moveTo' : 'lineTo'](dx >= 0 ? mathMin(x, x1) : mathMax(x, x1), dy >= 0 ? mathMin(y, y1) : mathMax(y, y1));
    } // Offset for next lineTo


    dx = x - x1;
    dy = y - y1;
    this._dashOffset = -mathSqrt(dx * dx + dy * dy);
  },
  // Not accurate dashed line to
  _dashedBezierTo: function (x1, y1, x2, y2, x3, y3) {
    var dashSum = this._dashSum;
    var offset = this._dashOffset;
    var lineDash = this._lineDash;
    var ctx = this._ctx;
    var x0 = this._xi;
    var y0 = this._yi;
    var t;
    var dx;
    var dy;
    var cubicAt = curve.cubicAt;
    var bezierLen = 0;
    var idx = this._dashIdx;
    var nDash = lineDash.length;
    var x;
    var y;
    var tmpLen = 0;

    if (offset < 0) {
      // Convert to positive offset
      offset = dashSum + offset;
    }

    offset %= dashSum; // Bezier approx length

    for (t = 0; t < 1; t += 0.1) {
      dx = cubicAt(x0, x1, x2, x3, t + 0.1) - cubicAt(x0, x1, x2, x3, t);
      dy = cubicAt(y0, y1, y2, y3, t + 0.1) - cubicAt(y0, y1, y2, y3, t);
      bezierLen += mathSqrt(dx * dx + dy * dy);
    } // Find idx after add offset


    for (; idx < nDash; idx++) {
      tmpLen += lineDash[idx];

      if (tmpLen > offset) {
        break;
      }
    }

    t = (tmpLen - offset) / bezierLen;

    while (t <= 1) {
      x = cubicAt(x0, x1, x2, x3, t);
      y = cubicAt(y0, y1, y2, y3, t); // Use line to approximate dashed bezier
      // Bad result if dash is long

      idx % 2 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      t += lineDash[idx] / bezierLen;
      idx = (idx + 1) % nDash;
    } // Finish the last segment and calculate the new offset


    idx % 2 !== 0 && ctx.lineTo(x3, y3);
    dx = x3 - x;
    dy = y3 - y;
    this._dashOffset = -mathSqrt(dx * dx + dy * dy);
  },
  _dashedQuadraticTo: function (x1, y1, x2, y2) {
    // Convert quadratic to cubic using degree elevation
    var x3 = x2;
    var y3 = y2;
    x2 = (x2 + 2 * x1) / 3;
    y2 = (y2 + 2 * y1) / 3;
    x1 = (this._xi + 2 * x1) / 3;
    y1 = (this._yi + 2 * y1) / 3;

    this._dashedBezierTo(x1, y1, x2, y2, x3, y3);
  },

  /**
   * 转成静态的 Float32Array 减少堆内存占用
   * Convert dynamic array to static Float32Array
   */
  toStatic: function () {
    var data = this.data;

    if (data instanceof Array) {
      data.length = this._len;

      if (hasTypedArray) {
        this.data = new Float32Array(data);
      }
    }
  },

  /**
   * @return {module:zrender/core/BoundingRect}
   */
  getBoundingRect: function () {
    min[0] = min[1] = min2[0] = min2[1] = Number.MAX_VALUE;
    max[0] = max[1] = max2[0] = max2[1] = -Number.MAX_VALUE;
    var data = this.data;
    var xi = 0;
    var yi = 0;
    var x0 = 0;
    var y0 = 0;

    for (var i = 0; i < data.length;) {
      var cmd = data[i++];

      if (i == 1) {
        // 如果第一个命令是 L, C, Q
        // 则 previous point 同绘制命令的第一个 point
        //
        // 第一个命令为 Arc 的情况下会在后面特殊处理
        xi = data[i];
        yi = data[i + 1];
        x0 = xi;
        y0 = yi;
      }

      switch (cmd) {
        case CMD.M:
          // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
          // 在 closePath 的时候使用
          x0 = data[i++];
          y0 = data[i++];
          xi = x0;
          yi = y0;
          min2[0] = x0;
          min2[1] = y0;
          max2[0] = x0;
          max2[1] = y0;
          break;

        case CMD.L:
          bbox.fromLine(xi, yi, data[i], data[i + 1], min2, max2);
          xi = data[i++];
          yi = data[i++];
          break;

        case CMD.C:
          bbox.fromCubic(xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1], min2, max2);
          xi = data[i++];
          yi = data[i++];
          break;

        case CMD.Q:
          bbox.fromQuadratic(xi, yi, data[i++], data[i++], data[i], data[i + 1], min2, max2);
          xi = data[i++];
          yi = data[i++];
          break;

        case CMD.A:
          // TODO Arc 判断的开销比较大
          var cx = data[i++];
          var cy = data[i++];
          var rx = data[i++];
          var ry = data[i++];
          var startAngle = data[i++];
          var endAngle = data[i++] + startAngle; // TODO Arc 旋转

          var psi = data[i++];
          var anticlockwise = 1 - data[i++];

          if (i == 1) {
            // 直接使用 arc 命令
            // 第一个命令起点还未定义
            x0 = mathCos(startAngle) * rx + cx;
            y0 = mathSin(startAngle) * ry + cy;
          }

          bbox.fromArc(cx, cy, rx, ry, startAngle, endAngle, anticlockwise, min2, max2);
          xi = mathCos(endAngle) * rx + cx;
          yi = mathSin(endAngle) * ry + cy;
          break;

        case CMD.R:
          x0 = xi = data[i++];
          y0 = yi = data[i++];
          var width = data[i++];
          var height = data[i++]; // Use fromLine

          bbox.fromLine(x0, y0, x0 + width, y0 + height, min2, max2);
          break;

        case CMD.Z:
          xi = x0;
          yi = y0;
          break;
      } // Union


      vec2.min(min, min, min2);
      vec2.max(max, max, max2);
    } // No data


    if (i === 0) {
      min[0] = min[1] = max[0] = max[1] = 0;
    }

    return new BoundingRect(min[0], min[1], max[0] - min[0], max[1] - min[1]);
  },

  /**
   * Rebuild path from current data
   * Rebuild path will not consider javascript implemented line dash.
   * @param {CanvasRenderingContext2D} ctx
   */
  rebuildPath: function (ctx) {
    var d = this.data;
    var x0, y0;
    var xi, yi;
    var x, y;
    var ux = this._ux;
    var uy = this._uy;
    var len = this._len;

    for (var i = 0; i < len;) {
      var cmd = d[i++];

      if (i == 1) {
        // 如果第一个命令是 L, C, Q
        // 则 previous point 同绘制命令的第一个 point
        //
        // 第一个命令为 Arc 的情况下会在后面特殊处理
        xi = d[i];
        yi = d[i + 1];
        x0 = xi;
        y0 = yi;
      }

      switch (cmd) {
        case CMD.M:
          x0 = xi = d[i++];
          y0 = yi = d[i++];
          ctx.moveTo(xi, yi);
          break;

        case CMD.L:
          x = d[i++];
          y = d[i++]; // Not draw too small seg between

          if (mathAbs(x - xi) > ux || mathAbs(y - yi) > uy || i === len - 1) {
            ctx.lineTo(x, y);
            xi = x;
            yi = y;
          }

          break;

        case CMD.C:
          ctx.bezierCurveTo(d[i++], d[i++], d[i++], d[i++], d[i++], d[i++]);
          xi = d[i - 2];
          yi = d[i - 1];
          break;

        case CMD.Q:
          ctx.quadraticCurveTo(d[i++], d[i++], d[i++], d[i++]);
          xi = d[i - 2];
          yi = d[i - 1];
          break;

        case CMD.A:
          var cx = d[i++];
          var cy = d[i++];
          var rx = d[i++];
          var ry = d[i++];
          var theta = d[i++];
          var dTheta = d[i++];
          var psi = d[i++];
          var fs = d[i++];
          var r = rx > ry ? rx : ry;
          var scaleX = rx > ry ? 1 : rx / ry;
          var scaleY = rx > ry ? ry / rx : 1;
          var isEllipse = Math.abs(rx - ry) > 1e-3;
          var endAngle = theta + dTheta;

          if (isEllipse) {
            ctx.translate(cx, cy);
            ctx.rotate(psi);
            ctx.scale(scaleX, scaleY);
            ctx.arc(0, 0, r, theta, endAngle, 1 - fs);
            ctx.scale(1 / scaleX, 1 / scaleY);
            ctx.rotate(-psi);
            ctx.translate(-cx, -cy);
          } else {
            ctx.arc(cx, cy, r, theta, endAngle, 1 - fs);
          }

          if (i == 1) {
            // 直接使用 arc 命令
            // 第一个命令起点还未定义
            x0 = mathCos(theta) * rx + cx;
            y0 = mathSin(theta) * ry + cy;
          }

          xi = mathCos(endAngle) * rx + cx;
          yi = mathSin(endAngle) * ry + cy;
          break;

        case CMD.R:
          x0 = xi = d[i];
          y0 = yi = d[i + 1];
          ctx.rect(d[i++], d[i++], d[i++], d[i++]);
          break;

        case CMD.Z:
          ctx.closePath();
          xi = x0;
          yi = y0;
      }
    }
  }
};
PathProxy.CMD = CMD;
var _default = PathProxy;
module.exports = _default;

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

// TODO Parse shadow style
// TODO Only shallow path support
function _default(properties) {
  // Normalize
  for (var i = 0; i < properties.length; i++) {
    if (!properties[i][1]) {
      properties[i][1] = properties[i][0];
    }
  }

  return function (model, excludes, includes) {
    var style = {};

    for (var i = 0; i < properties.length; i++) {
      var propName = properties[i][1];

      if (excludes && zrUtil.indexOf(excludes, propName) >= 0 || includes && zrUtil.indexOf(includes, propName) < 0) {
        continue;
      }

      var val = model.getShallow(propName);

      if (val != null) {
        style[properties[i][0]] = val;
      }
    }

    return style;
  };
}

module.exports = _default;

/***/ }),
/* 237 */,
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var _config = __webpack_require__(211);

var __DEV__ = _config.__DEV__;

var zrUtil = __webpack_require__(196);

var Model = __webpack_require__(221);

var DataDiffer = __webpack_require__(250);

var modelUtil = __webpack_require__(201);

/**
 * List for data storage
 * @module echarts/data/List
 */
var isObject = zrUtil.isObject;
var UNDEFINED = 'undefined';
var globalObj = typeof window === UNDEFINED ? global : window;
var dataCtors = {
  'float': typeof globalObj.Float64Array === UNDEFINED ? Array : globalObj.Float64Array,
  'int': typeof globalObj.Int32Array === UNDEFINED ? Array : globalObj.Int32Array,
  // Ordinal data type can be string or int
  'ordinal': Array,
  'number': Array,
  'time': Array
};
var TRANSFERABLE_PROPERTIES = ['stackedOn', 'hasItemOption', '_nameList', '_idList', '_rawData'];

function transferProperties(a, b) {
  zrUtil.each(TRANSFERABLE_PROPERTIES.concat(b.__wrappedMethods || []), function (propName) {
    if (b.hasOwnProperty(propName)) {
      a[propName] = b[propName];
    }
  });
  a.__wrappedMethods = b.__wrappedMethods;
}

function DefaultDataProvider(dataArray) {
  this._array = dataArray || [];
}

DefaultDataProvider.prototype.pure = false;

DefaultDataProvider.prototype.count = function () {
  return this._array.length;
};

DefaultDataProvider.prototype.getItem = function (idx) {
  return this._array[idx];
};
/**
 * @constructor
 * @alias module:echarts/data/List
 *
 * @param {Array.<string|Object>} dimensions
 *      For example, ['someDimName', {name: 'someDimName', type: 'someDimType'}, ...].
 *      Dimensions should be concrete names like x, y, z, lng, lat, angle, radius
 * @param {module:echarts/model/Model} hostModel
 */


var List = function (dimensions, hostModel) {
  dimensions = dimensions || ['x', 'y'];
  var dimensionInfos = {};
  var dimensionNames = [];

  for (var i = 0; i < dimensions.length; i++) {
    var dimensionName;
    var dimensionInfo = {};

    if (typeof dimensions[i] === 'string') {
      dimensionName = dimensions[i];
      dimensionInfo = {
        name: dimensionName,
        coordDim: dimensionName,
        coordDimIndex: 0,
        stackable: false,
        // Type can be 'float', 'int', 'number'
        // Default is number, Precision of float may not enough
        type: 'number'
      };
    } else {
      dimensionInfo = dimensions[i];
      dimensionName = dimensionInfo.name;
      dimensionInfo.type = dimensionInfo.type || 'number';

      if (!dimensionInfo.coordDim) {
        dimensionInfo.coordDim = dimensionName;
        dimensionInfo.coordDimIndex = 0;
      }
    }

    dimensionInfo.otherDims = dimensionInfo.otherDims || {};
    dimensionNames.push(dimensionName);
    dimensionInfos[dimensionName] = dimensionInfo;
  }
  /**
   * @readOnly
   * @type {Array.<string>}
   */


  this.dimensions = dimensionNames;
  /**
   * Infomation of each data dimension, like data type.
   * @type {Object}
   */

  this._dimensionInfos = dimensionInfos;
  /**
   * @type {module:echarts/model/Model}
   */

  this.hostModel = hostModel;
  /**
   * @type {module:echarts/model/Model}
   */

  this.dataType;
  /**
   * Indices stores the indices of data subset after filtered.
   * This data subset will be used in chart.
   * @type {Array.<number>}
   * @readOnly
   */

  this.indices = [];
  /**
   * Data storage
   * @type {Object.<key, TypedArray|Array>}
   * @private
   */

  this._storage = {};
  /**
   * @type {Array.<string>}
   */

  this._nameList = [];
  /**
   * @type {Array.<string>}
   */

  this._idList = [];
  /**
   * Models of data option is stored sparse for optimizing memory cost
   * @type {Array.<module:echarts/model/Model>}
   * @private
   */

  this._optionModels = [];
  /**
   * @param {module:echarts/data/List}
   */

  this.stackedOn = null;
  /**
   * Global visual properties after visual coding
   * @type {Object}
   * @private
   */

  this._visual = {};
  /**
   * Globel layout properties.
   * @type {Object}
   * @private
   */

  this._layout = {};
  /**
   * Item visual properties after visual coding
   * @type {Array.<Object>}
   * @private
   */

  this._itemVisuals = [];
  /**
   * Item layout properties after layout
   * @type {Array.<Object>}
   * @private
   */

  this._itemLayouts = [];
  /**
   * Graphic elemnents
   * @type {Array.<module:zrender/Element>}
   * @private
   */

  this._graphicEls = [];
  /**
   * @type {Array.<Array|Object>}
   * @private
   */

  this._rawData;
  /**
   * @type {Object}
   * @private
   */

  this._extent;
};

var listProto = List.prototype;
listProto.type = 'list';
/**
 * If each data item has it's own option
 * @type {boolean}
 */

listProto.hasItemOption = true;
/**
 * Get dimension name
 * @param {string|number} dim
 *        Dimension can be concrete names like x, y, z, lng, lat, angle, radius
 *        Or a ordinal number. For example getDimensionInfo(0) will return 'x' or 'lng' or 'radius'
 * @return {string} Concrete dim name.
 */

listProto.getDimension = function (dim) {
  if (!isNaN(dim)) {
    dim = this.dimensions[dim] || dim;
  }

  return dim;
};
/**
 * Get type and stackable info of particular dimension
 * @param {string|number} dim
 *        Dimension can be concrete names like x, y, z, lng, lat, angle, radius
 *        Or a ordinal number. For example getDimensionInfo(0) will return 'x' or 'lng' or 'radius'
 */


listProto.getDimensionInfo = function (dim) {
  return zrUtil.clone(this._dimensionInfos[this.getDimension(dim)]);
};
/**
 * Initialize from data
 * @param {Array.<Object|number|Array>} data
 * @param {Array.<string>} [nameList]
 * @param {Function} [dimValueGetter] (dataItem, dimName, dataIndex, dimIndex) => number
 */


listProto.initData = function (data, nameList, dimValueGetter) {
  data = data || [];
  var isDataArray = zrUtil.isArray(data);

  if (isDataArray) {
    data = new DefaultDataProvider(data);
  }

  this._rawData = data; // Clear

  var storage = this._storage = {};
  var indices = this.indices = [];
  var dimensions = this.dimensions;
  var dimensionInfoMap = this._dimensionInfos;
  var size = data.count();
  var idList = [];
  var nameRepeatCount = {};
  var nameDimIdx;
  nameList = nameList || []; // Init storage

  for (var i = 0; i < dimensions.length; i++) {
    var dimInfo = dimensionInfoMap[dimensions[i]];
    dimInfo.otherDims.itemName === 0 && (nameDimIdx = i);
    var DataCtor = dataCtors[dimInfo.type];
    storage[dimensions[i]] = new DataCtor(size);
  }

  var self = this;

  if (!dimValueGetter) {
    self.hasItemOption = false;
  } // Default dim value getter


  dimValueGetter = dimValueGetter || function (dataItem, dimName, dataIndex, dimIndex) {
    var value = modelUtil.getDataItemValue(dataItem); // If any dataItem is like { value: 10 }

    if (modelUtil.isDataItemOption(dataItem)) {
      self.hasItemOption = true;
    }

    return modelUtil.converDataValue(value instanceof Array ? value[dimIndex] // If value is a single number or something else not array.
    : value, dimensionInfoMap[dimName]);
  };

  for (var i = 0; i < size; i++) {
    // NOTICE: Try not to write things into dataItem
    var dataItem = data.getItem(i); // Each data item is value
    // [1, 2]
    // 2
    // Bar chart, line chart which uses category axis
    // only gives the 'y' value. 'x' value is the indices of cateogry
    // Use a tempValue to normalize the value to be a (x, y) value
    // Store the data by dimensions

    for (var k = 0; k < dimensions.length; k++) {
      var dim = dimensions[k];
      var dimStorage = storage[dim]; // PENDING NULL is empty or zero

      dimStorage[i] = dimValueGetter(dataItem, dim, i, k);
    }

    indices.push(i);
  } // Use the name in option and create id


  for (var i = 0; i < size; i++) {
    var dataItem = data.getItem(i);

    if (!nameList[i] && dataItem) {
      if (dataItem.name != null) {
        nameList[i] = dataItem.name;
      } else if (nameDimIdx != null) {
        nameList[i] = storage[dimensions[nameDimIdx]][i];
      }
    }

    var name = nameList[i] || ''; // Try using the id in option

    var id = dataItem && dataItem.id;

    if (!id && name) {
      // Use name as id and add counter to avoid same name
      nameRepeatCount[name] = nameRepeatCount[name] || 0;
      id = name;

      if (nameRepeatCount[name] > 0) {
        id += '__ec__' + nameRepeatCount[name];
      }

      nameRepeatCount[name]++;
    }

    id && (idList[i] = id);
  }

  this._nameList = nameList;
  this._idList = idList;
};
/**
 * @return {number}
 */


listProto.count = function () {
  return this.indices.length;
};
/**
 * Get value. Return NaN if idx is out of range.
 * @param {string} dim Dim must be concrete name.
 * @param {number} idx
 * @param {boolean} stack
 * @return {number}
 */


listProto.get = function (dim, idx, stack) {
  var storage = this._storage;
  var dataIndex = this.indices[idx]; // If value not exists

  if (dataIndex == null || !storage[dim]) {
    return NaN;
  }

  var value = storage[dim][dataIndex]; // FIXME ordinal data type is not stackable

  if (stack) {
    var dimensionInfo = this._dimensionInfos[dim];

    if (dimensionInfo && dimensionInfo.stackable) {
      var stackedOn = this.stackedOn;

      while (stackedOn) {
        // Get no stacked data of stacked on
        var stackedValue = stackedOn.get(dim, idx); // Considering positive stack, negative stack and empty data

        if (value >= 0 && stackedValue > 0 || // Positive stack
        value <= 0 && stackedValue < 0 // Negative stack
        ) {
            value += stackedValue;
          }

        stackedOn = stackedOn.stackedOn;
      }
    }
  }

  return value;
};
/**
 * Get value for multi dimensions.
 * @param {Array.<string>} [dimensions] If ignored, using all dimensions.
 * @param {number} idx
 * @param {boolean} stack
 * @return {number}
 */


listProto.getValues = function (dimensions, idx, stack) {
  var values = [];

  if (!zrUtil.isArray(dimensions)) {
    stack = idx;
    idx = dimensions;
    dimensions = this.dimensions;
  }

  for (var i = 0, len = dimensions.length; i < len; i++) {
    values.push(this.get(dimensions[i], idx, stack));
  }

  return values;
};
/**
 * If value is NaN. Inlcuding '-'
 * @param {string} dim
 * @param {number} idx
 * @return {number}
 */


listProto.hasValue = function (idx) {
  var dimensions = this.dimensions;
  var dimensionInfos = this._dimensionInfos;

  for (var i = 0, len = dimensions.length; i < len; i++) {
    if ( // Ordinal type can be string or number
    dimensionInfos[dimensions[i]].type !== 'ordinal' && isNaN(this.get(dimensions[i], idx))) {
      return false;
    }
  }

  return true;
};
/**
 * Get extent of data in one dimension
 * @param {string} dim
 * @param {boolean} stack
 * @param {Function} filter
 */


listProto.getDataExtent = function (dim, stack, filter) {
  dim = this.getDimension(dim);
  var dimData = this._storage[dim];
  var dimInfo = this.getDimensionInfo(dim);
  stack = dimInfo && dimInfo.stackable && stack;
  var dimExtent = (this._extent || (this._extent = {}))[dim + !!stack];
  var value;

  if (dimExtent) {
    return dimExtent;
  } // var dimInfo = this._dimensionInfos[dim];


  if (dimData) {
    var min = Infinity;
    var max = -Infinity; // var isOrdinal = dimInfo.type === 'ordinal';

    for (var i = 0, len = this.count(); i < len; i++) {
      value = this.get(dim, i, stack); // FIXME
      // if (isOrdinal && typeof value === 'string') {
      //     value = zrUtil.indexOf(dimData, value);
      // }

      if (!filter || filter(value, dim, i)) {
        value < min && (min = value);
        value > max && (max = value);
      }
    }

    return this._extent[dim + !!stack] = [min, max];
  } else {
    return [Infinity, -Infinity];
  }
};
/**
 * Get sum of data in one dimension
 * @param {string} dim
 * @param {boolean} stack
 */


listProto.getSum = function (dim, stack) {
  var dimData = this._storage[dim];
  var sum = 0;

  if (dimData) {
    for (var i = 0, len = this.count(); i < len; i++) {
      var value = this.get(dim, i, stack);

      if (!isNaN(value)) {
        sum += value;
      }
    }
  }

  return sum;
};
/**
 * Retreive the index with given value
 * @param {number} idx
 * @param {number} value
 * @return {number}
 */
// FIXME Precision of float value


listProto.indexOf = function (dim, value) {
  var storage = this._storage;
  var dimData = storage[dim];
  var indices = this.indices;

  if (dimData) {
    for (var i = 0, len = indices.length; i < len; i++) {
      var rawIndex = indices[i];

      if (dimData[rawIndex] === value) {
        return i;
      }
    }
  }

  return -1;
};
/**
 * Retreive the index with given name
 * @param {number} idx
 * @param {number} name
 * @return {number}
 */


listProto.indexOfName = function (name) {
  var indices = this.indices;
  var nameList = this._nameList;

  for (var i = 0, len = indices.length; i < len; i++) {
    var rawIndex = indices[i];

    if (nameList[rawIndex] === name) {
      return i;
    }
  }

  return -1;
};
/**
 * Retreive the index with given raw data index
 * @param {number} idx
 * @param {number} name
 * @return {number}
 */


listProto.indexOfRawIndex = function (rawIndex) {
  // Indices are ascending
  var indices = this.indices; // If rawIndex === dataIndex

  var rawDataIndex = indices[rawIndex];

  if (rawDataIndex != null && rawDataIndex === rawIndex) {
    return rawIndex;
  }

  var left = 0;
  var right = indices.length - 1;

  while (left <= right) {
    var mid = (left + right) / 2 | 0;

    if (indices[mid] < rawIndex) {
      left = mid + 1;
    } else if (indices[mid] > rawIndex) {
      right = mid - 1;
    } else {
      return mid;
    }
  }

  return -1;
};
/**
 * Retreive the index of nearest value
 * @param {string} dim
 * @param {number} value
 * @param {boolean} stack If given value is after stacked
 * @param {number} [maxDistance=Infinity]
 * @return {Array.<number>} Considere multiple points has the same value.
 */


listProto.indicesOfNearest = function (dim, value, stack, maxDistance) {
  var storage = this._storage;
  var dimData = storage[dim];
  var nearestIndices = [];

  if (!dimData) {
    return nearestIndices;
  }

  if (maxDistance == null) {
    maxDistance = Infinity;
  }

  var minDist = Number.MAX_VALUE;
  var minDiff = -1;

  for (var i = 0, len = this.count(); i < len; i++) {
    var diff = value - this.get(dim, i, stack);
    var dist = Math.abs(diff);

    if (diff <= maxDistance && dist <= minDist) {
      // For the case of two data are same on xAxis, which has sequence data.
      // Show the nearest index
      // https://github.com/ecomfe/echarts/issues/2869
      if (dist < minDist || diff >= 0 && minDiff < 0) {
        minDist = dist;
        minDiff = diff;
        nearestIndices.length = 0;
      }

      nearestIndices.push(i);
    }
  }

  return nearestIndices;
};
/**
 * Get raw data index
 * @param {number} idx
 * @return {number}
 */


listProto.getRawIndex = function (idx) {
  var rawIdx = this.indices[idx];
  return rawIdx == null ? -1 : rawIdx;
};
/**
 * Get raw data item
 * @param {number} idx
 * @return {number}
 */


listProto.getRawDataItem = function (idx) {
  return this._rawData.getItem(this.getRawIndex(idx));
};
/**
 * @param {number} idx
 * @param {boolean} [notDefaultIdx=false]
 * @return {string}
 */


listProto.getName = function (idx) {
  return this._nameList[this.indices[idx]] || '';
};
/**
 * @param {number} idx
 * @param {boolean} [notDefaultIdx=false]
 * @return {string}
 */


listProto.getId = function (idx) {
  return this._idList[this.indices[idx]] || this.getRawIndex(idx) + '';
};

function normalizeDimensions(dimensions) {
  if (!zrUtil.isArray(dimensions)) {
    dimensions = [dimensions];
  }

  return dimensions;
}
/**
 * Data iteration
 * @param {string|Array.<string>}
 * @param {Function} cb
 * @param {boolean} [stack=false]
 * @param {*} [context=this]
 *
 * @example
 *  list.each('x', function (x, idx) {});
 *  list.each(['x', 'y'], function (x, y, idx) {});
 *  list.each(function (idx) {})
 */


listProto.each = function (dims, cb, stack, context) {
  if (typeof dims === 'function') {
    context = stack;
    stack = cb;
    cb = dims;
    dims = [];
  }

  dims = zrUtil.map(normalizeDimensions(dims), this.getDimension, this);
  var value = [];
  var dimSize = dims.length;
  var indices = this.indices;
  context = context || this;

  for (var i = 0; i < indices.length; i++) {
    // Simple optimization
    switch (dimSize) {
      case 0:
        cb.call(context, i);
        break;

      case 1:
        cb.call(context, this.get(dims[0], i, stack), i);
        break;

      case 2:
        cb.call(context, this.get(dims[0], i, stack), this.get(dims[1], i, stack), i);
        break;

      default:
        for (var k = 0; k < dimSize; k++) {
          value[k] = this.get(dims[k], i, stack);
        } // Index


        value[k] = i;
        cb.apply(context, value);
    }
  }
};
/**
 * Data filter
 * @param {string|Array.<string>}
 * @param {Function} cb
 * @param {boolean} [stack=false]
 * @param {*} [context=this]
 */


listProto.filterSelf = function (dimensions, cb, stack, context) {
  if (typeof dimensions === 'function') {
    context = stack;
    stack = cb;
    cb = dimensions;
    dimensions = [];
  }

  dimensions = zrUtil.map(normalizeDimensions(dimensions), this.getDimension, this);
  var newIndices = [];
  var value = [];
  var dimSize = dimensions.length;
  var indices = this.indices;
  context = context || this;

  for (var i = 0; i < indices.length; i++) {
    var keep; // Simple optimization

    if (!dimSize) {
      keep = cb.call(context, i);
    } else if (dimSize === 1) {
      keep = cb.call(context, this.get(dimensions[0], i, stack), i);
    } else {
      for (var k = 0; k < dimSize; k++) {
        value[k] = this.get(dimensions[k], i, stack);
      }

      value[k] = i;
      keep = cb.apply(context, value);
    }

    if (keep) {
      newIndices.push(indices[i]);
    }
  }

  this.indices = newIndices; // Reset data extent

  this._extent = {};
  return this;
};
/**
 * Data mapping to a plain array
 * @param {string|Array.<string>} [dimensions]
 * @param {Function} cb
 * @param {boolean} [stack=false]
 * @param {*} [context=this]
 * @return {Array}
 */


listProto.mapArray = function (dimensions, cb, stack, context) {
  if (typeof dimensions === 'function') {
    context = stack;
    stack = cb;
    cb = dimensions;
    dimensions = [];
  }

  var result = [];
  this.each(dimensions, function () {
    result.push(cb && cb.apply(this, arguments));
  }, stack, context);
  return result;
};

function cloneListForMapAndSample(original, excludeDimensions) {
  var allDimensions = original.dimensions;
  var list = new List(zrUtil.map(allDimensions, original.getDimensionInfo, original), original.hostModel); // FIXME If needs stackedOn, value may already been stacked

  transferProperties(list, original);
  var storage = list._storage = {};
  var originalStorage = original._storage; // Init storage

  for (var i = 0; i < allDimensions.length; i++) {
    var dim = allDimensions[i];
    var dimStore = originalStorage[dim];

    if (zrUtil.indexOf(excludeDimensions, dim) >= 0) {
      storage[dim] = new dimStore.constructor(originalStorage[dim].length);
    } else {
      // Direct reference for other dimensions
      storage[dim] = originalStorage[dim];
    }
  }

  return list;
}
/**
 * Data mapping to a new List with given dimensions
 * @param {string|Array.<string>} dimensions
 * @param {Function} cb
 * @param {boolean} [stack=false]
 * @param {*} [context=this]
 * @return {Array}
 */


listProto.map = function (dimensions, cb, stack, context) {
  dimensions = zrUtil.map(normalizeDimensions(dimensions), this.getDimension, this);
  var list = cloneListForMapAndSample(this, dimensions); // Following properties are all immutable.
  // So we can reference to the same value

  var indices = list.indices = this.indices;
  var storage = list._storage;
  var tmpRetValue = [];
  this.each(dimensions, function () {
    var idx = arguments[arguments.length - 1];
    var retValue = cb && cb.apply(this, arguments);

    if (retValue != null) {
      // a number
      if (typeof retValue === 'number') {
        tmpRetValue[0] = retValue;
        retValue = tmpRetValue;
      }

      for (var i = 0; i < retValue.length; i++) {
        var dim = dimensions[i];
        var dimStore = storage[dim];
        var rawIdx = indices[idx];

        if (dimStore) {
          dimStore[rawIdx] = retValue[i];
        }
      }
    }
  }, stack, context);
  return list;
};
/**
 * Large data down sampling on given dimension
 * @param {string} dimension
 * @param {number} rate
 * @param {Function} sampleValue
 * @param {Function} sampleIndex Sample index for name and id
 */


listProto.downSample = function (dimension, rate, sampleValue, sampleIndex) {
  var list = cloneListForMapAndSample(this, [dimension]);
  var storage = this._storage;
  var targetStorage = list._storage;
  var originalIndices = this.indices;
  var indices = list.indices = [];
  var frameValues = [];
  var frameIndices = [];
  var frameSize = Math.floor(1 / rate);
  var dimStore = targetStorage[dimension];
  var len = this.count(); // Copy data from original data

  for (var i = 0; i < storage[dimension].length; i++) {
    targetStorage[dimension][i] = storage[dimension][i];
  }

  for (var i = 0; i < len; i += frameSize) {
    // Last frame
    if (frameSize > len - i) {
      frameSize = len - i;
      frameValues.length = frameSize;
    }

    for (var k = 0; k < frameSize; k++) {
      var idx = originalIndices[i + k];
      frameValues[k] = dimStore[idx];
      frameIndices[k] = idx;
    }

    var value = sampleValue(frameValues);
    var idx = frameIndices[sampleIndex(frameValues, value) || 0]; // Only write value on the filtered data

    dimStore[idx] = value;
    indices.push(idx);
  }

  return list;
};
/**
 * Get model of one data item.
 *
 * @param {number} idx
 */
// FIXME Model proxy ?


listProto.getItemModel = function (idx) {
  var hostModel = this.hostModel;
  idx = this.indices[idx];
  return new Model(this._rawData.getItem(idx), hostModel, hostModel && hostModel.ecModel);
};
/**
 * Create a data differ
 * @param {module:echarts/data/List} otherList
 * @return {module:echarts/data/DataDiffer}
 */


listProto.diff = function (otherList) {
  var idList = this._idList;
  var otherIdList = otherList && otherList._idList;
  var val; // Use prefix to avoid index to be the same as otherIdList[idx],
  // which will cause weird udpate animation.

  var prefix = 'e\0\0';
  return new DataDiffer(otherList ? otherList.indices : [], this.indices, function (idx) {
    return (val = otherIdList[idx]) != null ? val : prefix + idx;
  }, function (idx) {
    return (val = idList[idx]) != null ? val : prefix + idx;
  });
};
/**
 * Get visual property.
 * @param {string} key
 */


listProto.getVisual = function (key) {
  var visual = this._visual;
  return visual && visual[key];
};
/**
 * Set visual property
 * @param {string|Object} key
 * @param {*} [value]
 *
 * @example
 *  setVisual('color', color);
 *  setVisual({
 *      'color': color
 *  });
 */


listProto.setVisual = function (key, val) {
  if (isObject(key)) {
    for (var name in key) {
      if (key.hasOwnProperty(name)) {
        this.setVisual(name, key[name]);
      }
    }

    return;
  }

  this._visual = this._visual || {};
  this._visual[key] = val;
};
/**
 * Set layout property.
 * @param {string|Object} key
 * @param {*} [val]
 */


listProto.setLayout = function (key, val) {
  if (isObject(key)) {
    for (var name in key) {
      if (key.hasOwnProperty(name)) {
        this.setLayout(name, key[name]);
      }
    }

    return;
  }

  this._layout[key] = val;
};
/**
 * Get layout property.
 * @param  {string} key.
 * @return {*}
 */


listProto.getLayout = function (key) {
  return this._layout[key];
};
/**
 * Get layout of single data item
 * @param {number} idx
 */


listProto.getItemLayout = function (idx) {
  return this._itemLayouts[idx];
};
/**
 * Set layout of single data item
 * @param {number} idx
 * @param {Object} layout
 * @param {boolean=} [merge=false]
 */


listProto.setItemLayout = function (idx, layout, merge) {
  this._itemLayouts[idx] = merge ? zrUtil.extend(this._itemLayouts[idx] || {}, layout) : layout;
};
/**
 * Clear all layout of single data item
 */


listProto.clearItemLayouts = function () {
  this._itemLayouts.length = 0;
};
/**
 * Get visual property of single data item
 * @param {number} idx
 * @param {string} key
 * @param {boolean} [ignoreParent=false]
 */


listProto.getItemVisual = function (idx, key, ignoreParent) {
  var itemVisual = this._itemVisuals[idx];
  var val = itemVisual && itemVisual[key];

  if (val == null && !ignoreParent) {
    // Use global visual property
    return this.getVisual(key);
  }

  return val;
};
/**
 * Set visual property of single data item
 *
 * @param {number} idx
 * @param {string|Object} key
 * @param {*} [value]
 *
 * @example
 *  setItemVisual(0, 'color', color);
 *  setItemVisual(0, {
 *      'color': color
 *  });
 */


listProto.setItemVisual = function (idx, key, value) {
  var itemVisual = this._itemVisuals[idx] || {};
  this._itemVisuals[idx] = itemVisual;

  if (isObject(key)) {
    for (var name in key) {
      if (key.hasOwnProperty(name)) {
        itemVisual[name] = key[name];
      }
    }

    return;
  }

  itemVisual[key] = value;
};
/**
 * Clear itemVisuals and list visual.
 */


listProto.clearAllVisual = function () {
  this._visual = {};
  this._itemVisuals = [];
};

var setItemDataAndSeriesIndex = function (child) {
  child.seriesIndex = this.seriesIndex;
  child.dataIndex = this.dataIndex;
  child.dataType = this.dataType;
};
/**
 * Set graphic element relative to data. It can be set as null
 * @param {number} idx
 * @param {module:zrender/Element} [el]
 */


listProto.setItemGraphicEl = function (idx, el) {
  var hostModel = this.hostModel;

  if (el) {
    // Add data index and series index for indexing the data by element
    // Useful in tooltip
    el.dataIndex = idx;
    el.dataType = this.dataType;
    el.seriesIndex = hostModel && hostModel.seriesIndex;

    if (el.type === 'group') {
      el.traverse(setItemDataAndSeriesIndex, el);
    }
  }

  this._graphicEls[idx] = el;
};
/**
 * @param {number} idx
 * @return {module:zrender/Element}
 */


listProto.getItemGraphicEl = function (idx) {
  return this._graphicEls[idx];
};
/**
 * @param {Function} cb
 * @param {*} context
 */


listProto.eachItemGraphicEl = function (cb, context) {
  zrUtil.each(this._graphicEls, function (el, idx) {
    if (el) {
      cb && cb.call(context, el, idx);
    }
  });
};
/**
 * Shallow clone a new list except visual and layout properties, and graph elements.
 * New list only change the indices.
 */


listProto.cloneShallow = function () {
  var dimensionInfoList = zrUtil.map(this.dimensions, this.getDimensionInfo, this);
  var list = new List(dimensionInfoList, this.hostModel); // FIXME

  list._storage = this._storage;
  transferProperties(list, this); // Clone will not change the data extent and indices

  list.indices = this.indices.slice();

  if (this._extent) {
    list._extent = zrUtil.extend({}, this._extent);
  }

  return list;
};
/**
 * Wrap some method to add more feature
 * @param {string} methodName
 * @param {Function} injectFunction
 */


listProto.wrapMethod = function (methodName, injectFunction) {
  var originalMethod = this[methodName];

  if (typeof originalMethod !== 'function') {
    return;
  }

  this.__wrappedMethods = this.__wrappedMethods || [];

  this.__wrappedMethods.push(methodName);

  this[methodName] = function () {
    var res = originalMethod.apply(this, arguments);
    return injectFunction.apply(this, [res].concat(zrUtil.slice(arguments)));
  };
}; // Methods that create a new list based on this list should be listed here.
// Notice that those method should `RETURN` the new list.


listProto.TRANSFERABLE_METHODS = ['cloneShallow', 'downSample', 'map']; // Methods that change indices of this list should be listed here.

listProto.CHANGABLE_METHODS = ['filterSelf'];
var _default = List;
module.exports = _default;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(31)))

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

var numberUtil = __webpack_require__(202);

var formatUtil = __webpack_require__(217);

var Scale = __webpack_require__(232);

var helper = __webpack_require__(254);

/**
 * Interval scale
 * @module echarts/scale/Interval
 */
var roundNumber = numberUtil.round;
/**
 * @alias module:echarts/coord/scale/Interval
 * @constructor
 */

var IntervalScale = Scale.extend({
  type: 'interval',
  _interval: 0,
  _intervalPrecision: 2,
  setExtent: function (start, end) {
    var thisExtent = this._extent; //start,end may be a Number like '25',so...

    if (!isNaN(start)) {
      thisExtent[0] = parseFloat(start);
    }

    if (!isNaN(end)) {
      thisExtent[1] = parseFloat(end);
    }
  },
  unionExtent: function (other) {
    var extent = this._extent;
    other[0] < extent[0] && (extent[0] = other[0]);
    other[1] > extent[1] && (extent[1] = other[1]); // unionExtent may called by it's sub classes

    IntervalScale.prototype.setExtent.call(this, extent[0], extent[1]);
  },

  /**
   * Get interval
   */
  getInterval: function () {
    return this._interval;
  },

  /**
   * Set interval
   */
  setInterval: function (interval) {
    this._interval = interval; // Dropped auto calculated niceExtent and use user setted extent
    // We assume user wan't to set both interval, min, max to get a better result

    this._niceExtent = this._extent.slice();
    this._intervalPrecision = helper.getIntervalPrecision(interval);
  },

  /**
   * @return {Array.<number>}
   */
  getTicks: function () {
    return helper.intervalScaleGetTicks(this._interval, this._extent, this._niceExtent, this._intervalPrecision);
  },

  /**
   * @return {Array.<string>}
   */
  getTicksLabels: function () {
    var labels = [];
    var ticks = this.getTicks();

    for (var i = 0; i < ticks.length; i++) {
      labels.push(this.getLabel(ticks[i]));
    }

    return labels;
  },

  /**
   * @param {number} data
   * @param {Object} [opt]
   * @param {number|string} [opt.precision] If 'auto', use nice presision.
   * @param {boolean} [opt.pad] returns 1.50 but not 1.5 if precision is 2.
   * @return {string}
   */
  getLabel: function (data, opt) {
    if (data == null) {
      return '';
    }

    var precision = opt && opt.precision;

    if (precision == null) {
      precision = numberUtil.getPrecisionSafe(data) || 0;
    } else if (precision === 'auto') {
      // Should be more precise then tick.
      precision = this._intervalPrecision;
    } // (1) If `precision` is set, 12.005 should be display as '12.00500'.
    // (2) Use roundNumber (toFixed) to avoid scientific notation like '3.5e-7'.


    data = roundNumber(data, precision, true);
    return formatUtil.addCommas(data);
  },

  /**
   * Update interval and extent of intervals for nice ticks
   *
   * @param {number} [splitNumber = 5] Desired number of ticks
   * @param {number} [minInterval]
   * @param {number} [maxInterval]
   */
  niceTicks: function (splitNumber, minInterval, maxInterval) {
    splitNumber = splitNumber || 5;
    var extent = this._extent;
    var span = extent[1] - extent[0];

    if (!isFinite(span)) {
      return;
    } // User may set axis min 0 and data are all negative
    // FIXME If it needs to reverse ?


    if (span < 0) {
      span = -span;
      extent.reverse();
    }

    var result = helper.intervalScaleNiceTicks(extent, splitNumber, minInterval, maxInterval);
    this._intervalPrecision = result.intervalPrecision;
    this._interval = result.interval;
    this._niceExtent = result.niceTickExtent;
  },

  /**
   * Nice extent.
   * @param {Object} opt
   * @param {number} [opt.splitNumber = 5] Given approx tick number
   * @param {boolean} [opt.fixMin=false]
   * @param {boolean} [opt.fixMax=false]
   * @param {boolean} [opt.minInterval]
   * @param {boolean} [opt.maxInterval]
   */
  niceExtent: function (opt) {
    var extent = this._extent; // If extent start and end are same, expand them

    if (extent[0] === extent[1]) {
      if (extent[0] !== 0) {
        // Expand extent
        var expandSize = extent[0]; // In the fowllowing case
        //      Axis has been fixed max 100
        //      Plus data are all 100 and axis extent are [100, 100].
        // Extend to the both side will cause expanded max is larger than fixed max.
        // So only expand to the smaller side.

        if (!opt.fixMax) {
          extent[1] += expandSize / 2;
          extent[0] -= expandSize / 2;
        } else {
          extent[0] -= expandSize / 2;
        }
      } else {
        extent[1] = 1;
      }
    }

    var span = extent[1] - extent[0]; // If there are no data and extent are [Infinity, -Infinity]

    if (!isFinite(span)) {
      extent[0] = 0;
      extent[1] = 1;
    }

    this.niceTicks(opt.splitNumber, opt.minInterval, opt.maxInterval); // var extent = this._extent;

    var interval = this._interval;

    if (!opt.fixMin) {
      extent[0] = roundNumber(Math.floor(extent[0] / interval) * interval);
    }

    if (!opt.fixMax) {
      extent[1] = roundNumber(Math.ceil(extent[1] / interval) * interval);
    }
  }
});
/**
 * @return {module:echarts/scale/Time}
 */

IntervalScale.create = function () {
  return new IntervalScale();
};

var _default = IntervalScale;
module.exports = _default;

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var _clazz = __webpack_require__(222);

var parseClassType = _clazz.parseClassType;
var base = 0;
var DELIMITER = '_';
/**
 * @public
 * @param {string} type
 * @return {string}
 */

function getUID(type) {
  // Considering the case of crossing js context,
  // use Math.random to make id as unique as possible.
  return [type || '', base++, Math.random()].join(DELIMITER);
}
/**
 * @inner
 */


function enableSubTypeDefaulter(entity) {
  var subTypeDefaulters = {};

  entity.registerSubTypeDefaulter = function (componentType, defaulter) {
    componentType = parseClassType(componentType);
    subTypeDefaulters[componentType.main] = defaulter;
  };

  entity.determineSubType = function (componentType, option) {
    var type = option.type;

    if (!type) {
      var componentTypeMain = parseClassType(componentType).main;

      if (entity.hasSubTypes(componentType) && subTypeDefaulters[componentTypeMain]) {
        type = subTypeDefaulters[componentTypeMain](option);
      }
    }

    return type;
  };

  return entity;
}
/**
 * Topological travel on Activity Network (Activity On Vertices).
 * Dependencies is defined in Model.prototype.dependencies, like ['xAxis', 'yAxis'].
 *
 * If 'xAxis' or 'yAxis' is absent in componentTypeList, just ignore it in topology.
 *
 * If there is circle dependencey, Error will be thrown.
 *
 */


function enableTopologicalTravel(entity, dependencyGetter) {
  /**
   * @public
   * @param {Array.<string>} targetNameList Target Component type list.
   *                                           Can be ['aa', 'bb', 'aa.xx']
   * @param {Array.<string>} fullNameList By which we can build dependency graph.
   * @param {Function} callback Params: componentType, dependencies.
   * @param {Object} context Scope of callback.
   */
  entity.topologicalTravel = function (targetNameList, fullNameList, callback, context) {
    if (!targetNameList.length) {
      return;
    }

    var result = makeDepndencyGraph(fullNameList);
    var graph = result.graph;
    var stack = result.noEntryList;
    var targetNameSet = {};
    zrUtil.each(targetNameList, function (name) {
      targetNameSet[name] = true;
    });

    while (stack.length) {
      var currComponentType = stack.pop();
      var currVertex = graph[currComponentType];
      var isInTargetNameSet = !!targetNameSet[currComponentType];

      if (isInTargetNameSet) {
        callback.call(context, currComponentType, currVertex.originalDeps.slice());
        delete targetNameSet[currComponentType];
      }

      zrUtil.each(currVertex.successor, isInTargetNameSet ? removeEdgeAndAdd : removeEdge);
    }

    zrUtil.each(targetNameSet, function () {
      throw new Error('Circle dependency may exists');
    });

    function removeEdge(succComponentType) {
      graph[succComponentType].entryCount--;

      if (graph[succComponentType].entryCount === 0) {
        stack.push(succComponentType);
      }
    } // Consider this case: legend depends on series, and we call
    // chart.setOption({series: [...]}), where only series is in option.
    // If we do not have 'removeEdgeAndAdd', legendModel.mergeOption will
    // not be called, but only sereis.mergeOption is called. Thus legend
    // have no chance to update its local record about series (like which
    // name of series is available in legend).


    function removeEdgeAndAdd(succComponentType) {
      targetNameSet[succComponentType] = true;
      removeEdge(succComponentType);
    }
  };
  /**
   * DepndencyGraph: {Object}
   * key: conponentType,
   * value: {
   *     successor: [conponentTypes...],
   *     originalDeps: [conponentTypes...],
   *     entryCount: {number}
   * }
   */


  function makeDepndencyGraph(fullNameList) {
    var graph = {};
    var noEntryList = [];
    zrUtil.each(fullNameList, function (name) {
      var thisItem = createDependencyGraphItem(graph, name);
      var originalDeps = thisItem.originalDeps = dependencyGetter(name);
      var availableDeps = getAvailableDependencies(originalDeps, fullNameList);
      thisItem.entryCount = availableDeps.length;

      if (thisItem.entryCount === 0) {
        noEntryList.push(name);
      }

      zrUtil.each(availableDeps, function (dependentName) {
        if (zrUtil.indexOf(thisItem.predecessor, dependentName) < 0) {
          thisItem.predecessor.push(dependentName);
        }

        var thatItem = createDependencyGraphItem(graph, dependentName);

        if (zrUtil.indexOf(thatItem.successor, dependentName) < 0) {
          thatItem.successor.push(name);
        }
      });
    });
    return {
      graph: graph,
      noEntryList: noEntryList
    };
  }

  function createDependencyGraphItem(graph, name) {
    if (!graph[name]) {
      graph[name] = {
        predecessor: [],
        successor: []
      };
    }

    return graph[name];
  }

  function getAvailableDependencies(originalDeps, fullNameList) {
    var availableDeps = [];
    zrUtil.each(originalDeps, function (dep) {
      zrUtil.indexOf(fullNameList, dep) >= 0 && availableDeps.push(dep);
    });
    return availableDeps;
  }
}

exports.getUID = getUID;
exports.enableSubTypeDefaulter = enableSubTypeDefaulter;
exports.enableTopologicalTravel = enableTopologicalTravel;

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var graphic = __webpack_require__(200);

var BoundingRect = __webpack_require__(214);

// Symbol factory

/**
 * Triangle shape
 * @inner
 */
var Triangle = graphic.extendShape({
  type: 'triangle',
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  },
  buildPath: function (path, shape) {
    var cx = shape.cx;
    var cy = shape.cy;
    var width = shape.width / 2;
    var height = shape.height / 2;
    path.moveTo(cx, cy - height);
    path.lineTo(cx + width, cy + height);
    path.lineTo(cx - width, cy + height);
    path.closePath();
  }
});
/**
 * Diamond shape
 * @inner
 */

var Diamond = graphic.extendShape({
  type: 'diamond',
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  },
  buildPath: function (path, shape) {
    var cx = shape.cx;
    var cy = shape.cy;
    var width = shape.width / 2;
    var height = shape.height / 2;
    path.moveTo(cx, cy - height);
    path.lineTo(cx + width, cy);
    path.lineTo(cx, cy + height);
    path.lineTo(cx - width, cy);
    path.closePath();
  }
});
/**
 * Pin shape
 * @inner
 */

var Pin = graphic.extendShape({
  type: 'pin',
  shape: {
    // x, y on the cusp
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function (path, shape) {
    var x = shape.x;
    var y = shape.y;
    var w = shape.width / 5 * 3; // Height must be larger than width

    var h = Math.max(w, shape.height);
    var r = w / 2; // Dist on y with tangent point and circle center

    var dy = r * r / (h - r);
    var cy = y - h + r + dy;
    var angle = Math.asin(dy / r); // Dist on x with tangent point and circle center

    var dx = Math.cos(angle) * r;
    var tanX = Math.sin(angle);
    var tanY = Math.cos(angle);
    var cpLen = r * 0.6;
    var cpLen2 = r * 0.7;
    path.moveTo(x - dx, cy + dy);
    path.arc(x, cy, r, Math.PI - angle, Math.PI * 2 + angle);
    path.bezierCurveTo(x + dx - tanX * cpLen, cy + dy + tanY * cpLen, x, y - cpLen2, x, y);
    path.bezierCurveTo(x, y - cpLen2, x - dx + tanX * cpLen, cy + dy + tanY * cpLen, x - dx, cy + dy);
    path.closePath();
  }
});
/**
 * Arrow shape
 * @inner
 */

var Arrow = graphic.extendShape({
  type: 'arrow',
  shape: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function (ctx, shape) {
    var height = shape.height;
    var width = shape.width;
    var x = shape.x;
    var y = shape.y;
    var dx = width / 3 * 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + height);
    ctx.lineTo(x, y + height / 4 * 3);
    ctx.lineTo(x - dx, y + height);
    ctx.lineTo(x, y);
    ctx.closePath();
  }
});
/**
 * Map of path contructors
 * @type {Object.<string, module:zrender/graphic/Path>}
 */

var symbolCtors = {
  line: graphic.Line,
  rect: graphic.Rect,
  roundRect: graphic.Rect,
  square: graphic.Rect,
  circle: graphic.Circle,
  diamond: Diamond,
  pin: Pin,
  arrow: Arrow,
  triangle: Triangle
};
var symbolShapeMakers = {
  line: function (x, y, w, h, shape) {
    // FIXME
    shape.x1 = x;
    shape.y1 = y + h / 2;
    shape.x2 = x + w;
    shape.y2 = y + h / 2;
  },
  rect: function (x, y, w, h, shape) {
    shape.x = x;
    shape.y = y;
    shape.width = w;
    shape.height = h;
  },
  roundRect: function (x, y, w, h, shape) {
    shape.x = x;
    shape.y = y;
    shape.width = w;
    shape.height = h;
    shape.r = Math.min(w, h) / 4;
  },
  square: function (x, y, w, h, shape) {
    var size = Math.min(w, h);
    shape.x = x;
    shape.y = y;
    shape.width = size;
    shape.height = size;
  },
  circle: function (x, y, w, h, shape) {
    // Put circle in the center of square
    shape.cx = x + w / 2;
    shape.cy = y + h / 2;
    shape.r = Math.min(w, h) / 2;
  },
  diamond: function (x, y, w, h, shape) {
    shape.cx = x + w / 2;
    shape.cy = y + h / 2;
    shape.width = w;
    shape.height = h;
  },
  pin: function (x, y, w, h, shape) {
    shape.x = x + w / 2;
    shape.y = y + h / 2;
    shape.width = w;
    shape.height = h;
  },
  arrow: function (x, y, w, h, shape) {
    shape.x = x + w / 2;
    shape.y = y + h / 2;
    shape.width = w;
    shape.height = h;
  },
  triangle: function (x, y, w, h, shape) {
    shape.cx = x + w / 2;
    shape.cy = y + h / 2;
    shape.width = w;
    shape.height = h;
  }
};
var symbolBuildProxies = {};
zrUtil.each(symbolCtors, function (Ctor, name) {
  symbolBuildProxies[name] = new Ctor();
});
var SymbolClz = graphic.extendShape({
  type: 'symbol',
  shape: {
    symbolType: '',
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  beforeBrush: function () {
    var style = this.style;
    var shape = this.shape; // FIXME

    if (shape.symbolType === 'pin' && style.textPosition === 'inside') {
      style.textPosition = ['50%', '40%'];
      style.textAlign = 'center';
      style.textVerticalAlign = 'middle';
    }
  },
  buildPath: function (ctx, shape, inBundle) {
    var symbolType = shape.symbolType;
    var proxySymbol = symbolBuildProxies[symbolType];

    if (shape.symbolType !== 'none') {
      if (!proxySymbol) {
        // Default rect
        symbolType = 'rect';
        proxySymbol = symbolBuildProxies[symbolType];
      }

      symbolShapeMakers[symbolType](shape.x, shape.y, shape.width, shape.height, proxySymbol.shape);
      proxySymbol.buildPath(ctx, proxySymbol.shape, inBundle);
    }
  }
}); // Provide setColor helper method to avoid determine if set the fill or stroke outside

function symbolPathSetColor(color, innerColor) {
  if (this.type !== 'image') {
    var symbolStyle = this.style;
    var symbolShape = this.shape;

    if (symbolShape && symbolShape.symbolType === 'line') {
      symbolStyle.stroke = color;
    } else if (this.__isEmptyBrush) {
      symbolStyle.stroke = color;
      symbolStyle.fill = innerColor || '#fff';
    } else {
      // FIXME 判断图形默认是填充还是描边，使用 onlyStroke ?
      symbolStyle.fill && (symbolStyle.fill = color);
      symbolStyle.stroke && (symbolStyle.stroke = color);
    }

    this.dirty(false);
  }
}
/**
 * Create a symbol element with given symbol configuration: shape, x, y, width, height, color
 * @param {string} symbolType
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {string} color
 * @param {boolean} [keepAspect=false] whether to keep the ratio of w/h,
 *                            for path and image only.
 */


function createSymbol(symbolType, x, y, w, h, color, keepAspect) {
  // TODO Support image object, DynamicImage.
  var isEmpty = symbolType.indexOf('empty') === 0;

  if (isEmpty) {
    symbolType = symbolType.substr(5, 1).toLowerCase() + symbolType.substr(6);
  }

  var symbolPath;

  if (symbolType.indexOf('image://') === 0) {
    symbolPath = graphic.makeImage(symbolType.slice(8), new BoundingRect(x, y, w, h), keepAspect ? 'center' : 'cover');
  } else if (symbolType.indexOf('path://') === 0) {
    symbolPath = graphic.makePath(symbolType.slice(7), {}, new BoundingRect(x, y, w, h), keepAspect ? 'center' : 'cover');
  } else {
    symbolPath = new SymbolClz({
      shape: {
        symbolType: symbolType,
        x: x,
        y: y,
        width: w,
        height: h
      }
    });
  }

  symbolPath.__isEmptyBrush = isEmpty;
  symbolPath.setColor = symbolPathSetColor;
  symbolPath.setColor(color);
  return symbolPath;
}

exports.createSymbol = createSymbol;

/***/ }),
/* 242 */
/***/ (function(module, exports) {

// https://github.com/mziccard/node-timsort
var DEFAULT_MIN_MERGE = 32;
var DEFAULT_MIN_GALLOPING = 7;
var DEFAULT_TMP_STORAGE_LENGTH = 256;

function minRunLength(n) {
  var r = 0;

  while (n >= DEFAULT_MIN_MERGE) {
    r |= n & 1;
    n >>= 1;
  }

  return n + r;
}

function makeAscendingRun(array, lo, hi, compare) {
  var runHi = lo + 1;

  if (runHi === hi) {
    return 1;
  }

  if (compare(array[runHi++], array[lo]) < 0) {
    while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
      runHi++;
    }

    reverseRun(array, lo, runHi);
  } else {
    while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
      runHi++;
    }
  }

  return runHi - lo;
}

function reverseRun(array, lo, hi) {
  hi--;

  while (lo < hi) {
    var t = array[lo];
    array[lo++] = array[hi];
    array[hi--] = t;
  }
}

function binaryInsertionSort(array, lo, hi, start, compare) {
  if (start === lo) {
    start++;
  }

  for (; start < hi; start++) {
    var pivot = array[start];
    var left = lo;
    var right = start;
    var mid;

    while (left < right) {
      mid = left + right >>> 1;

      if (compare(pivot, array[mid]) < 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    var n = start - left;

    switch (n) {
      case 3:
        array[left + 3] = array[left + 2];

      case 2:
        array[left + 2] = array[left + 1];

      case 1:
        array[left + 1] = array[left];
        break;

      default:
        while (n > 0) {
          array[left + n] = array[left + n - 1];
          n--;
        }

    }

    array[left] = pivot;
  }
}

function gallopLeft(value, array, start, length, hint, compare) {
  var lastOffset = 0;
  var maxOffset = 0;
  var offset = 1;

  if (compare(value, array[start + hint]) > 0) {
    maxOffset = length - hint;

    while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    lastOffset += hint;
    offset += hint;
  } else {
    maxOffset = hint + 1;

    while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    var tmp = lastOffset;
    lastOffset = hint - offset;
    offset = hint - tmp;
  }

  lastOffset++;

  while (lastOffset < offset) {
    var m = lastOffset + (offset - lastOffset >>> 1);

    if (compare(value, array[start + m]) > 0) {
      lastOffset = m + 1;
    } else {
      offset = m;
    }
  }

  return offset;
}

function gallopRight(value, array, start, length, hint, compare) {
  var lastOffset = 0;
  var maxOffset = 0;
  var offset = 1;

  if (compare(value, array[start + hint]) < 0) {
    maxOffset = hint + 1;

    while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    var tmp = lastOffset;
    lastOffset = hint - offset;
    offset = hint - tmp;
  } else {
    maxOffset = length - hint;

    while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    lastOffset += hint;
    offset += hint;
  }

  lastOffset++;

  while (lastOffset < offset) {
    var m = lastOffset + (offset - lastOffset >>> 1);

    if (compare(value, array[start + m]) < 0) {
      offset = m;
    } else {
      lastOffset = m + 1;
    }
  }

  return offset;
}

function TimSort(array, compare) {
  var minGallop = DEFAULT_MIN_GALLOPING;
  var length = 0;
  var tmpStorageLength = DEFAULT_TMP_STORAGE_LENGTH;
  var stackLength = 0;
  var runStart;
  var runLength;
  var stackSize = 0;
  length = array.length;

  if (length < 2 * DEFAULT_TMP_STORAGE_LENGTH) {
    tmpStorageLength = length >>> 1;
  }

  var tmp = [];
  stackLength = length < 120 ? 5 : length < 1542 ? 10 : length < 119151 ? 19 : 40;
  runStart = [];
  runLength = [];

  function pushRun(_runStart, _runLength) {
    runStart[stackSize] = _runStart;
    runLength[stackSize] = _runLength;
    stackSize += 1;
  }

  function mergeRuns() {
    while (stackSize > 1) {
      var n = stackSize - 2;

      if (n >= 1 && runLength[n - 1] <= runLength[n] + runLength[n + 1] || n >= 2 && runLength[n - 2] <= runLength[n] + runLength[n - 1]) {
        if (runLength[n - 1] < runLength[n + 1]) {
          n--;
        }
      } else if (runLength[n] > runLength[n + 1]) {
        break;
      }

      mergeAt(n);
    }
  }

  function forceMergeRuns() {
    while (stackSize > 1) {
      var n = stackSize - 2;

      if (n > 0 && runLength[n - 1] < runLength[n + 1]) {
        n--;
      }

      mergeAt(n);
    }
  }

  function mergeAt(i) {
    var start1 = runStart[i];
    var length1 = runLength[i];
    var start2 = runStart[i + 1];
    var length2 = runLength[i + 1];
    runLength[i] = length1 + length2;

    if (i === stackSize - 3) {
      runStart[i + 1] = runStart[i + 2];
      runLength[i + 1] = runLength[i + 2];
    }

    stackSize--;
    var k = gallopRight(array[start2], array, start1, length1, 0, compare);
    start1 += k;
    length1 -= k;

    if (length1 === 0) {
      return;
    }

    length2 = gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);

    if (length2 === 0) {
      return;
    }

    if (length1 <= length2) {
      mergeLow(start1, length1, start2, length2);
    } else {
      mergeHigh(start1, length1, start2, length2);
    }
  }

  function mergeLow(start1, length1, start2, length2) {
    var i = 0;

    for (i = 0; i < length1; i++) {
      tmp[i] = array[start1 + i];
    }

    var cursor1 = 0;
    var cursor2 = start2;
    var dest = start1;
    array[dest++] = array[cursor2++];

    if (--length2 === 0) {
      for (i = 0; i < length1; i++) {
        array[dest + i] = tmp[cursor1 + i];
      }

      return;
    }

    if (length1 === 1) {
      for (i = 0; i < length2; i++) {
        array[dest + i] = array[cursor2 + i];
      }

      array[dest + length2] = tmp[cursor1];
      return;
    }

    var _minGallop = minGallop;
    var count1, count2, exit;

    while (1) {
      count1 = 0;
      count2 = 0;
      exit = false;

      do {
        if (compare(array[cursor2], tmp[cursor1]) < 0) {
          array[dest++] = array[cursor2++];
          count2++;
          count1 = 0;

          if (--length2 === 0) {
            exit = true;
            break;
          }
        } else {
          array[dest++] = tmp[cursor1++];
          count1++;
          count2 = 0;

          if (--length1 === 1) {
            exit = true;
            break;
          }
        }
      } while ((count1 | count2) < _minGallop);

      if (exit) {
        break;
      }

      do {
        count1 = gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);

        if (count1 !== 0) {
          for (i = 0; i < count1; i++) {
            array[dest + i] = tmp[cursor1 + i];
          }

          dest += count1;
          cursor1 += count1;
          length1 -= count1;

          if (length1 <= 1) {
            exit = true;
            break;
          }
        }

        array[dest++] = array[cursor2++];

        if (--length2 === 0) {
          exit = true;
          break;
        }

        count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);

        if (count2 !== 0) {
          for (i = 0; i < count2; i++) {
            array[dest + i] = array[cursor2 + i];
          }

          dest += count2;
          cursor2 += count2;
          length2 -= count2;

          if (length2 === 0) {
            exit = true;
            break;
          }
        }

        array[dest++] = tmp[cursor1++];

        if (--length1 === 1) {
          exit = true;
          break;
        }

        _minGallop--;
      } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);

      if (exit) {
        break;
      }

      if (_minGallop < 0) {
        _minGallop = 0;
      }

      _minGallop += 2;
    }

    minGallop = _minGallop;
    minGallop < 1 && (minGallop = 1);

    if (length1 === 1) {
      for (i = 0; i < length2; i++) {
        array[dest + i] = array[cursor2 + i];
      }

      array[dest + length2] = tmp[cursor1];
    } else if (length1 === 0) {
      throw new Error(); // throw new Error('mergeLow preconditions were not respected');
    } else {
      for (i = 0; i < length1; i++) {
        array[dest + i] = tmp[cursor1 + i];
      }
    }
  }

  function mergeHigh(start1, length1, start2, length2) {
    var i = 0;

    for (i = 0; i < length2; i++) {
      tmp[i] = array[start2 + i];
    }

    var cursor1 = start1 + length1 - 1;
    var cursor2 = length2 - 1;
    var dest = start2 + length2 - 1;
    var customCursor = 0;
    var customDest = 0;
    array[dest--] = array[cursor1--];

    if (--length1 === 0) {
      customCursor = dest - (length2 - 1);

      for (i = 0; i < length2; i++) {
        array[customCursor + i] = tmp[i];
      }

      return;
    }

    if (length2 === 1) {
      dest -= length1;
      cursor1 -= length1;
      customDest = dest + 1;
      customCursor = cursor1 + 1;

      for (i = length1 - 1; i >= 0; i--) {
        array[customDest + i] = array[customCursor + i];
      }

      array[dest] = tmp[cursor2];
      return;
    }

    var _minGallop = minGallop;

    while (true) {
      var count1 = 0;
      var count2 = 0;
      var exit = false;

      do {
        if (compare(tmp[cursor2], array[cursor1]) < 0) {
          array[dest--] = array[cursor1--];
          count1++;
          count2 = 0;

          if (--length1 === 0) {
            exit = true;
            break;
          }
        } else {
          array[dest--] = tmp[cursor2--];
          count2++;
          count1 = 0;

          if (--length2 === 1) {
            exit = true;
            break;
          }
        }
      } while ((count1 | count2) < _minGallop);

      if (exit) {
        break;
      }

      do {
        count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);

        if (count1 !== 0) {
          dest -= count1;
          cursor1 -= count1;
          length1 -= count1;
          customDest = dest + 1;
          customCursor = cursor1 + 1;

          for (i = count1 - 1; i >= 0; i--) {
            array[customDest + i] = array[customCursor + i];
          }

          if (length1 === 0) {
            exit = true;
            break;
          }
        }

        array[dest--] = tmp[cursor2--];

        if (--length2 === 1) {
          exit = true;
          break;
        }

        count2 = length2 - gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);

        if (count2 !== 0) {
          dest -= count2;
          cursor2 -= count2;
          length2 -= count2;
          customDest = dest + 1;
          customCursor = cursor2 + 1;

          for (i = 0; i < count2; i++) {
            array[customDest + i] = tmp[customCursor + i];
          }

          if (length2 <= 1) {
            exit = true;
            break;
          }
        }

        array[dest--] = array[cursor1--];

        if (--length1 === 0) {
          exit = true;
          break;
        }

        _minGallop--;
      } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);

      if (exit) {
        break;
      }

      if (_minGallop < 0) {
        _minGallop = 0;
      }

      _minGallop += 2;
    }

    minGallop = _minGallop;

    if (minGallop < 1) {
      minGallop = 1;
    }

    if (length2 === 1) {
      dest -= length1;
      cursor1 -= length1;
      customDest = dest + 1;
      customCursor = cursor1 + 1;

      for (i = length1 - 1; i >= 0; i--) {
        array[customDest + i] = array[customCursor + i];
      }

      array[dest] = tmp[cursor2];
    } else if (length2 === 0) {
      throw new Error(); // throw new Error('mergeHigh preconditions were not respected');
    } else {
      customCursor = dest - (length2 - 1);

      for (i = 0; i < length2; i++) {
        array[customCursor + i] = tmp[i];
      }
    }
  }

  this.mergeRuns = mergeRuns;
  this.forceMergeRuns = forceMergeRuns;
  this.pushRun = pushRun;
}

function sort(array, compare, lo, hi) {
  if (!lo) {
    lo = 0;
  }

  if (!hi) {
    hi = array.length;
  }

  var remaining = hi - lo;

  if (remaining < 2) {
    return;
  }

  var runLength = 0;

  if (remaining < DEFAULT_MIN_MERGE) {
    runLength = makeAscendingRun(array, lo, hi, compare);
    binaryInsertionSort(array, lo, hi, lo + runLength, compare);
    return;
  }

  var ts = new TimSort(array, compare);
  var minRun = minRunLength(remaining);

  do {
    runLength = makeAscendingRun(array, lo, hi, compare);

    if (runLength < minRun) {
      var force = remaining;

      if (force > minRun) {
        force = minRun;
      }

      binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
      runLength = force;
    }

    ts.pushRun(lo, runLength);
    ts.mergeRuns();
    remaining -= runLength;
    lo += runLength;
  } while (remaining !== 0);

  ts.forceMergeRuns();
}

module.exports = sort;

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var Style = __webpack_require__(267);

var Element = __webpack_require__(256);

var RectText = __webpack_require__(328);

/**
 * 可绘制的图形基类
 * Base class of all displayable graphic objects
 * @module zrender/graphic/Displayable
 */

/**
 * @alias module:zrender/graphic/Displayable
 * @extends module:zrender/Element
 * @extends module:zrender/graphic/mixin/RectText
 */
function Displayable(opts) {
  opts = opts || {};
  Element.call(this, opts); // Extend properties

  for (var name in opts) {
    if (opts.hasOwnProperty(name) && name !== 'style') {
      this[name] = opts[name];
    }
  }
  /**
   * @type {module:zrender/graphic/Style}
   */


  this.style = new Style(opts.style, this);
  this._rect = null; // Shapes for cascade clipping.

  this.__clipPaths = []; // FIXME Stateful must be mixined after style is setted
  // Stateful.call(this, opts);
}

Displayable.prototype = {
  constructor: Displayable,
  type: 'displayable',

  /**
   * Displayable 是否为脏，Painter 中会根据该标记判断是否需要是否需要重新绘制
   * Dirty flag. From which painter will determine if this displayable object needs brush
   * @name module:zrender/graphic/Displayable#__dirty
   * @type {boolean}
   */
  __dirty: true,

  /**
   * 图形是否可见，为true时不绘制图形，但是仍能触发鼠标事件
   * If ignore drawing of the displayable object. Mouse event will still be triggered
   * @name module:/zrender/graphic/Displayable#invisible
   * @type {boolean}
   * @default false
   */
  invisible: false,

  /**
   * @name module:/zrender/graphic/Displayable#z
   * @type {number}
   * @default 0
   */
  z: 0,

  /**
   * @name module:/zrender/graphic/Displayable#z
   * @type {number}
   * @default 0
   */
  z2: 0,

  /**
   * z层level，决定绘画在哪层canvas中
   * @name module:/zrender/graphic/Displayable#zlevel
   * @type {number}
   * @default 0
   */
  zlevel: 0,

  /**
   * 是否可拖拽
   * @name module:/zrender/graphic/Displayable#draggable
   * @type {boolean}
   * @default false
   */
  draggable: false,

  /**
   * 是否正在拖拽
   * @name module:/zrender/graphic/Displayable#draggable
   * @type {boolean}
   * @default false
   */
  dragging: false,

  /**
   * 是否相应鼠标事件
   * @name module:/zrender/graphic/Displayable#silent
   * @type {boolean}
   * @default false
   */
  silent: false,

  /**
   * If enable culling
   * @type {boolean}
   * @default false
   */
  culling: false,

  /**
   * Mouse cursor when hovered
   * @name module:/zrender/graphic/Displayable#cursor
   * @type {string}
   */
  cursor: 'pointer',

  /**
   * If hover area is bounding rect
   * @name module:/zrender/graphic/Displayable#rectHover
   * @type {string}
   */
  rectHover: false,

  /**
   * Render the element progressively when the value >= 0,
   * usefull for large data.
   * @type {number}
   */
  progressive: -1,
  beforeBrush: function (ctx) {},
  afterBrush: function (ctx) {},

  /**
   * 图形绘制方法
   * @param {CanvasRenderingContext2D} ctx
   */
  // Interface
  brush: function (ctx, prevEl) {},

  /**
   * 获取最小包围盒
   * @return {module:zrender/core/BoundingRect}
   */
  // Interface
  getBoundingRect: function () {},

  /**
   * 判断坐标 x, y 是否在图形上
   * If displayable element contain coord x, y
   * @param  {number} x
   * @param  {number} y
   * @return {boolean}
   */
  contain: function (x, y) {
    return this.rectContain(x, y);
  },

  /**
   * @param  {Function} cb
   * @param  {}   context
   */
  traverse: function (cb, context) {
    cb.call(context, this);
  },

  /**
   * 判断坐标 x, y 是否在图形的包围盒上
   * If bounding rect of element contain coord x, y
   * @param  {number} x
   * @param  {number} y
   * @return {boolean}
   */
  rectContain: function (x, y) {
    var coord = this.transformCoordToLocal(x, y);
    var rect = this.getBoundingRect();
    return rect.contain(coord[0], coord[1]);
  },

  /**
   * 标记图形元素为脏，并且在下一帧重绘
   * Mark displayable element dirty and refresh next frame
   */
  dirty: function () {
    this.__dirty = true;
    this._rect = null;
    this.__zr && this.__zr.refresh();
  },

  /**
   * 图形是否会触发事件
   * If displayable object binded any event
   * @return {boolean}
   */
  // TODO, 通过 bind 绑定的事件
  // isSilent: function () {
  //     return !(
  //         this.hoverable || this.draggable
  //         || this.onmousemove || this.onmouseover || this.onmouseout
  //         || this.onmousedown || this.onmouseup || this.onclick
  //         || this.ondragenter || this.ondragover || this.ondragleave
  //         || this.ondrop
  //     );
  // },

  /**
   * Alias for animate('style')
   * @param {boolean} loop
   */
  animateStyle: function (loop) {
    return this.animate('style', loop);
  },
  attrKV: function (key, value) {
    if (key !== 'style') {
      Element.prototype.attrKV.call(this, key, value);
    } else {
      this.style.set(value);
    }
  },

  /**
   * @param {Object|string} key
   * @param {*} value
   */
  setStyle: function (key, value) {
    this.style.set(key, value);
    this.dirty(false);
    return this;
  },

  /**
   * Use given style object
   * @param  {Object} obj
   */
  useStyle: function (obj) {
    this.style = new Style(obj, this);
    this.dirty(false);
    return this;
  }
};
zrUtil.inherits(Displayable, Element);
zrUtil.mixin(Displayable, RectText); // zrUtil.mixin(Displayable, Stateful);

var _default = Displayable;
module.exports = _default;

/***/ }),
/* 244 */
/***/ (function(module, exports) {

/**
 * @param {Array.<Object>} colorStops
 */
var Gradient = function (colorStops) {
  this.colorStops = colorStops || [];
};

Gradient.prototype = {
  constructor: Gradient,
  addColorStop: function (offset, color) {
    this.colorStops.push({
      offset: offset,
      color: color
    });
  }
};
var _default = Gradient;
module.exports = _default;

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

var LRU = __webpack_require__(261);

var globalImageCache = new LRU(50);
/**
 * @param {string|HTMLImageElement|HTMLCanvasElement|Canvas} newImageOrSrc
 * @return {HTMLImageElement|HTMLCanvasElement|Canvas} image
 */

function findExistImage(newImageOrSrc) {
  if (typeof newImageOrSrc === 'string') {
    var cachedImgObj = globalImageCache.get(newImageOrSrc);
    return cachedImgObj && cachedImgObj.image;
  } else {
    return newImageOrSrc;
  }
}
/**
 * Caution: User should cache loaded images, but not just count on LRU.
 * Consider if required images more than LRU size, will dead loop occur?
 *
 * @param {string|HTMLImageElement|HTMLCanvasElement|Canvas} newImageOrSrc
 * @param {HTMLImageElement|HTMLCanvasElement|Canvas} image Existent image.
 * @param {module:zrender/Element} [hostEl] For calling `dirty`.
 * @param {Function} [cb] params: (image, cbPayload)
 * @param {Object} [cbPayload] Payload on cb calling.
 * @return {HTMLImageElement|HTMLCanvasElement|Canvas} image
 */


function createOrUpdateImage(newImageOrSrc, image, hostEl, cb, cbPayload) {
  if (!newImageOrSrc) {
    return image;
  } else if (typeof newImageOrSrc === 'string') {
    // Image should not be loaded repeatly.
    if (image && image.__zrImageSrc === newImageOrSrc || !hostEl) {
      return image;
    } // Only when there is no existent image or existent image src
    // is different, this method is responsible for load.


    var cachedImgObj = globalImageCache.get(newImageOrSrc);
    var pendingWrap = {
      hostEl: hostEl,
      cb: cb,
      cbPayload: cbPayload
    };

    if (cachedImgObj) {
      image = cachedImgObj.image;
      !isImageReady(image) && cachedImgObj.pending.push(pendingWrap);
    } else {
      !image && (image = new Image());
      image.onload = imageOnLoad;
      globalImageCache.put(newImageOrSrc, image.__cachedImgObj = {
        image: image,
        pending: [pendingWrap]
      });
      image.src = image.__zrImageSrc = newImageOrSrc;
    }

    return image;
  } // newImageOrSrc is an HTMLImageElement or HTMLCanvasElement or Canvas
  else {
      return newImageOrSrc;
    }
}

function imageOnLoad() {
  var cachedImgObj = this.__cachedImgObj;
  this.onload = this.__cachedImgObj = null;

  for (var i = 0; i < cachedImgObj.pending.length; i++) {
    var pendingWrap = cachedImgObj.pending[i];
    var cb = pendingWrap.cb;
    cb && cb(this, pendingWrap.cbPayload);
    pendingWrap.hostEl.dirty();
  }

  cachedImgObj.pending.length = 0;
}

function isImageReady(image) {
  return image && image.width && image.height;
}

exports.findExistImage = findExistImage;
exports.createOrUpdateImage = createOrUpdateImage;
exports.isImageReady = isImageReady;

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var coordinateSystemCreators = {};

function CoordinateSystemManager() {
  this._coordinateSystems = [];
}

CoordinateSystemManager.prototype = {
  constructor: CoordinateSystemManager,
  create: function (ecModel, api) {
    var coordinateSystems = [];
    zrUtil.each(coordinateSystemCreators, function (creater, type) {
      var list = creater.create(ecModel, api);
      coordinateSystems = coordinateSystems.concat(list || []);
    });
    this._coordinateSystems = coordinateSystems;
  },
  update: function (ecModel, api) {
    zrUtil.each(this._coordinateSystems, function (coordSys) {
      // FIXME MUST have
      coordSys.update && coordSys.update(ecModel, api);
    });
  },
  getCoordinateSystems: function () {
    return this._coordinateSystems.slice();
  }
};

CoordinateSystemManager.register = function (type, coordinateSystemCreator) {
  coordinateSystemCreators[type] = coordinateSystemCreator;
};

CoordinateSystemManager.get = function (type) {
  return coordinateSystemCreators[type];
};

var _default = CoordinateSystemManager;
module.exports = _default;

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var _model = __webpack_require__(201);

var normalizeToArray = _model.normalizeToArray;

/**
 * Complete dimensions by data (guess dimension).
 */
var each = zrUtil.each;
var isString = zrUtil.isString;
var defaults = zrUtil.defaults;
var OTHER_DIMS = {
  tooltip: 1,
  label: 1,
  itemName: 1
};
/**
 * Complete the dimensions array, by user defined `dimension` and `encode`,
 * and guessing from the data structure.
 * If no 'value' dimension specified, the first no-named dimension will be
 * named as 'value'.
 *
 * @param {Array.<string>} sysDims Necessary dimensions, like ['x', 'y'], which
 *      provides not only dim template, but also default order.
 *      `name` of each item provides default coord name.
 *      [{dimsDef: []}, ...] can be specified to give names.
 * @param {Array} data Data list. [[1, 2, 3], [2, 3, 4]].
 * @param {Object} [opt]
 * @param {Array.<Object|string>} [opt.dimsDef] option.series.dimensions User defined dimensions
 *      For example: ['asdf', {name, type}, ...].
 * @param {Object} [opt.encodeDef] option.series.encode {x: 2, y: [3, 1], tooltip: [1, 2], label: 3}
 * @param {string} [opt.extraPrefix] Prefix of name when filling the left dimensions.
 * @param {string} [opt.extraFromZero] If specified, extra dim names will be:
 *                      extraPrefix + 0, extraPrefix + extraBaseIndex + 1 ...
 *                      If not specified, extra dim names will be:
 *                      extraPrefix, extraPrefix + 0, extraPrefix + 1 ...
 * @param {number} [opt.dimCount] If not specified, guess by the first data item.
 * @return {Array.<Object>} [{
 *      name: string mandatory,
 *      coordDim: string mandatory,
 *      coordDimIndex: number mandatory,
 *      type: string optional,
 *      tooltipName: string optional,
 *      otherDims: {
 *          tooltip: number optional,
 *          label: number optional
 *      },
 *      isExtraCoord: boolean true or undefined.
 *      other props ...
 * }]
 */

function completeDimensions(sysDims, data, opt) {
  data = data || [];
  opt = opt || {};
  sysDims = (sysDims || []).slice();
  var dimsDef = (opt.dimsDef || []).slice();
  var encodeDef = zrUtil.createHashMap(opt.encodeDef);
  var dataDimNameMap = zrUtil.createHashMap();
  var coordDimNameMap = zrUtil.createHashMap(); // var valueCandidate;

  var result = [];
  var dimCount = opt.dimCount;

  if (dimCount == null) {
    var value0 = retrieveValue(data[0]);
    dimCount = Math.max(zrUtil.isArray(value0) && value0.length || 1, sysDims.length, dimsDef.length);
    each(sysDims, function (sysDimItem) {
      var sysDimItemDimsDef = sysDimItem.dimsDef;
      sysDimItemDimsDef && (dimCount = Math.max(dimCount, sysDimItemDimsDef.length));
    });
  } // Apply user defined dims (`name` and `type`) and init result.


  for (var i = 0; i < dimCount; i++) {
    var dimDefItem = isString(dimsDef[i]) ? {
      name: dimsDef[i]
    } : dimsDef[i] || {};
    var userDimName = dimDefItem.name;
    var resultItem = result[i] = {
      otherDims: {}
    }; // Name will be applied later for avoiding duplication.

    if (userDimName != null && dataDimNameMap.get(userDimName) == null) {
      // Only if `series.dimensions` is defined in option, tooltipName
      // will be set, and dimension will be diplayed vertically in
      // tooltip by default.
      resultItem.name = resultItem.tooltipName = userDimName;
      dataDimNameMap.set(userDimName, i);
    }

    dimDefItem.type != null && (resultItem.type = dimDefItem.type);
  } // Set `coordDim` and `coordDimIndex` by `encodeDef` and normalize `encodeDef`.


  encodeDef.each(function (dataDims, coordDim) {
    dataDims = encodeDef.set(coordDim, normalizeToArray(dataDims).slice());
    each(dataDims, function (resultDimIdx, coordDimIndex) {
      // The input resultDimIdx can be dim name or index.
      isString(resultDimIdx) && (resultDimIdx = dataDimNameMap.get(resultDimIdx));

      if (resultDimIdx != null && resultDimIdx < dimCount) {
        dataDims[coordDimIndex] = resultDimIdx;
        applyDim(result[resultDimIdx], coordDim, coordDimIndex);
      }
    });
  }); // Apply templetes and default order from `sysDims`.

  var availDimIdx = 0;
  each(sysDims, function (sysDimItem, sysDimIndex) {
    var coordDim;
    var sysDimItem;
    var sysDimItemDimsDef;
    var sysDimItemOtherDims;

    if (isString(sysDimItem)) {
      coordDim = sysDimItem;
      sysDimItem = {};
    } else {
      coordDim = sysDimItem.name;
      sysDimItem = zrUtil.clone(sysDimItem); // `coordDimIndex` should not be set directly.

      sysDimItemDimsDef = sysDimItem.dimsDef;
      sysDimItemOtherDims = sysDimItem.otherDims;
      sysDimItem.name = sysDimItem.coordDim = sysDimItem.coordDimIndex = sysDimItem.dimsDef = sysDimItem.otherDims = null;
    }

    var dataDims = normalizeToArray(encodeDef.get(coordDim)); // dimensions provides default dim sequences.

    if (!dataDims.length) {
      for (var i = 0; i < (sysDimItemDimsDef && sysDimItemDimsDef.length || 1); i++) {
        while (availDimIdx < result.length && result[availDimIdx].coordDim != null) {
          availDimIdx++;
        }

        availDimIdx < result.length && dataDims.push(availDimIdx++);
      }
    } // Apply templates.


    each(dataDims, function (resultDimIdx, coordDimIndex) {
      var resultItem = result[resultDimIdx];
      applyDim(defaults(resultItem, sysDimItem), coordDim, coordDimIndex);

      if (resultItem.name == null && sysDimItemDimsDef) {
        resultItem.name = resultItem.tooltipName = sysDimItemDimsDef[coordDimIndex];
      }

      sysDimItemOtherDims && defaults(resultItem.otherDims, sysDimItemOtherDims);
    });
  }); // Make sure the first extra dim is 'value'.

  var extra = opt.extraPrefix || 'value'; // Set dim `name` and other `coordDim` and other props.

  for (var resultDimIdx = 0; resultDimIdx < dimCount; resultDimIdx++) {
    var resultItem = result[resultDimIdx] = result[resultDimIdx] || {};
    var coordDim = resultItem.coordDim;
    coordDim == null && (resultItem.coordDim = genName(extra, coordDimNameMap, opt.extraFromZero), resultItem.coordDimIndex = 0, resultItem.isExtraCoord = true);
    resultItem.name == null && (resultItem.name = genName(resultItem.coordDim, dataDimNameMap));
    resultItem.type == null && guessOrdinal(data, resultDimIdx) && (resultItem.type = 'ordinal');
  }

  return result;

  function applyDim(resultItem, coordDim, coordDimIndex) {
    if (OTHER_DIMS[coordDim]) {
      resultItem.otherDims[coordDim] = coordDimIndex;
    } else {
      resultItem.coordDim = coordDim;
      resultItem.coordDimIndex = coordDimIndex;
      coordDimNameMap.set(coordDim, true);
    }
  }

  function genName(name, map, fromZero) {
    if (fromZero || map.get(name) != null) {
      var i = 0;

      while (map.get(name + i) != null) {
        i++;
      }

      name += i;
    }

    map.set(name, true);
    return name;
  }
} // The rule should not be complex, otherwise user might not
// be able to known where the data is wrong.


var guessOrdinal = completeDimensions.guessOrdinal = function (data, dimIndex) {
  for (var i = 0, len = data.length; i < len; i++) {
    var value = retrieveValue(data[i]);

    if (!zrUtil.isArray(value)) {
      return false;
    }

    var value = value[dimIndex]; // Consider usage convenience, '1', '2' will be treated as "number".
    // `isFinit('')` get `true`.

    if (value != null && isFinite(value) && value !== '') {
      return false;
    } else if (isString(value) && value !== '-') {
      return true;
    }
  }

  return false;
};

function retrieveValue(o) {
  return zrUtil.isArray(o) ? o : zrUtil.isObject(o) ? o.value : o;
}

var _default = completeDimensions;
module.exports = _default;

/***/ }),
/* 248 */
/***/ (function(module, exports) {

var ORIGIN_METHOD = '\0__throttleOriginMethod';
var RATE = '\0__throttleRate';
var THROTTLE_TYPE = '\0__throttleType';
/**
 * @public
 * @param {(Function)} fn
 * @param {number} [delay=0] Unit: ms.
 * @param {boolean} [debounce=false]
 *        true: If call interval less than `delay`, only the last call works.
 *        false: If call interval less than `delay, call works on fixed rate.
 * @return {(Function)} throttled fn.
 */

function throttle(fn, delay, debounce) {
  var currCall;
  var lastCall = 0;
  var lastExec = 0;
  var timer = null;
  var diff;
  var scope;
  var args;
  var debounceNextCall;
  delay = delay || 0;

  function exec() {
    lastExec = new Date().getTime();
    timer = null;
    fn.apply(scope, args || []);
  }

  var cb = function () {
    currCall = new Date().getTime();
    scope = this;
    args = arguments;
    var thisDelay = debounceNextCall || delay;
    var thisDebounce = debounceNextCall || debounce;
    debounceNextCall = null;
    diff = currCall - (thisDebounce ? lastCall : lastExec) - thisDelay;
    clearTimeout(timer);

    if (thisDebounce) {
      timer = setTimeout(exec, thisDelay);
    } else {
      if (diff >= 0) {
        exec();
      } else {
        timer = setTimeout(exec, -diff);
      }
    }

    lastCall = currCall;
  };
  /**
   * Clear throttle.
   * @public
   */


  cb.clear = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  /**
   * Enable debounce once.
   */


  cb.debounceNextCall = function (debounceDelay) {
    debounceNextCall = debounceDelay;
  };

  return cb;
}
/**
 * Create throttle method or update throttle rate.
 *
 * @example
 * ComponentView.prototype.render = function () {
 *     ...
 *     throttle.createOrUpdate(
 *         this,
 *         '_dispatchAction',
 *         this.model.get('throttle'),
 *         'fixRate'
 *     );
 * };
 * ComponentView.prototype.remove = function () {
 *     throttle.clear(this, '_dispatchAction');
 * };
 * ComponentView.prototype.dispose = function () {
 *     throttle.clear(this, '_dispatchAction');
 * };
 *
 * @public
 * @param {Object} obj
 * @param {string} fnAttr
 * @param {number} [rate]
 * @param {string} [throttleType='fixRate'] 'fixRate' or 'debounce'
 * @return {Function} throttled function.
 */


function createOrUpdate(obj, fnAttr, rate, throttleType) {
  var fn = obj[fnAttr];

  if (!fn) {
    return;
  }

  var originFn = fn[ORIGIN_METHOD] || fn;
  var lastThrottleType = fn[THROTTLE_TYPE];
  var lastRate = fn[RATE];

  if (lastRate !== rate || lastThrottleType !== throttleType) {
    if (rate == null || !throttleType) {
      return obj[fnAttr] = originFn;
    }

    fn = obj[fnAttr] = throttle(originFn, rate, throttleType === 'debounce');
    fn[ORIGIN_METHOD] = originFn;
    fn[THROTTLE_TYPE] = throttleType;
    fn[RATE] = rate;
  }

  return fn;
}
/**
 * Clear throttle. Example see throttle.createOrUpdate.
 *
 * @public
 * @param {Object} obj
 * @param {string} fnAttr
 */


function clear(obj, fnAttr) {
  var fn = obj[fnAttr];

  if (fn && fn[ORIGIN_METHOD]) {
    obj[fnAttr] = fn[ORIGIN_METHOD];
  }
}

exports.throttle = throttle;
exports.createOrUpdate = createOrUpdate;
exports.clear = clear;

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

var _config = __webpack_require__(211);

var __DEV__ = _config.__DEV__;

var zrUtil = __webpack_require__(196);

var List = __webpack_require__(238);

var completeDimensions = __webpack_require__(247);

var _model = __webpack_require__(201);

var getDataItemValue = _model.getDataItemValue;
var converDataValue = _model.converDataValue;
var isDataItemOption = _model.isDataItemOption;

var CoordinateSystem = __webpack_require__(246);

function firstDataNotNull(data) {
  var i = 0;

  while (i < data.length && data[i] == null) {
    i++;
  }

  return data[i];
}

function ifNeedCompleteOrdinalData(data) {
  var sampleItem = firstDataNotNull(data);
  return sampleItem != null && !zrUtil.isArray(getDataItemValue(sampleItem));
}
/**
 * Helper function to create a list from option data
 */


function createListFromArray(data, seriesModel, ecModel) {
  // If data is undefined
  data = data || [];
  var coordSysName = seriesModel.get('coordinateSystem');
  var creator = creators[coordSysName];
  var registeredCoordSys = CoordinateSystem.get(coordSysName);
  var completeDimOpt = {
    encodeDef: seriesModel.get('encode'),
    dimsDef: seriesModel.get('dimensions')
  }; // FIXME

  var axesInfo = creator && creator(data, seriesModel, ecModel, completeDimOpt);
  var dimensions = axesInfo && axesInfo.dimensions;

  if (!dimensions) {
    // Get dimensions from registered coordinate system
    dimensions = registeredCoordSys && (registeredCoordSys.getDimensionsInfo ? registeredCoordSys.getDimensionsInfo() : registeredCoordSys.dimensions.slice()) || ['x', 'y'];
    dimensions = completeDimensions(dimensions, data, completeDimOpt);
  }

  var categoryIndex = axesInfo ? axesInfo.categoryIndex : -1;
  var list = new List(dimensions, seriesModel);
  var nameList = createNameList(axesInfo, data);
  var categories = {};
  var dimValueGetter = categoryIndex >= 0 && ifNeedCompleteOrdinalData(data) ? function (itemOpt, dimName, dataIndex, dimIndex) {
    // If any dataItem is like { value: 10 }
    if (isDataItemOption(itemOpt)) {
      list.hasItemOption = true;
    } // Use dataIndex as ordinal value in categoryAxis


    return dimIndex === categoryIndex ? dataIndex : converDataValue(getDataItemValue(itemOpt), dimensions[dimIndex]);
  } : function (itemOpt, dimName, dataIndex, dimIndex) {
    var value = getDataItemValue(itemOpt);
    var val = converDataValue(value && value[dimIndex], dimensions[dimIndex]); // If any dataItem is like { value: 10 }

    if (isDataItemOption(itemOpt)) {
      list.hasItemOption = true;
    }

    var categoryAxesModels = axesInfo && axesInfo.categoryAxesModels;

    if (categoryAxesModels && categoryAxesModels[dimName]) {
      // If given value is a category string
      if (typeof val === 'string') {
        // Lazy get categories
        categories[dimName] = categories[dimName] || categoryAxesModels[dimName].getCategories();
        val = zrUtil.indexOf(categories[dimName], val);

        if (val < 0 && !isNaN(val)) {
          // In case some one write '1', '2' istead of 1, 2
          val = +val;
        }
      }
    }

    return val;
  };
  list.hasItemOption = false;
  list.initData(data, nameList, dimValueGetter);
  return list;
}

function isStackable(axisType) {
  return axisType !== 'category' && axisType !== 'time';
}

function getDimTypeByAxis(axisType) {
  return axisType === 'category' ? 'ordinal' : axisType === 'time' ? 'time' : 'float';
}
/**
 * Creaters for each coord system.
 */


var creators = {
  cartesian2d: function (data, seriesModel, ecModel, completeDimOpt) {
    var axesModels = zrUtil.map(['xAxis', 'yAxis'], function (name) {
      return ecModel.queryComponents({
        mainType: name,
        index: seriesModel.get(name + 'Index'),
        id: seriesModel.get(name + 'Id')
      })[0];
    });
    var xAxisModel = axesModels[0];
    var yAxisModel = axesModels[1];
    var xAxisType = xAxisModel.get('type');
    var yAxisType = yAxisModel.get('type');
    var dimensions = [{
      name: 'x',
      type: getDimTypeByAxis(xAxisType),
      stackable: isStackable(xAxisType)
    }, {
      name: 'y',
      // If two category axes
      type: getDimTypeByAxis(yAxisType),
      stackable: isStackable(yAxisType)
    }];
    var isXAxisCateogry = xAxisType === 'category';
    var isYAxisCategory = yAxisType === 'category';
    dimensions = completeDimensions(dimensions, data, completeDimOpt);
    var categoryAxesModels = {};

    if (isXAxisCateogry) {
      categoryAxesModels.x = xAxisModel;
    }

    if (isYAxisCategory) {
      categoryAxesModels.y = yAxisModel;
    }

    return {
      dimensions: dimensions,
      categoryIndex: isXAxisCateogry ? 0 : isYAxisCategory ? 1 : -1,
      categoryAxesModels: categoryAxesModels
    };
  },
  singleAxis: function (data, seriesModel, ecModel, completeDimOpt) {
    var singleAxisModel = ecModel.queryComponents({
      mainType: 'singleAxis',
      index: seriesModel.get('singleAxisIndex'),
      id: seriesModel.get('singleAxisId')
    })[0];
    var singleAxisType = singleAxisModel.get('type');
    var isCategory = singleAxisType === 'category';
    var dimensions = [{
      name: 'single',
      type: getDimTypeByAxis(singleAxisType),
      stackable: isStackable(singleAxisType)
    }];
    dimensions = completeDimensions(dimensions, data, completeDimOpt);
    var categoryAxesModels = {};

    if (isCategory) {
      categoryAxesModels.single = singleAxisModel;
    }

    return {
      dimensions: dimensions,
      categoryIndex: isCategory ? 0 : -1,
      categoryAxesModels: categoryAxesModels
    };
  },
  polar: function (data, seriesModel, ecModel, completeDimOpt) {
    var polarModel = ecModel.queryComponents({
      mainType: 'polar',
      index: seriesModel.get('polarIndex'),
      id: seriesModel.get('polarId')
    })[0];
    var angleAxisModel = polarModel.findAxisModel('angleAxis');
    var radiusAxisModel = polarModel.findAxisModel('radiusAxis');
    var radiusAxisType = radiusAxisModel.get('type');
    var angleAxisType = angleAxisModel.get('type');
    var dimensions = [{
      name: 'radius',
      type: getDimTypeByAxis(radiusAxisType),
      stackable: isStackable(radiusAxisType)
    }, {
      name: 'angle',
      type: getDimTypeByAxis(angleAxisType),
      stackable: isStackable(angleAxisType)
    }];
    var isAngleAxisCateogry = angleAxisType === 'category';
    var isRadiusAxisCateogry = radiusAxisType === 'category';
    dimensions = completeDimensions(dimensions, data, completeDimOpt);
    var categoryAxesModels = {};

    if (isRadiusAxisCateogry) {
      categoryAxesModels.radius = radiusAxisModel;
    }

    if (isAngleAxisCateogry) {
      categoryAxesModels.angle = angleAxisModel;
    }

    return {
      dimensions: dimensions,
      categoryIndex: isAngleAxisCateogry ? 1 : isRadiusAxisCateogry ? 0 : -1,
      categoryAxesModels: categoryAxesModels
    };
  },
  geo: function (data, seriesModel, ecModel, completeDimOpt) {
    // TODO Region
    // 多个散点图系列在同一个地区的时候
    return {
      dimensions: completeDimensions([{
        name: 'lng'
      }, {
        name: 'lat'
      }], data, completeDimOpt)
    };
  }
};

function createNameList(result, data) {
  var nameList = [];
  var categoryDim = result && result.dimensions[result.categoryIndex];
  var categoryAxisModel;

  if (categoryDim) {
    categoryAxisModel = result.categoryAxesModels[categoryDim.name];
  }

  if (categoryAxisModel) {
    // FIXME Two category axis
    var categories = categoryAxisModel.getCategories();

    if (categories) {
      var dataLen = data.length; // Ordered data is given explicitly like
      // [[3, 0.2], [1, 0.3], [2, 0.15]]
      // or given scatter data,
      // pick the category

      if (zrUtil.isArray(data[0]) && data[0].length > 1) {
        nameList = [];

        for (var i = 0; i < dataLen; i++) {
          nameList[i] = categories[data[i][result.categoryIndex || 0]];
        }
      } else {
        nameList = categories.slice(0);
      }
    }
  }

  return nameList;
}

var _default = createListFromArray;
module.exports = _default;

/***/ }),
/* 250 */
/***/ (function(module, exports) {

function defaultKeyGetter(item) {
  return item;
}
/**
 * @param {Array} oldArr
 * @param {Array} newArr
 * @param {Function} oldKeyGetter
 * @param {Function} newKeyGetter
 * @param {Object} [context] Can be visited by this.context in callback.
 */


function DataDiffer(oldArr, newArr, oldKeyGetter, newKeyGetter, context) {
  this._old = oldArr;
  this._new = newArr;
  this._oldKeyGetter = oldKeyGetter || defaultKeyGetter;
  this._newKeyGetter = newKeyGetter || defaultKeyGetter;
  this.context = context;
}

DataDiffer.prototype = {
  constructor: DataDiffer,

  /**
   * Callback function when add a data
   */
  add: function (func) {
    this._add = func;
    return this;
  },

  /**
   * Callback function when update a data
   */
  update: function (func) {
    this._update = func;
    return this;
  },

  /**
   * Callback function when remove a data
   */
  remove: function (func) {
    this._remove = func;
    return this;
  },
  execute: function () {
    var oldArr = this._old;
    var newArr = this._new;
    var oldDataIndexMap = {};
    var newDataIndexMap = {};
    var oldDataKeyArr = [];
    var newDataKeyArr = [];
    var i;
    initIndexMap(oldArr, oldDataIndexMap, oldDataKeyArr, '_oldKeyGetter', this);
    initIndexMap(newArr, newDataIndexMap, newDataKeyArr, '_newKeyGetter', this); // Travel by inverted order to make sure order consistency
    // when duplicate keys exists (consider newDataIndex.pop() below).
    // For performance consideration, these code below do not look neat.

    for (i = 0; i < oldArr.length; i++) {
      var key = oldDataKeyArr[i];
      var idx = newDataIndexMap[key]; // idx can never be empty array here. see 'set null' logic below.

      if (idx != null) {
        // Consider there is duplicate key (for example, use dataItem.name as key).
        // We should make sure every item in newArr and oldArr can be visited.
        var len = idx.length;

        if (len) {
          len === 1 && (newDataIndexMap[key] = null);
          idx = idx.unshift();
        } else {
          newDataIndexMap[key] = null;
        }

        this._update && this._update(idx, i);
      } else {
        this._remove && this._remove(i);
      }
    }

    for (var i = 0; i < newDataKeyArr.length; i++) {
      var key = newDataKeyArr[i];

      if (newDataIndexMap.hasOwnProperty(key)) {
        var idx = newDataIndexMap[key];

        if (idx == null) {
          continue;
        } // idx can never be empty array here. see 'set null' logic above.


        if (!idx.length) {
          this._add && this._add(idx);
        } else {
          for (var j = 0, len = idx.length; j < len; j++) {
            this._add && this._add(idx[j]);
          }
        }
      }
    }
  }
};

function initIndexMap(arr, map, keyArr, keyGetterName, dataDiffer) {
  for (var i = 0; i < arr.length; i++) {
    // Add prefix to avoid conflict with Object.prototype.
    var key = '_ec_' + dataDiffer[keyGetterName](arr[i], i);
    var existence = map[key];

    if (existence == null) {
      keyArr.push(key);
      map[key] = i;
    } else {
      if (!existence.length) {
        map[key] = existence = [existence];
      }

      existence.push(i);
    }
  }
}

var _default = DataDiffer;
module.exports = _default;

/***/ }),
/* 251 */,
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

var _config = __webpack_require__(211);

var __DEV__ = _config.__DEV__;

var zrUtil = __webpack_require__(196);

var env = __webpack_require__(213);

var _format = __webpack_require__(217);

var formatTime = _format.formatTime;
var encodeHTML = _format.encodeHTML;
var addCommas = _format.addCommas;
var getTooltipMarker = _format.getTooltipMarker;

var _clazz = __webpack_require__(222);

var set = _clazz.set;
var get = _clazz.get;

var modelUtil = __webpack_require__(201);

var ComponentModel = __webpack_require__(223);

var colorPaletteMixin = __webpack_require__(253);

var _layout = __webpack_require__(224);

var getLayoutParams = _layout.getLayoutParams;
var mergeLayoutParam = _layout.mergeLayoutParam;
var SeriesModel = ComponentModel.extend({
  type: 'series.__base__',

  /**
   * @readOnly
   */
  seriesIndex: 0,
  // coodinateSystem will be injected in the echarts/CoordinateSystem
  coordinateSystem: null,

  /**
   * @type {Object}
   * @protected
   */
  defaultOption: null,

  /**
   * Data provided for legend
   * @type {Function}
   */
  // PENDING
  legendDataProvider: null,

  /**
   * Access path of color for visual
   */
  visualColorAccessPath: 'itemStyle.normal.color',

  /**
   * Support merge layout params.
   * Only support 'box' now (left/right/top/bottom/width/height).
   * @type {string|Object} Object can be {ignoreSize: true}
   * @readOnly
   */
  layoutMode: null,
  init: function (option, parentModel, ecModel, extraOpt) {
    /**
     * @type {number}
     * @readOnly
     */
    this.seriesIndex = this.componentIndex;
    this.mergeDefaultAndTheme(option, ecModel);
    var data = this.getInitialData(option, ecModel);

    /**
     * @type {module:echarts/data/List|module:echarts/data/Tree|module:echarts/data/Graph}
     * @private
     */
    set(this, 'dataBeforeProcessed', data); // If we reverse the order (make data firstly, and then make
    // dataBeforeProcessed by cloneShallow), cloneShallow will
    // cause data.graph.data !== data when using
    // module:echarts/data/Graph or module:echarts/data/Tree.
    // See module:echarts/data/helper/linkList

    this.restoreData();
  },

  /**
   * Util for merge default and theme to option
   * @param  {Object} option
   * @param  {module:echarts/model/Global} ecModel
   */
  mergeDefaultAndTheme: function (option, ecModel) {
    var layoutMode = this.layoutMode;
    var inputPositionParams = layoutMode ? getLayoutParams(option) : {}; // Backward compat: using subType on theme.
    // But if name duplicate between series subType
    // (for example: parallel) add component mainType,
    // add suffix 'Series'.

    var themeSubType = this.subType;

    if (ComponentModel.hasClass(themeSubType)) {
      themeSubType += 'Series';
    }

    zrUtil.merge(option, ecModel.getTheme().get(this.subType));
    zrUtil.merge(option, this.getDefaultOption()); // Default label emphasis `show`

    modelUtil.defaultEmphasis(option.label, ['show']);
    this.fillDataTextStyle(option.data);

    if (layoutMode) {
      mergeLayoutParam(option, inputPositionParams, layoutMode);
    }
  },
  mergeOption: function (newSeriesOption, ecModel) {
    newSeriesOption = zrUtil.merge(this.option, newSeriesOption, true);
    this.fillDataTextStyle(newSeriesOption.data);
    var layoutMode = this.layoutMode;

    if (layoutMode) {
      mergeLayoutParam(this.option, newSeriesOption, layoutMode);
    }

    var data = this.getInitialData(newSeriesOption, ecModel); // TODO Merge data?

    if (data) {
      set(this, 'data', data);
      set(this, 'dataBeforeProcessed', data.cloneShallow());
    }
  },
  fillDataTextStyle: function (data) {
    // Default data label emphasis `show`
    // FIXME Tree structure data ?
    // FIXME Performance ?
    if (data) {
      var props = ['show'];

      for (var i = 0; i < data.length; i++) {
        if (data[i] && data[i].label) {
          modelUtil.defaultEmphasis(data[i].label, props);
        }
      }
    }
  },

  /**
   * Init a data structure from data related option in series
   * Must be overwritten
   */
  getInitialData: function () {},

  /**
   * @param {string} [dataType]
   * @return {module:echarts/data/List}
   */
  getData: function (dataType) {
    var data = get(this, 'data');
    return dataType == null ? data : data.getLinkedData(dataType);
  },

  /**
   * @param {module:echarts/data/List} data
   */
  setData: function (data) {
    set(this, 'data', data);
  },

  /**
   * Get data before processed
   * @return {module:echarts/data/List}
   */
  getRawData: function () {
    return get(this, 'dataBeforeProcessed');
  },

  /**
   * Coord dimension to data dimension.
   *
   * By default the result is the same as dimensions of series data.
   * But in some series data dimensions are different from coord dimensions (i.e.
   * candlestick and boxplot). Override this method to handle those cases.
   *
   * Coord dimension to data dimension can be one-to-many
   *
   * @param {string} coordDim
   * @return {Array.<string>} dimensions on the axis.
   */
  coordDimToDataDim: function (coordDim) {
    return modelUtil.coordDimToDataDim(this.getData(), coordDim);
  },

  /**
   * Convert data dimension to coord dimension.
   *
   * @param {string|number} dataDim
   * @return {string}
   */
  dataDimToCoordDim: function (dataDim) {
    return modelUtil.dataDimToCoordDim(this.getData(), dataDim);
  },

  /**
   * Get base axis if has coordinate system and has axis.
   * By default use coordSys.getBaseAxis();
   * Can be overrided for some chart.
   * @return {type} description
   */
  getBaseAxis: function () {
    var coordSys = this.coordinateSystem;
    return coordSys && coordSys.getBaseAxis && coordSys.getBaseAxis();
  },
  // FIXME

  /**
   * Default tooltip formatter
   *
   * @param {number} dataIndex
   * @param {boolean} [multipleSeries=false]
   * @param {number} [dataType]
   */
  formatTooltip: function (dataIndex, multipleSeries, dataType) {
    function formatArrayValue(value) {
      var vertially = zrUtil.reduce(value, function (vertially, val, idx) {
        var dimItem = data.getDimensionInfo(idx);
        return vertially |= dimItem && dimItem.tooltip !== false && dimItem.tooltipName != null;
      }, 0);
      var result = [];
      var tooltipDims = modelUtil.otherDimToDataDim(data, 'tooltip');
      tooltipDims.length ? zrUtil.each(tooltipDims, function (dimIdx) {
        setEachItem(data.get(dimIdx, dataIndex), dimIdx);
      }) // By default, all dims is used on tooltip.
      : zrUtil.each(value, setEachItem);

      function setEachItem(val, dimIdx) {
        var dimInfo = data.getDimensionInfo(dimIdx); // If `dimInfo.tooltip` is not set, show tooltip.

        if (!dimInfo || dimInfo.otherDims.tooltip === false) {
          return;
        }

        var dimType = dimInfo.type;
        var valStr = (vertially ? '- ' + (dimInfo.tooltipName || dimInfo.name) + ': ' : '') + (dimType === 'ordinal' ? val + '' : dimType === 'time' ? multipleSeries ? '' : formatTime('yyyy/MM/dd hh:mm:ss', val) : addCommas(val));
        valStr && result.push(encodeHTML(valStr));
      }

      return (vertially ? '<br/>' : '') + result.join(vertially ? '<br/>' : ', ');
    }

    var data = get(this, 'data');
    var value = this.getRawValue(dataIndex);
    var formattedValue = zrUtil.isArray(value) ? formatArrayValue(value) : encodeHTML(addCommas(value));
    var name = data.getName(dataIndex);
    var color = data.getItemVisual(dataIndex, 'color');

    if (zrUtil.isObject(color) && color.colorStops) {
      color = (color.colorStops[0] || {}).color;
    }

    color = color || 'transparent';
    var colorEl = getTooltipMarker(color);
    var seriesName = this.name; // FIXME

    if (seriesName === '\0-') {
      // Not show '-'
      seriesName = '';
    }

    seriesName = seriesName ? encodeHTML(seriesName) + (!multipleSeries ? '<br/>' : ': ') : '';
    return !multipleSeries ? seriesName + colorEl + (name ? encodeHTML(name) + ': ' + formattedValue : formattedValue) : colorEl + seriesName + formattedValue;
  },

  /**
   * @return {boolean}
   */
  isAnimationEnabled: function () {
    if (env.node) {
      return false;
    }

    var animationEnabled = this.getShallow('animation');

    if (animationEnabled) {
      if (this.getData().count() > this.getShallow('animationThreshold')) {
        animationEnabled = false;
      }
    }

    return animationEnabled;
  },
  restoreData: function () {
    set(this, 'data', get(this, 'dataBeforeProcessed').cloneShallow());
  },
  getColorFromPalette: function (name, scope) {
    var ecModel = this.ecModel; // PENDING

    var color = colorPaletteMixin.getColorFromPalette.call(this, name, scope);

    if (!color) {
      color = ecModel.getColorFromPalette(name, scope);
    }

    return color;
  },

  /**
   * Get data indices for show tooltip content. See tooltip.
   * @abstract
   * @param {Array.<string>|string} dim
   * @param {Array.<number>} value
   * @param {module:echarts/coord/single/SingleAxis} baseAxis
   * @return {Object} {dataIndices, nestestValue}.
   */
  getAxisTooltipData: null,

  /**
   * See tooltip.
   * @abstract
   * @param {number} dataIndex
   * @return {Array.<number>} Point of tooltip. null/undefined can be returned.
   */
  getTooltipPosition: null
});
zrUtil.mixin(SeriesModel, modelUtil.dataFormatMixin);
zrUtil.mixin(SeriesModel, colorPaletteMixin);
var _default = SeriesModel;
module.exports = _default;

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

var _clazz = __webpack_require__(222);

var set = _clazz.set;
var get = _clazz.get;
var _default = {
  clearColorPalette: function () {
    set(this, 'colorIdx', 0);
    set(this, 'colorNameMap', {});
  },
  getColorFromPalette: function (name, scope) {
    scope = scope || this;
    var colorIdx = get(scope, 'colorIdx') || 0;
    var colorNameMap = get(scope, 'colorNameMap') || set(scope, 'colorNameMap', {}); // Use `hasOwnProperty` to avoid conflict with Object.prototype.

    if (colorNameMap.hasOwnProperty(name)) {
      return colorNameMap[name];
    }

    var colorPalette = this.get('color', true) || [];

    if (!colorPalette.length) {
      return;
    }

    var color = colorPalette[colorIdx];

    if (name) {
      colorNameMap[name] = color;
    }

    set(scope, 'colorIdx', (colorIdx + 1) % colorPalette.length);
    return color;
  }
};
module.exports = _default;

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

var numberUtil = __webpack_require__(202);

/**
 * For testable.
 */
var roundNumber = numberUtil.round;
/**
 * @param {Array.<number>} extent Both extent[0] and extent[1] should be valid number.
 *                                Should be extent[0] < extent[1].
 * @param {number} splitNumber splitNumber should be >= 1.
 * @param {number} [minInterval]
 * @param {number} [maxInterval]
 * @return {Object} {interval, intervalPrecision, niceTickExtent}
 */

function intervalScaleNiceTicks(extent, splitNumber, minInterval, maxInterval) {
  var result = {};
  var span = extent[1] - extent[0];
  var interval = result.interval = numberUtil.nice(span / splitNumber, true);

  if (minInterval != null && interval < minInterval) {
    interval = result.interval = minInterval;
  }

  if (maxInterval != null && interval > maxInterval) {
    interval = result.interval = maxInterval;
  } // Tow more digital for tick.


  var precision = result.intervalPrecision = getIntervalPrecision(interval); // Niced extent inside original extent

  var niceTickExtent = result.niceTickExtent = [roundNumber(Math.ceil(extent[0] / interval) * interval, precision), roundNumber(Math.floor(extent[1] / interval) * interval, precision)];
  fixExtent(niceTickExtent, extent);
  return result;
}
/**
 * @param {number} interval
 * @return {number} interval precision
 */


function getIntervalPrecision(interval) {
  // Tow more digital for tick.
  return numberUtil.getPrecisionSafe(interval) + 2;
}

function clamp(niceTickExtent, idx, extent) {
  niceTickExtent[idx] = Math.max(Math.min(niceTickExtent[idx], extent[1]), extent[0]);
} // In some cases (e.g., splitNumber is 1), niceTickExtent may be out of extent.


function fixExtent(niceTickExtent, extent) {
  !isFinite(niceTickExtent[0]) && (niceTickExtent[0] = extent[0]);
  !isFinite(niceTickExtent[1]) && (niceTickExtent[1] = extent[1]);
  clamp(niceTickExtent, 0, extent);
  clamp(niceTickExtent, 1, extent);

  if (niceTickExtent[0] > niceTickExtent[1]) {
    niceTickExtent[0] = niceTickExtent[1];
  }
}

function intervalScaleGetTicks(interval, extent, niceTickExtent, intervalPrecision) {
  var ticks = []; // If interval is 0, return [];

  if (!interval) {
    return ticks;
  } // Consider this case: using dataZoom toolbox, zoom and zoom.


  var safeLimit = 10000;

  if (extent[0] < niceTickExtent[0]) {
    ticks.push(extent[0]);
  }

  var tick = niceTickExtent[0];

  while (tick <= niceTickExtent[1]) {
    ticks.push(tick); // Avoid rounding error

    tick = roundNumber(tick + interval, intervalPrecision);

    if (tick === ticks[ticks.length - 1]) {
      // Consider out of safe float point, e.g.,
      // -3711126.9907707 + 2e-10 === -3711126.9907707
      break;
    }

    if (ticks.length > safeLimit) {
      return [];
    }
  } // Consider this case: the last item of ticks is smaller
  // than niceTickExtent[1] and niceTickExtent[1] === extent[1].


  if (extent[1] > (ticks.length ? ticks[ticks.length - 1] : niceTickExtent[1])) {
    ticks.push(extent[1]);
  }

  return ticks;
}

exports.intervalScaleNiceTicks = intervalScaleNiceTicks;
exports.getIntervalPrecision = getIntervalPrecision;
exports.fixExtent = fixExtent;
exports.intervalScaleGetTicks = intervalScaleGetTicks;

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var Group = __webpack_require__(234);

var componentUtil = __webpack_require__(240);

var clazzUtil = __webpack_require__(222);

var modelUtil = __webpack_require__(201);

function Chart() {
  /**
   * @type {module:zrender/container/Group}
   * @readOnly
   */
  this.group = new Group();
  /**
   * @type {string}
   * @readOnly
   */

  this.uid = componentUtil.getUID('viewChart');
}

Chart.prototype = {
  type: 'chart',

  /**
   * Init the chart
   * @param  {module:echarts/model/Global} ecModel
   * @param  {module:echarts/ExtensionAPI} api
   */
  init: function (ecModel, api) {},

  /**
   * Render the chart
   * @param  {module:echarts/model/Series} seriesModel
   * @param  {module:echarts/model/Global} ecModel
   * @param  {module:echarts/ExtensionAPI} api
   * @param  {Object} payload
   */
  render: function (seriesModel, ecModel, api, payload) {},

  /**
   * Highlight series or specified data item
   * @param  {module:echarts/model/Series} seriesModel
   * @param  {module:echarts/model/Global} ecModel
   * @param  {module:echarts/ExtensionAPI} api
   * @param  {Object} payload
   */
  highlight: function (seriesModel, ecModel, api, payload) {
    toggleHighlight(seriesModel.getData(), payload, 'emphasis');
  },

  /**
   * Downplay series or specified data item
   * @param  {module:echarts/model/Series} seriesModel
   * @param  {module:echarts/model/Global} ecModel
   * @param  {module:echarts/ExtensionAPI} api
   * @param  {Object} payload
   */
  downplay: function (seriesModel, ecModel, api, payload) {
    toggleHighlight(seriesModel.getData(), payload, 'normal');
  },

  /**
   * Remove self
   * @param  {module:echarts/model/Global} ecModel
   * @param  {module:echarts/ExtensionAPI} api
   */
  remove: function (ecModel, api) {
    this.group.removeAll();
  },

  /**
   * Dispose self
   * @param  {module:echarts/model/Global} ecModel
   * @param  {module:echarts/ExtensionAPI} api
   */
  dispose: function () {}
  /**
   * The view contains the given point.
   * @interface
   * @param {Array.<number>} point
   * @return {boolean}
   */
  // containPoint: function () {}

};
var chartProto = Chart.prototype;

chartProto.updateView = chartProto.updateLayout = chartProto.updateVisual = function (seriesModel, ecModel, api, payload) {
  this.render(seriesModel, ecModel, api, payload);
};
/**
 * Set state of single element
 * @param  {module:zrender/Element} el
 * @param  {string} state
 */


function elSetState(el, state) {
  if (el) {
    el.trigger(state);

    if (el.type === 'group') {
      for (var i = 0; i < el.childCount(); i++) {
        elSetState(el.childAt(i), state);
      }
    }
  }
}
/**
 * @param  {module:echarts/data/List} data
 * @param  {Object} payload
 * @param  {string} state 'normal'|'emphasis'
 * @inner
 */


function toggleHighlight(data, payload, state) {
  var dataIndex = modelUtil.queryDataIndex(data, payload);

  if (dataIndex != null) {
    zrUtil.each(modelUtil.normalizeToArray(dataIndex), function (dataIdx) {
      elSetState(data.getItemGraphicEl(dataIdx), state);
    });
  } else {
    data.eachItemGraphicEl(function (el) {
      elSetState(el, state);
    });
  }
} // Enable Chart.extend.


clazzUtil.enableClassExtend(Chart, ['dispose']); // Add capability of registerClass, getClass, hasClass, registerSubTypeDefaulter and so on.

clazzUtil.enableClassManagement(Chart, {
  registerWhenExtend: true
});
var _default = Chart;
module.exports = _default;

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

var guid = __webpack_require__(263);

var Eventful = __webpack_require__(227);

var Transformable = __webpack_require__(271);

var Animatable = __webpack_require__(338);

var zrUtil = __webpack_require__(196);

/**
 * @alias module:zrender/Element
 * @constructor
 * @extends {module:zrender/mixin/Animatable}
 * @extends {module:zrender/mixin/Transformable}
 * @extends {module:zrender/mixin/Eventful}
 */
var Element = function (opts) {
  // jshint ignore:line
  Transformable.call(this, opts);
  Eventful.call(this, opts);
  Animatable.call(this, opts);
  /**
   * 画布元素ID
   * @type {string}
   */

  this.id = opts.id || guid();
};

Element.prototype = {
  /**
   * 元素类型
   * Element type
   * @type {string}
   */
  type: 'element',

  /**
   * 元素名字
   * Element name
   * @type {string}
   */
  name: '',

  /**
   * ZRender 实例对象，会在 element 添加到 zrender 实例中后自动赋值
   * ZRender instance will be assigned when element is associated with zrender
   * @name module:/zrender/Element#__zr
   * @type {module:zrender/ZRender}
   */
  __zr: null,

  /**
   * 图形是否忽略，为true时忽略图形的绘制以及事件触发
   * If ignore drawing and events of the element object
   * @name module:/zrender/Element#ignore
   * @type {boolean}
   * @default false
   */
  ignore: false,

  /**
   * 用于裁剪的路径(shape)，所有 Group 内的路径在绘制时都会被这个路径裁剪
   * 该路径会继承被裁减对象的变换
   * @type {module:zrender/graphic/Path}
   * @see http://www.w3.org/TR/2dcontext/#clipping-region
   * @readOnly
   */
  clipPath: null,

  /**
   * Drift element
   * @param  {number} dx dx on the global space
   * @param  {number} dy dy on the global space
   */
  drift: function (dx, dy) {
    switch (this.draggable) {
      case 'horizontal':
        dy = 0;
        break;

      case 'vertical':
        dx = 0;
        break;
    }

    var m = this.transform;

    if (!m) {
      m = this.transform = [1, 0, 0, 1, 0, 0];
    }

    m[4] += dx;
    m[5] += dy;
    this.decomposeTransform();
    this.dirty(false);
  },

  /**
   * Hook before update
   */
  beforeUpdate: function () {},

  /**
   * Hook after update
   */
  afterUpdate: function () {},

  /**
   * Update each frame
   */
  update: function () {
    this.updateTransform();
  },

  /**
   * @param  {Function} cb
   * @param  {}   context
   */
  traverse: function (cb, context) {},

  /**
   * @protected
   */
  attrKV: function (key, value) {
    if (key === 'position' || key === 'scale' || key === 'origin') {
      // Copy the array
      if (value) {
        var target = this[key];

        if (!target) {
          target = this[key] = [];
        }

        target[0] = value[0];
        target[1] = value[1];
      }
    } else {
      this[key] = value;
    }
  },

  /**
   * Hide the element
   */
  hide: function () {
    this.ignore = true;
    this.__zr && this.__zr.refresh();
  },

  /**
   * Show the element
   */
  show: function () {
    this.ignore = false;
    this.__zr && this.__zr.refresh();
  },

  /**
   * @param {string|Object} key
   * @param {*} value
   */
  attr: function (key, value) {
    if (typeof key === 'string') {
      this.attrKV(key, value);
    } else if (zrUtil.isObject(key)) {
      for (var name in key) {
        if (key.hasOwnProperty(name)) {
          this.attrKV(name, key[name]);
        }
      }
    }

    this.dirty(false);
    return this;
  },

  /**
   * @param {module:zrender/graphic/Path} clipPath
   */
  setClipPath: function (clipPath) {
    var zr = this.__zr;

    if (zr) {
      clipPath.addSelfToZr(zr);
    } // Remove previous clip path


    if (this.clipPath && this.clipPath !== clipPath) {
      this.removeClipPath();
    }

    this.clipPath = clipPath;
    clipPath.__zr = zr;
    clipPath.__clipTarget = this;
    this.dirty(false);
  },

  /**
   */
  removeClipPath: function () {
    var clipPath = this.clipPath;

    if (clipPath) {
      if (clipPath.__zr) {
        clipPath.removeSelfFromZr(clipPath.__zr);
      }

      clipPath.__zr = null;
      clipPath.__clipTarget = null;
      this.clipPath = null;
      this.dirty(false);
    }
  },

  /**
   * Add self from zrender instance.
   * Not recursively because it will be invoked when element added to storage.
   * @param {module:zrender/ZRender} zr
   */
  addSelfToZr: function (zr) {
    this.__zr = zr; // 添加动画

    var animators = this.animators;

    if (animators) {
      for (var i = 0; i < animators.length; i++) {
        zr.animation.addAnimator(animators[i]);
      }
    }

    if (this.clipPath) {
      this.clipPath.addSelfToZr(zr);
    }
  },

  /**
   * Remove self from zrender instance.
   * Not recursively because it will be invoked when element added to storage.
   * @param {module:zrender/ZRender} zr
   */
  removeSelfFromZr: function (zr) {
    this.__zr = null; // 移除动画

    var animators = this.animators;

    if (animators) {
      for (var i = 0; i < animators.length; i++) {
        zr.animation.removeAnimator(animators[i]);
      }
    }

    if (this.clipPath) {
      this.clipPath.removeSelfFromZr(zr);
    }
  }
};
zrUtil.mixin(Element, Animatable);
zrUtil.mixin(Element, Transformable);
zrUtil.mixin(Element, Eventful);
var _default = Element;
module.exports = _default;

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

var Clip = __webpack_require__(312);

var color = __webpack_require__(231);

var _util = __webpack_require__(196);

var isArrayLike = _util.isArrayLike;

/**
 * @module echarts/animation/Animator
 */
var arraySlice = Array.prototype.slice;

function defaultGetter(target, key) {
  return target[key];
}

function defaultSetter(target, key, value) {
  target[key] = value;
}
/**
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} percent
 * @return {number}
 */


function interpolateNumber(p0, p1, percent) {
  return (p1 - p0) * percent + p0;
}
/**
 * @param  {string} p0
 * @param  {string} p1
 * @param  {number} percent
 * @return {string}
 */


function interpolateString(p0, p1, percent) {
  return percent > 0.5 ? p1 : p0;
}
/**
 * @param  {Array} p0
 * @param  {Array} p1
 * @param  {number} percent
 * @param  {Array} out
 * @param  {number} arrDim
 */


function interpolateArray(p0, p1, percent, out, arrDim) {
  var len = p0.length;

  if (arrDim == 1) {
    for (var i = 0; i < len; i++) {
      out[i] = interpolateNumber(p0[i], p1[i], percent);
    }
  } else {
    var len2 = len && p0[0].length;

    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len2; j++) {
        out[i][j] = interpolateNumber(p0[i][j], p1[i][j], percent);
      }
    }
  }
} // arr0 is source array, arr1 is target array.
// Do some preprocess to avoid error happened when interpolating from arr0 to arr1


function fillArr(arr0, arr1, arrDim) {
  var arr0Len = arr0.length;
  var arr1Len = arr1.length;

  if (arr0Len !== arr1Len) {
    // FIXME Not work for TypedArray
    var isPreviousLarger = arr0Len > arr1Len;

    if (isPreviousLarger) {
      // Cut the previous
      arr0.length = arr1Len;
    } else {
      // Fill the previous
      for (var i = arr0Len; i < arr1Len; i++) {
        arr0.push(arrDim === 1 ? arr1[i] : arraySlice.call(arr1[i]));
      }
    }
  } // Handling NaN value


  var len2 = arr0[0] && arr0[0].length;

  for (var i = 0; i < arr0.length; i++) {
    if (arrDim === 1) {
      if (isNaN(arr0[i])) {
        arr0[i] = arr1[i];
      }
    } else {
      for (var j = 0; j < len2; j++) {
        if (isNaN(arr0[i][j])) {
          arr0[i][j] = arr1[i][j];
        }
      }
    }
  }
}
/**
 * @param  {Array} arr0
 * @param  {Array} arr1
 * @param  {number} arrDim
 * @return {boolean}
 */


function isArraySame(arr0, arr1, arrDim) {
  if (arr0 === arr1) {
    return true;
  }

  var len = arr0.length;

  if (len !== arr1.length) {
    return false;
  }

  if (arrDim === 1) {
    for (var i = 0; i < len; i++) {
      if (arr0[i] !== arr1[i]) {
        return false;
      }
    }
  } else {
    var len2 = arr0[0].length;

    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len2; j++) {
        if (arr0[i][j] !== arr1[i][j]) {
          return false;
        }
      }
    }
  }

  return true;
}
/**
 * Catmull Rom interpolate array
 * @param  {Array} p0
 * @param  {Array} p1
 * @param  {Array} p2
 * @param  {Array} p3
 * @param  {number} t
 * @param  {number} t2
 * @param  {number} t3
 * @param  {Array} out
 * @param  {number} arrDim
 */


function catmullRomInterpolateArray(p0, p1, p2, p3, t, t2, t3, out, arrDim) {
  var len = p0.length;

  if (arrDim == 1) {
    for (var i = 0; i < len; i++) {
      out[i] = catmullRomInterpolate(p0[i], p1[i], p2[i], p3[i], t, t2, t3);
    }
  } else {
    var len2 = p0[0].length;

    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len2; j++) {
        out[i][j] = catmullRomInterpolate(p0[i][j], p1[i][j], p2[i][j], p3[i][j], t, t2, t3);
      }
    }
  }
}
/**
 * Catmull Rom interpolate number
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} t
 * @param  {number} t2
 * @param  {number} t3
 * @return {number}
 */


function catmullRomInterpolate(p0, p1, p2, p3, t, t2, t3) {
  var v0 = (p2 - p0) * 0.5;
  var v1 = (p3 - p1) * 0.5;
  return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
}

function cloneValue(value) {
  if (isArrayLike(value)) {
    var len = value.length;

    if (isArrayLike(value[0])) {
      var ret = [];

      for (var i = 0; i < len; i++) {
        ret.push(arraySlice.call(value[i]));
      }

      return ret;
    }

    return arraySlice.call(value);
  }

  return value;
}

function rgba2String(rgba) {
  rgba[0] = Math.floor(rgba[0]);
  rgba[1] = Math.floor(rgba[1]);
  rgba[2] = Math.floor(rgba[2]);
  return 'rgba(' + rgba.join(',') + ')';
}

function getArrayDim(keyframes) {
  var lastValue = keyframes[keyframes.length - 1].value;
  return isArrayLike(lastValue && lastValue[0]) ? 2 : 1;
}

function createTrackClip(animator, easing, oneTrackDone, keyframes, propName, forceAnimate) {
  var getter = animator._getter;
  var setter = animator._setter;
  var useSpline = easing === 'spline';
  var trackLen = keyframes.length;

  if (!trackLen) {
    return;
  } // Guess data type


  var firstVal = keyframes[0].value;
  var isValueArray = isArrayLike(firstVal);
  var isValueColor = false;
  var isValueString = false; // For vertices morphing

  var arrDim = isValueArray ? getArrayDim(keyframes) : 0;
  var trackMaxTime; // Sort keyframe as ascending

  keyframes.sort(function (a, b) {
    return a.time - b.time;
  });
  trackMaxTime = keyframes[trackLen - 1].time; // Percents of each keyframe

  var kfPercents = []; // Value of each keyframe

  var kfValues = [];
  var prevValue = keyframes[0].value;
  var isAllValueEqual = true;

  for (var i = 0; i < trackLen; i++) {
    kfPercents.push(keyframes[i].time / trackMaxTime); // Assume value is a color when it is a string

    var value = keyframes[i].value; // Check if value is equal, deep check if value is array

    if (!(isValueArray && isArraySame(value, prevValue, arrDim) || !isValueArray && value === prevValue)) {
      isAllValueEqual = false;
    }

    prevValue = value; // Try converting a string to a color array

    if (typeof value == 'string') {
      var colorArray = color.parse(value);

      if (colorArray) {
        value = colorArray;
        isValueColor = true;
      } else {
        isValueString = true;
      }
    }

    kfValues.push(value);
  }

  if (!forceAnimate && isAllValueEqual) {
    return;
  }

  var lastValue = kfValues[trackLen - 1]; // Polyfill array and NaN value

  for (var i = 0; i < trackLen - 1; i++) {
    if (isValueArray) {
      fillArr(kfValues[i], lastValue, arrDim);
    } else {
      if (isNaN(kfValues[i]) && !isNaN(lastValue) && !isValueString && !isValueColor) {
        kfValues[i] = lastValue;
      }
    }
  }

  isValueArray && fillArr(getter(animator._target, propName), lastValue, arrDim); // Cache the key of last frame to speed up when
  // animation playback is sequency

  var lastFrame = 0;
  var lastFramePercent = 0;
  var start;
  var w;
  var p0;
  var p1;
  var p2;
  var p3;

  if (isValueColor) {
    var rgba = [0, 0, 0, 0];
  }

  var onframe = function (target, percent) {
    // Find the range keyframes
    // kf1-----kf2---------current--------kf3
    // find kf2 and kf3 and do interpolation
    var frame; // In the easing function like elasticOut, percent may less than 0

    if (percent < 0) {
      frame = 0;
    } else if (percent < lastFramePercent) {
      // Start from next key
      // PENDING start from lastFrame ?
      start = Math.min(lastFrame + 1, trackLen - 1);

      for (frame = start; frame >= 0; frame--) {
        if (kfPercents[frame] <= percent) {
          break;
        }
      } // PENDING really need to do this ?


      frame = Math.min(frame, trackLen - 2);
    } else {
      for (frame = lastFrame; frame < trackLen; frame++) {
        if (kfPercents[frame] > percent) {
          break;
        }
      }

      frame = Math.min(frame - 1, trackLen - 2);
    }

    lastFrame = frame;
    lastFramePercent = percent;
    var range = kfPercents[frame + 1] - kfPercents[frame];

    if (range === 0) {
      return;
    } else {
      w = (percent - kfPercents[frame]) / range;
    }

    if (useSpline) {
      p1 = kfValues[frame];
      p0 = kfValues[frame === 0 ? frame : frame - 1];
      p2 = kfValues[frame > trackLen - 2 ? trackLen - 1 : frame + 1];
      p3 = kfValues[frame > trackLen - 3 ? trackLen - 1 : frame + 2];

      if (isValueArray) {
        catmullRomInterpolateArray(p0, p1, p2, p3, w, w * w, w * w * w, getter(target, propName), arrDim);
      } else {
        var value;

        if (isValueColor) {
          value = catmullRomInterpolateArray(p0, p1, p2, p3, w, w * w, w * w * w, rgba, 1);
          value = rgba2String(rgba);
        } else if (isValueString) {
          // String is step(0.5)
          return interpolateString(p1, p2, w);
        } else {
          value = catmullRomInterpolate(p0, p1, p2, p3, w, w * w, w * w * w);
        }

        setter(target, propName, value);
      }
    } else {
      if (isValueArray) {
        interpolateArray(kfValues[frame], kfValues[frame + 1], w, getter(target, propName), arrDim);
      } else {
        var value;

        if (isValueColor) {
          interpolateArray(kfValues[frame], kfValues[frame + 1], w, rgba, 1);
          value = rgba2String(rgba);
        } else if (isValueString) {
          // String is step(0.5)
          return interpolateString(kfValues[frame], kfValues[frame + 1], w);
        } else {
          value = interpolateNumber(kfValues[frame], kfValues[frame + 1], w);
        }

        setter(target, propName, value);
      }
    }
  };

  var clip = new Clip({
    target: animator._target,
    life: trackMaxTime,
    loop: animator._loop,
    delay: animator._delay,
    onframe: onframe,
    ondestroy: oneTrackDone
  });

  if (easing && easing !== 'spline') {
    clip.easing = easing;
  }

  return clip;
}
/**
 * @alias module:zrender/animation/Animator
 * @constructor
 * @param {Object} target
 * @param {boolean} loop
 * @param {Function} getter
 * @param {Function} setter
 */


var Animator = function (target, loop, getter, setter) {
  this._tracks = {};
  this._target = target;
  this._loop = loop || false;
  this._getter = getter || defaultGetter;
  this._setter = setter || defaultSetter;
  this._clipCount = 0;
  this._delay = 0;
  this._doneList = [];
  this._onframeList = [];
  this._clipList = [];
};

Animator.prototype = {
  /**
   * 设置动画关键帧
   * @param  {number} time 关键帧时间，单位是ms
   * @param  {Object} props 关键帧的属性值，key-value表示
   * @return {module:zrender/animation/Animator}
   */
  when: function (time
  /* ms */
  , props) {
    var tracks = this._tracks;

    for (var propName in props) {
      if (!props.hasOwnProperty(propName)) {
        continue;
      }

      if (!tracks[propName]) {
        tracks[propName] = []; // Invalid value

        var value = this._getter(this._target, propName);

        if (value == null) {
          // zrLog('Invalid property ' + propName);
          continue;
        } // If time is 0
        //  Then props is given initialize value
        // Else
        //  Initialize value from current prop value


        if (time !== 0) {
          tracks[propName].push({
            time: 0,
            value: cloneValue(value)
          });
        }
      }

      tracks[propName].push({
        time: time,
        value: props[propName]
      });
    }

    return this;
  },

  /**
   * 添加动画每一帧的回调函数
   * @param  {Function} callback
   * @return {module:zrender/animation/Animator}
   */
  during: function (callback) {
    this._onframeList.push(callback);

    return this;
  },
  pause: function () {
    for (var i = 0; i < this._clipList.length; i++) {
      this._clipList[i].pause();
    }

    this._paused = true;
  },
  resume: function () {
    for (var i = 0; i < this._clipList.length; i++) {
      this._clipList[i].resume();
    }

    this._paused = false;
  },
  isPaused: function () {
    return !!this._paused;
  },
  _doneCallback: function () {
    // Clear all tracks
    this._tracks = {}; // Clear all clips

    this._clipList.length = 0;
    var doneList = this._doneList;
    var len = doneList.length;

    for (var i = 0; i < len; i++) {
      doneList[i].call(this);
    }
  },

  /**
   * 开始执行动画
   * @param  {string|Function} [easing]
   *         动画缓动函数，详见{@link module:zrender/animation/easing}
   * @param  {boolean} forceAnimate
   * @return {module:zrender/animation/Animator}
   */
  start: function (easing, forceAnimate) {
    var self = this;
    var clipCount = 0;

    var oneTrackDone = function () {
      clipCount--;

      if (!clipCount) {
        self._doneCallback();
      }
    };

    var lastClip;

    for (var propName in this._tracks) {
      if (!this._tracks.hasOwnProperty(propName)) {
        continue;
      }

      var clip = createTrackClip(this, easing, oneTrackDone, this._tracks[propName], propName, forceAnimate);

      if (clip) {
        this._clipList.push(clip);

        clipCount++; // If start after added to animation

        if (this.animation) {
          this.animation.addClip(clip);
        }

        lastClip = clip;
      }
    } // Add during callback on the last clip


    if (lastClip) {
      var oldOnFrame = lastClip.onframe;

      lastClip.onframe = function (target, percent) {
        oldOnFrame(target, percent);

        for (var i = 0; i < self._onframeList.length; i++) {
          self._onframeList[i](target, percent);
        }
      };
    } // This optimization will help the case that in the upper application
    // the view may be refreshed frequently, where animation will be
    // called repeatly but nothing changed.


    if (!clipCount) {
      this._doneCallback();
    }

    return this;
  },

  /**
   * 停止动画
   * @param {boolean} forwardToLast If move to last frame before stop
   */
  stop: function (forwardToLast) {
    var clipList = this._clipList;
    var animation = this.animation;

    for (var i = 0; i < clipList.length; i++) {
      var clip = clipList[i];

      if (forwardToLast) {
        // Move to last frame before stop
        clip.onframe(this._target, 1);
      }

      animation && animation.removeClip(clip);
    }

    clipList.length = 0;
  },

  /**
   * 设置动画延迟开始的时间
   * @param  {number} time 单位ms
   * @return {module:zrender/animation/Animator}
   */
  delay: function (time) {
    this._delay = time;
    return this;
  },

  /**
   * 添加动画结束的回调
   * @param  {Function} cb
   * @return {module:zrender/animation/Animator}
   */
  done: function (cb) {
    if (cb) {
      this._doneList.push(cb);
    }

    return this;
  },

  /**
   * @return {Array.<module:zrender/animation/Clip>}
   */
  getClips: function () {
    return this._clipList;
  }
};
var _default = Animator;
module.exports = _default;

/***/ }),
/* 258 */
/***/ (function(module, exports) {

var _default = typeof window !== 'undefined' && (window.requestAnimationFrame && window.requestAnimationFrame.bind(window) || // https://github.com/ecomfe/zrender/issues/189#issuecomment-224919809
window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window) || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame) || function (func) {
  setTimeout(func, 16);
};

module.exports = _default;

/***/ }),
/* 259 */
/***/ (function(module, exports) {

var PI2 = Math.PI * 2;

function normalizeRadian(angle) {
  angle %= PI2;

  if (angle < 0) {
    angle += PI2;
  }

  return angle;
}

exports.normalizeRadian = normalizeRadian;

/***/ }),
/* 260 */
/***/ (function(module, exports) {

function windingLine(x0, y0, x1, y1, x, y) {
  if (y > y0 && y > y1 || y < y0 && y < y1) {
    return 0;
  } // Ignore horizontal line


  if (y1 === y0) {
    return 0;
  }

  var dir = y1 < y0 ? 1 : -1;
  var t = (y - y0) / (y1 - y0); // Avoid winding error when intersection point is the connect point of two line of polygon

  if (t === 1 || t === 0) {
    dir = y1 < y0 ? 0.5 : -0.5;
  }

  var x_ = t * (x1 - x0) + x0;
  return x_ > x ? dir : 0;
}

module.exports = windingLine;

/***/ }),
/* 261 */
/***/ (function(module, exports) {

// Simple LRU cache use doubly linked list
// @module zrender/core/LRU

/**
 * Simple double linked list. Compared with array, it has O(1) remove operation.
 * @constructor
 */
var LinkedList = function () {
  /**
   * @type {module:zrender/core/LRU~Entry}
   */
  this.head = null;
  /**
   * @type {module:zrender/core/LRU~Entry}
   */

  this.tail = null;
  this._len = 0;
};

var linkedListProto = LinkedList.prototype;
/**
 * Insert a new value at the tail
 * @param  {} val
 * @return {module:zrender/core/LRU~Entry}
 */

linkedListProto.insert = function (val) {
  var entry = new Entry(val);
  this.insertEntry(entry);
  return entry;
};
/**
 * Insert an entry at the tail
 * @param  {module:zrender/core/LRU~Entry} entry
 */


linkedListProto.insertEntry = function (entry) {
  if (!this.head) {
    this.head = this.tail = entry;
  } else {
    this.tail.next = entry;
    entry.prev = this.tail;
    entry.next = null;
    this.tail = entry;
  }

  this._len++;
};
/**
 * Remove entry.
 * @param  {module:zrender/core/LRU~Entry} entry
 */


linkedListProto.remove = function (entry) {
  var prev = entry.prev;
  var next = entry.next;

  if (prev) {
    prev.next = next;
  } else {
    // Is head
    this.head = next;
  }

  if (next) {
    next.prev = prev;
  } else {
    // Is tail
    this.tail = prev;
  }

  entry.next = entry.prev = null;
  this._len--;
};
/**
 * @return {number}
 */


linkedListProto.len = function () {
  return this._len;
};
/**
 * Clear list
 */


linkedListProto.clear = function () {
  this.head = this.tail = null;
  this._len = 0;
};
/**
 * @constructor
 * @param {} val
 */


var Entry = function (val) {
  /**
   * @type {}
   */
  this.value = val;
  /**
   * @type {module:zrender/core/LRU~Entry}
   */

  this.next;
  /**
   * @type {module:zrender/core/LRU~Entry}
   */

  this.prev;
};
/**
 * LRU Cache
 * @constructor
 * @alias module:zrender/core/LRU
 */


var LRU = function (maxSize) {
  this._list = new LinkedList();
  this._map = {};
  this._maxSize = maxSize || 10;
  this._lastRemovedEntry = null;
};

var LRUProto = LRU.prototype;
/**
 * @param  {string} key
 * @param  {} value
 * @return {} Removed value
 */

LRUProto.put = function (key, value) {
  var list = this._list;
  var map = this._map;
  var removed = null;

  if (map[key] == null) {
    var len = list.len(); // Reuse last removed entry

    var entry = this._lastRemovedEntry;

    if (len >= this._maxSize && len > 0) {
      // Remove the least recently used
      var leastUsedEntry = list.head;
      list.remove(leastUsedEntry);
      delete map[leastUsedEntry.key];
      removed = leastUsedEntry.value;
      this._lastRemovedEntry = leastUsedEntry;
    }

    if (entry) {
      entry.value = value;
    } else {
      entry = new Entry(value);
    }

    entry.key = key;
    list.insertEntry(entry);
    map[key] = entry;
  }

  return removed;
};
/**
 * @param  {string} key
 * @return {}
 */


LRUProto.get = function (key) {
  var entry = this._map[key];
  var list = this._list;

  if (entry != null) {
    // Put the latest used entry in the tail
    if (entry !== list.tail) {
      list.remove(entry);
      list.insertEntry(entry);
    }

    return entry.value;
  }
};
/**
 * Clear the cache
 */


LRUProto.clear = function () {
  this._list.clear();

  this._map = {};
};

var _default = LRU;
module.exports = _default;

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

var vec2 = __webpack_require__(203);

var curve = __webpack_require__(226);

/**
 * @author Yi Shen(https://github.com/pissang)
 */
var mathMin = Math.min;
var mathMax = Math.max;
var mathSin = Math.sin;
var mathCos = Math.cos;
var PI2 = Math.PI * 2;
var start = vec2.create();
var end = vec2.create();
var extremity = vec2.create();
/**
 * 从顶点数组中计算出最小包围盒，写入`min`和`max`中
 * @module zrender/core/bbox
 * @param {Array<Object>} points 顶点数组
 * @param {number} min
 * @param {number} max
 */

function fromPoints(points, min, max) {
  if (points.length === 0) {
    return;
  }

  var p = points[0];
  var left = p[0];
  var right = p[0];
  var top = p[1];
  var bottom = p[1];
  var i;

  for (i = 1; i < points.length; i++) {
    p = points[i];
    left = mathMin(left, p[0]);
    right = mathMax(right, p[0]);
    top = mathMin(top, p[1]);
    bottom = mathMax(bottom, p[1]);
  }

  min[0] = left;
  min[1] = top;
  max[0] = right;
  max[1] = bottom;
}
/**
 * @memberOf module:zrender/core/bbox
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {Array.<number>} min
 * @param {Array.<number>} max
 */


function fromLine(x0, y0, x1, y1, min, max) {
  min[0] = mathMin(x0, x1);
  min[1] = mathMin(y0, y1);
  max[0] = mathMax(x0, x1);
  max[1] = mathMax(y0, y1);
}

var xDim = [];
var yDim = [];
/**
 * 从三阶贝塞尔曲线(p0, p1, p2, p3)中计算出最小包围盒，写入`min`和`max`中
 * @memberOf module:zrender/core/bbox
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @param {Array.<number>} min
 * @param {Array.<number>} max
 */

function fromCubic(x0, y0, x1, y1, x2, y2, x3, y3, min, max) {
  var cubicExtrema = curve.cubicExtrema;
  var cubicAt = curve.cubicAt;
  var i;
  var n = cubicExtrema(x0, x1, x2, x3, xDim);
  min[0] = Infinity;
  min[1] = Infinity;
  max[0] = -Infinity;
  max[1] = -Infinity;

  for (i = 0; i < n; i++) {
    var x = cubicAt(x0, x1, x2, x3, xDim[i]);
    min[0] = mathMin(x, min[0]);
    max[0] = mathMax(x, max[0]);
  }

  n = cubicExtrema(y0, y1, y2, y3, yDim);

  for (i = 0; i < n; i++) {
    var y = cubicAt(y0, y1, y2, y3, yDim[i]);
    min[1] = mathMin(y, min[1]);
    max[1] = mathMax(y, max[1]);
  }

  min[0] = mathMin(x0, min[0]);
  max[0] = mathMax(x0, max[0]);
  min[0] = mathMin(x3, min[0]);
  max[0] = mathMax(x3, max[0]);
  min[1] = mathMin(y0, min[1]);
  max[1] = mathMax(y0, max[1]);
  min[1] = mathMin(y3, min[1]);
  max[1] = mathMax(y3, max[1]);
}
/**
 * 从二阶贝塞尔曲线(p0, p1, p2)中计算出最小包围盒，写入`min`和`max`中
 * @memberOf module:zrender/core/bbox
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {Array.<number>} min
 * @param {Array.<number>} max
 */


function fromQuadratic(x0, y0, x1, y1, x2, y2, min, max) {
  var quadraticExtremum = curve.quadraticExtremum;
  var quadraticAt = curve.quadraticAt; // Find extremities, where derivative in x dim or y dim is zero

  var tx = mathMax(mathMin(quadraticExtremum(x0, x1, x2), 1), 0);
  var ty = mathMax(mathMin(quadraticExtremum(y0, y1, y2), 1), 0);
  var x = quadraticAt(x0, x1, x2, tx);
  var y = quadraticAt(y0, y1, y2, ty);
  min[0] = mathMin(x0, x2, x);
  min[1] = mathMin(y0, y2, y);
  max[0] = mathMax(x0, x2, x);
  max[1] = mathMax(y0, y2, y);
}
/**
 * 从圆弧中计算出最小包围盒，写入`min`和`max`中
 * @method
 * @memberOf module:zrender/core/bbox
 * @param {number} x
 * @param {number} y
 * @param {number} rx
 * @param {number} ry
 * @param {number} startAngle
 * @param {number} endAngle
 * @param {number} anticlockwise
 * @param {Array.<number>} min
 * @param {Array.<number>} max
 */


function fromArc(x, y, rx, ry, startAngle, endAngle, anticlockwise, min, max) {
  var vec2Min = vec2.min;
  var vec2Max = vec2.max;
  var diff = Math.abs(startAngle - endAngle);

  if (diff % PI2 < 1e-4 && diff > 1e-4) {
    // Is a circle
    min[0] = x - rx;
    min[1] = y - ry;
    max[0] = x + rx;
    max[1] = y + ry;
    return;
  }

  start[0] = mathCos(startAngle) * rx + x;
  start[1] = mathSin(startAngle) * ry + y;
  end[0] = mathCos(endAngle) * rx + x;
  end[1] = mathSin(endAngle) * ry + y;
  vec2Min(min, start, end);
  vec2Max(max, start, end); // Thresh to [0, Math.PI * 2]

  startAngle = startAngle % PI2;

  if (startAngle < 0) {
    startAngle = startAngle + PI2;
  }

  endAngle = endAngle % PI2;

  if (endAngle < 0) {
    endAngle = endAngle + PI2;
  }

  if (startAngle > endAngle && !anticlockwise) {
    endAngle += PI2;
  } else if (startAngle < endAngle && anticlockwise) {
    startAngle += PI2;
  }

  if (anticlockwise) {
    var tmp = endAngle;
    endAngle = startAngle;
    startAngle = tmp;
  } // var number = 0;
  // var step = (anticlockwise ? -Math.PI : Math.PI) / 2;


  for (var angle = 0; angle < endAngle; angle += Math.PI / 2) {
    if (angle > startAngle) {
      extremity[0] = mathCos(angle) * rx + x;
      extremity[1] = mathSin(angle) * ry + y;
      vec2Min(min, extremity, min);
      vec2Max(max, extremity, max);
    }
  }
}

exports.fromPoints = fromPoints;
exports.fromLine = fromLine;
exports.fromCubic = fromCubic;
exports.fromQuadratic = fromQuadratic;
exports.fromArc = fromArc;

/***/ }),
/* 263 */
/***/ (function(module, exports) {

/**
 * zrender: 生成唯一id
 *
 * @author errorrik (errorrik@gmail.com)
 */
var idStart = 0x0907;

function _default() {
  return idStart++;
}

module.exports = _default;

/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

var _config = __webpack_require__(233);

var debugMode = _config.debugMode;

var log = function () {};

if (debugMode === 1) {
  log = function () {
    for (var k in arguments) {
      throw new Error(arguments[k]);
    }
  };
} else if (debugMode > 1) {
  log = function () {
    for (var k in arguments) {
      console.log(arguments[k]);
    }
  };
}

var _default = log;
module.exports = _default;

/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

var Displayable = __webpack_require__(243);

var BoundingRect = __webpack_require__(214);

var zrUtil = __webpack_require__(196);

var imageHelper = __webpack_require__(245);

/**
 * @alias zrender/graphic/Image
 * @extends module:zrender/graphic/Displayable
 * @constructor
 * @param {Object} opts
 */
function ZImage(opts) {
  Displayable.call(this, opts);
}

ZImage.prototype = {
  constructor: ZImage,
  type: 'image',
  brush: function (ctx, prevEl) {
    var style = this.style;
    var src = style.image; // Must bind each time

    style.bind(ctx, this, prevEl);
    var image = this._image = imageHelper.createOrUpdateImage(src, this._image, this, this.onload);

    if (!image || !imageHelper.isImageReady(image)) {
      return;
    } // 图片已经加载完成
    // if (image.nodeName.toUpperCase() == 'IMG') {
    //     if (!image.complete) {
    //         return;
    //     }
    // }
    // Else is canvas


    var x = style.x || 0;
    var y = style.y || 0;
    var width = style.width;
    var height = style.height;
    var aspect = image.width / image.height;

    if (width == null && height != null) {
      // Keep image/height ratio
      width = height * aspect;
    } else if (height == null && width != null) {
      height = width / aspect;
    } else if (width == null && height == null) {
      width = image.width;
      height = image.height;
    } // 设置transform


    this.setTransform(ctx);

    if (style.sWidth && style.sHeight) {
      var sx = style.sx || 0;
      var sy = style.sy || 0;
      ctx.drawImage(image, sx, sy, style.sWidth, style.sHeight, x, y, width, height);
    } else if (style.sx && style.sy) {
      var sx = style.sx;
      var sy = style.sy;
      var sWidth = width - sx;
      var sHeight = height - sy;
      ctx.drawImage(image, sx, sy, sWidth, sHeight, x, y, width, height);
    } else {
      ctx.drawImage(image, x, y, width, height);
    }

    this.restoreTransform(ctx); // Draw rect text

    if (style.text != null) {
      this.drawRectText(ctx, this.getBoundingRect());
    }
  },
  getBoundingRect: function () {
    var style = this.style;

    if (!this._rect) {
      this._rect = new BoundingRect(style.x || 0, style.y || 0, style.width || 0, style.height || 0);
    }

    return this._rect;
  }
};
zrUtil.inherits(ZImage, Displayable);
var _default = ZImage;
module.exports = _default;

/***/ }),
/* 266 */
/***/ (function(module, exports) {

var Pattern = function (image, repeat) {
  // Should do nothing more in this constructor. Because gradient can be
  // declard by `color: {image: ...}`, where this constructor will not be called.
  this.image = image;
  this.repeat = repeat; // Can be cloned

  this.type = 'pattern';
};

Pattern.prototype.getCanvasPattern = function (ctx) {
  return ctx.createPattern(this.image, this.repeat || 'repeat');
};

var _default = Pattern;
module.exports = _default;

/***/ }),
/* 267 */
/***/ (function(module, exports) {

var STYLE_COMMON_PROPS = [['shadowBlur', 0], ['shadowOffsetX', 0], ['shadowOffsetY', 0], ['shadowColor', '#000'], ['lineCap', 'butt'], ['lineJoin', 'miter'], ['miterLimit', 10]]; // var SHADOW_PROPS = STYLE_COMMON_PROPS.slice(0, 4);
// var LINE_PROPS = STYLE_COMMON_PROPS.slice(4);

var Style = function (opts, host) {
  this.extendFrom(opts, false);
  this.host = host;
};

function createLinearGradient(ctx, obj, rect) {
  var x = obj.x == null ? 0 : obj.x;
  var x2 = obj.x2 == null ? 1 : obj.x2;
  var y = obj.y == null ? 0 : obj.y;
  var y2 = obj.y2 == null ? 0 : obj.y2;

  if (!obj.global) {
    x = x * rect.width + rect.x;
    x2 = x2 * rect.width + rect.x;
    y = y * rect.height + rect.y;
    y2 = y2 * rect.height + rect.y;
  }

  var canvasGradient = ctx.createLinearGradient(x, y, x2, y2);
  return canvasGradient;
}

function createRadialGradient(ctx, obj, rect) {
  var width = rect.width;
  var height = rect.height;
  var min = Math.min(width, height);
  var x = obj.x == null ? 0.5 : obj.x;
  var y = obj.y == null ? 0.5 : obj.y;
  var r = obj.r == null ? 0.5 : obj.r;

  if (!obj.global) {
    x = x * width + rect.x;
    y = y * height + rect.y;
    r = r * min;
  }

  var canvasGradient = ctx.createRadialGradient(x, y, 0, x, y, r);
  return canvasGradient;
}

Style.prototype = {
  constructor: Style,

  /**
   * @type {module:zrender/graphic/Displayable}
   */
  host: null,

  /**
   * @type {string}
   */
  fill: '#000',

  /**
   * @type {string}
   */
  stroke: null,

  /**
   * @type {number}
   */
  opacity: 1,

  /**
   * @type {Array.<number>}
   */
  lineDash: null,

  /**
   * @type {number}
   */
  lineDashOffset: 0,

  /**
   * @type {number}
   */
  shadowBlur: 0,

  /**
   * @type {number}
   */
  shadowOffsetX: 0,

  /**
   * @type {number}
   */
  shadowOffsetY: 0,

  /**
   * @type {number}
   */
  lineWidth: 1,

  /**
   * If stroke ignore scale
   * @type {Boolean}
   */
  strokeNoScale: false,
  // Bounding rect text configuration
  // Not affected by element transform

  /**
   * @type {string}
   */
  text: null,

  /**
   * If `fontSize` or `fontFamily` exists, `font` will be reset by
   * `fontSize`, `fontStyle`, `fontWeight`, `fontFamily`.
   * So do not visit it directly in upper application (like echarts),
   * but use `contain/text#makeFont` instead.
   * @type {string}
   */
  font: null,

  /**
   * The same as font. Use font please.
   * @deprecated
   * @type {string}
   */
  textFont: null,

  /**
   * It helps merging respectively, rather than parsing an entire font string.
   * @type {string}
   */
  fontStyle: null,

  /**
   * It helps merging respectively, rather than parsing an entire font string.
   * @type {string}
   */
  fontWeight: null,

  /**
   * It helps merging respectively, rather than parsing an entire font string.
   * Should be 12 but not '12px'.
   * @type {number}
   */
  fontSize: null,

  /**
   * It helps merging respectively, rather than parsing an entire font string.
   * @type {string}
   */
  fontFamily: null,

  /**
   * Reserved for special functinality, like 'hr'.
   * @type {string}
   */
  textTag: null,

  /**
   * @type {string}
   */
  textFill: '#000',

  /**
   * @type {string}
   */
  textStroke: null,

  /**
   * @type {number}
   */
  textWidth: null,

  /**
   * Only for textBackground.
   * @type {number}
   */
  textHeight: null,

  /**
   * textStroke may be set as some color as a default
   * value in upper applicaion, where the default value
   * of textStrokeWidth should be 0 to make sure that
   * user can choose to do not use text stroke.
   * @type {number}
   */
  textStrokeWidth: 0,

  /**
   * @type {number}
   */
  textLineHeight: null,

  /**
   * 'inside', 'left', 'right', 'top', 'bottom'
   * [x, y]
   * Based on x, y of rect.
   * @type {string|Array.<number>}
   * @default 'inside'
   */
  textPosition: 'inside',

  /**
   * If not specified, use the boundingRect of a `displayable`.
   * @type {Object}
   */
  textRect: null,

  /**
   * [x, y]
   * @type {Array.<number>}
   */
  textOffset: null,

  /**
   * @type {string}
   */
  textAlign: null,

  /**
   * @type {string}
   */
  textVerticalAlign: null,

  /**
   * @type {number}
   */
  textDistance: 5,

  /**
   * @type {string}
   */
  textShadowColor: 'transparent',

  /**
   * @type {number}
   */
  textShadowBlur: 0,

  /**
   * @type {number}
   */
  textShadowOffsetX: 0,

  /**
   * @type {number}
   */
  textShadowOffsetY: 0,

  /**
   * @type {string}
   */
  textBoxShadowColor: 'transparent',

  /**
   * @type {number}
   */
  textBoxShadowBlur: 0,

  /**
   * @type {number}
   */
  textBoxShadowOffsetX: 0,

  /**
   * @type {number}
   */
  textBoxShadowOffsetY: 0,

  /**
   * Whether transform text.
   * Only useful in Path and Image element
   * @type {boolean}
   */
  transformText: false,

  /**
   * Text rotate around position of Path or Image
   * Only useful in Path and Image element and transformText is false.
   */
  textRotation: 0,

  /**
   * Text origin of text rotation, like [10, 40].
   * Based on x, y of rect.
   * Useful in label rotation of circular symbol.
   * By default, this origin is textPosition.
   * Can be 'center'.
   * @type {string|Array.<number>}
   */
  textOrigin: null,

  /**
   * @type {string}
   */
  textBackgroundColor: null,

  /**
   * @type {string}
   */
  textBorderColor: null,

  /**
   * @type {number}
   */
  textBorderWidth: 0,

  /**
   * @type {number}
   */
  textBorderRadius: 0,

  /**
   * Can be `2` or `[2, 4]` or `[2, 3, 4, 5]`
   * @type {number|Array.<number>}
   */
  textPadding: null,

  /**
   * Text styles for rich text.
   * @type {Object}
   */
  rich: null,

  /**
   * {outerWidth, outerHeight, ellipsis, placeholder}
   * @type {Object}
   */
  truncate: null,

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
   * @type {string}
   */
  blend: null,

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  bind: function (ctx, el, prevEl) {
    var style = this;
    var prevStyle = prevEl && prevEl.style;
    var firstDraw = !prevStyle;

    for (var i = 0; i < STYLE_COMMON_PROPS.length; i++) {
      var prop = STYLE_COMMON_PROPS[i];
      var styleName = prop[0];

      if (firstDraw || style[styleName] !== prevStyle[styleName]) {
        // FIXME Invalid property value will cause style leak from previous element.
        ctx[styleName] = style[styleName] || prop[1];
      }
    }

    if (firstDraw || style.fill !== prevStyle.fill) {
      ctx.fillStyle = style.fill;
    }

    if (firstDraw || style.stroke !== prevStyle.stroke) {
      ctx.strokeStyle = style.stroke;
    }

    if (firstDraw || style.opacity !== prevStyle.opacity) {
      ctx.globalAlpha = style.opacity == null ? 1 : style.opacity;
    }

    if (firstDraw || style.blend !== prevStyle.blend) {
      ctx.globalCompositeOperation = style.blend || 'source-over';
    }

    if (this.hasStroke()) {
      var lineWidth = style.lineWidth;
      ctx.lineWidth = lineWidth / (this.strokeNoScale && el && el.getLineScale ? el.getLineScale() : 1);
    }
  },
  hasFill: function () {
    var fill = this.fill;
    return fill != null && fill !== 'none';
  },
  hasStroke: function () {
    var stroke = this.stroke;
    return stroke != null && stroke !== 'none' && this.lineWidth > 0;
  },

  /**
   * Extend from other style
   * @param {zrender/graphic/Style} otherStyle
   * @param {boolean} overwrite true: overwrirte any way.
   *                            false: overwrite only when !target.hasOwnProperty
   *                            others: overwrite when property is not null/undefined.
   */
  extendFrom: function (otherStyle, overwrite) {
    if (otherStyle) {
      for (var name in otherStyle) {
        if (otherStyle.hasOwnProperty(name) && (overwrite === true || (overwrite === false ? !this.hasOwnProperty(name) : otherStyle[name] != null))) {
          this[name] = otherStyle[name];
        }
      }
    }
  },

  /**
   * Batch setting style with a given object
   * @param {Object|string} obj
   * @param {*} [obj]
   */
  set: function (obj, value) {
    if (typeof obj === 'string') {
      this[obj] = value;
    } else {
      this.extendFrom(obj, true);
    }
  },

  /**
   * Clone
   * @return {zrender/graphic/Style} [description]
   */
  clone: function () {
    var newStyle = new this.constructor();
    newStyle.extendFrom(this, true);
    return newStyle;
  },
  getGradient: function (ctx, obj, rect) {
    var method = obj.type === 'radial' ? createRadialGradient : createLinearGradient;
    var canvasGradient = method(ctx, obj, rect);
    var colorStops = obj.colorStops;

    for (var i = 0; i < colorStops.length; i++) {
      canvasGradient.addColorStop(colorStops[i].offset, colorStops[i].color);
    }

    return canvasGradient;
  }
};
var styleProto = Style.prototype;

for (var i = 0; i < STYLE_COMMON_PROPS.length; i++) {
  var prop = STYLE_COMMON_PROPS[i];

  if (!(prop[0] in styleProto)) {
    styleProto[prop[0]] = prop[1];
  }
} // Provide for others


Style.getGradient = styleProto.getGradient;
var _default = Style;
module.exports = _default;

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

var smoothSpline = __webpack_require__(327);

var smoothBezier = __webpack_require__(326);

function buildPath(ctx, shape, closePath) {
  var points = shape.points;
  var smooth = shape.smooth;

  if (points && points.length >= 2) {
    if (smooth && smooth !== 'spline') {
      var controlPoints = smoothBezier(points, smooth, closePath, shape.smoothConstraint);
      ctx.moveTo(points[0][0], points[0][1]);
      var len = points.length;

      for (var i = 0; i < (closePath ? len : len - 1); i++) {
        var cp1 = controlPoints[i * 2];
        var cp2 = controlPoints[i * 2 + 1];
        var p = points[(i + 1) % len];
        ctx.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]);
      }
    } else {
      if (smooth === 'spline') {
        points = smoothSpline(points, closePath);
      }

      ctx.moveTo(points[0][0], points[0][1]);

      for (var i = 1, l = points.length; i < l; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
    }

    closePath && ctx.closePath();
  }
}

exports.buildPath = buildPath;

/***/ }),
/* 269 */
/***/ (function(module, exports) {

function buildPath(ctx, shape) {
  var x = shape.x;
  var y = shape.y;
  var width = shape.width;
  var height = shape.height;
  var r = shape.r;
  var r1;
  var r2;
  var r3;
  var r4; // Convert width and height to positive for better borderRadius

  if (width < 0) {
    x = x + width;
    width = -width;
  }

  if (height < 0) {
    y = y + height;
    height = -height;
  }

  if (typeof r === 'number') {
    r1 = r2 = r3 = r4 = r;
  } else if (r instanceof Array) {
    if (r.length === 1) {
      r1 = r2 = r3 = r4 = r[0];
    } else if (r.length === 2) {
      r1 = r3 = r[0];
      r2 = r4 = r[1];
    } else if (r.length === 3) {
      r1 = r[0];
      r2 = r4 = r[1];
      r3 = r[2];
    } else {
      r1 = r[0];
      r2 = r[1];
      r3 = r[2];
      r4 = r[3];
    }
  } else {
    r1 = r2 = r3 = r4 = 0;
  }

  var total;

  if (r1 + r2 > width) {
    total = r1 + r2;
    r1 *= width / total;
    r2 *= width / total;
  }

  if (r3 + r4 > width) {
    total = r3 + r4;
    r3 *= width / total;
    r4 *= width / total;
  }

  if (r2 + r3 > height) {
    total = r2 + r3;
    r2 *= height / total;
    r3 *= height / total;
  }

  if (r1 + r4 > height) {
    total = r1 + r4;
    r1 *= height / total;
    r4 *= height / total;
  }

  ctx.moveTo(x + r1, y);
  ctx.lineTo(x + width - r2, y);
  r2 !== 0 && ctx.quadraticCurveTo(x + width, y, x + width, y + r2);
  ctx.lineTo(x + width, y + height - r3);
  r3 !== 0 && ctx.quadraticCurveTo(x + width, y + height, x + width - r3, y + height);
  ctx.lineTo(x + r4, y + height);
  r4 !== 0 && ctx.quadraticCurveTo(x, y + height, x, y + height - r4);
  ctx.lineTo(x, y + r1);
  r1 !== 0 && ctx.quadraticCurveTo(x, y, x + r1, y);
}

exports.buildPath = buildPath;

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

var _util = __webpack_require__(196);

var retrieve2 = _util.retrieve2;
var retrieve3 = _util.retrieve3;
var each = _util.each;
var normalizeCssArray = _util.normalizeCssArray;
var isString = _util.isString;
var isObject = _util.isObject;

var textContain = __webpack_require__(225);

var roundRectHelper = __webpack_require__(269);

var imageHelper = __webpack_require__(245);

// TODO: Have not support 'start', 'end' yet.
var VALID_TEXT_ALIGN = {
  left: 1,
  right: 1,
  center: 1
};
var VALID_TEXT_VERTICAL_ALIGN = {
  top: 1,
  bottom: 1,
  middle: 1
};
/**
 * @param {module:zrender/graphic/Style} style
 * @return {module:zrender/graphic/Style} The input style.
 */

function normalizeTextStyle(style) {
  normalizeStyle(style);
  each(style.rich, normalizeStyle);
  return style;
}

function normalizeStyle(style) {
  if (style) {
    style.font = textContain.makeFont(style);
    var textAlign = style.textAlign;
    textAlign === 'middle' && (textAlign = 'center');
    style.textAlign = textAlign == null || VALID_TEXT_ALIGN[textAlign] ? textAlign : 'left'; // Compatible with textBaseline.

    var textVerticalAlign = style.textVerticalAlign || style.textBaseline;
    textVerticalAlign === 'center' && (textVerticalAlign = 'middle');
    style.textVerticalAlign = textVerticalAlign == null || VALID_TEXT_VERTICAL_ALIGN[textVerticalAlign] ? textVerticalAlign : 'top';
    var textPadding = style.textPadding;

    if (textPadding) {
      style.textPadding = normalizeCssArray(style.textPadding);
    }
  }
}
/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {module:zrender/graphic/Style} style
 * @param {Object|boolean} [rect] {x, y, width, height}
 *                  If set false, rect text is not used.
 */


function renderText(hostEl, ctx, text, style, rect) {
  style.rich ? renderRichText(hostEl, ctx, text, style, rect) : renderPlainText(hostEl, ctx, text, style, rect);
}

function renderPlainText(hostEl, ctx, text, style, rect) {
  var font = setCtx(ctx, 'font', style.font || textContain.DEFAULT_FONT);
  var textPadding = style.textPadding;
  var contentBlock = hostEl.__textCotentBlock;

  if (!contentBlock || hostEl.__dirty) {
    contentBlock = hostEl.__textCotentBlock = textContain.parsePlainText(text, font, textPadding, style.truncate);
  }

  var outerHeight = contentBlock.outerHeight;
  var textLines = contentBlock.lines;
  var lineHeight = contentBlock.lineHeight;
  var boxPos = getBoxPosition(outerHeight, style, rect);
  var baseX = boxPos.baseX;
  var baseY = boxPos.baseY;
  var textAlign = boxPos.textAlign;
  var textVerticalAlign = boxPos.textVerticalAlign; // Origin of textRotation should be the base point of text drawing.

  applyTextRotation(ctx, style, rect, baseX, baseY);
  var boxY = textContain.adjustTextY(baseY, outerHeight, textVerticalAlign);
  var textX = baseX;
  var textY = boxY;
  var needDrawBg = needDrawBackground(style);

  if (needDrawBg || textPadding) {
    // Consider performance, do not call getTextWidth util necessary.
    var textWidth = textContain.getWidth(text, font);
    var outerWidth = textWidth;
    textPadding && (outerWidth += textPadding[1] + textPadding[3]);
    var boxX = textContain.adjustTextX(baseX, outerWidth, textAlign);
    needDrawBg && drawBackground(hostEl, ctx, style, boxX, boxY, outerWidth, outerHeight);

    if (textPadding) {
      textX = getTextXForPadding(baseX, textAlign, textPadding);
      textY += textPadding[0];
    }
  }

  setCtx(ctx, 'textAlign', textAlign || 'left'); // Force baseline to be "middle". Otherwise, if using "top", the
  // text will offset downward a little bit in font "Microsoft YaHei".

  setCtx(ctx, 'textBaseline', 'middle'); // Always set shadowBlur and shadowOffset to avoid leak from displayable.

  setCtx(ctx, 'shadowBlur', style.textShadowBlur || 0);
  setCtx(ctx, 'shadowColor', style.textShadowColor || 'transparent');
  setCtx(ctx, 'shadowOffsetX', style.textShadowOffsetX || 0);
  setCtx(ctx, 'shadowOffsetY', style.textShadowOffsetY || 0); // `textBaseline` is set as 'middle'.

  textY += lineHeight / 2;
  var textStrokeWidth = style.textStrokeWidth;
  var textStroke = getStroke(style.textStroke, textStrokeWidth);
  var textFill = getFill(style.textFill);

  if (textStroke) {
    setCtx(ctx, 'lineWidth', textStrokeWidth);
    setCtx(ctx, 'strokeStyle', textStroke);
  }

  if (textFill) {
    setCtx(ctx, 'fillStyle', textFill);
  }

  for (var i = 0; i < textLines.length; i++) {
    // Fill after stroke so the outline will not cover the main part.
    textStroke && ctx.strokeText(textLines[i], textX, textY);
    textFill && ctx.fillText(textLines[i], textX, textY);
    textY += lineHeight;
  }
}

function renderRichText(hostEl, ctx, text, style, rect) {
  var contentBlock = hostEl.__textCotentBlock;

  if (!contentBlock || hostEl.__dirty) {
    contentBlock = hostEl.__textCotentBlock = textContain.parseRichText(text, style);
  }

  drawRichText(hostEl, ctx, contentBlock, style, rect);
}

function drawRichText(hostEl, ctx, contentBlock, style, rect) {
  var contentWidth = contentBlock.width;
  var outerWidth = contentBlock.outerWidth;
  var outerHeight = contentBlock.outerHeight;
  var textPadding = style.textPadding;
  var boxPos = getBoxPosition(outerHeight, style, rect);
  var baseX = boxPos.baseX;
  var baseY = boxPos.baseY;
  var textAlign = boxPos.textAlign;
  var textVerticalAlign = boxPos.textVerticalAlign; // Origin of textRotation should be the base point of text drawing.

  applyTextRotation(ctx, style, rect, baseX, baseY);
  var boxX = textContain.adjustTextX(baseX, outerWidth, textAlign);
  var boxY = textContain.adjustTextY(baseY, outerHeight, textVerticalAlign);
  var xLeft = boxX;
  var lineTop = boxY;

  if (textPadding) {
    xLeft += textPadding[3];
    lineTop += textPadding[0];
  }

  var xRight = xLeft + contentWidth;
  needDrawBackground(style) && drawBackground(hostEl, ctx, style, boxX, boxY, outerWidth, outerHeight);

  for (var i = 0; i < contentBlock.lines.length; i++) {
    var line = contentBlock.lines[i];
    var tokens = line.tokens;
    var tokenCount = tokens.length;
    var lineHeight = line.lineHeight;
    var usedWidth = line.width;
    var leftIndex = 0;
    var lineXLeft = xLeft;
    var lineXRight = xRight;
    var rightIndex = tokenCount - 1;
    var token;

    while (leftIndex < tokenCount && (token = tokens[leftIndex], !token.textAlign || token.textAlign === 'left')) {
      placeToken(hostEl, ctx, token, style, lineHeight, lineTop, lineXLeft, 'left');
      usedWidth -= token.width;
      lineXLeft += token.width;
      leftIndex++;
    }

    while (rightIndex >= 0 && (token = tokens[rightIndex], token.textAlign === 'right')) {
      placeToken(hostEl, ctx, token, style, lineHeight, lineTop, lineXRight, 'right');
      usedWidth -= token.width;
      lineXRight -= token.width;
      rightIndex--;
    } // The other tokens are placed as textAlign 'center' if there is enough space.


    lineXLeft += (contentWidth - (lineXLeft - xLeft) - (xRight - lineXRight) - usedWidth) / 2;

    while (leftIndex <= rightIndex) {
      token = tokens[leftIndex]; // Consider width specified by user, use 'center' rather than 'left'.

      placeToken(hostEl, ctx, token, style, lineHeight, lineTop, lineXLeft + token.width / 2, 'center');
      lineXLeft += token.width;
      leftIndex++;
    }

    lineTop += lineHeight;
  }
}

function applyTextRotation(ctx, style, rect, x, y) {
  // textRotation only apply in RectText.
  if (rect && style.textRotation) {
    var origin = style.textOrigin;

    if (origin === 'center') {
      x = rect.width / 2 + rect.x;
      y = rect.height / 2 + rect.y;
    } else if (origin) {
      x = origin[0] + rect.x;
      y = origin[1] + rect.y;
    }

    ctx.translate(x, y); // Positive: anticlockwise

    ctx.rotate(-style.textRotation);
    ctx.translate(-x, -y);
  }
}

function placeToken(hostEl, ctx, token, style, lineHeight, lineTop, x, textAlign) {
  var tokenStyle = style.rich[token.styleName] || {}; // 'ctx.textBaseline' is always set as 'middle', for sake of
  // the bias of "Microsoft YaHei".

  var textVerticalAlign = token.textVerticalAlign;
  var y = lineTop + lineHeight / 2;

  if (textVerticalAlign === 'top') {
    y = lineTop + token.height / 2;
  } else if (textVerticalAlign === 'bottom') {
    y = lineTop + lineHeight - token.height / 2;
  }

  !token.isLineHolder && needDrawBackground(tokenStyle) && drawBackground(hostEl, ctx, tokenStyle, textAlign === 'right' ? x - token.width : textAlign === 'center' ? x - token.width / 2 : x, y - token.height / 2, token.width, token.height);
  var textPadding = token.textPadding;

  if (textPadding) {
    x = getTextXForPadding(x, textAlign, textPadding);
    y -= token.height / 2 - textPadding[2] - token.textHeight / 2;
  }

  setCtx(ctx, 'shadowBlur', retrieve3(tokenStyle.textShadowBlur, style.textShadowBlur, 0));
  setCtx(ctx, 'shadowColor', tokenStyle.textShadowColor || style.textShadowColor || 'transparent');
  setCtx(ctx, 'shadowOffsetX', retrieve3(tokenStyle.textShadowOffsetX, style.textShadowOffsetX, 0));
  setCtx(ctx, 'shadowOffsetY', retrieve3(tokenStyle.textShadowOffsetY, style.textShadowOffsetY, 0));
  setCtx(ctx, 'textAlign', textAlign); // Force baseline to be "middle". Otherwise, if using "top", the
  // text will offset downward a little bit in font "Microsoft YaHei".

  setCtx(ctx, 'textBaseline', 'middle');
  setCtx(ctx, 'font', token.font || textContain.DEFAULT_FONT);
  var textStroke = getStroke(tokenStyle.textStroke || style.textStroke, textStrokeWidth);
  var textFill = getFill(tokenStyle.textFill || style.textFill);
  var textStrokeWidth = retrieve2(tokenStyle.textStrokeWidth, style.textStrokeWidth); // Fill after stroke so the outline will not cover the main part.

  if (textStroke) {
    setCtx(ctx, 'lineWidth', textStrokeWidth);
    setCtx(ctx, 'strokeStyle', textStroke);
    ctx.strokeText(token.text, x, y);
  }

  if (textFill) {
    setCtx(ctx, 'fillStyle', textFill);
    ctx.fillText(token.text, x, y);
  }
}

function needDrawBackground(style) {
  return style.textBackgroundColor || style.textBorderWidth && style.textBorderColor;
} // style: {textBackgroundColor, textBorderWidth, textBorderColor, textBorderRadius}
// shape: {x, y, width, height}


function drawBackground(hostEl, ctx, style, x, y, width, height) {
  var textBackgroundColor = style.textBackgroundColor;
  var textBorderWidth = style.textBorderWidth;
  var textBorderColor = style.textBorderColor;
  var isPlainBg = isString(textBackgroundColor);
  setCtx(ctx, 'shadowBlur', style.textBoxShadowBlur || 0);
  setCtx(ctx, 'shadowColor', style.textBoxShadowColor || 'transparent');
  setCtx(ctx, 'shadowOffsetX', style.textBoxShadowOffsetX || 0);
  setCtx(ctx, 'shadowOffsetY', style.textBoxShadowOffsetY || 0);

  if (isPlainBg || textBorderWidth && textBorderColor) {
    ctx.beginPath();
    var textBorderRadius = style.textBorderRadius;

    if (!textBorderRadius) {
      ctx.rect(x, y, width, height);
    } else {
      roundRectHelper.buildPath(ctx, {
        x: x,
        y: y,
        width: width,
        height: height,
        r: textBorderRadius
      });
    }

    ctx.closePath();
  }

  if (isPlainBg) {
    setCtx(ctx, 'fillStyle', textBackgroundColor);
    ctx.fill();
  } else if (isObject(textBackgroundColor)) {
    var image = textBackgroundColor.image;
    image = imageHelper.createOrUpdateImage(image, null, hostEl, onBgImageLoaded, textBackgroundColor);

    if (image && imageHelper.isImageReady(image)) {
      ctx.drawImage(image, x, y, width, height);
    }
  }

  if (textBorderWidth && textBorderColor) {
    setCtx(ctx, 'lineWidth', textBorderWidth);
    setCtx(ctx, 'strokeStyle', textBorderColor);
    ctx.stroke();
  }
}

function onBgImageLoaded(image, textBackgroundColor) {
  // Replace image, so that `contain/text.js#parseRichText`
  // will get correct result in next tick.
  textBackgroundColor.image = image;
}

function getBoxPosition(blockHeiht, style, rect) {
  var baseX = style.x || 0;
  var baseY = style.y || 0;
  var textAlign = style.textAlign;
  var textVerticalAlign = style.textVerticalAlign; // Text position represented by coord

  if (rect) {
    var textPosition = style.textPosition;

    if (textPosition instanceof Array) {
      // Percent
      baseX = rect.x + parsePercent(textPosition[0], rect.width);
      baseY = rect.y + parsePercent(textPosition[1], rect.height);
    } else {
      var res = textContain.adjustTextPositionOnRect(textPosition, rect, style.textDistance);
      baseX = res.x;
      baseY = res.y; // Default align and baseline when has textPosition

      textAlign = textAlign || res.textAlign;
      textVerticalAlign = textVerticalAlign || res.textVerticalAlign;
    } // textOffset is only support in RectText, otherwise
    // we have to adjust boundingRect for textOffset.


    var textOffset = style.textOffset;

    if (textOffset) {
      baseX += textOffset[0];
      baseY += textOffset[1];
    }
  }

  return {
    baseX: baseX,
    baseY: baseY,
    textAlign: textAlign,
    textVerticalAlign: textVerticalAlign
  };
}

function setCtx(ctx, prop, value) {
  // FIXME ??? performance try
  // if (ctx.__currentValues[prop] !== value) {
  // ctx[prop] = ctx.__currentValues[prop] = value;
  ctx[prop] = value; // }

  return ctx[prop];
}
/**
 * @param {string} [stroke] If specified, do not check style.textStroke.
 * @param {string} [lineWidth] If specified, do not check style.textStroke.
 * @param {number} style
 */


function getStroke(stroke, lineWidth) {
  return stroke == null || lineWidth <= 0 || stroke === 'transparent' || stroke === 'none' ? null // TODO pattern and gradient?
  : stroke.image || stroke.colorStops ? '#000' : stroke;
}

function getFill(fill) {
  return fill == null || fill === 'none' ? null // TODO pattern and gradient?
  : fill.image || fill.colorStops ? '#000' : fill;
}

function parsePercent(value, maxValue) {
  if (typeof value === 'string') {
    if (value.lastIndexOf('%') >= 0) {
      return parseFloat(value) / 100 * maxValue;
    }

    return parseFloat(value);
  }

  return value;
}

function getTextXForPadding(x, textAlign, textPadding) {
  return textAlign === 'right' ? x - textPadding[1] : textAlign === 'center' ? x + textPadding[3] / 2 - textPadding[1] / 2 : x + textPadding[3];
}
/**
 * @param {string} text
 * @param {module:zrender/Style} style
 * @return {boolean}
 */


function needDrawText(text, style) {
  return text != null && (text || style.textBackgroundColor || style.textBorderWidth && style.textBorderColor || style.textPadding);
}

exports.normalizeTextStyle = normalizeTextStyle;
exports.renderText = renderText;
exports.getStroke = getStroke;
exports.getFill = getFill;
exports.needDrawText = needDrawText;

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

var matrix = __webpack_require__(228);

var vector = __webpack_require__(203);

/**
 * 提供变换扩展
 * @module zrender/mixin/Transformable
 * @author pissang (https://www.github.com/pissang)
 */
var mIdentity = matrix.identity;
var EPSILON = 5e-5;

function isNotAroundZero(val) {
  return val > EPSILON || val < -EPSILON;
}
/**
 * @alias module:zrender/mixin/Transformable
 * @constructor
 */


var Transformable = function (opts) {
  opts = opts || {}; // If there are no given position, rotation, scale

  if (!opts.position) {
    /**
     * 平移
     * @type {Array.<number>}
     * @default [0, 0]
     */
    this.position = [0, 0];
  }

  if (opts.rotation == null) {
    /**
     * 旋转
     * @type {Array.<number>}
     * @default 0
     */
    this.rotation = 0;
  }

  if (!opts.scale) {
    /**
     * 缩放
     * @type {Array.<number>}
     * @default [1, 1]
     */
    this.scale = [1, 1];
  }
  /**
   * 旋转和缩放的原点
   * @type {Array.<number>}
   * @default null
   */


  this.origin = this.origin || null;
};

var transformableProto = Transformable.prototype;
transformableProto.transform = null;
/**
 * 判断是否需要有坐标变换
 * 如果有坐标变换, 则从position, rotation, scale以及父节点的transform计算出自身的transform矩阵
 */

transformableProto.needLocalTransform = function () {
  return isNotAroundZero(this.rotation) || isNotAroundZero(this.position[0]) || isNotAroundZero(this.position[1]) || isNotAroundZero(this.scale[0] - 1) || isNotAroundZero(this.scale[1] - 1);
};

transformableProto.updateTransform = function () {
  var parent = this.parent;
  var parentHasTransform = parent && parent.transform;
  var needLocalTransform = this.needLocalTransform();
  var m = this.transform;

  if (!(needLocalTransform || parentHasTransform)) {
    m && mIdentity(m);
    return;
  }

  m = m || matrix.create();

  if (needLocalTransform) {
    this.getLocalTransform(m);
  } else {
    mIdentity(m);
  } // 应用父节点变换


  if (parentHasTransform) {
    if (needLocalTransform) {
      matrix.mul(m, parent.transform, m);
    } else {
      matrix.copy(m, parent.transform);
    }
  } // 保存这个变换矩阵


  this.transform = m;
  this.invTransform = this.invTransform || matrix.create();
  matrix.invert(this.invTransform, m);
};

transformableProto.getLocalTransform = function (m) {
  return Transformable.getLocalTransform(this, m);
};
/**
 * 将自己的transform应用到context上
 * @param {CanvasRenderingContext2D} ctx
 */


transformableProto.setTransform = function (ctx) {
  var m = this.transform;
  var dpr = ctx.dpr || 1;

  if (m) {
    ctx.setTransform(dpr * m[0], dpr * m[1], dpr * m[2], dpr * m[3], dpr * m[4], dpr * m[5]);
  } else {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
};

transformableProto.restoreTransform = function (ctx) {
  var dpr = ctx.dpr || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

var tmpTransform = [];
/**
 * 分解`transform`矩阵到`position`, `rotation`, `scale`
 */

transformableProto.decomposeTransform = function () {
  if (!this.transform) {
    return;
  }

  var parent = this.parent;
  var m = this.transform;

  if (parent && parent.transform) {
    // Get local transform and decompose them to position, scale, rotation
    matrix.mul(tmpTransform, parent.invTransform, m);
    m = tmpTransform;
  }

  var sx = m[0] * m[0] + m[1] * m[1];
  var sy = m[2] * m[2] + m[3] * m[3];
  var position = this.position;
  var scale = this.scale;

  if (isNotAroundZero(sx - 1)) {
    sx = Math.sqrt(sx);
  }

  if (isNotAroundZero(sy - 1)) {
    sy = Math.sqrt(sy);
  }

  if (m[0] < 0) {
    sx = -sx;
  }

  if (m[3] < 0) {
    sy = -sy;
  }

  position[0] = m[4];
  position[1] = m[5];
  scale[0] = sx;
  scale[1] = sy;
  this.rotation = Math.atan2(-m[1] / sy, m[0] / sx);
};
/**
 * Get global scale
 * @return {Array.<number>}
 */


transformableProto.getGlobalScale = function () {
  var m = this.transform;

  if (!m) {
    return [1, 1];
  }

  var sx = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
  var sy = Math.sqrt(m[2] * m[2] + m[3] * m[3]);

  if (m[0] < 0) {
    sx = -sx;
  }

  if (m[3] < 0) {
    sy = -sy;
  }

  return [sx, sy];
};
/**
 * 变换坐标位置到 shape 的局部坐标空间
 * @method
 * @param {number} x
 * @param {number} y
 * @return {Array.<number>}
 */


transformableProto.transformCoordToLocal = function (x, y) {
  var v2 = [x, y];
  var invTransform = this.invTransform;

  if (invTransform) {
    vector.applyTransform(v2, v2, invTransform);
  }

  return v2;
};
/**
 * 变换局部坐标位置到全局坐标空间
 * @method
 * @param {number} x
 * @param {number} y
 * @return {Array.<number>}
 */


transformableProto.transformCoordToGlobal = function (x, y) {
  var v2 = [x, y];
  var transform = this.transform;

  if (transform) {
    vector.applyTransform(v2, v2, transform);
  }

  return v2;
};
/**
 * @static
 * @param {Object} target
 * @param {Array.<number>} target.origin
 * @param {number} target.rotation
 * @param {Array.<number>} target.position
 * @param {Array.<number>} [m]
 */


Transformable.getLocalTransform = function (target, m) {
  m = m || [];
  mIdentity(m);
  var origin = target.origin;
  var scale = target.scale || [1, 1];
  var rotation = target.rotation || 0;
  var position = target.position || [0, 0];

  if (origin) {
    // Translate to origin
    m[4] -= origin[0];
    m[5] -= origin[1];
  }

  matrix.scale(m, m, scale);

  if (rotation) {
    matrix.rotate(m, m, rotation);
  }

  if (origin) {
    // Translate back from origin
    m[4] += origin[0];
    m[5] += origin[1];
  }

  m[4] += position[0];
  m[5] += position[1];
  return m;
};

var _default = Transformable;
module.exports = _default;

/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

var guid = __webpack_require__(263);

var env = __webpack_require__(213);

var zrUtil = __webpack_require__(196);

var Handler = __webpack_require__(307);

var Storage = __webpack_require__(310);

var Painter = __webpack_require__(309);

var Animation = __webpack_require__(311);

var HandlerProxy = __webpack_require__(321);

/*!
* ZRender, a high performance 2d drawing library.
*
* Copyright (c) 2013, Baidu Inc.
* All rights reserved.
*
* LICENSE
* https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
*/
var useVML = !env.canvasSupported;
var painterCtors = {
  canvas: Painter
};
var instances = {}; // ZRender实例map索引

/**
 * @type {string}
 */

var version = '3.7.4';
/**
 * Initializing a zrender instance
 * @param {HTMLElement} dom
 * @param {Object} opts
 * @param {string} [opts.renderer='canvas'] 'canvas' or 'svg'
 * @param {number} [opts.devicePixelRatio]
 * @param {number|string} [opts.width] Can be 'auto' (the same as null/undefined)
 * @param {number|string} [opts.height] Can be 'auto' (the same as null/undefined)
 * @return {module:zrender/ZRender}
 */

function init(dom, opts) {
  var zr = new ZRender(guid(), dom, opts);
  instances[zr.id] = zr;
  return zr;
}
/**
 * Dispose zrender instance
 * @param {module:zrender/ZRender} zr
 */


function dispose(zr) {
  if (zr) {
    zr.dispose();
  } else {
    for (var key in instances) {
      if (instances.hasOwnProperty(key)) {
        instances[key].dispose();
      }
    }

    instances = {};
  }

  return this;
}
/**
 * Get zrender instance by id
 * @param {string} id zrender instance id
 * @return {module:zrender/ZRender}
 */


function getInstance(id) {
  return instances[id];
}

function registerPainter(name, Ctor) {
  painterCtors[name] = Ctor;
}

function delInstance(id) {
  delete instances[id];
}
/**
 * @module zrender/ZRender
 */

/**
 * @constructor
 * @alias module:zrender/ZRender
 * @param {string} id
 * @param {HTMLElement} dom
 * @param {Object} opts
 * @param {string} [opts.renderer='canvas'] 'canvas' or 'svg'
 * @param {number} [opts.devicePixelRatio]
 * @param {number} [opts.width] Can be 'auto' (the same as null/undefined)
 * @param {number} [opts.height] Can be 'auto' (the same as null/undefined)
 */


var ZRender = function (id, dom, opts) {
  opts = opts || {};
  /**
   * @type {HTMLDomElement}
   */

  this.dom = dom;
  /**
   * @type {string}
   */

  this.id = id;
  var self = this;
  var storage = new Storage();
  var rendererType = opts.renderer; // TODO WebGL

  if (useVML) {
    if (!painterCtors.vml) {
      throw new Error('You need to require \'zrender/vml/vml\' to support IE8');
    }

    rendererType = 'vml';
  } else if (!rendererType || !painterCtors[rendererType]) {
    rendererType = 'canvas';
  }

  var painter = new painterCtors[rendererType](dom, storage, opts);
  this.storage = storage;
  this.painter = painter;
  var handerProxy = !env.node ? new HandlerProxy(painter.getViewportRoot()) : null;
  this.handler = new Handler(storage, painter, handerProxy, painter.root);
  /**
   * @type {module:zrender/animation/Animation}
   */

  this.animation = new Animation({
    stage: {
      update: zrUtil.bind(this.flush, this)
    }
  });
  this.animation.start();
  /**
   * @type {boolean}
   * @private
   */

  this._needsRefresh; // 修改 storage.delFromStorage, 每次删除元素之前删除动画
  // FIXME 有点ugly

  var oldDelFromStorage = storage.delFromStorage;
  var oldAddToStorage = storage.addToStorage;

  storage.delFromStorage = function (el) {
    oldDelFromStorage.call(storage, el);
    el && el.removeSelfFromZr(self);
  };

  storage.addToStorage = function (el) {
    oldAddToStorage.call(storage, el);
    el.addSelfToZr(self);
  };
};

ZRender.prototype = {
  constructor: ZRender,

  /**
   * 获取实例唯一标识
   * @return {string}
   */
  getId: function () {
    return this.id;
  },

  /**
   * 添加元素
   * @param  {module:zrender/Element} el
   */
  add: function (el) {
    this.storage.addRoot(el);
    this._needsRefresh = true;
  },

  /**
   * 删除元素
   * @param  {module:zrender/Element} el
   */
  remove: function (el) {
    this.storage.delRoot(el);
    this._needsRefresh = true;
  },

  /**
   * Change configuration of layer
   * @param {string} zLevel
   * @param {Object} config
   * @param {string} [config.clearColor=0] Clear color
   * @param {string} [config.motionBlur=false] If enable motion blur
   * @param {number} [config.lastFrameAlpha=0.7] Motion blur factor. Larger value cause longer trailer
  */
  configLayer: function (zLevel, config) {
    this.painter.configLayer(zLevel, config);
    this._needsRefresh = true;
  },

  /**
   * Repaint the canvas immediately
   */
  refreshImmediately: function () {
    // var start = new Date();
    // Clear needsRefresh ahead to avoid something wrong happens in refresh
    // Or it will cause zrender refreshes again and again.
    this._needsRefresh = false;
    this.painter.refresh();
    /**
     * Avoid trigger zr.refresh in Element#beforeUpdate hook
     */

    this._needsRefresh = false; // var end = new Date();
    // var log = document.getElementById('log');
    // if (log) {
    //     log.innerHTML = log.innerHTML + '<br>' + (end - start);
    // }
  },

  /**
   * Mark and repaint the canvas in the next frame of browser
   */
  refresh: function () {
    this._needsRefresh = true;
  },

  /**
   * Perform all refresh
   */
  flush: function () {
    if (this._needsRefresh) {
      this.refreshImmediately();
    }

    if (this._needsRefreshHover) {
      this.refreshHoverImmediately();
    }
  },

  /**
   * Add element to hover layer
   * @param  {module:zrender/Element} el
   * @param {Object} style
   */
  addHover: function (el, style) {
    if (this.painter.addHover) {
      this.painter.addHover(el, style);
      this.refreshHover();
    }
  },

  /**
   * Add element from hover layer
   * @param  {module:zrender/Element} el
   */
  removeHover: function (el) {
    if (this.painter.removeHover) {
      this.painter.removeHover(el);
      this.refreshHover();
    }
  },

  /**
   * Clear all hover elements in hover layer
   * @param  {module:zrender/Element} el
   */
  clearHover: function () {
    if (this.painter.clearHover) {
      this.painter.clearHover();
      this.refreshHover();
    }
  },

  /**
   * Refresh hover in next frame
   */
  refreshHover: function () {
    this._needsRefreshHover = true;
  },

  /**
   * Refresh hover immediately
   */
  refreshHoverImmediately: function () {
    this._needsRefreshHover = false;
    this.painter.refreshHover && this.painter.refreshHover();
  },

  /**
   * Resize the canvas.
   * Should be invoked when container size is changed
   * @param {Object} [opts]
   * @param {number|string} [opts.width] Can be 'auto' (the same as null/undefined)
   * @param {number|string} [opts.height] Can be 'auto' (the same as null/undefined)
   */
  resize: function (opts) {
    opts = opts || {};
    this.painter.resize(opts.width, opts.height);
    this.handler.resize();
  },

  /**
   * Stop and clear all animation immediately
   */
  clearAnimation: function () {
    this.animation.clear();
  },

  /**
   * Get container width
   */
  getWidth: function () {
    return this.painter.getWidth();
  },

  /**
   * Get container height
   */
  getHeight: function () {
    return this.painter.getHeight();
  },

  /**
   * Export the canvas as Base64 URL
   * @param {string} type
   * @param {string} [backgroundColor='#fff']
   * @return {string} Base64 URL
   */
  // toDataURL: function(type, backgroundColor) {
  //     return this.painter.getRenderedCanvas({
  //         backgroundColor: backgroundColor
  //     }).toDataURL(type);
  // },

  /**
   * Converting a path to image.
   * It has much better performance of drawing image rather than drawing a vector path.
   * @param {module:zrender/graphic/Path} e
   * @param {number} width
   * @param {number} height
   */
  pathToImage: function (e, dpr) {
    return this.painter.pathToImage(e, dpr);
  },

  /**
   * Set default cursor
   * @param {string} [cursorStyle='default'] 例如 crosshair
   */
  setCursorStyle: function (cursorStyle) {
    this.handler.setCursorStyle(cursorStyle);
  },

  /**
   * Find hovered element
   * @param {number} x
   * @param {number} y
   * @return {Object} {target, topTarget}
   */
  findHover: function (x, y) {
    return this.handler.findHover(x, y);
  },

  /**
   * Bind event
   *
   * @param {string} eventName Event name
   * @param {Function} eventHandler Handler function
   * @param {Object} [context] Context object
   */
  on: function (eventName, eventHandler, context) {
    this.handler.on(eventName, eventHandler, context);
  },

  /**
   * Unbind event
   * @param {string} eventName Event name
   * @param {Function} [eventHandler] Handler function
   */
  off: function (eventName, eventHandler) {
    this.handler.off(eventName, eventHandler);
  },

  /**
   * Trigger event manually
   *
   * @param {string} eventName Event name
   * @param {event=} event Event object
   */
  trigger: function (eventName, event) {
    this.handler.trigger(eventName, event);
  },

  /**
   * Clear all objects and the canvas.
   */
  clear: function () {
    this.storage.delRoot();
    this.painter.clear();
  },

  /**
   * Dispose self.
   */
  dispose: function () {
    this.animation.stop();
    this.clear();
    this.storage.dispose();
    this.painter.dispose();
    this.handler.dispose();
    this.animation = this.storage = this.painter = this.handler = null;
    delInstance(this.id);
  }
};
exports.version = version;
exports.init = init;
exports.dispose = dispose;
exports.getInstance = getInstance;
exports.registerPainter = registerPainter;

/***/ }),
/* 273 */,
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

var _layout = __webpack_require__(224);

var getLayoutRect = _layout.getLayoutRect;
var layoutBox = _layout.box;
var positionElement = _layout.positionElement;

var formatUtil = __webpack_require__(217);

var graphic = __webpack_require__(200);

/**
 * Layout list like component.
 * It will box layout each items in group of component and then position the whole group in the viewport
 * @param {module:zrender/group/Group} group
 * @param {module:echarts/model/Component} componentModel
 * @param {module:echarts/ExtensionAPI}
 */
function layout(group, componentModel, api) {
  var boxLayoutParams = componentModel.getBoxLayoutParams();
  var padding = componentModel.get('padding');
  var viewportSize = {
    width: api.getWidth(),
    height: api.getHeight()
  };
  var rect = getLayoutRect(boxLayoutParams, viewportSize, padding);
  layoutBox(componentModel.get('orient'), group, componentModel.get('itemGap'), rect.width, rect.height);
  positionElement(group, boxLayoutParams, viewportSize, padding);
}

function makeBackground(rect, componentModel) {
  var padding = formatUtil.normalizeCssArray(componentModel.get('padding'));
  var style = componentModel.getItemStyle(['color', 'opacity']);
  style.fill = componentModel.get('backgroundColor');
  var rect = new graphic.Rect({
    shape: {
      x: rect.x - padding[3],
      y: rect.y - padding[0],
      width: rect.width + padding[1] + padding[3],
      height: rect.height + padding[0] + padding[2],
      r: componentModel.get('borderRadius')
    },
    style: style,
    silent: true,
    z2: -1
  }); // FIXME
  // `subPixelOptimizeRect` may bring some gap between edge of viewpart
  // and background rect when setting like `left: 0`, `top: 0`.
  // graphic.subPixelOptimizeRect(rect);

  return rect;
}

exports.layout = layout;
exports.makeBackground = makeBackground;

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var numberUtil = __webpack_require__(202);

var axisHelper = __webpack_require__(229);

var linearMap = numberUtil.linearMap;

function fixExtentWithBands(extent, nTick) {
  var size = extent[1] - extent[0];
  var len = nTick;
  var margin = size / len / 2;
  extent[0] += margin;
  extent[1] -= margin;
}

var normalizedExtent = [0, 1];
/**
 * @name module:echarts/coord/CartesianAxis
 * @constructor
 */

var Axis = function (dim, scale, extent) {
  /**
   * Axis dimension. Such as 'x', 'y', 'z', 'angle', 'radius'
   * @type {string}
   */
  this.dim = dim;
  /**
   * Axis scale
   * @type {module:echarts/coord/scale/*}
   */

  this.scale = scale;
  /**
   * @type {Array.<number>}
   * @private
   */

  this._extent = extent || [0, 0];
  /**
   * @type {boolean}
   */

  this.inverse = false;
  /**
   * Usually true when axis has a ordinal scale
   * @type {boolean}
   */

  this.onBand = false;
  /**
   * @private
   * @type {number}
   */

  this._labelInterval;
};

Axis.prototype = {
  constructor: Axis,

  /**
   * If axis extent contain given coord
   * @param {number} coord
   * @return {boolean}
   */
  contain: function (coord) {
    var extent = this._extent;
    var min = Math.min(extent[0], extent[1]);
    var max = Math.max(extent[0], extent[1]);
    return coord >= min && coord <= max;
  },

  /**
   * If axis extent contain given data
   * @param {number} data
   * @return {boolean}
   */
  containData: function (data) {
    return this.contain(this.dataToCoord(data));
  },

  /**
   * Get coord extent.
   * @return {Array.<number>}
   */
  getExtent: function () {
    return this._extent.slice();
  },

  /**
   * Get precision used for formatting
   * @param {Array.<number>} [dataExtent]
   * @return {number}
   */
  getPixelPrecision: function (dataExtent) {
    return numberUtil.getPixelPrecision(dataExtent || this.scale.getExtent(), this._extent);
  },

  /**
   * Set coord extent
   * @param {number} start
   * @param {number} end
   */
  setExtent: function (start, end) {
    var extent = this._extent;
    extent[0] = start;
    extent[1] = end;
  },

  /**
   * Convert data to coord. Data is the rank if it has a ordinal scale
   * @param {number} data
   * @param  {boolean} clamp
   * @return {number}
   */
  dataToCoord: function (data, clamp) {
    var extent = this._extent;
    var scale = this.scale;
    data = scale.normalize(data);

    if (this.onBand && scale.type === 'ordinal') {
      extent = extent.slice();
      fixExtentWithBands(extent, scale.count());
    }

    return linearMap(data, normalizedExtent, extent, clamp);
  },

  /**
   * Convert coord to data. Data is the rank if it has a ordinal scale
   * @param {number} coord
   * @param  {boolean} clamp
   * @return {number}
   */
  coordToData: function (coord, clamp) {
    var extent = this._extent;
    var scale = this.scale;

    if (this.onBand && scale.type === 'ordinal') {
      extent = extent.slice();
      fixExtentWithBands(extent, scale.count());
    }

    var t = linearMap(coord, extent, normalizedExtent, clamp);
    return this.scale.scale(t);
  },

  /**
   * Convert pixel point to data in axis
   * @param {Array.<number>} point
   * @param  {boolean} clamp
   * @return {number} data
   */
  pointToData: function (point, clamp) {// Should be implemented in derived class if necessary.
  },

  /**
   * @return {Array.<number>}
   */
  getTicksCoords: function (alignWithLabel) {
    if (this.onBand && !alignWithLabel) {
      var bands = this.getBands();
      var coords = [];

      for (var i = 0; i < bands.length; i++) {
        coords.push(bands[i][0]);
      }

      if (bands[i - 1]) {
        coords.push(bands[i - 1][1]);
      }

      return coords;
    } else {
      return zrUtil.map(this.scale.getTicks(), this.dataToCoord, this);
    }
  },

  /**
   * Coords of labels are on the ticks or on the middle of bands
   * @return {Array.<number>}
   */
  getLabelsCoords: function () {
    return zrUtil.map(this.scale.getTicks(), this.dataToCoord, this);
  },

  /**
   * Get bands.
   *
   * If axis has labels [1, 2, 3, 4]. Bands on the axis are
   * |---1---|---2---|---3---|---4---|.
   *
   * @return {Array}
   */
  // FIXME Situation when labels is on ticks
  getBands: function () {
    var extent = this.getExtent();
    var bands = [];
    var len = this.scale.count();
    var start = extent[0];
    var end = extent[1];
    var span = end - start;

    for (var i = 0; i < len; i++) {
      bands.push([span * i / len + start, span * (i + 1) / len + start]);
    }

    return bands;
  },

  /**
   * Get width of band
   * @return {number}
   */
  getBandWidth: function () {
    var axisExtent = this._extent;
    var dataExtent = this.scale.getExtent();
    var len = dataExtent[1] - dataExtent[0] + (this.onBand ? 1 : 0); // Fix #2728, avoid NaN when only one data.

    len === 0 && (len = 1);
    var size = Math.abs(axisExtent[1] - axisExtent[0]);
    return Math.abs(size) / len;
  },

  /**
   * @abstract
   * @return {boolean} Is horizontal
   */
  isHorizontal: null,

  /**
   * @abstract
   * @return {number} Get axis rotate, by degree.
   */
  getRotate: null,

  /**
   * Get interval of the axis label.
   * To get precise result, at least one of `getRotate` and `isHorizontal`
   * should be implemented.
   * @return {number}
   */
  getLabelInterval: function () {
    var labelInterval = this._labelInterval;

    if (!labelInterval) {
      var axisModel = this.model;
      var labelModel = axisModel.getModel('axisLabel');
      labelInterval = labelModel.get('interval');

      if (this.type === 'category' && (labelInterval == null || labelInterval === 'auto')) {
        labelInterval = axisHelper.getAxisLabelInterval(zrUtil.map(this.scale.getTicks(), this.dataToCoord, this), axisModel.getFormattedLabels(), labelModel.getFont(), this.getRotate ? this.getRotate() : this.isHorizontal && !this.isHorizontal() ? 90 : 0, labelModel.get('rotate'));
      }

      this._labelInterval = labelInterval;
    }

    return labelInterval;
  }
};
var _default = Axis;
module.exports = _default;

/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var axisHelper = __webpack_require__(229);

function getName(obj) {
  if (zrUtil.isObject(obj) && obj.value != null) {
    return obj.value;
  } else {
    return obj + '';
  }
}

var _default = {
  /**
   * Format labels
   * @return {Array.<string>}
   */
  getFormattedLabels: function () {
    return axisHelper.getFormattedLabels(this.axis, this.get('axisLabel.formatter'));
  },

  /**
   * Get categories
   */
  getCategories: function () {
    return this.get('type') === 'category' && zrUtil.map(this.get('data'), getName);
  },

  /**
   * @param {boolean} origin
   * @return {number|string} min value or 'dataMin' or null/undefined (means auto) or NaN
   */
  getMin: function (origin) {
    var option = this.option;
    var min = !origin && option.rangeStart != null ? option.rangeStart : option.min;

    if (this.axis && min != null && min !== 'dataMin' && typeof min !== 'function' && !zrUtil.eqNaN(min)) {
      min = this.axis.scale.parse(min);
    }

    return min;
  },

  /**
   * @param {boolean} origin
   * @return {number|string} max value or 'dataMax' or null/undefined (means auto) or NaN
   */
  getMax: function (origin) {
    var option = this.option;
    var max = !origin && option.rangeEnd != null ? option.rangeEnd : option.max;

    if (this.axis && max != null && max !== 'dataMax' && typeof max !== 'function' && !zrUtil.eqNaN(max)) {
      max = this.axis.scale.parse(max);
    }

    return max;
  },

  /**
   * @return {boolean}
   */
  getNeedCrossZero: function () {
    var option = this.option;
    return option.rangeStart != null || option.rangeEnd != null ? false : !option.scale;
  },

  /**
   * Should be implemented by each axis model if necessary.
   * @return {module:echarts/model/Component} coordinate system model
   */
  getCoordSysModel: zrUtil.noop,

  /**
   * @param {number} rangeStart Can only be finite number or null/undefined or NaN.
   * @param {number} rangeEnd Can only be finite number or null/undefined or NaN.
   */
  setRange: function (rangeStart, rangeEnd) {
    this.option.rangeStart = rangeStart;
    this.option.rangeEnd = rangeEnd;
  },

  /**
   * Reset range
   */
  resetRange: function () {
    // rangeStart and rangeEnd is readonly.
    this.option.rangeStart = this.option.rangeEnd = null;
  }
};
module.exports = _default;

/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

var Group = __webpack_require__(234);

var componentUtil = __webpack_require__(240);

var clazzUtil = __webpack_require__(222);

var Component = function () {
  /**
   * @type {module:zrender/container/Group}
   * @readOnly
   */
  this.group = new Group();
  /**
   * @type {string}
   * @readOnly
   */

  this.uid = componentUtil.getUID('viewComponent');
};

Component.prototype = {
  constructor: Component,
  init: function (ecModel, api) {},
  render: function (componentModel, ecModel, api, payload) {},
  dispose: function () {}
};
var componentProto = Component.prototype;

componentProto.updateView = componentProto.updateLayout = componentProto.updateVisual = function (seriesModel, ecModel, api, payload) {// Do nothing;
}; // Enable Component.extend.


clazzUtil.enableClassExtend(Component); // Enable capability of registerClass, getClass, hasClass, registerSubTypeDefaulter and so on.

clazzUtil.enableClassManagement(Component, {
  registerWhenExtend: true
});
var _default = Component;
module.exports = _default;

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

var env = __webpack_require__(213);

// Fix weird bug in some version of IE11 (like 11.0.9600.178**),
// where exception "unexpected call to method or property access"
// might be thrown when calling ctx.fill or ctx.stroke after a path
// whose area size is zero is drawn and ctx.clip() is called and
// shadowBlur is set. See #4572, #3112, #5777.
// (e.g.,
//  ctx.moveTo(10, 10);
//  ctx.lineTo(20, 10);
//  ctx.closePath();
//  ctx.clip();
//  ctx.shadowBlur = 10;
//  ...
//  ctx.fill();
// )
var shadowTemp = [['shadowBlur', 0], ['shadowColor', '#000'], ['shadowOffsetX', 0], ['shadowOffsetY', 0]];

function _default(orignalBrush) {
  // version string can be: '11.0'
  return env.browser.ie && env.browser.version >= 11 ? function () {
    var clipPaths = this.__clipPaths;
    var style = this.style;
    var modified;

    if (clipPaths) {
      for (var i = 0; i < clipPaths.length; i++) {
        var clipPath = clipPaths[i];
        var shape = clipPath && clipPath.shape;
        var type = clipPath && clipPath.type;

        if (shape && (type === 'sector' && shape.startAngle === shape.endAngle || type === 'rect' && (!shape.width || !shape.height))) {
          for (var j = 0; j < shadowTemp.length; j++) {
            // It is save to put shadowTemp static, because shadowTemp
            // will be all modified each item brush called.
            shadowTemp[j][2] = style[shadowTemp[j][0]];
            style[shadowTemp[j][0]] = shadowTemp[j][1];
          }

          modified = true;
          break;
        }
      }
    }

    orignalBrush.apply(this, arguments);

    if (modified) {
      for (var j = 0; j < shadowTemp.length; j++) {
        style[shadowTemp[j][0]] = shadowTemp[j][2];
      }
    }
  } : orignalBrush;
}

module.exports = _default;

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var echartsAPIList = ['getDom', 'getZr', 'getWidth', 'getHeight', 'getDevicePixelRatio', 'dispatchAction', 'isDisposed', 'on', 'off', 'getDataURL', 'getConnectedDataURL', 'getModel', 'getOption', 'getViewOfComponentModel', 'getViewOfSeriesModel']; // And `getCoordinateSystems` and `getComponentByElement` will be injected in echarts.js

function ExtensionAPI(chartInstance) {
  zrUtil.each(echartsAPIList, function (name) {
    this[name] = zrUtil.bind(chartInstance[name], chartInstance);
  }, this);
}

var _default = ExtensionAPI;
module.exports = _default;

/***/ }),
/* 280 */,
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

var echarts = __webpack_require__(198);

__webpack_require__(282);

__webpack_require__(284);

__webpack_require__(283);

var legendFilter = __webpack_require__(285);

var Component = __webpack_require__(223);

// Do not contain scrollable legend, for sake of file size.
// Series Filter
echarts.registerProcessor(legendFilter);
Component.registerSubTypeDefaulter('legend', function () {
  // Default 'plain' when no type specified.
  return 'plain';
});

/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

var echarts = __webpack_require__(198);

var zrUtil = __webpack_require__(196);

var Model = __webpack_require__(221);

var LegendModel = echarts.extendComponentModel({
  type: 'legend.plain',
  dependencies: ['series'],
  layoutMode: {
    type: 'box',
    // legend.width/height are maxWidth/maxHeight actually,
    // whereas realy width/height is calculated by its content.
    // (Setting {left: 10, right: 10} does not make sense).
    // So consider the case:
    // `setOption({legend: {left: 10});`
    // then `setOption({legend: {right: 10});`
    // The previous `left` should be cleared by setting `ignoreSize`.
    ignoreSize: true
  },
  init: function (option, parentModel, ecModel) {
    this.mergeDefaultAndTheme(option, ecModel);
    option.selected = option.selected || {};
  },
  mergeOption: function (option) {
    LegendModel.superCall(this, 'mergeOption', option);
  },
  optionUpdated: function () {
    this._updateData(this.ecModel);

    var legendData = this._data; // If selectedMode is single, try to select one

    if (legendData[0] && this.get('selectedMode') === 'single') {
      var hasSelected = false; // If has any selected in option.selected

      for (var i = 0; i < legendData.length; i++) {
        var name = legendData[i].get('name');

        if (this.isSelected(name)) {
          // Force to unselect others
          this.select(name);
          hasSelected = true;
          break;
        }
      } // Try select the first if selectedMode is single


      !hasSelected && this.select(legendData[0].get('name'));
    }
  },
  _updateData: function (ecModel) {
    var legendData = zrUtil.map(this.get('data') || [], function (dataItem) {
      // Can be string or number
      if (typeof dataItem === 'string' || typeof dataItem === 'number') {
        dataItem = {
          name: dataItem
        };
      }

      return new Model(dataItem, this, this.ecModel);
    }, this);
    this._data = legendData;
    var availableNames = zrUtil.map(ecModel.getSeries(), function (series) {
      return series.name;
    });
    ecModel.eachSeries(function (seriesModel) {
      if (seriesModel.legendDataProvider) {
        var data = seriesModel.legendDataProvider();
        availableNames = availableNames.concat(data.mapArray(data.getName));
      }
    });
    /**
     * @type {Array.<string>}
     * @private
     */

    this._availableNames = availableNames;
  },

  /**
   * @return {Array.<module:echarts/model/Model>}
   */
  getData: function () {
    return this._data;
  },

  /**
   * @param {string} name
   */
  select: function (name) {
    var selected = this.option.selected;
    var selectedMode = this.get('selectedMode');

    if (selectedMode === 'single') {
      var data = this._data;
      zrUtil.each(data, function (dataItem) {
        selected[dataItem.get('name')] = false;
      });
    }

    selected[name] = true;
  },

  /**
   * @param {string} name
   */
  unSelect: function (name) {
    if (this.get('selectedMode') !== 'single') {
      this.option.selected[name] = false;
    }
  },

  /**
   * @param {string} name
   */
  toggleSelected: function (name) {
    var selected = this.option.selected; // Default is true

    if (!selected.hasOwnProperty(name)) {
      selected[name] = true;
    }

    this[selected[name] ? 'unSelect' : 'select'](name);
  },

  /**
   * @param {string} name
   */
  isSelected: function (name) {
    var selected = this.option.selected;
    return !(selected.hasOwnProperty(name) && !selected[name]) && zrUtil.indexOf(this._availableNames, name) >= 0;
  },
  defaultOption: {
    // 一级层叠
    zlevel: 0,
    // 二级层叠
    z: 4,
    show: true,
    // 布局方式，默认为水平布局，可选为：
    // 'horizontal' | 'vertical'
    orient: 'horizontal',
    left: 'center',
    // right: 'center',
    top: 0,
    // bottom: null,
    // 水平对齐
    // 'auto' | 'left' | 'right'
    // 默认为 'auto', 根据 x 的位置判断是左对齐还是右对齐
    align: 'auto',
    backgroundColor: 'rgba(0,0,0,0)',
    // 图例边框颜色
    borderColor: '#ccc',
    borderRadius: 0,
    // 图例边框线宽，单位px，默认为0（无边框）
    borderWidth: 0,
    // 图例内边距，单位px，默认各方向内边距为5，
    // 接受数组分别设定上右下左边距，同css
    padding: 5,
    // 各个item之间的间隔，单位px，默认为10，
    // 横向布局时为水平间隔，纵向布局时为纵向间隔
    itemGap: 10,
    // 图例图形宽度
    itemWidth: 25,
    // 图例图形高度
    itemHeight: 14,
    // 图例关闭时候的颜色
    inactiveColor: '#ccc',
    textStyle: {
      // 图例文字颜色
      color: '#333'
    },
    // formatter: '',
    // 选择模式，默认开启图例开关
    selectedMode: true,
    // 配置默认选中状态，可配合LEGEND.SELECTED事件做动态数据载入
    // selected: null,
    // 图例内容（详见legend.data，数组中每一项代表一个item
    // data: [],
    // Tooltip 相关配置
    tooltip: {
      show: false
    }
  }
});
var _default = LegendModel;
module.exports = _default;

/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

var _config = __webpack_require__(211);

var __DEV__ = _config.__DEV__;

var echarts = __webpack_require__(198);

var zrUtil = __webpack_require__(196);

var _symbol = __webpack_require__(241);

var createSymbol = _symbol.createSymbol;

var graphic = __webpack_require__(200);

var _listComponent = __webpack_require__(274);

var makeBackground = _listComponent.makeBackground;

var layoutUtil = __webpack_require__(224);

var curry = zrUtil.curry;
var each = zrUtil.each;
var Group = graphic.Group;

var _default = echarts.extendComponentView({
  type: 'legend.plain',
  newlineDisabled: false,

  /**
   * @override
   */
  init: function () {
    /**
     * @private
     * @type {module:zrender/container/Group}
     */
    this.group.add(this._contentGroup = new Group());
    /**
     * @private
     * @type {module:zrender/Element}
     */

    this._backgroundEl;
  },

  /**
   * @protected
   */
  getContentGroup: function () {
    return this._contentGroup;
  },

  /**
   * @override
   */
  render: function (legendModel, ecModel, api) {
    this.resetInner();

    if (!legendModel.get('show', true)) {
      return;
    }

    var itemAlign = legendModel.get('align');

    if (!itemAlign || itemAlign === 'auto') {
      itemAlign = legendModel.get('left') === 'right' && legendModel.get('orient') === 'vertical' ? 'right' : 'left';
    }

    this.renderInner(itemAlign, legendModel, ecModel, api); // Perform layout.

    var positionInfo = legendModel.getBoxLayoutParams();
    var viewportSize = {
      width: api.getWidth(),
      height: api.getHeight()
    };
    var padding = legendModel.get('padding');
    var maxSize = layoutUtil.getLayoutRect(positionInfo, viewportSize, padding);
    var mainRect = this.layoutInner(legendModel, itemAlign, maxSize); // Place mainGroup, based on the calculated `mainRect`.

    var layoutRect = layoutUtil.getLayoutRect(zrUtil.defaults({
      width: mainRect.width,
      height: mainRect.height
    }, positionInfo), viewportSize, padding);
    this.group.attr('position', [layoutRect.x - mainRect.x, layoutRect.y - mainRect.y]); // Render background after group is layout.

    this.group.add(this._backgroundEl = makeBackground(mainRect, legendModel));
  },

  /**
   * @protected
   */
  resetInner: function () {
    this.getContentGroup().removeAll();
    this._backgroundEl && this.group.remove(this._backgroundEl);
  },

  /**
   * @protected
   */
  renderInner: function (itemAlign, legendModel, ecModel, api) {
    var contentGroup = this.getContentGroup();
    var legendDrawnMap = zrUtil.createHashMap();
    var selectMode = legendModel.get('selectedMode');
    each(legendModel.getData(), function (itemModel, dataIndex) {
      var name = itemModel.get('name'); // Use empty string or \n as a newline string

      if (!this.newlineDisabled && (name === '' || name === '\n')) {
        contentGroup.add(new Group({
          newline: true
        }));
        return;
      }

      var seriesModel = ecModel.getSeriesByName(name)[0];

      if (legendDrawnMap.get(name)) {
        // Have been drawed
        return;
      } // Series legend


      if (seriesModel) {
        var data = seriesModel.getData();
        var color = data.getVisual('color'); // If color is a callback function

        if (typeof color === 'function') {
          // Use the first data
          color = color(seriesModel.getDataParams(0));
        } // Using rect symbol defaultly


        var legendSymbolType = data.getVisual('legendSymbol') || 'roundRect';
        var symbolType = data.getVisual('symbol');

        var itemGroup = this._createItem(name, dataIndex, itemModel, legendModel, legendSymbolType, symbolType, itemAlign, color, selectMode);

        itemGroup.on('click', curry(dispatchSelectAction, name, api)).on('mouseover', curry(dispatchHighlightAction, seriesModel, null, api)).on('mouseout', curry(dispatchDownplayAction, seriesModel, null, api));
        legendDrawnMap.set(name, true);
      } else {
        // Data legend of pie, funnel
        ecModel.eachRawSeries(function (seriesModel) {
          // In case multiple series has same data name
          if (legendDrawnMap.get(name)) {
            return;
          }

          if (seriesModel.legendDataProvider) {
            var data = seriesModel.legendDataProvider();
            var idx = data.indexOfName(name);

            if (idx < 0) {
              return;
            }

            var color = data.getItemVisual(idx, 'color');
            var legendSymbolType = 'roundRect';

            var itemGroup = this._createItem(name, dataIndex, itemModel, legendModel, legendSymbolType, null, itemAlign, color, selectMode);

            itemGroup.on('click', curry(dispatchSelectAction, name, api)) // FIXME Should not specify the series name
            .on('mouseover', curry(dispatchHighlightAction, seriesModel, name, api)).on('mouseout', curry(dispatchDownplayAction, seriesModel, name, api));
            legendDrawnMap.set(name, true);
          }
        }, this);
      }
    }, this);
  },
  _createItem: function (name, dataIndex, itemModel, legendModel, legendSymbolType, symbolType, itemAlign, color, selectMode) {
    var itemWidth = legendModel.get('itemWidth');
    var itemHeight = legendModel.get('itemHeight');
    var inactiveColor = legendModel.get('inactiveColor');
    var isSelected = legendModel.isSelected(name);
    var itemGroup = new Group();
    var textStyleModel = itemModel.getModel('textStyle');
    var itemIcon = itemModel.get('icon');
    var tooltipModel = itemModel.getModel('tooltip');
    var legendGlobalTooltipModel = tooltipModel.parentModel; // Use user given icon first

    legendSymbolType = itemIcon || legendSymbolType;
    itemGroup.add(createSymbol(legendSymbolType, 0, 0, itemWidth, itemHeight, isSelected ? color : inactiveColor, true)); // Compose symbols
    // PENDING

    if (!itemIcon && symbolType // At least show one symbol, can't be all none
    && (symbolType !== legendSymbolType || symbolType == 'none')) {
      var size = itemHeight * 0.8;

      if (symbolType === 'none') {
        symbolType = 'circle';
      } // Put symbol in the center


      itemGroup.add(createSymbol(symbolType, (itemWidth - size) / 2, (itemHeight - size) / 2, size, size, isSelected ? color : inactiveColor));
    }

    var textX = itemAlign === 'left' ? itemWidth + 5 : -5;
    var textAlign = itemAlign;
    var formatter = legendModel.get('formatter');
    var content = name;

    if (typeof formatter === 'string' && formatter) {
      content = formatter.replace('{name}', name != null ? name : '');
    } else if (typeof formatter === 'function') {
      content = formatter(name);
    }

    itemGroup.add(new graphic.Text({
      style: graphic.setTextStyle({}, textStyleModel, {
        text: content,
        x: textX,
        y: itemHeight / 2,
        textFill: isSelected ? textStyleModel.getTextColor() : inactiveColor,
        textAlign: textAlign,
        textVerticalAlign: 'middle'
      })
    })); // Add a invisible rect to increase the area of mouse hover

    var hitRect = new graphic.Rect({
      shape: itemGroup.getBoundingRect(),
      invisible: true,
      tooltip: tooltipModel.get('show') ? zrUtil.extend({
        content: name,
        // Defaul formatter
        formatter: legendGlobalTooltipModel.get('formatter', true) || function () {
          return name;
        },
        formatterParams: {
          componentType: 'legend',
          legendIndex: legendModel.componentIndex,
          name: name,
          $vars: ['name']
        }
      }, tooltipModel.option) : null
    });
    itemGroup.add(hitRect);
    itemGroup.eachChild(function (child) {
      child.silent = true;
    });
    hitRect.silent = !selectMode;
    this.getContentGroup().add(itemGroup);
    graphic.setHoverStyle(itemGroup);
    itemGroup.__legendDataIndex = dataIndex;
    return itemGroup;
  },

  /**
   * @protected
   */
  layoutInner: function (legendModel, itemAlign, maxSize) {
    var contentGroup = this.getContentGroup(); // Place items in contentGroup.

    layoutUtil.box(legendModel.get('orient'), contentGroup, legendModel.get('itemGap'), maxSize.width, maxSize.height);
    var contentRect = contentGroup.getBoundingRect();
    contentGroup.attr('position', [-contentRect.x, -contentRect.y]);
    return this.group.getBoundingRect();
  }
});

function dispatchSelectAction(name, api) {
  api.dispatchAction({
    type: 'legendToggleSelect',
    name: name
  });
}

function dispatchHighlightAction(seriesModel, dataName, api) {
  // If element hover will move to a hoverLayer.
  var el = api.getZr().storage.getDisplayList()[0];

  if (!(el && el.useHoverLayer)) {
    seriesModel.get('legendHoverLink') && api.dispatchAction({
      type: 'highlight',
      seriesName: seriesModel.name,
      name: dataName
    });
  }
}

function dispatchDownplayAction(seriesModel, dataName, api) {
  // If element hover will move to a hoverLayer.
  var el = api.getZr().storage.getDisplayList()[0];

  if (!(el && el.useHoverLayer)) {
    seriesModel.get('legendHoverLink') && api.dispatchAction({
      type: 'downplay',
      seriesName: seriesModel.name,
      name: dataName
    });
  }
}

module.exports = _default;

/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

var echarts = __webpack_require__(198);

var zrUtil = __webpack_require__(196);

function legendSelectActionHandler(methodName, payload, ecModel) {
  var selectedMap = {};
  var isToggleSelect = methodName === 'toggleSelected';
  var isSelected; // Update all legend components

  ecModel.eachComponent('legend', function (legendModel) {
    if (isToggleSelect && isSelected != null) {
      // Force other legend has same selected status
      // Or the first is toggled to true and other are toggled to false
      // In the case one legend has some item unSelected in option. And if other legend
      // doesn't has the item, they will assume it is selected.
      legendModel[isSelected ? 'select' : 'unSelect'](payload.name);
    } else {
      legendModel[methodName](payload.name);
      isSelected = legendModel.isSelected(payload.name);
    }

    var legendData = legendModel.getData();
    zrUtil.each(legendData, function (model) {
      var name = model.get('name'); // Wrap element

      if (name === '\n' || name === '') {
        return;
      }

      var isItemSelected = legendModel.isSelected(name);

      if (selectedMap.hasOwnProperty(name)) {
        // Unselected if any legend is unselected
        selectedMap[name] = selectedMap[name] && isItemSelected;
      } else {
        selectedMap[name] = isItemSelected;
      }
    });
  }); // Return the event explicitly

  return {
    name: payload.name,
    selected: selectedMap
  };
}
/**
 * @event legendToggleSelect
 * @type {Object}
 * @property {string} type 'legendToggleSelect'
 * @property {string} [from]
 * @property {string} name Series name or data item name
 */


echarts.registerAction('legendToggleSelect', 'legendselectchanged', zrUtil.curry(legendSelectActionHandler, 'toggleSelected'));
/**
 * @event legendSelect
 * @type {Object}
 * @property {string} type 'legendSelect'
 * @property {string} name Series name or data item name
 */

echarts.registerAction('legendSelect', 'legendselected', zrUtil.curry(legendSelectActionHandler, 'select'));
/**
 * @event legendUnSelect
 * @type {Object}
 * @property {string} type 'legendUnSelect'
 * @property {string} name Series name or data item name
 */

echarts.registerAction('legendUnSelect', 'legendunselected', zrUtil.curry(legendSelectActionHandler, 'unSelect'));

/***/ }),
/* 285 */
/***/ (function(module, exports) {

function _default(ecModel) {
  var legendModels = ecModel.findComponents({
    mainType: 'legend'
  });

  if (legendModels && legendModels.length) {
    ecModel.filterSeries(function (series) {
      // If in any legend component the status is not selected.
      // Because in legend series is assumed selected when it is not in the legend data.
      for (var i = 0; i < legendModels.length; i++) {
        if (!legendModels[i].isSelected(series.name)) {
          return false;
        }
      }

      return true;
    });
  }
}

module.exports = _default;

/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

var echarts = __webpack_require__(198);

var graphic = __webpack_require__(200);

var _layout = __webpack_require__(224);

var getLayoutRect = _layout.getLayoutRect;
// Model
echarts.extendComponentModel({
  type: 'title',
  layoutMode: {
    type: 'box',
    ignoreSize: true
  },
  defaultOption: {
    // 一级层叠
    zlevel: 0,
    // 二级层叠
    z: 6,
    show: true,
    text: '',
    // 超链接跳转
    // link: null,
    // 仅支持self | blank
    target: 'blank',
    subtext: '',
    // 超链接跳转
    // sublink: null,
    // 仅支持self | blank
    subtarget: 'blank',
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    left: 0,
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    top: 0,
    // 水平对齐
    // 'auto' | 'left' | 'right' | 'center'
    // 默认根据 left 的位置判断是左对齐还是右对齐
    // textAlign: null
    //
    // 垂直对齐
    // 'auto' | 'top' | 'bottom' | 'middle'
    // 默认根据 top 位置判断是上对齐还是下对齐
    // textBaseline: null
    backgroundColor: 'rgba(0,0,0,0)',
    // 标题边框颜色
    borderColor: '#ccc',
    // 标题边框线宽，单位px，默认为0（无边框）
    borderWidth: 0,
    // 标题内边距，单位px，默认各方向内边距为5，
    // 接受数组分别设定上右下左边距，同css
    padding: 5,
    // 主副标题纵向间隔，单位px，默认为10，
    itemGap: 10,
    textStyle: {
      fontSize: 18,
      fontWeight: 'bolder',
      color: '#333'
    },
    subtextStyle: {
      color: '#aaa'
    }
  }
}); // View

echarts.extendComponentView({
  type: 'title',
  render: function (titleModel, ecModel, api) {
    this.group.removeAll();

    if (!titleModel.get('show')) {
      return;
    }

    var group = this.group;
    var textStyleModel = titleModel.getModel('textStyle');
    var subtextStyleModel = titleModel.getModel('subtextStyle');
    var textAlign = titleModel.get('textAlign');
    var textBaseline = titleModel.get('textBaseline');
    var textEl = new graphic.Text({
      style: graphic.setTextStyle({}, textStyleModel, {
        text: titleModel.get('text'),
        textFill: textStyleModel.getTextColor()
      }, {
        disableBox: true
      }),
      z2: 10
    });
    var textRect = textEl.getBoundingRect();
    var subText = titleModel.get('subtext');
    var subTextEl = new graphic.Text({
      style: graphic.setTextStyle({}, subtextStyleModel, {
        text: subText,
        textFill: subtextStyleModel.getTextColor(),
        y: textRect.height + titleModel.get('itemGap'),
        textVerticalAlign: 'top'
      }, {
        disableBox: true
      }),
      z2: 10
    });
    var link = titleModel.get('link');
    var sublink = titleModel.get('sublink');
    textEl.silent = !link;
    subTextEl.silent = !sublink;

    if (link) {
      textEl.on('click', function () {
        window.open(link, '_' + titleModel.get('target'));
      });
    }

    if (sublink) {
      subTextEl.on('click', function () {
        window.open(sublink, '_' + titleModel.get('subtarget'));
      });
    }

    group.add(textEl);
    subText && group.add(subTextEl); // If no subText, but add subTextEl, there will be an empty line.

    var groupRect = group.getBoundingRect();
    var layoutOption = titleModel.getBoxLayoutParams();
    layoutOption.width = groupRect.width;
    layoutOption.height = groupRect.height;
    var layoutRect = getLayoutRect(layoutOption, {
      width: api.getWidth(),
      height: api.getHeight()
    }, titleModel.get('padding')); // Adjust text align based on position

    if (!textAlign) {
      // Align left if title is on the left. center and right is same
      textAlign = titleModel.get('left') || titleModel.get('right');

      if (textAlign === 'middle') {
        textAlign = 'center';
      } // Adjust layout by text align


      if (textAlign === 'right') {
        layoutRect.x += layoutRect.width;
      } else if (textAlign === 'center') {
        layoutRect.x += layoutRect.width / 2;
      }
    }

    if (!textBaseline) {
      textBaseline = titleModel.get('top') || titleModel.get('bottom');

      if (textBaseline === 'center') {
        textBaseline = 'middle';
      }

      if (textBaseline === 'bottom') {
        layoutRect.y += layoutRect.height;
      } else if (textBaseline === 'middle') {
        layoutRect.y += layoutRect.height / 2;
      }

      textBaseline = textBaseline || 'top';
    }

    group.attr('position', [layoutRect.x, layoutRect.y]);
    var alignStyle = {
      textAlign: textAlign,
      textVerticalAlign: textBaseline
    };
    textEl.setStyle(alignStyle);
    subTextEl.setStyle(alignStyle); // Render background
    // Get groupRect again because textAlign has been changed

    groupRect = group.getBoundingRect();
    var padding = layoutRect.margin;
    var style = titleModel.getItemStyle(['color', 'opacity']);
    style.fill = titleModel.get('backgroundColor');
    var rect = new graphic.Rect({
      shape: {
        x: groupRect.x - padding[3],
        y: groupRect.y - padding[0],
        width: groupRect.width + padding[1] + padding[3],
        height: groupRect.height + padding[0] + padding[2],
        r: titleModel.get('borderRadius')
      },
      style: style,
      silent: true
    });
    graphic.subPixelOptimizeRect(rect);
    group.add(rect);
  }
});

/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

var BoundingRect = __webpack_require__(214);

var bbox = __webpack_require__(262);

var vec2 = __webpack_require__(203);

var polygonContain = __webpack_require__(318);

/**
 * @module echarts/coord/geo/Region
 */

/**
 * @param {string} name
 * @param {Array} geometries
 * @param {Array.<number>} cp
 */
function Region(name, geometries, cp) {
  /**
   * @type {string}
   * @readOnly
   */
  this.name = name;
  /**
   * @type {Array.<Array>}
   * @readOnly
   */

  this.geometries = geometries;

  if (!cp) {
    var rect = this.getBoundingRect();
    cp = [rect.x + rect.width / 2, rect.y + rect.height / 2];
  } else {
    cp = [cp[0], cp[1]];
  }
  /**
   * @type {Array.<number>}
   */


  this.center = cp;
}

Region.prototype = {
  constructor: Region,
  properties: null,

  /**
   * @return {module:zrender/core/BoundingRect}
   */
  getBoundingRect: function () {
    var rect = this._rect;

    if (rect) {
      return rect;
    }

    var MAX_NUMBER = Number.MAX_VALUE;
    var min = [MAX_NUMBER, MAX_NUMBER];
    var max = [-MAX_NUMBER, -MAX_NUMBER];
    var min2 = [];
    var max2 = [];
    var geometries = this.geometries;

    for (var i = 0; i < geometries.length; i++) {
      // Only support polygon
      if (geometries[i].type !== 'polygon') {
        continue;
      } // Doesn't consider hole


      var exterior = geometries[i].exterior;
      bbox.fromPoints(exterior, min2, max2);
      vec2.min(min, min, min2);
      vec2.max(max, max, max2);
    } // No data


    if (i === 0) {
      min[0] = min[1] = max[0] = max[1] = 0;
    }

    return this._rect = new BoundingRect(min[0], min[1], max[0] - min[0], max[1] - min[1]);
  },

  /**
   * @param {<Array.<number>} coord
   * @return {boolean}
   */
  contain: function (coord) {
    var rect = this.getBoundingRect();
    var geometries = this.geometries;

    if (!rect.contain(coord[0], coord[1])) {
      return false;
    }

    loopGeo: for (var i = 0, len = geometries.length; i < len; i++) {
      // Only support polygon.
      if (geometries[i].type !== 'polygon') {
        continue;
      }

      var exterior = geometries[i].exterior;
      var interiors = geometries[i].interiors;

      if (polygonContain.contain(exterior, coord[0], coord[1])) {
        // Not in the region if point is in the hole.
        for (var k = 0; k < (interiors ? interiors.length : 0); k++) {
          if (polygonContain.contain(interiors[k])) {
            continue loopGeo;
          }
        }

        return true;
      }
    }

    return false;
  },
  transformTo: function (x, y, width, height) {
    var rect = this.getBoundingRect();
    var aspect = rect.width / rect.height;

    if (!width) {
      width = aspect * height;
    } else if (!height) {
      height = width / aspect;
    }

    var target = new BoundingRect(x, y, width, height);
    var transform = rect.calculateTransform(target);
    var geometries = this.geometries;

    for (var i = 0; i < geometries.length; i++) {
      // Only support polygon.
      if (geometries[i].type !== 'polygon') {
        continue;
      }

      var exterior = geometries[i].exterior;
      var interiors = geometries[i].interiors;

      for (var p = 0; p < exterior.length; p++) {
        vec2.applyTransform(exterior[p], exterior[p], transform);
      }

      for (var h = 0; h < (interiors ? interiors.length : 0); h++) {
        for (var p = 0; p < interiors[h].length; p++) {
          vec2.applyTransform(interiors[h][p], interiors[h][p], transform);
        }
      }
    }

    rect = this._rect;
    rect.copy(target); // Update center

    this.center = [rect.x + rect.width / 2, rect.y + rect.height / 2];
  }
};
var _default = Region;
module.exports = _default;

/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var Region = __webpack_require__(287);

/**
 * Parse and decode geo json
 * @module echarts/coord/geo/parseGeoJson
 */
function decode(json) {
  if (!json.UTF8Encoding) {
    return json;
  }

  var encodeScale = json.UTF8Scale;

  if (encodeScale == null) {
    encodeScale = 1024;
  }

  var features = json.features;

  for (var f = 0; f < features.length; f++) {
    var feature = features[f];
    var geometry = feature.geometry;
    var coordinates = geometry.coordinates;
    var encodeOffsets = geometry.encodeOffsets;

    for (var c = 0; c < coordinates.length; c++) {
      var coordinate = coordinates[c];

      if (geometry.type === 'Polygon') {
        coordinates[c] = decodePolygon(coordinate, encodeOffsets[c], encodeScale);
      } else if (geometry.type === 'MultiPolygon') {
        for (var c2 = 0; c2 < coordinate.length; c2++) {
          var polygon = coordinate[c2];
          coordinate[c2] = decodePolygon(polygon, encodeOffsets[c][c2], encodeScale);
        }
      }
    }
  } // Has been decoded


  json.UTF8Encoding = false;
  return json;
}

function decodePolygon(coordinate, encodeOffsets, encodeScale) {
  var result = [];
  var prevX = encodeOffsets[0];
  var prevY = encodeOffsets[1];

  for (var i = 0; i < coordinate.length; i += 2) {
    var x = coordinate.charCodeAt(i) - 64;
    var y = coordinate.charCodeAt(i + 1) - 64; // ZigZag decoding

    x = x >> 1 ^ -(x & 1);
    y = y >> 1 ^ -(y & 1); // Delta deocding

    x += prevX;
    y += prevY;
    prevX = x;
    prevY = y; // Dequantize

    result.push([x / encodeScale, y / encodeScale]);
  }

  return result;
}
/**
 * @alias module:echarts/coord/geo/parseGeoJson
 * @param {Object} geoJson
 * @return {module:zrender/container/Group}
 */


function _default(geoJson) {
  decode(geoJson);
  return zrUtil.map(zrUtil.filter(geoJson.features, function (featureObj) {
    // Output of mapshaper may have geometry null
    return featureObj.geometry && featureObj.properties && featureObj.geometry.coordinates.length > 0;
  }), function (featureObj) {
    var properties = featureObj.properties;
    var geo = featureObj.geometry;
    var coordinates = geo.coordinates;
    var geometries = [];

    if (geo.type === 'Polygon') {
      geometries.push({
        type: 'polygon',
        // According to the GeoJSON specification.
        // First must be exterior, and the rest are all interior(holes).
        exterior: coordinates[0],
        interiors: coordinates.slice(1)
      });
    }

    if (geo.type === 'MultiPolygon') {
      zrUtil.each(coordinates, function (item) {
        if (item[0]) {
          geometries.push({
            type: 'polygon',
            exterior: item[0],
            interiors: item.slice(1)
          });
        }
      });
    }

    var region = new Region(properties.name, geometries, properties.cp);
    region.properties = properties;
    return region;
  });
}

module.exports = _default;

/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

var zrender = __webpack_require__(272);

exports.zrender = zrender;

var matrix = __webpack_require__(228);

exports.matrix = matrix;

var vector = __webpack_require__(203);

exports.vector = vector;

var zrUtil = __webpack_require__(196);

var colorTool = __webpack_require__(231);

exports.color = colorTool;

var graphic = __webpack_require__(200);

exports.graphic = graphic;

var numberUtil = __webpack_require__(202);

exports.number = numberUtil;

var formatUtil = __webpack_require__(217);

exports.format = formatUtil;

var _throttle = __webpack_require__(248);

var throttle = _throttle.throttle;
exports.throttle = _throttle.throttle;

var ecHelper = __webpack_require__(290);

exports.helper = ecHelper;

var _List = __webpack_require__(238);

exports.List = _List;

var _Model = __webpack_require__(221);

exports.Model = _Model;

var _Axis = __webpack_require__(275);

exports.Axis = _Axis;

var _env = __webpack_require__(213);

exports.env = _env;

var _parseGeoJson = __webpack_require__(288);

exports.parseGeoJson = _parseGeoJson;

/**
 * Do not mount those modules on 'src/echarts' for better tree shaking.
 */
var ecUtil = {};
zrUtil.each(['map', 'each', 'filter', 'indexOf', 'inherits', 'reduce', 'filter', 'bind', 'curry', 'isArray', 'isString', 'isObject', 'isFunction', 'extend', 'defaults', 'clone', 'merge'], function (name) {
  ecUtil[name] = zrUtil[name];
});
exports.util = ecUtil;

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var createListFromArray = __webpack_require__(249);

var axisHelper = __webpack_require__(229);

var axisModelCommonMixin = __webpack_require__(276);

var Model = __webpack_require__(221);

var _completeDimensions = __webpack_require__(247);

exports.completeDimensions = _completeDimensions;

var _symbol = __webpack_require__(241);

exports.createSymbol = _symbol.createSymbol;

/**
 * Create a muti dimension List structure from seriesModel.
 * @param  {module:echarts/model/Model} seriesModel
 * @return {module:echarts/data/List} list
 */
function createList(seriesModel) {
  var data = seriesModel.get('data');
  return createListFromArray(data, seriesModel, seriesModel.ecModel);
}
/**
 * @see {module:echarts/data/helper/completeDimensions}
 */


/**
 * Create scale
 * @param {Array.<number>} dataExtent
 * @param {Object|module:echarts/Model} option
 */
function createScale(dataExtent, option) {
  var axisModel = option;

  if (!(option instanceof Model)) {
    axisModel = new Model(option);
    zrUtil.mixin(axisModel, axisModelCommonMixin);
  }

  var scale = axisHelper.createScaleByModel(axisModel);
  scale.setExtent(dataExtent[0], dataExtent[1]);
  axisHelper.niceScaleExtent(scale, axisModel);
  return scale;
}
/**
 * Mixin common methods to axis model,
 *
 * Inlcude methods
 * `getFormattedLabels() => Array.<string>`
 * `getCategories() => Array.<string>`
 * `getMin(origin: boolean) => number`
 * `getMax(origin: boolean) => number`
 * `getNeedCrossZero() => boolean`
 * `setRange(start: number, end: number)`
 * `resetRange()`
 */


function mixinAxisModelCommonMethods(Model) {
  zrUtil.mixin(Model, axisModelCommonMixin);
}

exports.createList = createList;
exports.createScale = createScale;
exports.mixinAxisModelCommonMethods = mixinAxisModelCommonMethods;

/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var graphic = __webpack_require__(200);

var PI = Math.PI;
/**
 * @param {module:echarts/ExtensionAPI} api
 * @param {Object} [opts]
 * @param {string} [opts.text]
 * @param {string} [opts.color]
 * @param {string} [opts.textColor]
 * @return {module:zrender/Element}
 */

function _default(api, opts) {
  opts = opts || {};
  zrUtil.defaults(opts, {
    text: 'loading',
    color: '#c23531',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  });
  var mask = new graphic.Rect({
    style: {
      fill: opts.maskColor
    },
    zlevel: opts.zlevel,
    z: 10000
  });
  var arc = new graphic.Arc({
    shape: {
      startAngle: -PI / 2,
      endAngle: -PI / 2 + 0.1,
      r: 10
    },
    style: {
      stroke: opts.color,
      lineCap: 'round',
      lineWidth: 5
    },
    zlevel: opts.zlevel,
    z: 10001
  });
  var labelRect = new graphic.Rect({
    style: {
      fill: 'none',
      text: opts.text,
      textPosition: 'right',
      textDistance: 10,
      textFill: opts.textColor
    },
    zlevel: opts.zlevel,
    z: 10001
  });
  arc.animateShape(true).when(1000, {
    endAngle: PI * 3 / 2
  }).start('circularInOut');
  arc.animateShape(true).when(1000, {
    startAngle: PI * 3 / 2
  }).delay(300).start('circularInOut');
  var group = new graphic.Group();
  group.add(arc);
  group.add(labelRect);
  group.add(mask); // Inject resize

  group.resize = function () {
    var cx = api.getWidth() / 2;
    var cy = api.getHeight() / 2;
    arc.setShape({
      cx: cx,
      cy: cy
    });
    var r = arc.shape.r;
    labelRect.setShape({
      x: cx - r,
      y: cy - r,
      width: r * 2,
      height: r * 2
    });
    mask.setShape({
      x: 0,
      y: 0,
      width: api.getWidth(),
      height: api.getHeight()
    });
  };

  group.resize();
  return group;
}

module.exports = _default;

/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

var _config = __webpack_require__(211);

var __DEV__ = _config.__DEV__;

var zrUtil = __webpack_require__(196);

var modelUtil = __webpack_require__(201);

var Model = __webpack_require__(221);

var ComponentModel = __webpack_require__(223);

var globalDefault = __webpack_require__(294);

var colorPaletteMinin = __webpack_require__(253);

/**
 * ECharts global model
 *
 * @module {echarts/model/Global}
 */

/**
 * Caution: If the mechanism should be changed some day, these cases
 * should be considered:
 *
 * (1) In `merge option` mode, if using the same option to call `setOption`
 * many times, the result should be the same (try our best to ensure that).
 * (2) In `merge option` mode, if a component has no id/name specified, it
 * will be merged by index, and the result sequence of the components is
 * consistent to the original sequence.
 * (3) `reset` feature (in toolbox). Find detailed info in comments about
 * `mergeOption` in module:echarts/model/OptionManager.
 */
var each = zrUtil.each;
var filter = zrUtil.filter;
var map = zrUtil.map;
var isArray = zrUtil.isArray;
var indexOf = zrUtil.indexOf;
var isObject = zrUtil.isObject;
var OPTION_INNER_KEY = '\0_ec_inner';
/**
 * @alias module:echarts/model/Global
 *
 * @param {Object} option
 * @param {module:echarts/model/Model} parentModel
 * @param {Object} theme
 */

var GlobalModel = Model.extend({
  constructor: GlobalModel,
  init: function (option, parentModel, theme, optionManager) {
    theme = theme || {};
    this.option = null; // Mark as not initialized.

    /**
     * @type {module:echarts/model/Model}
     * @private
     */

    this._theme = new Model(theme);
    /**
     * @type {module:echarts/model/OptionManager}
     */

    this._optionManager = optionManager;
  },
  setOption: function (option, optionPreprocessorFuncs) {
    zrUtil.assert(!(OPTION_INNER_KEY in option), 'please use chart.getOption()');

    this._optionManager.setOption(option, optionPreprocessorFuncs);

    this.resetOption(null);
  },

  /**
   * @param {string} type null/undefined: reset all.
   *                      'recreate': force recreate all.
   *                      'timeline': only reset timeline option
   *                      'media': only reset media query option
   * @return {boolean} Whether option changed.
   */
  resetOption: function (type) {
    var optionChanged = false;
    var optionManager = this._optionManager;

    if (!type || type === 'recreate') {
      var baseOption = optionManager.mountOption(type === 'recreate');

      if (!this.option || type === 'recreate') {
        initBase.call(this, baseOption);
      } else {
        this.restoreData();
        this.mergeOption(baseOption);
      }

      optionChanged = true;
    }

    if (type === 'timeline' || type === 'media') {
      this.restoreData();
    }

    if (!type || type === 'recreate' || type === 'timeline') {
      var timelineOption = optionManager.getTimelineOption(this);
      timelineOption && (this.mergeOption(timelineOption), optionChanged = true);
    }

    if (!type || type === 'recreate' || type === 'media') {
      var mediaOptions = optionManager.getMediaOption(this, this._api);

      if (mediaOptions.length) {
        each(mediaOptions, function (mediaOption) {
          this.mergeOption(mediaOption, optionChanged = true);
        }, this);
      }
    }

    return optionChanged;
  },

  /**
   * @protected
   */
  mergeOption: function (newOption) {
    var option = this.option;
    var componentsMap = this._componentsMap;
    var newCptTypes = []; // 如果不存在对应的 component model 则直接 merge

    each(newOption, function (componentOption, mainType) {
      if (componentOption == null) {
        return;
      }

      if (!ComponentModel.hasClass(mainType)) {
        option[mainType] = option[mainType] == null ? zrUtil.clone(componentOption) : zrUtil.merge(option[mainType], componentOption, true);
      } else {
        newCptTypes.push(mainType);
      }
    }); // FIXME OPTION 同步是否要改回原来的

    ComponentModel.topologicalTravel(newCptTypes, ComponentModel.getAllClassMainTypes(), visitComponent, this);
    this._seriesIndices = this._seriesIndices || [];

    function visitComponent(mainType, dependencies) {
      var newCptOptionList = modelUtil.normalizeToArray(newOption[mainType]);
      var mapResult = modelUtil.mappingToExists(componentsMap.get(mainType), newCptOptionList);
      modelUtil.makeIdAndName(mapResult); // Set mainType and complete subType.

      each(mapResult, function (item, index) {
        var opt = item.option;

        if (isObject(opt)) {
          item.keyInfo.mainType = mainType;
          item.keyInfo.subType = determineSubType(mainType, opt, item.exist);
        }
      });
      var dependentModels = getComponentsByTypes(componentsMap, dependencies);
      option[mainType] = [];
      componentsMap.set(mainType, []);
      each(mapResult, function (resultItem, index) {
        var componentModel = resultItem.exist;
        var newCptOption = resultItem.option;
        zrUtil.assert(isObject(newCptOption) || componentModel, 'Empty component definition'); // Consider where is no new option and should be merged using {},
        // see removeEdgeAndAdd in topologicalTravel and
        // ComponentModel.getAllClassMainTypes.

        if (!newCptOption) {
          componentModel.mergeOption({}, this);
          componentModel.optionUpdated({}, false);
        } else {
          var ComponentModelClass = ComponentModel.getClass(mainType, resultItem.keyInfo.subType, true);

          if (componentModel && componentModel instanceof ComponentModelClass) {
            componentModel.name = resultItem.keyInfo.name;
            componentModel.mergeOption(newCptOption, this);
            componentModel.optionUpdated(newCptOption, false);
          } else {
            // PENDING Global as parent ?
            var extraOpt = zrUtil.extend({
              dependentModels: dependentModels,
              componentIndex: index
            }, resultItem.keyInfo);
            componentModel = new ComponentModelClass(newCptOption, this, this, extraOpt);
            zrUtil.extend(componentModel, extraOpt);
            componentModel.init(newCptOption, this, this, extraOpt); // Call optionUpdated after init.
            // newCptOption has been used as componentModel.option
            // and may be merged with theme and default, so pass null
            // to avoid confusion.

            componentModel.optionUpdated(null, true);
          }
        }

        componentsMap.get(mainType)[index] = componentModel;
        option[mainType][index] = componentModel.option;
      }, this); // Backup series for filtering.

      if (mainType === 'series') {
        this._seriesIndices = createSeriesIndices(componentsMap.get('series'));
      }
    }
  },

  /**
   * Get option for output (cloned option and inner info removed)
   * @public
   * @return {Object}
   */
  getOption: function () {
    var option = zrUtil.clone(this.option);
    each(option, function (opts, mainType) {
      if (ComponentModel.hasClass(mainType)) {
        var opts = modelUtil.normalizeToArray(opts);

        for (var i = opts.length - 1; i >= 0; i--) {
          // Remove options with inner id.
          if (modelUtil.isIdInner(opts[i])) {
            opts.splice(i, 1);
          }
        }

        option[mainType] = opts;
      }
    });
    delete option[OPTION_INNER_KEY];
    return option;
  },

  /**
   * @return {module:echarts/model/Model}
   */
  getTheme: function () {
    return this._theme;
  },

  /**
   * @param {string} mainType
   * @param {number} [idx=0]
   * @return {module:echarts/model/Component}
   */
  getComponent: function (mainType, idx) {
    var list = this._componentsMap.get(mainType);

    if (list) {
      return list[idx || 0];
    }
  },

  /**
   * If none of index and id and name used, return all components with mainType.
   * @param {Object} condition
   * @param {string} condition.mainType
   * @param {string} [condition.subType] If ignore, only query by mainType
   * @param {number|Array.<number>} [condition.index] Either input index or id or name.
   * @param {string|Array.<string>} [condition.id] Either input index or id or name.
   * @param {string|Array.<string>} [condition.name] Either input index or id or name.
   * @return {Array.<module:echarts/model/Component>}
   */
  queryComponents: function (condition) {
    var mainType = condition.mainType;

    if (!mainType) {
      return [];
    }

    var index = condition.index;
    var id = condition.id;
    var name = condition.name;

    var cpts = this._componentsMap.get(mainType);

    if (!cpts || !cpts.length) {
      return [];
    }

    var result;

    if (index != null) {
      if (!isArray(index)) {
        index = [index];
      }

      result = filter(map(index, function (idx) {
        return cpts[idx];
      }), function (val) {
        return !!val;
      });
    } else if (id != null) {
      var isIdArray = isArray(id);
      result = filter(cpts, function (cpt) {
        return isIdArray && indexOf(id, cpt.id) >= 0 || !isIdArray && cpt.id === id;
      });
    } else if (name != null) {
      var isNameArray = isArray(name);
      result = filter(cpts, function (cpt) {
        return isNameArray && indexOf(name, cpt.name) >= 0 || !isNameArray && cpt.name === name;
      });
    } else {
      // Return all components with mainType
      result = cpts.slice();
    }

    return filterBySubType(result, condition);
  },

  /**
   * The interface is different from queryComponents,
   * which is convenient for inner usage.
   *
   * @usage
   * var result = findComponents(
   *     {mainType: 'dataZoom', query: {dataZoomId: 'abc'}}
   * );
   * var result = findComponents(
   *     {mainType: 'series', subType: 'pie', query: {seriesName: 'uio'}}
   * );
   * var result = findComponents(
   *     {mainType: 'series'},
   *     function (model, index) {...}
   * );
   * // result like [component0, componnet1, ...]
   *
   * @param {Object} condition
   * @param {string} condition.mainType Mandatory.
   * @param {string} [condition.subType] Optional.
   * @param {Object} [condition.query] like {xxxIndex, xxxId, xxxName},
   *        where xxx is mainType.
   *        If query attribute is null/undefined or has no index/id/name,
   *        do not filtering by query conditions, which is convenient for
   *        no-payload situations or when target of action is global.
   * @param {Function} [condition.filter] parameter: component, return boolean.
   * @return {Array.<module:echarts/model/Component>}
   */
  findComponents: function (condition) {
    var query = condition.query;
    var mainType = condition.mainType;
    var queryCond = getQueryCond(query);
    var result = queryCond ? this.queryComponents(queryCond) : this._componentsMap.get(mainType);
    return doFilter(filterBySubType(result, condition));

    function getQueryCond(q) {
      var indexAttr = mainType + 'Index';
      var idAttr = mainType + 'Id';
      var nameAttr = mainType + 'Name';
      return q && (q[indexAttr] != null || q[idAttr] != null || q[nameAttr] != null) ? {
        mainType: mainType,
        // subType will be filtered finally.
        index: q[indexAttr],
        id: q[idAttr],
        name: q[nameAttr]
      } : null;
    }

    function doFilter(res) {
      return condition.filter ? filter(res, condition.filter) : res;
    }
  },

  /**
   * @usage
   * eachComponent('legend', function (legendModel, index) {
   *     ...
   * });
   * eachComponent(function (componentType, model, index) {
   *     // componentType does not include subType
   *     // (componentType is 'xxx' but not 'xxx.aa')
   * });
   * eachComponent(
   *     {mainType: 'dataZoom', query: {dataZoomId: 'abc'}},
   *     function (model, index) {...}
   * );
   * eachComponent(
   *     {mainType: 'series', subType: 'pie', query: {seriesName: 'uio'}},
   *     function (model, index) {...}
   * );
   *
   * @param {string|Object=} mainType When mainType is object, the definition
   *                                  is the same as the method 'findComponents'.
   * @param {Function} cb
   * @param {*} context
   */
  eachComponent: function (mainType, cb, context) {
    var componentsMap = this._componentsMap;

    if (typeof mainType === 'function') {
      context = cb;
      cb = mainType;
      componentsMap.each(function (components, componentType) {
        each(components, function (component, index) {
          cb.call(context, componentType, component, index);
        });
      });
    } else if (zrUtil.isString(mainType)) {
      each(componentsMap.get(mainType), cb, context);
    } else if (isObject(mainType)) {
      var queryResult = this.findComponents(mainType);
      each(queryResult, cb, context);
    }
  },

  /**
   * @param {string} name
   * @return {Array.<module:echarts/model/Series>}
   */
  getSeriesByName: function (name) {
    var series = this._componentsMap.get('series');

    return filter(series, function (oneSeries) {
      return oneSeries.name === name;
    });
  },

  /**
   * @param {number} seriesIndex
   * @return {module:echarts/model/Series}
   */
  getSeriesByIndex: function (seriesIndex) {
    return this._componentsMap.get('series')[seriesIndex];
  },

  /**
   * @param {string} subType
   * @return {Array.<module:echarts/model/Series>}
   */
  getSeriesByType: function (subType) {
    var series = this._componentsMap.get('series');

    return filter(series, function (oneSeries) {
      return oneSeries.subType === subType;
    });
  },

  /**
   * @return {Array.<module:echarts/model/Series>}
   */
  getSeries: function () {
    return this._componentsMap.get('series').slice();
  },

  /**
   * After filtering, series may be different
   * frome raw series.
   *
   * @param {Function} cb
   * @param {*} context
   */
  eachSeries: function (cb, context) {
    assertSeriesInitialized(this);
    each(this._seriesIndices, function (rawSeriesIndex) {
      var series = this._componentsMap.get('series')[rawSeriesIndex];

      cb.call(context, series, rawSeriesIndex);
    }, this);
  },

  /**
   * Iterate raw series before filtered.
   *
   * @param {Function} cb
   * @param {*} context
   */
  eachRawSeries: function (cb, context) {
    each(this._componentsMap.get('series'), cb, context);
  },

  /**
   * After filtering, series may be different.
   * frome raw series.
   *
   * @parma {string} subType
   * @param {Function} cb
   * @param {*} context
   */
  eachSeriesByType: function (subType, cb, context) {
    assertSeriesInitialized(this);
    each(this._seriesIndices, function (rawSeriesIndex) {
      var series = this._componentsMap.get('series')[rawSeriesIndex];

      if (series.subType === subType) {
        cb.call(context, series, rawSeriesIndex);
      }
    }, this);
  },

  /**
   * Iterate raw series before filtered of given type.
   *
   * @parma {string} subType
   * @param {Function} cb
   * @param {*} context
   */
  eachRawSeriesByType: function (subType, cb, context) {
    return each(this.getSeriesByType(subType), cb, context);
  },

  /**
   * @param {module:echarts/model/Series} seriesModel
   */
  isSeriesFiltered: function (seriesModel) {
    assertSeriesInitialized(this);
    return zrUtil.indexOf(this._seriesIndices, seriesModel.componentIndex) < 0;
  },

  /**
   * @return {Array.<number>}
   */
  getCurrentSeriesIndices: function () {
    return (this._seriesIndices || []).slice();
  },

  /**
   * @param {Function} cb
   * @param {*} context
   */
  filterSeries: function (cb, context) {
    assertSeriesInitialized(this);
    var filteredSeries = filter(this._componentsMap.get('series'), cb, context);
    this._seriesIndices = createSeriesIndices(filteredSeries);
  },
  restoreData: function () {
    var componentsMap = this._componentsMap;
    this._seriesIndices = createSeriesIndices(componentsMap.get('series'));
    var componentTypes = [];
    componentsMap.each(function (components, componentType) {
      componentTypes.push(componentType);
    });
    ComponentModel.topologicalTravel(componentTypes, ComponentModel.getAllClassMainTypes(), function (componentType, dependencies) {
      each(componentsMap.get(componentType), function (component) {
        component.restoreData();
      });
    });
  }
});
/**
 * @inner
 */

function mergeTheme(option, theme) {
  zrUtil.each(theme, function (themeItem, name) {
    // 如果有 component model 则把具体的 merge 逻辑交给该 model 处理
    if (!ComponentModel.hasClass(name)) {
      if (typeof themeItem === 'object') {
        option[name] = !option[name] ? zrUtil.clone(themeItem) : zrUtil.merge(option[name], themeItem, false);
      } else {
        if (option[name] == null) {
          option[name] = themeItem;
        }
      }
    }
  });
}

function initBase(baseOption) {
  baseOption = baseOption; // Using OPTION_INNER_KEY to mark that this option can not be used outside,
  // i.e. `chart.setOption(chart.getModel().option);` is forbiden.

  this.option = {};
  this.option[OPTION_INNER_KEY] = 1;
  /**
   * Init with series: [], in case of calling findSeries method
   * before series initialized.
   * @type {Object.<string, Array.<module:echarts/model/Model>>}
   * @private
   */

  this._componentsMap = zrUtil.createHashMap({
    series: []
  });
  /**
   * Mapping between filtered series list and raw series list.
   * key: filtered series indices, value: raw series indices.
   * @type {Array.<nubmer>}
   * @private
   */

  this._seriesIndices = null;
  mergeTheme(baseOption, this._theme.option); // TODO Needs clone when merging to the unexisted property

  zrUtil.merge(baseOption, globalDefault, false);
  this.mergeOption(baseOption);
}
/**
 * @inner
 * @param {Array.<string>|string} types model types
 * @return {Object} key: {string} type, value: {Array.<Object>} models
 */


function getComponentsByTypes(componentsMap, types) {
  if (!zrUtil.isArray(types)) {
    types = types ? [types] : [];
  }

  var ret = {};
  each(types, function (type) {
    ret[type] = (componentsMap.get(type) || []).slice();
  });
  return ret;
}
/**
 * @inner
 */


function determineSubType(mainType, newCptOption, existComponent) {
  var subType = newCptOption.type ? newCptOption.type : existComponent ? existComponent.subType // Use determineSubType only when there is no existComponent.
  : ComponentModel.determineSubType(mainType, newCptOption); // tooltip, markline, markpoint may always has no subType

  return subType;
}
/**
 * @inner
 */


function createSeriesIndices(seriesModels) {
  return map(seriesModels, function (series) {
    return series.componentIndex;
  }) || [];
}
/**
 * @inner
 */


function filterBySubType(components, condition) {
  // Using hasOwnProperty for restrict. Consider
  // subType is undefined in user payload.
  return condition.hasOwnProperty('subType') ? filter(components, function (cpt) {
    return cpt.subType === condition.subType;
  }) : components;
}
/**
 * @inner
 */


function assertSeriesInitialized(ecModel) {}

zrUtil.mixin(GlobalModel, colorPaletteMinin);
var _default = GlobalModel;
module.exports = _default;

/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var modelUtil = __webpack_require__(201);

var ComponentModel = __webpack_require__(223);

/**
 * ECharts option manager
 *
 * @module {echarts/model/OptionManager}
 */
var each = zrUtil.each;
var clone = zrUtil.clone;
var map = zrUtil.map;
var merge = zrUtil.merge;
var QUERY_REG = /^(min|max)?(.+)$/;
/**
 * TERM EXPLANATIONS:
 *
 * [option]:
 *
 *     An object that contains definitions of components. For example:
 *     var option = {
 *         title: {...},
 *         legend: {...},
 *         visualMap: {...},
 *         series: [
 *             {data: [...]},
 *             {data: [...]},
 *             ...
 *         ]
 *     };
 *
 * [rawOption]:
 *
 *     An object input to echarts.setOption. 'rawOption' may be an
 *     'option', or may be an object contains multi-options. For example:
 *     var option = {
 *         baseOption: {
 *             title: {...},
 *             legend: {...},
 *             series: [
 *                 {data: [...]},
 *                 {data: [...]},
 *                 ...
 *             ]
 *         },
 *         timeline: {...},
 *         options: [
 *             {title: {...}, series: {data: [...]}},
 *             {title: {...}, series: {data: [...]}},
 *             ...
 *         ],
 *         media: [
 *             {
 *                 query: {maxWidth: 320},
 *                 option: {series: {x: 20}, visualMap: {show: false}}
 *             },
 *             {
 *                 query: {minWidth: 320, maxWidth: 720},
 *                 option: {series: {x: 500}, visualMap: {show: true}}
 *             },
 *             {
 *                 option: {series: {x: 1200}, visualMap: {show: true}}
 *             }
 *         ]
 *     };
 *
 * @alias module:echarts/model/OptionManager
 * @param {module:echarts/ExtensionAPI} api
 */

function OptionManager(api) {
  /**
   * @private
   * @type {module:echarts/ExtensionAPI}
   */
  this._api = api;
  /**
   * @private
   * @type {Array.<number>}
   */

  this._timelineOptions = [];
  /**
   * @private
   * @type {Array.<Object>}
   */

  this._mediaList = [];
  /**
   * @private
   * @type {Object}
   */

  this._mediaDefault;
  /**
   * -1, means default.
   * empty means no media.
   * @private
   * @type {Array.<number>}
   */

  this._currentMediaIndices = [];
  /**
   * @private
   * @type {Object}
   */

  this._optionBackup;
  /**
   * @private
   * @type {Object}
   */

  this._newBaseOption;
} // timeline.notMerge is not supported in ec3. Firstly there is rearly
// case that notMerge is needed. Secondly supporting 'notMerge' requires
// rawOption cloned and backuped when timeline changed, which does no
// good to performance. What's more, that both timeline and setOption
// method supply 'notMerge' brings complex and some problems.
// Consider this case:
// (step1) chart.setOption({timeline: {notMerge: false}, ...}, false);
// (step2) chart.setOption({timeline: {notMerge: true}, ...}, false);


OptionManager.prototype = {
  constructor: OptionManager,

  /**
   * @public
   * @param {Object} rawOption Raw option.
   * @param {module:echarts/model/Global} ecModel
   * @param {Array.<Function>} optionPreprocessorFuncs
   * @return {Object} Init option
   */
  setOption: function (rawOption, optionPreprocessorFuncs) {
    rawOption = clone(rawOption, true); // FIXME
    // 如果 timeline options 或者 media 中设置了某个属性，而baseOption中没有设置，则进行警告。

    var oldOptionBackup = this._optionBackup;
    var newParsedOption = parseRawOption.call(this, rawOption, optionPreprocessorFuncs, !oldOptionBackup);
    this._newBaseOption = newParsedOption.baseOption; // For setOption at second time (using merge mode);

    if (oldOptionBackup) {
      // Only baseOption can be merged.
      mergeOption(oldOptionBackup.baseOption, newParsedOption.baseOption); // For simplicity, timeline options and media options do not support merge,
      // that is, if you `setOption` twice and both has timeline options, the latter
      // timeline opitons will not be merged to the formers, but just substitude them.

      if (newParsedOption.timelineOptions.length) {
        oldOptionBackup.timelineOptions = newParsedOption.timelineOptions;
      }

      if (newParsedOption.mediaList.length) {
        oldOptionBackup.mediaList = newParsedOption.mediaList;
      }

      if (newParsedOption.mediaDefault) {
        oldOptionBackup.mediaDefault = newParsedOption.mediaDefault;
      }
    } else {
      this._optionBackup = newParsedOption;
    }
  },

  /**
   * @param {boolean} isRecreate
   * @return {Object}
   */
  mountOption: function (isRecreate) {
    var optionBackup = this._optionBackup; // TODO
    // 如果没有reset功能则不clone。

    this._timelineOptions = map(optionBackup.timelineOptions, clone);
    this._mediaList = map(optionBackup.mediaList, clone);
    this._mediaDefault = clone(optionBackup.mediaDefault);
    this._currentMediaIndices = [];
    return clone(isRecreate // this._optionBackup.baseOption, which is created at the first `setOption`
    // called, and is merged into every new option by inner method `mergeOption`
    // each time `setOption` called, can be only used in `isRecreate`, because
    // its reliability is under suspicion. In other cases option merge is
    // performed by `model.mergeOption`.
    ? optionBackup.baseOption : this._newBaseOption);
  },

  /**
   * @param {module:echarts/model/Global} ecModel
   * @return {Object}
   */
  getTimelineOption: function (ecModel) {
    var option;
    var timelineOptions = this._timelineOptions;

    if (timelineOptions.length) {
      // getTimelineOption can only be called after ecModel inited,
      // so we can get currentIndex from timelineModel.
      var timelineModel = ecModel.getComponent('timeline');

      if (timelineModel) {
        option = clone(timelineOptions[timelineModel.getCurrentIndex()], true);
      }
    }

    return option;
  },

  /**
   * @param {module:echarts/model/Global} ecModel
   * @return {Array.<Object>}
   */
  getMediaOption: function (ecModel) {
    var ecWidth = this._api.getWidth();

    var ecHeight = this._api.getHeight();

    var mediaList = this._mediaList;
    var mediaDefault = this._mediaDefault;
    var indices = [];
    var result = []; // No media defined.

    if (!mediaList.length && !mediaDefault) {
      return result;
    } // Multi media may be applied, the latter defined media has higher priority.


    for (var i = 0, len = mediaList.length; i < len; i++) {
      if (applyMediaQuery(mediaList[i].query, ecWidth, ecHeight)) {
        indices.push(i);
      }
    } // FIXME
    // 是否mediaDefault应该强制用户设置，否则可能修改不能回归。


    if (!indices.length && mediaDefault) {
      indices = [-1];
    }

    if (indices.length && !indicesEquals(indices, this._currentMediaIndices)) {
      result = map(indices, function (index) {
        return clone(index === -1 ? mediaDefault.option : mediaList[index].option);
      });
    } // Otherwise return nothing.


    this._currentMediaIndices = indices;
    return result;
  }
};

function parseRawOption(rawOption, optionPreprocessorFuncs, isNew) {
  var timelineOptions = [];
  var mediaList = [];
  var mediaDefault;
  var baseOption; // Compatible with ec2.

  var timelineOpt = rawOption.timeline;

  if (rawOption.baseOption) {
    baseOption = rawOption.baseOption;
  } // For timeline


  if (timelineOpt || rawOption.options) {
    baseOption = baseOption || {};
    timelineOptions = (rawOption.options || []).slice();
  } // For media query


  if (rawOption.media) {
    baseOption = baseOption || {};
    var media = rawOption.media;
    each(media, function (singleMedia) {
      if (singleMedia && singleMedia.option) {
        if (singleMedia.query) {
          mediaList.push(singleMedia);
        } else if (!mediaDefault) {
          // Use the first media default.
          mediaDefault = singleMedia;
        }
      }
    });
  } // For normal option


  if (!baseOption) {
    baseOption = rawOption;
  } // Set timelineOpt to baseOption in ec3,
  // which is convenient for merge option.


  if (!baseOption.timeline) {
    baseOption.timeline = timelineOpt;
  } // Preprocess.


  each([baseOption].concat(timelineOptions).concat(zrUtil.map(mediaList, function (media) {
    return media.option;
  })), function (option) {
    each(optionPreprocessorFuncs, function (preProcess) {
      preProcess(option, isNew);
    });
  });
  return {
    baseOption: baseOption,
    timelineOptions: timelineOptions,
    mediaDefault: mediaDefault,
    mediaList: mediaList
  };
}
/**
 * @see <http://www.w3.org/TR/css3-mediaqueries/#media1>
 * Support: width, height, aspectRatio
 * Can use max or min as prefix.
 */


function applyMediaQuery(query, ecWidth, ecHeight) {
  var realMap = {
    width: ecWidth,
    height: ecHeight,
    aspectratio: ecWidth / ecHeight // lowser case for convenientce.

  };
  var applicatable = true;
  zrUtil.each(query, function (value, attr) {
    var matched = attr.match(QUERY_REG);

    if (!matched || !matched[1] || !matched[2]) {
      return;
    }

    var operator = matched[1];
    var realAttr = matched[2].toLowerCase();

    if (!compare(realMap[realAttr], value, operator)) {
      applicatable = false;
    }
  });
  return applicatable;
}

function compare(real, expect, operator) {
  if (operator === 'min') {
    return real >= expect;
  } else if (operator === 'max') {
    return real <= expect;
  } else {
    // Equals
    return real === expect;
  }
}

function indicesEquals(indices1, indices2) {
  // indices is always order by asc and has only finite number.
  return indices1.join(',') === indices2.join(',');
}
/**
 * Consider case:
 * `chart.setOption(opt1);`
 * Then user do some interaction like dataZoom, dataView changing.
 * `chart.setOption(opt2);`
 * Then user press 'reset button' in toolbox.
 *
 * After doing that all of the interaction effects should be reset, the
 * chart should be the same as the result of invoke
 * `chart.setOption(opt1); chart.setOption(opt2);`.
 *
 * Although it is not able ensure that
 * `chart.setOption(opt1); chart.setOption(opt2);` is equivalents to
 * `chart.setOption(merge(opt1, opt2));` exactly,
 * this might be the only simple way to implement that feature.
 *
 * MEMO: We've considered some other approaches:
 * 1. Each model handle its self restoration but not uniform treatment.
 *     (Too complex in logic and error-prone)
 * 2. Use a shadow ecModel. (Performace expensive)
 */


function mergeOption(oldOption, newOption) {
  newOption = newOption || {};
  each(newOption, function (newCptOpt, mainType) {
    if (newCptOpt == null) {
      return;
    }

    var oldCptOpt = oldOption[mainType];

    if (!ComponentModel.hasClass(mainType)) {
      oldOption[mainType] = merge(oldCptOpt, newCptOpt, true);
    } else {
      newCptOpt = modelUtil.normalizeToArray(newCptOpt);
      oldCptOpt = modelUtil.normalizeToArray(oldCptOpt);
      var mapResult = modelUtil.mappingToExists(oldCptOpt, newCptOpt);
      oldOption[mainType] = map(mapResult, function (item) {
        return item.option && item.exist ? merge(item.exist, item.option, true) : item.exist || item.option;
      });
    }
  });
}

var _default = OptionManager;
module.exports = _default;

/***/ }),
/* 294 */
/***/ (function(module, exports) {

var platform = ''; // Navigator not exists in node

if (typeof navigator !== 'undefined') {
  platform = navigator.platform || '';
}

var _default = {
  // 全图默认背景
  // backgroundColor: 'rgba(0,0,0,0)',
  // https://dribbble.com/shots/1065960-Infographic-Pie-chart-visualization
  // color: ['#5793f3', '#d14a61', '#fd9c35', '#675bba', '#fec42c', '#dd4444', '#d4df5a', '#cd4870'],
  // 浅色
  // color: ['#bcd3bb', '#e88f70', '#edc1a5', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a'],
  // color: ['#cc5664', '#9bd6ec', '#ea946e', '#8acaaa', '#f1ec64', '#ee8686', '#a48dc1', '#5da6bc', '#b9dcae'],
  // 深色
  color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
  // 默认需要 Grid 配置项
  // grid: {},
  // 主题，主题
  textStyle: {
    // color: '#000',
    // decoration: 'none',
    // PENDING
    fontFamily: platform.match(/^Win/) ? 'Microsoft YaHei' : 'sans-serif',
    // fontFamily: 'Arial, Verdana, sans-serif',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  // http://blogs.adobe.com/webplatform/2014/02/24/using-blend-modes-in-html-canvas/
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  // Default is source-over
  blendMode: null,
  animation: 'auto',
  animationDuration: 1000,
  animationDurationUpdate: 300,
  animationEasing: 'exponentialOut',
  animationEasingUpdate: 'cubicOut',
  animationThreshold: 2000,
  // Configuration for progressive/incremental rendering
  progressiveThreshold: 3000,
  progressive: 400,
  // Threshold of if use single hover layer to optimize.
  // It is recommended that `hoverLayerThreshold` is equivalent to or less than
  // `progressiveThreshold`, otherwise hover will cause restart of progressive,
  // which is unexpected.
  // see example <echarts/test/heatmap-large.html>.
  hoverLayerThreshold: 3000,
  // See: module:echarts/scale/Time
  useUTC: false
};
module.exports = _default;

/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

var makeStyleMapper = __webpack_require__(236);

var getAreaStyle = makeStyleMapper([['fill', 'color'], ['shadowBlur'], ['shadowOffsetX'], ['shadowOffsetY'], ['opacity'], ['shadowColor']]);
var _default = {
  getAreaStyle: function (excludes, includes) {
    return getAreaStyle(this, excludes, includes);
  }
};
module.exports = _default;

/***/ }),
/* 296 */
/***/ (function(module, exports) {

var _default = {
  getBoxLayoutParams: function () {
    return {
      left: this.get('left'),
      top: this.get('top'),
      right: this.get('right'),
      bottom: this.get('bottom'),
      width: this.get('width'),
      height: this.get('height')
    };
  }
};
module.exports = _default;

/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

var makeStyleMapper = __webpack_require__(236);

var getItemStyle = makeStyleMapper([['fill', 'color'], ['stroke', 'borderColor'], ['lineWidth', 'borderWidth'], ['opacity'], ['shadowBlur'], ['shadowOffsetX'], ['shadowOffsetY'], ['shadowColor'], ['textPosition'], ['textAlign']]);
var _default = {
  getItemStyle: function (excludes, includes) {
    var style = getItemStyle(this, excludes, includes);
    var lineDash = this.getBorderLineDash();
    lineDash && (style.lineDash = lineDash);
    return style;
  },
  getBorderLineDash: function () {
    var lineType = this.get('borderType');
    return lineType === 'solid' || lineType == null ? null : lineType === 'dashed' ? [5, 5] : [1, 1];
  }
};
module.exports = _default;

/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

var makeStyleMapper = __webpack_require__(236);

var getLineStyle = makeStyleMapper([['lineWidth', 'width'], ['stroke', 'color'], ['opacity'], ['shadowBlur'], ['shadowOffsetX'], ['shadowOffsetY'], ['shadowColor']]);
var _default = {
  getLineStyle: function (excludes) {
    var style = getLineStyle(this, excludes);
    var lineDash = this.getLineDash(style.lineWidth);
    lineDash && (style.lineDash = lineDash);
    return style;
  },
  getLineDash: function (lineWidth) {
    if (lineWidth == null) {
      lineWidth = 1;
    }

    var lineType = this.get('type');
    var dotSize = Math.max(lineWidth, 2);
    var dashSize = lineWidth * 4;
    return lineType === 'solid' || lineType == null ? null : lineType === 'dashed' ? [dashSize, dashSize] : [dotSize, dotSize];
  }
};
module.exports = _default;

/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

var textContain = __webpack_require__(225);

var graphicUtil = __webpack_require__(200);

var PATH_COLOR = ['textStyle', 'color'];
var _default = {
  /**
   * Get color property or get color from option.textStyle.color
   * @param {boolean} [isEmphasis]
   * @return {string}
   */
  getTextColor: function (isEmphasis) {
    var ecModel = this.ecModel;
    return this.getShallow('color') || (!isEmphasis && ecModel ? ecModel.get(PATH_COLOR) : null);
  },

  /**
   * Create font string from fontStyle, fontWeight, fontSize, fontFamily
   * @return {string}
   */
  getFont: function () {
    return graphicUtil.getFont({
      fontStyle: this.getShallow('fontStyle'),
      fontWeight: this.getShallow('fontWeight'),
      fontSize: this.getShallow('fontSize'),
      fontFamily: this.getShallow('fontFamily')
    }, this.ecModel);
  },
  getTextRect: function (text) {
    return textContain.getBoundingRect(text, this.getFont(), this.getShallow('align'), this.getShallow('verticalAlign') || this.getShallow('baseline'), this.getShallow('padding'), this.getShallow('rich'), this.getShallow('truncateText'));
  }
};
module.exports = _default;

/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

var _util = __webpack_require__(196);

var each = _util.each;
var isArray = _util.isArray;
var isObject = _util.isObject;

var compatStyle = __webpack_require__(301);

var _model = __webpack_require__(201);

var normalizeToArray = _model.normalizeToArray;

// Compatitable with 2.0
function get(opt, path) {
  path = path.split(',');
  var obj = opt;

  for (var i = 0; i < path.length; i++) {
    obj = obj && obj[path[i]];

    if (obj == null) {
      break;
    }
  }

  return obj;
}

function set(opt, path, val, overwrite) {
  path = path.split(',');
  var obj = opt;
  var key;

  for (var i = 0; i < path.length - 1; i++) {
    key = path[i];

    if (obj[key] == null) {
      obj[key] = {};
    }

    obj = obj[key];
  }

  if (overwrite || obj[path[i]] == null) {
    obj[path[i]] = val;
  }
}

function compatLayoutProperties(option) {
  each(LAYOUT_PROPERTIES, function (prop) {
    if (prop[0] in option && !(prop[1] in option)) {
      option[prop[1]] = option[prop[0]];
    }
  });
}

var LAYOUT_PROPERTIES = [['x', 'left'], ['y', 'top'], ['x2', 'right'], ['y2', 'bottom']];
var COMPATITABLE_COMPONENTS = ['grid', 'geo', 'parallel', 'legend', 'toolbox', 'title', 'visualMap', 'dataZoom', 'timeline'];
var COMPATITABLE_SERIES = ['bar', 'boxplot', 'candlestick', 'chord', 'effectScatter', 'funnel', 'gauge', 'lines', 'graph', 'heatmap', 'line', 'map', 'parallel', 'pie', 'radar', 'sankey', 'scatter', 'treemap'];

function _default(option, isTheme) {
  compatStyle(option, isTheme); // Make sure series array for model initialization.

  option.series = normalizeToArray(option.series);
  each(option.series, function (seriesOpt) {
    if (!isObject(seriesOpt)) {
      return;
    }

    var seriesType = seriesOpt.type;

    if (seriesType === 'pie' || seriesType === 'gauge') {
      if (seriesOpt.clockWise != null) {
        seriesOpt.clockwise = seriesOpt.clockWise;
      }
    }

    if (seriesType === 'gauge') {
      var pointerColor = get(seriesOpt, 'pointer.color');
      pointerColor != null && set(seriesOpt, 'itemStyle.normal.color', pointerColor);
    }

    for (var i = 0; i < COMPATITABLE_SERIES.length; i++) {
      if (COMPATITABLE_SERIES[i] === seriesOpt.type) {
        compatLayoutProperties(seriesOpt);
        break;
      }
    }
  }); // dataRange has changed to visualMap

  if (option.dataRange) {
    option.visualMap = option.dataRange;
  }

  each(COMPATITABLE_COMPONENTS, function (componentName) {
    var options = option[componentName];

    if (options) {
      if (!isArray(options)) {
        options = [options];
      }

      each(options, function (option) {
        compatLayoutProperties(option);
      });
    }
  });
}

module.exports = _default;

/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var modelUtil = __webpack_require__(201);

var each = zrUtil.each;
var isObject = zrUtil.isObject;
var POSSIBLE_STYLES = ['areaStyle', 'lineStyle', 'nodeStyle', 'linkStyle', 'chordStyle', 'label', 'labelLine'];

function compatItemStyle(opt) {
  var itemStyleOpt = opt && opt.itemStyle;

  if (!itemStyleOpt) {
    return;
  }

  for (var i = 0, len = POSSIBLE_STYLES.length; i < len; i++) {
    var styleName = POSSIBLE_STYLES[i];
    var normalItemStyleOpt = itemStyleOpt.normal;
    var emphasisItemStyleOpt = itemStyleOpt.emphasis;

    if (normalItemStyleOpt && normalItemStyleOpt[styleName]) {
      opt[styleName] = opt[styleName] || {};

      if (!opt[styleName].normal) {
        opt[styleName].normal = normalItemStyleOpt[styleName];
      } else {
        zrUtil.merge(opt[styleName].normal, normalItemStyleOpt[styleName]);
      }

      normalItemStyleOpt[styleName] = null;
    }

    if (emphasisItemStyleOpt && emphasisItemStyleOpt[styleName]) {
      opt[styleName] = opt[styleName] || {};

      if (!opt[styleName].emphasis) {
        opt[styleName].emphasis = emphasisItemStyleOpt[styleName];
      } else {
        zrUtil.merge(opt[styleName].emphasis, emphasisItemStyleOpt[styleName]);
      }

      emphasisItemStyleOpt[styleName] = null;
    }
  }
}

function compatTextStyle(opt, propName) {
  var labelOptSingle = isObject(opt) && opt[propName];
  var textStyle = isObject(labelOptSingle) && labelOptSingle.textStyle;

  if (textStyle) {
    for (var i = 0, len = modelUtil.TEXT_STYLE_OPTIONS.length; i < len; i++) {
      var propName = modelUtil.TEXT_STYLE_OPTIONS[i];

      if (textStyle.hasOwnProperty(propName)) {
        labelOptSingle[propName] = textStyle[propName];
      }
    }
  }
}

function compatLabelTextStyle(labelOpt) {
  if (isObject(labelOpt)) {
    compatTextStyle(labelOpt, 'normal');
    compatTextStyle(labelOpt, 'emphasis');
  }
}

function processSeries(seriesOpt) {
  if (!isObject(seriesOpt)) {
    return;
  }

  compatItemStyle(seriesOpt);
  compatLabelTextStyle(seriesOpt.label); // treemap

  compatLabelTextStyle(seriesOpt.upperLabel); // graph

  compatLabelTextStyle(seriesOpt.edgeLabel);
  var markPoint = seriesOpt.markPoint;
  compatItemStyle(markPoint);
  compatLabelTextStyle(markPoint && markPoint.label);
  var markLine = seriesOpt.markLine;
  compatItemStyle(seriesOpt.markLine);
  compatLabelTextStyle(markLine && markLine.label);
  var markArea = seriesOpt.markArea;
  compatLabelTextStyle(markArea && markArea.label); // For gauge

  compatTextStyle(seriesOpt, 'axisLabel');
  compatTextStyle(seriesOpt, 'title');
  compatTextStyle(seriesOpt, 'detail');
  var data = seriesOpt.data;

  if (data) {
    for (var i = 0; i < data.length; i++) {
      compatItemStyle(data[i]);
      compatLabelTextStyle(data[i] && data[i].label);
    }
  } // mark point data


  var markPoint = seriesOpt.markPoint;

  if (markPoint && markPoint.data) {
    var mpData = markPoint.data;

    for (var i = 0; i < mpData.length; i++) {
      compatItemStyle(mpData[i]);
      compatLabelTextStyle(mpData[i] && mpData[i].label);
    }
  } // mark line data


  var markLine = seriesOpt.markLine;

  if (markLine && markLine.data) {
    var mlData = markLine.data;

    for (var i = 0; i < mlData.length; i++) {
      if (zrUtil.isArray(mlData[i])) {
        compatItemStyle(mlData[i][0]);
        compatLabelTextStyle(mlData[i][0] && mlData[i][0].label);
        compatItemStyle(mlData[i][1]);
        compatLabelTextStyle(mlData[i][1] && mlData[i][1].label);
      } else {
        compatItemStyle(mlData[i]);
        compatLabelTextStyle(mlData[i] && mlData[i].label);
      }
    }
  }
}

function toArr(o) {
  return zrUtil.isArray(o) ? o : o ? [o] : [];
}

function toObj(o) {
  return (zrUtil.isArray(o) ? o[0] : o) || {};
}

function _default(option, isTheme) {
  each(toArr(option.series), function (seriesOpt) {
    isObject(seriesOpt) && processSeries(seriesOpt);
  });
  var axes = ['xAxis', 'yAxis', 'radiusAxis', 'angleAxis', 'singleAxis', 'parallelAxis', 'radar'];
  isTheme && axes.push('valueAxis', 'categoryAxis', 'logAxis', 'timeAxis');
  each(axes, function (axisName) {
    each(toArr(option[axisName]), function (axisOpt) {
      if (axisOpt) {
        compatTextStyle(axisOpt, 'axisLabel');
        compatTextStyle(axisOpt.axisPointer, 'label');
      }
    });
  });
  each(toArr(option.parallel), function (parallelOpt) {
    var parallelAxisDefault = parallelOpt && parallelOpt.parallelAxisDefault;
    compatTextStyle(parallelAxisDefault, 'axisLabel');
    compatTextStyle(parallelAxisDefault && parallelAxisDefault.axisPointer, 'label');
  });
  each(toArr(option.calendar), function (calendarOpt) {
    compatTextStyle(calendarOpt, 'dayLabel');
    compatTextStyle(calendarOpt, 'monthLabel');
    compatTextStyle(calendarOpt, 'yearLabel');
  }); // radar.name.textStyle

  each(toArr(option.radar), function (radarOpt) {
    compatTextStyle(radarOpt, 'name');
  });
  each(toArr(option.geo), function (geoOpt) {
    if (isObject(geoOpt)) {
      compatLabelTextStyle(geoOpt.label);
      each(toArr(geoOpt.regions), function (regionObj) {
        compatLabelTextStyle(regionObj.label);
      });
    }
  });
  compatLabelTextStyle(toObj(option.timeline).label);
  compatTextStyle(toObj(option.axisPointer), 'label');
  compatTextStyle(toObj(option.tooltip).axisPointer, 'label');
}

module.exports = _default;

/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var Scale = __webpack_require__(232);

var numberUtil = __webpack_require__(202);

var IntervalScale = __webpack_require__(239);

/**
 * Log scale
 * @module echarts/scale/Log
 */
// Use some method of IntervalScale
var scaleProto = Scale.prototype;
var intervalScaleProto = IntervalScale.prototype;
var getPrecisionSafe = numberUtil.getPrecisionSafe;
var roundingErrorFix = numberUtil.round;
var mathFloor = Math.floor;
var mathCeil = Math.ceil;
var mathPow = Math.pow;
var mathLog = Math.log;
var LogScale = Scale.extend({
  type: 'log',
  base: 10,
  $constructor: function () {
    Scale.apply(this, arguments);
    this._originalScale = new IntervalScale();
  },

  /**
   * @return {Array.<number>}
   */
  getTicks: function () {
    var originalScale = this._originalScale;
    var extent = this._extent;
    var originalExtent = originalScale.getExtent();
    return zrUtil.map(intervalScaleProto.getTicks.call(this), function (val) {
      var powVal = numberUtil.round(mathPow(this.base, val)); // Fix #4158

      powVal = val === extent[0] && originalScale.__fixMin ? fixRoundingError(powVal, originalExtent[0]) : powVal;
      powVal = val === extent[1] && originalScale.__fixMax ? fixRoundingError(powVal, originalExtent[1]) : powVal;
      return powVal;
    }, this);
  },

  /**
   * @param {number} val
   * @return {string}
   */
  getLabel: intervalScaleProto.getLabel,

  /**
   * @param  {number} val
   * @return {number}
   */
  scale: function (val) {
    val = scaleProto.scale.call(this, val);
    return mathPow(this.base, val);
  },

  /**
   * @param {number} start
   * @param {number} end
   */
  setExtent: function (start, end) {
    var base = this.base;
    start = mathLog(start) / mathLog(base);
    end = mathLog(end) / mathLog(base);
    intervalScaleProto.setExtent.call(this, start, end);
  },

  /**
   * @return {number} end
   */
  getExtent: function () {
    var base = this.base;
    var extent = scaleProto.getExtent.call(this);
    extent[0] = mathPow(base, extent[0]);
    extent[1] = mathPow(base, extent[1]); // Fix #4158

    var originalScale = this._originalScale;
    var originalExtent = originalScale.getExtent();
    originalScale.__fixMin && (extent[0] = fixRoundingError(extent[0], originalExtent[0]));
    originalScale.__fixMax && (extent[1] = fixRoundingError(extent[1], originalExtent[1]));
    return extent;
  },

  /**
   * @param  {Array.<number>} extent
   */
  unionExtent: function (extent) {
    this._originalScale.unionExtent(extent);

    var base = this.base;
    extent[0] = mathLog(extent[0]) / mathLog(base);
    extent[1] = mathLog(extent[1]) / mathLog(base);
    scaleProto.unionExtent.call(this, extent);
  },

  /**
   * @override
   */
  unionExtentFromData: function (data, dim) {
    this.unionExtent(data.getDataExtent(dim, true, function (val) {
      return val > 0;
    }));
  },

  /**
   * Update interval and extent of intervals for nice ticks
   * @param  {number} [approxTickNum = 10] Given approx tick number
   */
  niceTicks: function (approxTickNum) {
    approxTickNum = approxTickNum || 10;
    var extent = this._extent;
    var span = extent[1] - extent[0];

    if (span === Infinity || span <= 0) {
      return;
    }

    var interval = numberUtil.quantity(span);
    var err = approxTickNum / span * interval; // Filter ticks to get closer to the desired count.

    if (err <= 0.5) {
      interval *= 10;
    } // Interval should be integer


    while (!isNaN(interval) && Math.abs(interval) < 1 && Math.abs(interval) > 0) {
      interval *= 10;
    }

    var niceExtent = [numberUtil.round(mathCeil(extent[0] / interval) * interval), numberUtil.round(mathFloor(extent[1] / interval) * interval)];
    this._interval = interval;
    this._niceExtent = niceExtent;
  },

  /**
   * Nice extent.
   * @override
   */
  niceExtent: function (opt) {
    intervalScaleProto.niceExtent.call(this, opt);
    var originalScale = this._originalScale;
    originalScale.__fixMin = opt.fixMin;
    originalScale.__fixMax = opt.fixMax;
  }
});
zrUtil.each(['contain', 'normalize'], function (methodName) {
  LogScale.prototype[methodName] = function (val) {
    val = mathLog(val) / mathLog(this.base);
    return scaleProto[methodName].call(this, val);
  };
});

LogScale.create = function () {
  return new LogScale();
};

function fixRoundingError(val, originalVal) {
  return roundingErrorFix(val, getPrecisionSafe(originalVal));
}

var _default = LogScale;
module.exports = _default;

/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var Scale = __webpack_require__(232);

/**
 * Linear continuous scale
 * @module echarts/coord/scale/Ordinal
 *
 * http://en.wikipedia.org/wiki/Level_of_measurement
 */
// FIXME only one data
var scaleProto = Scale.prototype;
var OrdinalScale = Scale.extend({
  type: 'ordinal',
  init: function (data, extent) {
    this._data = data;
    this._extent = extent || [0, data.length - 1];
  },
  parse: function (val) {
    return typeof val === 'string' ? zrUtil.indexOf(this._data, val) // val might be float.
    : Math.round(val);
  },
  contain: function (rank) {
    rank = this.parse(rank);
    return scaleProto.contain.call(this, rank) && this._data[rank] != null;
  },

  /**
   * Normalize given rank or name to linear [0, 1]
   * @param {number|string} [val]
   * @return {number}
   */
  normalize: function (val) {
    return scaleProto.normalize.call(this, this.parse(val));
  },
  scale: function (val) {
    return Math.round(scaleProto.scale.call(this, val));
  },

  /**
   * @return {Array}
   */
  getTicks: function () {
    var ticks = [];
    var extent = this._extent;
    var rank = extent[0];

    while (rank <= extent[1]) {
      ticks.push(rank);
      rank++;
    }

    return ticks;
  },

  /**
   * Get item on rank n
   * @param {number} n
   * @return {string}
   */
  getLabel: function (n) {
    return this._data[n];
  },

  /**
   * @return {number}
   */
  count: function () {
    return this._extent[1] - this._extent[0] + 1;
  },

  /**
   * @override
   */
  unionExtentFromData: function (data, dim) {
    this.unionExtent(data.getDataExtent(dim, false));
  },
  niceTicks: zrUtil.noop,
  niceExtent: zrUtil.noop
});
/**
 * @return {module:echarts/scale/Time}
 */

OrdinalScale.create = function () {
  return new OrdinalScale();
};

var _default = OrdinalScale;
module.exports = _default;

/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var numberUtil = __webpack_require__(202);

var formatUtil = __webpack_require__(217);

var scaleHelper = __webpack_require__(254);

var IntervalScale = __webpack_require__(239);

// [About UTC and local time zone]:
// In most cases, `number.parseDate` will treat input data string as local time
// (except time zone is specified in time string). And `format.formateTime` returns
// local time by default. option.useUTC is false by default. This design have
// concidered these common case:
// (1) Time that is persistent in server is in UTC, but it is needed to be diplayed
// in local time by default.
// (2) By default, the input data string (e.g., '2011-01-02') should be displayed
// as its original time, without any time difference.
var intervalScaleProto = IntervalScale.prototype;
var mathCeil = Math.ceil;
var mathFloor = Math.floor;
var ONE_SECOND = 1000;
var ONE_MINUTE = ONE_SECOND * 60;
var ONE_HOUR = ONE_MINUTE * 60;
var ONE_DAY = ONE_HOUR * 24; // FIXME 公用？

var bisect = function (a, x, lo, hi) {
  while (lo < hi) {
    var mid = lo + hi >>> 1;

    if (a[mid][1] < x) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  return lo;
};
/**
 * @alias module:echarts/coord/scale/Time
 * @constructor
 */


var TimeScale = IntervalScale.extend({
  type: 'time',

  /**
   * @override
   */
  getLabel: function (val) {
    var stepLvl = this._stepLvl;
    var date = new Date(val);
    return formatUtil.formatTime(stepLvl[0], date, this.getSetting('useUTC'));
  },

  /**
   * @override
   */
  niceExtent: function (opt) {
    var extent = this._extent; // If extent start and end are same, expand them

    if (extent[0] === extent[1]) {
      // Expand extent
      extent[0] -= ONE_DAY;
      extent[1] += ONE_DAY;
    } // If there are no data and extent are [Infinity, -Infinity]


    if (extent[1] === -Infinity && extent[0] === Infinity) {
      var d = new Date();
      extent[1] = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
      extent[0] = extent[1] - ONE_DAY;
    }

    this.niceTicks(opt.splitNumber, opt.minInterval, opt.maxInterval); // var extent = this._extent;

    var interval = this._interval;

    if (!opt.fixMin) {
      extent[0] = numberUtil.round(mathFloor(extent[0] / interval) * interval);
    }

    if (!opt.fixMax) {
      extent[1] = numberUtil.round(mathCeil(extent[1] / interval) * interval);
    }
  },

  /**
   * @override
   */
  niceTicks: function (approxTickNum, minInterval, maxInterval) {
    approxTickNum = approxTickNum || 10;
    var extent = this._extent;
    var span = extent[1] - extent[0];
    var approxInterval = span / approxTickNum;

    if (minInterval != null && approxInterval < minInterval) {
      approxInterval = minInterval;
    }

    if (maxInterval != null && approxInterval > maxInterval) {
      approxInterval = maxInterval;
    }

    var scaleLevelsLen = scaleLevels.length;
    var idx = bisect(scaleLevels, approxInterval, 0, scaleLevelsLen);
    var level = scaleLevels[Math.min(idx, scaleLevelsLen - 1)];
    var interval = level[1]; // Same with interval scale if span is much larger than 1 year

    if (level[0] === 'year') {
      var yearSpan = span / interval; // From "Nice Numbers for Graph Labels" of Graphic Gems
      // var niceYearSpan = numberUtil.nice(yearSpan, false);

      var yearStep = numberUtil.nice(yearSpan / approxTickNum, true);
      interval *= yearStep;
    }

    var timezoneOffset = this.getSetting('useUTC') ? 0 : new Date(+extent[0] || +extent[1]).getTimezoneOffset() * 60 * 1000;
    var niceExtent = [Math.round(mathCeil((extent[0] - timezoneOffset) / interval) * interval + timezoneOffset), Math.round(mathFloor((extent[1] - timezoneOffset) / interval) * interval + timezoneOffset)];
    scaleHelper.fixExtent(niceExtent, extent);
    this._stepLvl = level; // Interval will be used in getTicks

    this._interval = interval;
    this._niceExtent = niceExtent;
  },
  parse: function (val) {
    // val might be float.
    return +numberUtil.parseDate(val);
  }
});
zrUtil.each(['contain', 'normalize'], function (methodName) {
  TimeScale.prototype[methodName] = function (val) {
    return intervalScaleProto[methodName].call(this, this.parse(val));
  };
}); // Steps from d3

var scaleLevels = [// Format              interval
['hh:mm:ss', ONE_SECOND], // 1s
['hh:mm:ss', ONE_SECOND * 5], // 5s
['hh:mm:ss', ONE_SECOND * 10], // 10s
['hh:mm:ss', ONE_SECOND * 15], // 15s
['hh:mm:ss', ONE_SECOND * 30], // 30s
['hh:mm\nMM-dd', ONE_MINUTE], // 1m
['hh:mm\nMM-dd', ONE_MINUTE * 5], // 5m
['hh:mm\nMM-dd', ONE_MINUTE * 10], // 10m
['hh:mm\nMM-dd', ONE_MINUTE * 15], // 15m
['hh:mm\nMM-dd', ONE_MINUTE * 30], // 30m
['hh:mm\nMM-dd', ONE_HOUR], // 1h
['hh:mm\nMM-dd', ONE_HOUR * 2], // 2h
['hh:mm\nMM-dd', ONE_HOUR * 6], // 6h
['hh:mm\nMM-dd', ONE_HOUR * 12], // 12h
['MM-dd\nyyyy', ONE_DAY], // 1d
['MM-dd\nyyyy', ONE_DAY * 2], // 2d
['MM-dd\nyyyy', ONE_DAY * 3], // 3d
['MM-dd\nyyyy', ONE_DAY * 4], // 4d
['MM-dd\nyyyy', ONE_DAY * 5], // 5d
['MM-dd\nyyyy', ONE_DAY * 6], // 6d
['week', ONE_DAY * 7], // 7d
['MM-dd\nyyyy', ONE_DAY * 10], // 10d
['week', ONE_DAY * 14], // 2w
['week', ONE_DAY * 21], // 3w
['month', ONE_DAY * 31], // 1M
['week', ONE_DAY * 42], // 6w
['month', ONE_DAY * 62], // 2M
['week', ONE_DAY * 42], // 10w
['quarter', ONE_DAY * 380 / 4], // 3M
['month', ONE_DAY * 31 * 4], // 4M
['month', ONE_DAY * 31 * 5], // 5M
['half-year', ONE_DAY * 380 / 2], // 6M
['month', ONE_DAY * 31 * 8], // 8M
['month', ONE_DAY * 31 * 10], // 10M
['year', ONE_DAY * 380] // 1Y
];
/**
 * @param {module:echarts/model/Model}
 * @return {module:echarts/scale/Time}
 */

TimeScale.create = function (model) {
  return new TimeScale({
    useUTC: model.ecModel.get('useUTC')
  });
};

var _default = TimeScale;
module.exports = _default;

/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

var Gradient = __webpack_require__(244);

function _default(ecModel) {
  function encodeColor(seriesModel) {
    var colorAccessPath = (seriesModel.visualColorAccessPath || 'itemStyle.normal.color').split('.');
    var data = seriesModel.getData();
    var color = seriesModel.get(colorAccessPath) // Set in itemStyle
    || seriesModel.getColorFromPalette(seriesModel.get('name')); // Default color
    // FIXME Set color function or use the platte color

    data.setVisual('color', color); // Only visible series has each data be visual encoded

    if (!ecModel.isSeriesFiltered(seriesModel)) {
      if (typeof color === 'function' && !(color instanceof Gradient)) {
        data.each(function (idx) {
          data.setItemVisual(idx, 'color', color(seriesModel.getDataParams(idx)));
        });
      } // itemStyle in each data item


      data.each(function (idx) {
        var itemModel = data.getItemModel(idx);
        var color = itemModel.get(colorAccessPath, true);

        if (color != null) {
          data.setItemVisual(idx, 'color', color);
        }
      });
    }
  }

  ecModel.eachRawSeries(encodeColor);
}

module.exports = _default;

/***/ }),
/* 306 */
/***/ (function(module, exports) {

const MONTH_DISPLAY = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const WEEK_DISPLAY = ['日', '一', '二', '三', '四', '五', '六']
// 单位大小
const UNIT_SIZE = {
    d: 86400000, // 毫秒/天
    H: 3600000, // 毫秒/小时
    m: 60000, // 毫秒/分钟
    s: 1000, // 毫秒/秒
    S: 1 // 毫秒
}

const TimeFormater = function (input) {
    if (!(this instanceof TimeFormater)) {
        return new TimeFormater(input)
    }
    this[0] = input ? new Date(input) : new Date()
}

TimeFormater.prototype = {

    format(token) {
        if (typeof token !== 'string') {
            return this.toLocaleString()
        }

        const reg = /Y{4}|M{1,4}|Do|D{1,2}|d{1,4}|Q|H{1,2}|h{1,2}|m{1,2}|s{1,2}|S{1,3}|A|a|x|X/g
        return token.replace(reg, (match) => this[match] ? this[match]() : match)
    },

    fromNow() {
        let oldTime = this[0].getTime()
        let newTime = Date.now()
        let diff = Math.floor(newTime - oldTime)

        if (diff < 10000) {
            return '刚刚'
        } else if (diff < 60000) {
            return parseInt(diff / 1000) + '秒前'
        } else if (diff < 3600000) {
            return parseInt(diff / 60000) + '分钟前'
        } else if (diff < 86400000) {
            return parseInt(diff / 3600000) + '小时前'
        } else if (diff < 2592000000) {
            return parseInt(diff / 86400000) + '天前'
        } else if (diff < 31104000000) {
            return parseInt(diff / 2592000000) + '月前'
        } else {
            return parseInt(diff / 31104000000) + '年前'
        }
    },
    
    fillZero(num) {
        return num < 10 ? '0' + num : num
    },

    YYYY() {
        return this[0].getFullYear()
    },

    Q() {
        return Math.ceil(this.M() / 3)
    },

    // 月份 [1..12]
    M() {
        return this[0].getMonth() + 1
    },

    // 月份 [01..12]
    MM() {
        return this.fillZero(this.M())
    },

    // 月份 [1月..12月]
    MMM() {
        return this.M() + '月'
    },

    // 月份 [一月..十二月]
    MMMM() {
        return MONTH_DISPLAY[this.M()]
    },

    // 日期 [1..31]
    D() {
        return this[0].getDate()
    },

    // 日期 [1日..31日]
    Do() {
        return this.D() + '日'
    },

    // 日期 [01..31]
    DD() {
        return this.fillZero(this.D())
    },

    // 星期 [0..6]
    d() {
        return this[0].getDay()
    },

    // 星期 [日..六]
    dd() {
        return WEEK_DISPLAY[this.d()]
    },

    // 星期 [周日..周六]
    ddd() {
        return '周' + this.dd()
    },

    // 星期 [星期日..星期六]
    dddd() {
        return '星期' + this.dd()
    },

    // 时 [0..23]
    H() {
        return this[0].getHours()
    },

    // 时 [00..23]
    HH() {
        return this.fillZero(this.H())
    },

    // 时 [1.12]
    h() {
        let hour = this.H() % 12
        return hour || 12
    },

    // 时 [01..12]
    hh() {
        return this.fillZero(this.h())
    },

    // 分钟 [0..59]
    m() {
        return this[0].getMinutes()
    },

    // 分钟 [00..59]
    mm() {
        return this.fillZero(this.m())
    },

    // 秒 [0..59]
    s() {
        return this[0].getSeconds()
    },

    // 秒 [00..59]
    ss() {
        return this.fillZero(this.s())
    },

    // 毫秒 [0..999]
    SSS() {
        return this[0].getMilliseconds()
    },

    // 毫秒 [0..99]
    SS() {
        return Math.floor(this.SSS() / 10)
    },

    // 毫秒 [0..9]
    S() {
        return Math.floor(this.SS() / 10)
    },

    A() {
        let hm = this.H() * 100 + this.m()
        let part = ['凌晨', '早上', '上午', '中午', '下午', '晚上']
        let interval = [600, 900, 1130, 1230, 1800, Infinity]
        let i = interval.findIndex(function (item) {
            return hm < item
        })
        return part[i]
    },

    // A 的别名
    a() {
        return this.A()
    },

    // 时间戳，单位：毫秒
    x() {
        return this[0].getTime()
    },

    // 时间戳，单位：秒
    X() {
        return Math.floor(this.x() / 1000)
    }
}

/**
 * 倒计时
 * @param {number|string|Date} time 类型为数字表示剩余的秒数，为Date实例或字符串（符合ISO 8601格式），表示结束的时间点。
 */
TimeFormater.countdown = function (time) {
    let endPoint = 0
    if (typeof time === 'number') {
        // time 为数字类型，表示剩余的秒数
        endPoint = time * 1000 + Date.now()
    } else if (typeof time === 'string') {
        // time 为字符串，则应符合ISO 8601格式，表示结束的时间点
        endPoint = new Date(time).getTime()
    } else if (time instanceof Date) {
        // time 为Date对象实例，表示结束的时间点
        endPoint = time.getTime()
    }

    /**
     * 将剩余的时间量格式化为字符串
     * @param {string} token 用于指定输出格式。例：'剩余：d天H小时m分钟s秒' => "剩余：1天11小时4分钟38秒"。
     */
    let format = function (token) {
        let now = Date.now()
        let remain = endPoint - now
        let limit = 0 // 忽略负数
        remain = Math.max(limit, remain)

        return token.replace(/(?:#(\d+))?([dHmsS])/g, function (all, width, key) {
            // 如果存在换算单位，则进行单位转换
            if (UNIT_SIZE[key]) {
                let r = remain
                remain %= UNIT_SIZE[key]
                let str = parseInt(r / UNIT_SIZE[key]).toString()
                // 如果指定宽度，则进行填充处理
                if (width && str.length < width) {
                    str = new Array(width - str.length).fill(0).join('') + str
                }
                return str
            } else {
                return key
            }
        })
    }

    return { format }
}

module.exports = TimeFormater

/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(196);

var vec2 = __webpack_require__(203);

var Draggable = __webpack_require__(339);

var Eventful = __webpack_require__(227);

/**
 * Handler
 * @module zrender/Handler
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         errorrik (errorrik@gmail.com)
 *         pissang (shenyi.914@gmail.com)
 */
var SILENT = 'silent';

function makeEventPacket(eveType, targetInfo, event) {
  return {
    type: eveType,
    event: event,
    // target can only be an element that is not silent.
    target: targetInfo.target,
    // topTarget can be a silent element.
    topTarget: targetInfo.topTarget,
    cancelBubble: false,
    offsetX: event.zrX,
    offsetY: event.zrY,
    gestureEvent: event.gestureEvent,
    pinchX: event.pinchX,
    pinchY: event.pinchY,
    pinchScale: event.pinchScale,
    wheelDelta: event.zrDelta,
    zrByTouch: event.zrByTouch,
    which: event.which
  };
}

function EmptyProxy() {}

EmptyProxy.prototype.dispose = function () {};

var handlerNames = ['click', 'dblclick', 'mousewheel', 'mouseout', 'mouseup', 'mousedown', 'mousemove', 'contextmenu'];
/**
 * @alias module:zrender/Handler
 * @constructor
 * @extends module:zrender/mixin/Eventful
 * @param {module:zrender/Storage} storage Storage instance.
 * @param {module:zrender/Painter} painter Painter instance.
 * @param {module:zrender/dom/HandlerProxy} proxy HandlerProxy instance.
 * @param {HTMLElement} painterRoot painter.root (not painter.getViewportRoot()).
 */

var Handler = function (storage, painter, proxy, painterRoot) {
  Eventful.call(this);
  this.storage = storage;
  this.painter = painter;
  this.painterRoot = painterRoot;
  proxy = proxy || new EmptyProxy();
  /**
   * Proxy of event. can be Dom, WebGLSurface, etc.
   */

  this.proxy = proxy; // Attach handler

  proxy.handler = this;
  /**
   * {target, topTarget, x, y}
   * @private
   * @type {Object}
   */

  this._hovered = {};
  /**
   * @private
   * @type {Date}
   */

  this._lastTouchMoment;
  /**
   * @private
   * @type {number}
   */

  this._lastX;
  /**
   * @private
   * @type {number}
   */

  this._lastY;
  Draggable.call(this);
  util.each(handlerNames, function (name) {
    proxy.on && proxy.on(name, this[name], this);
  }, this);
};

Handler.prototype = {
  constructor: Handler,
  mousemove: function (event) {
    var x = event.zrX;
    var y = event.zrY;
    var lastHovered = this._hovered;
    var lastHoveredTarget = lastHovered.target; // If lastHoveredTarget is removed from zr (detected by '__zr') by some API call
    // (like 'setOption' or 'dispatchAction') in event handlers, we should find
    // lastHovered again here. Otherwise 'mouseout' can not be triggered normally.
    // See #6198.

    if (lastHoveredTarget && !lastHoveredTarget.__zr) {
      lastHovered = this.findHover(lastHovered.x, lastHovered.y);
      lastHoveredTarget = lastHovered.target;
    }

    var hovered = this._hovered = this.findHover(x, y);
    var hoveredTarget = hovered.target;
    var proxy = this.proxy;
    proxy.setCursor && proxy.setCursor(hoveredTarget ? hoveredTarget.cursor : 'default'); // Mouse out on previous hovered element

    if (lastHoveredTarget && hoveredTarget !== lastHoveredTarget) {
      this.dispatchToElement(lastHovered, 'mouseout', event);
    } // Mouse moving on one element


    this.dispatchToElement(hovered, 'mousemove', event); // Mouse over on a new element

    if (hoveredTarget && hoveredTarget !== lastHoveredTarget) {
      this.dispatchToElement(hovered, 'mouseover', event);
    }
  },
  mouseout: function (event) {
    this.dispatchToElement(this._hovered, 'mouseout', event); // There might be some doms created by upper layer application
    // at the same level of painter.getViewportRoot() (e.g., tooltip
    // dom created by echarts), where 'globalout' event should not
    // be triggered when mouse enters these doms. (But 'mouseout'
    // should be triggered at the original hovered element as usual).

    var element = event.toElement || event.relatedTarget;
    var innerDom;

    do {
      element = element && element.parentNode;
    } while (element && element.nodeType != 9 && !(innerDom = element === this.painterRoot));

    !innerDom && this.trigger('globalout', {
      event: event
    });
  },

  /**
   * Resize
   */
  resize: function (event) {
    this._hovered = {};
  },

  /**
   * Dispatch event
   * @param {string} eventName
   * @param {event=} eventArgs
   */
  dispatch: function (eventName, eventArgs) {
    var handler = this[eventName];
    handler && handler.call(this, eventArgs);
  },

  /**
   * Dispose
   */
  dispose: function () {
    this.proxy.dispose();
    this.storage = this.proxy = this.painter = null;
  },

  /**
   * 设置默认的cursor style
   * @param {string} [cursorStyle='default'] 例如 crosshair
   */
  setCursorStyle: function (cursorStyle) {
    var proxy = this.proxy;
    proxy.setCursor && proxy.setCursor(cursorStyle);
  },

  /**
   * 事件分发代理
   *
   * @private
   * @param {Object} targetInfo {target, topTarget} 目标图形元素
   * @param {string} eventName 事件名称
   * @param {Object} event 事件对象
   */
  dispatchToElement: function (targetInfo, eventName, event) {
    targetInfo = targetInfo || {};
    var el = targetInfo.target;

    if (el && el.silent) {
      return;
    }

    var eventHandler = 'on' + eventName;
    var eventPacket = makeEventPacket(eventName, targetInfo, event);

    while (el) {
      el[eventHandler] && (eventPacket.cancelBubble = el[eventHandler].call(el, eventPacket));
      el.trigger(eventName, eventPacket);
      el = el.parent;

      if (eventPacket.cancelBubble) {
        break;
      }
    }

    if (!eventPacket.cancelBubble) {
      // 冒泡到顶级 zrender 对象
      this.trigger(eventName, eventPacket); // 分发事件到用户自定义层
      // 用户有可能在全局 click 事件中 dispose，所以需要判断下 painter 是否存在

      this.painter && this.painter.eachOtherLayer(function (layer) {
        if (typeof layer[eventHandler] == 'function') {
          layer[eventHandler].call(layer, eventPacket);
        }

        if (layer.trigger) {
          layer.trigger(eventName, eventPacket);
        }
      });
    }
  },

  /**
   * @private
   * @param {number} x
   * @param {number} y
   * @param {module:zrender/graphic/Displayable} exclude
   * @return {model:zrender/Element}
   * @method
   */
  findHover: function (x, y, exclude) {
    var list = this.storage.getDisplayList();
    var out = {
      x: x,
      y: y
    };

    for (var i = list.length - 1; i >= 0; i--) {
      var hoverCheckResult;

      if (list[i] !== exclude // getDisplayList may include ignored item in VML mode
      && !list[i].ignore && (hoverCheckResult = isHover(list[i], x, y))) {
        !out.topTarget && (out.topTarget = list[i]);

        if (hoverCheckResult !== SILENT) {
          out.target = list[i];
          break;
        }
      }
    }

    return out;
  }
}; // Common handlers

util.each(['click', 'mousedown', 'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
  Handler.prototype[name] = function (event) {
    // Find hover again to avoid click event is dispatched manually. Or click is triggered without mouseover
    var hovered = this.findHover(event.zrX, event.zrY);
    var hoveredTarget = hovered.target;

    if (name === 'mousedown') {
      this._downEl = hoveredTarget;
      this._downPoint = [event.zrX, event.zrY]; // In case click triggered before mouseup

      this._upEl = hoveredTarget;
    } else if (name === 'mosueup') {
      this._upEl = hoveredTarget;
    } else if (name === 'click') {
      if (this._downEl !== this._upEl // Original click event is triggered on the whole canvas element,
      // including the case that `mousedown` - `mousemove` - `mouseup`,
      // which should be filtered, otherwise it will bring trouble to
      // pan and zoom.
      || !this._downPoint // Arbitrary value
      || vec2.dist(this._downPoint, [event.zrX, event.zrY]) > 4) {
        return;
      }

      this._downPoint = null;
    }

    this.dispatchToElement(hovered, name, event);
  };
});

function isHover(displayable, x, y) {
  if (displayable[displayable.rectHover ? 'rectContain' : 'contain'](x, y)) {
    var el = displayable;
    var isSilent;

    while (el) {
      // If clipped by ancestor.
      // FIXME: If clipPath has neither stroke nor fill,
      // el.clipPath.contain(x, y) will always return false.
      if (el.clipPath && !el.clipPath.contain(x, y)) {
        return false;
      }

      if (el.silent) {
        isSilent = true;
      }

      el = el.parent;
    }

    return isSilent ? SILENT : true;
  }

  return false;
}

util.mixin(Handler, Eventful);
util.mixin(Handler, Draggable);
var _default = Handler;
module.exports = _default;

/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(196);

var _config = __webpack_require__(233);

var devicePixelRatio = _config.devicePixelRatio;

var Style = __webpack_require__(267);

var Pattern = __webpack_require__(266);

/**
 * @module zrender/Layer
 * @author pissang(https://www.github.com/pissang)
 */
function returnFalse() {
  return false;
}
/**
 * 创建dom
 *
 * @inner
 * @param {string} id dom id 待用
 * @param {Painter} painter painter instance
 * @param {number} number
 */


function createDom(id, painter, dpr) {
  var newDom = util.createCanvas();
  var width = painter.getWidth();
  var height = painter.getHeight();
  var newDomStyle = newDom.style; // 没append呢，请原谅我这样写，清晰~

  newDomStyle.position = 'absolute';
  newDomStyle.left = 0;
  newDomStyle.top = 0;
  newDomStyle.width = width + 'px';
  newDomStyle.height = height + 'px';
  newDom.width = width * dpr;
  newDom.height = height * dpr; // id不作为索引用，避免可能造成的重名，定义为私有属性

  newDom.setAttribute('data-zr-dom-id', id);
  return newDom;
}
/**
 * @alias module:zrender/Layer
 * @constructor
 * @extends module:zrender/mixin/Transformable
 * @param {string} id
 * @param {module:zrender/Painter} painter
 * @param {number} [dpr]
 */


var Layer = function (id, painter, dpr) {
  var dom;
  dpr = dpr || devicePixelRatio;

  if (typeof id === 'string') {
    dom = createDom(id, painter, dpr);
  } // Not using isDom because in node it will return false
  else if (util.isObject(id)) {
      dom = id;
      id = dom.id;
    }

  this.id = id;
  this.dom = dom;
  var domStyle = dom.style;

  if (domStyle) {
    // Not in node
    dom.onselectstart = returnFalse; // 避免页面选中的尴尬

    domStyle['-webkit-user-select'] = 'none';
    domStyle['user-select'] = 'none';
    domStyle['-webkit-touch-callout'] = 'none';
    domStyle['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';
    domStyle['padding'] = 0;
    domStyle['margin'] = 0;
    domStyle['border-width'] = 0;
  }

  this.domBack = null;
  this.ctxBack = null;
  this.painter = painter;
  this.config = null; // Configs

  /**
   * 每次清空画布的颜色
   * @type {string}
   * @default 0
   */

  this.clearColor = 0;
  /**
   * 是否开启动态模糊
   * @type {boolean}
   * @default false
   */

  this.motionBlur = false;
  /**
   * 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
   * @type {number}
   * @default 0.7
   */

  this.lastFrameAlpha = 0.7;
  /**
   * Layer dpr
   * @type {number}
   */

  this.dpr = dpr;
};

Layer.prototype = {
  constructor: Layer,
  elCount: 0,
  __dirty: true,
  initContext: function () {
    this.ctx = this.dom.getContext('2d');
    this.ctx.__currentValues = {};
    this.ctx.dpr = this.dpr;
  },
  createBackBuffer: function () {
    var dpr = this.dpr;
    this.domBack = createDom('back-' + this.id, this.painter, dpr);
    this.ctxBack = this.domBack.getContext('2d');
    this.ctxBack.__currentValues = {};

    if (dpr != 1) {
      this.ctxBack.scale(dpr, dpr);
    }
  },

  /**
   * @param  {number} width
   * @param  {number} height
   */
  resize: function (width, height) {
    var dpr = this.dpr;
    var dom = this.dom;
    var domStyle = dom.style;
    var domBack = this.domBack;
    domStyle.width = width + 'px';
    domStyle.height = height + 'px';
    dom.width = width * dpr;
    dom.height = height * dpr;

    if (domBack) {
      domBack.width = width * dpr;
      domBack.height = height * dpr;

      if (dpr != 1) {
        this.ctxBack.scale(dpr, dpr);
      }
    }
  },

  /**
   * 清空该层画布
   * @param {boolean} clearAll Clear all with out motion blur
   */
  clear: function (clearAll) {
    var dom = this.dom;
    var ctx = this.ctx;
    var width = dom.width;
    var height = dom.height;
    var clearColor = this.clearColor;
    var haveMotionBLur = this.motionBlur && !clearAll;
    var lastFrameAlpha = this.lastFrameAlpha;
    var dpr = this.dpr;

    if (haveMotionBLur) {
      if (!this.domBack) {
        this.createBackBuffer();
      }

      this.ctxBack.globalCompositeOperation = 'copy';
      this.ctxBack.drawImage(dom, 0, 0, width / dpr, height / dpr);
    }

    ctx.clearRect(0, 0, width, height);

    if (clearColor) {
      var clearColorGradientOrPattern; // Gradient

      if (clearColor.colorStops) {
        // Cache canvas gradient
        clearColorGradientOrPattern = clearColor.__canvasGradient || Style.getGradient(ctx, clearColor, {
          x: 0,
          y: 0,
          width: width,
          height: height
        });
        clearColor.__canvasGradient = clearColorGradientOrPattern;
      } // Pattern
      else if (clearColor.image) {
          clearColorGradientOrPattern = Pattern.prototype.getCanvasPattern.call(clearColor, ctx);
        }

      ctx.save();
      ctx.fillStyle = clearColorGradientOrPattern || clearColor;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    if (haveMotionBLur) {
      var domBack = this.domBack;
      ctx.save();
      ctx.globalAlpha = lastFrameAlpha;
      ctx.drawImage(domBack, 0, 0, width, height);
      ctx.restore();
    }
  }
};
var _default = Layer;
module.exports = _default;

/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

var _config = __webpack_require__(233);

var devicePixelRatio = _config.devicePixelRatio;

var util = __webpack_require__(196);

var log = __webpack_require__(264);

var BoundingRect = __webpack_require__(214);

var timsort = __webpack_require__(242);

var Layer = __webpack_require__(308);

var requestAnimationFrame = __webpack_require__(258);

var Image = __webpack_require__(265);

/**
 * Default canvas painter
 * @module zrender/Painter
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         errorrik (errorrik@gmail.com)
 *         pissang (https://www.github.com/pissang)
 */
// PENDIGN
// Layer exceeds MAX_PROGRESSIVE_LAYER_NUMBER may have some problem when flush directly second time.
//
// Maximum progressive layer. When exceeding this number. All elements will be drawed in the last layer.
var MAX_PROGRESSIVE_LAYER_NUMBER = 5;

function parseInt10(val) {
  return parseInt(val, 10);
}

function isLayerValid(layer) {
  if (!layer) {
    return false;
  }

  if (layer.__builtin__) {
    return true;
  }

  if (typeof layer.resize !== 'function' || typeof layer.refresh !== 'function') {
    return false;
  }

  return true;
}

function preProcessLayer(layer) {
  layer.__unusedCount++;
}

function postProcessLayer(layer) {
  if (layer.__unusedCount == 1) {
    layer.clear();
  }
}

var tmpRect = new BoundingRect(0, 0, 0, 0);
var viewRect = new BoundingRect(0, 0, 0, 0);

function isDisplayableCulled(el, width, height) {
  tmpRect.copy(el.getBoundingRect());

  if (el.transform) {
    tmpRect.applyTransform(el.transform);
  }

  viewRect.width = width;
  viewRect.height = height;
  return !tmpRect.intersect(viewRect);
}

function isClipPathChanged(clipPaths, prevClipPaths) {
  if (clipPaths == prevClipPaths) {
    // Can both be null or undefined
    return false;
  }

  if (!clipPaths || !prevClipPaths || clipPaths.length !== prevClipPaths.length) {
    return true;
  }

  for (var i = 0; i < clipPaths.length; i++) {
    if (clipPaths[i] !== prevClipPaths[i]) {
      return true;
    }
  }
}

function doClip(clipPaths, ctx) {
  for (var i = 0; i < clipPaths.length; i++) {
    var clipPath = clipPaths[i];
    clipPath.setTransform(ctx);
    ctx.beginPath();
    clipPath.buildPath(ctx, clipPath.shape);
    ctx.clip(); // Transform back

    clipPath.restoreTransform(ctx);
  }
}

function createRoot(width, height) {
  var domRoot = document.createElement('div'); // domRoot.onselectstart = returnFalse; // 避免页面选中的尴尬

  domRoot.style.cssText = ['position:relative', 'overflow:hidden', 'width:' + width + 'px', 'height:' + height + 'px', 'padding:0', 'margin:0', 'border-width:0'].join(';') + ';';
  return domRoot;
}
/**
 * @alias module:zrender/Painter
 * @constructor
 * @param {HTMLElement} root 绘图容器
 * @param {module:zrender/Storage} storage
 * @param {Object} opts
 */


var Painter = function (root, storage, opts) {
  this.type = 'canvas'; // In node environment using node-canvas

  var singleCanvas = !root.nodeName // In node ?
  || root.nodeName.toUpperCase() === 'CANVAS';
  this._opts = opts = util.extend({}, opts || {});
  /**
   * @type {number}
   */

  this.dpr = opts.devicePixelRatio || devicePixelRatio;
  /**
   * @type {boolean}
   * @private
   */

  this._singleCanvas = singleCanvas;
  /**
   * 绘图容器
   * @type {HTMLElement}
   */

  this.root = root;
  var rootStyle = root.style;

  if (rootStyle) {
    rootStyle['-webkit-tap-highlight-color'] = 'transparent';
    rootStyle['-webkit-user-select'] = rootStyle['user-select'] = rootStyle['-webkit-touch-callout'] = 'none';
    root.innerHTML = '';
  }
  /**
   * @type {module:zrender/Storage}
   */


  this.storage = storage;
  /**
   * @type {Array.<number>}
   * @private
   */

  var zlevelList = this._zlevelList = [];
  /**
   * @type {Object.<string, module:zrender/Layer>}
   * @private
   */

  var layers = this._layers = {};
  /**
   * @type {Object.<string, Object>}
   * @type {private}
   */

  this._layerConfig = {};

  if (!singleCanvas) {
    this._width = this._getSize(0);
    this._height = this._getSize(1);
    var domRoot = this._domRoot = createRoot(this._width, this._height);
    root.appendChild(domRoot);
  } else {
    if (opts.width != null) {
      root.width = opts.width;
    }

    if (opts.height != null) {
      root.height = opts.height;
    } // Use canvas width and height directly


    var width = root.width;
    var height = root.height;
    this._width = width;
    this._height = height; // Create layer if only one given canvas
    // Device pixel ratio is fixed to 1 because given canvas has its specified width and height

    var mainLayer = new Layer(root, this, 1);
    mainLayer.initContext(); // FIXME Use canvas width and height
    // mainLayer.resize(width, height);

    layers[0] = mainLayer;
    zlevelList.push(0);
    this._domRoot = root;
  } // Layers for progressive rendering


  this._progressiveLayers = [];
  /**
   * @type {module:zrender/Layer}
   * @private
   */

  this._hoverlayer;
  this._hoverElements = [];
};

Painter.prototype = {
  constructor: Painter,
  getType: function () {
    return 'canvas';
  },

  /**
   * If painter use a single canvas
   * @return {boolean}
   */
  isSingleCanvas: function () {
    return this._singleCanvas;
  },

  /**
   * @return {HTMLDivElement}
   */
  getViewportRoot: function () {
    return this._domRoot;
  },
  getViewportRootOffset: function () {
    var viewportRoot = this.getViewportRoot();

    if (viewportRoot) {
      return {
        offsetLeft: viewportRoot.offsetLeft || 0,
        offsetTop: viewportRoot.offsetTop || 0
      };
    }
  },

  /**
   * 刷新
   * @param {boolean} [paintAll=false] 强制绘制所有displayable
   */
  refresh: function (paintAll) {
    var list = this.storage.getDisplayList(true);
    var zlevelList = this._zlevelList;

    this._paintList(list, paintAll); // Paint custum layers


    for (var i = 0; i < zlevelList.length; i++) {
      var z = zlevelList[i];
      var layer = this._layers[z];

      if (!layer.__builtin__ && layer.refresh) {
        layer.refresh();
      }
    }

    this.refreshHover();

    if (this._progressiveLayers.length) {
      this._startProgessive();
    }

    return this;
  },
  addHover: function (el, hoverStyle) {
    if (el.__hoverMir) {
      return;
    }

    var elMirror = new el.constructor({
      style: el.style,
      shape: el.shape
    });
    elMirror.__from = el;
    el.__hoverMir = elMirror;
    elMirror.setStyle(hoverStyle);

    this._hoverElements.push(elMirror);
  },
  removeHover: function (el) {
    var elMirror = el.__hoverMir;
    var hoverElements = this._hoverElements;
    var idx = util.indexOf(hoverElements, elMirror);

    if (idx >= 0) {
      hoverElements.splice(idx, 1);
    }

    el.__hoverMir = null;
  },
  clearHover: function (el) {
    var hoverElements = this._hoverElements;

    for (var i = 0; i < hoverElements.length; i++) {
      var from = hoverElements[i].__from;

      if (from) {
        from.__hoverMir = null;
      }
    }

    hoverElements.length = 0;
  },
  refreshHover: function () {
    var hoverElements = this._hoverElements;
    var len = hoverElements.length;
    var hoverLayer = this._hoverlayer;
    hoverLayer && hoverLayer.clear();

    if (!len) {
      return;
    }

    timsort(hoverElements, this.storage.displayableSortFunc); // Use a extream large zlevel
    // FIXME?

    if (!hoverLayer) {
      hoverLayer = this._hoverlayer = this.getLayer(1e5);
    }

    var scope = {};
    hoverLayer.ctx.save();

    for (var i = 0; i < len;) {
      var el = hoverElements[i];
      var originalEl = el.__from; // Original el is removed
      // PENDING

      if (!(originalEl && originalEl.__zr)) {
        hoverElements.splice(i, 1);
        originalEl.__hoverMir = null;
        len--;
        continue;
      }

      i++; // Use transform
      // FIXME style and shape ?

      if (!originalEl.invisible) {
        el.transform = originalEl.transform;
        el.invTransform = originalEl.invTransform;
        el.__clipPaths = originalEl.__clipPaths; // el.

        this._doPaintEl(el, hoverLayer, true, scope);
      }
    }

    hoverLayer.ctx.restore();
  },
  _startProgessive: function () {
    var self = this;

    if (!self._furtherProgressive) {
      return;
    } // Use a token to stop progress steps triggered by
    // previous zr.refresh calling.


    var token = self._progressiveToken = +new Date();
    self._progress++;
    requestAnimationFrame(step);

    function step() {
      // In case refreshed or disposed
      if (token === self._progressiveToken && self.storage) {
        self._doPaintList(self.storage.getDisplayList());

        if (self._furtherProgressive) {
          self._progress++;
          requestAnimationFrame(step);
        } else {
          self._progressiveToken = -1;
        }
      }
    }
  },
  _clearProgressive: function () {
    this._progressiveToken = -1;
    this._progress = 0;
    util.each(this._progressiveLayers, function (layer) {
      layer.__dirty && layer.clear();
    });
  },
  _paintList: function (list, paintAll) {
    if (paintAll == null) {
      paintAll = false;
    }

    this._updateLayerStatus(list);

    this._clearProgressive();

    this.eachBuiltinLayer(preProcessLayer);

    this._doPaintList(list, paintAll);

    this.eachBuiltinLayer(postProcessLayer);
  },
  _doPaintList: function (list, paintAll) {
    var currentLayer;
    var currentZLevel;
    var ctx; // var invTransform = [];

    var scope;
    var progressiveLayerIdx = 0;
    var currentProgressiveLayer;
    var width = this._width;
    var height = this._height;
    var layerProgress;
    var frame = this._progress;

    function flushProgressiveLayer(layer) {
      var dpr = ctx.dpr || 1;
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0; // Avoid layer don't clear in next progressive frame

      currentLayer.__dirty = true;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(layer.dom, 0, 0, width * dpr, height * dpr);
      ctx.restore();
    }

    for (var i = 0, l = list.length; i < l; i++) {
      var el = list[i];
      var elZLevel = this._singleCanvas ? 0 : el.zlevel;
      var elFrame = el.__frame; // Flush at current context
      // PENDING

      if (elFrame < 0 && currentProgressiveLayer) {
        flushProgressiveLayer(currentProgressiveLayer);
        currentProgressiveLayer = null;
      } // Change draw layer


      if (currentZLevel !== elZLevel) {
        if (ctx) {
          ctx.restore();
        } // Reset scope


        scope = {}; // Only 0 zlevel if only has one canvas

        currentZLevel = elZLevel;
        currentLayer = this.getLayer(currentZLevel);

        if (!currentLayer.__builtin__) {
          log('ZLevel ' + currentZLevel + ' has been used by unkown layer ' + currentLayer.id);
        }

        ctx = currentLayer.ctx;
        ctx.save(); // Reset the count

        currentLayer.__unusedCount = 0;

        if (currentLayer.__dirty || paintAll) {
          currentLayer.clear();
        }
      }

      if (!(currentLayer.__dirty || paintAll)) {
        continue;
      }

      if (elFrame >= 0) {
        // Progressive layer changed
        if (!currentProgressiveLayer) {
          currentProgressiveLayer = this._progressiveLayers[Math.min(progressiveLayerIdx++, MAX_PROGRESSIVE_LAYER_NUMBER - 1)];
          currentProgressiveLayer.ctx.save();
          currentProgressiveLayer.renderScope = {};

          if (currentProgressiveLayer && currentProgressiveLayer.__progress > currentProgressiveLayer.__maxProgress) {
            // flushProgressiveLayer(currentProgressiveLayer);
            // Quick jump all progressive elements
            // All progressive element are not dirty, jump over and flush directly
            i = currentProgressiveLayer.__nextIdxNotProg - 1; // currentProgressiveLayer = null;

            continue;
          }

          layerProgress = currentProgressiveLayer.__progress;

          if (!currentProgressiveLayer.__dirty) {
            // Keep rendering
            frame = layerProgress;
          }

          currentProgressiveLayer.__progress = frame + 1;
        }

        if (elFrame === frame) {
          this._doPaintEl(el, currentProgressiveLayer, true, currentProgressiveLayer.renderScope);
        }
      } else {
        this._doPaintEl(el, currentLayer, paintAll, scope);
      }

      el.__dirty = false;
    }

    if (currentProgressiveLayer) {
      flushProgressiveLayer(currentProgressiveLayer);
    } // Restore the lastLayer ctx


    ctx && ctx.restore(); // If still has clipping state
    // if (scope.prevElClipPaths) {
    //     ctx.restore();
    // }

    this._furtherProgressive = false;
    util.each(this._progressiveLayers, function (layer) {
      if (layer.__maxProgress >= layer.__progress) {
        this._furtherProgressive = true;
      }
    }, this);
  },
  _doPaintEl: function (el, currentLayer, forcePaint, scope) {
    var ctx = currentLayer.ctx;
    var m = el.transform;

    if ((currentLayer.__dirty || forcePaint) && // Ignore invisible element
    !el.invisible // Ignore transparent element
    && el.style.opacity !== 0 // Ignore scale 0 element, in some environment like node-canvas
    // Draw a scale 0 element can cause all following draw wrong
    // And setTransform with scale 0 will cause set back transform failed.
    && !(m && !m[0] && !m[3]) // Ignore culled element
    && !(el.culling && isDisplayableCulled(el, this._width, this._height))) {
      var clipPaths = el.__clipPaths; // Optimize when clipping on group with several elements

      if (scope.prevClipLayer !== currentLayer || isClipPathChanged(clipPaths, scope.prevElClipPaths)) {
        // If has previous clipping state, restore from it
        if (scope.prevElClipPaths) {
          scope.prevClipLayer.ctx.restore();
          scope.prevClipLayer = scope.prevElClipPaths = null; // Reset prevEl since context has been restored

          scope.prevEl = null;
        } // New clipping state


        if (clipPaths) {
          ctx.save();
          doClip(clipPaths, ctx);
          scope.prevClipLayer = currentLayer;
          scope.prevElClipPaths = clipPaths;
        }
      }

      el.beforeBrush && el.beforeBrush(ctx);
      el.brush(ctx, scope.prevEl || null);
      scope.prevEl = el;
      el.afterBrush && el.afterBrush(ctx);
    }
  },

  /**
   * 获取 zlevel 所在层，如果不存在则会创建一个新的层
   * @param {number} zlevel
   * @return {module:zrender/Layer}
   */
  getLayer: function (zlevel) {
    if (this._singleCanvas) {
      return this._layers[0];
    }

    var layer = this._layers[zlevel];

    if (!layer) {
      // Create a new layer
      layer = new Layer('zr_' + zlevel, this, this.dpr);
      layer.__builtin__ = true;

      if (this._layerConfig[zlevel]) {
        util.merge(layer, this._layerConfig[zlevel], true);
      }

      this.insertLayer(zlevel, layer); // Context is created after dom inserted to document
      // Or excanvas will get 0px clientWidth and clientHeight

      layer.initContext();
    }

    return layer;
  },
  insertLayer: function (zlevel, layer) {
    var layersMap = this._layers;
    var zlevelList = this._zlevelList;
    var len = zlevelList.length;
    var prevLayer = null;
    var i = -1;
    var domRoot = this._domRoot;

    if (layersMap[zlevel]) {
      log('ZLevel ' + zlevel + ' has been used already');
      return;
    } // Check if is a valid layer


    if (!isLayerValid(layer)) {
      log('Layer of zlevel ' + zlevel + ' is not valid');
      return;
    }

    if (len > 0 && zlevel > zlevelList[0]) {
      for (i = 0; i < len - 1; i++) {
        if (zlevelList[i] < zlevel && zlevelList[i + 1] > zlevel) {
          break;
        }
      }

      prevLayer = layersMap[zlevelList[i]];
    }

    zlevelList.splice(i + 1, 0, zlevel);
    layersMap[zlevel] = layer; // Vitual layer will not directly show on the screen.
    // (It can be a WebGL layer and assigned to a ZImage element)
    // But it still under management of zrender.

    if (!layer.virtual) {
      if (prevLayer) {
        var prevDom = prevLayer.dom;

        if (prevDom.nextSibling) {
          domRoot.insertBefore(layer.dom, prevDom.nextSibling);
        } else {
          domRoot.appendChild(layer.dom);
        }
      } else {
        if (domRoot.firstChild) {
          domRoot.insertBefore(layer.dom, domRoot.firstChild);
        } else {
          domRoot.appendChild(layer.dom);
        }
      }
    }
  },
  // Iterate each layer
  eachLayer: function (cb, context) {
    var zlevelList = this._zlevelList;
    var z;
    var i;

    for (i = 0; i < zlevelList.length; i++) {
      z = zlevelList[i];
      cb.call(context, this._layers[z], z);
    }
  },
  // Iterate each buildin layer
  eachBuiltinLayer: function (cb, context) {
    var zlevelList = this._zlevelList;
    var layer;
    var z;
    var i;

    for (i = 0; i < zlevelList.length; i++) {
      z = zlevelList[i];
      layer = this._layers[z];

      if (layer.__builtin__) {
        cb.call(context, layer, z);
      }
    }
  },
  // Iterate each other layer except buildin layer
  eachOtherLayer: function (cb, context) {
    var zlevelList = this._zlevelList;
    var layer;
    var z;
    var i;

    for (i = 0; i < zlevelList.length; i++) {
      z = zlevelList[i];
      layer = this._layers[z];

      if (!layer.__builtin__) {
        cb.call(context, layer, z);
      }
    }
  },

  /**
   * 获取所有已创建的层
   * @param {Array.<module:zrender/Layer>} [prevLayer]
   */
  getLayers: function () {
    return this._layers;
  },
  _updateLayerStatus: function (list) {
    var layers = this._layers;
    var progressiveLayers = this._progressiveLayers;
    var elCountsLastFrame = {};
    var progressiveElCountsLastFrame = {};
    this.eachBuiltinLayer(function (layer, z) {
      elCountsLastFrame[z] = layer.elCount;
      layer.elCount = 0;
      layer.__dirty = false;
    });
    util.each(progressiveLayers, function (layer, idx) {
      progressiveElCountsLastFrame[idx] = layer.elCount;
      layer.elCount = 0;
      layer.__dirty = false;
    });
    var progressiveLayerCount = 0;
    var currentProgressiveLayer;
    var lastProgressiveKey;
    var frameCount = 0;

    for (var i = 0, l = list.length; i < l; i++) {
      var el = list[i];
      var zlevel = this._singleCanvas ? 0 : el.zlevel;
      var layer = layers[zlevel];
      var elProgress = el.progressive;

      if (layer) {
        layer.elCount++;
        layer.__dirty = layer.__dirty || el.__dirty;
      } /////// Update progressive


      if (elProgress >= 0) {
        // Fix wrong progressive sequence problem.
        if (lastProgressiveKey !== elProgress) {
          lastProgressiveKey = elProgress;
          frameCount++;
        }

        var elFrame = el.__frame = frameCount - 1;

        if (!currentProgressiveLayer) {
          var idx = Math.min(progressiveLayerCount, MAX_PROGRESSIVE_LAYER_NUMBER - 1);
          currentProgressiveLayer = progressiveLayers[idx];

          if (!currentProgressiveLayer) {
            currentProgressiveLayer = progressiveLayers[idx] = new Layer('progressive', this, this.dpr);
            currentProgressiveLayer.initContext();
          }

          currentProgressiveLayer.__maxProgress = 0;
        }

        currentProgressiveLayer.__dirty = currentProgressiveLayer.__dirty || el.__dirty;
        currentProgressiveLayer.elCount++;
        currentProgressiveLayer.__maxProgress = Math.max(currentProgressiveLayer.__maxProgress, elFrame);

        if (currentProgressiveLayer.__maxProgress >= currentProgressiveLayer.__progress) {
          // Should keep rendering this  layer because progressive rendering is not finished yet
          layer.__dirty = true;
        }
      } else {
        el.__frame = -1;

        if (currentProgressiveLayer) {
          currentProgressiveLayer.__nextIdxNotProg = i;
          progressiveLayerCount++;
          currentProgressiveLayer = null;
        }
      }
    }

    if (currentProgressiveLayer) {
      progressiveLayerCount++;
      currentProgressiveLayer.__nextIdxNotProg = i;
    } // 层中的元素数量有发生变化


    this.eachBuiltinLayer(function (layer, z) {
      if (elCountsLastFrame[z] !== layer.elCount) {
        layer.__dirty = true;
      }
    });
    progressiveLayers.length = Math.min(progressiveLayerCount, MAX_PROGRESSIVE_LAYER_NUMBER);
    util.each(progressiveLayers, function (layer, idx) {
      if (progressiveElCountsLastFrame[idx] !== layer.elCount) {
        el.__dirty = true;
      }

      if (layer.__dirty) {
        layer.__progress = 0;
      }
    });
  },

  /**
   * 清除hover层外所有内容
   */
  clear: function () {
    this.eachBuiltinLayer(this._clearLayer);
    return this;
  },
  _clearLayer: function (layer) {
    layer.clear();
  },

  /**
   * 修改指定zlevel的绘制参数
   *
   * @param {string} zlevel
   * @param {Object} config 配置对象
   * @param {string} [config.clearColor=0] 每次清空画布的颜色
   * @param {string} [config.motionBlur=false] 是否开启动态模糊
   * @param {number} [config.lastFrameAlpha=0.7]
   *                 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
   */
  configLayer: function (zlevel, config) {
    if (config) {
      var layerConfig = this._layerConfig;

      if (!layerConfig[zlevel]) {
        layerConfig[zlevel] = config;
      } else {
        util.merge(layerConfig[zlevel], config, true);
      }

      var layer = this._layers[zlevel];

      if (layer) {
        util.merge(layer, layerConfig[zlevel], true);
      }
    }
  },

  /**
   * 删除指定层
   * @param {number} zlevel 层所在的zlevel
   */
  delLayer: function (zlevel) {
    var layers = this._layers;
    var zlevelList = this._zlevelList;
    var layer = layers[zlevel];

    if (!layer) {
      return;
    }

    layer.dom.parentNode.removeChild(layer.dom);
    delete layers[zlevel];
    zlevelList.splice(util.indexOf(zlevelList, zlevel), 1);
  },

  /**
   * 区域大小变化后重绘
   */
  resize: function (width, height) {
    var domRoot = this._domRoot; // FIXME Why ?

    domRoot.style.display = 'none'; // Save input w/h

    var opts = this._opts;
    width != null && (opts.width = width);
    height != null && (opts.height = height);
    width = this._getSize(0);
    height = this._getSize(1);
    domRoot.style.display = ''; // 优化没有实际改变的resize

    if (this._width != width || height != this._height) {
      domRoot.style.width = width + 'px';
      domRoot.style.height = height + 'px';

      for (var id in this._layers) {
        if (this._layers.hasOwnProperty(id)) {
          this._layers[id].resize(width, height);
        }
      }

      util.each(this._progressiveLayers, function (layer) {
        layer.resize(width, height);
      });
      this.refresh(true);
    }

    this._width = width;
    this._height = height;
    return this;
  },

  /**
   * 清除单独的一个层
   * @param {number} zlevel
   */
  clearLayer: function (zlevel) {
    var layer = this._layers[zlevel];

    if (layer) {
      layer.clear();
    }
  },

  /**
   * 释放
   */
  dispose: function () {
    this.root.innerHTML = '';
    this.root = this.storage = this._domRoot = this._layers = null;
  },

  /**
   * Get canvas which has all thing rendered
   * @param {Object} opts
   * @param {string} [opts.backgroundColor]
   * @param {number} [opts.pixelRatio]
   */
  getRenderedCanvas: function (opts) {
    opts = opts || {};

    if (this._singleCanvas) {
      return this._layers[0].dom;
    }

    var imageLayer = new Layer('image', this, opts.pixelRatio || this.dpr);
    imageLayer.initContext();
    imageLayer.clearColor = opts.backgroundColor;
    imageLayer.clear();
    var displayList = this.storage.getDisplayList(true);
    var scope = {};
    var zlevel;
    var self = this;

    function findAndDrawOtherLayer(smaller, larger) {
      var zlevelList = self._zlevelList;

      if (smaller == null) {
        smaller = -Infinity;
      }

      var intermediateLayer;

      for (var i = 0; i < zlevelList.length; i++) {
        var z = zlevelList[i];
        var layer = self._layers[z];

        if (!layer.__builtin__ && z > smaller && z < larger) {
          intermediateLayer = layer;
          break;
        }
      }

      if (intermediateLayer && intermediateLayer.renderToCanvas) {
        imageLayer.ctx.save();
        intermediateLayer.renderToCanvas(imageLayer.ctx);
        imageLayer.ctx.restore();
      }
    }

    for (var i = 0; i < displayList.length; i++) {
      var el = displayList[i];

      if (el.zlevel !== zlevel) {
        findAndDrawOtherLayer(zlevel, el.zlevel);
        zlevel = el.zlevel;
      }

      this._doPaintEl(el, imageLayer, true, scope);
    }

    findAndDrawOtherLayer(zlevel, Infinity);
    return imageLayer.dom;
  },

  /**
   * 获取绘图区域宽度
   */
  getWidth: function () {
    return this._width;
  },

  /**
   * 获取绘图区域高度
   */
  getHeight: function () {
    return this._height;
  },
  _getSize: function (whIdx) {
    var opts = this._opts;
    var wh = ['width', 'height'][whIdx];
    var cwh = ['clientWidth', 'clientHeight'][whIdx];
    var plt = ['paddingLeft', 'paddingTop'][whIdx];
    var prb = ['paddingRight', 'paddingBottom'][whIdx];

    if (opts[wh] != null && opts[wh] !== 'auto') {
      return parseFloat(opts[wh]);
    }

    var root = this.root; // IE8 does not support getComputedStyle, but it use VML.

    var stl = document.defaultView.getComputedStyle(root);
    return (root[cwh] || parseInt10(stl[wh]) || parseInt10(root.style[wh])) - (parseInt10(stl[plt]) || 0) - (parseInt10(stl[prb]) || 0) | 0;
  },
  pathToImage: function (path, dpr) {
    dpr = dpr || this.dpr;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var rect = path.getBoundingRect();
    var style = path.style;
    var shadowBlurSize = style.shadowBlur;
    var shadowOffsetX = style.shadowOffsetX;
    var shadowOffsetY = style.shadowOffsetY;
    var lineWidth = style.hasStroke() ? style.lineWidth : 0;
    var leftMargin = Math.max(lineWidth / 2, -shadowOffsetX + shadowBlurSize);
    var rightMargin = Math.max(lineWidth / 2, shadowOffsetX + shadowBlurSize);
    var topMargin = Math.max(lineWidth / 2, -shadowOffsetY + shadowBlurSize);
    var bottomMargin = Math.max(lineWidth / 2, shadowOffsetY + shadowBlurSize);
    var width = rect.width + leftMargin + rightMargin;
    var height = rect.height + topMargin + bottomMargin;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    ctx.dpr = dpr;
    var pathTransform = {
      position: path.position,
      rotation: path.rotation,
      scale: path.scale
    };
    path.position = [leftMargin - rect.x, topMargin - rect.y];
    path.rotation = 0;
    path.scale = [1, 1];
    path.updateTransform();

    if (path) {
      path.brush(ctx);
    }

    var ImageShape = Image;
    var imgShape = new ImageShape({
      style: {
        x: 0,
        y: 0,
        image: canvas
      }
    });

    if (pathTransform.position != null) {
      imgShape.position = path.position = pathTransform.position;
    }

    if (pathTransform.rotation != null) {
      imgShape.rotation = path.rotation = pathTransform.rotation;
    }

    if (pathTransform.scale != null) {
      imgShape.scale = path.scale = pathTransform.scale;
    }

    return imgShape;
  }
};
var _default = Painter;
module.exports = _default;

/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(196);

var env = __webpack_require__(213);

var Group = __webpack_require__(234);

var timsort = __webpack_require__(242);

/**
 * Storage内容仓库模块
 * @module zrender/Storage
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 * @author errorrik (errorrik@gmail.com)
 * @author pissang (https://github.com/pissang/)
 */
// Use timsort because in most case elements are partially sorted
// https://jsfiddle.net/pissang/jr4x7mdm/8/
function shapeCompareFunc(a, b) {
  if (a.zlevel === b.zlevel) {
    if (a.z === b.z) {
      // if (a.z2 === b.z2) {
      //     // FIXME Slow has renderidx compare
      //     // http://stackoverflow.com/questions/20883421/sorting-in-javascript-should-every-compare-function-have-a-return-0-statement
      //     // https://github.com/v8/v8/blob/47cce544a31ed5577ffe2963f67acb4144ee0232/src/js/array.js#L1012
      //     return a.__renderidx - b.__renderidx;
      // }
      return a.z2 - b.z2;
    }

    return a.z - b.z;
  }

  return a.zlevel - b.zlevel;
}
/**
 * 内容仓库 (M)
 * @alias module:zrender/Storage
 * @constructor
 */


var Storage = function () {
  // jshint ignore:line
  this._roots = [];
  this._displayList = [];
  this._displayListLen = 0;
};

Storage.prototype = {
  constructor: Storage,

  /**
   * @param  {Function} cb
   *
   */
  traverse: function (cb, context) {
    for (var i = 0; i < this._roots.length; i++) {
      this._roots[i].traverse(cb, context);
    }
  },

  /**
   * 返回所有图形的绘制队列
   * @param {boolean} [update=false] 是否在返回前更新该数组
   * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组, 在 update 为 true 的时候有效
   *
   * 详见{@link module:zrender/graphic/Displayable.prototype.updateDisplayList}
   * @return {Array.<module:zrender/graphic/Displayable>}
   */
  getDisplayList: function (update, includeIgnore) {
    includeIgnore = includeIgnore || false;

    if (update) {
      this.updateDisplayList(includeIgnore);
    }

    return this._displayList;
  },

  /**
   * 更新图形的绘制队列。
   * 每次绘制前都会调用，该方法会先深度优先遍历整个树，更新所有Group和Shape的变换并且把所有可见的Shape保存到数组中，
   * 最后根据绘制的优先级（zlevel > z > 插入顺序）排序得到绘制队列
   * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组
   */
  updateDisplayList: function (includeIgnore) {
    this._displayListLen = 0;
    var roots = this._roots;
    var displayList = this._displayList;

    for (var i = 0, len = roots.length; i < len; i++) {
      this._updateAndAddDisplayable(roots[i], null, includeIgnore);
    }

    displayList.length = this._displayListLen; // for (var i = 0, len = displayList.length; i < len; i++) {
    //     displayList[i].__renderidx = i;
    // }
    // displayList.sort(shapeCompareFunc);

    env.canvasSupported && timsort(displayList, shapeCompareFunc);
  },
  _updateAndAddDisplayable: function (el, clipPaths, includeIgnore) {
    if (el.ignore && !includeIgnore) {
      return;
    }

    el.beforeUpdate();

    if (el.__dirty) {
      el.update();
    }

    el.afterUpdate();
    var userSetClipPath = el.clipPath;

    if (userSetClipPath) {
      // FIXME 效率影响
      if (clipPaths) {
        clipPaths = clipPaths.slice();
      } else {
        clipPaths = [];
      }

      var currentClipPath = userSetClipPath;
      var parentClipPath = el; // Recursively add clip path

      while (currentClipPath) {
        // clipPath 的变换是基于使用这个 clipPath 的元素
        currentClipPath.parent = parentClipPath;
        currentClipPath.updateTransform();
        clipPaths.push(currentClipPath);
        parentClipPath = currentClipPath;
        currentClipPath = currentClipPath.clipPath;
      }
    }

    if (el.isGroup) {
      var children = el._children;

      for (var i = 0; i < children.length; i++) {
        var child = children[i]; // Force to mark as dirty if group is dirty
        // FIXME __dirtyPath ?

        if (el.__dirty) {
          child.__dirty = true;
        }

        this._updateAndAddDisplayable(child, clipPaths, includeIgnore);
      } // Mark group clean here


      el.__dirty = false;
    } else {
      el.__clipPaths = clipPaths;
      this._displayList[this._displayListLen++] = el;
    }
  },

  /**
   * 添加图形(Shape)或者组(Group)到根节点
   * @param {module:zrender/Element} el
   */
  addRoot: function (el) {
    if (el.__storage === this) {
      return;
    }

    if (el instanceof Group) {
      el.addChildrenToStorage(this);
    }

    this.addToStorage(el);

    this._roots.push(el);
  },

  /**
   * 删除指定的图形(Shape)或者组(Group)
   * @param {string|Array.<string>} [el] 如果为空清空整个Storage
   */
  delRoot: function (el) {
    if (el == null) {
      // 不指定el清空
      for (var i = 0; i < this._roots.length; i++) {
        var root = this._roots[i];

        if (root instanceof Group) {
          root.delChildrenFromStorage(this);
        }
      }

      this._roots = [];
      this._displayList = [];
      this._displayListLen = 0;
      return;
    }

    if (el instanceof Array) {
      for (var i = 0, l = el.length; i < l; i++) {
        this.delRoot(el[i]);
      }

      return;
    }

    var idx = util.indexOf(this._roots, el);

    if (idx >= 0) {
      this.delFromStorage(el);

      this._roots.splice(idx, 1);

      if (el instanceof Group) {
        el.delChildrenFromStorage(this);
      }
    }
  },
  addToStorage: function (el) {
    el.__storage = this;
    el.dirty(false);
    return this;
  },
  delFromStorage: function (el) {
    if (el) {
      el.__storage = null;
    }

    return this;
  },

  /**
   * 清空并且释放Storage
   */
  dispose: function () {
    this._renderList = this._roots = null;
  },
  displayableSortFunc: shapeCompareFunc
};
var _default = Storage;
module.exports = _default;

/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(196);

var _event = __webpack_require__(230);

var Dispatcher = _event.Dispatcher;

var requestAnimationFrame = __webpack_require__(258);

var Animator = __webpack_require__(257);

/**
 * 动画主类, 调度和管理所有动画控制器
 *
 * @module zrender/animation/Animation
 * @author pissang(https://github.com/pissang)
 */
// TODO Additive animation
// http://iosoteric.com/additive-animations-animatewithduration-in-ios-8/
// https://developer.apple.com/videos/wwdc2014/#236

/**
 * @typedef {Object} IZRenderStage
 * @property {Function} update
 */

/**
 * @alias module:zrender/animation/Animation
 * @constructor
 * @param {Object} [options]
 * @param {Function} [options.onframe]
 * @param {IZRenderStage} [options.stage]
 * @example
 *     var animation = new Animation();
 *     var obj = {
 *         x: 100,
 *         y: 100
 *     };
 *     animation.animate(node.position)
 *         .when(1000, {
 *             x: 500,
 *             y: 500
 *         })
 *         .when(2000, {
 *             x: 100,
 *             y: 100
 *         })
 *         .start('spline');
 */
var Animation = function (options) {
  options = options || {};
  this.stage = options.stage || {};

  this.onframe = options.onframe || function () {}; // private properties


  this._clips = [];
  this._running = false;
  this._time;
  this._pausedTime;
  this._pauseStart;
  this._paused = false;
  Dispatcher.call(this);
};

Animation.prototype = {
  constructor: Animation,

  /**
   * 添加 clip
   * @param {module:zrender/animation/Clip} clip
   */
  addClip: function (clip) {
    this._clips.push(clip);
  },

  /**
   * 添加 animator
   * @param {module:zrender/animation/Animator} animator
   */
  addAnimator: function (animator) {
    animator.animation = this;
    var clips = animator.getClips();

    for (var i = 0; i < clips.length; i++) {
      this.addClip(clips[i]);
    }
  },

  /**
   * 删除动画片段
   * @param {module:zrender/animation/Clip} clip
   */
  removeClip: function (clip) {
    var idx = util.indexOf(this._clips, clip);

    if (idx >= 0) {
      this._clips.splice(idx, 1);
    }
  },

  /**
   * 删除动画片段
   * @param {module:zrender/animation/Animator} animator
   */
  removeAnimator: function (animator) {
    var clips = animator.getClips();

    for (var i = 0; i < clips.length; i++) {
      this.removeClip(clips[i]);
    }

    animator.animation = null;
  },
  _update: function () {
    var time = new Date().getTime() - this._pausedTime;

    var delta = time - this._time;
    var clips = this._clips;
    var len = clips.length;
    var deferredEvents = [];
    var deferredClips = [];

    for (var i = 0; i < len; i++) {
      var clip = clips[i];
      var e = clip.step(time, delta); // Throw out the events need to be called after
      // stage.update, like destroy

      if (e) {
        deferredEvents.push(e);
        deferredClips.push(clip);
      }
    } // Remove the finished clip


    for (var i = 0; i < len;) {
      if (clips[i]._needsRemove) {
        clips[i] = clips[len - 1];
        clips.pop();
        len--;
      } else {
        i++;
      }
    }

    len = deferredEvents.length;

    for (var i = 0; i < len; i++) {
      deferredClips[i].fire(deferredEvents[i]);
    }

    this._time = time;
    this.onframe(delta);
    this.trigger('frame', delta);

    if (this.stage.update) {
      this.stage.update();
    }
  },
  _startLoop: function () {
    var self = this;
    this._running = true;

    function step() {
      if (self._running) {
        requestAnimationFrame(step);
        !self._paused && self._update();
      }
    }

    requestAnimationFrame(step);
  },

  /**
   * 开始运行动画
   */
  start: function () {
    this._time = new Date().getTime();
    this._pausedTime = 0;

    this._startLoop();
  },

  /**
   * 停止运行动画
   */
  stop: function () {
    this._running = false;
  },

  /**
   * Pause
   */
  pause: function () {
    if (!this._paused) {
      this._pauseStart = new Date().getTime();
      this._paused = true;
    }
  },

  /**
   * Resume
   */
  resume: function () {
    if (this._paused) {
      this._pausedTime += new Date().getTime() - this._pauseStart;
      this._paused = false;
    }
  },

  /**
   * 清除所有动画片段
   */
  clear: function () {
    this._clips = [];
  },

  /**
   * 对一个目标创建一个animator对象，可以指定目标中的属性使用动画
   * @param  {Object} target
   * @param  {Object} options
   * @param  {boolean} [options.loop=false] 是否循环播放动画
   * @param  {Function} [options.getter=null]
   *         如果指定getter函数，会通过getter函数取属性值
   * @param  {Function} [options.setter=null]
   *         如果指定setter函数，会通过setter函数设置属性值
   * @return {module:zrender/animation/Animation~Animator}
   */
  // TODO Gap
  animate: function (target, options) {
    options = options || {};
    var animator = new Animator(target, options.loop, options.getter, options.setter);
    this.addAnimator(animator);
    return animator;
  }
};
util.mixin(Animation, Dispatcher);
var _default = Animation;
module.exports = _default;

/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

var easingFuncs = __webpack_require__(313);

/**
 * 动画主控制器
 * @config target 动画对象，可以是数组，如果是数组的话会批量分发onframe等事件
 * @config life(1000) 动画时长
 * @config delay(0) 动画延迟时间
 * @config loop(true)
 * @config gap(0) 循环的间隔时间
 * @config onframe
 * @config easing(optional)
 * @config ondestroy(optional)
 * @config onrestart(optional)
 *
 * TODO pause
 */
function Clip(options) {
  this._target = options.target; // 生命周期

  this._life = options.life || 1000; // 延时

  this._delay = options.delay || 0; // 开始时间
  // this._startTime = new Date().getTime() + this._delay;// 单位毫秒

  this._initialized = false; // 是否循环

  this.loop = options.loop == null ? false : options.loop;
  this.gap = options.gap || 0;
  this.easing = options.easing || 'Linear';
  this.onframe = options.onframe;
  this.ondestroy = options.ondestroy;
  this.onrestart = options.onrestart;
  this._pausedTime = 0;
  this._paused = false;
}

Clip.prototype = {
  constructor: Clip,
  step: function (globalTime, deltaTime) {
    // Set startTime on first step, or _startTime may has milleseconds different between clips
    // PENDING
    if (!this._initialized) {
      this._startTime = globalTime + this._delay;
      this._initialized = true;
    }

    if (this._paused) {
      this._pausedTime += deltaTime;
      return;
    }

    var percent = (globalTime - this._startTime - this._pausedTime) / this._life; // 还没开始

    if (percent < 0) {
      return;
    }

    percent = Math.min(percent, 1);
    var easing = this.easing;
    var easingFunc = typeof easing == 'string' ? easingFuncs[easing] : easing;
    var schedule = typeof easingFunc === 'function' ? easingFunc(percent) : percent;
    this.fire('frame', schedule); // 结束

    if (percent == 1) {
      if (this.loop) {
        this.restart(globalTime); // 重新开始周期
        // 抛出而不是直接调用事件直到 stage.update 后再统一调用这些事件

        return 'restart';
      } // 动画完成将这个控制器标识为待删除
      // 在Animation.update中进行批量删除


      this._needsRemove = true;
      return 'destroy';
    }

    return null;
  },
  restart: function (globalTime) {
    var remainder = (globalTime - this._startTime - this._pausedTime) % this._life;
    this._startTime = globalTime - remainder + this.gap;
    this._pausedTime = 0;
    this._needsRemove = false;
  },
  fire: function (eventType, arg) {
    eventType = 'on' + eventType;

    if (this[eventType]) {
      this[eventType](this._target, arg);
    }
  },
  pause: function () {
    this._paused = true;
  },
  resume: function () {
    this._paused = false;
  }
};
var _default = Clip;
module.exports = _default;

/***/ }),
/* 313 */
/***/ (function(module, exports) {

/**
 * 缓动代码来自 https://github.com/sole/tween.js/blob/master/src/Tween.js
 * @see http://sole.github.io/tween.js/examples/03_graphs.html
 * @exports zrender/animation/easing
 */
var easing = {
  /**
  * @param {number} k
  * @return {number}
  */
  linear: function (k) {
    return k;
  },

  /**
  * @param {number} k
  * @return {number}
  */
  quadraticIn: function (k) {
    return k * k;
  },

  /**
  * @param {number} k
  * @return {number}
  */
  quadraticOut: function (k) {
    return k * (2 - k);
  },

  /**
  * @param {number} k
  * @return {number}
  */
  quadraticInOut: function (k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k;
    }

    return -0.5 * (--k * (k - 2) - 1);
  },
  // 三次方的缓动（t^3）

  /**
  * @param {number} k
  * @return {number}
  */
  cubicIn: function (k) {
    return k * k * k;
  },

  /**
  * @param {number} k
  * @return {number}
  */
  cubicOut: function (k) {
    return --k * k * k + 1;
  },

  /**
  * @param {number} k
  * @return {number}
  */
  cubicInOut: function (k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k;
    }

    return 0.5 * ((k -= 2) * k * k + 2);
  },
  // 四次方的缓动（t^4）

  /**
  * @param {number} k
  * @return {number}
  */
  quarticIn: function (k) {
    return k * k * k * k;
  },

  /**
  * @param {number} k
  * @return {number}
  */
  quarticOut: function (k) {
    return 1 - --k * k * k * k;
  },

  /**
  * @param {number} k
  * @return {number}
  */
  quarticInOut: function (k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k * k;
    }

    return -0.5 * ((k -= 2) * k * k * k - 2);
  },
  // 五次方的缓动（t^5）

  /**
  * @param {number} k
  * @return {number}
  */
  quinticIn: function (k) {
    return k * k * k * k * k;
  },

  /**
  * @param {number} k
  * @return {number}
  */
  quinticOut: function (k) {
    return --k * k * k * k * k + 1;
  },

  /**
  * @param {number} k
  * @return {number}
  */
  quinticInOut: function (k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k * k * k;
    }

    return 0.5 * ((k -= 2) * k * k * k * k + 2);
  },
  // 正弦曲线的缓动（sin(t)）

  /**
  * @param {number} k
  * @return {number}
  */
  sinusoidalIn: function (k) {
    return 1 - Math.cos(k * Math.PI / 2);
  },

  /**
  * @param {number} k
  * @return {number}
  */
  sinusoidalOut: function (k) {
    return Math.sin(k * Math.PI / 2);
  },

  /**
  * @param {number} k
  * @return {number}
  */
  sinusoidalInOut: function (k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  },
  // 指数曲线的缓动（2^t）

  /**
  * @param {number} k
  * @return {number}
  */
  exponentialIn: function (k) {
    return k === 0 ? 0 : Math.pow(1024, k - 1);
  },

  /**
  * @param {number} k
  * @return {number}
  */
  exponentialOut: function (k) {
    return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
  },

  /**
  * @param {number} k
  * @return {number}
  */
  exponentialInOut: function (k) {
    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if ((k *= 2) < 1) {
      return 0.5 * Math.pow(1024, k - 1);
    }

    return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
  },
  // 圆形曲线的缓动（sqrt(1-t^2)）

  /**
  * @param {number} k
  * @return {number}
  */
  circularIn: function (k) {
    return 1 - Math.sqrt(1 - k * k);
  },

  /**
  * @param {number} k
  * @return {number}
  */
  circularOut: function (k) {
    return Math.sqrt(1 - --k * k);
  },

  /**
  * @param {number} k
  * @return {number}
  */
  circularInOut: function (k) {
    if ((k *= 2) < 1) {
      return -0.5 * (Math.sqrt(1 - k * k) - 1);
    }

    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
  },
  // 创建类似于弹簧在停止前来回振荡的动画

  /**
  * @param {number} k
  * @return {number}
  */
  elasticIn: function (k) {
    var s;
    var a = 0.1;
    var p = 0.4;

    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p * Math.asin(1 / a) / (2 * Math.PI);
    }

    return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
  },

  /**
  * @param {number} k
  * @return {number}
  */
  elasticOut: function (k) {
    var s;
    var a = 0.1;
    var p = 0.4;

    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p * Math.asin(1 / a) / (2 * Math.PI);
    }

    return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
  },

  /**
  * @param {number} k
  * @return {number}
  */
  elasticInOut: function (k) {
    var s;
    var a = 0.1;
    var p = 0.4;

    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p * Math.asin(1 / a) / (2 * Math.PI);
    }

    if ((k *= 2) < 1) {
      return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
    }

    return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
  },
  // 在某一动画开始沿指示的路径进行动画处理前稍稍收回该动画的移动

  /**
  * @param {number} k
  * @return {number}
  */
  backIn: function (k) {
    var s = 1.70158;
    return k * k * ((s + 1) * k - s);
  },

  /**
  * @param {number} k
  * @return {number}
  */
  backOut: function (k) {
    var s = 1.70158;
    return --k * k * ((s + 1) * k + s) + 1;
  },

  /**
  * @param {number} k
  * @return {number}
  */
  backInOut: function (k) {
    var s = 1.70158 * 1.525;

    if ((k *= 2) < 1) {
      return 0.5 * (k * k * ((s + 1) * k - s));
    }

    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
  },
  // 创建弹跳效果

  /**
  * @param {number} k
  * @return {number}
  */
  bounceIn: function (k) {
    return 1 - easing.bounceOut(1 - k);
  },

  /**
  * @param {number} k
  * @return {number}
  */
  bounceOut: function (k) {
    if (k < 1 / 2.75) {
      return 7.5625 * k * k;
    } else if (k < 2 / 2.75) {
      return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
    } else if (k < 2.5 / 2.75) {
      return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
    } else {
      return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
    }
  },

  /**
  * @param {number} k
  * @return {number}
  */
  bounceInOut: function (k) {
    if (k < 0.5) {
      return easing.bounceIn(k * 2) * 0.5;
    }

    return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
  }
};
var _default = easing;
module.exports = _default;

/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

var _util = __webpack_require__(259);

var normalizeRadian = _util.normalizeRadian;
var PI2 = Math.PI * 2;
/**
 * 圆弧描边包含判断
 * @param  {number}  cx
 * @param  {number}  cy
 * @param  {number}  r
 * @param  {number}  startAngle
 * @param  {number}  endAngle
 * @param  {boolean}  anticlockwise
 * @param  {number} lineWidth
 * @param  {number}  x
 * @param  {number}  y
 * @return {Boolean}
 */

function containStroke(cx, cy, r, startAngle, endAngle, anticlockwise, lineWidth, x, y) {
  if (lineWidth === 0) {
    return false;
  }

  var _l = lineWidth;
  x -= cx;
  y -= cy;
  var d = Math.sqrt(x * x + y * y);

  if (d - _l > r || d + _l < r) {
    return false;
  }

  if (Math.abs(startAngle - endAngle) % PI2 < 1e-4) {
    // Is a circle
    return true;
  }

  if (anticlockwise) {
    var tmp = startAngle;
    startAngle = normalizeRadian(endAngle);
    endAngle = normalizeRadian(tmp);
  } else {
    startAngle = normalizeRadian(startAngle);
    endAngle = normalizeRadian(endAngle);
  }

  if (startAngle > endAngle) {
    endAngle += PI2;
  }

  var angle = Math.atan2(y, x);

  if (angle < 0) {
    angle += PI2;
  }

  return angle >= startAngle && angle <= endAngle || angle + PI2 >= startAngle && angle + PI2 <= endAngle;
}

exports.containStroke = containStroke;

/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

var curve = __webpack_require__(226);

/**
 * 三次贝塞尔曲线描边包含判断
 * @param  {number}  x0
 * @param  {number}  y0
 * @param  {number}  x1
 * @param  {number}  y1
 * @param  {number}  x2
 * @param  {number}  y2
 * @param  {number}  x3
 * @param  {number}  y3
 * @param  {number}  lineWidth
 * @param  {number}  x
 * @param  {number}  y
 * @return {boolean}
 */
function containStroke(x0, y0, x1, y1, x2, y2, x3, y3, lineWidth, x, y) {
  if (lineWidth === 0) {
    return false;
  }

  var _l = lineWidth; // Quick reject

  if (y > y0 + _l && y > y1 + _l && y > y2 + _l && y > y3 + _l || y < y0 - _l && y < y1 - _l && y < y2 - _l && y < y3 - _l || x > x0 + _l && x > x1 + _l && x > x2 + _l && x > x3 + _l || x < x0 - _l && x < x1 - _l && x < x2 - _l && x < x3 - _l) {
    return false;
  }

  var d = curve.cubicProjectPoint(x0, y0, x1, y1, x2, y2, x3, y3, x, y, null);
  return d <= _l / 2;
}

exports.containStroke = containStroke;

/***/ }),
/* 316 */
/***/ (function(module, exports) {

/**
 * 线段包含判断
 * @param  {number}  x0
 * @param  {number}  y0
 * @param  {number}  x1
 * @param  {number}  y1
 * @param  {number}  lineWidth
 * @param  {number}  x
 * @param  {number}  y
 * @return {boolean}
 */
function containStroke(x0, y0, x1, y1, lineWidth, x, y) {
  if (lineWidth === 0) {
    return false;
  }

  var _l = lineWidth;
  var _a = 0;
  var _b = x0; // Quick reject

  if (y > y0 + _l && y > y1 + _l || y < y0 - _l && y < y1 - _l || x > x0 + _l && x > x1 + _l || x < x0 - _l && x < x1 - _l) {
    return false;
  }

  if (x0 !== x1) {
    _a = (y0 - y1) / (x0 - x1);
    _b = (x0 * y1 - x1 * y0) / (x0 - x1);
  } else {
    return Math.abs(x - x0) <= _l / 2;
  }

  var tmp = _a * x - y + _b;

  var _s = tmp * tmp / (_a * _a + 1);

  return _s <= _l / 2 * _l / 2;
}

exports.containStroke = containStroke;

/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

var PathProxy = __webpack_require__(235);

var line = __webpack_require__(316);

var cubic = __webpack_require__(315);

var quadratic = __webpack_require__(319);

var arc = __webpack_require__(314);

var _util = __webpack_require__(259);

var normalizeRadian = _util.normalizeRadian;

var curve = __webpack_require__(226);

var windingLine = __webpack_require__(260);

var CMD = PathProxy.CMD;
var PI2 = Math.PI * 2;
var EPSILON = 1e-4;

function isAroundEqual(a, b) {
  return Math.abs(a - b) < EPSILON;
} // 临时数组


var roots = [-1, -1, -1];
var extrema = [-1, -1];

function swapExtrema() {
  var tmp = extrema[0];
  extrema[0] = extrema[1];
  extrema[1] = tmp;
}

function windingCubic(x0, y0, x1, y1, x2, y2, x3, y3, x, y) {
  // Quick reject
  if (y > y0 && y > y1 && y > y2 && y > y3 || y < y0 && y < y1 && y < y2 && y < y3) {
    return 0;
  }

  var nRoots = curve.cubicRootAt(y0, y1, y2, y3, y, roots);

  if (nRoots === 0) {
    return 0;
  } else {
    var w = 0;
    var nExtrema = -1;
    var y0_, y1_;

    for (var i = 0; i < nRoots; i++) {
      var t = roots[i]; // Avoid winding error when intersection point is the connect point of two line of polygon

      var unit = t === 0 || t === 1 ? 0.5 : 1;
      var x_ = curve.cubicAt(x0, x1, x2, x3, t);

      if (x_ < x) {
        // Quick reject
        continue;
      }

      if (nExtrema < 0) {
        nExtrema = curve.cubicExtrema(y0, y1, y2, y3, extrema);

        if (extrema[1] < extrema[0] && nExtrema > 1) {
          swapExtrema();
        }

        y0_ = curve.cubicAt(y0, y1, y2, y3, extrema[0]);

        if (nExtrema > 1) {
          y1_ = curve.cubicAt(y0, y1, y2, y3, extrema[1]);
        }
      }

      if (nExtrema == 2) {
        // 分成三段单调函数
        if (t < extrema[0]) {
          w += y0_ < y0 ? unit : -unit;
        } else if (t < extrema[1]) {
          w += y1_ < y0_ ? unit : -unit;
        } else {
          w += y3 < y1_ ? unit : -unit;
        }
      } else {
        // 分成两段单调函数
        if (t < extrema[0]) {
          w += y0_ < y0 ? unit : -unit;
        } else {
          w += y3 < y0_ ? unit : -unit;
        }
      }
    }

    return w;
  }
}

function windingQuadratic(x0, y0, x1, y1, x2, y2, x, y) {
  // Quick reject
  if (y > y0 && y > y1 && y > y2 || y < y0 && y < y1 && y < y2) {
    return 0;
  }

  var nRoots = curve.quadraticRootAt(y0, y1, y2, y, roots);

  if (nRoots === 0) {
    return 0;
  } else {
    var t = curve.quadraticExtremum(y0, y1, y2);

    if (t >= 0 && t <= 1) {
      var w = 0;
      var y_ = curve.quadraticAt(y0, y1, y2, t);

      for (var i = 0; i < nRoots; i++) {
        // Remove one endpoint.
        var unit = roots[i] === 0 || roots[i] === 1 ? 0.5 : 1;
        var x_ = curve.quadraticAt(x0, x1, x2, roots[i]);

        if (x_ < x) {
          // Quick reject
          continue;
        }

        if (roots[i] < t) {
          w += y_ < y0 ? unit : -unit;
        } else {
          w += y2 < y_ ? unit : -unit;
        }
      }

      return w;
    } else {
      // Remove one endpoint.
      var unit = roots[0] === 0 || roots[0] === 1 ? 0.5 : 1;
      var x_ = curve.quadraticAt(x0, x1, x2, roots[0]);

      if (x_ < x) {
        // Quick reject
        return 0;
      }

      return y2 < y0 ? unit : -unit;
    }
  }
} // TODO
// Arc 旋转


function windingArc(cx, cy, r, startAngle, endAngle, anticlockwise, x, y) {
  y -= cy;

  if (y > r || y < -r) {
    return 0;
  }

  var tmp = Math.sqrt(r * r - y * y);
  roots[0] = -tmp;
  roots[1] = tmp;
  var diff = Math.abs(startAngle - endAngle);

  if (diff < 1e-4) {
    return 0;
  }

  if (diff % PI2 < 1e-4) {
    // Is a circle
    startAngle = 0;
    endAngle = PI2;
    var dir = anticlockwise ? 1 : -1;

    if (x >= roots[0] + cx && x <= roots[1] + cx) {
      return dir;
    } else {
      return 0;
    }
  }

  if (anticlockwise) {
    var tmp = startAngle;
    startAngle = normalizeRadian(endAngle);
    endAngle = normalizeRadian(tmp);
  } else {
    startAngle = normalizeRadian(startAngle);
    endAngle = normalizeRadian(endAngle);
  }

  if (startAngle > endAngle) {
    endAngle += PI2;
  }

  var w = 0;

  for (var i = 0; i < 2; i++) {
    var x_ = roots[i];

    if (x_ + cx > x) {
      var angle = Math.atan2(y, x_);
      var dir = anticlockwise ? 1 : -1;

      if (angle < 0) {
        angle = PI2 + angle;
      }

      if (angle >= startAngle && angle <= endAngle || angle + PI2 >= startAngle && angle + PI2 <= endAngle) {
        if (angle > Math.PI / 2 && angle < Math.PI * 1.5) {
          dir = -dir;
        }

        w += dir;
      }
    }
  }

  return w;
}

function containPath(data, lineWidth, isStroke, x, y) {
  var w = 0;
  var xi = 0;
  var yi = 0;
  var x0 = 0;
  var y0 = 0;

  for (var i = 0; i < data.length;) {
    var cmd = data[i++]; // Begin a new subpath

    if (cmd === CMD.M && i > 1) {
      // Close previous subpath
      if (!isStroke) {
        w += windingLine(xi, yi, x0, y0, x, y);
      } // 如果被任何一个 subpath 包含
      // if (w !== 0) {
      //     return true;
      // }

    }

    if (i == 1) {
      // 如果第一个命令是 L, C, Q
      // 则 previous point 同绘制命令的第一个 point
      //
      // 第一个命令为 Arc 的情况下会在后面特殊处理
      xi = data[i];
      yi = data[i + 1];
      x0 = xi;
      y0 = yi;
    }

    switch (cmd) {
      case CMD.M:
        // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
        // 在 closePath 的时候使用
        x0 = data[i++];
        y0 = data[i++];
        xi = x0;
        yi = y0;
        break;

      case CMD.L:
        if (isStroke) {
          if (line.containStroke(xi, yi, data[i], data[i + 1], lineWidth, x, y)) {
            return true;
          }
        } else {
          // NOTE 在第一个命令为 L, C, Q 的时候会计算出 NaN
          w += windingLine(xi, yi, data[i], data[i + 1], x, y) || 0;
        }

        xi = data[i++];
        yi = data[i++];
        break;

      case CMD.C:
        if (isStroke) {
          if (cubic.containStroke(xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1], lineWidth, x, y)) {
            return true;
          }
        } else {
          w += windingCubic(xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1], x, y) || 0;
        }

        xi = data[i++];
        yi = data[i++];
        break;

      case CMD.Q:
        if (isStroke) {
          if (quadratic.containStroke(xi, yi, data[i++], data[i++], data[i], data[i + 1], lineWidth, x, y)) {
            return true;
          }
        } else {
          w += windingQuadratic(xi, yi, data[i++], data[i++], data[i], data[i + 1], x, y) || 0;
        }

        xi = data[i++];
        yi = data[i++];
        break;

      case CMD.A:
        // TODO Arc 判断的开销比较大
        var cx = data[i++];
        var cy = data[i++];
        var rx = data[i++];
        var ry = data[i++];
        var theta = data[i++];
        var dTheta = data[i++]; // TODO Arc 旋转

        var psi = data[i++];
        var anticlockwise = 1 - data[i++];
        var x1 = Math.cos(theta) * rx + cx;
        var y1 = Math.sin(theta) * ry + cy; // 不是直接使用 arc 命令

        if (i > 1) {
          w += windingLine(xi, yi, x1, y1, x, y);
        } else {
          // 第一个命令起点还未定义
          x0 = x1;
          y0 = y1;
        } // zr 使用scale来模拟椭圆, 这里也对x做一定的缩放


        var _x = (x - cx) * ry / rx + cx;

        if (isStroke) {
          if (arc.containStroke(cx, cy, ry, theta, theta + dTheta, anticlockwise, lineWidth, _x, y)) {
            return true;
          }
        } else {
          w += windingArc(cx, cy, ry, theta, theta + dTheta, anticlockwise, _x, y);
        }

        xi = Math.cos(theta + dTheta) * rx + cx;
        yi = Math.sin(theta + dTheta) * ry + cy;
        break;

      case CMD.R:
        x0 = xi = data[i++];
        y0 = yi = data[i++];
        var width = data[i++];
        var height = data[i++];
        var x1 = x0 + width;
        var y1 = y0 + height;

        if (isStroke) {
          if (line.containStroke(x0, y0, x1, y0, lineWidth, x, y) || line.containStroke(x1, y0, x1, y1, lineWidth, x, y) || line.containStroke(x1, y1, x0, y1, lineWidth, x, y) || line.containStroke(x0, y1, x0, y0, lineWidth, x, y)) {
            return true;
          }
        } else {
          // FIXME Clockwise ?
          w += windingLine(x1, y0, x1, y1, x, y);
          w += windingLine(x0, y1, x0, y0, x, y);
        }

        break;

      case CMD.Z:
        if (isStroke) {
          if (line.containStroke(xi, yi, x0, y0, lineWidth, x, y)) {
            return true;
          }
        } else {
          // Close a subpath
          w += windingLine(xi, yi, x0, y0, x, y); // 如果被任何一个 subpath 包含
          // FIXME subpaths may overlap
          // if (w !== 0) {
          //     return true;
          // }
        }

        xi = x0;
        yi = y0;
        break;
    }
  }

  if (!isStroke && !isAroundEqual(yi, y0)) {
    w += windingLine(xi, yi, x0, y0, x, y) || 0;
  }

  return w !== 0;
}

function contain(pathData, x, y) {
  return containPath(pathData, 0, false, x, y);
}

function containStroke(pathData, lineWidth, x, y) {
  return containPath(pathData, lineWidth, true, x, y);
}

exports.contain = contain;
exports.containStroke = containStroke;

/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

var windingLine = __webpack_require__(260);

var EPSILON = 1e-8;

function isAroundEqual(a, b) {
  return Math.abs(a - b) < EPSILON;
}

function contain(points, x, y) {
  var w = 0;
  var p = points[0];

  if (!p) {
    return false;
  }

  for (var i = 1; i < points.length; i++) {
    var p2 = points[i];
    w += windingLine(p[0], p[1], p2[0], p2[1], x, y);
    p = p2;
  } // Close polygon


  var p0 = points[0];

  if (!isAroundEqual(p[0], p0[0]) || !isAroundEqual(p[1], p0[1])) {
    w += windingLine(p[0], p[1], p0[0], p0[1], x, y);
  }

  return w !== 0;
}

exports.contain = contain;

/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

var _curve = __webpack_require__(226);

var quadraticProjectPoint = _curve.quadraticProjectPoint;

/**
 * 二次贝塞尔曲线描边包含判断
 * @param  {number}  x0
 * @param  {number}  y0
 * @param  {number}  x1
 * @param  {number}  y1
 * @param  {number}  x2
 * @param  {number}  y2
 * @param  {number}  lineWidth
 * @param  {number}  x
 * @param  {number}  y
 * @return {boolean}
 */
function containStroke(x0, y0, x1, y1, x2, y2, lineWidth, x, y) {
  if (lineWidth === 0) {
    return false;
  }

  var _l = lineWidth; // Quick reject

  if (y > y0 + _l && y > y1 + _l && y > y2 + _l || y < y0 - _l && y < y1 - _l && y < y2 - _l || x > x0 + _l && x > x1 + _l && x > x2 + _l || x < x0 - _l && x < x1 - _l && x < x2 - _l) {
    return false;
  }

  var d = quadraticProjectPoint(x0, y0, x1, y1, x2, y2, x, y, null);
  return d <= _l / 2;
}

exports.containStroke = containStroke;

/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

var eventUtil = __webpack_require__(230);

/**
 * Only implements needed gestures for mobile.
 */
var GestureMgr = function () {
  /**
   * @private
   * @type {Array.<Object>}
   */
  this._track = [];
};

GestureMgr.prototype = {
  constructor: GestureMgr,
  recognize: function (event, target, root) {
    this._doTrack(event, target, root);

    return this._recognize(event);
  },
  clear: function () {
    this._track.length = 0;
    return this;
  },
  _doTrack: function (event, target, root) {
    var touches = event.touches;

    if (!touches) {
      return;
    }

    var trackItem = {
      points: [],
      touches: [],
      target: target,
      event: event
    };

    for (var i = 0, len = touches.length; i < len; i++) {
      var touch = touches[i];
      var pos = eventUtil.clientToLocal(root, touch, {});
      trackItem.points.push([pos.zrX, pos.zrY]);
      trackItem.touches.push(touch);
    }

    this._track.push(trackItem);
  },
  _recognize: function (event) {
    for (var eventName in recognizers) {
      if (recognizers.hasOwnProperty(eventName)) {
        var gestureInfo = recognizers[eventName](this._track, event);

        if (gestureInfo) {
          return gestureInfo;
        }
      }
    }
  }
};

function dist(pointPair) {
  var dx = pointPair[1][0] - pointPair[0][0];
  var dy = pointPair[1][1] - pointPair[0][1];
  return Math.sqrt(dx * dx + dy * dy);
}

function center(pointPair) {
  return [(pointPair[0][0] + pointPair[1][0]) / 2, (pointPair[0][1] + pointPair[1][1]) / 2];
}

var recognizers = {
  pinch: function (track, event) {
    var trackLen = track.length;

    if (!trackLen) {
      return;
    }

    var pinchEnd = (track[trackLen - 1] || {}).points;
    var pinchPre = (track[trackLen - 2] || {}).points || pinchEnd;

    if (pinchPre && pinchPre.length > 1 && pinchEnd && pinchEnd.length > 1) {
      var pinchScale = dist(pinchEnd) / dist(pinchPre);
      !isFinite(pinchScale) && (pinchScale = 1);
      event.pinchScale = pinchScale;
      var pinchCenter = center(pinchEnd);
      event.pinchX = pinchCenter[0];
      event.pinchY = pinchCenter[1];
      return {
        type: 'pinch',
        target: track[0].target,
        event: event
      };
    }
  } // Only pinch currently.

};
var _default = GestureMgr;
module.exports = _default;

/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

var _event = __webpack_require__(230);

var addEventListener = _event.addEventListener;
var removeEventListener = _event.removeEventListener;
var normalizeEvent = _event.normalizeEvent;

var zrUtil = __webpack_require__(196);

var Eventful = __webpack_require__(227);

var env = __webpack_require__(213);

var GestureMgr = __webpack_require__(320);

var TOUCH_CLICK_DELAY = 300;
var mouseHandlerNames = ['click', 'dblclick', 'mousewheel', 'mouseout', 'mouseup', 'mousedown', 'mousemove', 'contextmenu'];
var touchHandlerNames = ['touchstart', 'touchend', 'touchmove'];
var pointerEventNames = {
  pointerdown: 1,
  pointerup: 1,
  pointermove: 1,
  pointerout: 1
};
var pointerHandlerNames = zrUtil.map(mouseHandlerNames, function (name) {
  var nm = name.replace('mouse', 'pointer');
  return pointerEventNames[nm] ? nm : name;
});

function eventNameFix(name) {
  return name === 'mousewheel' && env.browser.firefox ? 'DOMMouseScroll' : name;
}

function processGesture(proxy, event, stage) {
  var gestureMgr = proxy._gestureMgr;
  stage === 'start' && gestureMgr.clear();
  var gestureInfo = gestureMgr.recognize(event, proxy.handler.findHover(event.zrX, event.zrY, null).target, proxy.dom);
  stage === 'end' && gestureMgr.clear(); // Do not do any preventDefault here. Upper application do that if necessary.

  if (gestureInfo) {
    var type = gestureInfo.type;
    event.gestureEvent = type;
    proxy.handler.dispatchToElement({
      target: gestureInfo.target
    }, type, gestureInfo.event);
  }
} // function onMSGestureChange(proxy, event) {
//     if (event.translationX || event.translationY) {
//         // mousemove is carried by MSGesture to reduce the sensitivity.
//         proxy.handler.dispatchToElement(event.target, 'mousemove', event);
//     }
//     if (event.scale !== 1) {
//         event.pinchX = event.offsetX;
//         event.pinchY = event.offsetY;
//         event.pinchScale = event.scale;
//         proxy.handler.dispatchToElement(event.target, 'pinch', event);
//     }
// }

/**
 * Prevent mouse event from being dispatched after Touch Events action
 * @see <https://github.com/deltakosh/handjs/blob/master/src/hand.base.js>
 * 1. Mobile browsers dispatch mouse events 300ms after touchend.
 * 2. Chrome for Android dispatch mousedown for long-touch about 650ms
 * Result: Blocking Mouse Events for 700ms.
 */


function setTouchTimer(instance) {
  instance._touching = true;
  clearTimeout(instance._touchTimer);
  instance._touchTimer = setTimeout(function () {
    instance._touching = false;
  }, 700);
}

var domHandlers = {
  /**
   * Mouse move handler
   * @inner
   * @param {Event} event
   */
  mousemove: function (event) {
    event = normalizeEvent(this.dom, event);
    this.trigger('mousemove', event);
  },

  /**
   * Mouse out handler
   * @inner
   * @param {Event} event
   */
  mouseout: function (event) {
    event = normalizeEvent(this.dom, event);
    var element = event.toElement || event.relatedTarget;

    if (element != this.dom) {
      while (element && element.nodeType != 9) {
        // 忽略包含在root中的dom引起的mouseOut
        if (element === this.dom) {
          return;
        }

        element = element.parentNode;
      }
    }

    this.trigger('mouseout', event);
  },

  /**
   * Touch开始响应函数
   * @inner
   * @param {Event} event
   */
  touchstart: function (event) {
    // Default mouse behaviour should not be disabled here.
    // For example, page may needs to be slided.
    event = normalizeEvent(this.dom, event); // Mark touch, which is useful in distinguish touch and
    // mouse event in upper applicatoin.

    event.zrByTouch = true;
    this._lastTouchMoment = new Date();
    processGesture(this, event, 'start'); // In touch device, trigger `mousemove`(`mouseover`) should
    // be triggered, and must before `mousedown` triggered.

    domHandlers.mousemove.call(this, event);
    domHandlers.mousedown.call(this, event);
    setTouchTimer(this);
  },

  /**
   * Touch移动响应函数
   * @inner
   * @param {Event} event
   */
  touchmove: function (event) {
    event = normalizeEvent(this.dom, event); // Mark touch, which is useful in distinguish touch and
    // mouse event in upper applicatoin.

    event.zrByTouch = true;
    processGesture(this, event, 'change'); // Mouse move should always be triggered no matter whether
    // there is gestrue event, because mouse move and pinch may
    // be used at the same time.

    domHandlers.mousemove.call(this, event);
    setTouchTimer(this);
  },

  /**
   * Touch结束响应函数
   * @inner
   * @param {Event} event
   */
  touchend: function (event) {
    event = normalizeEvent(this.dom, event); // Mark touch, which is useful in distinguish touch and
    // mouse event in upper applicatoin.

    event.zrByTouch = true;
    processGesture(this, event, 'end');
    domHandlers.mouseup.call(this, event); // Do not trigger `mouseout` here, in spite of `mousemove`(`mouseover`) is
    // triggered in `touchstart`. This seems to be illogical, but by this mechanism,
    // we can conveniently implement "hover style" in both PC and touch device just
    // by listening to `mouseover` to add "hover style" and listening to `mouseout`
    // to remove "hover style" on an element, without any additional code for
    // compatibility. (`mouseout` will not be triggered in `touchend`, so "hover
    // style" will remain for user view)
    // click event should always be triggered no matter whether
    // there is gestrue event. System click can not be prevented.

    if (+new Date() - this._lastTouchMoment < TOUCH_CLICK_DELAY) {
      domHandlers.click.call(this, event);
    }

    setTouchTimer(this);
  },
  pointerdown: function (event) {
    domHandlers.mousedown.call(this, event); // if (useMSGuesture(this, event)) {
    //     this._msGesture.addPointer(event.pointerId);
    // }
  },
  pointermove: function (event) {
    // FIXME
    // pointermove is so sensitive that it always triggered when
    // tap(click) on touch screen, which affect some judgement in
    // upper application. So, we dont support mousemove on MS touch
    // device yet.
    if (!isPointerFromTouch(event)) {
      domHandlers.mousemove.call(this, event);
    }
  },
  pointerup: function (event) {
    domHandlers.mouseup.call(this, event);
  },
  pointerout: function (event) {
    // pointerout will be triggered when tap on touch screen
    // (IE11+/Edge on MS Surface) after click event triggered,
    // which is inconsistent with the mousout behavior we defined
    // in touchend. So we unify them.
    // (check domHandlers.touchend for detailed explanation)
    if (!isPointerFromTouch(event)) {
      domHandlers.mouseout.call(this, event);
    }
  }
};

function isPointerFromTouch(event) {
  var pointerType = event.pointerType;
  return pointerType === 'pen' || pointerType === 'touch';
} // function useMSGuesture(handlerProxy, event) {
//     return isPointerFromTouch(event) && !!handlerProxy._msGesture;
// }
// Common handlers


zrUtil.each(['click', 'mousedown', 'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
  domHandlers[name] = function (event) {
    event = normalizeEvent(this.dom, event);
    this.trigger(name, event);
  };
});
/**
 * 为控制类实例初始化dom 事件处理函数
 *
 * @inner
 * @param {module:zrender/Handler} instance 控制类实例
 */

function initDomHandler(instance) {
  zrUtil.each(touchHandlerNames, function (name) {
    instance._handlers[name] = zrUtil.bind(domHandlers[name], instance);
  });
  zrUtil.each(pointerHandlerNames, function (name) {
    instance._handlers[name] = zrUtil.bind(domHandlers[name], instance);
  });
  zrUtil.each(mouseHandlerNames, function (name) {
    instance._handlers[name] = makeMouseHandler(domHandlers[name], instance);
  });

  function makeMouseHandler(fn, instance) {
    return function () {
      if (instance._touching) {
        return;
      }

      return fn.apply(instance, arguments);
    };
  }
}

function HandlerDomProxy(dom) {
  Eventful.call(this);
  this.dom = dom;
  /**
   * @private
   * @type {boolean}
   */

  this._touching = false;
  /**
   * @private
   * @type {number}
   */

  this._touchTimer;
  /**
   * @private
   * @type {module:zrender/core/GestureMgr}
   */

  this._gestureMgr = new GestureMgr();
  this._handlers = {};
  initDomHandler(this);

  if (env.pointerEventsSupported) {
    // Only IE11+/Edge
    // 1. On devices that both enable touch and mouse (e.g., MS Surface and lenovo X240),
    // IE11+/Edge do not trigger touch event, but trigger pointer event and mouse event
    // at the same time.
    // 2. On MS Surface, it probablely only trigger mousedown but no mouseup when tap on
    // screen, which do not occurs in pointer event.
    // So we use pointer event to both detect touch gesture and mouse behavior.
    mountHandlers(pointerHandlerNames, this); // FIXME
    // Note: MS Gesture require CSS touch-action set. But touch-action is not reliable,
    // which does not prevent defuault behavior occasionally (which may cause view port
    // zoomed in but use can not zoom it back). And event.preventDefault() does not work.
    // So we have to not to use MSGesture and not to support touchmove and pinch on MS
    // touch screen. And we only support click behavior on MS touch screen now.
    // MS Gesture Event is only supported on IE11+/Edge and on Windows 8+.
    // We dont support touch on IE on win7.
    // See <https://msdn.microsoft.com/en-us/library/dn433243(v=vs.85).aspx>
    // if (typeof MSGesture === 'function') {
    //     (this._msGesture = new MSGesture()).target = dom; // jshint ignore:line
    //     dom.addEventListener('MSGestureChange', onMSGestureChange);
    // }
  } else {
    if (env.touchEventsSupported) {
      mountHandlers(touchHandlerNames, this); // Handler of 'mouseout' event is needed in touch mode, which will be mounted below.
      // addEventListener(root, 'mouseout', this._mouseoutHandler);
    } // 1. Considering some devices that both enable touch and mouse event (like on MS Surface
    // and lenovo X240, @see #2350), we make mouse event be always listened, otherwise
    // mouse event can not be handle in those devices.
    // 2. On MS Surface, Chrome will trigger both touch event and mouse event. How to prevent
    // mouseevent after touch event triggered, see `setTouchTimer`.


    mountHandlers(mouseHandlerNames, this);
  }

  function mountHandlers(handlerNames, instance) {
    zrUtil.each(handlerNames, function (name) {
      addEventListener(dom, eventNameFix(name), instance._handlers[name]);
    }, instance);
  }
}

var handlerDomProxyProto = HandlerDomProxy.prototype;

handlerDomProxyProto.dispose = function () {
  var handlerNames = mouseHandlerNames.concat(touchHandlerNames);

  for (var i = 0; i < handlerNames.length; i++) {
    var name = handlerNames[i];
    removeEventListener(this.dom, eventNameFix(name), this._handlers[name]);
  }
};

handlerDomProxyProto.setCursor = function (cursorStyle) {
  this.dom.style.cursor = cursorStyle || 'default';
};

zrUtil.mixin(HandlerDomProxy, Eventful);
var _default = HandlerDomProxy;
module.exports = _default;

/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

var Path = __webpack_require__(212);

// CompoundPath to improve performance
var _default = Path.extend({
  type: 'compound',
  shape: {
    paths: null
  },
  _updatePathDirty: function () {
    var dirtyPath = this.__dirtyPath;
    var paths = this.shape.paths;

    for (var i = 0; i < paths.length; i++) {
      // Mark as dirty if any subpath is dirty
      dirtyPath = dirtyPath || paths[i].__dirtyPath;
    }

    this.__dirtyPath = dirtyPath;
    this.__dirty = this.__dirty || dirtyPath;
  },
  beforeBrush: function () {
    this._updatePathDirty();

    var paths = this.shape.paths || [];
    var scale = this.getGlobalScale(); // Update path scale

    for (var i = 0; i < paths.length; i++) {
      if (!paths[i].path) {
        paths[i].createPathProxy();
      }

      paths[i].path.setScale(scale[0], scale[1]);
    }
  },
  buildPath: function (ctx, shape) {
    var paths = shape.paths || [];

    for (var i = 0; i < paths.length; i++) {
      paths[i].buildPath(ctx, paths[i].shape, true);
    }
  },
  afterBrush: function () {
    var paths = this.shape.paths || [];

    for (var i = 0; i < paths.length; i++) {
      paths[i].__dirtyPath = false;
    }
  },
  getBoundingRect: function () {
    this._updatePathDirty();

    return Path.prototype.getBoundingRect.call(this);
  }
});

module.exports = _default;

/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var Gradient = __webpack_require__(244);

/**
 * x, y, x2, y2 are all percent from 0 to 1
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [x2=1]
 * @param {number} [y2=0]
 * @param {Array.<Object>} colorStops
 * @param {boolean} [globalCoord=false]
 */
var LinearGradient = function (x, y, x2, y2, colorStops, globalCoord) {
  // Should do nothing more in this constructor. Because gradient can be
  // declard by `color: {type: 'linear', colorStops: ...}`, where
  // this constructor will not be called.
  this.x = x == null ? 0 : x;
  this.y = y == null ? 0 : y;
  this.x2 = x2 == null ? 1 : x2;
  this.y2 = y2 == null ? 0 : y2; // Can be cloned

  this.type = 'linear'; // If use global coord

  this.global = globalCoord || false;
  Gradient.call(this, colorStops);
};

LinearGradient.prototype = {
  constructor: LinearGradient
};
zrUtil.inherits(LinearGradient, Gradient);
var _default = LinearGradient;
module.exports = _default;

/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var Gradient = __webpack_require__(244);

/**
 * x, y, r are all percent from 0 to 1
 * @param {number} [x=0.5]
 * @param {number} [y=0.5]
 * @param {number} [r=0.5]
 * @param {Array.<Object>} [colorStops]
 * @param {boolean} [globalCoord=false]
 */
var RadialGradient = function (x, y, r, colorStops, globalCoord) {
  // Should do nothing more in this constructor. Because gradient can be
  // declard by `color: {type: 'radial', colorStops: ...}`, where
  // this constructor will not be called.
  this.x = x == null ? 0.5 : x;
  this.y = y == null ? 0.5 : y;
  this.r = r == null ? 0.5 : r; // Can be cloned

  this.type = 'radial'; // If use global coord

  this.global = globalCoord || false;
  Gradient.call(this, colorStops);
};

RadialGradient.prototype = {
  constructor: RadialGradient
};
zrUtil.inherits(RadialGradient, Gradient);
var _default = RadialGradient;
module.exports = _default;

/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

var Displayable = __webpack_require__(243);

var zrUtil = __webpack_require__(196);

var textContain = __webpack_require__(225);

var textHelper = __webpack_require__(270);

/**
 * @alias zrender/graphic/Text
 * @extends module:zrender/graphic/Displayable
 * @constructor
 * @param {Object} opts
 */
var Text = function (opts) {
  // jshint ignore:line
  Displayable.call(this, opts);
};

Text.prototype = {
  constructor: Text,
  type: 'text',
  brush: function (ctx, prevEl) {
    var style = this.style; // Optimize, avoid normalize every time.

    this.__dirty && textHelper.normalizeTextStyle(style, true); // Use props with prefix 'text'.

    style.fill = style.stroke = style.shadowBlur = style.shadowColor = style.shadowOffsetX = style.shadowOffsetY = null;
    var text = style.text; // Convert to string

    text != null && (text += ''); // Always bind style

    style.bind(ctx, this, prevEl);

    if (!textHelper.needDrawText(text, style)) {
      return;
    }

    this.setTransform(ctx);
    textHelper.renderText(this, ctx, text, style);
    this.restoreTransform(ctx);
  },
  getBoundingRect: function () {
    var style = this.style; // Optimize, avoid normalize every time.

    this.__dirty && textHelper.normalizeTextStyle(style, true);

    if (!this._rect) {
      var text = style.text;
      text != null ? text += '' : text = '';
      var rect = textContain.getBoundingRect(style.text + '', style.font, style.textAlign, style.textVerticalAlign, style.textPadding, style.rich);
      rect.x += style.x || 0;
      rect.y += style.y || 0;

      if (textHelper.getStroke(style.textStroke, style.textStrokeWidth)) {
        var w = style.textStrokeWidth;
        rect.x -= w / 2;
        rect.y -= w / 2;
        rect.width += w;
        rect.height += w;
      }

      this._rect = rect;
    }

    return this._rect;
  }
};
zrUtil.inherits(Text, Displayable);
var _default = Text;
module.exports = _default;

/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

var _vector = __webpack_require__(203);

var v2Min = _vector.min;
var v2Max = _vector.max;
var v2Scale = _vector.scale;
var v2Distance = _vector.distance;
var v2Add = _vector.add;
var v2Clone = _vector.clone;
var v2Sub = _vector.sub;

/**
 * 贝塞尔平滑曲线
 * @module zrender/shape/util/smoothBezier
 * @author pissang (https://www.github.com/pissang)
 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         errorrik (errorrik@gmail.com)
 */

/**
 * 贝塞尔平滑曲线
 * @alias module:zrender/shape/util/smoothBezier
 * @param {Array} points 线段顶点数组
 * @param {number} smooth 平滑等级, 0-1
 * @param {boolean} isLoop
 * @param {Array} constraint 将计算出来的控制点约束在一个包围盒内
 *                           比如 [[0, 0], [100, 100]], 这个包围盒会与
 *                           整个折线的包围盒做一个并集用来约束控制点。
 * @param {Array} 计算出来的控制点数组
 */
function _default(points, smooth, isLoop, constraint) {
  var cps = [];
  var v = [];
  var v1 = [];
  var v2 = [];
  var prevPoint;
  var nextPoint;
  var min, max;

  if (constraint) {
    min = [Infinity, Infinity];
    max = [-Infinity, -Infinity];

    for (var i = 0, len = points.length; i < len; i++) {
      v2Min(min, min, points[i]);
      v2Max(max, max, points[i]);
    } // 与指定的包围盒做并集


    v2Min(min, min, constraint[0]);
    v2Max(max, max, constraint[1]);
  }

  for (var i = 0, len = points.length; i < len; i++) {
    var point = points[i];

    if (isLoop) {
      prevPoint = points[i ? i - 1 : len - 1];
      nextPoint = points[(i + 1) % len];
    } else {
      if (i === 0 || i === len - 1) {
        cps.push(v2Clone(points[i]));
        continue;
      } else {
        prevPoint = points[i - 1];
        nextPoint = points[i + 1];
      }
    }

    v2Sub(v, nextPoint, prevPoint); // use degree to scale the handle length

    v2Scale(v, v, smooth);
    var d0 = v2Distance(point, prevPoint);
    var d1 = v2Distance(point, nextPoint);
    var sum = d0 + d1;

    if (sum !== 0) {
      d0 /= sum;
      d1 /= sum;
    }

    v2Scale(v1, v, -d0);
    v2Scale(v2, v, d1);
    var cp0 = v2Add([], point, v1);
    var cp1 = v2Add([], point, v2);

    if (constraint) {
      v2Max(cp0, cp0, min);
      v2Min(cp0, cp0, max);
      v2Max(cp1, cp1, min);
      v2Min(cp1, cp1, max);
    }

    cps.push(cp0);
    cps.push(cp1);
  }

  if (isLoop) {
    cps.push(cps.shift());
  }

  return cps;
}

module.exports = _default;

/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

var _vector = __webpack_require__(203);

var v2Distance = _vector.distance;

/**
 * Catmull-Rom spline 插值折线
 * @module zrender/shape/util/smoothSpline
 * @author pissang (https://www.github.com/pissang)
 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         errorrik (errorrik@gmail.com)
 */

/**
 * @inner
 */
function interpolate(p0, p1, p2, p3, t, t2, t3) {
  var v0 = (p2 - p0) * 0.5;
  var v1 = (p3 - p1) * 0.5;
  return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
}
/**
 * @alias module:zrender/shape/util/smoothSpline
 * @param {Array} points 线段顶点数组
 * @param {boolean} isLoop
 * @return {Array}
 */


function _default(points, isLoop) {
  var len = points.length;
  var ret = [];
  var distance = 0;

  for (var i = 1; i < len; i++) {
    distance += v2Distance(points[i - 1], points[i]);
  }

  var segs = distance / 2;
  segs = segs < len ? len : segs;

  for (var i = 0; i < segs; i++) {
    var pos = i / (segs - 1) * (isLoop ? len : len - 1);
    var idx = Math.floor(pos);
    var w = pos - idx;
    var p0;
    var p1 = points[idx % len];
    var p2;
    var p3;

    if (!isLoop) {
      p0 = points[idx === 0 ? idx : idx - 1];
      p2 = points[idx > len - 2 ? len - 1 : idx + 1];
      p3 = points[idx > len - 3 ? len - 1 : idx + 2];
    } else {
      p0 = points[(idx - 1 + len) % len];
      p2 = points[(idx + 1) % len];
      p3 = points[(idx + 2) % len];
    }

    var w2 = w * w;
    var w3 = w * w2;
    ret.push([interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3), interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)]);
  }

  return ret;
}

module.exports = _default;

/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

var textHelper = __webpack_require__(270);

var BoundingRect = __webpack_require__(214);

/**
 * Mixin for drawing text in a element bounding rect
 * @module zrender/mixin/RectText
 */
var tmpRect = new BoundingRect();

var RectText = function () {};

RectText.prototype = {
  constructor: RectText,

  /**
   * Draw text in a rect with specified position.
   * @param  {CanvasRenderingContext2D} ctx
   * @param  {Object} rect Displayable rect
   */
  drawRectText: function (ctx, rect) {
    var style = this.style;
    rect = style.textRect || rect; // Optimize, avoid normalize every time.

    this.__dirty && textHelper.normalizeTextStyle(style, true);
    var text = style.text; // Convert to string

    text != null && (text += '');

    if (!textHelper.needDrawText(text, style)) {
      return;
    } // FIXME


    ctx.save(); // Transform rect to view space

    var transform = this.transform;

    if (!style.transformText) {
      if (transform) {
        tmpRect.copy(rect);
        tmpRect.applyTransform(transform);
        rect = tmpRect;
      }
    } else {
      this.setTransform(ctx);
    } // transformText and textRotation can not be used at the same time.


    textHelper.renderText(this, ctx, text, style, rect);
    ctx.restore();
  }
};
var _default = RectText;
module.exports = _default;

/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

var Path = __webpack_require__(212);

/**
 * 圆弧
 * @module zrender/graphic/shape/Arc
 */
var _default = Path.extend({
  type: 'arc',
  shape: {
    cx: 0,
    cy: 0,
    r: 0,
    startAngle: 0,
    endAngle: Math.PI * 2,
    clockwise: true
  },
  style: {
    stroke: '#000',
    fill: null
  },
  buildPath: function (ctx, shape) {
    var x = shape.cx;
    var y = shape.cy;
    var r = Math.max(shape.r, 0);
    var startAngle = shape.startAngle;
    var endAngle = shape.endAngle;
    var clockwise = shape.clockwise;
    var unitX = Math.cos(startAngle);
    var unitY = Math.sin(startAngle);
    ctx.moveTo(unitX * r + x, unitY * r + y);
    ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
  }
});

module.exports = _default;

/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

var Path = __webpack_require__(212);

var vec2 = __webpack_require__(203);

var _curve = __webpack_require__(226);

var quadraticSubdivide = _curve.quadraticSubdivide;
var cubicSubdivide = _curve.cubicSubdivide;
var quadraticAt = _curve.quadraticAt;
var cubicAt = _curve.cubicAt;
var quadraticDerivativeAt = _curve.quadraticDerivativeAt;
var cubicDerivativeAt = _curve.cubicDerivativeAt;

/**
 * 贝塞尔曲线
 * @module zrender/shape/BezierCurve
 */
var out = [];

function someVectorAt(shape, t, isTangent) {
  var cpx2 = shape.cpx2;
  var cpy2 = shape.cpy2;

  if (cpx2 === null || cpy2 === null) {
    return [(isTangent ? cubicDerivativeAt : cubicAt)(shape.x1, shape.cpx1, shape.cpx2, shape.x2, t), (isTangent ? cubicDerivativeAt : cubicAt)(shape.y1, shape.cpy1, shape.cpy2, shape.y2, t)];
  } else {
    return [(isTangent ? quadraticDerivativeAt : quadraticAt)(shape.x1, shape.cpx1, shape.x2, t), (isTangent ? quadraticDerivativeAt : quadraticAt)(shape.y1, shape.cpy1, shape.y2, t)];
  }
}

var _default = Path.extend({
  type: 'bezier-curve',
  shape: {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    cpx1: 0,
    cpy1: 0,
    // cpx2: 0,
    // cpy2: 0
    // Curve show percent, for animating
    percent: 1
  },
  style: {
    stroke: '#000',
    fill: null
  },
  buildPath: function (ctx, shape) {
    var x1 = shape.x1;
    var y1 = shape.y1;
    var x2 = shape.x2;
    var y2 = shape.y2;
    var cpx1 = shape.cpx1;
    var cpy1 = shape.cpy1;
    var cpx2 = shape.cpx2;
    var cpy2 = shape.cpy2;
    var percent = shape.percent;

    if (percent === 0) {
      return;
    }

    ctx.moveTo(x1, y1);

    if (cpx2 == null || cpy2 == null) {
      if (percent < 1) {
        quadraticSubdivide(x1, cpx1, x2, percent, out);
        cpx1 = out[1];
        x2 = out[2];
        quadraticSubdivide(y1, cpy1, y2, percent, out);
        cpy1 = out[1];
        y2 = out[2];
      }

      ctx.quadraticCurveTo(cpx1, cpy1, x2, y2);
    } else {
      if (percent < 1) {
        cubicSubdivide(x1, cpx1, cpx2, x2, percent, out);
        cpx1 = out[1];
        cpx2 = out[2];
        x2 = out[3];
        cubicSubdivide(y1, cpy1, cpy2, y2, percent, out);
        cpy1 = out[1];
        cpy2 = out[2];
        y2 = out[3];
      }

      ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
    }
  },

  /**
   * Get point at percent
   * @param  {number} t
   * @return {Array.<number>}
   */
  pointAt: function (t) {
    return someVectorAt(this.shape, t, false);
  },

  /**
   * Get tangent at percent
   * @param  {number} t
   * @return {Array.<number>}
   */
  tangentAt: function (t) {
    var p = someVectorAt(this.shape, t, true);
    return vec2.normalize(p, p);
  }
});

module.exports = _default;

/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

var Path = __webpack_require__(212);

/**
 * 圆形
 * @module zrender/shape/Circle
 */
var _default = Path.extend({
  type: 'circle',
  shape: {
    cx: 0,
    cy: 0,
    r: 0
  },
  buildPath: function (ctx, shape, inBundle) {
    // Better stroking in ShapeBundle
    // Always do it may have performence issue ( fill may be 2x more cost)
    if (inBundle) {
      ctx.moveTo(shape.cx + shape.r, shape.cy);
    } // else {
    //     if (ctx.allocate && !ctx.data.length) {
    //         ctx.allocate(ctx.CMD_MEM_SIZE.A);
    //     }
    // }
    // Better stroking in ShapeBundle
    // ctx.moveTo(shape.cx + shape.r, shape.cy);


    ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
  }
});

module.exports = _default;

/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

var Path = __webpack_require__(212);

/**
 * 直线
 * @module zrender/graphic/shape/Line
 */
var _default = Path.extend({
  type: 'line',
  shape: {
    // Start point
    x1: 0,
    y1: 0,
    // End point
    x2: 0,
    y2: 0,
    percent: 1
  },
  style: {
    stroke: '#000',
    fill: null
  },
  buildPath: function (ctx, shape) {
    var x1 = shape.x1;
    var y1 = shape.y1;
    var x2 = shape.x2;
    var y2 = shape.y2;
    var percent = shape.percent;

    if (percent === 0) {
      return;
    }

    ctx.moveTo(x1, y1);

    if (percent < 1) {
      x2 = x1 * (1 - percent) + x2 * percent;
      y2 = y1 * (1 - percent) + y2 * percent;
    }

    ctx.lineTo(x2, y2);
  },

  /**
   * Get point at percent
   * @param  {number} percent
   * @return {Array.<number>}
   */
  pointAt: function (p) {
    var shape = this.shape;
    return [shape.x1 * (1 - p) + shape.x2 * p, shape.y1 * (1 - p) + shape.y2 * p];
  }
});

module.exports = _default;

/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

var Path = __webpack_require__(212);

var polyHelper = __webpack_require__(268);

/**
 * 多边形
 * @module zrender/shape/Polygon
 */
var _default = Path.extend({
  type: 'polygon',
  shape: {
    points: null,
    smooth: false,
    smoothConstraint: null
  },
  buildPath: function (ctx, shape) {
    polyHelper.buildPath(ctx, shape, true);
  }
});

module.exports = _default;

/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

var Path = __webpack_require__(212);

var polyHelper = __webpack_require__(268);

/**
 * @module zrender/graphic/shape/Polyline
 */
var _default = Path.extend({
  type: 'polyline',
  shape: {
    points: null,
    smooth: false,
    smoothConstraint: null
  },
  style: {
    stroke: '#000',
    fill: null
  },
  buildPath: function (ctx, shape) {
    polyHelper.buildPath(ctx, shape, false);
  }
});

module.exports = _default;

/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

var Path = __webpack_require__(212);

var roundRectHelper = __webpack_require__(269);

/**
 * 矩形
 * @module zrender/graphic/shape/Rect
 */
var _default = Path.extend({
  type: 'rect',
  shape: {
    // 左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
    // r缩写为1         相当于 [1, 1, 1, 1]
    // r缩写为[1]       相当于 [1, 1, 1, 1]
    // r缩写为[1, 2]    相当于 [1, 2, 1, 2]
    // r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
    r: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function (ctx, shape) {
    var x = shape.x;
    var y = shape.y;
    var width = shape.width;
    var height = shape.height;

    if (!shape.r) {
      ctx.rect(x, y, width, height);
    } else {
      roundRectHelper.buildPath(ctx, shape);
    }

    ctx.closePath();
    return;
  }
});

module.exports = _default;

/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

var Path = __webpack_require__(212);

/**
 * 圆环
 * @module zrender/graphic/shape/Ring
 */
var _default = Path.extend({
  type: 'ring',
  shape: {
    cx: 0,
    cy: 0,
    r: 0,
    r0: 0
  },
  buildPath: function (ctx, shape) {
    var x = shape.cx;
    var y = shape.cy;
    var PI2 = Math.PI * 2;
    ctx.moveTo(x + shape.r, y);
    ctx.arc(x, y, shape.r, 0, PI2, false);
    ctx.moveTo(x + shape.r0, y);
    ctx.arc(x, y, shape.r0, 0, PI2, true);
  }
});

module.exports = _default;

/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

var Path = __webpack_require__(212);

var fixClipWithShadow = __webpack_require__(278);

/**
 * 扇形
 * @module zrender/graphic/shape/Sector
 */
var _default = Path.extend({
  type: 'sector',
  shape: {
    cx: 0,
    cy: 0,
    r0: 0,
    r: 0,
    startAngle: 0,
    endAngle: Math.PI * 2,
    clockwise: true
  },
  brush: fixClipWithShadow(Path.prototype.brush),
  buildPath: function (ctx, shape) {
    var x = shape.cx;
    var y = shape.cy;
    var r0 = Math.max(shape.r0 || 0, 0);
    var r = Math.max(shape.r, 0);
    var startAngle = shape.startAngle;
    var endAngle = shape.endAngle;
    var clockwise = shape.clockwise;
    var unitX = Math.cos(startAngle);
    var unitY = Math.sin(startAngle);
    ctx.moveTo(unitX * r0 + x, unitY * r0 + y);
    ctx.lineTo(unitX * r + x, unitY * r + y);
    ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
    ctx.lineTo(Math.cos(endAngle) * r0 + x, Math.sin(endAngle) * r0 + y);

    if (r0 !== 0) {
      ctx.arc(x, y, r0, endAngle, startAngle, clockwise);
    }

    ctx.closePath();
  }
});

module.exports = _default;

/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

var Animator = __webpack_require__(257);

var log = __webpack_require__(264);

var _util = __webpack_require__(196);

var isString = _util.isString;
var isFunction = _util.isFunction;
var isObject = _util.isObject;
var isArrayLike = _util.isArrayLike;
var indexOf = _util.indexOf;

/**
 * @alias modue:zrender/mixin/Animatable
 * @constructor
 */
var Animatable = function () {
  /**
   * @type {Array.<module:zrender/animation/Animator>}
   * @readOnly
   */
  this.animators = [];
};

Animatable.prototype = {
  constructor: Animatable,

  /**
   * 动画
   *
   * @param {string} path The path to fetch value from object, like 'a.b.c'.
   * @param {boolean} [loop] Whether to loop animation.
   * @return {module:zrender/animation/Animator}
   * @example:
   *     el.animate('style', false)
   *         .when(1000, {x: 10} )
   *         .done(function(){ // Animation done })
   *         .start()
   */
  animate: function (path, loop) {
    var target;
    var animatingShape = false;
    var el = this;
    var zr = this.__zr;

    if (path) {
      var pathSplitted = path.split('.');
      var prop = el; // If animating shape

      animatingShape = pathSplitted[0] === 'shape';

      for (var i = 0, l = pathSplitted.length; i < l; i++) {
        if (!prop) {
          continue;
        }

        prop = prop[pathSplitted[i]];
      }

      if (prop) {
        target = prop;
      }
    } else {
      target = el;
    }

    if (!target) {
      log('Property "' + path + '" is not existed in element ' + el.id);
      return;
    }

    var animators = el.animators;
    var animator = new Animator(target, loop);
    animator.during(function (target) {
      el.dirty(animatingShape);
    }).done(function () {
      // FIXME Animator will not be removed if use `Animator#stop` to stop animation
      animators.splice(indexOf(animators, animator), 1);
    });
    animators.push(animator); // If animate after added to the zrender

    if (zr) {
      zr.animation.addAnimator(animator);
    }

    return animator;
  },

  /**
   * 停止动画
   * @param {boolean} forwardToLast If move to last frame before stop
   */
  stopAnimation: function (forwardToLast) {
    var animators = this.animators;
    var len = animators.length;

    for (var i = 0; i < len; i++) {
      animators[i].stop(forwardToLast);
    }

    animators.length = 0;
    return this;
  },

  /**
   * Caution: this method will stop previous animation.
   * So do not use this method to one element twice before
   * animation starts, unless you know what you are doing.
   * @param {Object} target
   * @param {number} [time=500] Time in ms
   * @param {string} [easing='linear']
   * @param {number} [delay=0]
   * @param {Function} [callback]
   * @param {Function} [forceAnimate] Prevent stop animation and callback
   *        immediently when target values are the same as current values.
   *
   * @example
   *  // Animate position
   *  el.animateTo({
   *      position: [10, 10]
   *  }, function () { // done })
   *
   *  // Animate shape, style and position in 100ms, delayed 100ms, with cubicOut easing
   *  el.animateTo({
   *      shape: {
   *          width: 500
   *      },
   *      style: {
   *          fill: 'red'
   *      }
   *      position: [10, 10]
   *  }, 100, 100, 'cubicOut', function () { // done })
   */
  // TODO Return animation key
  animateTo: function (target, time, delay, easing, callback, forceAnimate) {
    // animateTo(target, time, easing, callback);
    if (isString(delay)) {
      callback = easing;
      easing = delay;
      delay = 0;
    } // animateTo(target, time, delay, callback);
    else if (isFunction(easing)) {
        callback = easing;
        easing = 'linear';
        delay = 0;
      } // animateTo(target, time, callback);
      else if (isFunction(delay)) {
          callback = delay;
          delay = 0;
        } // animateTo(target, callback)
        else if (isFunction(time)) {
            callback = time;
            time = 500;
          } // animateTo(target)
          else if (!time) {
              time = 500;
            } // Stop all previous animations


    this.stopAnimation();

    this._animateToShallow('', this, target, time, delay); // Animators may be removed immediately after start
    // if there is nothing to animate


    var animators = this.animators.slice();
    var count = animators.length;

    function done() {
      count--;

      if (!count) {
        callback && callback();
      }
    } // No animators. This should be checked before animators[i].start(),
    // because 'done' may be executed immediately if no need to animate.


    if (!count) {
      callback && callback();
    } // Start after all animators created
    // Incase any animator is done immediately when all animation properties are not changed


    for (var i = 0; i < animators.length; i++) {
      animators[i].done(done).start(easing, forceAnimate);
    }
  },

  /**
   * @private
   * @param {string} path=''
   * @param {Object} source=this
   * @param {Object} target
   * @param {number} [time=500]
   * @param {number} [delay=0]
   *
   * @example
   *  // Animate position
   *  el._animateToShallow({
   *      position: [10, 10]
   *  })
   *
   *  // Animate shape, style and position in 100ms, delayed 100ms
   *  el._animateToShallow({
   *      shape: {
   *          width: 500
   *      },
   *      style: {
   *          fill: 'red'
   *      }
   *      position: [10, 10]
   *  }, 100, 100)
   */
  _animateToShallow: function (path, source, target, time, delay) {
    var objShallow = {};
    var propertyCount = 0;

    for (var name in target) {
      if (!target.hasOwnProperty(name)) {
        continue;
      }

      if (source[name] != null) {
        if (isObject(target[name]) && !isArrayLike(target[name])) {
          this._animateToShallow(path ? path + '.' + name : name, source[name], target[name], time, delay);
        } else {
          objShallow[name] = target[name];
          propertyCount++;
        }
      } else if (target[name] != null) {
        // Attr directly if not has property
        // FIXME, if some property not needed for element ?
        if (!path) {
          this.attr(name, target[name]);
        } else {
          // Shape or style
          var props = {};
          props[path] = {};
          props[path][name] = target[name];
          this.attr(props);
        }
      }
    }

    if (propertyCount > 0) {
      this.animate(path, false).when(time == null ? 500 : time, objShallow).delay(delay || 0);
    }

    return this;
  }
};
var _default = Animatable;
module.exports = _default;

/***/ }),
/* 339 */
/***/ (function(module, exports) {

// TODO Draggable for group
// FIXME Draggable on element which has parent rotation or scale
function Draggable() {
  this.on('mousedown', this._dragStart, this);
  this.on('mousemove', this._drag, this);
  this.on('mouseup', this._dragEnd, this);
  this.on('globalout', this._dragEnd, this); // this._dropTarget = null;
  // this._draggingTarget = null;
  // this._x = 0;
  // this._y = 0;
}

Draggable.prototype = {
  constructor: Draggable,
  _dragStart: function (e) {
    var draggingTarget = e.target;

    if (draggingTarget && draggingTarget.draggable) {
      this._draggingTarget = draggingTarget;
      draggingTarget.dragging = true;
      this._x = e.offsetX;
      this._y = e.offsetY;
      this.dispatchToElement(param(draggingTarget, e), 'dragstart', e.event);
    }
  },
  _drag: function (e) {
    var draggingTarget = this._draggingTarget;

    if (draggingTarget) {
      var x = e.offsetX;
      var y = e.offsetY;
      var dx = x - this._x;
      var dy = y - this._y;
      this._x = x;
      this._y = y;
      draggingTarget.drift(dx, dy, e);
      this.dispatchToElement(param(draggingTarget, e), 'drag', e.event);
      var dropTarget = this.findHover(x, y, draggingTarget).target;
      var lastDropTarget = this._dropTarget;
      this._dropTarget = dropTarget;

      if (draggingTarget !== dropTarget) {
        if (lastDropTarget && dropTarget !== lastDropTarget) {
          this.dispatchToElement(param(lastDropTarget, e), 'dragleave', e.event);
        }

        if (dropTarget && dropTarget !== lastDropTarget) {
          this.dispatchToElement(param(dropTarget, e), 'dragenter', e.event);
        }
      }
    }
  },
  _dragEnd: function (e) {
    var draggingTarget = this._draggingTarget;

    if (draggingTarget) {
      draggingTarget.dragging = false;
    }

    this.dispatchToElement(param(draggingTarget, e), 'dragend', e.event);

    if (this._dropTarget) {
      this.dispatchToElement(param(this._dropTarget, e), 'drop', e.event);
    }

    this._draggingTarget = null;
    this._dropTarget = null;
  }
};

function param(target, e) {
  return {
    target: target,
    topTarget: e && e.topTarget
  };
}

var _default = Draggable;
module.exports = _default;

/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

var Path = __webpack_require__(212);

var PathProxy = __webpack_require__(235);

var transformPath = __webpack_require__(341);

// command chars
var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
var mathSqrt = Math.sqrt;
var mathSin = Math.sin;
var mathCos = Math.cos;
var PI = Math.PI;

var vMag = function (v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};

var vRatio = function (u, v) {
  return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
};

var vAngle = function (u, v) {
  return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
};

function processArc(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg, cmd, path) {
  var psi = psiDeg * (PI / 180.0);
  var xp = mathCos(psi) * (x1 - x2) / 2.0 + mathSin(psi) * (y1 - y2) / 2.0;
  var yp = -1 * mathSin(psi) * (x1 - x2) / 2.0 + mathCos(psi) * (y1 - y2) / 2.0;
  var lambda = xp * xp / (rx * rx) + yp * yp / (ry * ry);

  if (lambda > 1) {
    rx *= mathSqrt(lambda);
    ry *= mathSqrt(lambda);
  }

  var f = (fa === fs ? -1 : 1) * mathSqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) / (rx * rx * (yp * yp) + ry * ry * (xp * xp))) || 0;
  var cxp = f * rx * yp / ry;
  var cyp = f * -ry * xp / rx;
  var cx = (x1 + x2) / 2.0 + mathCos(psi) * cxp - mathSin(psi) * cyp;
  var cy = (y1 + y2) / 2.0 + mathSin(psi) * cxp + mathCos(psi) * cyp;
  var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
  var u = [(xp - cxp) / rx, (yp - cyp) / ry];
  var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
  var dTheta = vAngle(u, v);

  if (vRatio(u, v) <= -1) {
    dTheta = PI;
  }

  if (vRatio(u, v) >= 1) {
    dTheta = 0;
  }

  if (fs === 0 && dTheta > 0) {
    dTheta = dTheta - 2 * PI;
  }

  if (fs === 1 && dTheta < 0) {
    dTheta = dTheta + 2 * PI;
  }

  path.addData(cmd, cx, cy, rx, ry, theta, dTheta, psi, fs);
}

function createPathProxyFromString(data) {
  if (!data) {
    return [];
  } // command string


  var cs = data.replace(/-/g, ' -').replace(/  /g, ' ').replace(/ /g, ',').replace(/,,/g, ',');
  var n; // create pipes so that we can split the data

  for (n = 0; n < cc.length; n++) {
    cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
  } // create array


  var arr = cs.split('|'); // init context point

  var cpx = 0;
  var cpy = 0;
  var path = new PathProxy();
  var CMD = PathProxy.CMD;
  var prevCmd;

  for (n = 1; n < arr.length; n++) {
    var str = arr[n];
    var c = str.charAt(0);
    var off = 0;
    var p = str.slice(1).replace(/e,-/g, 'e-').split(',');
    var cmd;

    if (p.length > 0 && p[0] === '') {
      p.shift();
    }

    for (var i = 0; i < p.length; i++) {
      p[i] = parseFloat(p[i]);
    }

    while (off < p.length && !isNaN(p[off])) {
      if (isNaN(p[0])) {
        break;
      }

      var ctlPtx;
      var ctlPty;
      var rx;
      var ry;
      var psi;
      var fa;
      var fs;
      var x1 = cpx;
      var y1 = cpy; // convert l, H, h, V, and v to L

      switch (c) {
        case 'l':
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD.L;
          path.addData(cmd, cpx, cpy);
          break;

        case 'L':
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD.L;
          path.addData(cmd, cpx, cpy);
          break;

        case 'm':
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD.M;
          path.addData(cmd, cpx, cpy);
          c = 'l';
          break;

        case 'M':
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD.M;
          path.addData(cmd, cpx, cpy);
          c = 'L';
          break;

        case 'h':
          cpx += p[off++];
          cmd = CMD.L;
          path.addData(cmd, cpx, cpy);
          break;

        case 'H':
          cpx = p[off++];
          cmd = CMD.L;
          path.addData(cmd, cpx, cpy);
          break;

        case 'v':
          cpy += p[off++];
          cmd = CMD.L;
          path.addData(cmd, cpx, cpy);
          break;

        case 'V':
          cpy = p[off++];
          cmd = CMD.L;
          path.addData(cmd, cpx, cpy);
          break;

        case 'C':
          cmd = CMD.C;
          path.addData(cmd, p[off++], p[off++], p[off++], p[off++], p[off++], p[off++]);
          cpx = p[off - 2];
          cpy = p[off - 1];
          break;

        case 'c':
          cmd = CMD.C;
          path.addData(cmd, p[off++] + cpx, p[off++] + cpy, p[off++] + cpx, p[off++] + cpy, p[off++] + cpx, p[off++] + cpy);
          cpx += p[off - 2];
          cpy += p[off - 1];
          break;

        case 'S':
          ctlPtx = cpx;
          ctlPty = cpy;
          var len = path.len();
          var pathData = path.data;

          if (prevCmd === CMD.C) {
            ctlPtx += cpx - pathData[len - 4];
            ctlPty += cpy - pathData[len - 3];
          }

          cmd = CMD.C;
          x1 = p[off++];
          y1 = p[off++];
          cpx = p[off++];
          cpy = p[off++];
          path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
          break;

        case 's':
          ctlPtx = cpx;
          ctlPty = cpy;
          var len = path.len();
          var pathData = path.data;

          if (prevCmd === CMD.C) {
            ctlPtx += cpx - pathData[len - 4];
            ctlPty += cpy - pathData[len - 3];
          }

          cmd = CMD.C;
          x1 = cpx + p[off++];
          y1 = cpy + p[off++];
          cpx += p[off++];
          cpy += p[off++];
          path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
          break;

        case 'Q':
          x1 = p[off++];
          y1 = p[off++];
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD.Q;
          path.addData(cmd, x1, y1, cpx, cpy);
          break;

        case 'q':
          x1 = p[off++] + cpx;
          y1 = p[off++] + cpy;
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD.Q;
          path.addData(cmd, x1, y1, cpx, cpy);
          break;

        case 'T':
          ctlPtx = cpx;
          ctlPty = cpy;
          var len = path.len();
          var pathData = path.data;

          if (prevCmd === CMD.Q) {
            ctlPtx += cpx - pathData[len - 4];
            ctlPty += cpy - pathData[len - 3];
          }

          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD.Q;
          path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
          break;

        case 't':
          ctlPtx = cpx;
          ctlPty = cpy;
          var len = path.len();
          var pathData = path.data;

          if (prevCmd === CMD.Q) {
            ctlPtx += cpx - pathData[len - 4];
            ctlPty += cpy - pathData[len - 3];
          }

          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD.Q;
          path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
          break;

        case 'A':
          rx = p[off++];
          ry = p[off++];
          psi = p[off++];
          fa = p[off++];
          fs = p[off++];
          x1 = cpx, y1 = cpy;
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD.A;
          processArc(x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path);
          break;

        case 'a':
          rx = p[off++];
          ry = p[off++];
          psi = p[off++];
          fa = p[off++];
          fs = p[off++];
          x1 = cpx, y1 = cpy;
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD.A;
          processArc(x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path);
          break;
      }
    }

    if (c === 'z' || c === 'Z') {
      cmd = CMD.Z;
      path.addData(cmd);
    }

    prevCmd = cmd;
  }

  path.toStatic();
  return path;
} // TODO Optimize double memory cost problem


function createPathOptions(str, opts) {
  var pathProxy = createPathProxyFromString(str);
  opts = opts || {};

  opts.buildPath = function (path) {
    if (path.setData) {
      path.setData(pathProxy.data); // Svg and vml renderer don't have context

      var ctx = path.getContext();

      if (ctx) {
        path.rebuildPath(ctx);
      }
    } else {
      var ctx = path;
      pathProxy.rebuildPath(ctx);
    }
  };

  opts.applyTransform = function (m) {
    transformPath(pathProxy, m);
    this.dirty(true);
  };

  return opts;
}
/**
 * Create a Path object from path string data
 * http://www.w3.org/TR/SVG/paths.html#PathData
 * @param  {Object} opts Other options
 */


function createFromString(str, opts) {
  return new Path(createPathOptions(str, opts));
}
/**
 * Create a Path class from path string data
 * @param  {string} str
 * @param  {Object} opts Other options
 */


function extendFromString(str, opts) {
  return Path.extend(createPathOptions(str, opts));
}
/**
 * Merge multiple paths
 */
// TODO Apply transform
// TODO stroke dash
// TODO Optimize double memory cost problem


function mergePath(pathEls, opts) {
  var pathList = [];
  var len = pathEls.length;

  for (var i = 0; i < len; i++) {
    var pathEl = pathEls[i];

    if (!pathEl.path) {
      pathEl.createPathProxy();
    }

    if (pathEl.__dirtyPath) {
      pathEl.buildPath(pathEl.path, pathEl.shape, true);
    }

    pathList.push(pathEl.path);
  }

  var pathBundle = new Path(opts); // Need path proxy.

  pathBundle.createPathProxy();

  pathBundle.buildPath = function (path) {
    path.appendPath(pathList); // Svg and vml renderer don't have context

    var ctx = path.getContext();

    if (ctx) {
      path.rebuildPath(ctx);
    }
  };

  return pathBundle;
}

exports.createFromString = createFromString;
exports.extendFromString = extendFromString;
exports.mergePath = mergePath;

/***/ }),
/* 341 */
/***/ (function(module, exports, __webpack_require__) {

var PathProxy = __webpack_require__(235);

var _vector = __webpack_require__(203);

var v2ApplyTransform = _vector.applyTransform;
var CMD = PathProxy.CMD;
var points = [[], [], []];
var mathSqrt = Math.sqrt;
var mathAtan2 = Math.atan2;

function _default(path, m) {
  var data = path.data;
  var cmd;
  var nPoint;
  var i;
  var j;
  var k;
  var p;
  var M = CMD.M;
  var C = CMD.C;
  var L = CMD.L;
  var R = CMD.R;
  var A = CMD.A;
  var Q = CMD.Q;

  for (i = 0, j = 0; i < data.length;) {
    cmd = data[i++];
    j = i;
    nPoint = 0;

    switch (cmd) {
      case M:
        nPoint = 1;
        break;

      case L:
        nPoint = 1;
        break;

      case C:
        nPoint = 3;
        break;

      case Q:
        nPoint = 2;
        break;

      case A:
        var x = m[4];
        var y = m[5];
        var sx = mathSqrt(m[0] * m[0] + m[1] * m[1]);
        var sy = mathSqrt(m[2] * m[2] + m[3] * m[3]);
        var angle = mathAtan2(-m[1] / sy, m[0] / sx); // cx

        data[i] *= sx;
        data[i++] += x; // cy

        data[i] *= sy;
        data[i++] += y; // Scale rx and ry
        // FIXME Assume psi is 0 here

        data[i++] *= sx;
        data[i++] *= sy; // Start angle

        data[i++] += angle; // end angle

        data[i++] += angle; // FIXME psi

        i += 2;
        j = i;
        break;

      case R:
        // x0, y0
        p[0] = data[i++];
        p[1] = data[i++];
        v2ApplyTransform(p, p, m);
        data[j++] = p[0];
        data[j++] = p[1]; // x1, y1

        p[0] += data[i++];
        p[1] += data[i++];
        v2ApplyTransform(p, p, m);
        data[j++] = p[0];
        data[j++] = p[1];
    }

    for (k = 0; k < nPoint; k++) {
      var p = points[k];
      p[0] = data[i++];
      p[1] = data[i++];
      v2ApplyTransform(p, p, m); // Write back

      data[j++] = p[0];
      data[j++] = p[1];
    }
  }
}

module.exports = _default;

/***/ }),
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */,
/* 349 */,
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_echarts_lib_echarts__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_echarts_lib_echarts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_echarts_lib_echarts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_echarts_lib_chart_pie__ = __webpack_require__(412);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_echarts_lib_chart_pie___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_echarts_lib_chart_pie__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_echarts_lib_component_title__ = __webpack_require__(286);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_echarts_lib_component_title___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_echarts_lib_component_title__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_echarts_lib_component_legend__ = __webpack_require__(281);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_echarts_lib_component_legend___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_echarts_lib_component_legend__);








/* harmony default export */ __webpack_exports__["default"] = ({
    mounted: function mounted() {
        this.myChart = __WEBPACK_IMPORTED_MODULE_0_echarts_lib_echarts___default.a.init(document.getElementById('visitorpie'));
        this.initData();
    },

    props: ['pieData'],
    methods: {
        initData: function initData() {
            var option = {
                title: {
                    text: '最近七日任务信息',
                    subtext: '',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['备份成功', '备份失败', '正在备份', '备份数据上传中', '恢复成功', '恢复失败', '异地恢复成功', '异地恢复失败']
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [{ value: this.pieData.backup_success, name: '备份成功' }, { value: this.pieData.backup_failed, name: '备份失败' }, { value: this.pieData.backup_doing, name: '正在备份' }, { value: this.pieData.backup_upload, name: '备份数据上传中' }, { value: this.pieData.recovery_success, name: '恢复成功' }, { value: this.pieData.recovery_failed, name: '恢复失败' }, { value: this.pieData.remote_recovery_success, name: '异地恢复成功' }, { value: this.pieData.remote_recovery_failed, name: '异地恢复失败' }],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };

            this.myChart.setOption(option);
        }
    },
    watch: {
        pieData: function pieData() {
            this.initData();
        }
    }
});

/***/ }),
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_headTop__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_headTop___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__components_headTop__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_time_formater__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_time_formater___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_time_formater__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_visitorPie__ = __webpack_require__(487);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_visitorPie___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_visitorPie__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__config_env__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__api_getData__ = __webpack_require__(199);









/* harmony default export */ __webpack_exports__["default"] = ({
   data: function data() {
      return {
         pieData: {}
      };
   },

   components: {
      headTop: __WEBPACK_IMPORTED_MODULE_2__components_headTop___default.a,
      visitorPie: __WEBPACK_IMPORTED_MODULE_4__components_visitorPie___default.a
   },
   mounted: function mounted() {
      this.initData();
   },

   methods: {
      initData: function initData() {
         var _this = this;

         return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
            var date, res, message;
            return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
               while (1) {
                  switch (_context.prev = _context.next) {
                     case 0:
                        _context.prev = 0;
                        date = __WEBPACK_IMPORTED_MODULE_3_time_formater___default()(new Date().getTime() - 86400000 * 6).format('YYYY-MM-DD');
                        _context.next = 4;
                        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__api_getData__["d" /* getJobInfo */])(date);

                     case 4:
                        res = _context.sent;

                        if (!(res.status == 1)) {
                           _context.next = 9;
                           break;
                        }

                        _this.pieData = res.jobinfo;
                        _context.next = 10;
                        break;

                     case 9:
                        throw new Error(res);

                     case 10:
                        _context.next = 19;
                        break;

                     case 12:
                        _context.prev = 12;
                        _context.t0 = _context['catch'](0);
                        message = "会话过期，请重新登录";

                        _this.$router.push('/');
                        __WEBPACK_IMPORTED_MODULE_5__config_env__["b" /* default */].token = '';
                        _this.$message({
                           type: 'error',
                           message: message
                        });
                        console.log('获取数据失败', _context.t0);

                     case 19:
                     case 'end':
                        return _context.stop();
                  }
               }
            }, _callee, _this, [[0, 12]]);
         }))();
      }
   }
});

/***/ }),
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */,
/* 381 */,
/* 382 */,
/* 383 */,
/* 384 */,
/* 385 */,
/* 386 */,
/* 387 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(178)(false);
// imports


// module
exports.push([module.i, ".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}.visitorpie{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;margin-top:20px}", ""]);

// exports


/***/ }),
/* 388 */,
/* 389 */,
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(178)(false);
// imports


// module
exports.push([module.i, ".allcover{position:absolute;top:0;right:0}.ctt{left:50%;transform:translate(-50%,-50%)}.ctt,.tb{position:absolute;top:50%}.tb{transform:translateY(-50%)}.lr{position:absolute;left:50%;transform:translateX(-50%)}", ""]);

// exports


/***/ }),
/* 398 */,
/* 399 */
/***/ (function(module, exports, __webpack_require__) {

var echarts = __webpack_require__(198);

var zrUtil = __webpack_require__(196);

function _default(seriesType, actionInfos) {
  zrUtil.each(actionInfos, function (actionInfo) {
    actionInfo.update = 'updateView';
    /**
     * @payload
     * @property {string} seriesName
     * @property {string} name
     */

    echarts.registerAction(actionInfo, function (payload, ecModel) {
      var selected = {};
      ecModel.eachComponent({
        mainType: 'series',
        subType: seriesType,
        query: payload
      }, function (seriesModel) {
        if (seriesModel[actionInfo.method]) {
          seriesModel[actionInfo.method](payload.name, payload.dataIndex);
        }

        var data = seriesModel.getData(); // Create selected map

        data.each(function (idx) {
          var name = data.getName(idx);
          selected[name] = seriesModel.isSelected(name) || false;
        });
      });
      return {
        name: payload.name,
        selected: selected
      };
    });
  });
}

module.exports = _default;

/***/ }),
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */
/***/ (function(module, exports, __webpack_require__) {

var echarts = __webpack_require__(198);

var zrUtil = __webpack_require__(196);

__webpack_require__(413);

__webpack_require__(414);

var createDataSelectAction = __webpack_require__(399);

var dataColor = __webpack_require__(467);

var pieLayout = __webpack_require__(416);

var dataFilter = __webpack_require__(465);

createDataSelectAction('pie', [{
  type: 'pieToggleSelect',
  event: 'pieselectchanged',
  method: 'toggleSelected'
}, {
  type: 'pieSelect',
  event: 'pieselected',
  method: 'select'
}, {
  type: 'pieUnSelect',
  event: 'pieunselected',
  method: 'unSelect'
}]);
echarts.registerVisual(zrUtil.curry(dataColor, 'pie'));
echarts.registerLayout(zrUtil.curry(pieLayout, 'pie'));
echarts.registerProcessor(zrUtil.curry(dataFilter, 'pie'));

/***/ }),
/* 413 */
/***/ (function(module, exports, __webpack_require__) {

var echarts = __webpack_require__(198);

var List = __webpack_require__(238);

var zrUtil = __webpack_require__(196);

var modelUtil = __webpack_require__(201);

var _number = __webpack_require__(202);

var getPercentWithPrecision = _number.getPercentWithPrecision;

var completeDimensions = __webpack_require__(247);

var dataSelectableMixin = __webpack_require__(437);

var PieSeries = echarts.extendSeriesModel({
  type: 'series.pie',
  // Overwrite
  init: function (option) {
    PieSeries.superApply(this, 'init', arguments); // Enable legend selection for each data item
    // Use a function instead of direct access because data reference may changed

    this.legendDataProvider = function () {
      return this.getRawData();
    };

    this.updateSelectedMap(option.data);

    this._defaultLabelLine(option);
  },
  // Overwrite
  mergeOption: function (newOption) {
    PieSeries.superCall(this, 'mergeOption', newOption);
    this.updateSelectedMap(this.option.data);
  },
  getInitialData: function (option, ecModel) {
    var dimensions = completeDimensions(['value'], option.data);
    var list = new List(dimensions, this);
    list.initData(option.data);
    return list;
  },
  // Overwrite
  getDataParams: function (dataIndex) {
    var data = this.getData();
    var params = PieSeries.superCall(this, 'getDataParams', dataIndex); // FIXME toFixed?

    var valueList = [];
    data.each('value', function (value) {
      valueList.push(value);
    });
    params.percent = getPercentWithPrecision(valueList, dataIndex, data.hostModel.get('percentPrecision'));
    params.$vars.push('percent');
    return params;
  },
  _defaultLabelLine: function (option) {
    // Extend labelLine emphasis
    modelUtil.defaultEmphasis(option.labelLine, ['show']);
    var labelLineNormalOpt = option.labelLine.normal;
    var labelLineEmphasisOpt = option.labelLine.emphasis; // Not show label line if `label.normal.show = false`

    labelLineNormalOpt.show = labelLineNormalOpt.show && option.label.normal.show;
    labelLineEmphasisOpt.show = labelLineEmphasisOpt.show && option.label.emphasis.show;
  },
  defaultOption: {
    zlevel: 0,
    z: 2,
    legendHoverLink: true,
    hoverAnimation: true,
    // 默认全局居中
    center: ['50%', '50%'],
    radius: [0, '75%'],
    // 默认顺时针
    clockwise: true,
    startAngle: 90,
    // 最小角度改为0
    minAngle: 0,
    // 选中时扇区偏移量
    selectedOffset: 10,
    // 高亮扇区偏移量
    hoverOffset: 10,
    // If use strategy to avoid label overlapping
    avoidLabelOverlap: true,
    // 选择模式，默认关闭，可选single，multiple
    // selectedMode: false,
    // 南丁格尔玫瑰图模式，'radius'（半径） | 'area'（面积）
    // roseType: null,
    percentPrecision: 2,
    // If still show when all data zero.
    stillShowZeroSum: true,
    // cursor: null,
    label: {
      normal: {
        // If rotate around circle
        rotate: false,
        show: true,
        // 'outer', 'inside', 'center'
        position: 'outer' // formatter: 标签文本格式器，同Tooltip.formatter，不支持异步回调
        // 默认使用全局文本样式，详见TEXTSTYLE
        // distance: 当position为inner时有效，为label位置到圆心的距离与圆半径(环状图为内外半径和)的比例系数

      },
      emphasis: {}
    },
    // Enabled when label.normal.position is 'outer'
    labelLine: {
      normal: {
        show: true,
        // 引导线两段中的第一段长度
        length: 15,
        // 引导线两段中的第二段长度
        length2: 15,
        smooth: false,
        lineStyle: {
          // color: 各异,
          width: 1,
          type: 'solid'
        }
      }
    },
    itemStyle: {
      normal: {
        borderWidth: 1
      },
      emphasis: {}
    },
    // Animation type canbe expansion, scale
    animationType: 'expansion',
    animationEasing: 'cubicOut',
    data: []
  }
});
zrUtil.mixin(PieSeries, dataSelectableMixin);
var _default = PieSeries;
module.exports = _default;

/***/ }),
/* 414 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

var graphic = __webpack_require__(200);

var ChartView = __webpack_require__(255);

/**
 * @param {module:echarts/model/Series} seriesModel
 * @param {boolean} hasAnimation
 * @inner
 */
function updateDataSelected(uid, seriesModel, hasAnimation, api) {
  var data = seriesModel.getData();
  var dataIndex = this.dataIndex;
  var name = data.getName(dataIndex);
  var selectedOffset = seriesModel.get('selectedOffset');
  api.dispatchAction({
    type: 'pieToggleSelect',
    from: uid,
    name: name,
    seriesId: seriesModel.id
  });
  data.each(function (idx) {
    toggleItemSelected(data.getItemGraphicEl(idx), data.getItemLayout(idx), seriesModel.isSelected(data.getName(idx)), selectedOffset, hasAnimation);
  });
}
/**
 * @param {module:zrender/graphic/Sector} el
 * @param {Object} layout
 * @param {boolean} isSelected
 * @param {number} selectedOffset
 * @param {boolean} hasAnimation
 * @inner
 */


function toggleItemSelected(el, layout, isSelected, selectedOffset, hasAnimation) {
  var midAngle = (layout.startAngle + layout.endAngle) / 2;
  var dx = Math.cos(midAngle);
  var dy = Math.sin(midAngle);
  var offset = isSelected ? selectedOffset : 0;
  var position = [dx * offset, dy * offset];
  hasAnimation // animateTo will stop revious animation like update transition
  ? el.animate().when(200, {
    position: position
  }).start('bounceOut') : el.attr('position', position);
}
/**
 * Piece of pie including Sector, Label, LabelLine
 * @constructor
 * @extends {module:zrender/graphic/Group}
 */


function PiePiece(data, idx) {
  graphic.Group.call(this);
  var sector = new graphic.Sector({
    z2: 2
  });
  var polyline = new graphic.Polyline();
  var text = new graphic.Text();
  this.add(sector);
  this.add(polyline);
  this.add(text);
  this.updateData(data, idx, true); // Hover to change label and labelLine

  function onEmphasis() {
    polyline.ignore = polyline.hoverIgnore;
    text.ignore = text.hoverIgnore;
  }

  function onNormal() {
    polyline.ignore = polyline.normalIgnore;
    text.ignore = text.normalIgnore;
  }

  this.on('emphasis', onEmphasis).on('normal', onNormal).on('mouseover', onEmphasis).on('mouseout', onNormal);
}

var piePieceProto = PiePiece.prototype;

piePieceProto.updateData = function (data, idx, firstCreate) {
  var sector = this.childAt(0);
  var seriesModel = data.hostModel;
  var itemModel = data.getItemModel(idx);
  var layout = data.getItemLayout(idx);
  var sectorShape = zrUtil.extend({}, layout);
  sectorShape.label = null;

  if (firstCreate) {
    sector.setShape(sectorShape);
    var animationType = seriesModel.getShallow('animationType');

    if (animationType === 'scale') {
      sector.shape.r = layout.r0;
      graphic.initProps(sector, {
        shape: {
          r: layout.r
        }
      }, seriesModel, idx);
    } // Expansion
    else {
        sector.shape.endAngle = layout.startAngle;
        graphic.updateProps(sector, {
          shape: {
            endAngle: layout.endAngle
          }
        }, seriesModel, idx);
      }
  } else {
    graphic.updateProps(sector, {
      shape: sectorShape
    }, seriesModel, idx);
  } // Update common style


  var itemStyleModel = itemModel.getModel('itemStyle');
  var visualColor = data.getItemVisual(idx, 'color');
  sector.useStyle(zrUtil.defaults({
    lineJoin: 'bevel',
    fill: visualColor
  }, itemStyleModel.getModel('normal').getItemStyle()));
  sector.hoverStyle = itemStyleModel.getModel('emphasis').getItemStyle();
  var cursorStyle = itemModel.getShallow('cursor');
  cursorStyle && sector.attr('cursor', cursorStyle); // Toggle selected

  toggleItemSelected(this, data.getItemLayout(idx), itemModel.get('selected'), seriesModel.get('selectedOffset'), seriesModel.get('animation'));

  function onEmphasis() {
    // Sector may has animation of updating data. Force to move to the last frame
    // Or it may stopped on the wrong shape
    sector.stopAnimation(true);
    sector.animateTo({
      shape: {
        r: layout.r + seriesModel.get('hoverOffset')
      }
    }, 300, 'elasticOut');
  }

  function onNormal() {
    sector.stopAnimation(true);
    sector.animateTo({
      shape: {
        r: layout.r
      }
    }, 300, 'elasticOut');
  }

  sector.off('mouseover').off('mouseout').off('emphasis').off('normal');

  if (itemModel.get('hoverAnimation') && seriesModel.isAnimationEnabled()) {
    sector.on('mouseover', onEmphasis).on('mouseout', onNormal).on('emphasis', onEmphasis).on('normal', onNormal);
  }

  this._updateLabel(data, idx);

  graphic.setHoverStyle(this);
};

piePieceProto._updateLabel = function (data, idx) {
  var labelLine = this.childAt(1);
  var labelText = this.childAt(2);
  var seriesModel = data.hostModel;
  var itemModel = data.getItemModel(idx);
  var layout = data.getItemLayout(idx);
  var labelLayout = layout.label;
  var visualColor = data.getItemVisual(idx, 'color');
  graphic.updateProps(labelLine, {
    shape: {
      points: labelLayout.linePoints || [[labelLayout.x, labelLayout.y], [labelLayout.x, labelLayout.y], [labelLayout.x, labelLayout.y]]
    }
  }, seriesModel, idx);
  graphic.updateProps(labelText, {
    style: {
      x: labelLayout.x,
      y: labelLayout.y
    }
  }, seriesModel, idx);
  labelText.attr({
    rotation: labelLayout.rotation,
    origin: [labelLayout.x, labelLayout.y],
    z2: 10
  });
  var labelModel = itemModel.getModel('label.normal');
  var labelHoverModel = itemModel.getModel('label.emphasis');
  var labelLineModel = itemModel.getModel('labelLine.normal');
  var labelLineHoverModel = itemModel.getModel('labelLine.emphasis');
  var visualColor = data.getItemVisual(idx, 'color');
  graphic.setLabelStyle(labelText.style, labelText.hoverStyle = {}, labelModel, labelHoverModel, {
    labelFetcher: data.hostModel,
    labelDataIndex: idx,
    defaultText: data.getName(idx),
    autoColor: visualColor,
    useInsideStyle: !!labelLayout.inside
  }, {
    textAlign: labelLayout.textAlign,
    textVerticalAlign: labelLayout.verticalAlign,
    opacity: data.getItemVisual(idx, 'opacity')
  });
  labelText.ignore = labelText.normalIgnore = !labelModel.get('show');
  labelText.hoverIgnore = !labelHoverModel.get('show');
  labelLine.ignore = labelLine.normalIgnore = !labelLineModel.get('show');
  labelLine.hoverIgnore = !labelLineHoverModel.get('show'); // Default use item visual color

  labelLine.setStyle({
    stroke: visualColor,
    opacity: data.getItemVisual(idx, 'opacity')
  });
  labelLine.setStyle(labelLineModel.getModel('lineStyle').getLineStyle());
  labelLine.hoverStyle = labelLineHoverModel.getModel('lineStyle').getLineStyle();
  var smooth = labelLineModel.get('smooth');

  if (smooth && smooth === true) {
    smooth = 0.4;
  }

  labelLine.setShape({
    smooth: smooth
  });
};

zrUtil.inherits(PiePiece, graphic.Group); // Pie view

var PieView = ChartView.extend({
  type: 'pie',
  init: function () {
    var sectorGroup = new graphic.Group();
    this._sectorGroup = sectorGroup;
  },
  render: function (seriesModel, ecModel, api, payload) {
    if (payload && payload.from === this.uid) {
      return;
    }

    var data = seriesModel.getData();
    var oldData = this._data;
    var group = this.group;
    var hasAnimation = ecModel.get('animation');
    var isFirstRender = !oldData;
    var animationType = seriesModel.get('animationType');
    var onSectorClick = zrUtil.curry(updateDataSelected, this.uid, seriesModel, hasAnimation, api);
    var selectedMode = seriesModel.get('selectedMode');
    data.diff(oldData).add(function (idx) {
      var piePiece = new PiePiece(data, idx); // Default expansion animation

      if (isFirstRender && animationType !== 'scale') {
        piePiece.eachChild(function (child) {
          child.stopAnimation(true);
        });
      }

      selectedMode && piePiece.on('click', onSectorClick);
      data.setItemGraphicEl(idx, piePiece);
      group.add(piePiece);
    }).update(function (newIdx, oldIdx) {
      var piePiece = oldData.getItemGraphicEl(oldIdx);
      piePiece.updateData(data, newIdx);
      piePiece.off('click');
      selectedMode && piePiece.on('click', onSectorClick);
      group.add(piePiece);
      data.setItemGraphicEl(newIdx, piePiece);
    }).remove(function (idx) {
      var piePiece = oldData.getItemGraphicEl(idx);
      group.remove(piePiece);
    }).execute();

    if (hasAnimation && isFirstRender && data.count() > 0 // Default expansion animation
    && animationType !== 'scale') {
      var shape = data.getItemLayout(0);
      var r = Math.max(api.getWidth(), api.getHeight()) / 2;
      var removeClipPath = zrUtil.bind(group.removeClipPath, group);
      group.setClipPath(this._createClipPath(shape.cx, shape.cy, r, shape.startAngle, shape.clockwise, removeClipPath, seriesModel));
    }

    this._data = data;
  },
  dispose: function () {},
  _createClipPath: function (cx, cy, r, startAngle, clockwise, cb, seriesModel) {
    var clipPath = new graphic.Sector({
      shape: {
        cx: cx,
        cy: cy,
        r0: 0,
        r: r,
        startAngle: startAngle,
        endAngle: startAngle,
        clockwise: clockwise
      }
    });
    graphic.initProps(clipPath, {
      shape: {
        endAngle: startAngle + (clockwise ? 1 : -1) * Math.PI * 2
      }
    }, seriesModel, cb);
    return clipPath;
  },

  /**
   * @implement
   */
  containPoint: function (point, seriesModel) {
    var data = seriesModel.getData();
    var itemLayout = data.getItemLayout(0);

    if (itemLayout) {
      var dx = point[0] - itemLayout.cx;
      var dy = point[1] - itemLayout.cy;
      var radius = Math.sqrt(dx * dx + dy * dy);
      return radius <= itemLayout.r && radius >= itemLayout.r0;
    }
  }
});
var _default = PieView;
module.exports = _default;

/***/ }),
/* 415 */
/***/ (function(module, exports, __webpack_require__) {

var textContain = __webpack_require__(225);

// FIXME emphasis label position is not same with normal label position
function adjustSingleSide(list, cx, cy, r, dir, viewWidth, viewHeight) {
  list.sort(function (a, b) {
    return a.y - b.y;
  }); // 压

  function shiftDown(start, end, delta, dir) {
    for (var j = start; j < end; j++) {
      list[j].y += delta;

      if (j > start && j + 1 < end && list[j + 1].y > list[j].y + list[j].height) {
        shiftUp(j, delta / 2);
        return;
      }
    }

    shiftUp(end - 1, delta / 2);
  } // 弹


  function shiftUp(end, delta) {
    for (var j = end; j >= 0; j--) {
      list[j].y -= delta;

      if (j > 0 && list[j].y > list[j - 1].y + list[j - 1].height) {
        break;
      }
    }
  }

  function changeX(list, isDownList, cx, cy, r, dir) {
    var lastDeltaX = dir > 0 ? isDownList // 右侧
    ? Number.MAX_VALUE // 下
    : 0 // 上
    : isDownList // 左侧
    ? Number.MAX_VALUE // 下
    : 0; // 上

    for (var i = 0, l = list.length; i < l; i++) {
      // Not change x for center label
      if (list[i].position === 'center') {
        continue;
      }

      var deltaY = Math.abs(list[i].y - cy);
      var length = list[i].len;
      var length2 = list[i].len2;
      var deltaX = deltaY < r + length ? Math.sqrt((r + length + length2) * (r + length + length2) - deltaY * deltaY) : Math.abs(list[i].x - cx);

      if (isDownList && deltaX >= lastDeltaX) {
        // 右下，左下
        deltaX = lastDeltaX - 10;
      }

      if (!isDownList && deltaX <= lastDeltaX) {
        // 右上，左上
        deltaX = lastDeltaX + 10;
      }

      list[i].x = cx + deltaX * dir;
      lastDeltaX = deltaX;
    }
  }

  var lastY = 0;
  var delta;
  var len = list.length;
  var upList = [];
  var downList = [];

  for (var i = 0; i < len; i++) {
    delta = list[i].y - lastY;

    if (delta < 0) {
      shiftDown(i, len, -delta, dir);
    }

    lastY = list[i].y + list[i].height;
  }

  if (viewHeight - lastY < 0) {
    shiftUp(len - 1, lastY - viewHeight);
  }

  for (var i = 0; i < len; i++) {
    if (list[i].y >= cy) {
      downList.push(list[i]);
    } else {
      upList.push(list[i]);
    }
  }

  changeX(upList, false, cx, cy, r, dir);
  changeX(downList, true, cx, cy, r, dir);
}

function avoidOverlap(labelLayoutList, cx, cy, r, viewWidth, viewHeight) {
  var leftList = [];
  var rightList = [];

  for (var i = 0; i < labelLayoutList.length; i++) {
    if (labelLayoutList[i].x < cx) {
      leftList.push(labelLayoutList[i]);
    } else {
      rightList.push(labelLayoutList[i]);
    }
  }

  adjustSingleSide(rightList, cx, cy, r, 1, viewWidth, viewHeight);
  adjustSingleSide(leftList, cx, cy, r, -1, viewWidth, viewHeight);

  for (var i = 0; i < labelLayoutList.length; i++) {
    var linePoints = labelLayoutList[i].linePoints;

    if (linePoints) {
      var dist = linePoints[1][0] - linePoints[2][0];

      if (labelLayoutList[i].x < cx) {
        linePoints[2][0] = labelLayoutList[i].x + 3;
      } else {
        linePoints[2][0] = labelLayoutList[i].x - 3;
      }

      linePoints[1][1] = linePoints[2][1] = labelLayoutList[i].y;
      linePoints[1][0] = linePoints[2][0] + dist;
    }
  }
}

function _default(seriesModel, r, viewWidth, viewHeight) {
  var data = seriesModel.getData();
  var labelLayoutList = [];
  var cx;
  var cy;
  var hasLabelRotate = false;
  data.each(function (idx) {
    var layout = data.getItemLayout(idx);
    var itemModel = data.getItemModel(idx);
    var labelModel = itemModel.getModel('label.normal'); // Use position in normal or emphasis

    var labelPosition = labelModel.get('position') || itemModel.get('label.emphasis.position');
    var labelLineModel = itemModel.getModel('labelLine.normal');
    var labelLineLen = labelLineModel.get('length');
    var labelLineLen2 = labelLineModel.get('length2');
    var midAngle = (layout.startAngle + layout.endAngle) / 2;
    var dx = Math.cos(midAngle);
    var dy = Math.sin(midAngle);
    var textX;
    var textY;
    var linePoints;
    var textAlign;
    cx = layout.cx;
    cy = layout.cy;
    var isLabelInside = labelPosition === 'inside' || labelPosition === 'inner';

    if (labelPosition === 'center') {
      textX = layout.cx;
      textY = layout.cy;
      textAlign = 'center';
    } else {
      var x1 = (isLabelInside ? (layout.r + layout.r0) / 2 * dx : layout.r * dx) + cx;
      var y1 = (isLabelInside ? (layout.r + layout.r0) / 2 * dy : layout.r * dy) + cy;
      textX = x1 + dx * 3;
      textY = y1 + dy * 3;

      if (!isLabelInside) {
        // For roseType
        var x2 = x1 + dx * (labelLineLen + r - layout.r);
        var y2 = y1 + dy * (labelLineLen + r - layout.r);
        var x3 = x2 + (dx < 0 ? -1 : 1) * labelLineLen2;
        var y3 = y2;
        textX = x3 + (dx < 0 ? -5 : 5);
        textY = y3;
        linePoints = [[x1, y1], [x2, y2], [x3, y3]];
      }

      textAlign = isLabelInside ? 'center' : dx > 0 ? 'left' : 'right';
    }

    var font = labelModel.getFont();
    var labelRotate = labelModel.get('rotate') ? dx < 0 ? -midAngle + Math.PI : -midAngle : 0;
    var text = seriesModel.getFormattedLabel(idx, 'normal') || data.getName(idx);
    var textRect = textContain.getBoundingRect(text, font, textAlign, 'top');
    hasLabelRotate = !!labelRotate;
    layout.label = {
      x: textX,
      y: textY,
      position: labelPosition,
      height: textRect.height,
      len: labelLineLen,
      len2: labelLineLen2,
      linePoints: linePoints,
      textAlign: textAlign,
      verticalAlign: 'middle',
      rotation: labelRotate,
      inside: isLabelInside
    }; // Not layout the inside label

    if (!isLabelInside) {
      labelLayoutList.push(layout.label);
    }
  });

  if (!hasLabelRotate && seriesModel.get('avoidLabelOverlap')) {
    avoidOverlap(labelLayoutList, cx, cy, r, viewWidth, viewHeight);
  }
}

module.exports = _default;

/***/ }),
/* 416 */
/***/ (function(module, exports, __webpack_require__) {

var _number = __webpack_require__(202);

var parsePercent = _number.parsePercent;
var linearMap = _number.linearMap;

var labelLayout = __webpack_require__(415);

var zrUtil = __webpack_require__(196);

var PI2 = Math.PI * 2;
var RADIAN = Math.PI / 180;

function _default(seriesType, ecModel, api, payload) {
  ecModel.eachSeriesByType(seriesType, function (seriesModel) {
    var center = seriesModel.get('center');
    var radius = seriesModel.get('radius');

    if (!zrUtil.isArray(radius)) {
      radius = [0, radius];
    }

    if (!zrUtil.isArray(center)) {
      center = [center, center];
    }

    var width = api.getWidth();
    var height = api.getHeight();
    var size = Math.min(width, height);
    var cx = parsePercent(center[0], width);
    var cy = parsePercent(center[1], height);
    var r0 = parsePercent(radius[0], size / 2);
    var r = parsePercent(radius[1], size / 2);
    var data = seriesModel.getData();
    var startAngle = -seriesModel.get('startAngle') * RADIAN;
    var minAngle = seriesModel.get('minAngle') * RADIAN;
    var validDataCount = 0;
    data.each('value', function (value) {
      !isNaN(value) && validDataCount++;
    });
    var sum = data.getSum('value'); // Sum may be 0

    var unitRadian = Math.PI / (sum || validDataCount) * 2;
    var clockwise = seriesModel.get('clockwise');
    var roseType = seriesModel.get('roseType');
    var stillShowZeroSum = seriesModel.get('stillShowZeroSum'); // [0...max]

    var extent = data.getDataExtent('value');
    extent[0] = 0; // In the case some sector angle is smaller than minAngle

    var restAngle = PI2;
    var valueSumLargerThanMinAngle = 0;
    var currentAngle = startAngle;
    var dir = clockwise ? 1 : -1;
    data.each('value', function (value, idx) {
      var angle;

      if (isNaN(value)) {
        data.setItemLayout(idx, {
          angle: NaN,
          startAngle: NaN,
          endAngle: NaN,
          clockwise: clockwise,
          cx: cx,
          cy: cy,
          r0: r0,
          r: roseType ? NaN : r
        });
        return;
      } // FIXME 兼容 2.0 但是 roseType 是 area 的时候才是这样？


      if (roseType !== 'area') {
        angle = sum === 0 && stillShowZeroSum ? unitRadian : value * unitRadian;
      } else {
        angle = PI2 / validDataCount;
      }

      if (angle < minAngle) {
        angle = minAngle;
        restAngle -= minAngle;
      } else {
        valueSumLargerThanMinAngle += value;
      }

      var endAngle = currentAngle + dir * angle;
      data.setItemLayout(idx, {
        angle: angle,
        startAngle: currentAngle,
        endAngle: endAngle,
        clockwise: clockwise,
        cx: cx,
        cy: cy,
        r0: r0,
        r: roseType ? linearMap(value, extent, [r0, r]) : r
      });
      currentAngle = endAngle;
    }, true); // Some sector is constrained by minAngle
    // Rest sectors needs recalculate angle

    if (restAngle < PI2 && validDataCount) {
      // Average the angle if rest angle is not enough after all angles is
      // Constrained by minAngle
      if (restAngle <= 1e-3) {
        var angle = PI2 / validDataCount;
        data.each('value', function (value, idx) {
          if (!isNaN(value)) {
            var layout = data.getItemLayout(idx);
            layout.angle = angle;
            layout.startAngle = startAngle + dir * idx * angle;
            layout.endAngle = startAngle + dir * (idx + 1) * angle;
          }
        });
      } else {
        unitRadian = restAngle / valueSumLargerThanMinAngle;
        currentAngle = startAngle;
        data.each('value', function (value, idx) {
          if (!isNaN(value)) {
            var layout = data.getItemLayout(idx);
            var angle = layout.angle === minAngle ? minAngle : value * unitRadian;
            layout.startAngle = currentAngle;
            layout.endAngle = currentAngle + dir * angle;
            currentAngle += dir * angle;
          }
        });
      }
    }

    labelLayout(seriesModel, r, width, height);
  });
}

module.exports = _default;

/***/ }),
/* 417 */,
/* 418 */,
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */,
/* 423 */,
/* 424 */,
/* 425 */,
/* 426 */,
/* 427 */,
/* 428 */,
/* 429 */,
/* 430 */,
/* 431 */,
/* 432 */,
/* 433 */,
/* 434 */,
/* 435 */,
/* 436 */,
/* 437 */
/***/ (function(module, exports, __webpack_require__) {

var zrUtil = __webpack_require__(196);

/**
 * Data selectable mixin for chart series.
 * To eanble data select, option of series must have `selectedMode`.
 * And each data item will use `selected` to toggle itself selected status
 */
var _default = {
  updateSelectedMap: function (targetList) {
    this._targetList = targetList.slice();
    this._selectTargetMap = zrUtil.reduce(targetList || [], function (targetMap, target) {
      targetMap.set(target.name, target);
      return targetMap;
    }, zrUtil.createHashMap());
  },

  /**
   * Either name or id should be passed as input here.
   * If both of them are defined, id is used.
   *
   * @param {string|undefined} name name of data
   * @param {number|undefined} id dataIndex of data
   */
  // PENGING If selectedMode is null ?
  select: function (name, id) {
    var target = id != null ? this._targetList[id] : this._selectTargetMap.get(name);
    var selectedMode = this.get('selectedMode');

    if (selectedMode === 'single') {
      this._selectTargetMap.each(function (target) {
        target.selected = false;
      });
    }

    target && (target.selected = true);
  },

  /**
   * Either name or id should be passed as input here.
   * If both of them are defined, id is used.
   *
   * @param {string|undefined} name name of data
   * @param {number|undefined} id dataIndex of data
   */
  unSelect: function (name, id) {
    var target = id != null ? this._targetList[id] : this._selectTargetMap.get(name); // var selectedMode = this.get('selectedMode');
    // selectedMode !== 'single' && target && (target.selected = false);

    target && (target.selected = false);
  },

  /**
   * Either name or id should be passed as input here.
   * If both of them are defined, id is used.
   *
   * @param {string|undefined} name name of data
   * @param {number|undefined} id dataIndex of data
   */
  toggleSelected: function (name, id) {
    var target = id != null ? this._targetList[id] : this._selectTargetMap.get(name);

    if (target != null) {
      this[target.selected ? 'unSelect' : 'select'](name, id);
      return target.selected;
    }
  },

  /**
   * Either name or id should be passed as input here.
   * If both of them are defined, id is used.
   *
   * @param {string|undefined} name name of data
   * @param {number|undefined} id dataIndex of data
   */
  isSelected: function (name, id) {
    var target = id != null ? this._targetList[id] : this._selectTargetMap.get(name);
    return target && target.selected;
  }
};
module.exports = _default;

/***/ }),
/* 438 */,
/* 439 */,
/* 440 */,
/* 441 */,
/* 442 */,
/* 443 */,
/* 444 */,
/* 445 */,
/* 446 */,
/* 447 */,
/* 448 */,
/* 449 */,
/* 450 */,
/* 451 */,
/* 452 */,
/* 453 */,
/* 454 */,
/* 455 */,
/* 456 */,
/* 457 */,
/* 458 */,
/* 459 */,
/* 460 */,
/* 461 */,
/* 462 */,
/* 463 */,
/* 464 */,
/* 465 */
/***/ (function(module, exports) {

function _default(seriesType, ecModel) {
  var legendModels = ecModel.findComponents({
    mainType: 'legend'
  });

  if (!legendModels || !legendModels.length) {
    return;
  }

  ecModel.eachSeriesByType(seriesType, function (series) {
    var data = series.getData();
    data.filterSelf(function (idx) {
      var name = data.getName(idx); // If in any legend component the status is not selected.

      for (var i = 0; i < legendModels.length; i++) {
        if (!legendModels[i].isSelected(name)) {
          return false;
        }
      }

      return true;
    }, this);
  }, this);
}

module.exports = _default;

/***/ }),
/* 466 */,
/* 467 */
/***/ (function(module, exports) {

// Pick color from palette for each data item.
// Applicable for charts that require applying color palette
// in data level (like pie, funnel, chord).
function _default(seriesType, ecModel) {
  // Pie and funnel may use diferrent scope
  var paletteScope = {};
  ecModel.eachRawSeriesByType(seriesType, function (seriesModel) {
    var dataAll = seriesModel.getRawData();
    var idxMap = {};

    if (!ecModel.isSeriesFiltered(seriesModel)) {
      var data = seriesModel.getData();
      data.each(function (idx) {
        var rawIdx = data.getRawIndex(idx);
        idxMap[rawIdx] = idx;
      });
      dataAll.each(function (rawIdx) {
        var filteredIdx = idxMap[rawIdx]; // If series.itemStyle.normal.color is a function. itemVisual may be encoded

        var singleDataColor = filteredIdx != null && data.getItemVisual(filteredIdx, 'color', true);

        if (!singleDataColor) {
          // FIXME Performance
          var itemModel = dataAll.getItemModel(rawIdx);
          var color = itemModel.get('itemStyle.normal.color') || seriesModel.getColorFromPalette(dataAll.getName(rawIdx), paletteScope); // Legend may use the visual info in data before processed

          dataAll.setItemVisual(rawIdx, 'color', color); // Data is not filtered

          if (filteredIdx != null) {
            data.setItemVisual(filteredIdx, 'color', color);
          }
        } else {
          // Set data all color for legend
          dataAll.setItemVisual(rawIdx, 'color', singleDataColor);
        }
      });
    }
  });
}

module.exports = _default;

/***/ }),
/* 468 */,
/* 469 */,
/* 470 */,
/* 471 */,
/* 472 */,
/* 473 */,
/* 474 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(387);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(179)("01e08422", content, true);

/***/ }),
/* 475 */,
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */,
/* 480 */,
/* 481 */,
/* 482 */,
/* 483 */,
/* 484 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(397);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(179)("08e4d415", content, true);

/***/ }),
/* 485 */,
/* 486 */,
/* 487 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(474)

var Component = __webpack_require__(83)(
  /* script */
  __webpack_require__(357),
  /* template */
  __webpack_require__(493),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 488 */,
/* 489 */,
/* 490 */,
/* 491 */,
/* 492 */,
/* 493 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "visitorpie"
  }, [_c('div', {
    staticStyle: {
      "width": "90%",
      "height": "450px"
    },
    attrs: {
      "id": "visitorpie"
    }
  })])
}]}

/***/ }),
/* 494 */,
/* 495 */,
/* 496 */,
/* 497 */,
/* 498 */,
/* 499 */,
/* 500 */,
/* 501 */,
/* 502 */,
/* 503 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('head-top'), _vm._v(" "), _c('visitor-pie', {
    attrs: {
      "pieData": _vm.pieData
    }
  })], 1)
},staticRenderFns: []}

/***/ })
]));