import Toast from 'tdesign-miniprogram/toast/index'; // 引入Toast组件，用于显示提示信息
import { getCates } from '../../../services/cate/cate'; // 引入获取分类数据的服务方法

Page({
  data: {
    cates: [], // 存储商品分类列表
  },
  async init() {
    try {
      // 调用服务方法获取商品分类列表
      const cates = await getCates();
      // 更新页面数据
      this.setData({ cates });
    } catch (e) {
      // 获取分类列表失败时，打印错误日志并显示提示信息
      console.error('获取商品分类列表失败', e);
      Toast({
        context: this, // 指定上下文
        selector: '#t-toast', // Toast组件的选择器
        message: '获取商品分类列表失败', // 提示信息内容
        duration: 1000, // 提示信息显示时长
        icon: '', // 不显示图标
      });
    }
  },

  onShow() {
    // 初始化底部TabBar
    this.getTabBar().init();
  },
  onChange(e) {
    // 获取选中分类的ID
    const cateId = e?.detail?.item?._id;
    // 跳转到商品列表页面，并传递分类ID参数
    wx.navigateTo({
      url: `/pages/goods/list/index?cateId=${cateId}`,
    });
  },
  onLoad() {
    // 页面加载时初始化数据
    this.init(true);
  },
});
