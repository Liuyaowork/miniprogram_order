// 引入服务层函数
import { getSearchHistory, getSearchPopular } from '../../../services/good/fetchSearchHistory';

Page({
  data: {
    historyWords: [], // 搜索历史记录
    popularWords: [], // 热门搜索词
    searchValue: '', // 当前搜索值
    dialog: {
      title: '确认删除当前历史记录', // 弹窗标题
      showCancelButton: true, // 是否显示取消按钮
      message: '', // 弹窗消息
    },
    dialogShow: false, // 是否显示弹窗
  },

  deleteType: 0, // 删除类型（0：单条，1：全部）
  deleteIndex: '', // 删除的索引

  // 页面显示时查询历史记录和热门搜索词
  onShow() {
    this.queryHistory();
    this.queryPopular();
  },

  // 查询搜索历史记录
  async queryHistory() {
    try {
      const data = await getSearchHistory();
      const code = 'Success';
      if (String(code).toUpperCase() === 'SUCCESS') {
        const { historyWords = [] } = data;
        this.setData({
          historyWords,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },

  // 查询热门搜索词
  async queryPopular() {
    try {
      const data = await getSearchPopular();
      const code = 'Success';
      if (String(code).toUpperCase() === 'SUCCESS') {
        const { popularWords = [] } = data;
        this.setData({
          popularWords,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },

  // 确认删除历史记录
  confirm() {
    const { historyWords } = this.data;
    const { deleteType, deleteIndex } = this;
    historyWords.splice(deleteIndex, 1);
    if (deleteType === 0) {
      this.setData({
        historyWords,
        dialogShow: false,
      });
    } else {
      this.setData({ historyWords: [], dialogShow: false });
    }
  },

  // 关闭弹窗
  close() {
    this.setData({ dialogShow: false });
  },

  // 清空所有历史记录
  handleClearHistory() {
    const { dialog } = this.data;
    this.deleteType = 1;
    this.setData({
      dialog: {
        ...dialog,
        message: '确认删除所有历史记录',
      },
      dialogShow: true,
    });
  },

  // 删除单条历史记录
  deleteCurr(e) {
    const { index } = e.currentTarget.dataset;
    const { dialog } = this.data;
    this.deleteIndex = index;
    this.setData({
      dialog: {
        ...dialog,
        message: '确认删除当前历史记录',
        deleteType: 0,
      },
      dialogShow: true,
    });
  },

  // 点击历史记录进行搜索
  handleHistoryTap(e) {
    const { historyWords } = this.data;
    const { dataset } = e.currentTarget;
    const _searchValue = historyWords[dataset.index || 0] || '';
    if (_searchValue) {
      wx.navigateTo({
        url: `/pages/goods/result/index?searchValue=${_searchValue}`,
      });
    }
  },

  // 提交搜索
  handleSubmit(e) {
    const value = e?.detail?.value;
    if (!value) return;
    wx.navigateTo({
      url: `/pages/goods/result/index?searchValue=${value}`,
    });
  },
});
