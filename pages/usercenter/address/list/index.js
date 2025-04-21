/* eslint-disable no-param-reassign */
import { getAllAddress, deleteAddress } from '../../../../services/address/address'; // 引入获取和删除地址的服务
import Toast from 'tdesign-miniprogram/toast/index'; // 引入Toast组件用于消息提示
import { resolveAddress, rejectAddress } from './util'; // 引入地址选择工具
import { shouldFresh, addressListFinishFresh } from '../../../../utils/addressListFresh'; // 引入地址列表刷新工具
import { objectToParamString } from '../../../../utils/util'; // 引入对象转参数字符串工具

Page({
  data: {
    addressList: [], // 地址列表
    deleteID: '', // 待删除的地址ID
    showDeleteConfirm: false, // 是否显示删除确认弹窗
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

  /**
   * 如果是 true 的话，点击后会选中并返回上一页；否则点击后会进入编辑页
   */
  selectMode: false, // 是否为选择模式
  /** 是否已经选择地址，不置为 true 的话页面离开时会触发取消选择行为 */
  hasSelect: false, // 是否已选择地址

  onLoad(query) {
    // 页面加载时初始化
    const { selectMode, id = '' } = query;
    this.setData({
      id,
    });
    this.selectMode = selectMode === 'true'; // 判断是否为选择模式
    this.init();
  },

  onShow() {
    // 页面显示时刷新地址列表
    shouldFresh && this.fresh();
  },

  init() {
    // 初始化地址列表
    this.fresh();
  },
  onUnload() {
    // 页面卸载时处理未选择地址的情况
    if (this.selectMode && !this.hasSelect) {
      rejectAddress();
    }
  },
  async fresh() {
    // 刷新地址列表
    this.setLoading();
    try {
      await this.getAddressList();
      addressListFinishFresh(); // 通知刷新完成
    } catch {
      this.toast('拉取地址失败，请稍后再试'); // 显示失败提示
    } finally {
      this.unsetLoading();
    }
  },
  async getAddressList() {
    // 获取地址列表
    const addressList = await getAllAddress();
    this.setData({ addressList });
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
  async deleteAddressHandle({ detail: { _id } }) {
    // 删除地址
    try {
      this.setLoading();
      await deleteAddress({ id: _id });
      const { addressList } = this.data;
      this.setData({ addressList: addressList.filter((x) => x._id !== _id) }); // 更新地址列表
    } catch {
      this.toast('删除地址失败，请稍后再试'); // 显示失败提示
    } finally {
      this.unsetLoading();
    }
  },
  editAddressHandle({ detail }) {
    // 跳转到编辑地址页面
    wx.navigateTo({ url: `/pages/usercenter/address/edit/index?${objectToParamString(detail)}` });
  },
  selectHandle({ detail }) {
    // 选择地址
    if (this.selectMode) {
      this.hasSelect = true;
      resolveAddress(detail); // 解析选择的地址
      wx.navigateBack({ delta: 1 }); // 返回上一页
    } else {
      this.editAddressHandle({ detail }); // 编辑地址
    }
  },
  createHandle() {
    // 跳转到新增地址页面
    wx.navigateTo({ url: '/pages/usercenter/address/edit/index' });
  },
});
