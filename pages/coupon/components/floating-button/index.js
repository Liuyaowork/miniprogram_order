Component({
  data: { 
    icon: 'cart', // 浮动按钮的图标，默认为购物车图标
  },

  properties: {
    count: {
      type: Number, // 购物车商品数量
    },
  },

  methods: {
    goToCart() {
      // 跳转到购物车页面
      wx.switchTab({
        url: '/pages/cart/index',
      });
    },
  },
});
