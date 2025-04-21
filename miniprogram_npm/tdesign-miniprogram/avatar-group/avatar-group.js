var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import avatarGroupProps from './props';
const { prefix } = config;
const name = `${prefix}-avatar-group`;
let AvatarGroup = class AvatarGroup extends SuperComponent {
    constructor() {
        super(...arguments);
        // 定义外部样式类
        this.externalClasses = [`${prefix}-class`, `${prefix}-class-content`, `${prefix}-class-image`];
        // 定义组件的属性
        this.properties = avatarGroupProps;
        // 定义组件的内部数据
        this.data = {
            prefix,
            classPrefix: name,
            hasChild: true,
            length: 0,
            className: '',
        };
        // 启用多插槽支持
        this.options = {
            multipleSlots: true,
        };
        // 定义与子组件的关系
        this.relations = {
            '../avatar/avatar': {
                type: 'descendant',
            },
        };
        // 生命周期方法
        this.lifetimes = {
            attached() {
                // 设置组件的类名
                this.setClass();
            },
            ready() {
                // 初始化子组件数量
                this.setData({
                    length: this.$children.length,
                });
                // 处理最大显示数量
                this.handleMax();
                // 处理子组件的层叠效果
                this.handleChildCascading();
            },
        };
        // 属性观察器
        this.observers = {
            'cascading, size'() {
                // 当属性变化时重新设置类名
                this.setClass();
            },
        };
        // 定义组件的方法
        this.methods = {
            // 设置组件的类名
            setClass() {
                const { cascading, size } = this.properties;
                const direction = cascading.split('-')[0];
                const classList = [
                    name,
                    `${prefix}-class`,
                    `${name}-offset-${direction}-${size.indexOf('px') > -1 ? 'medium' : size}`,
                ];
                this.setData({
                    className: classList.join(' '),
                });
            },
            // 处理最大显示数量
            handleMax() {
                const { max } = this.data;
                const len = this.$children.length;
                if (!max || max > len) return;
                const restAvatars = this.$children.splice(max, len - max);
                restAvatars.forEach((child) => {
                    child.hide(); // 隐藏多余的子组件
                });
            },
            // 处理子组件的层叠效果
            handleChildCascading() {
                if (this.properties.cascading === 'right-up') return;
                const defaultZIndex = 100;
                this.$children.forEach((child, index) => {
                    child.updateCascading(defaultZIndex - index * 10); // 设置子组件的层叠顺序
                });
            },
        };
    }
};
AvatarGroup = __decorate([
    wxComponent()
], AvatarGroup);
export default AvatarGroup;
