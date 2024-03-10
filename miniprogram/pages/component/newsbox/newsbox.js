// pages/component/newsbox/newsbox.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    news: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tonews() {
      this.triggerEvent('tonews', this.data.news.id)
    }
  }
})