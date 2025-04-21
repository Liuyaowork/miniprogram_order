import Toast from 'tdesign-miniprogram/toast/index';
import { ServiceType, ServiceTypeDesc, ServiceStatus } from '../config';
import { formatTime, getRightsDetail } from './api';

const TitleConfig = {
  [ServiceType.ORDER_CANCEL]: '退款详情',
  [ServiceType.ONLY_REFUND]: '退款详情',
  [ServiceType.RETURN_GOODS]: '退货退款详情',
};

Page({
  data: {
    // 页面加载状态
    pageLoading: true,
    // 原始服务数据
    serviceRaw: {},
    // 格式化后的服务数据
    service: {},
    // 运单按钮数据
    deliveryButton: {},
    // 图片画廊数据
    gallery: {
      current: 0,
      show: false,
      proofs: [],
    },
    // 是否显示凭证
    showProofs: false,
    // 是否需要返回刷新
    backRefresh: false,
  },

  onLoad(query) {
    // 获取售后服务单号
    this.rightsNo = query.rightsNo;
    // 获取输入对话框组件实例
    this.inputDialog = this.selectComponent('#input-dialog');
    // 初始化页面数据
    this.init();
  },

  onShow() {
    // 当从其他页面返回，并且 backRefresh 被置为 true 时，刷新数据
    if (!this.data.backRefresh) return;
    this.init();
    this.setData({ backRefresh: false });
  },

  // 页面刷新，展示下拉刷新
  onPullDownRefresh_(e) {
    const { callback } = e.detail;
    return this.getService().then(() => callback && callback());
  },

  // 初始化页面数据
  init() {
    this.setData({ pageLoading: true });
    this.getService().then(() => {
      this.setData({ pageLoading: false });
    });
  },

  // 获取服务详情数据
  getService() {
    const params = { rightsNo: this.rightsNo };
    return getRightsDetail(params).then((res) => {
      const serviceRaw = res.data[0];
      // 滤掉填写运单号、修改运单号按钮，这两个按钮特殊处理，不在底部按钮栏展示
      if (!serviceRaw.buttonVOs) serviceRaw.buttonVOs = [];
      const deliveryButton = {};
      const service = {
        // 格式化服务数据
        id: serviceRaw.rights.rightsNo,
        serviceNo: serviceRaw.rights.rightsNo,
        storeName: serviceRaw.rights.storeName,
        type: serviceRaw.rights.rightsType,
        typeDesc: ServiceTypeDesc[serviceRaw.rights.rightsType],
        status: serviceRaw.rights.rightsStatus,
        statusIcon: this.genStatusIcon(serviceRaw.rights),
        statusName: serviceRaw.rights.userRightsStatusName,
        statusDesc: serviceRaw.rights.userRightsStatusDesc,
        amount: serviceRaw.rights.refundRequestAmount,
        goodsList: (serviceRaw.rightsItem || []).map((item, i) => ({
          id: i,
          thumb: item.goodsPictureUrl,
          title: item.goodsName,
          specs: (item.specInfo || []).map((s) => s.specValues || ''),
          itemRefundAmount: item.itemRefundAmount,
          rightsQuantity: item.rightsQuantity,
        })),
        orderNo: serviceRaw.rights.orderNo, // 订单编号
        rightsNo: serviceRaw.rights.rightsNo, // 售后服务单号
        rightsReasonDesc: serviceRaw.rights.rightsReasonDesc, // 申请售后原因
        isRefunded: serviceRaw.rights.userRightsStatus === ServiceStatus.REFUNDED, // 是否已退款
        refundMethodList: (serviceRaw.refundMethodList || []).map((m) => ({
          name: m.refundMethodName,
          amount: m.refundMethodAmount,
        })), // 退款明细
        refundRequestAmount: serviceRaw.rights.refundRequestAmount, // 申请退款金额
        payTraceNo: serviceRaw.rightsRefund.traceNo, // 交易流水号
        createTime: formatTime(parseFloat(`${serviceRaw.rights.createTime}`), 'YYYY-MM-DD HH:mm'), // 申请时间
        logisticsNo: serviceRaw.logisticsVO.logisticsNo, // 退货物流单号
        logisticsCompanyName: serviceRaw.logisticsVO.logisticsCompanyName, // 退货物流公司
        logisticsCompanyCode: serviceRaw.logisticsVO.logisticsCompanyCode, // 退货物流公司
        remark: serviceRaw.logisticsVO.remark, // 退货备注
        receiverName: serviceRaw.logisticsVO.receiverName, // 收货人
        receiverPhone: serviceRaw.logisticsVO.receiverPhone, // 收货人电话
        receiverAddress: this.composeAddress(serviceRaw), // 收货人地址
        applyRemark: serviceRaw.rightsRefund.refundDesc, // 申请退款时的填写的说明
        buttons: serviceRaw.buttonVOs || [],
        logistics: serviceRaw.logisticsVO,
      };
      const proofs = serviceRaw.rights.rightsImageUrls || [];
      this.setData({
        serviceRaw,
        service,
        deliveryButton,
        'gallery.proofs': proofs,
        showProofs:
          serviceRaw.rights.userRightsStatus === ServiceStatus.PENDING_VERIFY &&
          (service.applyRemark || proofs.length > 0),
      });
      wx.setNavigationBarTitle({
        title: TitleConfig[service.type],
      });
    });
  },

  // 组合收货地址
  composeAddress(service) {
    return [
      service.logisticsVO.receiverProvince,
      service.logisticsVO.receiverCity,
      service.logisticsVO.receiverCountry,
      service.logisticsVO.receiverArea,
      service.logisticsVO.receiverAddress,
    ]
      .filter((item) => !!item)
      .join(' ');
  },

  // 刷新页面数据
  onRefresh() {
    this.init();
  },

  // 编辑物流信息
  editLogistices() {
    this.setData({
      inputDialogVisible: true,
    });
    this.inputDialog.setData({
      cancelBtn: '取消',
      confirmBtn: '确定',
    });
    this.inputDialog._onConfirm = () => {
      Toast({
        message: '确定填写物流单号',
      });
    };
  },

  // 点击凭证图片
  onProofTap(e) {
    if (this.data.gallery.show) {
      this.setData({
        'gallery.show': false,
      });
      return;
    }
    const { index } = e.currentTarget.dataset;
    this.setData({
      'gallery.show': true,
      'gallery.current': index,
    });
  },

  // 点击商品卡片
  onGoodsCardTap(e) {
    const { index } = e.currentTarget.dataset;
    const goods = this.data.serviceRaw.rightsItem[index];
    wx.navigateTo({ url: `/pages/goods/details/index?skuId=${goods.skuId}` });
  },

  // 复制服务单号
  onServiceNoCopy() {
    wx.setClipboardData({
      data: this.data.service.serviceNo,
    });
  },

  // 复制收货地址
  onAddressCopy() {
    wx.setClipboardData({
      data: `${this.data.service.receiverName}  ${this.data.service.receiverPhone}\n${this.data.service.receiverAddress}`,
    });
  },

  /** 获取状态ICON */
  genStatusIcon(item) {
    const { userRightsStatus, afterSaleRequireType } = item;
    switch (userRightsStatus) {
      // 退款成功
      case ServiceStatus.REFUNDED: {
        return 'succeed';
      }
      // 已取消、已关闭
      case ServiceStatus.CLOSED: {
        return 'indent_close';
      }
      default: {
        switch (afterSaleRequireType) {
          case 'REFUND_MONEY': {
            return 'goods_refund';
          }
          case 'REFUND_GOODS_MONEY':
            return 'goods_return';
          default: {
            return 'goods_return';
          }
        }
      }
    }
  },
});
