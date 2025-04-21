const props = {
    // 对齐方式，可选值为 'left' | 'center' | 'right'
    align: {
        type: String,
        value: 'center', // 默认居中对齐
    },
    // 取消按钮的文本
    cancelText: {
        type: String,
        value: '取消', // 默认显示“取消”
    },
    // 最大显示的项目数
    count: {
        type: Number,
        value: 8, // 默认最多显示 8 项
    },
    // 描述文本
    description: {
        type: String,
        value: '', // 默认无描述
    },
    // 操作项列表
    items: {
        type: Array, // 必须是数组
    },
    // 弹出层的属性
    popupProps: {
        type: Object,
        value: {}, // 默认空对象
    },
    // 是否显示取消按钮
    showCancel: {
        type: Boolean,
        value: true, // 默认显示取消按钮
    },
    // 是否显示遮罩层
    showOverlay: {
        type: Boolean,
        value: true, // 默认显示遮罩层
    },
    // 主题类型，可选值为 'list' | 'grid'
    theme: {
        type: String,
        value: 'list', // 默认列表主题
    },
    // 是否显示操作面板（受控属性）
    visible: {
        type: Boolean,
        value: null, // 默认值为 null
    },
    // 是否默认显示操作面板（非受控属性）
    defaultVisible: {
        type: Boolean,
        value: false, // 默认不显示
    },
};
export default props;
