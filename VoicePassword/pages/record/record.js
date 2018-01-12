// pages/record/record.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, 
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navbarArray: [{
      text: '我发出的',
      type: 'navbar-item-active'
    }, {
      text: '我收到的',
      type: ''
    }],
    navbarShowIndexArray: Array.from(Array(2).keys()),
    currentChannelIndex: 0,
    receiveMoney:'0',
    sendMoney:'0',
    receiveCount:0,
    sendCount:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    console.log('onLoad' + JSON.stringify(this.data.userInfo))

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //切换顶部tab
  onTapNavbar: function (e) {
    var id = e.currentTarget.id
    id = id.substr(id.length - 1, 1)
    this.switchChannel(parseInt(id));
  },
  switchChannel: function (targetChannelIndex) {
    // this.getCurrentPage(targetChannelIndex);
    // var currentChannelIndex = this.data.currentChannelIndex
    // let targetChannelIndex = this.data.navbarShowIndexArray.indexOf(currentChannelIndex) ;
    let navbarArray = this.data.navbarArray;
    navbarArray.forEach((item, index, array) => {
      item.type = '';
      if (index === targetChannelIndex) {
        item.type = 'navbar-item-active';
      }
    });

    if (this.data.currentChannelIndex !== targetChannelIndex) {
      this.setData({
        navbarArray: navbarArray,
        currentChannelIndex: targetChannelIndex
      });
    }
  },
  changeBar: function (e) {
    this.switchChannel(e.detail.current);
  }
})