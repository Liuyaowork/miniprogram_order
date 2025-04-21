Component({
  options: {
    addGlobalClass: true, // 允许全局样式影响组件
    multipleSlots: true, // 启用多插槽支持
  },

  relations: {
    '../order-card/index': {
      type: 'ancestor', // 定义父子关系，当前组件为子组件
      linked(target) {
        this.parent = target; // 关联父组件
      },
    },
  },

  properties: {
    goods: Object, // 商品数据对象
    thumbWidth: Number, // 缩略图宽度
    thumbHeight: Number, // 缩略图高度
    thumbWidthInPopup: Number, // 弹窗中的缩略图宽度
    thumbHeightInPopup: Number, // 弹窗中的缩略图高度
    noTopLine: Boolean, // 是否隐藏顶部线条
    step: Boolean, // 是否显示步进器
    stepDisabled: Boolean, // 步进器是否禁用
  },

  data: {
    goods: {}, // 商品数据
    hidden: false, // 是否隐藏组件
  },

  methods: {
    // 设置组件的隐藏状态
    setHidden(hidden) {
      if (this.data.hidden === hidden) return; // 如果状态未改变，则不更新
      this.setData({ hidden }); // 更新隐藏状态
    },

    // 商品数量变化事件
    onNumChange(e) {
      const { value } = e.detail; // 获取变化后的数量
      this.triggerEvent('num-change', { value }); // 触发 num-change 事件
    },
  },
});
