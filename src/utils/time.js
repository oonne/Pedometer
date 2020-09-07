const time = {
  // 补零
  _fixZero: function(num){
    return num >= 10 ? num : '0'+num;
  },
  // 时间戳转星期
  timeStampToDay: function (timeStamp) {
    let date = new Date(timeStamp*1000)
    let day = ''
    switch (date.getDay()) {
      case 0:day="Sun";break
      case 1:day="Mon";break
      case 2:day="Tues";break
      case 3:day="Wed";break
      case 4:day="Thur";break
      case 5:day="Fri";break
      case 6:day="Sat";break
    }
    return day
  },
}

module.exports = time
