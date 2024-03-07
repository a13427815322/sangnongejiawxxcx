// addressList/addressList.js
import Dialog from '@vant/weapp/dialog/dialog';
Page({
  data: {
    Defaultadress: null,
    ismanager: false,
    isskudetail: false,
    adresslist: []
  },
  onShow() {
    this.getaddress()
  },
  onLoad(options) {
    this.setData({
      isskudetail: JSON.parse(options.isskudetail)
    })
  },
  getaddress() {
    const _id = wx.getStorageSync('_id')
    wx.request({
      url: 'http://localhost:3002/getuseradress',
      method: 'POST',
      data: { _id },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        res.data.forEach(element => {
          element.isdefault = JSON.parse(element.isdefault)
          if (element.isdefault) {
            this.setData({
              Defaultadress: element.id
            })
          }
          if (element.sjr.length > 2) {
            element.firstname = element.sjr[0]
          } else {
            element.firstname = element.sjr
          }
        });
        this.setData({ adresslist: res.data })
      },
      fail: (error) => {
        console.error('获取 adress 数据失败：', error);
      }

    })
  },
  goToEditAddress(e) {
    const { id } = e.currentTarget.dataset
    if (id) {
      wx.navigateTo({
        url: './locationEdit?id=' + id,
      });
    } else {
      wx.navigateTo({
        url: './locationEdit',
      });
    }

  },
  changeDefaultadress(event) {
    this.setData({
      Defaultadress: event.detail
    });
    const _id = wx.getStorageSync('_id')
    wx.request({
      url: 'http://localhost:3002/setdefaultadress',
      method: 'POST',
      data: { id: event.detail, _id },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        this.getaddress()
      },
      fail: (error) => {
        console.error('获取 adress 数据失败：', error);
      }

    })
  },
  deladress(e) {
    console.log(e.currentTarget.dataset.id)
    Dialog.confirm({
      message: '确定要删除该地址吗',
    })
      .then(() => {
        wx.request({
          url: 'http://localhost:3002/deladress',
          method: 'POST',
          data: { id: e.currentTarget.dataset.id },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            this.getaddress()
          },
          fail: (error) => {
            console.error('获取 adress 数据失败：', error);
          }

        })
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
  },
  onClickLeft() {
    wx.navigateBack({ delta: 1 });
  },
  tapismanager() {
    this.setData({
      ismanager: !this.data.ismanager
    })
  },
  backtoskudetail(e) {
    if (this.data.isskudetail) {
      console.log(e.currentTarget.dataset.item)
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
      prevPage.setData({//直接给上移页面赋值
        location: e.currentTarget.dataset.item,
      });
      wx.navigateBack({
        delta: 1,
      })
    }
  }
});
