var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: []
  },
  onLoad:function(options){
    // 加载订单
    this.getOrderList();
  },
  getOrderList(){
    let that = this;
    util.request(api.OrderList).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderList: res.data.data
        });
      }
    });
  },
  payOrder(event){
    const index = event.currentTarget.dataset.orderIndex;
    const order = this.data.orderList[index];
    wx.redirectTo({
      url: '/pages/pay/pay?orderId=' + order.id + '&actualPrice=' + order.actual_price,
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    const flag = wx.getStorageSync('reloadOrder');
    if(flag!==undefined && flag===1){
      wx.setStorageSync('reloadOrder', 0);
      this.getOrderList()
    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})