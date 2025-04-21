Component({
  externalClasses: ['wr-class'], // 支持外部样式类

  properties: {
    phoneNumber: String, // 客服电话号码
    desc: String, // 描述信息
  },

  data: {
    show: false, // 控制弹窗显示状态
  },

  methods: {
    // 点击按钮时显示弹窗
    onBtnTap() {
      this.setData({
        show: true,
      });
    },

    // 关闭弹窗
    onDialogClose() {
      this.setData({
        show: false,
      });
    },

    // 拨打客服电话
    onCall() {
      const { phoneNumber } = this.properties;
      wx.makePhoneCall({
        phoneNumber, // 使用传入的电话号码拨打电话
      });
    },

    // 点击在线客服按钮时的处理逻辑
    onCallOnlineService() {
      wx.showToast({
        title: '你点击了在线客服', // 显示提示信息
      });
    },
  },
});
