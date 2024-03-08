// pages/dingdan/creatdingdan.ts
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: {},
    shopcartlist: [],
    totalprice: 0,
    list: []
  },
  tochoseadress() {
    wx.navigateTo({
      url: '../setting/location?isskudetail=true'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const _id = wx.getStorageSync('_id')
    wx.request({
      url: 'http://localhost:3002/getadress',
      method: 'POST',
      data: { _id },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        console.log(res)
        this.setData({
          location: res.data[0]
        }
        )

      },
      fail: (error) => {

      },
    });
    if (options.shopcartlist) {
      const { shopcartlist } = options

      wx.request({
        url: 'http://localhost:3002/getshopcartdingdan',
        method: 'POST',
        data: { shopcartlist: shopcartlist },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: (res) => {
          console.log(res)
          let totalprice = 0
          res.data.forEach(element => {
            element.skusaleattrvalueList = JSON.parse(element.skusaleattrvalueList)
            totalprice = totalprice + element.count * element.price
          });
          this.setData({
            shopcartlist: res.data,
            totalprice: totalprice,
            list: options.shopcartlist
          })
        },
        fail: (error) => {

        },
      });
    }

  },
  onClickLeft() {
    wx.navigateBack({
      delta: 1
    })
  },
  tocreatedingdan() {
    const _id = wx.getStorageSync('_id')
    const { list, shopcartlist, location } = this.data
    Dialog.confirm({
      title: '付款',
      message: '请进行付款',
    })
      .then(() => {
        // on confirm
        wx.request({
          url: 'http://localhost:3002/createpaydingdan',
          method: 'POST',
          data: { _id, list, shopcartlist: JSON.stringify(shopcartlist), adress: JSON.stringify(location) },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            wx.navigateTo({
              url: './dingdandetail?dingdanid=' + res.data.insertId
            })
            wx.showToast({
              title: res.data.message,
              icon: 'success'
            })

          },
          fail: (error) => {

          },
        });
      })
      .catch(() => {
        wx.request({
          url: 'http://localhost:3002/createwantpaydingdan',
          method: 'POST',
          data: { _id, list, shopcartlist: JSON.stringify(shopcartlist), adress: JSON.stringify(location) },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            wx.navigateTo({
              url: './dingdandetail?dingdanid=' + res.data.insertId
            })
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })

          },
          fail: (error) => {

          },
        });
        // on cancel

      });

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