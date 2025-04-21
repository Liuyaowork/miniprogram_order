Page({
  data: {
    logisticsData: {
      logisticsNo: '', // 物流单号
      nodes: [], // 物流节点信息
      company: '', // 物流公司名称
      phoneNumber: '', // 物流公司联系电话
    },
    active: 0, // 当前激活的物流节点索引
  },

  onLoad(query) {
    let data;
    try {
      // 尝试解析传入的物流数据
      data = JSON.parse(decodeURIComponent(query.data || '{}'));
    } catch (e) {
      console.warn('物流节点数据解析失败', e); // 捕获解析失败的异常
    }
    if (Number(query.source) === 2) {
      // 如果来源为 2，则处理服务端返回的物流数据
      const service = {
        company: data.logisticsCompanyName, // 物流公司名称
        logisticsNo: data.logisticsNo, // 物流单号
        nodes: data.nodes, // 物流节点信息
      };
      this.setData({
        logisticsData: service, // 更新物流数据
      });
    } else if (data) {
      // 如果数据存在，直接更新物流数据
      this.setData({ logisticsData: data });
    }
  },

  // 复制物流单号到剪贴板
  onLogisticsNoCopy() {
    wx.setClipboardData({ data: this.data.logisticsData.logisticsNo });
  },

  // 拨打物流公司电话
  onCall() {
    const { phoneNumber } = this.data.logisticsData;
    wx.makePhoneCall({
      phoneNumber, // 使用物流公司联系电话
    });
  },
});
