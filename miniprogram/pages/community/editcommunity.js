// pages/community/editcommunity.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modalName: null,
    fileList: [],
    location: '',
    community: '',
    isButtonDisabled: true,
  },
  afterRead(event) {
    const { file } = event.detail;
    // 存储 this 到变量 that
    const that = this;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'http://localhost:3002/uploadcommunity',
      filePath: file.url,
      name: 'file',
      formData: { user: 'test' },
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = that.data;
        fileList.push({ ...file, ...JSON.parse(res.data) });
        that.setData({ fileList });
        that.updateButtonDisabled();
      },
    });

  },
  deletefile(event) {
    let fileList = this.data.fileList
    fileList.splice(event.detail.index, 1)
    this.setData({
      fileList
    })
    setTimeout(() => {
      this.updateButtonDisabled();
    }, 0);
  },
  updateButtonDisabled() {
    const isButtonDisabled = !this.data.community && this.data.fileList.length === 0;
    this.setData({
      isButtonDisabled,
    });
  },
  onClickLeft() {
    wx.navigateBack({ delta: 1 });
  },

  textareaAInput(e) {
    this.setData({
      community: e.detail.value
    })
    setTimeout(() => {
      this.updateButtonDisabled();
    }, 0);
  },
  // 提交帮助社区信息
  submitcommunity() {
    const { fileList, community, location } = this.data;
    console.log(fileList)
    // 构建要发送的数据
    const requestData = {
      _id: wx.getStorageSync('_id'), // 假设用户 _id 存储在缓存中
      title: community,
      fileurls: JSON.stringify(fileList),
      adress: location,
      comdata: [], // 初始化为空数组
    };

    // 发送请求保存帮助社区信息
    wx.request({
      url: 'http://localhost:3002/submitcommunity',
      method: 'POST',
      data: requestData,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        console.log(res.data);
        if (res.data.error) {
          // 提示保存失败
          wx.showToast({
            title: '提交帮助社区信息失败，请重试',
            icon: 'none',
            duration: 2000,
          });
        } else {
          // 提示保存成功
          wx.showToast({
            title: '提交帮助社区信息成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              // 保存成功后跳转到其他页面或进行其他操作
              wx.switchTab({
                url: '../community/community'
              })
            },
          });
        }
      },
      fail: (error) => {
        console.error('提交帮助社区信息请求失败：', error);
        // 请求失败时，显示错误信息
        wx.showToast({
          title: '提交帮助社区信息失败，请重试',
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() { },

  // ...其他生命周期方法和事件处理函数...
});
