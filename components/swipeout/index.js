let ARRAY = []; // 存储所有组件实例的数组
Component({
  externalClasses: ['wr-class'], // 外部样式类

  options: {
    multipleSlots: true, // 启用多插槽支持
  },
  properties: {
    disabled: Boolean, // 是否禁用滑动
    leftWidth: {
      type: Number,
      value: 0, // 左侧滑动区域的宽度
    },
    rightWidth: {
      type: Number,
      value: 0, // 右侧滑动区域的宽度
    },
    asyncClose: Boolean, // 是否启用异步关闭
  },
  attached() {
    // 组件实例被添加到页面时，将其加入数组
    ARRAY.push(this);
  },

  detached() {
    // 组件实例被移除时，从数组中删除
    ARRAY = ARRAY.filter((item) => item !== this);
  },

  /**
   * Component initial data
   */
  data: {
    wrapperStyle: '', // 包裹样式
    asyncClose: false, // 是否异步关闭
    closed: true, // 是否处于关闭状态
  },

  /**
   * Component methods
   */
  methods: {
    // 打开滑动菜单
    open(position) {
      this.setData({ closed: false }); // 设置为打开状态
      // 触发 close 事件，通知父组件
      this.triggerEvent('close', {
        position, // 打开的位置（左侧或右侧）
        instance: this, // 当前组件实例
      });
    },

    // 关闭滑动菜单
    close() {
      this.setData({ closed: true }); // 设置为关闭状态
    },

    // 关闭其他组件的滑动菜单
    closeOther() {
      ARRAY.filter((item) => item !== this).forEach((item) => item.close());
    },

    // 空操作方法
    noop() {
      return;
    },

    // 点击事件处理
    onClick(event) {
      const { key: position = 'outside' } = event.currentTarget.dataset; // 获取点击位置
      this.triggerEvent('click', position); // 触发 click 事件

      if (this.data.closed) {
        return; // 如果已关闭，不执行后续操作
      }

      if (this.data.asyncClose) {
        // 如果启用了异步关闭，触发 close 事件
        this.triggerEvent('close', {
          position,
          instance: this,
        });
      } else {
        this.close(); // 否则直接关闭
      }
    },
  },
});
