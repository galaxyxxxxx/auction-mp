const app = getApp()
const ENV = app.globalData.ENV
const CLOUD_BASE = app.globalData.CLOUD_BASE
const db = wx.cloud.database({
  env: ENV
})
Page({

  data: {
    CLOUD_BASE: CLOUD_BASE,
    nickName: wx.getStorageSync('nickName'),
    avatar: wx.getStorageSync('avatarUrl'),
    price: 0
  },


  onLoad: function (options) {
    this.setData({
      price: options.price
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})