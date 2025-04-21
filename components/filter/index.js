Component({
  externalClasses: ['wr-class'],

  options: {
    multipleSlots: true,
  },

  properties: {
    overall: {
      type: Number,
      value: 1,
      observer(overall) {
        // 当 overall 属性发生变化时，更新组件数据
        this.setData({
          overall,
        });
      },
    },
    layout: {
      type: Number,
      value: 1,
      observer(layout) {
        // 当 layout 属性发生变化时，更新组件数据
        this.setData({
          layout,
        });
      },
    },
    sorts: {
      type: String,
      value: '',
      observer(sorts) {
        // 当 sorts 属性发生变化时，更新组件数据
        this.setData({
          sorts,
        });
      },
    },
    color: {
      type: String,
      value: '#FA550F', // 默认颜色值
    },
  },

  data: {
    layout: 1, // 布局模式
    overall: 1, // 综合排序状态
    sorts: '', // 排序方式
  },

  methods: {
    // 切换布局显示模式
    onChangeShowAction() {
      const { layout } = this.data;
      const nextLayout = layout === 1 ? 0 : 1;
      // 触发 change 事件，通知父组件布局模式的变化
      this.triggerEvent('change', { ...this.properties, layout: nextLayout });
    },

    // 切换价格排序方式
    handlePriseSort() {
      const { sorts } = this.data;
      // 触发 change 事件，通知父组件价格排序方式的变化
      this.triggerEvent('change', {
        ...this.properties,
        overall: 0, // 重置综合排序
        sorts: sorts === 'desc' ? 'asc' : 'desc', // 切换排序方式
      });
    },

    // 打开筛选弹窗
    open() {
      // 触发 showFilterPopup 事件，通知父组件显示筛选弹窗
      this.triggerEvent('showFilterPopup', {
        show: true,
      });
    },

    // 切换综合排序状态
    onOverallAction() {
      const { overall } = this.data;
      const nextOverall = overall === 1 ? 0 : 1;
      const nextData = {
        sorts: '', // 重置排序方式
        prices: [], // 清空价格筛选
      };
      // 触发 change 事件，通知父组件综合排序状态的变化
      this.triggerEvent('change', {
        ...this.properties,
        ...nextData,
        overall: nextOverall,
      });
    },
  },
});
