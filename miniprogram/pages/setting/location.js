// addressList/addressList.js

Page({
    data: {
    Defaultadress: 1,
    ismanager:false,
  },
    goToEditAddress() {
      wx.navigateTo({
        url: './locationEdit',
      });
    },
    changeDefaultadress(event){
        this.setData({
            Defaultadress: event.detail
          });
    },
    onClickLeft() {
        wx.navigateBack({ delta: 1 });
      },
      tapismanager(){
          this.setData({
            ismanager:!this.data.ismanager
          })
      },
  });
  