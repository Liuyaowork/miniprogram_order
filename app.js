import updateManager from './common/updateManager'; // 引入更新管理器
import { init } from '@cloudbase/wx-cloud-client-sdk'; // 引入云开发客户端 SDK 初始化方法

// 初始化云开发环境
wx.cloud.init({
  env: 'your-env-id', // 指定云开发环境 ID
});

const client = init(wx.cloud); // 初始化云开发客户端
const models = client.models; // 获取云开发数据模型
globalThis.dataModel = models; // 将数据模型挂载到全局对象
// 接下来就可以调用 models 上的数据模型增删改查等方法了

App({
  onLaunch: function () {
    // 小程序启动时触发
  },
  onShow: function () {
    // 小程序显示时触发
    updateManager(); // 检查小程序更新
  },
});
