const app = getApp()
const ENV = app.globalData.ENV
const CLOUD_BASE = app.globalData.CLOUD_BASE
const db = wx.cloud.database({
  env: ENV
})
const user = db.collection('user')
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    CLOUD_BASE: CLOUD_BASE
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 授权按钮
  getUserProfile: function (e) {
    wx.getUserProfile({
      desc: '用于实验室预约', // display for users to inform why we collect these infos
      success: (res) => {
        console.log("info", res)
        let userInfo = res.userInfo;
        let nickName = userInfo.nickName;
        let avatarUrl = userInfo.avatarUrl;
        let gender = userInfo.gender;

        // 载入缓存
        wx.setStorageSync('nickName', nickName);
        wx.setStorageSync('avatarUrl', avatarUrl);
        wx.setStorageSync('gender', gender);

        // 当前页面赋值
        this.setData({
          nickName: userInfo.nickName,
          isHide: false
        })

        // 数据库存储
        user.where({
          _openid: wx.getStorageSync('openid')
        }).get({
          success: function (res) {
            if (res.data.length == 0) {
              user.add({
                data: {
                  nickName: nickName,
                  avatarUrl: avatarUrl,
                  gender: gender
                },
                success(res) {
                  console.log('成功增加用户个人信息', res);
                  wx.switchTab({
                    url: '../../pages/index/index',
                  })
                },
                fail(err) {
                  console.log('增加用户个人信息失败', err);
                }
              });
            }
          },
          fail: function (err) {
            console.log(err)
          }
        })

      },
      fail: (err) => {
        console.log('获取用户信息失败')
      }
    })

  },
})