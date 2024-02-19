// addressList/addressList.js

Page({
    goToEditAddress() {
      wx.navigateTo({
        url: './locationEdit',
      });
    },
    onClickLeft() {
        wx.navigateBack({ delta: 1 });
      },
  });
  