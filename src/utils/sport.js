const util = require('./util.js')
const config = require('../config/config.js')

const sport = {
  // 获取平均值
  getAverageStep: function (stepInfoList) {
  	let arr = stepInfoList.map((stepInfo)=>{
  		return stepInfo.step
  	})
  	let avg = util.getAverage(arr)

  	return avg
  },
  // 获取近期最大值
  getMaxStep: function(stepInfoList){
    let arr = stepInfoList.sort((a, b)=>{
      return b.step - a.step
    })

    return arr[0]
  },
  // 距离 = 步数 / 每公里步数
  getDistance: function(steps, kmSteps){
  	return (steps/kmSteps)
  },
  // 卡路里 = 体重（kg）× 距离（公里）× 1.036
  getCalories: function(step){
    let weight = config.weight
    let kmSteps = config.kmSteps
    let distance = this.getDistance(step, kmSteps)

    let calories = weight*distance*1.036
  	return ~~calories
  },
}

module.exports = sport
