Component({
  options: {
    addGlobalClass: true, // 允许组件使用全局样式
  },

  properties: {
    id: {
      type: String,
      value: '',
      observer(id) {
        // 当 id 属性变化时，生成独立的 ID 并初始化交叉观察器
        this.genIndependentID(id);
        if (this.properties.thresholds?.length) {
          this.createIntersectionObserverHandle();
        }
      },
    },
    data: {
      type: Object,
      observer(data) {
        // 当 data 属性变化时，更新商品数据并校验划线价格的有效性
        if (!data) {
          return;
        }
        let isValidityLinePrice = true;
        if (data.originPrice && data.price && data.originPrice < data.price) {
          isValidityLinePrice = false;
        }
        this.setData({ goods: data, isValidityLinePrice });
      },
    },
    currency: {
      type: String,
      value: '¥', // 默认货币符号
    },

    thresholds: {
      type: Array,
      value: [],
      observer(thresholds) {
        // 当 thresholds 属性变化时，创建或清除交叉观察器
        if (thresholds && thresholds.length) {
          this.createIntersectionObserverHandle();
        } else {
          this.clearIntersectionObserverHandle();
        }
      },
    },
  },

  data: {
    independentID: '', // 独立的组件 ID
    goods: { id: '' }, // 商品数据
    isValidityLinePrice: false, // 划线价格是否有效
  },

  lifetimes: {
    ready() {
      // 组件初始化时调用
      this.init();
    },
    detached() {
      // 组件销毁时调用
      this.clear();
    },
  },

  pageLifeTimes: {},

  methods: {
    // 点击商品卡片触发的事件
    clickHandle() {
      this.triggerEvent('click', { goods: this.data.goods });
    },

    // 点击商品缩略图触发的事件
    clickThumbHandle() {
      this.triggerEvent('thumb', { goods: this.data.goods });
    },

    // 点击添加购物车按钮触发的事件
    addCartHandle(e) {
      const { id } = e.currentTarget;
      const { id: cardID } = e.currentTarget.dataset;
      this.triggerEvent('add-cart', {
        ...e.detail,
        id,
        cardID,
        goods: this.data.goods,
      });
    },

    // 生成独立的组件 ID
    genIndependentID(id) {
      let independentID;
      if (id) {
        independentID = id;
      } else {
        independentID = `goods-card-${~~(Math.random() * 10 ** 8)}`;
      }
      this.setData({ independentID });
    },

    // 初始化组件
    init() {
      const { thresholds, id } = this.properties;
      this.genIndependentID(id);
      if (thresholds && thresholds.length) {
        this.createIntersectionObserverHandle();
      }
    },

    // 清理组件资源
    clear() {
      this.clearIntersectionObserverHandle();
    },

    intersectionObserverContext: null, // 交叉观察器上下文

    // 创建交叉观察器
    createIntersectionObserverHandle() {
      if (this.intersectionObserverContext || !this.data.independentID) {
        return;
      }
      this.intersectionObserverContext = this.createIntersectionObserver({
        thresholds: this.properties.thresholds,
      }).relativeToViewport();

      this.intersectionObserverContext.observe(
        `#${this.data.independentID}`,
        (res) => {
          this.intersectionObserverCB(res);
        },
      );
    },

    // 交叉观察器回调
    intersectionObserverCB() {
      this.triggerEvent('ob', {
        goods: this.data.goods,
        context: this.intersectionObserverContext,
      });
    },

    // 清除交叉观察器
    clearIntersectionObserverHandle() {
      if (this.intersectionObserverContext) {
        try {
          this.intersectionObserverContext.disconnect();
        } catch (e) { }
        this.intersectionObserverContext = null;
      }
    },
  },
});
