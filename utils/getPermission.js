const getPermission = ({ code, name }) => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        // 检查用户是否拒绝了权限
        if (res.authSetting[code] === false) {
          wx.showModal({
            title: `获取${name}失败`,
            content: `获取${name}失败，请在【右上角】-小程序【设置】项中，将【${name}】开启。`,
            confirmText: '去设置',
            confirmColor: '#FA550F',
            cancelColor: '取消',
            success(res) {
              if (res.confirm) {
                // 用户点击“去设置”，打开设置页面
                wx.openSetting({
                  success(settinRes) {
                    if (settinRes.authSetting[code] === true) {
                      // 用户在设置页面开启了权限
                      resolve();
                    } else {
                      // 用户未开启权限
                      console.warn('用户未打开权限', name, code);
                      reject();
                    }
                  },
                });
              } else {
                // 用户取消操作
                reject();
              }
            },
            fail() {
              // 弹窗调用失败
              reject();
            },
          });
        } else {
          // 用户已授权或权限未被拒绝
          resolve();
        }
      },
      fail() {
        // 获取设置失败
        reject();
      },
    });
  });
};

module.exports = {
  getPermission,
};
