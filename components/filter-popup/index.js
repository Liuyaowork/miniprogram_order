Component({
  externalClasses: ['wr-class'], // 外部样式类

  options: {
    multipleSlots: true, // 启用多插槽支持
  },

  properties: {
    show: {
      type: Boolean,
      observer(show) {
        // 当 show 属性变化时，更新 visible 数据
        this.setData({ visible: show });
      },
    },
    closeBtn: {
      type: Boolean,
      value: false, // 是否显示关闭按钮，默认为 false
    },
  },

  data: { 
    visible: false, // 控制弹窗显示状态
  },

  methods: {
    // 重置筛选条件
    reset() {
      // 触发 reset 事件，通知父组件执行重置操作
      this.triggerEvent('reset');
    },
    // 确认筛选条件
    confirm() {
      // 触发 confirm 事件，通知父组件执行确认操作
      this.triggerEvent('confirm');
    },
    // 关闭筛选弹窗
    close() {
      // 触发 showFilterPopupClose 事件，通知父组件弹窗已关闭
      this.triggerEvent('showFilterPopupClose');
      // 更新 visible 数据为 false，隐藏弹窗
      this.setData({ visible: false });
    },
  },
});
