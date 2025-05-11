import updateManager from './common/updateManager'; // 引入更新管理器
import { init } from '@cloudbase/wx-cloud-client-sdk'; // 引入云开发客户端 SDK 初始化方法

// 初始化云开发环境
wx.cloud.init({
  env: 'order-a-meal-1ggrepgz20e9c999', // 指定云开发环境 ID
});

const client = init(wx.cloud); // 初始化云开发客户端
const models = client.models; // 获取云开发数据模型
globalThis.dataModel = models; // 将数据模型挂载到全局对象
// 接下来就可以调用 models 上的数据模型增删改查等方法了

App({
  onLaunch: function () {
    // 生命周期回调——监听小程序初始化。
    wx.cloud.init({
      // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      env: 'order-a-meal-1ggrepgz20e9c999',
      // 是否在将用户访问记录到用户管理中，在控制台中可见，默认为false
      traceUser: false,
    });
  },
  onShow: function () {
    // 生命周期回调——监听小程序启动或切前台
    updateManager(); // 检查小程序更新
  },
});