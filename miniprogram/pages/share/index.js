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
    price: 0,

    canSave: false
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

  savePhoto(e) {
    let that = this
    const PREFIX = that.data.CLOUD_BASE + 'assets/'
    const price = that.data.price
    wx.getSystemInfo({
      success: (res) => {
        let canvasWidth = 750
        let canvasHeight = 1143

        // 定义画布对象
        const canvas = wx.createOffscreenCanvas({
          type: '2d',
          width: canvasWidth,
          height: canvasHeight
        })
        const ctx = canvas.getContext('2d')

        // draw
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.fillStyle = '#FFFFFF'
        ctx.rect(0, 0, canvasWidth, canvasHeight)
        ctx.fill()
        // draw-banner
        wx.getImageInfo({
          src: PREFIX + 'share-bg.png',
          success(res) {
            ctx.drawImage(res, 0, 0, canvasWidth, canvasHeight)
          }
        })
        // draw-avatar
        wx.getImageInfo({
          src: wx.getStorageSync('avatarUrl'),
          success(res) {
            ctx.drawImage(res, 464, 600, 132, 132)
          }
        })

        // draw text
        ctx.font = 16
        ctx.fillStyle = '#1F3035'
        ctx.fillText('携手' + wx.getStorageSync('nickName') + '捐出公益金', 178, 838)
        ctx.font = 36
        ctx.fillStyle = '#e22b17'
        ctx.fillText('¥' + price, 312, 926)

        // ctx.draw() //绘制
        // let url = ctx.toDataUrl()
        console.log(ctx)
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})