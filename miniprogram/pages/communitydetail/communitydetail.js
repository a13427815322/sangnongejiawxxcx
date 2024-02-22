// pages/communitydetail/communitydetail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpCommunityList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: 'http://localhost:3002/getCommunityDetail',
      method: 'POST',
      data: {
        id: options.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        let helpCommunityList = res.data;
        helpCommunityList.forEach(element => {
          element.fileurls = JSON.parse(element.fileurls)
        });
        // 将数据按照 creattime 降序排列
        this.setData({
          helpCommunityList: helpCommunityList,
        });

      },
      fail: (error) => {
        console.error('获取 helpcommunity 数据失败：', error);
      },
    });
  },
  onClickLeft() {
    wx.navigateBack({ delta: 1 });
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