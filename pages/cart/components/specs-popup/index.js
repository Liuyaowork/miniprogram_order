Component({
  options: {
    addGlobalClass: true, // 允许组件使用全局样式
    multipleSlots: true, // 启用多 slot 支持
  },

  properties: {
    goods: {
      type: Object,
      value: null,
      observer(goods) {
        // 监听 goods 属性的变化
        if (!goods) {
          return;
        }
        // 处理商品数据，移除 attr_value 属性
        this.setData({
          goodsWithoutAttrValue: {
            ...goods,
            sku: {
              ...goods.sku,
              attr_value: [], // 清空规格属性
            },
          },
        });
      },
    },
    show: {
      type: Boolean,
      value: false, // 控制弹窗显示状态
    },
    thumbMode: {
      type: String,
      value: 'aspectFit', // 缩略图显示模式
    },
  },

  data: {
    goodsWithoutAttrValue: null, // 存储处理后的商品数据
  },

  methods: {
    onClose() {
      // 触发关闭事件
      this.triggerEvent('close');
    },

    onCloseOver() {
      // 触发关闭完成事件
      this.triggerEvent('closeover');
    },
  },
});
