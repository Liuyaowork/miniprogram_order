/*
 * @Author: rileycai
 * @Date: 2022-03-14 21:18:07
 * @LastEditTime: 2022-03-22 21:17:16
 * @LastEditors: rileycai
 * @Description: 支付结果页面逻辑
 */

Page({
  data: {
    totalPaid: 0, // 支付总金额
    orderNo: '', // 订单号
    groupId: '', // 拼团ID
    groupon: null, // 拼团信息
    spu: null, // 商品信息
    adUrl: '', // 广告链接
  },

  onLoad(options) {
    // 页面加载时初始化数据
    const { totalPaid = 0, orderNo = '', groupId = '' } = options;
    this.setData({
      totalPaid,
      orderNo,
      groupId,
    });
  },

  onTapReturn(e) {
    // 处理返回按钮点击事件
    const target = e.currentTarget.dataset.type;
    const { orderNo } = this.data;
    if (target === 'home') {
      wx.switchTab({ url: '/pages/home/home' });
    } else if (target === 'orderList') {
      wx.navigateTo({
        url: `/pages/order/order-list/index?orderNo=${orderNo}`,
      });
    } else if (target === 'order') {
      wx.navigateTo({
        url: `/pages/order/order-detail/index?orderNo=${orderNo}`,
      });
    }
  },

  navBackHandle() {
    // 返回上一页
    wx.navigateBack();
  },
});
