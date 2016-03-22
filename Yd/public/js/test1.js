// 動畫
setTimeout(function() {
  $('img#'+getResult.start+'Pass').attr('src','/img/pass.PNG');
  t = 1;
  b = 1;
  context.beginPath();
  context.strokeStyle = "#3B3A3C";
  // context.lineCap = 'round';// 線頭與線尾變圓滑
  // context.lineJoin = 'round';// 線頭與轉角處變圓滑
  points = setPath(config[result].path);
  context.moveTo(config[result].path[0].x,config[result].path[0].y);
  var timer = setInterval(function(){
    context.lineTo(points[t].x, points[t].y);
    context.stroke();
    t++;
    if(t >= points.length) {
      clearInterval(timer);
      context.closePath();
      $('img#'+getResult.end+'Img').attr('src','/img/'+config[result].resultImg+'.PNG');
    }
  }, 10);
  function setPath(points) {
    var wayPoints = [];
    for (var i = 1; i < points.length; i++) {
      var pt0 = points[i - 1];
      var pt1 = points[i];
      var dx = pt1.x - pt0.x;
      var dy = pt1.y - pt0.y;
      var z = 0;
      for (var j = 0; j < 20; j++) {
        var x = pt0.x + dx * j / 20;
        var y = pt0.y + dy * j / 20;
        wayPoints.push({x: x , y: y});
      }
    }
    return (wayPoints);
    timer();
  }
},1000);
