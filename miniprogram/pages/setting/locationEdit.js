// addressEdit/addressEdit.js
const {areaList} = require('@vant/area-data');

Page({
    data: {
      isDefault: false,
      showRegionPopup: false,
      vantAreaData:{},
      areaList: areaList,
      regionValue: '',
      regionCascaderValue: [],
    },
    onRegionTap: function() {
        console.log(111)
        // 点击地区输入框，显示地区选择器
        this.setData({
          showRegionPopup: true,
        });
      },
      onConfirm(e) {
        const { index, values } = e.detail;
        console.log(e)
        const regionValue = values
          .map((option) => option.text || option.name)
          .join('/');
      
        // 更新数据
        this.setData({
          regionValue,
          showRegionPopup: false, // 关闭地区选择器
        });
    },
      onRegionClose: function() {
        // 关闭地区选择器
        this.setData({
          showRegionPopup: false,
        });
      },
    
      onRegionFinish: function(e) {
        // 选择完成时触发
        const { selectedOptions, value } = e.detail;
        const regionValue = selectedOptions
          .map((option) => option.text || option.name)
          .join('/');
    
        // 更新数据
        this.setData({
          regionValue,
          regionCascaderValue: value,
          showRegionPopup: false, // 关闭地区选择器
        });
      },
    onSwitchChange(event) {
        console.log(event)
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
    },    onClickLeft() {
        wx.navigateBack({ delta: 1 });
      },
  });
  