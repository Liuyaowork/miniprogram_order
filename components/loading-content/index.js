Component({
  externalClasses: ['wr-class'], // 外部样式类

  properties: {
    position: {
      type: String,
      value: 'static', // 加载内容的位置，默认值为 static
    },
    noMask: Boolean, // 是否隐藏遮罩层
    type: {
      type: String,
      value: 'circular', // 加载动画的类型，默认值为 circular
    },
    vertical: Boolean, // 是否垂直排列内容
    size: {
      type: String,
      value: '50rpx', // 加载动画的大小
    },
    backgroundColor: {
      type: String,
      value: 'rgba(0, 0, 0, .6)', // 背景颜色，默认值为半透明黑色
    },
  },
});
