import { getSkuDetail } from '../../../services/sku/sku';
import { getOrderItem } from '../../../services/order/orderItem';
import { getCommentsOfSpu } from '../../../services/comments/comments';
import { LIST_LOADING_STATUS } from '../../../utils/listLoading';
import dayjs from 'dayjs';

const layoutMap = {
  0: 'vertical', // 布局映射
};

Page({
  data: {
    commentList: [], // 评论列表
    layoutText: layoutMap[0], // 布局类型
    loadMoreStatus: 0, // 加载状态
    spuId: null, // 商品 ID
  },

  pageNumber: 1, // 当前页码
  pageSize: 10, // 每页评论数量

  async loadComments(refresh = false) {
    // 加载评论列表
    refresh && (this.pageNumber = 1); // 如果是刷新操作，重置页码

    this.setData({ loadMoreStatus: LIST_LOADING_STATUS.LOADING }); // 设置加载状态

    const { spuId } = this.data;
    const { pageNumber, pageSize } = this;
    try {
      // 获取评论数据
      const { records: newComments, total } = await getCommentsOfSpu({ spuId, pageNumber, pageSize });
      await Promise.all(
        newComments.map(async (x) => {
          // 获取订单项和商品详情
          const orderItemId = x.order_item._id;
          const {
            sku: { _id: skuId },
          } = await getOrderItem(orderItemId);
          const sku = await getSkuDetail(skuId);
          x.desc = sku.attr_value.map((x) => x.value).join('，'); // 拼接规格描述
          x.createdTimeString = dayjs(new Date(x.createdAt)).format('YYYY-MM-DD HH:mm:ss'); // 格式化创建时间
          x.user = x.createBy.substring(0, 10); // 截取用户名
        }),
      );

      this.pageNumber++; // 增加页码
      const commentList = refresh ? newComments : this.data.commentList.concat(newComments); // 合并评论列表
      this.setData({
        commentList,
        loadMoreStatus: commentList.length >= total ? LIST_LOADING_STATUS.NO_MORE : LIST_LOADING_STATUS.READY, // 更新加载状态
      });
    } catch (e) {
      console.error(e);
      this.setData({ loadMoreStatus: LIST_LOADING_STATUS.FAILED }); // 设置加载失败状态
    }
  },

  async onLoad(options) {
    // 页面加载时初始化数据
    const spuId = options?.spuId;
    if (typeof spuId !== 'string') {
      this.setData({ loadMoreStatus: LIST_LOADING_STATUS.FAILED }); // 设置加载失败状态
    } else {
      this.setData({ spuId }); // 设置商品 ID
    }

    this.loadComments(true); // 加载评论
  },

  onReachBottom() {
    // 触底加载更多评论
    if (this.data.loadMoreStatus == LIST_LOADING_STATUS.READY) this.loadComments(false);
  },
});
