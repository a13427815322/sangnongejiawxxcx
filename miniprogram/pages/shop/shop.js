const { now } = require("moment");
import Dialog from '@vant/weapp/dialog/dialog';
// pages/shop/shop.ts
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    propertylist: [],
    spulist: [],
    propertyobj: {},
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    windowHeight: 0,
    activeIndex: 1,
    toView: 'v1',
    skudetail: [],
    saleattrvaluelist: [],
    tosku: false,
    pricespace: [],
    selectedValue: {},
    skudetailprice: null,
    skudetailimg: '',
    quantity: 1,
    location: {},
    nowsku: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    wx.request({
      url: 'http://localhost:3002/getproerty',
      method: 'GET',
      success: (res) => {
        console.log(res)
        if (res) {
          this.setData({
            propertylist: res.data,
            isView: 'v1'
          })
        }
      },
      fail: (error) => {
        console.error('获取 helpcommunity 数据失败：', error);
      },
    });
    wx.request({
      url: 'http://localhost:3002/getspu',
      method: 'GET',
      success: (res) => {
        const idSet = new Set();
        let propertyobj = {}
        res.data.forEach(item => {
          if (!idSet.has(item.propertyid)) {
            item.isfirst = true;
            propertyobj[item.propertyid] = this.data.propertylist.find(element => element.id == item.propertyid).name
            idSet.add(item.propertyid);
          }
        });
        this.setData({
          spulist: res.data,
          propertyobj
        })
      },
      fail: (error) => {
        console.error('获取 helpcommunity 数据失败：', error);
      },
    });
  },
  setActive(e) {
    const propertyId = e.currentTarget.dataset.id;
    const toViewId = 'v' + propertyId;

    this.setData({
      toView: toViewId,
      activeIndex: propertyId
    });
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
    this.setData({
      quantity: event.detail,
    });
  },
  scroll(e) {
    // 获取当前滚动位置
    const scrollTop = e.detail.scrollTop;
    // 计算对应的锚点位置
    let toViewId = '';
    let activeIndex = ''
    for (let i = 0; i < this.data.spulist.length; i++) {
      const item = this.data.spulist[i];
      const itemId = 'v' + item.propertyid;
      const Index = item.propertyid
      const offsetTop = i === 0 ? 0 : this.calcTotalHeight(i - 1);

      if (scrollTop >= offsetTop && scrollTop < offsetTop + this.calcItemHeight(item)) {
        toViewId = itemId;
        activeIndex = Index
        break;
      }
    }

    // 更新左边选中栏
    if (toViewId !== this.data.toView) {
      this.setData({
        toView: toViewId,
        activeIndex
      });
    }
  },

  /**
   * 计算前几个元素的总高度
   */
  calcTotalHeight(index) {
    let totalHeight = 0;
    for (let i = 0; i <= index; i++) {
      totalHeight += this.calcItemHeight(this.data.spulist[i]);
    }
    return totalHeight;
  },

  /**
   * 计算元素高度
   */
  calcItemHeight(item) {
    return item.isfirst ? 40 : 100; // 根据实际情况调整高度
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  choseshop(e) {
    wx.request({
      url: 'http://localhost:3002/getexistingattrbute',
      method: 'POST',
      data: { id: e.currentTarget.dataset.id },
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
    wx.request({
      url: 'http://localhost:3002/getsku',
      method: 'POST',
      data: { id: e.currentTarget.dataset.id },
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
          tosku: true,
          pricespace
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
  closedetail() {
    this.setData({
      tosku: false,
    })
    setTimeout(() => {
      this.setData({
        skudetail: [],
        saleattrvaluelist: [],
        selectedValue: {},
        skudetailimg: '',
        skudetailprice: null,
        quantity: 1,
      })

    }, 300);
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
  openImage: function (e) {

    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.url], // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
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