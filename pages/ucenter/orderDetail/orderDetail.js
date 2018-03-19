var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    handleOption: {}
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail()
  },
  getOrderDetail() {
    let that = this;
    util.request(api.OrderDetail, {
      orderId: that.data.orderId
    }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          handleOption: res.data.handleOption
        });
        //that.payTimer();
        wx.hideLoading()
      }
    });
  },
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      console.log(orderInfo);
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  payOrder() {
    let that = this;
    util.request(api.PayPrepayId, {
      orderId: that.data.orderId || 15
    }).then(function (res) {
      if (res.errno === 0) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            wx.navigateBack({
              success: function(){
                wx.showToast({
                  title: '支付成功',
                  icon: 'success'
                });
              }
            });
            console.log(res)
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败'
            })
            console.log(res)
          }
        });
      }
    });

  },
  cancelOrder: function(){
    wx.showLoading({
      title: '订单取消中',
    })
    util.request(api.OrderCancel, {orderId: this.data.orderId})
      .then(function(res){
        wx.hideLoading()
        if (res.errno === 0) {
          wx.setStorageSync('reloadOrder', 1);
          if(res.data.result === true){
            wx.navigateBack()
          }else{
            wx.showToast({
              title: '没有找到订单',
            })
            wx.navigateBack()
          }
        }else{
          wx.showToast({
            title: '订单无法取消',
          })
        }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})