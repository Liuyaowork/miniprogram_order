import Dialog from 'tdesign-miniprogram/dialog/index';
import { ORDER_STATUS, updateOrderStatus } from '../../../../services/order/order';
import { pay, refund } from '../../../../services/pay/pay';
import { OrderButtonTypes } from '../../config';
import { objectToParamString } from '../../../../utils/util';
import { OPERATION_TYPE } from '../../../../utils/orderOperation';

const OPERATION_DONE_EVENT = 'operation'; // 操作完成事件名称

Component({
  options: {
    addGlobalClass: true, // 允许全局样式影响组件
  },
  properties: {
    order: {
      type: Object,
      observer(order) {
        this.init(order); // 初始化订单按钮
      },
    },
    goodsIndex: {
      type: Number,
      value: null, // 商品索引
    },
    isBtnMax: {
      type: Boolean,
      value: false, // 是否按钮最大化
    },
  },

  data: {
    order: {}, // 当前订单数据
    buttons: {
      left: [], // 左侧按钮
      right: [], // 右侧按钮
    },
  },

  methods: {
    // 点击【订单操作】按钮，根据按钮类型分发
    onOrderBtnTap(e) {
      const { type } = e.currentTarget.dataset; // 获取按钮类型
      switch (type) {
        case OrderButtonTypes.CANCEL:
          this.onCancel(this.data.order); // 取消订单
          break;
        case OrderButtonTypes.CONFIRM:
          this.onConfirm(this.data.order); // 确认收货
          break;
        case OrderButtonTypes.PAY:
          this.onPay(this.data.order); // 支付订单
          break;
        case OrderButtonTypes.APPLY_REFUND:
          this.onApplyRefund(this.data.order); // 申请退款
          break;
        case OrderButtonTypes.COMMENT:
          this.onAddComment(this.data.order); // 添加评论
          break;
      }
    },

    // 检查订单是否有效
    checkOrder(order, operationType) {
      if (order != null) {
        return true; // 订单有效
      }
      // 触发操作完成事件，提示无订单
      this.triggerEvent(OPERATION_DONE_EVENT, {
        type: operationType,
        message: 'no order',
        success: false,
      });
      return false;
    },

    // 取消订单
    async onCancel(order) {
      if (!this.checkOrder(order, OPERATION_TYPE.CANCEL)) return;

      // 如果订单已支付，先进行退款
      if (order.status !== ORDER_STATUS.TO_PAY) {
        try {
          await refund(order._id); // 调用退款接口
        } catch (e) {
          // 触发操作完成事件，提示退款失败
          this.triggerEvent(OPERATION_DONE_EVENT, {
            type: OPERATION_TYPE.CANCEL,
            message: 'refund failed',
            success: false,
            detail: e,
          });
          return;
        }
      }

      try {
        // 更新订单状态为已取消
        await updateOrderStatus({ orderId: order._id, status: ORDER_STATUS.CANCELED });
      } catch (e) {
        // 触发操作完成事件，提示更新订单状态失败
        this.triggerEvent(OPERATION_DONE_EVENT, {
          type: OPERATION_TYPE.CANCEL,
          message: 'update order status failed',
          success: false,
          detail: e,
        });
        return;
      }

      // 触发操作完成事件，提示成功
      this.triggerEvent(OPERATION_DONE_EVENT, {
        type: OPERATION_TYPE.CANCEL,
        success: true,
      });
    },

    // 确认收货
    async onConfirm(order) {
      if (!this.checkOrder(order, OPERATION_TYPE.CONFIRM)) return;

      try {
        // 弹出确认对话框
        await Dialog.confirm({
          title: '确认是否已经收到货？',
          content: '',
          confirmBtn: '确认收货',
          cancelBtn: '取消',
        });
      } catch (e) {
        // 触发操作完成事件，提示对话框失败
        this.triggerEvent(OPERATION_DONE_EVENT, {
          type: OPERATION_TYPE.CONFIRM,
          message: 'confirm dialog failed',
          success: false,
          detail: e,
        });
        return;
      }

      try {
        // 更新订单状态为已完成
        await updateOrderStatus({ orderId: order._id, status: ORDER_STATUS.FINISHED });
      } catch (e) {
        // 触发操作完成事件，提示更新订单状态失败
        this.triggerEvent(OPERATION_DONE_EVENT, {
          type: OPERATION_TYPE.CONFIRM,
          message: 'update order status failed',
          success: false,
          detail: e,
        });
      }

      // 触发操作完成事件，提示成功
      this.triggerEvent(OPERATION_DONE_EVENT, {
        type: OPERATION_TYPE.CONFIRM,
        success: true,
      });
    },

    // 支付订单
    async onPay(order) {
      if (!this.checkOrder(order, OPERATION_TYPE.PAY)) return;

      try {
        // 调用支付接口
        await pay({ id: order._id, totalPrice: order.totalPrice });
        try {
          // 更新订单状态为待发货
          await updateOrderStatus({ orderId: order._id, status: ORDER_STATUS.TO_SEND });
        } catch (e) {
          console.error(e);
          // 触发操作完成事件，提示支付失败
          this.triggerEvent(OPERATION_DONE_EVENT, {
            type: OPERATION_TYPE.PAY,
            message: 'pay failed',
            success: false,
            detail: e,
          });
          return;
        }
      } catch (e) {
        // 触发操作完成事件，提示支付失败
        this.triggerEvent(OPERATION_DONE_EVENT, {
          type: OPERATION_TYPE.PAY,
          message: 'pay failed',
          success: false,
          detail: e,
        });
        return;
      }

      // 触发操作完成事件，提示成功
      this.triggerEvent(OPERATION_DONE_EVENT, {
        type: OPERATION_TYPE.PAY,
        success: true,
      });
    },

    // 申请退款
    onApplyRefund(order) {
      // 跳转到申请退款页面
      wx.navigateTo({ url: `/pages/order/apply-service/index?${objectToParamString({ orderId: order._id })}` });
    },

    // 添加订单评论
    onAddComment(order) {
      // 跳转到评论页面
      wx.navigateTo({
        url: `/pages/goods/comments/create-list/index?${objectToParamString({ orderId: order._id })}`,
      });
    },

    // 初始化订单按钮
    init(order) {
      if (order == null) return;

      // 根据订单状态设置按钮
      if (order.status === ORDER_STATUS.TO_PAY) {
        this.setData({
          buttons: {
            left: [],
            right: [
              { type: OrderButtonTypes.CANCEL, name: '取消订单' },
              { type: OrderButtonTypes.PAY, name: '付款', primary: true },
            ],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.TO_SEND) {
        this.setData({
          buttons: {
            left: [],
            right: [{ type: OrderButtonTypes.CANCEL, name: '取消订单' }],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.TO_RECEIVE) {
        this.setData({
          buttons: {
            left: [],
            right: [{ type: OrderButtonTypes.CONFIRM, name: '确认收货', primary: true }],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.FINISHED) {
        this.setData({
          buttons: {
            left: [],
            right: [{ type: OrderButtonTypes.COMMENT, name: '评价', primary: true }],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.CANCELED) {
        this.setData({
          buttons: {
            left: [],
            right: [],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.RETURN_APPLIED) {
        this.setData({
          buttons: {
            left: [],
            right: [],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.RETURN_REFUSED) {
        this.setData({
          buttons: {
            left: [],
            right: [],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.RETURN_FINISH) {
        this.setData({
          buttons: {
            left: [],
            right: [],
          },
        });
        return;
      }
      if (order.status === ORDER_STATUS.RETURN_MONEY_REFUSED) {
        this.setData({
          buttons: {
            left: [],
            right: [],
          },
        });
        return;
      }
    },
  },

  lifetimes: {
    attached() {
      this.init(this.data.order); // 组件挂载时初始化订单按钮
    },
  },
});
