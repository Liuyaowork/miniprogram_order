const AuthStepType = {
  ONE: 1, // 授权步骤 1
  TWO: 2, // 授权步骤 2
  THREE: 3, // 授权步骤 3
};

Component({
  options: {
    multipleSlots: true, // 启用多 slot 支持
  },
  properties: {
    currAuthStep: {
      type: Number,
      value: AuthStepType.ONE, // 当前授权步骤，默认为步骤 1
    },
    userInfo: {
      type: Object,
      value: {}, // 用户信息
    },
    isNeedGetUserInfo: {
      type: Boolean,
      value: false, // 是否需要获取用户信息
    },
  },
  data: {
    defaultAvatarUrl:
      'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png', // 默认头像 URL
    AuthStepType, // 授权步骤类型
  },
  methods: {
    gotoUserEditPage() {
      // 跳转到用户编辑页面
      this.triggerEvent('gotoUserEditPage');
    },
  },
});
