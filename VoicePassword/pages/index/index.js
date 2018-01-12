//index.js
//获取应用实例
var app = getApp();
var innerAudioContext;
var manager = wx.getRecorderManager();
Page({
  data: {
    userInfo: {}, 
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    voiceButtonName: '按住说话',
    voicePlayButtonName: '开始播放',
    voiceButtonDisable: false,
    tempFilePath: null,
    navbarArray: [{
      text: '语音口令',
      type: 'navbar-item-active'
    }, {
      text: '真心寄语',
      type: ''
    }, {
      text: '你说我猜',
      type: ''
    }],
    navbarShowIndexArray: Array.from(Array(3).keys()),
    currentChannelIndex: 0,
    wordOfCommand: '',
    balance: '15.00',
    inputMoney: '',
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
   
    // wx.checkSession({
    //   success: function () {
    //     //session 未过期，并且在本生命周期一直有效
    //     console.log('登录未过期')
    //   },
    //   fail: function () {
    //     //登录态过期
    //     that.onLaunch();
    //     wx.login() //重新登录
    //   }
    // })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // onLaunch: function () {
  //   wx.login({
  //     success: function (res) {
  //       console.log(JSON.stringify(res))
  //       if (res.code) {
  //         //发起网络请求
  //         wx.request({
  //           url: '',
  //           data: {
  //             code: res.code
  //           }
  //         })
  //       } else {
  //         console.log('获取用户登录态失败！' + res.errMsg)
  //       }
  //     },
  //     fail: function (res) {
  //       console.log('登录失败！' + res.errMsg)

  //     }
  //   });
  // },
  tapVoicePlayButton: function (event) {
    var that = this
    var lastTime;
    var voiceButtonDisable = false
    switch (this.data.voicePlayButtonName) {

      case '开始播放': {
        that.setData({
          voicePlayButtonName: '播放中',
          voiceButtonDisable: true
        })
        innerAudioContext = wx.createInnerAudioContext()
        var tempPath = this.data.tempFilePath
        console.log(tempPath);
        innerAudioContext.autoplay = true
        innerAudioContext.src = 'https://test.gc-player.com/tmp_a3537780204f6a100116c013b709079b9dae0b0a49bc2d8a.mp3'
        // innerAudioContext.src = tempPath        
        console.log('playVoice')
        innerAudioContext.onPlay(() => {
          console.log('开始播放')

        })
        innerAudioContext.onTimeUpdate(() => {
          console.log('----update:', innerAudioContext.duration, innerAudioContext.currentTime)
          lastTime = Math.floor(innerAudioContext.duration - innerAudioContext.currentTime)
          if (lastTime >= 0) {
            that.setData({
              voicePlayButtonName: that.data.voicePlayButtonName = '播放中' + lastTime + 's',
            })
          }
        })

        innerAudioContext.onEnded(() => {
          console.log('onStop播放自然结束:')
          innerAudioContext.destroy()
          that.setData({
            voicePlayButtonName: '开始播放',
            voiceButtonDisable: false
          })
        })

        innerAudioContext.onError((res) => {
          innerAudioContext.destroy
          that.setData({
            voicePlayButtonName: '开始播放',
            voiceButtonDisable: false
          })
          console.log(res.errMsg)
          console.log(res.errCode)
        })
        innerAudioContext.onStop(() => {
          console.log('onStop播放手动中止 调stop方法:')
          innerAudioContext.destroy()
          that.setData({
            voicePlayButtonName: '开始播放',
            voiceButtonDisable: false
          })
        })
        break
      }
      default: {
        if (innerAudioContext == null)
          return
        innerAudioContext.stop()
        // innerAudioContext.autoplay = false
        //  
        console.log('stopVoice')
        break
      }
    }



  },
  touchStart: function (e) {
    var startY = e.touches[0].pageY;
    var startTime = e.timeStamp;
    var that = this;
    console.log('touchStart');
    this.setData({
      voiceButtonName: '松开 结束',
      startY: startY,
      startTime: startTime
    })

    const options = {
      duration: 60000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 36000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 10,//指定帧大小，单位 KB
    }
    manager.start(options);
    manager.onStart(() => {
      console.log('onStart开始录音');
    })
    manager.onError((res) => {
      console.log('onError', res);
    })
    manager.onStop((res) => {
      console.log('recorder stop', res);
      if (res.duration < 1000)
        return;
      var duration = Math.round(res.duration / 1000);
      console.log('duration:' + duration);
      that.setData({
        voicePlayButtonName: '开始播放',
        tempFilePath: res.tempFilePath
      });
      //上传操作 wx.uploadFile
      var fileName = res.tempFilePath.substr(9);
      console.log(fileName);
      wx.uploadFile({
        url: 'http://192.168.9.119:8081/SamllServer/UploadFile',
        filePath: res.tempFilePath,
        name: fileName,
        // header: {}, // 设置请求的 header
        formData: {
          'duration': duration
        }, // HTTP 请求中其他额外的 form data
        success: function (res) {
          // success
          console.log('begin:' + JSON.stringify(res));
          console.log(res.data);
          wx.request({
            url: 'http://192.168.9.119:8081/SamllServer/Mp3Test',
            data: {
              name: fileName
            },
            success: function (res) {
              // success
              console.log('request:' + JSON.stringify(res));
       
            },
            fail: function (err) {
              // fail
              console.log('请求error:' + JSON.stringify(err));
            },
            complete: function () {
              console.log('请求complete');
              // complete
            }
          })
        },
        fail: function (err) {
          // fail
          console.log('上传error:' + JSON.stringify(err));
        },
        complete: function () {
          console.log('上传complete');
          // complete
        }
      })
    })
  },
  touchEnd: function (e) {
    var that = this;
    manager.stop();
    var endTime = e.timeStamp;
    if (endTime - this.data.startTime < 1000) {
      console.log('录音太短');
      wx.showToast({
        title: '录音时间太短',
        icon: 'loading',
        image: '',
        duration: 500,
      })

    } else {

      if (this.data.voiceButtonName == '松开 取消') {

        console.log('取消touchEnd');

      } else {
        //保存录音
        console.log('保存touchEnd');



      }
    }
    this.setData({
      voiceButtonName: '按住说话'
    })
  },
  touchMoveCancel: function (e) {
    var endy = e.touches[0].pageY;
    if (Math.abs(endy - this.data.startY) > 30) {
      console.log('touchCancel');
      this.setData({
        voiceButtonName: '松开 取消'
      })
    } else {
      this.setData({
        voiceButtonName: '松开 结束'
      })
    }
  },
  testWrite: function () {
    var Stream = new ActiveXObject("ADODB.Stream");
    var adTypeBinary = 1, adTypeText = 2;
    Stream.Type = adTypeText;
    Stream.CharSet = "iso-8859-1";
    Stream.Open();
    //Stream.WriteText("\x00\x01\x02\xff\xff");
    for (var i = 0; i < 256; i++) {
      Stream.WriteText(String.fromCharCode(i));
      //Stream.WriteText(bin[i]);
    }
    Stream.SaveToFile("wxfile://test1.mp3", 2);
    Stream.Close();
    Stream = null;
    this.setData({
      tempFilePath: 'wxfile://test1.mp3'
    })
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
  },
  formSubmit:function(e){
    console.log('sub:',e);
  }
})
