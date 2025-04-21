const props = {
    // 外部样式类
    externalClasses: {
        type: Array,
    },
    // 控制组件显示的滚动高度阈值
    visibilityHeight: {
        type: Number,
        value: 200,
    },
    // 当前滚动高度
    scrollTop: {
        type: Number,
        value: 0,
    },
    // 是否固定定位
    fixed: {
        type: Boolean,
        value: true,
    },
    // 自定义图标
    icon: {
        type: null,
        value: true,
    },
    // 按钮上的文字
    text: {
        type: String,
        value: '',
    },
    // 组件的主题样式，可选值为 'round', 'square'
    theme: {
        type: String,
        value: 'round',
    },
};
export default props;
