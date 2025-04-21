import { fetchCouponList } from '../../../services/coupon/index';

Page({
  data: {
    status: 0, // 当前选中的优惠券状态
    list: [
      {
        text: '可使用', // 可使用优惠券
        key: 0,
      },
      {
        text: '已使用', // 已使用优惠券
        key: 1,
      },
      {
        text: '已失效', // 已失效优惠券
        key: 2,
      },
    ],

    couponList: [], // 当前状态下的优惠券列表
  },

  onLoad() {
    // 页面加载时初始化数据
    this.init();
  },

  init() {
    // 初始化方法，调用获取优惠券列表
    this.fetchList();
  },

  fetchList(status = this.data.status) {
    // 根据状态获取对应的优惠券列表
    let statusInFetch = '';
    switch (Number(status)) {
      case 0: {
        statusInFetch = 'default'; // 可使用
        break;
      }
      case 1: {
        statusInFetch = 'useless'; // 已使用
        break;
      }
      case 2: {
        statusInFetch = 'disabled'; // 已失效
        break;
      }
      default: {
        // 未知状态处理
        throw new Error(`unknown fetchStatus: ${statusInFetch}`);
      }
    }
    // 调用服务获取优惠券列表
    fetchCouponList(statusInFetch).then((couponList) => {
      this.setData({ couponList }); // 更新优惠券列表数据
    });
  },

  tabChange(e) {
    // 切换标签页时更新状态并重新获取数据
    const { value } = e.detail;

    this.setData({ status: value });
    this.fetchList(value);
  },

  goCouponCenterHandle() {
    // 跳转到领券中心的提示
    wx.showToast({ title: '去领券中心', icon: 'none' });
  },

  onPullDownRefresh_() {
    // 下拉刷新时清空列表并重新获取数据
    this.setData(
      {
        couponList: [],
      },
      () => {
        this.fetchList();
      },
    );
  },
});
