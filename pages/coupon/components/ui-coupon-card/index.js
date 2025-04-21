Component({
  options: {
    addGlobalClass: true, // 允许组件使用全局样式
    multipleSlots: true, // 启用多slot支持
  },

  externalClasses: ['coupon-class'], // 外部样式类

  properties: {
    mask: {
      type: Boolean,
      value: false, // 是否添加遮罩
    },
    superposable: {
      type: Boolean,
      value: false, // 是否可叠加
    },
    type: {
      type: String,
      value: '', // 优惠券类型
    },
    value: {
      type: String,
      value: '', // 优惠金额
    },
    tag: {
      type: String,
      value: '', // 优惠标签，优惠券名字标签
    },
    desc: {
      type: String,
      value: '', // 优惠金额描述
    },
    title: {
      type: String,
      value: '', // 优惠券名称
    },
    timeLimit: {
      type: String,
      value: '', // 优惠券时限
    },
    ruleDesc: {
      type: String,
      value: '', // 优惠券适用规则描述
    },
    currency: {
      type: String,
      value: '¥', // 优惠货币符号
    },
    status: {
      type: String,
      value: 'default', // 优惠券状态
    },
    image: {
      type: String,
      value: '', // 优惠券图片
    },
  },

  data: {
    CouponType: {
      MJ_COUPON: 1, // 满减券
      ZK_COUPON: 2, // 折扣券
      MJF_COUPON: 3, // 满减返券
      GIFT_COUPON: 4, // 礼品券
    },
    theme: 'primary', // 默认主题
  },

  observers: {
    // 监听 status 属性的变化，根据状态设置主题
    status: function (value) {
      let theme = 'primary';
      // 已过期或已使用的券设置为弱主题
      if (value === 'useless' || value === 'disabled') {
        theme = 'weak';
      }

      this.setData({ theme });
    },
  },

  attached() {
    // 组件生命周期方法，设置颜色样式
    this.setData({
      color: `color${this.properties.colorStyle}`,
    });
  },
});
