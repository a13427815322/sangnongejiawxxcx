// pages/usersafe/usersafe.ts
import moment from "moment"
import Dialog from "@vant/weapp/dialog/dialog";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showedit: false,
    temedit: '',
    temeditfield: '',
    userInfo: {},
    errormessage: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getuserinfo()
  },
  toedit(e) {
    const temeditfield = this.data.userInfo[e.currentTarget.dataset.type]
    this.setData({
      showedit: true,
      temedit: e.currentTarget.dataset.type,
      temeditfield,
    })
  },
  changeedit(e) {
    this.setData({
      temeditfield: e.detail
    })
  },
  edituserinfo() {
    let valid = true;
    if (this.data.temedit == 'username') {
      if (!this.data.temeditfield) {
        this.setData({
          errormessage: '账号不能为空'
        });
        valid = false;
      } else if (this.data.temeditfield.length < 6 || this.data.temeditfield.length > 20) {
        this.setData({
          errormessage: '账号长度必须在6到20之间'
        });
        valid = false;
      } else {
        this.setData({
          errormessage: ''
        });
      }
      if (valid) {
        let userInfo = this.data.userInfo
        userInfo.username = this.data.temeditfield
        this.setData({
          userInfo,
        });
        const _id = wx.getStorageSync('_id')
        wx.request({
          url: 'http://localhost:3002/updateuserinfo',
          method: 'POST',
          data: {
            _id: _id,
            userInfo: JSON.stringify(this.data.userInfo)
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            wx.clearStorageSync()
            wx.switchTab({
              url: '../me/me'
            })
            wx.showToast({
              title: '账号修改成功，请重新登陆',
              icon: 'success'
            })
          },
          fail: (error) => {
            console.error('获取用户信息请求失败：', error);
            // 请求失败时，显示错误信息
            wx.showToast({
              title: '获取用户信息失败，请重试',
              icon: 'none',
              duration: 2000,
            });
          },
        });
      }

    } else {
      if (!this.data.temeditfield) {
        this.setData({
          errormessage: '手机号不能为空'
        });
        valid = false;
      } else if (this.data.temeditfield.length != 11) {
        this.setData({
          errormessage: '手机号格式错误'
        });
        valid = false;
      } else {
        this.setData({
          errormessage: ''
        });
      }
      if (valid) {
        let userInfo = this.data.userInfo
        userInfo.phone = this.data.temeditfield
        this.setData({
          userInfo,
        });
        const _id = wx.getStorageSync('_id')
        wx.request({
          url: 'http://localhost:3002/updateuserinfo',
          method: 'POST',
          data: {
            _id: _id,
            userInfo: JSON.stringify(this.data.userInfo)
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            this.setData({
              showedit: false
            })
            setTimeout(() => {
              this.setData({
                temedit: '',
                temeditfield: '',
              })
            }, 300);
            wx.showToast({
              title: '手机号修改成功',
              icon: 'success'
            })
            this.getuserinfo()
          },
          fail: (error) => {
            console.error('获取用户信息请求失败：', error);
            // 请求失败时，显示错误信息
            wx.showToast({
              title: '获取用户信息失败，请重试',
              icon: 'none',
              duration: 2000,
            });
          },
        });
      }
    }

  },
  closecomment() {
    this.setData({
      showedit: false
    })
    setTimeout(() => {
      this.setData({
        temedit: '',
        temeditfield: '',
        errormessage: ''
      })
    }, 300);
  },
  getuserinfo() {
    const _id = wx.getStorageSync('_id')
    wx.request({
      url: 'http://localhost:3002/getuserinfo',
      method: 'POST',
      data: {
        _id: _id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        res.data.birthday = moment(res.data.birthday).format('YYYY-MM-DD')
        const userInfo = res.data;
        // 在这里处理获取到的用户信息
        // 更新页面数据，展示用户信息
        this.setData({
          userInfo: userInfo,
        });

      },
      fail: (error) => {
        console.error('获取用户信息请求失败：', error);
        // 请求失败时，显示错误信息
        wx.showToast({
          title: '获取用户信息失败，请重试',
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  deluser() {
    Dialog.confirm({
      title: '注销账号',
      message: '是否注销账号',
    })
      .then(() => {
        // on confirm
        const _id = wx.getStorageSync('_id')
        wx.request({
          url: 'http://localhost:3002/deluser',
          method: 'POST',
          data: { _id },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: (res) => {
            wx.clearStorageSync('_id')
            wx.switchTab({
              url: '../me/me'
            })
            wx.showToast({
              title: '账号已注销',
              icon: 'success'
            })
          },
          fail: (error) => { }
        })
      })
      .catch(() => {
        // on cancel

      });
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