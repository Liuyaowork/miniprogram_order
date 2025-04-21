import { fetchPerson } from '../../../services/usercenter/fetchPerson'; // 引入获取用户信息的服务
import { phoneEncryption } from '../../../utils/util'; // 引入手机号加密工具函数
import Toast from 'tdesign-miniprogram/toast/index'; // 引入Toast组件用于消息提示

Page({
  data: {
    personInfo: {
      avatarUrl: '', // 用户头像URL
      nickName: '', // 用户昵称
      gender: 0, // 用户性别，0表示未知
      phoneNumber: '', // 用户手机号
    },
    showUnbindConfirm: false, // 是否显示解绑确认弹窗
    pickerOptions: [
      {
        name: '男', // 性别选项：男
        code: '1', // 对应的代码
      },
      {
        name: '女', // 性别选项：女
        code: '2', // 对应的代码
      },
    ],
    typeVisible: false, // 性别选择器是否可见
    genderMap: ['', '男', '女'], // 性别映射表
  },
  onLoad() {
    this.init(); // 页面加载时初始化
  },
  init() {
    this.fetchData(); // 初始化时获取用户数据
  },
  fetchData() {
    // 获取用户信息并更新页面数据
    fetchPerson().then((personInfo) => {
      this.setData({
        personInfo, // 更新用户信息
        'personInfo.phoneNumber': phoneEncryption(personInfo.phoneNumber), // 加密手机号后更新
      });
    });
  },
  onClickCell({ currentTarget }) {
    // 处理点击单元格事件
    const { dataset } = currentTarget; // 获取点击的目标数据集
    const { nickName } = this.data.personInfo; // 获取用户昵称

    switch (dataset.type) {
      case 'gender': // 点击性别单元格
        this.setData({
          typeVisible: true, // 显示性别选择器
        });
        break;
      case 'name': // 点击昵称单元格
        wx.navigateTo({
          url: `/pages/usercenter/name-edit/index?name=${nickName}`, // 跳转到昵称编辑页面
        });
        break;
      case 'avatarUrl': // 点击头像单元格
        this.toModifyAvatar(); // 调用修改头像方法
        break;
      default: {
        break;
      }
    }
  },
  onClose() {
    // 关闭性别选择器
    this.setData({
      typeVisible: false,
    });
  },
  onConfirm(e) {
    // 确认选择性别
    const { value } = e.detail; // 获取选择的性别值
    this.setData(
      {
        typeVisible: false, // 隐藏性别选择器
        'personInfo.gender': value, // 更新用户性别
      },
      () => {
        // 显示成功提示
        Toast({
          context: this,
          selector: '#t-toast',
          message: '设置成功',
          theme: 'success',
        });
      },
    );
  },
  async toModifyAvatar() {
    // 修改用户头像
    try {
      const tempFilePath = await new Promise((resolve, reject) => {
        wx.chooseImage({
          count: 1, // 允许选择一张图片
          sizeType: ['compressed'], // 压缩图片
          sourceType: ['album', 'camera'], // 来源：相册或相机
          success: (res) => {
            const { path, size } = res.tempFiles[0]; // 获取图片路径和大小
            if (size <= 10485760) {
              resolve(path); // 图片大小符合要求
            } else {
              reject({ errMsg: '图片大小超出限制，请重新上传' }); // 图片过大
            }
          },
          fail: (err) => reject(err), // 选择图片失败
        });
      });
      const tempUrlArr = tempFilePath.split('/'); // 分割路径获取文件名
      const tempFileName = tempUrlArr[tempUrlArr.length - 1];
      Toast({
        context: this,
        selector: '#t-toast',
        message: `已选择图片-${tempFileName}`, // 显示选择的图片文件名
        theme: 'success',
      });
    } catch (error) {
      if (error.errMsg === 'chooseImage:fail cancel') return; // 用户取消选择图片
      Toast({
        context: this,
        selector: '#t-toast',
        message: error.errMsg || error.msg || '修改头像出错了', // 显示错误信息
        theme: 'error',
      });
    }
  },
});
