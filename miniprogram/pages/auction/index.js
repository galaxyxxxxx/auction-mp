const app = getApp()
const ENV = app.globalData.ENV
const CLOUD_BASE = app.globalData.CLOUD_BASE
const db = wx.cloud.database({
  env: ENV
})
const painting = db.collection('painting')
const auction = db.collection('auction')
const _ = db.command

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  data: {
    _id: 0,
    imageID: '',
    price: 0,

    avatar: wx.getStorageSync('avatarUrl'),
    inputPrice: '',
    CLOUD_BASE: CLOUD_BASE
  },

  onLoad: function (options) {
    let {
      price,
      _id,
      imageID
    } = options
    this.setData({
      price,
      _id,
      imageID
    })
  },


  confirmPrice(e) {
    let _id = this.data._id
    let cur = parseInt(this.data.inputPrice) //当前用户的报价
    let price = parseInt(this.data.price)
    // 1 检验报价是否合规
    if (cur <= price) {
      // 弹窗或别的方式 警示
      Dialog.alert({
        message: '出价不能低于当前报价，请重新报价',
        theme: 'round-button',
      }).then(() => {
        this.setData({
          inputPrice: ''
        })
      });
    } else {
      // 2 查看该用户是否已报价
      auction.where({
        openid: wx.getStorageSync('openid'),
        paintingId: _id
      }).get({
        success: function (res) {
          if (res.data.length === 0) {
            // 该用户没有报价过
            // 3 增加报价
            painting.doc(_id).update({
              data: {
                count: _.inc(1),
                price: cur,
                buyer: wx.getStorageSync('openid')
              },
              success: function (res) {
                auction.add({
                  data: {
                    openid: wx.getStorageSync('openid'),
                    avatar: wx.getStorageSync('avatarUrl'),
                    nickName: wx.getStorageSync('nickName'),
                    paintingId: _id,
                    price: cur
                  },
                  success: function (res) {
                    wx.showToast({
                      title: '成功报价',
                      icon: 'success',
                      duration: 2000
                    })
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 0,
                      })
                    }, 2000)
                  }
                })
              },
              fail: function (err) {
                wx.showToast({
                  title: '请重新报价',
                  icon: 'error',
                  duration: 2000,
                  complete: function () {
                    this.setData({
                      inputPrice: ''
                    })
                  }
                })
              }
            })
          } else {
            // 该用户报过价
            // 3 更新报价
            let auctionId = res.data[0]._id
            painting.doc(_id).update({
              data: {
                price: cur,
                buyer: wx.getStorageSync('openid')
              },
              success: function (res) {
                auction.doc(auctionId).update({
                  data: {
                    price: cur
                  },
                  success: function (res) {
                    wx.showToast({
                      title: '成功更新报价',
                      icon: 'success',
                      duration: 2000
                    })
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 0,
                      })
                    }, 2000)
                  }
                })
              },
              fail: function (err) {
                wx.showToast({
                  title: '请重新报价',
                  icon: 'error',
                  duration: 2000,
                  complete: function () {
                    this.setData({
                      inputPrice: ''
                    })
                  }
                })
              }
            })
          }
        }
      })


    }
  }

})