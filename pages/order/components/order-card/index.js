import { orderStatusToName } from '../../../../services/order/order';

Component({
  externalClasses: ['wr-class', 'header-class', 'title-class'], // 支持外部样式类

  options: {
    multipleSlots: true, // 启用多插槽支持
  },

  relations: {
    '../order-goods-card/index': {
      type: 'descendant', // 定义父子关系
      linked(target) {
        this.children.push(target); // 添加子组件到 children 列表
        this.setHidden(); // 根据显示状态设置子组件隐藏
      },
      unlinked(target) {
        // 从 children 列表中移除子组件
        this.children = this.children.filter((item) => item !== target);
      },
    },
    '../goods-card/index': {
      type: 'descendant',
      linked(target) {
        this.children.push(target);
        this.setHidden();
      },
      unlinked(target) {
        this.children = this.children.filter((item) => item !== target);
      },
    },
    '../specs-goods-card/index': {
      type: 'descendant',
      linked(target) {
        this.children.push(target);
        this.setHidden();
      },
      unlinked(target) {
        this.children = this.children.filter((item) => item !== target);
      },
    },
  },

  created() {
    this.children = []; // 初始化子组件列表
  },

  properties: {
    order: {
      type: Object, // 订单对象
      observer(order) {
        const goodsCount = order?.orderItems?.length; // 获取订单商品数量
        if (typeof goodsCount !== 'number') return;

        this.setData({
          goodsCount, // 更新商品数量
        });
      },
    },
    useTopLeftSlot: Boolean, // 是否使用顶部左侧插槽
    useTopRightSlot: Boolean, // 是否使用顶部右侧插槽
    defaultShowNum: {
      type: null, // 初始显示的商品数量
      value: 10, // 默认值为 10
    },
  },

  data: {
    showAll: true, // 是否展示所有商品，设置为 false 时可展开更多
    goodsCount: 0, // 商品数量
  },

  methods: {
    // 设置子组件的隐藏状态
    setHidden() {
      const isHidden = !this.data.showAll; // 根据 showAll 状态决定是否隐藏
      this.children.forEach((c, i) => i >= this.properties.defaultShowNum && c.setHidden(isHidden));
    },

    // 点击订单卡片触发事件
    onOrderCardTap() {
      this.triggerEvent('cardtap'); // 触发 cardtap 事件
    },

    // 点击“展开更多”按钮
    onShowMoreTap() {
      this.setData({ showAll: true }, () => this.setHidden()); // 展开所有商品
      this.triggerEvent('showall'); // 触发 showall 事件
    },
  },
});
