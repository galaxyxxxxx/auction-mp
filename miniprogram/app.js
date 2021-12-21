//app.js
App({
  globalData: {
    CLOUD_BASE: "cloud://cloud1-9gnxu7n8fc1dd953.636c-cloud1-9gnxu7n8fc1dd953-1308907470/",
    ENV: "cloud1-9gnxu7n8fc1dd953",
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.ENV,
        traceUser: true,
      });
    }
    this.getopenid();
    this.autoUpdate();
  },

  getopenid: function () {
    wx.cloud.callFunction({
      name: "login",
      success: (res) => {
        console.log('当前登录用户的openid为', res.result.openid)
        wx.setStorageSync("openid", res.result.openid);
        this.checkUserDatabase(res.result.openid);
      },
      fail: (err) => {
        wx.showToast({
          icon: "none",
          title: "获取 openid 失败，请检查 login 云函数",
        });
        console.log(
          "获取 openid 失败，请检查是否有部署云函数，错误信息：",
          err
        );
      },
    });
  },

  checkUserDatabase: function (openid) {
    wx.cloud
      .database({
        env: "cloud1-9gnxu7n8fc1dd953",
      })
      .collection("user")
      .where({
        _openid: openid,
      })
      .get()
      .then((res) => {
        if (res.data.length == 0) {
          console.log("no user");
          wx.navigateTo({
            url: '../login/login',
          })
        } else {
          let userInfo = res.data[0];
          wx.setStorageSync("nickName", userInfo.nickName);
          wx.setStorageSync("avatarUrl", userInfo.avatarUrl);
          wx.setStorageSync("gender", userInfo.gender);
        }
      });
  },

  /**
   * 小程序检查更新
   */
  autoUpdate: function () {
    var that = this;
    // 获取小程序更新机制兼容

    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //检测到新版本，需要更新，给出提示

          wx.showModal({
            title: "更新提醒",
            content: "已检测到新版本，是否下载并重启小程序？",
            success: function (res) {
              if (res.confirm) {
                //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                that.downLoadAndUpdate(updateManager);
              } else if (res.cancel) {
                //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                wx.showModal({
                  title: "更新提醒",
                  content: "本次更新因改动较大，旧版本某些功能可能无法正常访问的哦~",
                  showCancel: false, //隐藏取消按钮
                  confirmText: "确认更新", //只保留确定更新按钮
                  success: function (res) {
                    if (res.confirm) {
                      //下载新版本，并重新应用
                      that.downLoadAndUpdate(updateManager);
                    }
                  },
                });
              }
            },
          });
        } else {}
      });
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: "错误",
        content: "当前微信版本过低，无法使用本小程序，请升级到最新微信版本后重试！",
      });
    }
  },

  /**
   * 下载小程序新版本并重启应用
   */
  downLoadAndUpdate: function (updateManager) {
    wx.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function () {
      wx.hideLoading();
      //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate();
    });
    updateManager.onUpdateFailed(function () {
      wx.hideLoading();
      // 新的版本下载失败
      wx.showModal({
        title: "检测到新版本了哦~",
        content: "新版本已经上线啦~ 请您删除当前小程序重新打开哦~",
      });
    });
  },
});