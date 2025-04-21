import Dialog from 'tdesign-miniprogram/dialog/index'; // 引入 TDesign 的对话框组件
import { fetchCartGroupData, fetchCartItems, deleteCartItem, updateCartItemCount } from '../../services/cart/cart'; // 引入购物车相关服务
import { getSkuDetail } from '../../services/sku/sku'; // 引入 SKU 详情服务
import { objectToParamString } from '../../utils/util'; // 引入工具函数
import { getSingleCloudImageTempUrl } from '../../utils/cloudImageHandler'; // 引入云图片处理工具

let updateCartItemCountTimeout = null; // 用于防抖的计时器

Component({
  data: {
    cartGroupData: null, // 购物车分组数据
    cartItems: [], // 购物车商品列表
    selectedCartItemNum: 0, // 已选中商品数量
    allSelected: false, // 是否全选
    totalAmount: 0, // 总金额
    loading: false, // 加载状态
    inited: false, // 是否初始化完成
  },

  observers: {
    // 监听 cartItems 数据变化，更新选中状态和总金额
    cartItems: function (cartItems) {
      const selectedCartItems = cartItems.filter((x) => x.selected === true);
      const selectedCartItemNum = selectedCartItems.length;
      const totalAmount = selectedCartItems.reduce((acc, cur) => acc + cur.count * cur.sku.price, 0);
      const allSelected = selectedCartItemNum === cartItems.length;

      this.setData({
        selectedCartItemNum,
        allSelected,
        totalAmount,
      });
    },
  },

  lifetimes: {
    attached: async function () {
      // 生命周期：组件被附加到页面节点树时触发
      // console.log('called attached');
      // // 调用自定义tabbar的init函数，使页面与tabbar激活状态保持一致
      // this.getTabBar().init();
      // await this.setLoading();
      // await this.setDataPromise({ inited: true });
      // try {
      //   await this.init();
      // } finally {
      //   await this.unsetLoading();
      // }
    },
  },

  pageLifetimes: {
    show: async function () {
      // 页面显示时触发，初始化自定义 tabBar 和购物车数据
      this.getTabBar().init();

      await this.setLoading();
      try {
        await this.init();
      } finally {
        await this.unsetLoading();
      }
    },
  },

  methods: {
    async init() {
      // 初始化购物车数据
      const cartItems = (await fetchCartItems()).map((x) =>
        Object.assign(x, {
          selected: false, // 默认未选中
        }),
      );
      await Promise.all(
        cartItems.map(async (cartItem) => {
          const skuId = cartItem.sku._id;
          const sku = await getSkuDetail(skuId); // 获取 SKU 详情
          if (sku.image) {
            sku.image = await getSingleCloudImageTempUrl(sku.image); // 获取云图片临时 URL
          }
          cartItem.sku = sku;
        }),
      );
      await this.setDataPromise({
        cartItems,
      });
    },

    findGoods(spuId, skuId) {
      // 根据 spuId 和 skuId 查找商品
      let currentStore;
      let currentActivity;
      let currentGoods;
      const { storeGoods } = this.data.cartGroupData;
      for (const store of storeGoods) {
        for (const activity of store.promotionGoodsList) {
          for (const goods of activity.goodsPromotionList) {
            if (goods.spuId === spuId && goods.skuId === skuId) {
              currentStore = store;
              currentActivity = currentActivity;
              currentGoods = goods;
              return {
                currentStore,
                currentActivity,
                currentGoods,
              };
            }
          }
        }
      }
      return {
        currentStore,
        currentActivity,
        currentGoods,
      };
    },

    getCartGroupData() {
      // 获取购物车分组数据
      const { cartGroupData } = this.data;
      if (!cartGroupData) {
        return fetchCartGroupData();
      }
      return Promise.resolve({ data: cartGroupData });
    },

    selectGoodsService({ spuId, skuId, isSelected }) {
      // 选择单个商品
      this.findGoods(spuId, skuId).currentGoods.isSelected = isSelected;
      return Promise.resolve();
    },

    selectStoreService({ storeId, isSelected }) {
      // 全选门店
      const currentStore = this.data.cartGroupData.storeGoods.find((s) => s.storeId === storeId);
      currentStore.isSelected = isSelected;
      currentStore.promotionGoodsList.forEach((activity) => {
        activity.goodsPromotionList.forEach((goods) => {
          goods.isSelected = isSelected;
        });
      });
      return Promise.resolve();
    },

    changeQuantityService({ spuId, skuId, quantity }) {
      // 修改商品数量
      this.findGoods(spuId, skuId).currentGoods.quantity = quantity;
      return Promise.resolve();
    },

    deleteGoodsService({ spuId, skuId }) {
      // 删除商品
      function deleteGoods(group) {
        for (const gindex in group) {
          const goods = group[gindex];
          if (goods.spuId === spuId && goods.skuId === skuId) {
            group.splice(gindex, 1);
            return gindex;
          }
        }
        return -1;
      }
      const { storeGoods, invalidGoodItems } = this.data.cartGroupData;
      for (const store of storeGoods) {
        for (const activity of store.promotionGoodsList) {
          if (deleteGoods(activity.goodsPromotionList) > -1) {
            return Promise.resolve();
          }
        }
        if (deleteGoods(store.shortageGoodsList) > -1) {
          return Promise.resolve();
        }
      }
      if (deleteGoods(invalidGoodItems) > -1) {
        return Promise.resolve();
      }
      return Promise.reject();
    },

    onGoodsSelect({ detail: { goods } }) {
      // 单个商品选中状态切换
      const { cartItems } = this.data;
      const item = cartItems.find((x) => x._id === goods._id);

      if (item == null) {
        console.warn('Cart item not found!');
        return;
      }

      item.selected = !item.selected;
      this.setData({ cartItems });
    },

    onQuantityChange({ detail: { cartItemId, count } }) {
      // 修改商品数量并防抖更新
      const { cartItems } = this.data;
      const item = cartItems.find((x) => x._id === cartItemId);
      if (item == null) {
        console.warn('Cart item not found');
        return;
      }
      item.count = count;
      this.setData({ cartItems });
      this.debouncedUpdateCartItemCount({ cartItemId, count });
    },

    debouncedUpdateCartItemCount({ cartItemId, count }) {
      // 防抖更新购物车商品数量
      clearTimeout(updateCartItemCountTimeout);
      updateCartItemCountTimeout = setTimeout(async () => {
        this.setLoading();
        try {
          await updateCartItemCount({ cartItemId, count });
        } finally {
          this.unsetLoading();
        }
      }, 500);
    },

    goCollect() {
      // 跳转到活动页面
      /** 活动肯定有一个活动ID，用来获取活动banner，活动商品列表等 */
      const promotionID = '123';
      wx.navigateTo({
        url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
      });
    },

    goGoodsDetail({
      detail: {
        goods: {
          sku: {
            spu: { _id },
          },
        },
      },
    }) {
      // 跳转到商品详情页面
      wx.navigateTo({
        url: `/pages/goods/details/index?spuId=${_id}`,
      });
    },

    async onGoodsDelete({
      detail: {
        goods: { _id },
      },
    }) {
      // 删除商品并确认操作
      try {
        await Dialog.confirm({
          context: this,
          closeOnOverlayClick: true,
          title: '确认删除该商品吗?',
          confirmBtn: '确定',
          cancelBtn: '取消',
        });
        this.setLoading();
        try {
          await deleteCartItem({ cartItemId: _id });
          const { cartItems } = this.data;
          this.setData({
            cartItems: cartItems.filter((x) => x._id !== _id),
          });
        } finally {
          this.unsetLoading();
        }
      } catch {
        console.warn('deletion is cancelled');
      }
    },

    onSelectAll() {
      // 全选或取消全选
      const { cartItems, allSelected } = this.data;
      cartItems.forEach((x) => (x.selected = !allSelected));
      this.setData({ cartItems });
    },

    onToSettle() {
      // 跳转到结算页面
      wx.navigateTo({
        url: `/pages/order/order-confirm/index?${objectToParamString({
          type: 'cart',
          cartIds: this.data.cartItems
            .filter((x) => x.selected === true)
            .map((x) => x._id)
            .join(','),
        })}`,
      });
    },
    onGotoHome() {
      // 跳转到首页
      wx.switchTab({ url: '/pages/home/home' });
    },

    setLoading() {
      // 设置加载状态
      return this.setDataPromise({
        loading: true,
      });
    },
    unsetLoading() {
      // 取消加载状态
      return this.setDataPromise({
        loading: false,
      });
    },
    toggleLoading() {
      // 切换加载状态
      this.setData({
        loading: !this.data.loading,
      });
    },

    setDataPromise(data) {
      // 设置数据并返回 Promise
      return new Promise((res) => {
        this.setData(data, () => res());
      });
    },
  },
});
