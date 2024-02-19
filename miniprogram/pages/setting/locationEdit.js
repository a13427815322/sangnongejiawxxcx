// addressEdit/addressEdit.js

Page({
    data: {
      isDefault: false,
    },
  
    onSwitchChange(event) {
      this.setData({
        isDefault: event.detail.value,
      });
    },
  
    saveAddress() {
      // 处理保存地址逻辑
      // 可以使用 wx.request 发送数据到后端保存
      // 保存成功后跳转回地址列表页面
      wx.navigateBack({
        delta: 1,
      });
    },
  });
  