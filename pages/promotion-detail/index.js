import Toast from 'tdesign-miniprogram/toast/index';
import { fetchPromotion } from '../../services/promotion/detail';

Page({
  data: {
    list: [],
    banner: '',
    time: 0,
    showBannerDesc: false,
    statusTag: '',
  },

  /**
   * 页面加载时触发，获取促销活动商品列表。
   * @param {Object} query 页面传递的参数。
   * @param {string} query.promotion_id 促销活动 ID。
   */
  onLoad(query) {
    const promotionID = parseInt(query.promotion_id);
    this.getGoodsList(promotionID);
  },

  /**
   * 获取促销活动的商品列表并更新页面数据。
   * @param {number} promotionID 促销活动 ID。
   */
  getGoodsList(promotionID) {
    fetchPromotion(promotionID).then(
      ({ list, banner, time, showBannerDesc, statusTag }) => {
        const goods = list.map((item) => ({
          ...item,
          tags: item.tags.map((v) => v.title),
        }));
        this.setData({
          list: goods,
          banner,
          time,
          showBannerDesc,
          statusTag,
        });
      },
    );
  },

  /**
   * 商品点击事件处理，跳转到商品详情页面。
   * @param {Object} e 事件对象。
   * @param {number} e.detail.index 被点击的商品索引。
   */
  goodClickHandle(e) {
    const { index } = e.detail;
    const { spuId } = this.data.list[index];
    wx.navigateTo({ url: `/pages/goods/details/index?spuId=${spuId}` });
  },

  /**
   * 卡片点击事件处理，显示加购提示。
   */
  cardClickHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加购',
    });
  },

  /**
   * 横幅点击事件处理，显示规则详情提示。
   */
  bannerClickHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击规则详情',
    });
  },
});
