import Toast from 'tdesign-miniprogram/toast/index'; // 引入Toast组件用于消息提示
import { createAddress, updateAddress } from '../../../../services/address/address'; // 引入创建和更新地址的服务
import { addressListShouldFresh } from '../../../../utils/addressListFresh'; // 引入地址列表刷新工具

const innerPhoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'; // 内部手机号正则
const innerNameReg = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'; // 内部姓名正则

Page({
  options: {
    multipleSlots: true, // 支持多插槽
  },
  externalClasses: ['theme-wrapper-class'], // 外部样式类
  data: {
    detailAddress: '', // 详细地址
    name: '', // 收货人姓名
    phone: '', // 收货人手机号
    addressId: null, // 地址ID，区分新增和编辑
    loading: false, // 加载状态
  },
  setLoading() {
    // 设置加载状态为true
    this.setData({ loading: true });
  },
  unsetLoading() {
    // 设置加载状态为false
    this.setData({ loading: false });
  },
  onLoad(options) {
    // 页面加载时初始化数据
    const { name, address, _id, phone } = options;
    if (![name, address, _id, phone].every((x) => typeof x === 'string')) return;

    this.setData({
      name,
      detailAddress: address,
      addressId: _id,
      phone,
    });
  },
  onInputValue(event) {
    // 处理输入框值变化
    const {
      detail: { value },
      target: {
        dataset: { item },
      },
    } = event;
    this.setData({ [item]: value });
  },
  onCheckDefaultAddress({ detail }) {
    // 处理默认地址开关
    const { value } = detail;
    this.setData({
      'locationState.isDefault': value,
    });
  },
  onVerifyInputLegal() {
    // 验证输入是否合法
    const { name, phone, detailAddress } = this.data;
    const prefixPhoneReg = String(this.properties.phoneReg || innerPhoneReg);
    const prefixNameReg = String(this.properties.nameReg || innerNameReg);
    const nameRegExp = new RegExp(prefixNameReg);
    const phoneRegExp = new RegExp(prefixPhoneReg);

    if (!name || !name.trim()) {
      return {
        isLegal: false,
        tips: '请填写收货人',
      };
    }
    if (!nameRegExp.test(name)) {
      return {
        isLegal: false,
        tips: '收货人仅支持输入中文、英文（区分大小写）、数字',
      };
    }
    if (!phone || !phone.trim()) {
      return {
        isLegal: false,
        tips: '请填写手机号',
      };
    }
    if (!phoneRegExp.test(phone)) {
      return {
        isLegal: false,
        tips: '请填写正确的手机号',
      };
    }
    if (!detailAddress || !detailAddress.trim()) {
      return {
        isLegal: false,
        tips: '请完善详细地址',
      };
    }
    if (detailAddress && detailAddress.trim().length > 50) {
      return {
        isLegal: false,
        tips: '详细地址不能超过50个字符',
      };
    }
    return {
      isLegal: true,
      tips: '添加成功',
    };
  },
  toast(message) {
    // 显示提示信息
    Toast({
      context: this,
      selector: '#t-toast',
      message,
      icon: '',
      duration: 1000,
    });
  },
  async formSubmit() {
    // 提交表单
    const { isLegal, tips } = this.onVerifyInputLegal();

    if (isLegal) {
      const { detailAddress, name, phone, addressId } = this.data;
      this.setLoading();

      let action, failedMessage;
      if (typeof addressId === 'string') {
        // 编辑地址
        action = () => updateAddress({ name, address: detailAddress, phone, _id: addressId });
        failedMessage = '修改地址失败，请稍候重试';
      } else {
        // 新增地址
        action = () => createAddress({ name, phone, address: detailAddress });
        failedMessage = '添加地址失败，请稍候重试';
      }

      try {
        await action();
        addressListShouldFresh(); // 通知地址列表需要刷新
        wx.navigateBack({ delta: 1 }); // 返回上一页
      } catch {
        this.toast(failedMessage); // 显示失败提示
      } finally {
        this.unsetLoading(); // 取消加载状态
      }
    } else {
      this.toast(tips); // 显示验证失败提示
    }
  },
});
