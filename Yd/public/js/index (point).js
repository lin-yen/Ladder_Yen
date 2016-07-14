'use strict';
// 畫布
var myCanvas = document.getElementById('canvas'),
  context = myCanvas.getContext('2d');
context.canvas.height = context.canvas.width * 0.85;
var t,b,points,drawLine,result;
var lang = 'zh_tw';
var config = {
  'leftToright':{
    'path':[
      {'x':6,'y':0},
      {'x':6,'y':102.3},
      {'x':294,'y':102.3},
      {'x':294,'y':125.4},
      {'x':6,'y':125.4},
      {'x':6,'y':148.5},
      {'x':294,'y':148.5},
      {'x':294,'y':255}
    ],
    'passID':'leftPass',
    'imgID':'rightImg',
    'imgName':'ladder_area_even_red'
  },
  'rightToleft':{
    'path':[
      {'x':294,'y':0},
      {'x':294,'y':102.3},
      {'x':6,'y':102.3},
      {'x':6,'y':125.4},
      {'x':294,'y':125.4},
      {'x':294,'y':148.5},
      {'x':6,'y':148.5},
      {'x':6,'y':255}
    ],
    'passID':'rightPass',
    'imgID':'leftImg',
    'imgName':'ladder_area_odd_blue'
  },
  'leftToleft':{
    'path':[
      {'x':6,'y':0},
      {'x':6,'y':85.8},
      {'x':294,'y':85.8},
      {'x':294,'y':108.9},
      {'x':6,'y':108.9},
      {'x':6,'y':132},
      {'x':294,'y':132},
      {'x':294,'y':155.1},
      {'x':6,'y':155.1},
      {'x':6,'y':255}
    ],
    'passID':'leftPass',
    'imgID':'leftImg',
    'imgName':'ladder_area_odd_blue'
  },
  'rightToright':
  {
    'path':[
      {'x':294,'y':0},
      {'x':294,'y':85.8},
      {'x':6,'y':85.8},
      {'x':6,'y':108.9},
      {'x':294,'y':108.9},
      {'x':294,'y':132},
      {'x':6,'y':132},
      {'x':6,'y':155.1},
      {'x':294,'y':155.1},
      {'x':294,'y':255}
    ],
    'passID':'rightPass',
    'imgID':'rightImg',
    'imgName':'ladder_area_even_red'
  }
};
var draw = {};
draw.initial = function() {
  // clear Canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  // clearInterval
  clearInterval(drawLine);
  // set Img
  document.getElementById('rightImg').src = '/img/lang/'+lang+'/ladder_area_even.png';
  document.getElementById('leftImg').src = '/img/lang/'+lang+'/ladder_area_odd.png';
  document.getElementById('rightPass').src = '/img/ladder_area_first.png';
  document.getElementById('leftPass').src = '/img/ladder_area_first.png';
  // 左右兩條直線
  context.lineWidth = 12;
  context.strokeStyle = '#C6C3B9';
  // 左
  context.beginPath();
  context.moveTo(6,0);
  context.lineTo(6,250);
  context.stroke();
  // 右
  context.moveTo(294,0);
  context.lineTo(294,250);
  context.stroke();
  context.closePath();
};
draw.break = function(){
  clearInterval(drawLine);
  context.strokeStyle = '#3B3A3C';
  context.beginPath();
  context.moveTo(config[result].path[0].x,config[result].path[0].y);
  for(var p in config[result].path){
    context.lineTo(config[result].path[p].x,config[result].path[p].y);
  }
  context.stroke();
  context.closePath();
  document.getElementById(config[result].imgID).src = '/img/lang/'+lang+'/'+config[result].imgName+'.png';
}
draw.result = function(getResult){
  // 設定
  result = getResult.start + 'To' + getResult.end;
  // 中間的橫線
  var count = 1,
    stop = config[result].path.length - 2;
  for (var i in config[result].path) {
    if(count > stop){
      break;
    }
    context.beginPath();
    context.moveTo(6,config[result].path[count].y);
    context.lineTo(294,config[result].path[count].y);
    context.stroke();
    context.closePath();
    count += 2;
  }
  // 動畫
  setTimeout(function() {
    document.getElementById(config[result].passID).src = '/img/first_on.png';
    t = 1;
    b = 1;
    context.beginPath();
    context.strokeStyle = '#3B3A3C';
    // context.lineCap = 'round';// 線頭與線尾變圓滑
    // context.lineJoin = 'round';// 線頭與轉角處變圓滑
    points = setPath(config[result].path);
    context.moveTo(config[result].path[0].x,config[result].path[0].y);
    drawLine = setInterval(function(){
      if(b < 1){
        t = points.length;
      }
      if(t >= points.length) {
        clearInterval(drawLine);
        context.closePath();
        document.getElementById(config[result].imgID).src = '/img/lang/'+lang+'/'+config[result].imgName+'.png';
        return true;
      }
      context.lineTo(points[t].x, points[t].y);
      context.stroke();
      t++;
    }, 15);
    function setPath(points) {
      var wayPoints = [];
      for (var i = 1; i < points.length; i++) {
        var pt0 = points[i - 1];
        var pt1 = points[i];
        var dx = pt1.x - pt0.x;
        var dy = pt1.y - pt0.y;
        var z = 0;
        var count = 20;
        if(points.length > 8){
          if(i === 3||i === 5||i === 7){
            count = 10;
          }
        } else {
          if(i === 3||i === 5){
            count = 10;
          }
        }
        for (var j = 0; j < count; j++) {
          var x = pt0.x + dx * j / count;
          var y = pt0.y + dy * j / count;
          wayPoints.push({x: x , y: y});
        }
      }
      return (wayPoints);
      drawLine();
    }
  },1000);
};
draw.initial();

// 背景音樂
var audio = new Audio('/audio/ladder.mp3');
var sound = {};
sound.play = function(){
  audio.play();
};
sound.break = function(){
  audio.pause();
  audio.currentTime=0;
};
// speaker controller
var turnOff = document.getElementById('sound_turnoff');
var open = document.getElementById('sound_open');
var cheakAudio = Number((function(){
  if (document.cookie.indexOf('checkAudio') !== -1) {
    var mutedCheck = Number(getCookie('checkAudio', document.cookie.indexOf('checkAudio')));
    if(mutedCheck === 0){
      audio.muted = true;
      turnOff.style.backgroundPosition = '0px -20px';
      open.style.backgroundPosition = '0px 0px';
    }
    return mutedCheck;
  } else {
    return setCookie('checkAudio', 1);
  }
})());
function getCookie(cookieName, c_start) {
  c_start = c_start + cookieName.length + 1;
  var c_end = document.cookie.indexOf(';', c_start);
  if (c_end === -1) {
      c_end = document.cookie.length;
  }
  return unescape(document.cookie.substring(c_start, c_end));
}
function setCookie(cookieName, value) {
  document.cookie = cookieName + '=' + value + '; path=/';
  return value;
}

turnOff.addEventListener('click', function(){
  if(cheakAudio === 1){
    audio.muted = true;
    turnOff.style.backgroundPosition = '0px -20px';
    open.style.backgroundPosition = '0px 0px';
    cheakAudio = 0;
    setCookie('checkAudio', 0);
  }
});
open.addEventListener('click', function(){
  if(cheakAudio === 0){
    audio.muted = false;
    turnOff.style.backgroundPosition = '0px 0px';
    open.style.backgroundPosition = '0px -20px';
    cheakAudio = 1;
    setCookie('checkAudio', 1);
  }
});

// module.exports = {draw,sound};
/*
api:
初始化：draw.initial()
播放動畫：draw.result({'start':'','end':''})
直接秀結果：draw.break();
播放背景音樂：sound.play();
中止背景音樂：sound.break();
*/

// 測試用(´_ゝ`)
document.getElementById('play').addEventListener('click', function(){
  var num = Math.floor((Math.random() * 4) + 1);
  var result = {
    1:{
      'start':'right',
      'end':'left'
    },
    2:{
      'start':'left',
      'end':'right'
    },
    3:{
      'start':'left',
      'end':'left'
    },
    4:{
      'start':'right',
      'end':'right'
    }
  };
  draw.result(result[num]);
  sound.play();
});
document.getElementById('clean').addEventListener('click', function(){
  draw.initial();
  sound.break();
});
document.getElementById('break').addEventListener('click', function(){
  draw.break();
  sound.break();
});
