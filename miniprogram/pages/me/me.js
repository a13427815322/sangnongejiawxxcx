// pages/me/me.ts
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    userInfo: {},
    isuserinfo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  onlogin() {
    wx.navigateTo({ url: '../login/login' })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
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
      wx.request({
        url: 'http://localhost:3002/getuserinfo',
        method: 'POST',
        data: {
          _id: _id,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: (res) => {
          console.log(res.data);
          const userInfo = res.data;

          // 在这里处理获取到的用户信息
          // 更新页面数据，展示用户信息
          this.setData({
            userInfo: userInfo,
            isuserinfo: true,
          });

        },
        fail: (error) => {
          console.error('获取用户信息请求失败：', error);
          // 请求失败时，显示错误信息
          wx.showToast({
            title: '获取用户信息失败，请重试',
            icon: 'none',
            duration: 2000,
          });
        },
      });
    } else {
      this.setData({
        isuserinfo: false,
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  toseeting() {
    wx.navigateTo({
      url: '../setting/setting'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})