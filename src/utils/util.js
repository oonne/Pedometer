const config = require('../config/config.js')

const util = {
  // 获取第一个对象
  getFirstAttr: function(object) {
    for (let i in object) return object[i];
  },
  // 获取数组平均值
  getAverage: function(array){
    // let sum = eval(array.join("+"))
    // let avg = ~~(sum/array.length)
    // 小程序不能使用eval方法，千万别用上面的代码
    let sum = 0
    array.map(item=>{
      sum+=item
    })
    let avg = ~~(sum/array.length)

    return avg
  },
  // 获取请求的url
  getReqUrl: function (url) {
    let baseUrl = config.apiUrl
    return baseUrl+url
  },
  // 错误提示框
  warnToast: function(text) {
    wx.showToast({
      title: text,
      image: '../../asset/error.png',
      duration: 1600
    })
  },
  // 微信加密数据请求服务器进行解密
  decryptData: function(orginalData, token, callback) {
    wx.request({
      url: util.getReqUrl('/wx/decrypt-data'),
      method: 'POST',
      data: {
        encryptedData: orginalData.encryptedData,
        iv: orginalData.iv,
        wxToken: token,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let data = res.data
        if (data.Ret == 0) {
          callback(data.Data)
        } else {
          console.warn(util.getFirstAttr(data.Data.errors))
        }
      },
      fail: function (e) {
        console.warn(e)
      }
    })
  },
}

module.exports = util
