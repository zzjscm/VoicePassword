// pages/recordDetail/recordDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    totalMoney: '15.00',
    currentCounts: '0',
    allCounts: '0',
    getList: [{ "nickName": "Nevermore", "gender": 1, "language": "zh_CN", "city": "Jiaxing", "province": "Zhejiang", "country": "China", "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJAapXUrTgPZvUg3FearBMGz7glWaOahc9gY3s0AybPXpD6mf53sPWWhBUC1uibY5qQT6nO9RL20Pw/0", "money": "50.00", "time": "2月02日10:46", "audio": "", "duration": "5" }, { "nickName": "Nevermore", "gender": 1, "language": "zh_CN", "city": "Jiaxing", "province": "Zhejiang", "country": "China", "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJAapXUrTgPZvUg3FearBMGz7glWaOahc9gY3s0AybPXpD6mf53sPWWhBUC1uibY5qQT6nO9RL20Pw/0", "money": "50.00", "time": "2月02日10:46", "audio": "", "duration": "5" }],
    recordText: '这是语音口令文字',
    receiveButton: '长按说出口令',
    isBroughtOut: false,
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
  sendOneMore: function () { 
    wx.switchTab({
      url: '../index/index'
    })
  }
})