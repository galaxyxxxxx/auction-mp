const app = getApp()
const ENV = app.globalData.ENV
const CLOUD_BASE = app.globalData.CLOUD_BASE
const db = wx.cloud.database({
  env: ENV
})
const painting = db.collection('painting')
const user = db.collection('user')
const auction = db.collection('auction')
const _ = db.command
const $ = db.command.aggregate


Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: '',
    paintings: []
  },

  onShow: function () {
    this.setData({
      openid: wx.getStorageSync('openid')
    })

    this.getPaintings()
  },


  // 查询所有油画
  getPaintings: function () {
    let that = this
    painting.get({
      success: function (res) {
        let paintings = res.data
        that.setData({
          paintings: paintings
        })
      },
      error: function (err) {
        console.log(err)
      }
    })
  },

  // 查看油画详情
  toDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../painting/index?id=' + id,
    })
  },

  // 出价
  toAuction(e) {
    let {
      price
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../auction/index?price=' + price,
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    wx.showLoading()
    this.initDate();
    this.getLab();
    wx.stopPullDownRefresh();
  },

  // 分享
  onShareAppMessage: function (res) {
    return {
      title: "研究院油画公益拍卖",
      path: '../index/index'
    }
  },

})