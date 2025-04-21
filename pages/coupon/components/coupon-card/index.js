const statusMap = {
  default: { text: '去使用', theme: 'primary' }, // 可使用状态
  useless: { text: '已使用', theme: 'default' }, // 已使用状态
  disabled: { text: '已过期', theme: 'default' }, // 已过期状态
};
Component({
  options: {
    addGlobalClass: true, // 允许组件使用全局样式
    multipleSlots: true, // 启用多slot支持
  },

  externalClasses: ['coupon-class'], // 外部样式类

  properties: {
    couponDTO: {
      type: Object, // 优惠券数据对象
      value: {}, // 默认值为空对象
    },
  },

  data: {
    btnText: '', // 按钮文本
    btnTheme: '', // 按钮主题
  },

  observers: {
    // 监听 couponDTO 属性的变化
    couponDTO: function (couponDTO) {
      if (!couponDTO) {
        return;
      }
      // 根据优惠券状态设置按钮文本和主题
      const statusInfo = statusMap[couponDTO.status];

      this.setData({
        btnText: statusInfo.text,
        btnTheme: statusInfo.theme,
      });
    },
  },

  attached() {
    // 组件生命周期方法，组件实例进入页面节点树时触发
  },

  methods: {
    // 跳转到优惠券详情页
    gotoDetail() {
      wx.navigateTo({
        url: `/pages/coupon/coupon-detail/index?id=${this.data.couponDTO.key}`,
      });
    },

    // 跳转到优惠券关联的商品列表页
    gotoGoodsList() {
      wx.navigateTo({
        url: `/pages/coupon/coupon-activity-goods/index?id=${this.data.couponDTO.key}`,
      });
    },
  },
});
