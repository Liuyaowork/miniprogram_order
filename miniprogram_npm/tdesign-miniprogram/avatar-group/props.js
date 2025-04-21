const props = {
    // 头像的层叠方向，可选值为 'left-up' 或 'right-up'
    cascading: {
        type: String,
        value: 'left-up',
    },
    // 折叠头像的内容
    collapseAvatar: {
        type: String,
    },
    // 外部样式类
    externalClasses: {
        type: Array,
    },
    // 最大显示的头像数量
    max: {
        type: Number,
    },
    // 头像组的尺寸，可选值为 'small', 'medium', 'large'
    size: {
        type: String,
        value: 'medium',
    },
};
export default props;
