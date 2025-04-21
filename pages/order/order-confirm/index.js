import Toast from 'tdesign-miniprogram/toast/index';
import { createOrderItem } from '../../../services/order/orderItem';
import { createOrder, ORDER_STATUS, updateOrderStatus } from '../../../services/order/order';
import { getCartItem, deleteCartItem } from '../../../services/cart/cart';
import { getSkuDetail, updateSku } from '../../../services/sku/sku';
import { getAddressPromise } from '../../usercenter/address/list/util';
import { getSingleCloudImageTempUrl } from '../../../utils/cloudImageHandler';
import { cartShouldFresh } from '../../../utils/cartFresh';
import { pay } from '../../../services/pay/pay';

const stripeImg = `https://cdn-we-retail.ym.tencent.com/miniapp/order/stripe.png`;

async function createOrderItemFromSku({ count, orderId, skuId }) {
  // 从 SKU 创建订单项
  const latestSku = await getSkuDetail(skuId);
  const finalCount = latestSku.count - count;

  // check if sku is enough
  if (finalCount < 0) {
    return Promise.reject({ reason: 'SKU_NOT_ENOUGH' });
  }

  try {
    // decrease sku's count
    await updateSku({
      skuId,
      data: {
        count: finalCount,
      },
    });
    try {
      // create order item
      await createOrderItem({ count, orderId, skuId });
    } catch (e) {
      console.error(e);
      return Promise.reject({ reason: 'CREATE_ORDER_ITEM_FAILED' });
    }
  } catch (e) {
    console.error(e);
    return Promise.reject({ reason: 'SKU_DECREASE_FAILED' });
  }
}

/**
 *
 * @param {Object} cartItem
 * @param {String} orderId
 */
function createOrderItemFromCartItem(cartItem, orderId) {
  // 从购物车项创建订单项
  return createOrderItemFromSku({ count: cartItem.count, orderId, skuId: cartItem.sku._id });
}

/**
 *
 * @param {Array} cartItems
 */
function cartItemToGoodList(cartItems) {
  // 将购物车项转换为商品列表
  return cartItems.map((item) => ({
    thumb: item.sku.image,
    title: item.sku.spu.name,
    specs: item.sku.attr_value.map((v) => v.value).join('，'),
    price: item.sku.price,
    num: item.count,
  }));
}

Page({
  data: {
    placeholder: '备注信息', // 备注信息占位符
    stripeImg, // 分隔线图片
    loading: true, // 页面加载状态
    orderCardList: [], // 商品卡片展示列表
    goodsRequestList: [], // 商品请求列表
    userAddressReq: null, // 用户地址请求
    storeInfoList: [], // 店铺信息列表
    promotionGoodsList: [], // 当前门店商品列表（优惠券）
    currentStoreId: null, // 当前优惠券 storeId
    userAddress: null, // 用户地址
    goodsList: [], // 商品列表
    cartItems: [], // 购物车项
    totalSalePrice: 0, // 总售价
    directSku: null, // 直接购买的 SKU
  },

  payLock: false, // 支付锁

  type: null, // 页面类型（购物车或直接购买）

  async onLoadFromCart(cartIds) {
    // 从购物车加载数据
    if (typeof cartIds !== 'string') {
      console.error('invalid cart item ids', cartIds);
      this.failedAndBack('获取购物车信息失败');
      return;
    }
    const ids = cartIds.split(',');
    try {
      const cartItems = await Promise.all(
        ids.map(async (id) => {
          const cartItem = (await getCartItem({ id })).data;
          cartItem.sku = { ...cartItem.sku, ...(await getSkuDetail(cartItem.sku._id)) };
          cartItem.sku.image = await getSingleCloudImageTempUrl(cartItem.sku.image);
          return cartItem;
        }),
      );
      const goodsList = cartItemToGoodList(cartItems);
      const totalSalePrice = goodsList.reduce((acc, cur) => acc + cur.price * cur.num, 0);
      this.setData({
        goodsList,
        totalSalePrice,
        cartItems,
      });
    } catch (e) {
      this.failedAndBack('获取购物车信息失败', e);
    }
  },
  async onLoadFromDirect(countStr, skuId) {
    // 从直接购买加载数据
    const count = parseInt(countStr);
    if (typeof count !== 'number' || isNaN(count) || typeof skuId !== 'string') {
      console.error('invalid cunt or skiId', count, skuId);
      this.failedAndBack('初始化信息有误');
      return;
    }

    try {
      const sku = await getSkuDetail(skuId);
      sku.image = await getSingleCloudImageTempUrl(sku.image);

      const goodsList = [
        {
          thumb: sku.image,
          title: sku.spu.name,
          specs: sku.attr_value.map((v) => v.value).join('，'),
          price: sku.price,
          num: count,
        },
      ];

      const totalSalePrice = goodsList.reduce((acc, cur) => acc + cur.price * cur.num, 0);
      this.setData({
        goodsList,
        totalSalePrice,
        directSku: sku,
      });
    } catch (e) {
      this.failedAndBack('获取商品信息失败', e);
    }
  },

  async onLoad(options) {
    // 页面加载时初始化数据
    this.type = options?.type;
    if (this.type === 'cart') {
      await this.onLoadFromCart(options?.cartIds);
    } else if (this.type === 'direct') {
      await this.onLoadFromDirect(options?.count, options?.skuId);
    } else {
      this.failedAndBack('初始化信息有误', 'invalid type');
    }

    this.setData({
      loading: false,
    });
  },

  init() {
    // 页面初始化
    this.setData({
      loading: false,
    });
    const { goodsRequestList } = this;
    this.handleOptionsParams({ goodsRequestList });
  },

  toast(message) {
    // 显示提示信息
    Toast({
      context: this,
      selector: '#t-toast',
      message,
      duration: 1000,
      icon: '',
    });
  },

  onGotoAddress() {
    // 跳转到地址选择页面
    /** 获取一个Promise */
    getAddressPromise()
      .then((address) => {
        this.setData({
          userAddress: {
            ...address,
            detailAddress: address.address,
          },
        });
      })
      .catch(() => {});

    wx.navigateTo({
      url: `/pages/usercenter/address/list/index?selectMode=true`,
    });
  },
  onTap() {
    // 点击备注输入框
    this.setData({
      placeholder: '',
    });
  },

  async payImpl(totalPrice, orderId) {
    // 支付实现
    try {
      await pay({ id: orderId, totalPrice });
      try {
        await updateOrderStatus({ orderId, status: ORDER_STATUS.TO_SEND });
        this.toast('支付成功');
      } catch (e) {
        console.error(e);
        this.toast('支付成功，但订单状态更新失败');
      } finally {
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      }
    } catch (e) {
      this.failedAndBack('支付失败', e);
    }
  },

  async submitOrderFromCart() {
    // 从购物车提交订单
    /**
     * 1.创建订单
     * 2.创建订单项
     * 3.删除购物车项
     */

    const { cartItems, userAddress } = this.data;
    const { id: orderId } = await createOrder({ status: ORDER_STATUS.TO_PAY, addressId: userAddress._id });

    try {
      await Promise.all(cartItems.map(async (cartItem) => {
        await createOrderItemFromCartItem(cartItem, orderId);
      }));

      try {
        await cartItems.map(async (cartItem) => {
          await deleteCartItem({ cartItemId: cartItem._id });
          // any deletion should notify cart to fresh
          cartShouldFresh();
        });
      } catch (e) {
        console.error(e);
        this.toast('删除购物车失败，请手动删除');
        // do not return, continue to pay
      }

      const totalPrice = cartItems.reduce((acc, cur) => acc + cur.count * cur.sku.price, 0);
      await this.payImpl(totalPrice, orderId);
    } catch (e) {
      this.failedAndBack('创建订单失败', e);
    }
  },

  async submitOrderFromDirect() {
    // 从直接购买提交订单
    /**
     * 1.创建订单
     * 2.创建订单项
     */

    const { directSku, userAddress, goodsList } = this.data;
    const goods = goodsList[0];
    const { id: orderId } = await createOrder({ status: ORDER_STATUS.TO_PAY, addressId: userAddress._id });

    try {
      await createOrderItemFromSku({ count: goods.num, orderId, skuId: directSku._id });
      const totalPrice = goods.price * goods.num;

      await this.payImpl(totalPrice, orderId);
    } catch (e) {
      this.failedAndBack('创建订单失败', e);
    }
  },

  failedAndBack(message, e) {
    // 失败提示并返回上一页
    e && console.error(e);
    this.toast(message);
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  },

  // 提交订单
  async submitOrder() {
    const { userAddress } = this.data;
    if (!userAddress) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请添加收货地址',
        duration: 2000,
        icon: 'help-circle',
      });
      return;
    }

    if (this.type === 'cart') {
      this.submitOrderFromCart();
    } else if (this.type === 'direct') {
      this.submitOrderFromDirect();
    } else {
      console.error('invalid type', this.type);
      this.failedAndBack('初始化信息有误');
    }
  },
});
