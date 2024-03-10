// pages/dingdan/dingdan.ts
import Dialog from "@vant/weapp/dialog/dialog";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dingdanlist: [],
    tabindex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      tabindex: options.status
    })
    this.getdingdan()
  },
  getdingdan() {
    const _id = wx.getStorageSync('_id')
    wx.request({
      url: 'http://localhost:3002/getdingdan',
      method: 'POST',
      data: { _id, status: this.data.tabindex },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        console.log(res)
        res.data.forEach(element => {
          element.shopcart = JSON.parse(element.shopcart)
        });
        this.setData({
          dingdanlist: res.data
        })
      },
      fail: (error) => { }
    })

  },
  changetabindex(e) {
    console.log(e.currentTarget.dataset.tabindex)
    this.setData({
      tabindex: e.currentTarget.dataset.tabindex
    })
    this.getdingdan()
  },
  onClickLeft() {
    wx.switchTab({
      url: '../me/me'
    })
  },
  todingdandetail(e) {
    wx.navigateTo({
      url: './dingdandetail?dingdanid=' + e.currentTarget.dataset.dingdanid
    })
  },
  deldingdan(e) {
    Dialog.confirm({
      title: '取消订单',
      message: '确认取消订单吗',
    })
      .then(() => {
        // on confirm
        wx.request({
          url: 'http://localhost:3002/deldingdan',
          method: 'POST',
          data: { dingdanid: e.currentTarget.dataset.dingdanid },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            wx.showToast({
              title: '订单取消成功',
              icon: 'none'
            })
            this.getdingdan()
          },
          fail: (error) => { }
        })
      })
      .catch(() => {
        // on cancel

      });
  },
  topay(e) {
    Dialog.confirm({
      title: '付款',
      message: '确认支付商品吗',
    })
      .then(() => {
        // on confirm
        wx.request({
          url: 'http://localhost:3002/topay',
          method: 'POST',
          data: { dingdanid: e.currentTarget.dataset.dingdanid },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            this.setData({
              tabindex: 2
            })
            this.getdingdan()
            wx.showToast({
              title: '付款成功',
              icon: 'none'
            })
          },
          fail: (error) => { }
        })
      })
      .catch(() => {
        // on cancel

      });
  },
  toshouhuo(e) {
    Dialog.confirm({
      title: '收货',
      message: '确认收货吗',
    })
      .then(() => {
        // on confirm
        wx.request({
          url: 'http://localhost:3002/toshouhuo',
          method: 'POST',
          data: { dingdanid: e.currentTarget.dataset.dingdanid },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            this.setData({
              tabindex: 4
            })
            this.getdingdan()
          },
          fail: (error) => { }
        })
      })
      .catch(() => {
        // on cancel

      });
  },
  tocomment(e) {
    wx.navigateTo({
      url: '../comment/comment?dingdanid=' + e.currentTarget.dataset.dingdanid
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