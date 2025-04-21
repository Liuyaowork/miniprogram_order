var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import { getRect, uniqueFactory } from '../common/utils';
const { prefix } = config;
const name = `${prefix}-badge`;
const getUniqueID = uniqueFactory('badge');

let Badge = class Badge extends SuperComponent {
    constructor() {
        super(...arguments);
        // 启用多插槽支持
        this.options = {
            multipleSlots: true,
        };
        // 定义外部样式类
        this.externalClasses = [`${prefix}-class`, `${prefix}-class-count`, `${prefix}-class-content`];
        // 定义组件的属性
        this.properties = props;
        // 定义组件的内部数据
        this.data = {
            prefix,
            classPrefix: name,
            value: '', // 徽标的值
            labelID: '', // 唯一标识的标签 ID
            descriptionID: '', // 唯一标识的描述 ID
            ribbonStyle: '', // 丝带样式
            ribbonOuterStyle: '', // 丝带外部样式
        };
        // 生命周期方法
        this.lifetimes = {
            ready() {
                // 生成唯一 ID
                const uniqueID = getUniqueID();
                // 如果形状为丝带，计算丝带样式
                if (this.properties.shape === 'ribbon') {
                    getRect(this, `.${prefix}-badge--ribbon`).then((rect) => {
                        const outerBoundingRect = rect.width / Math.SQRT2 + rect.height * Math.SQRT2;
                        const translateX = rect.width - rect.width / Math.SQRT2 + outerBoundingRect - rect.width;
                        const ribbonHeightHypotenuse = rect.height * Math.SQRT2;
                        const ribbonWidthCatheti = rect.width / Math.SQRT2;
                        this.setData({
                            ribbonStyle: `transform: translateX(${translateX}px) rotate(45deg);`,
                            ribbonOuterStyle: `width: ${outerBoundingRect}px; height: ${outerBoundingRect}px;
              clip-path: polygon(0 0, ${ribbonHeightHypotenuse}px 0,
              ${outerBoundingRect}px ${ribbonWidthCatheti}px,
              ${outerBoundingRect}px ${ribbonWidthCatheti + ribbonHeightHypotenuse}px);`,
                        });
                    });
                }
                // 设置唯一标识的标签和描述 ID
                this.setData({
                    labelID: `${uniqueID}_label`,
                    descriptionID: `${uniqueID}_description`,
                });
            },
        };
    }
};
Badge = __decorate([
    wxComponent()
], Badge);

export default Badge;
