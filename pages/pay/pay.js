var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

var app = getApp();

Page({
  data: {
    orderId: 0,
    actualPrice: 0.00
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.orderId,
      actualPrice: options.actualPrice
    })
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  //向服务请求支付参数
  requestPayParam: function() {
    const orderId = this.data.orderId;
    pay.payOrder(parseInt(orderId)).then(res => {
      wx.redirectTo({
        url: '/pages/payResult/payResult?status=1&orderId=' + orderId
      });
    }).catch(res => {
      wx.redirectTo({
        url: '/pages/payResult/payResult?status=0&orderId=' + orderId
      });
    });
  },
  startPay: function() {
    this.requestPayParam();
  }
})