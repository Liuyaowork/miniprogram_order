Component({
  properties: {
    show: {
      type: Boolean,
      observer(show) {
        // 当 show 属性变化时，如果为 true，则更新选择器数据
        if (!show) return;
        this.updateDivisions();
      },
    },
    title: {
      type: String,
      value: '', // 选择器标题
    },
    value: {
      type: String,
      value: '', // 当前选中的值
      observer() {
        // 当 value 属性变化时，如果选择器显示，则更新数据
        if (!this.data.show) return;
        this.updateDivisions();
      },
    },
    pickerOptions: {
      type: Array,
      value: [], // 选择器选项列表
      observer() {
        // 当选项列表变化时，如果选择器显示，则更新数据
        if (!this.data.show) return;
        this.updateDivisions();
      },
    },
    headerVisible: {
      type: Boolean,
      value: true, // 是否显示选择器头部
    },
  },
  data: {
    pickerValue: [], // 当前选择的索引值
  },
  methods: {
    updateDivisions() {
      // 更新选择器的当前选中项
      const { pickerOptions, value } = this.data;
      const index = (pickerOptions || []).findIndex(
        (item) => item.code === value, // 根据 code 匹配选中项
      );

      setTimeout(() => {
        this.setData({ pickerValue: index >= 0 ? [index] : [0] }); // 设置选中索引
      }, 0);
    },

    getAreaByIndex(indexes) {
      // 根据索引获取选中的选项
      const { pickerOptions } = this.data;
      return pickerOptions[indexes.toString()];
    },

    onChange(e) {
      // 当选择器的值发生变化时触发
      const currentValue = e.detail.value;
      const target = this.getAreaByIndex(currentValue);
      if (target === null) return;

      this.setData({ pickerValue: currentValue }); // 更新当前选中值
      this.triggerEvent('change', { value: target.code, target: target }); // 触发 change 事件
    },

    onConfirm() {
      // 点击确认按钮时触发
      const target = this.getAreaByIndex(this.data.pickerValue);
      this.triggerEvent('confirm', { value: target?.code, target }); // 触发 confirm 事件
    },

    onClose() {
      // 点击关闭按钮时触发
      this.triggerEvent('close'); // 触发 close 事件
    },
  },
});
