Component({
  externalClasses: ['wr-class'], // 外部样式类

  properties: {
    goodsList: {
      type: Array,
      value: [], // 商品列表数据
    },
    id: {
      type: String,
      value: '',
      observer: (id) => {
        // 当 id 属性变化时，生成独立的 ID
        this.genIndependentID(id);
      },
    },
    thresholds: {
      type: Array,
      value: [], // 交叉观察器的阈值
    },
  },

  data: {
    independentID: '', // 独立的组件 ID
  },

  lifetimes: {
    ready() {
      // 组件初始化时调用
      this.init();
    },
  },

  methods: {
    // 点击商品卡片触发的事件
    onClickGoods(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('click', { ...e.detail, index });
    },

    // 点击添加购物车按钮触发的事件
    onAddCart(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('addcart', { ...e.detail, index });
    },

    // 点击商品缩略图触发的事件
    onClickGoodsThumb(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('thumb', { ...e.detail, index });
    },

    // 初始化组件
    init() {
      this.genIndependentID(this.id || '');
    },

    // 生成独立的组件 ID
    genIndependentID(id) {
      if (id) {
        this.setData({ independentID: id });
      } else {
        this.setData({
          independentID: `goods-list-${~~(Math.random() * 10 ** 8)}`,
        });
      }
    },
  },
});
