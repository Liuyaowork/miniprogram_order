/**
 *
 * @param {{id: String, totalPrice: Number}} order
 * @returns
 */
export async function pay(order) {
  try {
    const res = await wx.cloud.callFunction({
      // 云函数名称
      name: 'shop_pay',
      data: {
        orderId: order.id
      },
    });
    const paymentData = res.result?.data;
    // 唤起微信支付组件，完成支付
    try {
      await wx.requestPayment({
        timeStamp: paymentData?.timeStamp,
        nonceStr: paymentData?.nonceStr,
        package: paymentData?.packageVal,
        paySign: paymentData?.paySign,
        signType: 'RSA', // 该参数为固定值
      });
    } catch (e) {
      return Promise.reject(e);
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function refund(orderId) {
  const res = await wx.cloud.callFunction({
    // 云函数名称
    name: 'shop_refund',
    data: {
      orderId,
    },
  });
  if (!res?.result?.data) {
    throw new Error("refund failed", res);
  }
  return res;
}

/* wx.cloud.callFunction({
  // 云函数名称
  name: 'wxpayFunctions',
  data: {
    // 调用云函数中的下单方法
    type: 'wxpay_order',
    // 业务其他参数...
  },
  success: (res) => {
    console.log('下单结果: ', res);
    const paymentData = res.result?.data;
    // 唤起微信支付组件，完成支付
    wx.requestPayment({
      timeStamp: paymentData?.timeStamp,
      nonceStr: paymentData?.nonceStr,
      package: paymentData?.packageVal,
      paySign: paymentData?.paySign,
      signType: 'RSA', // 该参数为固定值
      success(res) {
        // 支付成功回调，实现自定义的业务逻辑
        console.log('唤起支付组件成功：', res);
      },
      fail(err) {
        // 支付失败回调
        console.error('唤起支付组件失败：', err);
      },
    });
  },
}); */