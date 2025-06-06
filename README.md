<<<<<<< HEAD
# miniprogram_order
=======
<br />
<div align="center">
    <img src="https://qcloudimg.tencent-cloud.cn/raw/f97dc74fbf9af5d7b2b3d8bc0a4e91d4.png" alt="Logo" width="400">

  <h1 align="center">胡图图甜品屋</h1>

  <p align="center">
  甜品屋
    <br />
  </p>
</div>

## 说明

本项目参考云开发电商模板的小程序，提供首页、购物车、订单、个人中心、商品详情等页面。

本项目默认使用体验数据运行，同时也能够使用真实数据。配置好云开发后端后，即可一键切换至真实数据。

注：体验数据通过本地 Mock 数据实现。

本项目的后端可前往<https://tcb.cloud.tencent.com/cloud-template/detail?appName=electronic-business&from=wxide_tcb_shop>安装。

## 社区

欢迎添加企微群沟通交流：

<div>
    <img src="https://qcloudimg.tencent-cloud.cn/raw/bbb904f6fd6da01aa677e8a31e37651d.jpg" style="width:30%;">
</div>

## 安装依赖

1. 安装 npm 依赖

```shell
npm install
```

 如果安装失败，请检查是否有足够权限执行命令，或尝试用更高权限安装依赖：

 ```shell
 sudo npm install
 ```

2. 构建 npm
点击微信开发者工具菜单栏中的「工具」->「构建 npm」

## 运行小程序

在微信开发者工具中导入本项目即可运行，若想配合后端运行完整应用，请前往<https://tcb.cloud.tencent.com/cloud-template/detail?appName=electronic-business&from=wxide_tcb_shop>安装。
>>>>>>> 1a29ee3 (debug)

## 文件结构
```
app.js                           // 小程序的主入口文件
app.json                         // 小程序的全局配置文件
app.wxss                         // 小程序的全局样式表
commitlint.config.js             // 提交信息校验配置
jsconfig.json                    // JavaScript 配置文件
LICENSE                          // 项目许可证
package.json                     // 项目依赖和脚本配置
project.config.json              // 微信开发者工具的项目配置
project.private.config.json      // 私有项目配置
README.md                        // 项目说明文档
sitemap.json                     // 小程序页面索引配置
common/                          // 公共模块
    updateManager.js
components/                      // 自定义组件
    cloud-template-guide/
    filter/
        filter-popup/
    goods-card/
    goods-list/
    load-more/
    loading-content/
    loading-dialog/
    price/
    swipeout/
    webp-image/
config/                          // 配置文件
    eslintCheck.js
    index.js
    model.js
custom-tab-bar/                  // 自定义底部导航栏
    data.js
    index.js
    index.json
    ...
miniprogram_npm/                 // npm 构建后的依赖
    ...
model/                           // 数据模型
    ...
pages/                           // 小程序页面
    ...
services/                        // 服务层代码
    ...
style/                           // 样式文件
    ...
utils/                           // 工具函数
    ...
```