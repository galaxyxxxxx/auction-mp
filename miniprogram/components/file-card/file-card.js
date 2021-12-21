const app = getApp()
const CLOUD_BASE = app.globalData.CLOUD_BASE
Component({
  properties: {
    title: {
      type: String,
      value: '暂无名称'
    },
    storage: {
      type: Number,
      value: 10
    },
    updateDate: {
      type: Date,
      value: (new Date()).toLocaleDateString()
    },
    icon: {
      type: String,
      value: CLOUD_BASE + "icon/folder.svg"
    },
    type: {
      type: Number,
      value: 2
    },
    status: {
      type: Number,
      value: 1
    },
    description: {
      type: String,
      value: '等待高歌的描述文字'
    }
  },
  data: {
    downloadIcon: CLOUD_BASE + "utilImage/icon-download.svg",
    shareIcon: CLOUD_BASE + "utilImage/icon-share.svg",
    moreIcon: CLOUD_BASE + "utilImage/icon-more.svg"
  }
})
