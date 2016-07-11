'use strict';
window.requestAnimFrame = function()
	{
		return (
			window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback){
				window.setTimeout(callback, 1000 / 60);
			}
		);
	}();
// 畫布
var myCanvas,context;
//要使用到的值
var drawSTT,drawRAF,result;
var imgUrl = '/img/';
var lang = 'en';
var config = {
  leftToeven: {
    path: [
      { x: 22, y: 53 },
      { x: 22, y: 109 },
      { x: 192, y: 109 },
      { x: 192, y: 129 },
      { x: 22, y: 129 },
      { x: 22, y: 149 },
      { x: 192, y: 149 },
      { x: 192, y: 210 }
    ],
    pathCount:[30,40,20,40,20,40,30],
    passID: 'leftPass',
    passX: 0,
    passY: 0,
    imgID: 'rightImg',
    imgName: 'ladder_area_even_red',
    imgX: 171,
    imgY: 215
  },
  rightToodd: {
    path: [
      { x: 192, y: 53 },
      { x: 192, y: 109 },
      { x: 22, y: 109 },
      { x: 22, y: 129 },
      { x: 192, y: 129 },
      { x: 192, y: 149 },
      { x: 22, y: 149 },
      { x: 22, y: 210 }
    ],
    pathCount:[30,40,20,40,20,40,30],
    passID: 'rightPass',
    passX: 171,
    passY: 0,
    imgID: 'leftImg',
    imgName: 'ladder_area_odd_blue',
    imgX: 0,
    imgY: 215
  },
  leftToodd: {
    path: [
      { x: 22, y: 53 },
      { x: 22, y: 99 },
      { x: 192, y: 99 },
      { x: 192, y: 119 },
      { x: 22, y: 119 },
      { x: 22, y: 139 },
      { x: 192, y: 139 },
      { x: 192, y: 159 },
      { x: 22, y: 159 },
      { x: 22, y: 210 }
    ],
    pathCount:[30,40,20,40,20,40,20,40,30],
    passID: 'leftPass',
    passX: 0,
    passY: 0,
    imgID: 'leftImg',
    imgName: 'ladder_area_odd_blue',
    imgX: 0,
    imgY: 215
  },
  rightToeven: {
    path: [
      { x: 192, y: 53 },
      { x: 192, y: 99 },
      { x: 22, y: 99 },
      { x: 22, y: 119 },
      { x: 192, y: 119 },
      { x: 192, y: 139 },
      { x: 22, y: 139 },
      { x: 22, y: 159 },
      { x: 192, y: 159 },
      { x: 192, y: 210 }
    ],
    pathCount:[30,40,20,40,20,40,20,40,30],
    passID: 'rightPass',
    passX: 171,
    passY: 0,
    imgID: 'rightImg',
    imgName: 'ladder_area_even_red',
    imgX: 171,
    imgY: 215
  }
};
var draw = {};
draw.initial = function() {
  // 畫布
  myCanvas = document.getElementById('canvas');
  context = myCanvas.getContext('2d');
  myCanvas.width = 214;
  myCanvas.height = 258;
  // clear Canvas
  context.clearRect(0, 0, 214, 258);
  // 清除動畫
  clearTimeout(drawSTT);
  cancelAnimationFrame(drawRAF);
  // 四個角的圖
  var imgConfig = {
    leftImg: [
      imgUrl+'lang/'+lang+'/ladder_area_odd.png',
      0,
      215
    ],
    rightImg: [
      imgUrl+'lang/'+lang+'/ladder_area_even.png',
      171,
      215
    ],
    rightPass: [
      imgUrl+'ladder_area_first.png',
      0,
      0
    ],
    leftPass: [
      imgUrl+'ladder_area_first.png',
      171,
      0
    ]
  };
  for(var imgCount in imgConfig){
    drawImage(imgCount);
  }
  function drawImage(imgCount){
    var img = new Image();
    img.src = imgConfig[imgCount][0];
    img.onload = function() {
      context.drawImage(img, imgConfig[imgCount][1], imgConfig[imgCount][2]);
    };
  }

  // 左右兩條直線
  context.lineWidth = 12;
  context.strokeStyle = '#C6C3B9';
  // 左
  context.beginPath();
  context.moveTo(22,53);
  context.lineTo(22,205);
  context.stroke();
  // 右
  context.moveTo(192,53);
  context.lineTo(192,205);
  context.stroke();
  context.closePath();
};

draw.result = function(getResult,callback){
  // 設定
  result = getResult.start + 'To' + getResult.end;

  // 中間的橫線
  for (var count = 1; count < config[result].path.length-1; count++) {
    context.beginPath();
    context.moveTo(22,config[result].path[count].y);
    context.lineTo(192,config[result].path[count].y);
    context.stroke();
    context.closePath();
    count ++;
  }

  drawSTT = setTimeout(function() {
    var pass = new Image();
    pass.src = '/img/first_on.png';
    pass.onload = function() {
      context.drawImage(pass, config[result].passX, config[result].passY);
      setPath(config[result].path, config[result].pathCount);
    };
    var wayPoints = [];
    function setPath(points, pathCount) {
      for (var i = 1; i < points.length; i++) {
        var xGap = points[i].x - points[i-1].x;
        var yGap = points[i].y - points[i-1].y;
        for (var count = 0; count < pathCount[i-1]; count++) {
          var x = points[i-1].x + xGap * count / pathCount[i-1];
          var y = points[i-1].y + yGap * count / pathCount[i-1];
          wayPoints.push({ x: x, y: y });
        }
      }
      var startTime = (new Date()).getTime();
      animate(drawing, startTime);
      return true;
    }

    function drawing(way, count){
      context.beginPath();
      context.strokeStyle = '#3B3A3C';
      context.lineCap = 'round';// 線頭與線尾變圓滑
      context.lineJoin = 'round';// 線頭與轉角處變圓滑
      context.moveTo(config[result].path[0].x,config[result].path[0].y);
      for (var i = 0; i <= count; i++) {
        context.lineTo(way[i].x, way[i].y);
      }
      context.stroke();
      context.closePath();
    }

    function animate(drawLine, startTime) {
      var time = (new Date()).getTime() - startTime;
      var linearSpeed = 16;
      var darwcount = Math.round(linearSpeed * time / 220);

      if(darwcount >= wayPoints.length) {
        drawLine(wayPoints, wayPoints.length - 1);var rImg = new Image();
        rImg.onload = function() {
          context.drawImage(rImg, config[result].imgX, config[result].imgY);
          callback();
        };
        rImg.src = '/img/lang/'+lang+'/'+config[result].imgName+'.png';
        return true;
      }

      drawLine(wayPoints, darwcount);

      drawRAF = requestAnimFrame(function() {
        animate(drawLine, startTime);
      });
    }

      // setTimeout <--預備 點狀
      // function smartInterval(func, interval){
      //   var last = new Date() - interval,
      //   now,
      //   numMissed;
      //
      //   (function iterate(){
      //     func();
      //
      //     // compute the number of iterations you might have missed
      //     // if you tabbed away and the interval was restricted to 1000ms
      //     now = +new Date();
      //     numMissed = Math.round((now - last) / interval) - 1;
      //
      //     // make up for those iterations that were lost
      //     while (numMissed--) { func(); }
      //
      //     last = +new Date();
      //     setTimeout(iterate, interval);
      //   })();
      // }
      // function animate(){
      //   if(drawCount >= wayPoints.length) {
      //     context.closePath();
      //     var rImg = new Image();
      //     rImg.onload = function() {
      //       context.drawImage(rImg, config[result].imgX, config[result].imgY);
      //       callback();
      //     };
      //     rImg.src = '/img/lang/'+lang+'/'+config[result].imgName+'.png';
      //     return true;
      //   }
      //   context.lineTo(wayPoints[drawCount].x, wayPoints[drawCount].y);
      //   context.stroke();
      //   drawCount++;
      // }
      // smartInterval(animate, 16);

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
var turnOff = document.getElementsByClassName('sound_turnoff')[0];
var open = document.getElementsByClassName('sound_open')[0];
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
  梯子動畫：
    tag：canvas#canvas
    初始化：draw.initial()
    播放動畫：draw.result({'start':'right或left','end':'right或left'},function () {
      // dosomething;
    })
--------------------------------------------------------------------------
  背景音樂：
    tag：
      div.sound
        a.sound_turnoff
        a.sound_open
    css：
      .sound
        width: 63px
        height: 24px
        .sound_turnoff
          background: url('../../img/btn_sound_turnoff.png') no-repeat
          background-position: 0px 0px
          float: left
          width: 24px
          height: 20px
        .sound_open
          background: url('../../img/btn_sound_open.png') no-repeat
          background-position: 0px -20px
          float: right
          width: 24px
          height: 20px
    播放背景音樂：sound.play();
    中止背景音樂：sound.break();
*/

// 測試用(´_ゝ`)
document.getElementById('play').addEventListener('click', function(){
  var num = Math.floor((Math.random() * 4) + 1);
  var result = {
    1:{
      'start':'right',
      'end':'even'
    },
    2:{
      'start':'left',
      'end':'even'
    },
    3:{
      'start':'left',
      'end':'odd'
    },
    4:{
      'start':'right',
      'end':'odd'
    }
  };
  draw.result(result[num],function () {
    console.log(result[num]);
  });
  sound.play();
});
document.getElementById('clean').addEventListener('click', function(){
  draw.initial();
  sound.break();
});
