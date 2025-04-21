// 引入云开发模板配置
import { cloudbaseTemplateConfig } from '../../config/index';

Component({
  properties: {
    // 控制组件显示的属性，默认值取决于配置中的 useMock
    show: {
      type: Boolean,
      value: cloudbaseTemplateConfig.useMock,
    },
    // 弹窗标题
    title: {
      type: String,
      value: '安装模板后端',
    },
    // 弹窗内容文本
    text: {
      type: String,
      value: '当前为前端模拟数据，如需使用模板后端，请打开下方链接，跟随指引进行安装',
    },
    // 模板后端安装指引链接
    url: {
      type: String,
      value:
        'https://tcb.cloud.tencent.com/cloud-template/detail?appName=electronic-business&from=wxide_tcb_shop',
    },
  },

  data: {
    // 控制对话框显示状态
    dialogShow: false,
  },

  methods: {
    // 打开对话框
    open() {
      this.setData({ dialogShow: true });
    },
    // 关闭对话框
    close() {
      this.setData({ dialogShow: false });
    },
    // 复制链接到剪贴板
    copy() {
      wx.setClipboardData({
        data: this.data.url,
      });
    },
  },
});
