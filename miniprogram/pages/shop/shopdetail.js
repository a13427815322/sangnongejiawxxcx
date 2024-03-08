const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skudetail: [],
    pricespace: null,
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    tosku: false,
    spudetail: {},
    saleattrvaluelist: [],
    location: {},
    selectedValue: {},
    skudetailprice: null,
    skudetailimg: '',
    selectlength: 0,
    isshopcart: false,
    istoshop: false,
    nowsku: {},
    quantity: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.id)
    wx.request({
      url: 'http://localhost:3002/getsku',
      method: 'POST',
      data: { id: options.id },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        // console.log(res)
        let pricespace = []
        res.data.forEach((item) => {
          item.skuplatformattributeList = JSON.parse(item.skuplatformattributeList)
          item.skusaleattrvalueList = JSON.parse(item.skusaleattrvalueList)
          item.skusaleattrvalueList = item.skusaleattrvalueList.reduce((accumulator, currentElement) => {
            accumulator[currentElement.id] = currentElement.saleattrname;
            return accumulator;
          }, {})
          if (pricespace.length >= 2) {
            if (item.price > pricespace[1]) {
              pricespace[1] = item.price
            }
            if (item.price < pricespace[0]) {
              pricespace[0] = item.price
            }
          } else {
            pricespace.push(item.price)
          }
        })
        this.setData({
          skudetail: res.data,
          pricespace
        })
      },
      fail: (error) => {

      },
    });
    wx.request({
      url: 'http://localhost:3002/getspudetail',
      method: 'POST',
      data: { id: options.id },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        res.data[0].comdata = JSON.parse(res.data[0].comdata)
        this.setData({
          spudetail: res.data[0]
        })
        console.log(res)
      },
      fail: (error) => {

      },
    });
    wx.request({
      url: 'http://localhost:3002/getexistingattrbute',
      method: 'POST',
      data: { id: options.id },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        // console.log(res)
        res.data.forEach((item) => {
          item.saleattrvaluelist = JSON.parse(item.saleattrvaluelist)
        })
        this.setData({
          saleattrvaluelist: res.data,
        })
      },
      fail: (error) => {

      },
    });
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
  },
  closedetail() {
    this.setData({
      tosku: false,
    })
    setTimeout(() => {
      this.setData({
        isshopcart: false,
        istoshop: false
      })
    }, 300);
  },
  taptosku() {
    this.setData({
      tosku: true,
    })
  },
  tochoseadress() {
    wx.navigateTo({
      url: '../setting/location?isskudetail=true'
    })
  },
  tospudetail(e) {
    wx.navigateTo({
      url: './shopdetail?id=' + e.currentTarget.dataset.id
    })
  },
  handleButtonClick(e) {
    const { index, value } = e.currentTarget.dataset;
    // 处理按钮点击，更新数据中的选择属性值
    let selectedValue = this.data.selectedValue
    selectedValue[index.id] = value
    const nowsku = this.data.skudetail.filter((item) => {
      return this.areObjectsEqual(item.skusaleattrvalueList, selectedValue)
    })
    this.setData({
      selectedValue,
      selectlength: Object.keys(selectedValue).length,
      skudetailprice: nowsku.length ? nowsku[0].price : '',
      skudetailimg: nowsku.length ? nowsku[0].skuimage : '',
      nowsku: nowsku.length ? nowsku[0] : {}
    })

  },
  areObjectsEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  },
  joinshopcart() {
    if (this.data.nowsku.id) {
      const _id = wx.getStorageSync('_id')
      const parms = {
        skuid: this.data.nowsku.id,
        count: this.data.quantity,
        _id
      }
      wx.request({
        url: 'http://localhost:3002/setshopcart',
        method: 'POST',
        data: parms,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: (res) => {
          console.log(res)
          this.setData({
            tosku: false,
            selectedValue: {},
            skudetailprice: null,
            skudetailimg: '',
            selectlength: 0,
            isshopcart: false,
            istoshop: false,
            nowsku: {},
            quantity: 1,
          })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
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
          }
        },
        fail: (error) => {

        },
      });
    }
  },
  joindingdan() {
    if (this.data.nowsku.id) {
      const { nowsku, quantity, location } = this.data
      const _id = wx.getStorageSync('_id')
      const shopcartlist = [
        {
          skuid: nowsku.id,
          price: nowsku.price,
          skuimage: nowsku.skuimage,
          skuname: nowsku.skuname,
          count: quantity
        }
      ]
      if (location.phone) {
        Dialog.confirm({
          title: '付款',
          message: '请进行付款',
        })
          .then(() => {
            // on confirm
            wx.request({
              url: 'http://localhost:3002/createpaydingdan',
              method: 'POST',
              data: { _id, shopcartlist: JSON.stringify(shopcartlist), adress: JSON.stringify(location) },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              success: (res) => {
                this.setData({
                  tosku: false,
                  selectedValue: {},
                  skudetailprice: null,
                  skudetailimg: '',
                  selectlength: 0,
                  isshopcart: false,
                  istoshop: false,
                  nowsku: {},
                  quantity: 1,
                })
                wx.navigateTo({
                  url: '../dingdan/dingdandetail?dingdanid=' + res.data.insertId
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
              data: { _id, shopcartlist: JSON.stringify(shopcartlist), adress: JSON.stringify(location) },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              success: (res) => {
                this.setData({
                  tosku: false,
                  selectedValue: {},
                  skudetailprice: null,
                  skudetailimg: '',
                  selectlength: 0,
                  isshopcart: false,
                  istoshop: false,
                  nowsku: {},
                  quantity: 1,
                })
                wx.navigateTo({
                  url: '../dingdan/dingdandetail?dingdanid=' + res.data.insertId
                })
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })

              },
              fail: (error) => {

              },
            });
          });
      } else {
        wx.navigateTo({
          url: '../setting/location?isskudetail=true'
        })
        wx.showToast({
          title: '请先选择地址',
          icon: 'none'
        })
      }

    }
  },
  handleStepperChange(event) {
    // 当步进器的值改变时触发
    this.setData({
      quantity: event.detail,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  toshopcart() {
    this.setData({
      isshopcart: true,
      tosku: true
    })
  },
  toshop() {
    this.setData({
      istoshop: true,
      tosku: true
    })

  },
  tolookimage(e) {
    console.log(e.currentTarget.dataset.image)
    const { skudetail } = this.data
    const imagelist = skudetail.map(item => { return item.skuimage })
    console.log(imagelist)
    wx.previewImage({
      current: e.currentTarget.dataset.image, // 当前显示图片的http链接
      urls: imagelist, // 需要预览的图片http链接列表
    })
  },
  onClickLeft() {
    wx.navigateBack({ delta: 1 });
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