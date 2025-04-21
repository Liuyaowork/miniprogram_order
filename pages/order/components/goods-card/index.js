Component({
  options: {
    multipleSlots: true, // 启用多slot支持
    addGlobalClass: true, // 允许全局样式影响组件
  },
  intersectionObserverContext: null, // 用于存储IntersectionObserver上下文

  externalClasses: [
    'card-class', // 卡片样式类
    'title-class', // 标题样式类
    'desc-class', // 描述样式类
    'num-class', // 数量样式类
    'thumb-class', // 缩略图样式类
    'specs-class', // 规格样式类
    'price-class', // 价格样式类
    'origin-price-class', // 原价样式类
    'price-prefix-class', // 价格前缀样式类
  ],

  relations: {
    '../order-card/index': {
      type: 'ancestor', // 定义父子组件关系
      linked(target) {
        this.parent = target; // 保存父组件引用
      },
    },
  },

  properties: {
    hidden: {
      type: null, // 不做类型转换
      value: false,
      observer(hidden) {
        // 监听hidden属性变化，设置组件显示/隐藏状态
        if (hidden !== null) {
          this.setHidden(!!hidden);
        }
      },
    },
    id: {
      type: String,
      value: '',
      observer: (id) => {
        // 生成独立ID并创建IntersectionObserver
        this.genIndependentID(id);
        if (this.properties.thresholds?.length) {
          this.createIntersectionObserverHandle();
        }
      },
    },
    data: {
      type: Object,
      observer(goods) {
        // 监听商品数据变化，处理商品渲染逻辑
        if (!goods) {
          return;
        }

        // 设置换行数量默认值
        if (goods.lineClamp === undefined || goods.lineClamp <= 0) {
          if ((goods.tags?.length || 0) > 0 && !goods.hideKey?.tags) {
            goods.lineClamp = 1; // 有标签时换行1行
          } else {
            goods.lineClamp = 2; // 默认换行2行
          }
        }
        // 拼接规格信息
        goods.specs = goods.sku.attr_value.map((v) => v.value).join('，');

        this.setData({ goods });
      },
    },
    layout: {
      type: String,
      value: 'horizontal', // 布局方式，默认为水平布局
    },
    thumbMode: {
      type: String,
      value: 'aspectFill', // 缩略图模式，默认为填充模式
    },
    thumbWidth: Number, // 缩略图宽度
    thumbHeight: Number, // 缩略图高度
    priceFill: {
      type: Boolean,
      value: true, // 是否填充价格
    },
    currency: {
      type: String,
      value: '¥', // 货币符号，默认为人民币
    },
    lazyLoad: {
      type: Boolean,
      value: false, // 是否懒加载
    },
    centered: {
      type: Boolean,
      value: false, // 是否居中显示
    },
    showCart: {
      type: Boolean,
      value: false, // 是否显示购物车
    },
    pricePrefix: {
      type: String,
      value: '', // 价格前缀
    },
    cartSize: {
      type: Number,
      value: 48, // 购物车图标大小
    },
    cartColor: {
      type: String,
      value: '#FA550F', // 购物车图标颜色
    },
    thresholds: {
      type: Array,
      value: [], // 元素可见监控阈值
      observer(current) {
        if (current && current.length) {
          this.createIntersectionObserverHandle();
        } else {
          this.clearIntersectionObserverHandle();
        }
      },
    },
    specsIconClassPrefix: {
      type: String,
      value: 'wr', // 规格图标类前缀
    },
    specsIcon: {
      type: String,
      value: 'expand_more', // 规格图标
    },
    addCartIconClassPrefix: {
      type: String,
      value: 'wr', // 加入购物车图标类前缀
    },
    addCartIcon: {
      type: String,
      value: 'cart', // 加入购物车图标
    },
  },

  data: {
    hiddenInData: false, // 控制组件隐藏状态
    independentID: '', // 独立ID
    goods: { id: '' }, // 商品数据
    isValidityLinePrice: false, // 是否显示划线价格
  },

  lifetimes: {
    ready() {
      this.init(); // 初始化组件
    },
    detached() {
      this.clear(); // 清理组件
    },
  },

  methods: {
    clickHandle() {
      // 触发点击事件
      this.triggerEvent('click', { goods: this.data.goods });
    },
    clickThumbHandle() {
      // 触发缩略图点击事件
      this.triggerEvent('thumb', { goods: this.data.goods });
    },
    clickTagHandle(evt) {
      // 触发标签点击事件
      const { index } = evt.currentTarget.dataset;
      this.triggerEvent('tag', { goods: this.data.goods, index });
    },
    addCartHandle(e) {
      // 加入购物车事件
      const { id } = e.currentTarget;
      const { id: cardID } = e.currentTarget.dataset;
      this.triggerEvent('add-cart', {
        ...e.detail,
        id,
        cardID,
        goods: this.data.goods,
      });
    },
    genIndependentID(id, cb) {
      // 生成独立ID
      let independentID;
      if (id) {
        independentID = id;
      } else {
        independentID = `goods-card-${~~(Math.random() * 10 ** 8)}`;
      }
      this.setData({ independentID }, cb);
    },
    init() {
      // 初始化组件逻辑
      const { thresholds, id, hidden } = this.properties;
      if (hidden !== null) {
        this.setHidden(!!hidden);
      }

      this.genIndependentID(id || '', () => {
        if (thresholds && thresholds.length) {
          this.createIntersectionObserverHandle();
        }
      });
    },
    clear() {
      // 清理IntersectionObserver
      this.clearIntersectionObserverHandle();
    },
    setHidden(hidden) {
      // 设置组件隐藏状态
      this.setData({ hiddenInData: !!hidden });
    },
    createIntersectionObserverHandle() {
      // 创建IntersectionObserver
      if (this.intersectionObserverContext || !this.data.independentID) {
        return;
      }

      this.intersectionObserverContext = wx
        .createIntersectionObserver(this, {
          thresholds: this.properties.thresholds,
        })
        .relativeToViewport();

      this.intersectionObserverContext.observe(`#${this.data.independentID}`, (res) => {
        this.intersectionObserverCB(res);
      });
    },
    intersectionObserverCB(ob) {
      // IntersectionObserver回调
      this.triggerEvent('ob', {
        goods: this.data.goods,
        context: this.intersectionObserverContext,
        ob,
      });
    },
    clearIntersectionObserverHandle() {
      // 清理IntersectionObserver上下文
      if (this.intersectionObserverContext) {
        try {
          this.intersectionObserverContext.disconnect();
        } catch (e) {}

        this.intersectionObserverContext = null;
      }
    },
  },
});
