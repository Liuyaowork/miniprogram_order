import { fetchCouponDetail } from '../../../services/coupon/index';

Page({
  data: {
    detail: null, // 优惠券详情
    storeInfoList: [], // 门店信息列表
    storeInfoStr: '', // 门店信息字符串
    showStoreInfoList: false, // 是否显示门店信息列表
  },

  id: '', // 当前优惠券 ID

  onLoad(query) {
    // 页面加载时获取优惠券 ID，并调用相关方法获取数据
    const id = parseInt(query.id);
    this.id = id;
    this.getGoodsList(id); // 获取优惠券详情
  },

  getGoodsList(id) {
    // 调用服务获取优惠券详情
    fetchCouponDetail(id).then(({ detail }) => {
      this.setData({
        detail, // 设置优惠券详情数据
      });
    });
  },

  navGoodListHandle() {
    // 跳转到优惠券关联的商品列表页面
    wx.navigateTo({
      url: `/pages/coupon/coupon-activity-goods/index?id=${this.id}`,
    });
  },
});
