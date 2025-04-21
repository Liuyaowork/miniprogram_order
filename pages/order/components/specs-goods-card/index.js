Component({
  options: {
    addGlobalClass: true, // 允许全局样式影响组件
    multipleSlots: true, // 启用多 slot 支持
  },

  externalClasses: [
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
      type: 'ancestor', // 定义父子关系
      linked(target) {
        this.parent = target; // 关联父组件
      },
    },
  },

  properties: {
    id: String, // 商品 ID
    hidden: {
      // 控制组件显示/隐藏
      type: null, // 设置为 null 表示不做类型转换
      observer(hidden) {
        // 监听 hidden 属性变化
        if (hidden !== null) {
          this.setHidden(!!hidden); // 更新隐藏状态
        }
      },
    },
    data: Object, // 商品数据
    layout: {
      type: String,
      value: 'horizontal', // 布局方式，默认水平布局
    },
    thumbMode: {
      type: String,
      value: 'aspectFill', // 缩略图模式
    },
    thumbWidth: Number, // 缩略图宽度
    thumbHeight: Number, // 缩略图高度
    thumbWidthInPopup: Number, // 弹窗中的缩略图宽度
    thumbHeightInPopup: Number, // 弹窗中的缩略图高度
    priceFill: {
      type: Boolean,
      value: true, // 是否填充价格
    },
    currency: {
      type: String,
      value: '¥', // 货币符号
    },
    lazyLoad: Boolean, // 是否启用懒加载
    centered: Boolean, // 是否居中显示
    showCart: Boolean, // 是否显示购物车按钮
    pricePrefix: String, // 价格前缀
    cartSize: {
      type: Number,
      value: 48, // 购物车图标大小
    },
    cartColor: {
      type: String,
      value: '#FA550F', // 购物车图标颜色
    },
    disablePopup: Boolean, // 是否禁用弹窗
  },

  data: {
    hiddenInData: false, // 内部隐藏状态
    specsPopup: {
      insert: false, // 是否插入规格弹窗
      show: false, // 是否显示规格弹窗
    },
  },

  currentInTapSpecs: false, // 当前是否点击规格

  lifetimes: {
    ready() {
      // 组件初始化完成时调用
      const { hidden } = this.properties;
      if (hidden !== null) {
        this.setHidden(!!hidden); // 初始化隐藏状态
      }
    },
  },

  methods: {
    // 关闭规格弹窗
    closeSpecsPopup() {
      this.setData({
        'specsPopup.show': false,
      });
      this.triggerEvent('specsclose', { good: this.properties.data }); // 触发规格关闭事件
    },

    // 移除规格弹窗
    removeSpecsPopup() {
      this.setData({
        'specsPopup.insert': false,
      });
    },

    // 点击事件
    onClick(e) {
      if (this.currentInTapSpecs) {
        this.currentInTapSpecs = false;
        return;
      }
      this.triggerEvent('click', e.detail); // 触发点击事件
    },

    // 点击缩略图事件
    onClickThumb(e) {
      this.triggerEvent('thumb', e.detail); // 触发缩略图点击事件
    },

    // 点击标签事件
    onClickTag(e) {
      this.triggerEvent('tag', e.detail); // 触发标签点击事件
    },

    // 点击购物车事件
    onClickCart(e) {
      this.triggerEvent('add-cart', e.detail); // 触发添加到购物车事件
    },

    // 设置隐藏状态
    setHidden(hidden) {
      this.setData({ hiddenInData: !!hidden });
    },
  },
});
