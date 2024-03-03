// addressEdit/addressEdit.js
const { areaList } = require('@vant/area-data');
import Dialog from '@vant/weapp/dialog/dialog';
Page({
  data: {
    autosize: { maxHeight: 100, minHeight: 70 },
    showRegionPopup: false,
    vantAreaData: {},
    areaList: areaList,
    regionCascaderValue: [],
    fromdata: {
      sjr: '',
      phone: '',
      addressspace: '',
      useraddress: '',
      isdefault: false,
    },
    errfromdata: {
      sjr: '',
      phone: '',
      addressspace: '',
      useraddress: '',
    },
    id: null,
  },
  onLoad(options) {
    this.setData({
      id: options.id
    })
    if (options.id) {
      wx.request({
        url: 'http://localhost:3002/getadressdetail',
        method: 'POST',
        data: { id: options.id },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: (res) => {
          res.data.forEach(element => {
            element.isdefault = JSON.parse(element.isdefault)
          });
          this.setData({ fromdata: res.data[0] })
        },
        fail: (error) => {
          // 请求失败时，显示错误信息
          wx.showToast({
            title: error.message,
            icon: 'none',
            duration: 2000,
          });
        },
      });
    }
  },
  deladress() {
    Dialog.confirm({
      message: '确定要删除该地址吗',
    }).then(() => {
      wx.request({
        url: 'http://localhost:3002/deladress',
        method: 'POST',
        data: { id: this.data.id },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: (res) => {
          wx.navigateBack({
            delta: 1
          });
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
  setformdata(e) {
    let { fromdata } = this.data
    fromdata[e.currentTarget.dataset.type] = e.detail
    this.setData({
      fromdata
    })
  },
  onRegionTap: function () {
    // 点击地区输入框，显示地区选择器
    this.setData({
      showRegionPopup: true,
    });
  },
  onConfirm(e) {
    const { index, values } = e.detail;
    console.log(e)
    let fromdata = this.data.fromdata
    fromdata.addressspace = values.map((option) => option.text || option.name)
      .join('/');
    // 更新数据
    this.setData({
      fromdata,
      showRegionPopup: false, // 关闭地区选择器
    });
  },
  onRegionClose: function () {
    // 关闭地区选择器
    this.setData({
      showRegionPopup: false,
    });
  },

  onRegionFinish: function (e) {
    // 选择完成时触发
    const { selectedOptions, value } = e.detail;
    let fromdata = this.data.fromdata
    fromdata.addressspace = selectedOptions.map((option) => option.text || option.name)
      .join('/');
    // 更新数据
    this.setData({
      fromdata,
      regionCascaderValue: value,
      showRegionPopup: false, // 关闭地区选择器
    });
  },
  onSwitchChange(event) {
    let fromdata = this.data.fromdata
    fromdata.isdefault = event.detail
    this.setData({
      fromdata
    });
  },

  saveAddress() {
    const { fromdata } = this.data
    let isreturn = false
    let errfromdata = {
      sjr: '',
      phone: '',
      addressspace: '',
      useraddress: '',
    }
    if (fromdata.sjr.trim().length == 0) {
      errfromdata.sjr = "收件人不能为空"
      isreturn = true
    }
    if (fromdata.phone.trim().length == 0) {
      errfromdata.phone = "手机号不能为空"
      isreturn = true
    } else if (fromdata.phone.trim().length != 11) {
      errfromdata.phone = "手机号格式错误"
      isreturn = true
    }
    if (fromdata.addressspace.trim().length == 0) {
      errfromdata.addressspace = "选择地区不能为空"
      isreturn = true
    }
    if (fromdata.useraddress.trim().length == 0) {
      errfromdata.useraddress = "详细地址不能为空"
      isreturn = true
    }


    if (isreturn) {
      this.setData({ errfromdata })
      return
    } else { this.setData({ errfromdata }) }

    const _id = wx.getStorageSync('_id')
    fromdata._id = _id
    wx.request({
      url: 'http://localhost:3002/submitadress',
      method: 'POST',
      data: fromdata,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        wx.navigateBack({
          delta: 1,
        });
      },
      fail: (error) => {
        // 请求失败时，显示错误信息
        wx.showToast({
          title: error.message,
          icon: 'none',
          duration: 2000,
        });
      },
    });

  },
  onClickLeft() {
    wx.navigateBack({ delta: 1 });
  },
  oncancel() {
    this.setData({
      showRegionPopup: false
    })
  }
});
