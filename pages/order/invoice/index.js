import { fetchOrderDetail } from '../../../services/order/orderDetail';

Page({
  data: {
    invoice: {},
  },

  /**
   * 页面加载时触发，初始化订单号并调用初始化方法。
   * @param {Object} param 页面传递的参数。
   * @param {string} param.orderNo 订单号。
   */
  onLoad({ orderNo }) {
    this.orderNo = orderNo;
    this.init();
  },

  /**
   * 初始化页面数据。
   */
  init() {
    this.getDetail();
  },

  /**
   * 获取订单详情并提取发票信息。
   * @returns {Promise<void>} 返回一个 Promise，表示获取详情的异步操作。
   */
  getDetail() {
    const params = {
      parameter: this.orderNo,
    };
    return fetchOrderDetail(params).then((res) => {
      const order = res.data;

      const invoice = {
        buyerName: order?.invoiceVO?.buyerName, //个人或公司名称
        buyerTaxNo: order?.invoiceVO?.buyerTaxNo, //税号
        buyerPhone: order?.invoiceVO?.buyerPhone, //手机
        email: order?.invoiceVO?.email, //邮箱
        titleType: order?.invoiceVO?.titleType === 1 ? '个人' : '公司', //发票抬头 1-个人 2-公司
        ontentType: order?.invoiceVO?.ontentType === 1 ? '商品明细' : '2类别', //发票内容 1-明细 2类别
        invoiceType:
          order?.invoiceVO?.invoiceType === 5 ? '电子普通发票' : '不开发票', //是否开票 0-不开 5-电子发票
        isInvoice: order?.invoiceVO?.buyerName ? '已开票' : '未开票',
        money: order?.invoiceVO?.money,
      };
      this.setData({
        invoice,
      });
    });
  },
});
