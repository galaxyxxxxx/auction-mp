const app = getApp()
const ENV = app.globalData.ENV
const db = wx.cloud.database({
  env: ENV
})
const lab = db.collection('lab')
const user = db.collection('user')
const _ = db.command
const $ = db.command.aggregate

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,

    openid: wx.getStorageSync('oepnid'),
  },

  // 获取当前设备的可视高度 以便适配各种机型
  style: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight
        });
      }
    });
  },

  onLoad: function (options) {

  },

  onShow: function () {

  },

  // 日期初始化
  initDate: function () {
    let that = this
    let days = [{}, {}, {}, {}, {}, {}, {}]
    let now = new Date()
    let today = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate())
    let todayTime = today.getTime()
    let oneday = 24 * 60 * 60 * 1000
    for (let i = 0; i < 7; i++) {
      let date = new Date(todayTime + oneday * i)
      days[i].id = date
      days[i].date = "周" + "日一二三四五六".charAt(date.getDay()) + '&nbsp;&nbsp;&nbsp;' + date.getDate()
    }
    that.setData({
      days: days
    })
  },

  // 查询相应的lab
  getLab: function () {
    let that = this
    let tmp = that.data.days
    that.data.days.map((cur, index) => {
      let date = cur.id
      lab.where({
          date: date
        })
        .get({
          success: function (res) {
            tmp[index].labs = res.data
            that.setData({
              days: tmp,
              openid: wx.getStorageSync('openid'),
              nickName: wx.getStorageSync('nickName'),
              loading: true
            })
            setTimeout(() => {
              wx.hideLoading()
            }, 0);
          },
          fail: function (err) {
            console.log(err)
          }
        })
    })
  },

  // 滚动事件
  scroll(e) {
    // console.log(e)
  },

  // 短按 查看、修改
  viewLab(e) {
    let id = e.currentTarget.dataset.id
    let host = e.currentTarget.dataset.openid
    if (this.data.openid == host) {
      wx.navigateTo({
        url: '../labEdit/labEdit?id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '../labView/labView?id=' + id,
      })
    }
  },

  // 长按删除
  delete(e) {
    let id = e.currentTarget.dataset.id
    let host = e.currentTarget.dataset.openid
    let that = this
    if (this.data.openid == host) {
      Dialog.confirm({
        title: '',
        message: '取消该会议？',
      }).then(() => {
        lab.doc(id).remove({
          success: function (res) {
            console.log("已成功取消该活动")
            that.onShow()
          }
        })
      }).catch(() => {
        console.log("取消 取消该活动")
      });
    } else {
      console.log("无权限")
    }
  },



  // 获取时间信息
  getToday: function () {
    let that = this
    let today = {}
    let date = new Date()
    let month = date.getMonth() + 1

    today.date = "周" + "日一二三四五六".charAt(date.getDay()) + "，" + (date.getMonth() + 1) + "月" + date.getDate() + "日"
    today.year = date.getFullYear()
    today.month = date.getMonth() + 1
    today.day = date.getDate()
    today.week = date.getDay() == 0 ? 7 : date.getDay()

    that.setData({
      today: today,
      month: month
    })
  },

  addLab: function (e) {
    wx.navigateTo({
      url: '../labEdit/labEdit',
    })
  },

  me() {
    wx.navigateTo({
      url: '../labList/labList',
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
      title: "实验室日程占用分享",
      path: '../index/index'
    }
  },

  touchStart(e) {
    console.log(e)
  },

  touchMove(e) {
    console.log('move', e)
  },

  touchEnd(e) {
    console.log('end', e)
  }
})