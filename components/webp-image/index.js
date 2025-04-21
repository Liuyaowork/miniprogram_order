/*
 * @Author: rileycai
 * @Date: 2022-03-14 14:21:26
 * @LastEditTime: 2022-03-14 15:23:04
 * @LastEditors: rileycai
 * @Description: webp-image组件对t-image包裹了一层，主要实现图片裁剪、webp压缩功能
 * @FilePath: /tdesign-miniprogram-starter/components/webp-image/index.js
 */
const systemInfo = wx.getSystemInfoSync(); // 获取系统信息
Component({
  externalClasses: ['t-class', 't-class-load'], // 外部样式类

  properties: {
    loadFailed: {
      type: String,
      value: 'default', // 加载失败时的样式
    },
    loading: {
      type: String,
      value: 'default', // 加载中时的样式
    },
    src: {
      type: String,
      value: '', // 图片的路径
    },
    mode: {
      type: String,
      value: 'aspectFill', // 图片裁剪模式
    },
    webp: {
      type: Boolean,
      value: true, // 是否启用 webp 格式
    },
    lazyLoad: {
      type: Boolean,
      value: false, // 是否启用懒加载
    },
    showMenuByLongpress: {
      type: Boolean,
      value: false, // 是否支持长按显示菜单
    },
  },

  data: {
    thumbHeight: 375, // 图片缩略图高度
    thumbWidth: 375, // 图片缩略图宽度
    systemInfo, // 系统信息
  },

  lifetimes: {
    ready() {
      // 组件初始化完成时调用
      const { mode } = this.properties;
      // 获取容器的真实宽高，设置图片的裁剪宽度或高度
      this.getRect('.J-image').then((res) => {
        if (res) {
          const { width, height } = res;
          this.setData(
            mode === 'heightFix'
              ? {
                  thumbHeight: this.px2rpx(height) || 375, // 设置高度
                }
              : {
                  thumbWidth: this.px2rpx(width) || 375, // 设置宽度
                },
          );
        }
      });
    },
  },

  methods: {
    // 将像素值转换为 rpx
    px2rpx(px) {
      return (750 / (systemInfo.screenWidth || 375)) * px;
    },

    // 获取指定选择器的矩形信息
    getRect(selector) {
      return new Promise((resolve) => {
        if (!this.selectorQuery) {
          this.selectorQuery = this.createSelectorQuery();
        }
        this.selectorQuery.select(selector).boundingClientRect(resolve).exec();
      });
    },

    // 图片加载成功时触发
    onLoad(e) {
      this.triggerEvent('load', e.detail);
    },

    // 图片加载失败时触发
    onError(e) {
      this.triggerEvent('error', e.detail);
    },
  },
});
