// pages/community/community.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpCommunityList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  getHelpCommunityData: function () {
    wx.request({
      url: 'http://localhost:3002/getHelpCommunity',
      method: 'GET',
      success: (res) => {
        const helpCommunityList = res.data;
        console.log(helpCommunityList)
        // 将数据按照 creattime 降序排列
        helpCommunityList.sort((a, b) => {
          return new Date(b.creattime) - new Date(a.creattime);
        });
        helpCommunityList.forEach(element => {
          if (element.likelist.includes(wx.getStorageSync('_id'))) {
            element.islike = true
          } else {
            element.islike = false
          }
        });
        this.setData({
          helpCommunityList: helpCommunityList,
        });
      },
      fail: (error) => {
        console.error('获取 helpcommunity 数据失败：', error);
      },
    });
  },
  upvotecommunity(e) {
    const id = e.detail
    const _id = wx.getStorageSync('_id')
    wx.request({
      url: 'http://localhost:3002/upvotecommunity',
      method: 'POST',
      data: { id, _id },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        this.getHelpCommunityData()
      },
      fail: (error) => {
        console.error('获取 helpcommunity 数据失败：', error);
      }

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
    this.getHelpCommunityData();
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

  },
  toeditcommunity() {
    const _id = wx.getStorageSync('_id')
    if (_id) {
      wx.navigateTo({ url: 'editcommunity' })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'info',
        duration: 500,

      })
      setTimeout(() => {
        wx.navigateTo({
          url: '../login/login'
        })
      }, 500);




    }

  },
  tocomment(e) {
    console.log(e.detail)
    wx.navigateTo({
      url: '../communitydetail/communitydetail?id=' + e.detail
    })
  }

})