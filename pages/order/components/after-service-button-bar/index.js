import Dialog from 'tdesign-miniprogram/dialog/index';
import Toast from 'tdesign-miniprogram/toast/index';

import { cancelRights } from '../../after-service-detail/api';
import { ServiceButtonTypes } from '../../config';

Component({
  properties: {
    service: {
      type: Object,
      observer(service) {
        // 监听 service 属性的变化，并更新按钮数据
        const buttonsRight = service.buttons || service.buttonVOs || [];
        this.setData({
          buttons: {
            left: [],
            right: buttonsRight,
          },
        });
      },
    },
  },

  data: {
    service: {},
    buttons: {
      left: [],
      right: [],
    },
  },

  methods: {
    // 点击【订单操作】按钮，根据按钮类型分发处理逻辑
    onServiceBtnTap(e) {
      const { type } = e.currentTarget.dataset;
      switch (type) {
        case ServiceButtonTypes.REVOKE:
          // 撤销退货申请
          this.onConfirm(this.data.service);
          break;
        case ServiceButtonTypes.FILL_TRACKING_NO:
          // 填写物流单号
          this.onFillTrackingNo(this.data.service);
          break;
        case ServiceButtonTypes.CHANGE_TRACKING_NO:
          // 修改物流单号
          this.onChangeTrackingNo(this.data.service);
          break;
        case ServiceButtonTypes.VIEW_DELIVERY:
          // 查看物流详情
          this.viewDelivery(this.data.service);
          break;
      }
    },

    // 跳转到填写物流单号页面
    onFillTrackingNo(service) {
      wx.navigateTo({
        url: `/pages/order/fill-tracking-no/index?rightsNo=${service.id}`,
      });
    },

    // 跳转到物流详情页面
    viewDelivery(service) {
      wx.navigateTo({
        url: `/pages/order/delivery-detail/index?data=${JSON.stringify(
          service.logistics || service.logisticsVO,
        )}&source=2`,
      });
    },

    // 跳转到修改物流单号页面
    onChangeTrackingNo(service) {
      wx.navigateTo({
        url: `/pages/order/fill-tracking-no/index?rightsNo=${
          service.id
        }&logisticsNo=${service.logisticsNo}&logisticsCompanyName=${
          service.logisticsCompanyName
        }&logisticsCompanyCode=${service.logisticsCompanyCode}&remark=${
          service.remark || ''
        }`,
      });
    },

    // 弹出确认对话框，确认是否撤销退货申请
    onConfirm() {
      Dialog.confirm({
        title: '是否撤销退货申请？',
        content: '',
        confirmBtn: '撤销申请',
        cancelBtn: '不撤销',
      }).then(() => {
        const params = { rightsNo: this.data.service.id };
        // 调用接口撤销退货申请
        return cancelRights(params).then(() => {
          // 显示撤销成功的提示
          Toast({
            context: this,
            selector: '#t-toast',
            message: '你确认撤销申请',
          });
        });
      });
    },
  },
});
