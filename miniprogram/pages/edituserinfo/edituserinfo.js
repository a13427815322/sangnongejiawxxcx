// pages/edituserinfo/edituserinfo.ts
import moment from "moment";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showedit: false,
    temedit: '',
    temeditfield: '',
    sexs: ['保密', '男', '女'],
    showsex: false,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime() - (100 * 365.25 * 24 * 60 * 60 * 1000),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getuserinfo()
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
        const currentDate = new Date(res.data.birthday).getTime()
        res.data.birthday = moment(res.data.birthday).format('YYYY-MM-DD')
        if (res.data.birthday == 'Invalid date') {
          res.data.birthday = null
        }
        const userInfo = res.data;
        // 在这里处理获取到的用户信息
        // 更新页面数据，展示用户信息
        this.setData({
          userInfo: userInfo,
          currentDate
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
  onClickLeft() {
    wx.navigateBack({
      delta: 1
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const userInfo = this.data.userInfo
    userInfo.headSculpture = avatarUrl
    this.setData({
      userInfo,
    })
    this.uploadAvatar(e.detail.avatarUrl);
  },
  uploadAvatar(tempFilePath) {
    wx.uploadFile({
      url: 'http://localhost:3002/uploadavatar', // 替换为你的服务器端点
      filePath: tempFilePath,
      name: 'file', // 与服务器端 multer.single('file') 匹配
      success: (res) => {
        const data = JSON.parse(res.data);
        const avatarUrl = data.url;
        let userInfo = this.data.userInfo
        userInfo.headSculpture = avatarUrl
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
            console.log(res.data);
            wx.showToast({
              title: '头像修改成功',
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
      },
      fail: (error) => {
        console.error('修改头像失败：', error);
      },
    });
  },
  toedit(e) {
    const temeditfield = this.data.userInfo[e.currentTarget.dataset.type]
    if (e.currentTarget.dataset.type == "sex" || e.currentTarget.dataset.type == "birthday") {
      this.setData({
        showsex: true,
        temedit: e.currentTarget.dataset.type,
        temeditfield,
      })
    } else {
      this.setData({
        showedit: true,
        temedit: e.currentTarget.dataset.type,
        temeditfield,
      })
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
      })
    }, 300);
  },
  Cancelsex() {
    this.setData({
      showsex: false
    })
    setTimeout(() => {
      this.setData({
        temedit: '',
        temeditfield: '',
      })
    }, 300);
  },
  Confirmbithday(e) {
    let date = new Date(e.detail)
    date = moment(date).format('YYYY-MM-DD')
    let userInfo = this.data.userInfo
    userInfo.birthday = date
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
          showsex: false
        })
        setTimeout(() => {
          this.setData({
            temedit: '',
            temeditfield: '',
          })
        }, 300);
        wx.showToast({
          title: '生日修改成功',
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
  },
  edituserinfo() {
    let userInfo = this.data.userInfo
    userInfo.nickname = this.data.temeditfield
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
          title: '昵称修改成功',
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
  },
  changeedit(e) {
    this.setData({
      temeditfield: e.detail
    })
  },
  Confirmsex(e) {
    let userInfo = this.data.userInfo
    userInfo.sex = e.detail.value
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
          showsex: false
        })
        setTimeout(() => {
          this.setData({
            temedit: '',
            temeditfield: '',
          })
        }, 300);
        wx.showToast({
          title: '性别修改成功',
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