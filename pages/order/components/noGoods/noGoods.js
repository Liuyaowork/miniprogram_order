Component({
  properties: {
    settleDetailData: {
      type: Object,
      value: {},
      observer(settleDetailData) {
        // 解构从 settleDetailData 中传入的商品列表数据
        const {
          outOfStockGoodsList, // 库存不足商品列表
          abnormalDeliveryGoodsList, // 超出配送范围商品列表
          inValidGoodsList, // 失效商品列表
          limitGoodsList, // 限购商品列表
        } = settleDetailData;

        // 优先级处理：按顺序选择第一个非空的商品列表
        const tempList =
          limitGoodsList ||
          abnormalDeliveryGoodsList ||
          inValidGoodsList ||
          outOfStockGoodsList ||
          [];

        // 遍历商品列表，为每个商品添加 id，并处理未结算商品的属性
        tempList.forEach((goods, index) => {
          goods.id = index; // 为每个商品添加唯一 id
          goods.unSettlementGoods &&
            goods.unSettlementGoods.forEach((ele) => {
              // 映射未结算商品的属性
              ele.name = ele.goodsName; // 商品名称
              ele.price = ele.payPrice; // 商品价格
              ele.imgUrl = ele.image; // 商品图片
            });
        });

        // 更新组件数据
        this.setData({
          goodsList: tempList, // 更新商品列表
        });
      },
    },
  },

  data: {
    goodList: [], // 初始化商品列表数据
  },
  methods: {
    // 点击卡片事件处理
    onCard(e) {
      const { item } = e.currentTarget.dataset; // 获取点击的目标数据
      if (item === 'cart') {
        // 跳转到购物车页面
        Navigator.gotoPage('/cart');
      } else if (item === 'orderSure') {
        // 跳转到结算页
        this.triggerEvent('change', undefined); // 触发 change 事件
      }
    },
    // 修改配送地址事件处理
    onDelive() {
      Navigator.gotoPage('/address', { type: 'orderSure' }); // 跳转到地址页面并传递参数
    },
  },
});
