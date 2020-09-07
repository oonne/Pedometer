const config = require('../config/config.js')
const formatData = require('./formatData.js')
const sport = require('./sport.js')

const chart = {
  // 获取页面宽度和高度
  getWidth: function(systemInfo){
    if (systemInfo.errMsg=='getSystemInfo:ok') {
      return systemInfo.windowWidth
    }else{
      return 0
    }
  },
  getHeight: function(systemInfo){
    if (systemInfo.errMsg=='getSystemInfo:ok') {
      return systemInfo.windowHeight
    }else{
      return 0
    }
  },

  // 今日步数图
  _todayConfig: {
    rate: 60, //帧率
    duration: 1500, //动画时长
    start: 0.7, //起点角度
    end: 2.3 //种点角度
  },
  showTodayChart: function (systemInfo, baseData) {
    let that = this
    let rate = this._todayConfig.rate
    let duration = this._todayConfig.duration
    let stepData = formatData.getRecentData(baseData, 1)
    let stepInfo = stepData[0]

    const ctx = wx.createCanvasContext('today_chart')

    let runTime = 0
    let maxTime = duration/rate
    let drawingChart = setInterval(function(){
      runTime ++
      if(runTime >= maxTime){
        clearInterval(drawingChart);
      }
      let i = runTime/maxTime
      that.drawTodayChart(systemInfo, ctx, i, stepInfo)
    }, 1000/rate)
  },
  drawTodayChart: function (systemInfo, ctx, i, stepInfo) {
    const width = this.getWidth(systemInfo)
    const height = this.getHeight(systemInfo)
    const start = this._todayConfig.start
    const end = this._todayConfig.end
    const goalsSteps = config.goalsSteps

    // 移动原点到中心
    ctx.translate(width / 2, height/4)
    // 设置虚线
    ctx.setStrokeStyle('#ffffff')
    ctx.setLineDash([2, 5], 0)
    ctx.setLineWidth(10)

    // 绘制半透明的底图
    ctx.setGlobalAlpha(0.4)
    // 开始路径
    ctx.beginPath()
    // 画圆arc(x,y,半径,起始位置,结束位置,false为顺时针运动)
    ctx.arc(0, 0, 120, start*Math.PI, end*Math.PI, false)
    // 描边路径
    ctx.stroke()

    // 绘制今日数据
    let step = stepInfo.step>goalsSteps ? goalsSteps : stepInfo.step
    let endAngle = i*(end-start)*(step/goalsSteps)+start
    ctx.setGlobalAlpha(1)
    ctx.beginPath()
    ctx.arc(0, 0, 120, start*Math.PI, endAngle*Math.PI, false)
    ctx.stroke()

    ctx.draw()
  },

  // 每周步数图
  _weekConfig: {
    rate: 60, //帧率
    duration: 900, //动画时长
    chartHeight: 120, //图表X轴以上高度
    barWidht: 10, //柱状图宽度
    textHeight: 16, //柱状图上方文字高度
  },
  showWeekChart: function(systemInfo, baseData){
    let that = this
    let rate = this._weekConfig.rate
    let duration = this._weekConfig.duration
    let stepData = formatData.getRecentData(baseData, 7)
    
    const ctx = wx.createCanvasContext('week_chart')
    ctx.setGlobalAlpha(0.8)

    let runTime = 0
    let maxTime = duration/rate
    let drawingChart = setInterval(function(){
      runTime ++
      if(runTime >= maxTime){
        clearInterval(drawingChart);
      }
      let i = runTime/maxTime
      that.drawWeekChart(systemInfo, ctx, i, stepData)
    }, 1000/rate)
  },
  drawWeekChart: function(systemInfo, ctx, i, baseData){
    const width = this.getWidth(systemInfo)
    const height = this._weekConfig.chartHeight
    const barWidht = this._weekConfig.barWidht
    const textHeight = this._weekConfig.textHeight

    let maxSetp = sport.getMaxStep(baseData).step
    let stepData = baseData.sort((a, b)=>{
      return a.timestamp - b.timestamp
    })
    ctx.setFillStyle('#ffffff')
    ctx.setStrokeStyle('#ffffff')
    ctx.setFontSize(textHeight/4*3)
    ctx.setTextAlign('center')

    // 绘制X轴
    ctx.moveTo(0, height)
    ctx.lineTo(width, height)
    ctx.stroke()

    stepData.map(function(stepInfo, j){
      let step = stepInfo.step
      let day = stepInfo.day
      let baseLine = (j+1)*width/8

      // 绘制柱状图
      let maxHeight = height - textHeight
      let barHeight = i*maxHeight*step/maxSetp
      let x = baseLine-barWidht/2
      let y = height-barHeight
      let w = barWidht
      let h = barHeight
      ctx.fillRect(x, y, w , h)
      // 显示步数
      ctx.fillText(step, baseLine, y-(textHeight/4))
      // 显示日期
      ctx.fillText(day, baseLine, height+textHeight)
    })

    ctx.draw()
  },
}

module.exports = chart
