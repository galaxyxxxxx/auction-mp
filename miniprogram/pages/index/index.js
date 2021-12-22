const app = getApp()
const ENV = app.globalData.ENV
const CLOUD_BASE = app.globalData.CLOUD_BASE
const db = wx.cloud.database({
  env: ENV
})
const painting = db.collection('painting')
const user = db.collection('user')

Page({
  data: {
    openid: '',
    paintings: [],
    timeData: {}
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
        // set status & count-down time
        let now = Date.now()
        paintings.forEach(cur => {
          // 已到期,则查看是否是当前用户买中了
          if (now > cur.deadline) {
            if (cur.buyer === wx.getStorageSync('openid')) {
              cur.status = 2
            } else {
              cur.status = 1
            }
          } else {
            cur.status = 0
            cur.time = (cur.deadline).getTime() - now
          }
          return cur
        })
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
    let _id = e.currentTarget.dataset._id
    wx.navigateTo({
      url: `../painting/index?_id=${_id}`,
    })
  },

  // 出价
  toAuction(e) {
    let {
      price,
      _id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../auction/index?_id=${_id}&price=${price}`,
    })
  },

  // 倒计时更改事件
  onChangeCountDown: function (e) {
    this.setData({
      timeData: e.detail
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    wx.showLoading()
    this.getPaintings()
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