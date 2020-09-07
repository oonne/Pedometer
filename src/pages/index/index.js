//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const formatData = require('../../utils/formatData.js')
const chart = require('../../utils/chart.js')

const btnText = {
  nologin: 'Login',
  pending: 'In sync...',
  success: 'Synchronized',
  error: 'Sync to PMS',
}

Page({
  data: {
    status: '',
    baseData: {},
    systemInfo: {},

    btnText: '---',
    btnClass: 'syan_button',
    stepData: {
      today: 0,
      calories: 0,
      weekly: 0,
      monthly: 0,
    }
  },
  onShow: function () {
    let that = this

    //获取系统基础属性
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res
        })
      }
    })

    // 获取到wxToken之后才能解析运动数据，这里有时序问题：如果先onShow则修改app的回调，如果先返回数据则直接调用
    app.watchWxData = function (wxToken) {
      that.getRunData(wxToken)
    }
    if (app.globalData.watchWxData){
      that.getRunData(app.globalData.watchWxData)
    }

    // 登录完成之后自动同步
    app.sync = function () {
      that.sync()
    }
  },
  getRunData: function (wxToken){
    let that = this
    wx.getWeRunData({
      success(res) {
        util.decryptData(res, wxToken, (data)=>{
          that.setData({
            baseData: data,
            stepData: formatData.getStepData(data)
          })
          // 绘制图表
          chart.showTodayChart(that.data.systemInfo, data)
          chart.showWeekChart(that.data.systemInfo, data)
          // 如果已经登录则同步
          if (app.globalData.token) {
            that.sync()
          }else{
            that.setData({
              status: 'nologin',
              btnText: btnText['nologin']
            })
          }
        })
      }
    })
  },
  sync: function () {
    let that = this
    let baseData = this.data.baseData
    if (baseData.watermark) {
      that.setData({
        status: 'pending',
        btnText: btnText['pending']
      })
      wx.request({
        url: util.getReqUrl('/pedometer/update'),
        method: 'POST',
        data: baseData,
        header: {
          'content-type': 'application/json',
          'X-Auth-Token': app.globalData.token
        },
        success: function (res) {
          if (res.statusCode == 401){
            that.setData({
              status: 'nologin',
              btnText: btnText['nologin'],
              btnClass: 'syan_button syan_button_able',
            })
            app.setToken('')
          } else if (res.statusCode == 200){
            let data = res.data
            if (data.Ret == 0) {
              that.setData({
                status: 'success',
                btnText: btnText['success'],
                btnClass: 'syan_button',
              })
            } else {
              util.warnToast(util.getFirstAttr(data.Data.errors))
              that.setData({
                status: 'error',
                btnText: btnText['error'],
                btnClass: 'syan_button syan_button_able',
              })
            }
          } else {
            util.warnToast(`同步失败(${res.statusCode})`)
            that.setData({
              status: 'error',
              btnText: btnText['error'],
              btnClass: 'syan_button syan_button_able',
            })
          }
        },
        fail: function (e) {
          console.warn(e)
          util.warnToast('同步失败')
          that.setData({
            status: 'error',
            btnText: btnText['error'],
            btnClass: 'syan_button syan_button_able',
          })
        }
      })
    }
  },
  onClickBtn: function(){
    let that = this
    switch(this.data.status){
      case 'nologin':
        that.toLogin()
        break
      case 'pending':
        break
      case 'success':
        break
      case 'error':
        that.sync()
        break
    }
  },
  toLogin: function() {
    wx.navigateTo({
      url: '../login/login'
    })
  }
})
