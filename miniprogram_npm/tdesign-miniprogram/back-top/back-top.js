var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import { calcIcon } from '../common/utils';
const { prefix } = config;
const name = `${prefix}-back-top`;
let BackTop = class BackTop extends SuperComponent {
    constructor() {
        super(...arguments);
        // 定义外部样式类
        this.externalClasses = [`${prefix}-class`, `${prefix}-class-icon`, `${prefix}-class-text`];
        // 启用多插槽支持
        this.options = {
            multipleSlots: true,
        };
        // 定义组件的属性
        this.properties = props;
        // 定义与父组件的关系
        this.relations = {
            '../pull-down-refresh/pull-down-refresh': {
                type: 'ancestor',
            },
        };
        // 定义组件的内部数据
        this.data = {
            prefix,
            classPrefix: name,
            _icon: null, // 存储计算后的图标
            hidden: true, // 控制组件的显示/隐藏
        };
        // 属性观察器
        this.observers = {
            // 当 icon 属性变化时，重新设置图标
            icon() {
                this.setIcon();
            },
            // 根据 scrollTop 值控制组件的显示/隐藏
            scrollTop(value) {
                const { visibilityHeight } = this.properties;
                this.setData({ hidden: value < visibilityHeight });
            },
        };
        // 生命周期方法
        this.lifetimes = {
            ready() {
                const { icon } = this.properties;
                // 初始化图标
                this.setIcon(icon);
            },
        };
        // 定义组件的方法
        this.methods = {
            // 设置图标
            setIcon(v) {
                this.setData({
                    _icon: calcIcon(v, 'backtop'),
                });
            },
            // 返回顶部的方法
            toTop() {
                var _a;
                // 触发 to-top 事件
                this.triggerEvent('to-top');
                if (this.$parent) {
                    // 如果有父组件，调用父组件的方法设置滚动位置
                    (_a = this.$parent) === null || _a === void 0 ? void 0 : _a.setScrollTop(0);
                    this.setData({ hidden: true });
                }
                else {
                    // 如果没有父组件，使用微信小程序的 pageScrollTo 方法返回顶部
                    wx.pageScrollTo({
                        scrollTop: 0,
                        duration: 300,
                    });
                }
            },
        };
    }
};
BackTop = __decorate([
    wxComponent()
], BackTop);
export default BackTop;
