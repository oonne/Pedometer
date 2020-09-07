const sport = require('./sport.js')
const time = require('./time.js')

const formatData = {
  // 把基础的运动数据格式化成显示用的运动数据
  getStepData: function(baseData) {
    let stepData = {
      today: 0,
      calories: 0,
      weekly: 0,
      monthly: 0,
    }

    let stepInfoList = baseData.stepInfoList
    let days = stepInfoList.length

    if (days){
      let today = stepInfoList[days-1].step
      let calories = sport.getCalories(today)
      let monthly = sport.getAverageStep(stepInfoList)
      let weekly = sport.getAverageStep(stepInfoList.slice(days-7, days))

      stepData = {
        today: today,
        calories: calories,
        weekly: weekly,
        monthly: monthly,
      }
    }

    return stepData
  },
  // 获取最后若干天数据，并格式化时间
  getRecentData: function(baseData, day){
    let stepInfoList = baseData.stepInfoList
    let days = stepInfoList.length

    let stepData = stepInfoList.slice(days-day, days)
    stepData.map(stepInfo=>{
      stepInfo.day = time.timeStampToDay(stepInfo.timestamp)
    })

    return stepData
  }
}

module.exports = formatData
