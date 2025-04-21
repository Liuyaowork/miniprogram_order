/* eslint-disable no-param-reassign */
import { getHomeSwiper } from '../../services/home/home';
import { listGood, getPrice } from '../../services/good/spu';
import { getCloudImageTempUrl } from '../../utils/cloudImageHandler';
import { LIST_LOADING_STATUS } from '../../utils/listLoading';

Page({
  data: {
    imgSrcs: [], // 轮播图图片地址
    tabList: [], // 标签列表
    goodsList: [], // 商品列表
    goodsListLoadStatus: LIST_LOADING_STATUS.READY, // 商品列表加载状态
    pageLoading: false, // 页面加载状态
    current: 1, // 当前轮播图索引
    autoplay: true, // 是否自动播放轮播图
    duration: '500', // 轮播图切换动画时长
    interval: 5000, // 轮播图切换间隔时间
    navigation: { type: 'dots' }, // 轮播图导航样式
    swiperImageProps: { mode: 'scaleToFill' } // 轮播图图片样式
  },

  goodListPagination: {
    index: 1, // 当前分页索引
    num: 20, // 每页加载的商品数量
  },

  privateData: {
    tabIndex: 0, // 当前选中的标签索引
  },

  onShow() {
    // 初始化自定义 tabBar
    this.getTabBar().init();
  },

  onLoad() {
    // 页面加载时初始化数据
    this.init();
  },

  onReachBottom() {
    // 触底加载更多商品
    if (this.data.goodsListLoadStatus === LIST_LOADING_STATUS.READY) {
      this.loadGoodsList();
    }
  },

  onPullDownRefresh() {
    // 下拉刷新页面
    this.init();
  },

  async init() {
    // 初始化页面数据
    wx.stopPullDownRefresh(); // 停止下拉刷新动画

    this.setData({
      pageLoading: false,
    });

    this.loadGoodsList(true); // 加载商品列表
    this.loadHomeSwiper(); // 加载轮播图数据
  },

  async loadHomeSwiper() {
    // 加载轮播图数据
    const { images } = await getHomeSwiper();
    const handledImages = await getCloudImageTempUrl(images);

    this.setData({ imgSrcs: handledImages });
  },

  onReTry() {
    // 重新加载商品列表
    this.loadGoodsList();
  },

  async loadGoodsList(fresh = false) {
    // 加载商品列表
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0, // 滚动到页面顶部
      });
    }

    this.setData({ goodsListLoadStatus: LIST_LOADING_STATUS.LOADING });

    const pageSize = this.goodListPagination.num;
    const pageIndex = fresh ? 1 : this.goodListPagination.num;

    try {
      const { records: nextList, total } = await listGood({ pageNumber: pageIndex, pageSize });
      const images = nextList.map((x) => x.cover_image);
      const handledImages = await getCloudImageTempUrl(images);
      handledImages.forEach((image, index) => (nextList[index].cover_image = image));
      await Promise.all(nextList.map(async (spu) => (spu.price = await getPrice(spu._id).catch(() => 0.01))));

      const goodsList = fresh ? nextList : this.data.goodsList.concat(nextList);

      this.setData({
        goodsList,
        goodsListLoadStatus: goodsList.length >= total ? LIST_LOADING_STATUS.NO_MORE : LIST_LOADING_STATUS.READY,
      });

      this.goodListPagination.index = pageIndex + 1;
      this.goodListPagination.num = pageSize;
    } catch (err) {
      console.error('error', err);
      this.setData({ goodsListLoadStatus: LIST_LOADING_STATUS.FAILED });
    }
  },

  goodListClickHandle(e) {
    // 商品点击事件处理
    const spuId = e?.detail?.goods?._id;
    if (typeof spuId !== 'string') return;
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}`,
    });
  },

  goodListAddCartHandle(e) {
    // 添加商品到购物车事件处理
    const spuId = e?.detail?.goods?._id;
    if (typeof spuId !== 'string') return;
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}`,
    });
  },

  navToSearchPage() {
    // 跳转到搜索页面
    wx.navigateTo({ url: '/pages/goods/search/index' });
  },

  navToActivityDetail({ detail }) {
    // 跳转到活动详情页面
    const { index: promotionID = 0 } = detail || {};
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
    });
  }
});
