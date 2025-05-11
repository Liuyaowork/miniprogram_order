Page({
  data: {
    nameValue: '', // 输入框中的姓名值
  },
  onLoad(options) {
    // 页面加载时获取传递的姓名参数
    const { name } = options;
    this.setData({
      nameValue: name, // 设置初始姓名值
    });
  },
  onSubmit() {
    // 提交按钮点击事件，返回上一页并触发刷新
    wx.navigateBack({ backRefresh: true });
  },
  clearContent() {
    // 清空输入框内容
    this.setData({
      nameValue: '',
    });
  },
});
