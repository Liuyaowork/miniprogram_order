/*
 * @作者: rileycai
 * @日期: 2022-03-05 16:47:16
 * @最后编辑时间: 2022-03-05 16:48:32
 * @最后编辑者: rileycai
 * @描述:
 * @文件路径: /tdesign-miniprogram-starter/pages/order/order-confirm/components/address-card/index.js
 */
Component({
  externalClasses: ['wr-class'], // 支持外部样式类
  properties: {
    addressData: {
      type: Object,
      value: {}, // 地址数据
    },
  },
  methods: {
    onAddressTap() {
      // 点击地址卡片触发事件
      this.triggerEvent('addressclick');
    },
    onAddTap() {
      // 点击新增地址按钮触发事件
      this.triggerEvent('addclick');
    },
  },
});
