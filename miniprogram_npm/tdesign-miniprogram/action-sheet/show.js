// 工具函数，用于从对象中剔除指定的属性
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};

// 导入工具函数 getInstance，用于获取组件实例
import { getInstance } from '../common/utils';

// 定义操作面板的主题类型
export var ActionSheetTheme;
(function (ActionSheetTheme) {
    ActionSheetTheme["List"] = "list"; // 列表主题
    ActionSheetTheme["Grid"] = "grid"; // 网格主题
})(ActionSheetTheme || (ActionSheetTheme = {}));

// 显示操作面板
export const show = function (options) {
    // 解构参数，获取上下文和选择器，默认选择器为 '#t-action-sheet'
    const _a = Object.assign({}, options), { context, selector = '#t-action-sheet' } = _a, otherOptions = __rest(_a, ["context", "selector"]);
    const instance = getInstance(context, selector); // 获取组件实例
    if (instance) {
        instance.show(Object.assign({}, otherOptions)); // 调用实例的 show 方法
        return instance; // 返回实例
    }
    console.error('未找到组件,请确认 selector && context 是否正确'); // 未找到组件时输出错误信息
};

// 关闭操作面板
export const close = function (options) {
    // 解构参数，获取上下文和选择器，默认选择器为 '#t-action-sheet'
    const { context, selector = '#t-action-sheet' } = Object.assign({}, options);
    const instance = getInstance(context, selector); // 获取组件实例
    if (instance) {
        instance.close(); // 调用实例的 close 方法
    }
};
