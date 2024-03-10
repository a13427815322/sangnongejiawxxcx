// pages/newdetail/newdetail.ts
import moment from "moment"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsdetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: 'http://localhost:3002/getnewdetail',
      method: 'POST',
      data: { id: options.id },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        res.data.datetime = moment(res.data.datetime).format('YYYY-MM-DD')
        res.data.content = JSON.parse(res.data.content)
        this.setData({
          newsdetail: res.data
        })
      },
      fail: (error) => { }
    })
  },
  onClickLeft() {
    wx.navigateBack({
      delta: 1
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