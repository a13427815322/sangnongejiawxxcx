// pages/dingdan/dingdandetail.ts
import moment from "moment";
import Dialog from "@vant/weapp/dialog/dialog";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dingdandetail: {},
    location: {},
    totalprice: 0,
    islookall: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: 'http://localhost:3002/getdingdandetail',
      method: 'POST',
      data: { dingdanid: options.dingdanid },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        res.data[0].adress = JSON.parse(res.data[0].adress)
        res.data[0].shopcart = JSON.parse(res.data[0].shopcart)
        res.data[0].cjtime = moment(res.data[0].cjtime).format('YYYY-MM-DD-HH:mm:ss')
        if (res.data[0].fukuantime) {
          res.data[0].fukuantime = moment(res.data[0].fukuantime).format('YYYY-MM-DD-HH:mm:ss')
        }
        if (res.data[0].fahuotime) {
          res.data[0].fahuotime = moment(res.data[0].fahuotime).format('YYYY-MM-DD-HH:mm:ss')
        }
        let totalprice = 0
        res.data[0].shopcart.forEach(element => {
          totalprice = totalprice + element.price * element.count
        });
        this.setData({
          dingdandetail: res.data[0],
          location: res.data[0].adress,
          totalprice
        })
      },
      fail: (error) => {

      },
    });
  },
  tolookall() {
    this.setData({
      islookall: !this.data.islookall
    })
  },
  onClickLeft() {
    if (this.data.dingdandetail.status == 5) {
      wx.navigateTo({
        url: './dingdan?status=' + 0
      })
    } else {
      wx.navigateTo({
        url: './dingdan?status=' + this.data.dingdandetail.status
      })
    }

  },
  deldingdan() {
    Dialog.confirm({
      title: '取消订单',
      message: '确认取消订单吗',
    })
      .then(() => {
        // on confirm
        wx.request({
          url: 'http://localhost:3002/deldingdan',
          method: 'POST',
          data: { dingdanid: this.data.dingdandetail.dingdanid },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            if (this.data.dingdandetail.status == 5) {
              wx.navigateTo({
                url: './dingdan?status=' + 0
              })
            } else {
              wx.navigateTo({
                url: './dingdan?status=' + this.data.dingdandetail.status
              })
            }
            wx.showToast({
              title: '订单取消成功',
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
  topay() {
    Dialog.confirm({
      title: '付款',
      message: '确认支付商品吗',
    })
      .then(() => {
        // on confirm
        wx.request({
          url: 'http://localhost:3002/topay',
          method: 'POST',
          data: { dingdanid: this.data.dingdandetail.dingdanid },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            wx.navigateTo({
              url: './dingdan?status=' + (this.data.dingdandetail.status + 1)
            })
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
  toshouhuo() {
    Dialog.confirm({
      title: '收货',
      message: '确认收货吗',
    })
      .then(() => {
        // on confirm
        wx.request({
          url: 'http://localhost:3002/toshouhuo',
          method: 'POST',
          data: { dingdanid: this.data.dingdandetail.dingdanid },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            wx.navigateTo({
              url: './dingdan?status=' + (this.data.dingdandetail.status + 1)
            })
          },
          fail: (error) => { }
        })
      })
      .catch(() => {
        // on cancel

      });
  },
  tocomment() {
    console.log(this.data.dingdandetail.dingdanid)
    wx.navigateTo({
      url: '../comment/comment?dingdanid=' + this.data.dingdandetail.dingdanid
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