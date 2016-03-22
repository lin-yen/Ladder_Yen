// 動畫
setTimeout(function() {
  $('img#'+getResult.start+'Pass').attr('src','/img/pass.PNG');
  var pointCount = 0;
  var intervalID;
  context.beginPath();
  context.strokeStyle = "#3B3A3C";
  // context.lineCap = 'round';// 線頭與線尾變圓滑
  // context.lineJoin = 'round';// 線頭與轉角處變圓滑
  points = setPath(config[result].path);
  nextLine(context);
  function nextLine(context) {
    context.moveTo(config[result].path[0].x,config[result].path[0].y);
    intervalID = setInterval(drawLine, 30, context);
  }

  function drawLine(context) {
    var p = points[pointCount];
    console.log(pointCount, p.x, p.y);

    context.lineTo(p.x, p.y);
    context.stroke();
    pointCount++;
    if (pointCount == points.length) {
      clearInterval(intervalID);
      context.closePath();
    }
  }

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
  }
},1000);
