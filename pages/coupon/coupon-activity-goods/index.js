import { fetchCouponDetail } from '../../../services/coupon/index';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    goods: [], // 商品列表
    detail: {}, // 优惠券详情
    couponTypeDesc: '', // 优惠券类型描述
    showStoreInfoList: false, // 是否显示门店信息列表
    cartNum: 2, // 购物车商品数量
  },

  id: '', // 当前优惠券 ID

  onLoad(query) {
    // 页面加载时获取优惠券 ID，并调用相关方法获取数据
    const id = parseInt(query.id);
    this.id = id;

    this.getCouponDetail(id); // 获取优惠券详情
    this.getGoodsList(id); // 获取商品列表
  },

  getCouponDetail(id) {
    // 调用服务获取优惠券详情
    fetchCouponDetail(id).then(({ detail }) => {
      this.setData({ detail });
      // 根据优惠券类型生成描述信息
      if (detail.type === 2) {
        // 折扣券
        if (detail.base > 0) {
          this.setData({
            couponTypeDesc: `满${detail.base / 100}元${detail.value}折`,
          });
        } else {
          this.setData({ couponTypeDesc: `${detail.value}折` });
        }
      } else if (detail.type === 1) {
        // 满减券
        if (detail.base > 0) {
          this.setData({
            couponTypeDesc: `满${detail.base / 100}元减${detail.value / 100}元`,
          });
        } else {
          this.setData({ couponTypeDesc: `减${detail.value / 100}元` });
        }
      }
    });
  },

  getGoodsList() {
    // 获取商品列表（未实现）
    throw new Error('unimplemented');
  },

  openStoreList() {
    // 打开门店信息列表
    this.setData({
      showStoreInfoList: true,
    });
  },

  closeStoreList() {
    // 关闭门店信息列表
    this.setData({
      showStoreInfoList: false,
    });
  },

  goodClickHandle(e) {
    // 商品点击事件处理，跳转到商品详情页面
    const { index } = e.detail;
    const { spuId } = this.data.goods[index];
    wx.navigateTo({ url: `/pages/goods/details/index?spuId=${spuId}` });
  },

  cartClickHandle() {
    // 购物车点击事件处理，显示提示信息
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加入购物车',
    });
  },
});
