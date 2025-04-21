Component({
  externalClasses: ['wr-class', 'wr-class--no-more'], // 外部样式类

  options: { multipleSlots: true }, // 启用多插槽支持

  properties: {
    status: {
      type: Number,
      value: 0, // 加载状态：0-加载中，1-没有更多，2-加载完成，3-加载失败
    },
    loadingText: {
      type: String,
      value: '加载中...', // 加载中状态的提示文本
    },
    noMoreText: {
      type: String,
      value: '没有更多了', // 没有更多数据时的提示文本
    },
    failedText: {
      type: String,
      value: '加载失败，点击重试', // 加载失败时的提示文本
    },
    color: {
      type: String,
      value: '#BBBBBB', // 默认文本颜色
    },
    failedColor: {
      type: String,
      value: '#FA550F', // 加载失败时的文本颜色
    },
    size: {
      type: null,
      value: '40rpx', // 图标或文本的大小
    },
    loadingBackgroundColor: {
      type: String,
      value: '#F5F5F5', // 加载中状态的背景颜色
    },
    listIsEmpty: {
      type: Boolean,
      value: false, // 列表是否为空
    },
  },

  methods: {
    /** 点击处理 */
    tapHandle() {
      // 如果加载失败，触发 retry 事件通知父组件重试加载
      if (this.data.status === 3) {
        this.triggerEvent('retry');
      }
    },
  },
});
