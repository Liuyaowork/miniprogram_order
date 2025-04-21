import TabMenu from './data';
Component({
  data: {
    active: 0, // 当前激活的 tab 索引
    list: TabMenu, // tab 菜单列表
  },

  methods: {
    // 处理 tab 切换事件
    onChange(event) {
      this.setData({ active: event.detail.value }); // 更新激活的 tab 索引
      wx.switchTab({
        // 切换到对应的页面
        url: this.data.list[event.detail.value].url.startsWith('/')
          ? this.data.list[event.detail.value].url
          : `/${this.data.list[event.detail.value].url}`,
      });
    },

    // 初始化 tab 激活状态
    init() {
      const page = getCurrentPages().pop(); // 获取当前页面实例
      const route = page ? page.route.split('?')[0] : ''; // 获取当前页面的路由
      const active = this.data.list.findIndex(
        (item) =>
          (item.url.startsWith('/') ? item.url.substr(1) : item.url) ===
          `${route}`, // 匹配当前页面路由对应的 tab 索引
      );
      this.setData({ active }); // 设置激活的 tab 索引
    },
  },
});
