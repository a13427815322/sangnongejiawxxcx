// app.ts
App({
  globalData: {
    userInfo: null,
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuTop: 0, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
  },
  onLaunch() {
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    wx.getSystemInfo({
      success: (res) => {
        console.log(res);
        this.globalData.systemInfo1 = res;
      }
    })
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏高度 + 44
    that.globalData.navBarHeight = systemInfo.statusBarHeight + 44;
    that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    that.globalData.menuTop = menuButtonInfo.top;
    that.globalData.menuHeight = menuButtonInfo.height;
    // 展示本地存储能力
    const _id = wx.getStorageSync('_id')
    if (_id) {
      wx.request({
        url: 'http://localhost:3002/getshopcartcount',
        method: 'POST',
        data: { _id },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: (res) => {
          if (res.data.shopcartcount) {
            wx.showTabBarRedDot({
              index: 3,
            });
            wx.setTabBarBadge({
              index: 3,
              text: res.data.shopcartcount > 99 ? '99+' : `${res.data.shopcartcount}`
            });
          } else {
            wx.hideTabBarRedDot({
              index: 3,
            });
            wx.removeTabBarBadge({
              index: 3,
            });
          }

        },
        fail: (error) => {

        },
      });
    }
  },
  onShow() {

  }
})