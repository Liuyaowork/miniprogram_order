const props = {
    // 图片的替代文本
    alt: {
        type: String,
        value: '',
    },
    // 徽标的属性配置
    badgeProps: {
        type: Object,
    },
    // 是否显示边框
    bordered: {
        type: Boolean,
        value: false,
    },
    // 外部样式类
    externalClasses: {
        type: Array,
    },
    // 加载失败时是否隐藏图片
    hideOnLoadFailed: {
        type: Boolean,
        value: false,
    },
    // 自定义图标
    icon: {
        type: null,
    },
    // 图片地址
    image: {
        type: String,
        value: '',
    },
    // 图片的其他属性
    imageProps: {
        type: Object,
    },
    // 头像的形状，可选值为 'circle' 或 'square'
    shape: {
        type: String,
        value: 'circle',
    },
    // 头像的尺寸，可选值为 'small', 'medium', 'large'
    size: {
        type: String,
        value: 'medium',
    },
};
export default props;
