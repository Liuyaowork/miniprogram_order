Component({
  properties: {
    // 控制组件显示/隐藏
    show: Boolean,
    // 弹窗标题
    title: String,
    // 选项列表
    options: {
      type: Object,
      observer() {
        this.init(); // 当 options 发生变化时重新初始化
      },
    },
    // 是否支持多选
    multiple: {
      type: Boolean,
      observer() {
        this.init(); // 当 multiple 发生变化时重新初始化
      },
    },
    // 是否显示确认按钮
    showConfirmButton: Boolean,
    // 是否显示关闭按钮
    showCloseButton: Boolean,
    // 确认按钮文本
    confirmButtonText: {
      type: String,
      value: '确定',
    },
    // 取消按钮文本
    cancelButtonText: {
      type: String,
      value: '取消',
    },
    // 未选择时的提示文本
    emptyTip: {
      type: String,
      value: '请选择',
    },
  },

  data: {
    // 内部选项列表
    _options: [],
    // 已选中选项的索引
    checkedIndexes: [],
  },

  methods: {
    // 组件挂载时调用
    attached() {
      this.toast = this.selectComponent('#t-toast'); // 获取 toast 组件实例
    },

    // 初始化选项数据
    init() {
      const checkedIndexes = [];
      const _options = this.properties.options.map((opt, i) => {
        const checked = !!opt.checked; // 判断选项是否已选中
        if (checked) {
          if (this.properties.multiple) checkedIndexes[0] = i; // 多选模式
          else checkedIndexes.push(i); // 单选模式
        }
        return {
          title: opt.title,
          checked,
        };
      });
      this.setData({ checkedIndexes, _options }); // 更新数据
    },

    // 选项点击事件
    onOptionTap(e) {
      const { index } = e.currentTarget.dataset; // 获取点击的选项索引
      const { checkedIndexes } = this.data;
      let data = {};
      if (this.properties.multiple) {
        // 多选模式
        if (checkedIndexes.includes(index)) {
          // 如果已选中则取消选中
          checkedIndexes.splice(index, 1);
          data = { checkedIndexes, [`_options[${index}].checked`]: false };
        } else {
          // 如果未选中则选中
          checkedIndexes.push(index);
          data = { checkedIndexes, [`_options[${index}].checked`]: true };
        }
      } else {
        // 单选模式
        if (checkedIndexes[0] === index) {
          // 单选不可取消选择
          return;
        }
        data = {
          [`_options[${index}].checked`]: true,
          checkedIndexes: [index],
        };
        if (checkedIndexes[0] !== undefined) {
          // 取消之前选中的选项
          data[`_options[${checkedIndexes[0]}].checked`] = false;
        }
      }
      this.setData(data); // 更新数据
      this.triggerEvent('select', { index }); // 触发 select 事件
      this._onOptionTap && this._onOptionTap(index); // 调用自定义回调
      if (!this.properties.showConfirmButton && !this.properties.multiple) {
        // 没有确认按钮且是单选的情况下，选择选项则自动确定
        this._onConfirm && this._onConfirm([index]);
        this.setData({ show: false }); // 隐藏组件
      }
    },

    // 取消按钮点击事件
    onCancel() {
      this.triggerEvent('cancel'); // 触发 cancel 事件
      this._onCancel && this._onCancel(); // 调用自定义回调
      this.setData({ show: false }); // 隐藏组件
    },

    // 确认按钮点击事件
    onConfirm() {
      if (this.data.checkedIndexes.length === 0) {
        // 如果未选择任何选项，显示提示
        this.toast.show({
          icon: '',
          text: this.properties.emptyTip,
        });
        return;
      }
      const indexed = this.data.checkedIndexes;
      this.triggerEvent('confirm', { indexed }); // 触发 confirm 事件
      this._onConfirm && this._onConfirm(indexed); // 调用自定义回调
      this.setData({ show: false }); // 隐藏组件
    },
  },
});
