import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  data: {
    price: 0,
    inputPrice: ''
  },

  onLoad: function (options) {
    let price = options.price
    this.setData({
      price: price
    })
  },

  confirmPrice(e) {
    let cur = e.detail
    // 检验报价是否合规
    if (cur <= this.data.price) {
      // 弹窗或别的方式 警示
      Dialog.alert({
        title: '',
        message: '出价不能低于当前报价，请重新报价',
        theme: 'round-button',
      }).then(() => {
        // on close
        this.setData({
          inputPrice: 0
        })
      });
    }
    // 检验是否已有更高报价 
    else if (1) {
      // 弹窗或别的方式 警示
      Dialog.alert({
        title: '有新报价',
        message: '有新报价**元，请重新报价',
        theme: 'round-button',
      }).then(() => {
        // on close
        this.setData({
          inputPrice: 0
        })
      });
    } else {
      // 弹窗 报价成功
      wx.showToast({
        title: '成功报价',
        icon: 'success',
        duration: 2000
      })
      wx.navigateBack({
        delta: 0,
      })
    }
  }

})