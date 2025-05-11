Component({
  options: {
    addGlobalClass: true, // 允许组件使用全局样式
    multipleSlots: true, // 启用多 slot 支持
  },
  properties: {
    address: {
      type: Object,
      value: {}, // 地址数据
    },
    customIcon: {
      type: String,
      value: 'edit-1', // 自定义图标名称
    },
    extraSpace: {
      type: Boolean,
      value: true, // 是否显示额外的间距
    },
    isDrawLine: {
      type: Boolean,
      value: true, // 是否显示分割线
    },
  },
  externalClasses: [
    'item-wrapper-class', // 外部样式类：地址项容器
    'title-class', // 外部样式类：标题
    'default-tag-class', // 外部样式类：默认标签
    'normal-tag-class', // 外部样式类：普通标签
    'address-info-class', // 外部样式类：地址信息
    'delete-class', // 外部样式类：删除按钮
  ],
  methods: {
    onDelete(e) {
      // 删除地址事件
      const { item } = e.currentTarget.dataset;
      this.triggerEvent('onDelete', item);
    },
    onSelect(e) {
      // 选择地址事件
      const { item } = e.currentTarget.dataset;
      this.triggerEvent('onSelect', item);
    },
    onEdit(e) {
      // 编辑地址事件
      const { item } = e.currentTarget.dataset;
      this.triggerEvent('onEdit', item);
    },
  },
});
