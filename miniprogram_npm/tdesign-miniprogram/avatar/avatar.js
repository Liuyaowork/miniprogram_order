// 装饰器函数，用于为类或方法添加额外功能
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

// 导入基础组件类、装饰器和工具函数
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import avatarProps from './props';
import { setIcon } from '../common/utils';

// 获取全局配置中的前缀
const { prefix } = config;
// 定义组件的类名前缀
const name = `${prefix}-avatar`;

// 定义 Avatar 类，继承自 SuperComponent
let Avatar = class Avatar extends SuperComponent {
    constructor() {
        super(...arguments);
        // 配置项，启用多插槽支持
        this.options = {
            multipleSlots: true,
        };
        // 定义外部样式类
        this.externalClasses = [
            `${prefix}-class`,
            `${prefix}-class-image`,
            `${prefix}-class-icon`,
            `${prefix}-class-alt`,
            `${prefix}-class-content`,
        ];
        // 定义组件的属性
        this.properties = avatarProps;
        // 定义组件的内部数据
        this.data = {
            prefix, // 前缀
            classPrefix: name, // 类名前缀
            isShow: true, // 是否显示
            zIndex: 0, // 层级
            borderedWithGroup: false, // 是否与组关联
        };
        // 定义组件与其他组件的关系
        this.relations = {
            '../avatar-group/avatar-group': {
                type: 'ancestor', // 父组件关系
                linked(parent) {
                    var _a;
                    this.parent = parent; // 关联父组件
                    this.setData({
                        size: (_a = this.data.size) !== null && _a !== void 0 ? _a : parent.data.size, // 继承父组件的 size 属性
                        borderedWithGroup: true, // 设置为与组关联
                    });
                },
            },
        };
        // 定义属性的观察者
        this.observers = {
            icon(icon) {
                // 当 icon 属性变化时，设置图标数据
                const obj = setIcon('icon', icon, '');
                this.setData(Object.assign({}, obj));
            },
        };
        // 定义组件的方法
        this.methods = {
            // 隐藏组件
            hide() {
                this.setData({
                    isShow: false,
                });
            },
            // 更新层级
            updateCascading(zIndex) {
                this.setData({ zIndex });
            },
            // 处理图片加载错误
            onLoadError(e) {
                if (this.properties.hideOnLoadFailed) {
                    this.setData({
                        isShow: false,
                    });
                }
                // 触发 error 事件
                this.triggerEvent('error', e.detail);
            },
        };
    }
};

// 使用装饰器为 Avatar 类添加功能
Avatar = __decorate([
    wxComponent()
], Avatar);

// 导出 Avatar 组件
export default Avatar;
