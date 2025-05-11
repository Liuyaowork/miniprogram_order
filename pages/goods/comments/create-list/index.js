import Toast from 'tdesign-miniprogram/toast/index';
import { getOrder } from '../../../../services/order/order';
import { getAllOrderItemsOfAnOrder } from '../../../../services/order/orderItem';
import { getCloudImageTempUrl } from '../../../../utils/cloudImageHandler';

Page({
  data: {
    order: null, // 存储订单详情
  },

  async onLoad(options) {
    // 页面加载时获取订单详情
    const orderId = options?.orderId;
    if (typeof orderId !== 'string') {
      this.failedAndBack('获取订单详情失败');
      return;
    }

    try {
      // 并行获取订单信息和订单项
      const [order, items] = await Promise.all([getOrder(orderId), getAllOrderItemsOfAnOrder({ orderId })]);

      const images = items.map((x) => x.sku.image ?? ''); // 提取商品图片
      try {
        const handleImages = await getCloudImageTempUrl(images); // 获取临时图片 URL
        handleImages.forEach((image, index) => (items[index].sku.image = image)); // 更新商品图片
      } catch (e) {
        console.error('处理商品图片失败', e);
      }
      order.orderItems = items; // 将订单项添加到订单中
      this.setData({ order }); // 更新页面数据
    } catch (e) {
      this.failedAndBack('获取订单详情失败', e);
    }
  },

  failedAndBack(message, e) {
    // 显示错误信息并返回上一页
    e && console.error(e);
    Toast({
      context: this,
      selector: '#t-toast',
      message,
    });
    setTimeout(() => wx.navigateBack(), 1000);
  },

  toComment(e) {
    // 跳转到评论页面
    const orderItemId = e?.target?.dataset?.orderItem?._id;
    if (typeof orderItemId !== 'string') {
      this.failedAndBack('获取订单详情失败');
      return;
    }

    wx.navigateTo({
      url: `/pages/goods/comments/create/index?orderItemId=${orderItemId}`, // 跳转到评论创建页面
    });
  },
});
