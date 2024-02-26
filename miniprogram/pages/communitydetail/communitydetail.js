import moment from "moment";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    helpCommunityList: [],
    userInfo: {},
    istextarea: false,
    ischildren: false,
    iscomment: false,
    autosize: { maxHeight: 150, minHeight: 100 },
    commentlist: [],
    temcomment: {},
    temtemcomment: {},
    commentshow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData(
      { id: options.id }
    )
    const _id = wx.getStorageSync('_id')
    if (_id) {
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
          console.log(res.data);
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
    };
    this.getcomunitydetail()
  },
  getcomunitydetail() {
    wx.request({
      url: 'http://localhost:3002/getCommunityDetail',
      method: 'POST',
      data: {
        id: this.data.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        let helpCommunityList = res.data;
        helpCommunityList.forEach(element => {
          element.fileurls = JSON.parse(element.fileurls)
        });
        // 将数据按照 creattime 降序排列
        this.setData({
          helpCommunityList: helpCommunityList,
        });
        this.getcomment()
      },
      fail: (error) => {
        console.error('获取 helpcommunity 数据失败：', error);
      },
    });
  },
  onClickLeft() {
    wx.navigateBack({ delta: 1 });
  },
  changefiled(e) {
    this.setData({
      comment: e.detail
    })
  },
  tapfiled() {
    this.setData({
      istextarea: true,
      temcomment: {}
    })

  },
  tapcommentanser() {
    this.setData({
      iscomment: true,
      temtemcomment: this.data.temcomment,
    })
  },
  tapansercomment(e) {
    console.log(e)
    this.setData({
      iscomment: true,
      temtemcomment: e.currentTarget.dataset.item,
    })
  },
  bluransercomment() {
    this.setData({
      iscomment: false,
    })
  },
  closepopup() {
    this.setData({
      commentshow: false
    })
  },

  blurcomment() {
    this.setData({
      istextarea: false
    })
  },
  blurchildrencomment(e) {
    this.setData({
      ischildren: false,
    })
  },
  tapchildrencomment(e) {
    this.setData({
      ischildren: true,
      temcomment: e.currentTarget.dataset.item,
    })
  },
  tocommentdetail(e) {
    console.log(e)
    this.setData({
      commentshow: true,
      temcomment: e.currentTarget.dataset.item,
    })
  },
  submitcomment() {
    let tem
    if (this.data.temtemcomment.id) {
      tem = {
        comment: this.data.temtemcomment.pid ? `回复 ${this.data.temtemcomment.userinfo.nickname} : ${this.data.temtemcomment.temcomment}` : this.data.temtemcomment.temcomment,
        userInfo: JSON.stringify(this.data.userInfo),
        id: this.data.id,
        pid: this.data.temtemcomment.pid ? this.data.temtemcomment.pid : this.data.temtemcomment.id
      }
    }
    else if (this.data.temcomment.id) {
      tem = {
        comment: this.data.temcomment.temcomment,
        userInfo: JSON.stringify(this.data.userInfo),
        id: this.data.id,
        pid: this.data.temcomment.pid ? this.data.temcomment.pid : this.data.temcomment.id
      }
    } else {
      tem = {
        comment: this.data.comment,
        userInfo: JSON.stringify(this.data.userInfo),
        id: this.data.id,
      }
    }

    this.setData({
      comment: '',
      temcomment: {},
      temtemcomment: {},
    })
    console.log(tem)
    wx.request({
      url: 'http://localhost:3002/submitcomment',
      method: 'POST',
      data: tem,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (response) => {
        this.setData({
          commentshow: false
        })
        this.getcomunitydetail()
      },
      fail: (error) => { }
    })
  },
  getcomment() {
    wx.request({
      url: 'http://localhost:3002/getcomment',
      method: 'POST',
      data: {
        comdata: this.data.helpCommunityList[0].comdata,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        res.data.forEach((item) => {
          item.userinfo = JSON.parse(item.userinfo)
          item.createtime = moment(item.createtime).format('MM-DD')
          if (item.children.length) {
            item.children.forEach((element) => {
              element.createtime = moment(element.createtime).format('MM-DD')
              element.userinfo = JSON.parse(element.userinfo)
            })
          }
        })
        this.setData({
          commentlist: res.data
        })
      },
      fail: (error) => { }
    })
  },
  changechildrenfiled(e) {
    let temcomment = this.data.temcomment
    temcomment.temcomment = e.detail
    this.setData({
      temcomment
    })
  },
  changecomentfiled(e) {
    let temtemcomment = this.data.temtemcomment
    temtemcomment.temcomment = e.detail
    this.setData({
      temtemcomment
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