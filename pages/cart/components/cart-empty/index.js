Component({
  properties: {
    imgUrl: {
      type: String,
      value:
        'https://cdn-we-retail.ym.tencent.com/miniapp/template/empty-cart.png', // 默认空购物车图片地址
    },
    tip: {
      type: String,
      value: '购物车是空的', // 默认提示文字
    },
    btnText: {
      type: String,
      value: '去首页', // 默认按钮文字
    },
  },
  data: {},
  methods: {
    handleClick() {
      // 触发父组件事件，处理按钮点击
      this.triggerEvent('handleClick');
    },
  },
});
