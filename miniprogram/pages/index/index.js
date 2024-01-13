// index.ts
// 获取应用实例

const app = getApp()

Page({
  data: {
    navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuTop: app.globalData.menuTop,
        menuHeight: app.globalData.menuHeight,
        activeKey:0,
        placeholder:'请输入要查找的内容',
        swiperimages:['../../static/index/indexbanner.png','../../static/index/indexbanner1.png','../../static/index/indexbanner2.png'],
        tabList: [{
					id: "tab01",
					name: '三农政策'
				}, {
					id: "tab02",
					name: '农业科技'
				}],
        newsdetail:[]
  },
  onLoad() {
  this.getnew()
  },
  onChange(event){
    this.setData({activeKey:event.detail})
    this.getnew()
  },
  getnew(){
    const that=this
    console.log(111)
     wx.request({
      url: 'http://127.0.0.1:3002/getnews',
      method: 'POST',
      data: {type:this.data.activeKey},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        for(let index in res.data){
          res.data[index].datetime=new Date(res.data[index].datetime).toLocaleDateString();}
        that.setData({newsdetail:res.data })
      }
    })
  }
})
