//login.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    pmsUser: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputFocus: 'name',
    username: '',
    password: '',
  },
  //事件处理函数
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
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindNameInput: function (e) {
    this.setData({
      username: e.detail.value,
    })
  },
  bindPwdInput: function (e) {
    this.setData({
      password: e.detail.value,
    })
  },
  nameConfirm: function (e) {
    this.setData({
      inputFocus: 'pwd',
    })
  },
  login: function(e){
    wx.request({
      url: util.getReqUrl('/user/login'),
      method: 'POST',
      data: {
        username: this.data.username,
        password: this.data.password,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let data = res.data
        if(data.Ret==0){
          app.setToken(data.Data.sAccessToken)
          app.sync()
          wx.navigateBack()
        }else{
          util.warnToast(util.getFirstAttr(data.Data.errors))
        }
      },
      fail: function(e){
        console.warn(e)
        util.warnToast('登录失败')
      }
    })
  }
})
