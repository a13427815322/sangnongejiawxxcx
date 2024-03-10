// pages/setting/setting.ts
import Dialog from "@vant/weapp/dialog/dialog";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  onClickLeft() {
    wx.navigateBack({ delta: 1 });
  },
  toloacation() {
    wx.navigateTo({
      url: './location',
    })
  },
  exitlogin() {
    Dialog.confirm({
      title: '退出登录',
      message: '确定退出登录吗',
    })
      .then(() => {
        // on confirm
        wx.clearStorageSync('_id')
        wx.showToast({
          title: '退出登录成功',
          icon: 'none'
        })
        wx.navigateBack({
          delta: 1
        })
      })
      .catch(() => {
        // on cancel

      });
  },
  toedituserinfo() {
    wx.navigateTo({
      url: '../edituserinfo/edituserinfo'
    })
  },
  tousersafe() {
    wx.navigateTo({
      url: '../usersafe/usersafe'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const _id = wx.getStorageSync('_id')
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