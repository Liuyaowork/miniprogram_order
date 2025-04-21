import { getRightsList } from './api';
import { AfterServiceStatus, ServiceType, ServiceTypeDesc } from '../config';

Page({
  page: {
    size: 10, // 每页数据条数
    num: 1, // 当前页码
  },

  data: {
    tabs: [
      {
        key: -1, // 全部状态
        text: '全部',
      },
      {
        key: AfterServiceStatus.TO_AUDIT, // 待审核状态
        text: '待审核',
      },
      {
        key: AfterServiceStatus.THE_APPROVED, // 已审核状态
        text: '已审核',
      },
      {
        key: AfterServiceStatus.COMPLETE, // 已完成状态
        text: '已完成',
      },
      {
        key: AfterServiceStatus.CLOSED, // 已关闭状态
        text: '已关闭',
      },
    ],
    curTab: -1, // 当前选中的标签
    dataList: [], // 数据列表
    listLoading: 0, // 列表加载状态：0-未加载，1-加载中，2-已全部加载
    pullDownRefreshing: false, // 是否正在下拉刷新
    emptyImg:
      'https://cdn-we-retail.ym.tencent.com/miniapp/order/empty-order-list.png', // 空数据图片
    backRefresh: false, // 是否需要返回刷新
  },

  onLoad(query) {
    // 页面加载时初始化状态
    let status = parseInt(query.status);
    status = this.data.tabs.map((t) => t.key).includes(status) ? status : -1;
    this.init(status);
    this.pullDownRefresh = this.selectComponent('#wr-pull-down-refresh');
  },

  onShow() {
    // 页面显示时检查是否需要刷新数据
    if (!this.data.backRefresh) return;
    this.onRefresh();
    this.setData({
      backRefresh: false,
    });
  },

  onReachBottom() {
    // 触底加载更多数据
    if (this.data.listLoading === 0) {
      this.getAfterServiceList(this.data.curTab);
    }
  },

  onPageScroll(e) {
    // 处理页面滚动事件
    this.pullDownRefresh && this.pullDownRefresh.onPageScroll(e);
  },

  onPullDownRefresh_(e) {
    // 下拉刷新事件处理
    const { callback } = e.detail;
    this.setData({
      pullDownRefreshing: true,
    });
    this.refreshList(this.data.curTab)
      .then(() => {
        this.setData({
          pullDownRefreshing: false,
        });
        callback && callback();
      })
      .catch((err) => {
        this.setData({
          pullDownRefreshing: false,
        });
        Promise.reject(err);
      });
  },

  init(status) {
    // 初始化数据
    status = status !== undefined ? status : this.data.curTab;
    this.refreshList(status);
  },

  getAfterServiceList(statusCode = -1, reset = false) {
    // 获取售后服务列表
    const params = {
      parameter: {
        pageSize: this.page.size,
        pageNum: this.page.num,
      },
    };
    if (statusCode !== -1) params.parameter.afterServiceStatus = statusCode;
    this.setData({
      listLoading: 1, // 设置加载中状态
    });
    return getRightsList(params)
      .then((res) => {
        this.page.num++; // 页码递增
        let dataList = [];
        let { tabs } = this.data;
        if (res && res.data && res.data.states) {
          // 更新标签信息
          tabs = this.data.tabs.map((item) => {
            switch (item.key) {
              case AfterServiceStatus.TO_AUDIT:
                item.info = res.data.states.audit;
                break;
              case AfterServiceStatus.THE_APPROVED:
                item.info = res.data.states.approved;
                break;
              case AfterServiceStatus.COMPLETE:
                item.info = res.data.states.complete;
                break;
              case AfterServiceStatus.CLOSED:
                item.info = res.data.states.closed;
                break;
            }
            return item;
          });
        }
        if (res && res.data && res.data.dataList) {
          // 处理数据列表
          dataList = (res.data.dataList || []).map((_data) => {
            return {
              id: _data.rights.rightsNo, // 售后单号
              serviceNo: _data.rights.rightsNo,
              storeName: _data.rights.storeName, // 店铺名称
              type: _data.rights.rightsType, // 售后类型
              typeDesc: ServiceTypeDesc[_data.rights.rightsType], // 售后类型描述
              typeDescIcon:
                _data.rightsType === ServiceType.ONLY_REFUND
                  ? 'money-circle'
                  : 'return-goods-1', // 售后类型图标
              status: _data.rights.rightsStatus, // 售后状态
              statusName: _data.rights.userRightsStatusName, // 状态名称
              statusDesc: _data.rights.userRightsStatusDesc, // 状态描述
              amount: _data.rights.refundAmount, // 退款金额
              goodsList: _data.rightsItem.map((item, i) => ({
                id: i,
                thumb: item.goodsPictureUrl, // 商品图片
                title: item.goodsName, // 商品名称
                specs: (item.specInfo || []).map((s) => s.specValues || ''), // 商品规格
                itemRefundAmount: item.itemRefundAmount, // 商品退款金额
                rightsQuantity: item.itemRefundAmount, // 售后数量
              })),
              storeId: _data.storeId, // 店铺ID
              buttons: _data.buttonVOs || [], // 操作按钮
              logisticsNo: _data.logisticsVO.logisticsNo, // 退货物流单号
              logisticsCompanyName: _data.logisticsVO.logisticsCompanyName, // 退货物流公司
              logisticsCompanyCode: _data.logisticsVO.logisticsCompanyCode, // 退货物流公司代码
              remark: _data.logisticsVO.remark, // 退货备注
              logisticsVO: _data.logisticsVO, // 物流信息
            };
          });
        }
        return new Promise((resolve) => {
          if (reset) {
            // 重置数据列表
            this.setData(
              {
                dataList: [],
              },
              () => resolve(),
            );
          } else resolve();
        }).then(() => {
          // 更新数据列表和加载状态
          this.setData({
            tabs,
            dataList: this.data.dataList.concat(dataList),
            listLoading: dataList.length > 0 ? 0 : 2,
          });
        });
      })
      .catch((err) => {
        // 处理加载失败
        this.setData({
          listLoading: 3,
        });
        return Promise.reject(err);
      });
  },

  onReTryLoad() {
    // 重试加载数据
    this.getAfterServiceList(this.data.curTab);
  },

  onTabChange(e) {
    // 切换标签
    const { value } = e.detail;
    const tab = this.data.tabs.find((v) => v.key === value);
    if (!tab) return;
    this.refreshList(value);
  },

  refreshList(status = -1) {
    // 刷新数据列表
    this.page = {
      size: 10,
      num: 1,
    };
    this.setData({
      curTab: status,
      dataList: [],
    });
    return this.getAfterServiceList(status, true);
  },

  onRefresh() {
    // 手动刷新数据
    this.refreshList(this.data.curTab);
  },

  // 点击订单卡片
  onAfterServiceCardTap(e) {
    // 点击售后卡片跳转详情页
    wx.navigateTo({
      url: `/pages/order/after-service-detail/index?rightsNo=${e.currentTarget.dataset.order.id}`,
    });
  },
});
