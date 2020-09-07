//app.js
const util = require('./utils/util.js')

App({
  globalData: {
    userInfo: null,
    wxToken: '',
    token: '',
  },
  onLaunch: function () {
    let that = this

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: util.getReqUrl('/wx/get-wx-session'),
          method: 'GET',
          data: {
            code: res.code,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            let data = res.data
            if (data.Ret == 0) {
              that.watchWxData(data.Data.wxToken)
            } else {
              util.warnToast(util.getFirstAttr(data.Data.errors))
            }
          },
          fail: function (e) {
            console.warn(e)
            util.warnToast('获取sessionkey失败')
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              this.userInfoReadyCallback(res)
            }
          })
        }
      }
    })

    //如果有token，则获取token
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setToken(res.data)
      }
    })
  },
  setToken: function(token){
    this.globalData.token = token
    if (token) {
      wx.setStorage({
        key: "token",
        data: token
      })
    }
  },
  userInfoReadyCallback: function (data) {
    // TODO：发送到服务器换取unionId
    // console.log(data)
  },
  // 由于获取wxToken是异步的，得等到获取成功之后才回调
  watchWxData: function (wxToken) {
    // callback的函数由page去修改即可
    console.log(wxToken)
    this.globalData.watchWxData = wxToken
  },
  // 登录完成之后的同步
  sync: function () {},
})