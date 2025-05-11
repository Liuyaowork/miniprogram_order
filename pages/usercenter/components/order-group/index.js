Component({
  externalClasses: ['title-class', 'icon-class', 'number-class'], // 支持外部样式类
  options: {
    multipleSlots: true, // 启用多 slot 支持
  },
  properties: {
    orderTagInfos: {
      type: Array,
      value: [], // 订单标签信息数组
    },
    title: {
      type: String,
      value: '我的订单', // 分组标题
    },
    desc: {
      type: String,
      value: '全部订单', // 分组描述
    },
    isTop: {
      type: Boolean,
      value: true, // 是否显示顶部标题
    },
    classPrefix: {
      type: String,
      value: 'wr', // 图标类名前缀
    },
  },
  methods: {
    onClickItem(e) {
      // 点击订单分组项触发事件
      this.triggerEvent('onClickItem', e.currentTarget.dataset.item);
    },

    onClickTop() {
      // 点击顶部标题触发事件
      this.triggerEvent('onClickTop', {});
    },
  },
});
