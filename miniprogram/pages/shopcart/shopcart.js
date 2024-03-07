// pages/shopcart/shopcart.ts
import Dialog from "@vant/weapp/dialog/dialog";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopcart: [],
    result: [],
    totalprice: 0,
    allchecked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  getshopcart() {
    const _id = wx.getStorageSync('_id')

    if (_id) {
      wx.request({
        url: 'http://localhost:3002/getshopcart',
        method: 'POST',
        data: { _id },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: (res) => {
          console.log(res)
          this.setData({
            shopcart: res.data
          })
        },
        fail: (error) => {

        },
      });
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
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  oncheckshop(event) {
    const { shopcart } = this.data
    const idattr = shopcart.map(item => `${item.id}`);
    const allchecked = idattr.sort().join() === event.detail.sort().join();
    this.setData({
      result: event.detail,
      allchecked
    });
    this.computeprice()
  },
  deleteshopcart(e) {
    console.log(e.currentTarget.dataset.id)
    Dialog.confirm({
      title: '删除',
      message: '确定要把这个宝贝从购物车删除吗',
    })
      .then(() => {
        // on confirm
        wx.request({
          url: 'http://localhost:3002/deleteshopcart',
          method: 'POST',
          data: { id: e.currentTarget.dataset.id },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            wx.showToast({
              title: res.data.message,
              icon: 'success'
            })
            this.getshopcart()
          },
          fail: (error) => {

          },
        });
      })
      .catch(() => {
        // on cancel

      });
  },
  tostepper(event) {
    console.log(event)
    const { id } = event.currentTarget.dataset
    let { shopcart } = this.data
    shopcart.forEach((item) => {
      if (item.id == id) {
        item.iscount = true
      }
    })
    this.setData({
      shopcart
    })
  },
  changeshopcartcount(event) {
    const { id } = event.currentTarget.dataset
    let { shopcart } = this.data
    shopcart.forEach((item) => {
      if (item.id == id) {
        item.count = event.detail
      }
    })
    this.setData({
      shopcart
    })
    this.computeprice()
    wx.request({
      url: 'http://localhost:3002/updatashopcartcount',
      method: 'POST',
      data: { id, count: event.detail },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {

      },
      fail: (error) => {

      },
    });
  },

  computeprice() {
    const { result, shopcart } = this.data
    let totalprice = 0
    for (const id of result) {
      // 查找第二个数组中匹配id的对象
      const matchedObject = shopcart.find((item) => {
        return item.id == id
      });
      // 如果找到匹配的对象，则将count和price相加
      if (matchedObject) {
        totalprice += matchedObject.count * matchedObject.price;
      }
    }
    this.setData({
      totalprice: totalprice * 100
    })
  },
  tocheckall(e) {
    if (!e.detail) {
      this.setData({
        allchecked: e.detail,
        result: []
      })
    } else {
      const idattr = this.data.shopcart.map(item => `${item.id}`)
      this.setData({
        allchecked: e.detail,
        result: idattr
      })
    }
    this.computeprice()
  },
  tocreatedingdan() {
    let shopcartlist = this.data.result
    for (let i in shopcartlist) {
      shopcartlist[i] = parseInt(shopcartlist[i])
    }
    shopcartlist = JSON.stringify(shopcartlist)
    wx.navigateTo({
      url: '../dingdan/creatdingdan?shopcartlist=' + [shopcartlist]
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
    this.getshopcart()

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