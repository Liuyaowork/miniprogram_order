Component({
  options: {
    addGlobalClass: true, // 允许组件使用全局样式
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isAllSelected: {
      type: Boolean,
      value: false, // 是否全选
    },
    totalAmount: {
      type: Number,
      value: 1, // 总金额
    },
    totalGoodsNum: {
      type: Number,
      value: 0, // 商品总数
      observer(num) {
        // 监听商品总数变化，更新按钮禁用状态
        const isDisabled = num == 0;
        setTimeout(() => {
          this.setData({
            isDisabled,
          });
        });
      },
    },
    totalDiscountAmount: {
      type: Number,
      value: 0, // 总优惠金额
    },
    bottomHeight: {
      type: Number,
      value: 100, // 底部高度
    },
    fixed: Boolean, // 是否固定底部
  },
  data: {
    isDisabled: true, // 结算按钮是否禁用
  },

  methods: {
    // 全选按钮点击事件
    handleSelectAll() {
      const { isAllSelected } = this.data;
      this.setData({
        isAllSelected: !isAllSelected,
      });
      // 触发父组件事件，传递全选状态
      this.triggerEvent('handleSelectAll', {
        isAllSelected: isAllSelected,
      });
    },

    // 结算按钮点击事件
    handleToSettle() {
      if (this.data.isDisabled) return; // 如果按钮禁用，则不执行操作
      this.triggerEvent('handleToSettle'); // 触发父组件事件
    },
  },
});
