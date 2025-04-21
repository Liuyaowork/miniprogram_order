import Toast from 'tdesign-miniprogram/toast/index';
import dayjs from 'dayjs';
import { orderListShouldFresh } from '../../../utils/orderListFresh';
import { OrderStatus } from '../config';
import { getAllOrderItemsOfAnOrder } from '../../../services/order/orderItem';
import { getOrder, orderStatusToName, ORDER_STATUS, updateOrderDeliveryInfo } from '../../../services/order/order';
import { fetchBusinessTime } from '../../../services/order/orderDetail';
import { getAddressPromise } from '../../usercenter/address/list/util';
import { OPERATION_TYPE } from '../../../utils/orderOperation';

Page({
  data: {
    pageLoading: true, // 页面加载状态
    order: {}, // 后台返回的原始订单数据
    _order: {}, // 内部使用的订单数据
    storeDetail: {}, // 店铺详情
    countDownTime: null, // 倒计时时间
    addressEditable: false, // 地址是否可编辑
    backRefresh: false, // 是否需要刷新
    formatCreateTime: '', // 格式化后的订单创建时间
    logisticsNodes: [], // 物流节点信息
    orderHasCommented: true, // 订单是否已评价
  },

  toast(message) {
    // 显示提示信息
    Toast({
      context: this,
      selector: '#t-toast',
      message,
    });
  },

  onLoad({ orderId }) {
    // 页面加载时初始化数据
    if (orderId == null) {
      toast('异常订单号');
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    }
    this.orderId = orderId;
    this.init();
    this.navbar = this.selectComponent('#navbar');
    this.pullDownRefresh = this.selectComponent('#wr-pull-down-refresh');
  },

  onShow() {
    // 页面显示时刷新数据
    if (!this.data.backRefresh) return;
    this.onRefresh();
    this.setData({ backRefresh: false });
  },

  onPageScroll(e) {
    // 处理页面滚动事件
    this.pullDownRefresh && this.pullDownRefresh.onPageScroll(e);
  },

  onImgError(e) {
    // 图片加载错误处理
    if (e.detail) {
      console.error('img 加载失败');
    }
  },

  init() {
    // 页面初始化
    this.setData({ pageLoading: true });
    this.getStoreDetail();
    this.getDetail()
      .then(() => {
        this.setData({ pageLoading: false });
      })
      .catch((e) => {
        console.error(e);
      });
  },

  onRefresh() {
    // 页面刷新
    this.init();
    const pages = getCurrentPages();
    const lastPage = pages[pages.length - 2];
    if (lastPage) {
      lastPage.data.backRefresh = true;
    }
  },

  onPullDownRefresh_(e) {
    // 下拉刷新
    const { callback } = e.detail;
    return this.getDetail().then(() => callback && callback());
  },

  async getDetail() {
    // 获取订单详情
    const orderId = this.orderId;
    const [order, orderItems] = await Promise.all([getOrder(orderId), getAllOrderItemsOfAnOrder({ orderId })]);
    order.orderItems = orderItems;
    order.totalPrice = orderItems.reduce((acc, cur) => acc + cur.count * cur.sku.price, 0);
    order.statusDesc = orderStatusToName(order.status);
    order.isPaid = order.status !== ORDER_STATUS.TO_PAY;
    order.createdTimeString = dayjs(new Date(order.createdAt)).format('YYYY-MM-DD HH:mm:ss');

    this.setData({ order, addressEditable: order.statusDesc === '待付款' });
  },

  datermineInvoiceStatus(order) {
    // 确定发票状态
    return order.invoiceStatus;
  },

  composeAddress(order) {
    // 拼接收货地址
    return [
      order.logisticsVO.receiverCity,
      order.logisticsVO.receiverCountry,
      order.logisticsVO.receiverArea,
      order.logisticsVO.receiverAddress,
    ]
      .filter((s) => !!s)
      .join(' ');
  },

  getStoreDetail() {
    // 获取店铺详情
    fetchBusinessTime().then((res) => {
      const storeDetail = {
        storeTel: res.data.telphone,
        storeBusiness: res.data.businessTime.join('\n'),
      };
      this.setData({ storeDetail });
    });
  },

  computeCountDownTime(order) {
    // 计算倒计时时间
    if (order.orderStatus !== OrderStatus.PENDING_PAYMENT) return null;
    return order.autoCancelTime > 1577808000000 ? order.autoCancelTime - Date.now() : order.autoCancelTime;
  },

  onCountDownFinish() {
    // 倒计时结束处理
    const { countDownTime, order } = this.data;
    if (countDownTime > 0 || (order && order.groupInfoVo && order.groupInfoVo.residueTime > 0)) {
      this.onRefresh();
    }
  },

  onGoodsCardTap(e) {
    // 跳转到商品详情页面
    const { index } = e.currentTarget.dataset;
    const goods = this.data.order.orderItemVOs[index];
    wx.navigateTo({ url: `/pages/goods/details/index?spuId=${goods.spuId}` });
  },

  async onEditAddressTap() {
    // 编辑收货地址
    const deliveryInfoPromise = getAddressPromise();
    wx.navigateTo({
      url: `/pages/usercenter/address/list/index?selectMode=true`,
    });
    try {
      const deliveryInfo = await deliveryInfoPromise;
      try {
        await updateOrderDeliveryInfo({ orderId: this.data.order._id, deliveryInfoId: deliveryInfo._id });
        this.setData({
          'order.delivery_info._id': deliveryInfo._id,
          'order.delivery_info.phone': deliveryInfo.phone,
          'order.delivery_info.address': deliveryInfo.address,
          'order.delivery_info.name': deliveryInfo.name,
        });
      } catch (e) {
        console.error(e);
        this.toast('更新地址失败');
      }
    } catch {}
  },

  onOrderNumCopy() {
    // 复制订单号
    wx.setClipboardData({
      data: this.data.order.orderNo,
    });
  },

  onDeliveryNumCopy() {
    // 复制物流单号
    wx.setClipboardData({
      data: this.data.order.logisticsVO.logisticsNo,
    });
  },

  onToInvoice() {
    // 跳转到发票页面
    wx.navigateTo({
      url: `/pages/order/invoice/index?orderNo=${this.data._order.orderNo}`,
    });
  },

  onSuppleMentInvoice() {
    // 跳转到补开发票页面
    wx.navigateTo({
      url: `/pages/order/receipt/index?orderNo=${this.data._order.orderNo}`,
    });
  },

  onDeliveryClick() {
    // 查看物流详情
    const logisticsData = {
      nodes: this.data.logisticsNodes,
      company: this.data.order.logisticsVO.logisticsCompanyName,
      logisticsNo: this.data.order.logisticsVO.logisticsNo,
      phoneNumber: this.data.order.logisticsVO.logisticsCompanyTel,
    };
    wx.navigateTo({
      url: `/pages/order/delivery-detail/index?data=${encodeURIComponent(JSON.stringify(logisticsData))}`,
    });
  },

  navToCommentCreate() {
    // 跳转到订单评价页面
    wx.navigateTo({
      url: `/pages/order/createComment/index?orderNo=${this.orderNo}`,
    });
  },

  toGrouponDetail() {
    // 跳转到拼团详情页面
    wx.showToast({ title: '点击了拼团' });
  },

  clickService() {
    // 点击联系客服
    Toast({
      context: this,
      selector: '#t-toast',
      message: '您点击了联系客服',
    });
  },

  onOrderInvoiceView() {
    // 查看订单发票
    wx.navigateTo({
      url: `/pages/order/invoice/index?orderNo=${this.orderNo}`,
    });
  },

  onOperation(e) {
    // 处理订单操作
    const type = e?.detail?.type;
    const success = e?.detail?.success;

    if (type == null) return;

    const resultMessage = success ? '成功' : '失败';

    let operationMessage;

    if (type === OPERATION_TYPE.CANCEL) {
      operationMessage = '取消订单';
    } else if (type === OPERATION_TYPE.CONFIRM) {
      operationMessage = '确认收货';
    } else {
      operationMessage = '支付';
    }

    this.toast(`${operationMessage}${resultMessage}`);
    orderListShouldFresh();
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  },
});
