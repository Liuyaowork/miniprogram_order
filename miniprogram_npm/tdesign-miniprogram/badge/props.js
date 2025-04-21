const props = {
    // 徽标的背景颜色
    color: {
        type: String,
        value: '',
    },
    // 自定义内容
    content: {
        type: String,
        value: '',
    },
    // 徽标显示的数字
    count: {
        type: null,
        value: 0,
    },
    // 是否为点状徽标
    dot: {
        type: Boolean,
        value: false,
    },
    // 外部样式类
    externalClasses: {
        type: Array,
    },
    // 最大显示的数字，超过时显示为 maxCount+
    maxCount: {
        type: Number,
        value: 99,
    },
    // 徽标的偏移位置，格式为 [水平偏移, 垂直偏移]
    offset: {
        type: Array,
    },
    // 徽标的形状，可选值为 'circle', 'square', 'ribbon'
    shape: {
        type: String,
        value: 'circle',
    },
    // 是否显示数字为 0 的徽标
    showZero: {
        type: Boolean,
        value: false,
    },
    // 徽标的尺寸，可选值为 'small', 'medium', 'large'
    size: {
        type: String,
        value: 'medium',
    },
};
export default props;
