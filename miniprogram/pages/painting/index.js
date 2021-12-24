const app = getApp()
const ENV = app.globalData.ENV
const CLOUD_BASE = app.globalData.CLOUD_BASE
const db = wx.cloud.database({
  env: ENV
})
const painting = db.collection('painting')
const auction = db.collection('auction')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: '',
    painting: {},
    list: [],
    myPrice: '',

    logoAuction: CLOUD_BASE + 'assets/logo-auctioned.svg',

    timeData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    this.setData({
      _id: options._id,
    })
  },

  onShow: function () {
    let _id = this.data._id
    this.getPaintingDetail(_id)
    this.getAuctionList(_id)
  },

  onReady: function () {
    wx.hideLoading()
  },

  // 查询所有油画
  getPaintingDetail: function (_id) {
    let that = this
    painting.doc(_id).get({
      success: function (res) {
        let cur = res.data
        // set status & count-down time
        let now = Date.now()
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
        that.setData({
          painting: cur
        })
      },
      error: function (err) {
        console.log(err)
      }
    })
  },

  // 查询拍卖榜单
  getAuctionList: function (_id) {
    let that = this
    // 只获取前三个
    auction.limit(3).orderBy('price', 'desc').where({
      paintingId: _id
    }).get({
      success: function (res) {
        let list = res.data
        that.setData({
          list: list
        })
        // 查询当前用户是否有出价历史
        list.map(cur => {
          if (cur.openid === wx.getStorageSync('openid')) {
            that.setData({
              myPrice: cur.price
            })
          }
        })
      }
    })
  },

  // 倒计时更改事件
  onChangeCountDown: function (e) {
    let timeData = e.detail
    this.setData({
      timeData: timeData
    })
  },

  // 出价
  toAuction(e) {
    let {
      price,
      _id,
      imageid
    } = e.currentTarget.dataset
    console.log(e)
    wx.navigateTo({
      url: `../auction/index?_id=${_id}&imageID=${imageid}&price=${price}`,
    })
  },

  toShare() {
    wx.navigateTo({
      url: '../share/index?price=' + this.data.myPrice,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading();
    this.onShow();
    setTimeout(() => {
      wx.hideLoading();
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: `爱心公益油画作品-${title}`
        })
      }, 2000)
    })
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      promise
    }
  }
})