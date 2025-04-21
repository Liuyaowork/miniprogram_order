var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { chunk } from '../common/utils';
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import { ActionSheetTheme, show } from './show';
import props from './props';
import useCustomNavbar from '../mixins/using-custom-navbar';
const { prefix } = config;
const name = `${prefix}-action-sheet`;
let ActionSheet = class ActionSheet extends SuperComponent {
    constructor() {
        super(...arguments);
        this.behaviors = [useCustomNavbar];
        this.externalClasses = [`${prefix}-class`, `${prefix}-class-content`, `${prefix}-class-cancel`];
        this.properties = Object.assign({}, props);
        this.data = {
            prefix,
            classPrefix: name,
            gridThemeItems: [],
            currentSwiperIndex: 0,
            defaultPopUpProps: {},
            defaultPopUpzIndex: 11500,
        };
        this.controlledProps = [
            {
                key: 'visible',
                event: 'visible-change',
            },
        ];
        this.methods = {
            onSwiperChange(e) {
                const { detail: { current }, } = e;
                // 更新当前滑块索引
                this.setData({
                    currentSwiperIndex: current,
                });
            },
            splitGridThemeActions() {
                // 如果主题不是网格模式，则直接返回
                if (this.data.theme !== ActionSheetTheme.Grid)
                    return;
                // 将 items 按照 count 分组，用于网格模式显示
                this.setData({
                    gridThemeItems: chunk(this.data.items, this.data.count),
                });
            },
            show(options) {
                // 显示 ActionSheet，并合并传入的选项
                this.setData(Object.assign(Object.assign(Object.assign({}, this.initialData), options), { visible: true }));
                this.splitGridThemeActions(); // 分割网格模式的操作项
                this.autoClose = true; // 自动关闭标志
                this._trigger('visible-change', { visible: true }); // 触发 visible-change 事件
            },
            memoInitialData() {
                // 记录初始数据，用于重置
                this.initialData = Object.assign(Object.assign({}, this.properties), this.data);
            },
            close() {
                // 关闭 ActionSheet
                this.triggerEvent('close', { trigger: 'command' }); // 触发 close 事件
                this._trigger('visible-change', { visible: false }); // 触发 visible-change 事件
            },
            onPopupVisibleChange({ detail }) {
                // 监听弹窗可见性变化
                if (!detail.visible) {
                    this.triggerEvent('close', { trigger: 'overlay' }); // 触发 close 事件
                    this._trigger('visible-change', { visible: false }); // 触发 visible-change 事件
                }
                if (this.autoClose) {
                    this.setData({ visible: false }); // 设置为不可见
                    this.autoClose = false; // 重置自动关闭标志
                }
            },
            onSelect(event) {
                // 处理选项选择事件
                const { currentSwiperIndex, items, gridThemeItems, count, theme } = this.data;
                const { index } = event.currentTarget.dataset;
                const isSwiperMode = theme === ActionSheetTheme.Grid; // 判断是否为网格模式
                const item = isSwiperMode ? gridThemeItems[currentSwiperIndex][index] : items[index];
                const realIndex = isSwiperMode ? index + currentSwiperIndex * count : index; // 计算真实索引
                if (item) {
                    this.triggerEvent('selected', { selected: item, index: realIndex }); // 触发 selected 事件
                    if (!item.disabled) {
                        this.triggerEvent('close', { trigger: 'select' }); // 触发 close 事件
                        this._trigger('visible-change', { visible: false }); // 触发 visible-change 事件
                    }
                }
            },
            onCancel() {
                // 处理取消事件
                this.triggerEvent('cancel'); // 触发 cancel 事件
                if (this.autoClose) {
                    this.setData({ visible: false }); // 设置为不可见
                    this.autoClose = false; // 重置自动关闭标志
                }
            },
        };
    }
    ready() {
        this.memoInitialData();
        this.splitGridThemeActions();
    }
};
ActionSheet.show = show;
ActionSheet = __decorate([
    wxComponent()
], ActionSheet);
export default ActionSheet;
