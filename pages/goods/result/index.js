/* eslint-disable no-param-reassign */
import Toast from 'tdesign-miniprogram/toast/index';
import { listGood, getPrice } from '../../../services/good/spu';
import { getCloudImageTempUrl } from '../../../utils/cloudImageHandler';
import { LIST_LOADING_STATUS } from '../../../utils/listLoading';

const initFilters = {
  overall: 1, // 综合排序
  sorts: '', // 排序方式
};

Page({
  data: {
    goodsList: [], // 商品列表
    sorts: '', // 当前排序方式
    overall: 1, // 综合排序标志
    show: false, // 筛选弹窗显示状态
    minVal: '', // 最小价格
    maxVal: '', // 最大价格
    minSalePriceFocus: false, // 最小价格输入框焦点状态
    maxSalePriceFocus: false, // 最大价格输入框焦点状态
    filter: initFilters, // 筛选条件
    hasLoaded: false, // 是否已加载
    keywords: '', // 搜索关键词
    loadMoreStatus: 0, // 加载更多状态
    loading: true, // 加载状态
  },

  total: 0, // 商品总数
  pageNum: 1, // 当前页码
  pageSize: 30, // 每页大小

  // 页面加载时触发
  onLoad(options) {
    const { searchValue = '' } = options || {};
    this.setData(
      {
        keywords: searchValue, // 设置搜索关键词
      },
      () => {
        this.init(true); // 初始化数据
      },
    );
  },

  // 生成查询参数
  generalQueryData(reset = false) {
    const { filter, keywords, minVal, maxVal } = this.data;
    const { pageNum, pageSize } = this;
    const { sorts, overall } = filter;
    const params = {
      sort: 0, // 默认综合排序
      pageNum: 1,
      pageSize: 30,
      keyword: keywords, // 搜索关键词
    };

    // 根据排序方式设置参数
    if (sorts) {
      params.sort = 1; // 按价格排序
      params.sortType = sorts === 'desc' ? 1 : 0; // 降序或升序
    }
    // 综合排序优先
    if (overall) {
      params.sort = 0;
    } else {
      params.sort = 1;
    }

    // 设置价格范围
    params.minPrice = minVal ? minVal * 100 : 0;
    params.maxPrice = maxVal ? maxVal * 100 : undefined;

    // 如果是重置操作，直接返回参数
    if (reset) return params;

    // 否则返回带分页的参数
    return {
      ...params,
      pageNum: pageNum + 1,
      pageSize,
    };
  },

  // 初始化数据
  async init(reset = true) {
    return this.loadGoodsList(reset); // 加载商品列表
  },

  // 加载商品列表
  async loadGoodsList(fresh = false) {
    this.setData({ loadMoreStatus: LIST_LOADING_STATUS.LOADING }); // 设置加载状态

    const pageSize = this.pageSize;
    const pageIndex = fresh ? 1 : this.pageNum;

    try {
      const { records: nextList, total } = await listGood({
        pageNumber: pageIndex,
        pageSize,
        search: this.data.keywords,
      });
      const images = nextList.map((x) => x.cover_image); // 提取商品封面图
      const handledImages = await getCloudImageTempUrl(images); // 获取临时图片地址
      handledImages.forEach((image, index) => (nextList[index].cover_image = image)); // 更新封面图
      await Promise.all(nextList.map(async (spu) => (spu.price = await getPrice(spu._id)))); // 获取商品价格

      const goodsList = fresh ? nextList : this.data.goodsList.concat(nextList); // 合并商品列表

      this.setData({
        goodsList,
        loadMoreStatus: goodsList.length >= total ? LIST_LOADING_STATUS.NO_MORE : LIST_LOADING_STATUS.READY, // 设置加载状态
        hasLoaded: true, // 设置已加载标志
      });

      this.pageNum = pageIndex + 1; // 更新页码
    } catch (err) {
      console.log('error', err); // 打印错误信息
      this.setData({ loadMoreStatus: LIST_LOADING_STATUS.FAILED }); // 设置加载失败状态
    }
  },

  // 跳转到购物车页面
  handleCartTap() {
    wx.switchTab({
      url: '/pages/cart/index',
    });
  },

  // 提交搜索关键词
  handleSubmit(e) {
    const keywords = e?.detail?.value ?? '';
    this.setData(
      {
        keywords,
        goodsList: [],
        loadMoreStatus: 0,
        hasLoaded: false,
      },
      () => {
        this.init(true); // 初始化数据
      },
    );
  },

  // 触底加载更多
  onReachBottom() {
    const { goodsList } = this.data;
    const { total = 0 } = this;
    if (goodsList.length === total) {
      this.setData({
        loadMoreStatus: 2, // 设置无更多数据状态
      });
      return;
    }
    this.init(false); // 加载更多数据
  },

  // 处理加购操作
  handleAddCart() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加购',
    });
  },

  // 跳转到商品详情页
  gotoGoodsDetail(e) {
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${e.detail.goods._id}`,
    });
  },

  // 处理筛选条件变化
  handleFilterChange(e) {
    const { overall, sorts } = e.detail;
    const { total } = this;
    const _filter = {
      sorts,
      overall,
    };
    this.setData({
      filter: _filter,
      sorts,
      overall,
    });

    this.pageNum = 1; // 重置页码
    this.setData(
      {
        goodsList: [],
        loadMoreStatus: 0,
      },
      () => {
        total && this.init(true); // 初始化数据
      },
    );
  },

  // 显示筛选弹窗
  showFilterPopup() {
    this.setData({
      show: true,
    });
  },

  // 关闭筛选弹窗
  showFilterPopupClose() {
    this.setData({
      show: false,
    });
  },

  // 设置最小价格
  onMinValAction(e) {
    const { value } = e.detail;
    this.setData({ minVal: value });
  },

  // 设置最大价格
  onMaxValAction(e) {
    const { value } = e.detail;
    this.setData({ maxVal: value });
  },

  // 重置筛选条件
  reset() {
    this.setData({ minVal: '', maxVal: '' });
  },

  // 确认筛选条件
  confirm() {
    const { minVal, maxVal } = this.data;
    let message = '';
    if (minVal && !maxVal) {
      message = `价格最小是${minVal}`;
    } else if (!minVal && maxVal) {
      message = `价格范围是0-${minVal}`;
    } else if (minVal && maxVal && minVal <= maxVal) {
      message = `价格范围${minVal}-${this.data.maxVal}`;
    } else {
      message = '请输入正确范围';
    }
    if (message) {
      Toast({
        context: this,
        selector: '#t-toast',
        message,
      });
    }
    this.pageNum = 1; // 重置页码
    this.setData(
      {
        show: false, // 关闭筛选弹窗
        minVal: '',
        goodsList: [],
        loadMoreStatus: 0, // 重置加载更多状态
        maxVal: '',
      },
      () => {
        this.init(); // 重新初始化数据
      },
    );
  },
});
