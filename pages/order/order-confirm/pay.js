import Dialog from 'tdesign-miniprogram/dialog/index';
import Toast from 'tdesign-miniprogram/toast/index';

import { dispatchCommitPay } from '../../../services/order/orderConfirm';

// 提交支付请求
export const commitPay = (params) => {
  return dispatchCommitPay({
    goodsRequestList: params.goodsRequestList, // 待结算的商品集合
    invoiceRequest: params.invoiceRequest, // 发票信息
    userAddressReq: params.userAddressReq, // 地址信息
    currency: params.currency || 'CNY', // 支付货币，默认人民币
    logisticsType: params.logisticsType || 1, // 配送方式，默认快递
    orderType: params.orderType || 0, // 订单类型，默认普通订单
    payType: params.payType || 1, // 支付类型，默认线下支付
    totalAmount: params.totalAmount, // 总支付金额
    userName: params.userName, // 用户名
    payWay: 1, // 支付方式，固定值
    authorizationCode: '', // 登录凭证
    storeInfoList: params.storeInfoList, // 备注信息列表
    couponList: params.couponList, // 优惠券列表
    groupInfo: params.groupInfo, // 团购信息
  });
};

// 支付成功处理逻辑
export const paySuccess = (payOrderInfo) => {
  const { payAmt, tradeNo, groupId, promotionId } = payOrderInfo;

  // 显示支付成功提示
  Toast({
    context: this,
    selector: '#t-toast',
    message: '支付成功',
    duration: 2000,
    icon: 'check-circle',
  });

  // 构造支付结果页面的参数
  const params = {
    totalPaid: payAmt, // 支付金额
    orderNo: tradeNo, // 订单号
  };
  if (groupId) {
    params.groupId = groupId; // 团购ID
  }
  if (promotionId) {
    params.promotionId = promotionId; // 促销ID
  }
  const paramsStr = Object.keys(params)
    .map((k) => `${k}=${params[k]}`)
    .join('&');

  // 跳转到支付结果页面
  wx.redirectTo({ url: `/pages/order/pay-result/index?${paramsStr}` });
};

// 支付失败处理逻辑
export const payFail = (payOrderInfo, resultMsg) => {
  if (resultMsg === 'requestPayment:fail cancel') {
    if (payOrderInfo.dialogOnCancel) {
      // 结算页取消付款，弹出确认对话框
      Dialog.confirm({
        title: '是否放弃付款',
        content: '商品可能很快就会被抢空哦，是否放弃付款？',
        confirmBtn: '放弃',
        cancelBtn: '继续付款',
      }).then(() => {
        // 跳转到订单列表页面
        wx.redirectTo({ url: '/pages/order/order-list/index' });
      });
    } else {
      // 订单列表页或详情页取消付款，显示取消提示
      Toast({
        context: this,
        selector: '#t-toast',
        message: '支付取消',
        duration: 2000,
        icon: 'close-circle',
      });
    }
  } else {
    // 其他支付失败情况，显示失败提示
    Toast({
      context: this,
      selector: '#t-toast',
      message: `支付失败：${resultMsg}`,
      duration: 2000,
      icon: 'close-circle',
    });
    setTimeout(() => {
      // 跳转到订单列表页面
      wx.redirectTo({ url: '/pages/order/order-list/index' });
    }, 2000);
  }
};

// 微信支付方式处理逻辑
export const wechatPayOrder = (payOrderInfo) => {
  // 模拟支付成功
  return new Promise((resolve) => {
    paySuccess(payOrderInfo); // 调用支付成功逻辑
    resolve();
    /* 实际支付逻辑
    wx.requestPayment({
      timeStamp,
      nonceStr,
      package: payInfo.package,
      signType,
      paySign,
      success: function () {
        paySuccess(payOrderInfo);
        resolve();
      },
      fail: function (err) {
        payFail(payOrderInfo, err.errMsg);
      },
    });
    */
  });
};
