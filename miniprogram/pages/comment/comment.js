// pages/comment/comment.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dingdanid: 0,
    dingdandetail: {},
    temspuid: 0,
    temskuid: 0,
    showcomment: false,
    comment: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      dingdanid: options.dingdanid
    })
    this.getdingdancomment()
  },
  getdingdancomment() {
    wx.request({
      url: 'http://localhost:3002/getdingdandetail',
      method: 'POST',
      data: { dingdanid: this.data.dingdanid },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        res.data[0].shopcart = JSON.parse(res.data[0].shopcart)
        res.data[0].shopcart = res.data[0].shopcart.filter(item => !item.iscomment)
        if (res.data[0].shopcart.length == 0) {
          wx.request({
            url: 'http://localhost:3002/dingdaned',
            method: 'POST',
            data: { dingdanid: this.data.dingdanid },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            success: (response) => {
              wx.navigateBack({
                delta: 1
              })
            },
            fail: (error) => { }
          })

        }
        this.setData({
          dingdandetail: res.data[0]
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
  tocomment(e) {
    this.setData({
      temspuid: e.currentTarget.dataset.spuid,
      temskuid: e.currentTarget.dataset.skuid,
      showcomment: true
    })
  },
  closecomment() {
    this.setData({
      temskuid: 0,
      temspuid: 0,
      showcomment: false,
      comment: ''
    })
  },
  changecoment(e) {
    this.setData({
      comment: e.detail
    })
  },
  commentspu() {
    const _id = wx.getStorageSync('_id')
    wx.request({
      url: 'http://localhost:3002/commentspu',
      method: 'POST',
      data: { skuid: this.data.temskuid, spuid: this.data.temspuid, comment: this.data.comment, dingdanid: this.data.dingdandetail.dingdanid, _id },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        })
        this.setData({
          showcomment: false,
        })
        setTimeout(() => {
          this.setData({
            temspuid: 0,
            comment: '',
          })
          this.getdingdancomment()
        }, 300);

      },
      fail: (error) => { }
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