import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter'; // 获取用户中心数据
import { getToPayOrderCount, getToSendOrderCount, getToReceiveOrderCount } from '../../services/order/order'; // 获取订单状态数量
import { ORDER_STATUS } from '../../services/order/order'; // 订单状态常量
import Toast from 'tdesign-miniprogram/toast/index'; // 引入 TDesign 的 Toast 组件

const menuData = [
  // 菜单数据
  [
    {
      title: '收货地址',
      tit: '', // 数量或其他信息
      url: '', // 跳转链接
      type: 'address', // 类型标识
    },
  ],
];

const orderTagInfos = [
  // 订单状态标签信息
  {
    title: '待付款',
    iconName: 'wallet', // 图标名称
    orderNum: 0, // 订单数量
    tabType: ORDER_STATUS.TO_PAY, // 对应的订单状态
    status: 1, // 状态标识
  },
  {
    title: '待发货',
    iconName: 'deliver',
    orderNum: 0,
    tabType: ORDER_STATUS.TO_SEND,
    status: 1,
  },
  {
    title: '待收货',
    iconName: 'package',
    orderNum: 0,
    tabType: ORDER_STATUS.TO_RECEIVE,
    status: 1,
  },
  {
    title: '待评价',
    iconName: 'comment',
    orderNum: 0,
    tabType: ORDER_STATUS.FINISHED,
    status: 1,
  },
  {
    title: '退款/售后',
    iconName: 'exchang',
    orderNum: 0,
    tabType: 0,
    status: 1,
  },
];

const getDefaultData = () => ({
  // 默认数据
  showMakePhone: false, // 是否显示拨打电话弹窗
  userInfo: {
    avatarUrl: '', // 用户头像
    nickName: '正在登录...', // 用户昵称
    phoneNumber: '', // 用户手机号
  },
  menuData,
  orderTagInfos,
  customerServiceInfo: {}, // 客服信息
  currAuthStep: 1, // 当前认证步骤
  showKefu: true, // 是否显示客服
  versionNo: '', // 版本号
  toPayOrderCount: 0, // 待付款订单数量
  toSendOrderCount: 0, // 待发货订单数量
  toReceiveOrderCount: 0, // 待收货订单数量
});

Page({
  data: getDefaultData(),

  onLoad() {
    // 页面加载时获取版本信息
    this.getVersionInfo();
  },

  onShow() {
    // 页面显示时初始化数据
    this.getTabBar().init(); // 初始化自定义 tabBar
    this.init();
  },

  onPullDownRefresh() {
    // 下拉刷新时重新初始化数据
    this.init();
  },

  init() {
    // 初始化用户信息和订单数量
    this.fetUseriInfoHandle();
    this.initOrderCount();
  },

  async initOrderCount() {
    // 初始化订单数量
    const [pay, send, receive] = await Promise.all([
      getToPayOrderCount(), // 获取待付款订单数量
      getToSendOrderCount(), // 获取待发货订单数量
      getToReceiveOrderCount(), // 获取待收货订单数量
    ]);
    this.setData({
      'orderTagInfos[0].orderNum': pay,
      'orderTagInfos[1].orderNum': send,
      'orderTagInfos[2].orderNum': receive,
    });
  },

  fetUseriInfoHandle() {
    // 获取用户信息
    fetchUserCenter().then(({ userInfo, countsData, customerServiceInfo }) => {
      menuData?.[0].forEach((v) => {
        countsData.forEach((counts) => {
          if (counts.type === v.type) {
            v.tit = counts.num; // 更新菜单数量
          }
        });
      });
      this.setData({
        userInfo,
        menuData,
        customerServiceInfo,
        currAuthStep: 2, // 更新认证步骤
      });
      wx.stopPullDownRefresh(); // 停止下拉刷新动画
    });
  },

  onClickCell({ currentTarget }) {
    // 菜单点击事件处理
    const { type } = currentTarget.dataset;

    switch (type) {
      case 'address': {
        wx.navigateTo({ url: '/pages/usercenter/address/list/index' }); // 跳转到收货地址页面
        break;
      }
      case 'service': {
        this.openMakePhone(); // 打开拨打电话弹窗
        break;
      }
      case 'help-center': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了帮助中心',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'point': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了积分菜单',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'coupon': {
        wx.navigateTo({ url: '/pages/coupon/coupon-list/index' }); // 跳转到优惠券页面
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },

  jumpNav(e) {
    // 跳转到订单列表或售后列表
    const status = e.detail.tabType;

    if (status === 0) {
      wx.navigateTo({ url: '/pages/order/after-service-list/index' });
    } else {
      wx.navigateTo({ url: `/pages/order/order-list/index?status=${status}` });
    }
  },

  jumpAllOrder() {
    // 跳转到全部订单页面
    wx.navigateTo({ url: '/pages/order/order-list/index' });
  },

  openMakePhone() {
    // 打开拨打电话弹窗
    this.setData({ showMakePhone: true });
  },

  closeMakePhone() {
    // 关闭拨打电话弹窗
    this.setData({ showMakePhone: false });
  },

  call() {
    // 拨打客服电话
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone,
    });
  },

  gotoUserEditPage() {
    // 跳转到用户信息编辑页面
    const { currAuthStep } = this.data;
    if (currAuthStep === 2) {
      wx.navigateTo({ url: '/pages/usercenter/person-info/index' });
    } else {
      this.fetUseriInfoHandle();
    }
  },

  getVersionInfo() {
    // 获取小程序版本信息
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});
