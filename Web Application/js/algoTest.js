// console.log(intersection(0,0,1,3,0,2));
function seperateString(str) {
  var bands = {};
  var res = str.split(',');
  for (i = 0; i < res.length - 1; i++) {
    var s = res[i].split('-');
    s[1] = '-' + s[1];
    bands[s[0]] = s[1];
  }
  return bands;
}

getDatafromFirebase();
function getDatafromFirebase() {
  const objectRef = firebase.database().ref('Nearby BLEs');
  objectRef.on('value', (snapshot) => {
    const data = snapshot.val();
    s1 = data['Receiver 1'];
    s2 = data['Receiver 2'];
    s3 = data['Receiver 3'];
    var r1 = seperateString(s1);
    var r2 = seperateString(s2);
    var r3 = seperateString(s3);
    var bands = {
      '84:cc:a8:5e:a5:aa:': [],
      '94:cd:a7:5f:87:5a:': [],
    };
    for (var key in r1) {
      if (key == '84:cc:a8:5e:a5:aa:') {
        bands[key].push(r1[key]);
      }
      if (key == '94:cd:a7:5f:87:5a:') {
        bands[key].push(r1[key]);
      }
    }

    for (var key in r2) {
      if (key == '84:cc:a8:5e:a5:aa:') {
        bands[key].push(r2[key]);
      }
      if (key == '94:cd:a7:5f:87:5a:') {
        bands[key].push(r2[key]);
      }
    }

    for (var key in r3) {
      if (key == '84:cc:a8:5e:a5:aa:') {
        bands[key].push(r3[key]);
      }
      if (key == '94:cd:a7:5f:87:5a:') {
        bands[key].push(r3[key]);
      }
    }
    for (var key in bands) {
      if (bands[key].length == 3) {
        console.log('If part executed');
        var p = super_ssva(bands[key][0], bands[key][1], bands[key][2]);
        console.log('The ploated point is: ');
        console.log(p);
        ploating(p.x, p.y);
      }
      // else if(bands[key.length] == 2){
      //   //need to code
      // }
      // else{
      //   //bhag gaya
      // }
    }
  });
}

function super_ssva(rssi1, rssi2, rssi3) {
  // console.log('Test');
  var receiver1 = { x: 0, y: 0, r: distance(rssi1) };
  var receiver2 = { x: 0.06, y: 3.585, r: distance(rssi2) };
  var receiver3 = { x: 3.64, y: 2.07, r: distance(rssi3) };
  console.log(receiver1.r);
  console.log(receiver2.r);
  console.log(receiver3.r);
  // var receiver1 = { x: 0, y: 0, r: 2.03 };
  // var receiver2 = { x: 0.06, y: 3.585, r: 2.53 };
  // var receiver3 = { x: 3.64, y: 2.07, r: 3.176 };

  return ssva(receiver1, receiver2, receiver3);
}
function ssva(c1, c2, c3) {
  [m1, m2] = intersection(c1.x, c1.y, c1.r, c2.x, c2.y, c2.r);
  [n1, n2] = intersection(c1.x, c1.y, c1.r, c3.x, c3.y, c3.r);
  return line_intersection(m1, m2, n1, n2);
}

function line_intersection(p1, p2, p3, p4) {
  // down part of intersection point formula
  var d1 = (p1.x - p2.x) * (p3.y - p4.y); // (x1 - x2) * (y3 - y4)
  var d2 = (p1.y - p2.y) * (p3.x - p4.x); // (y1 - y2) * (x3 - x4)
  var d = d1 - d2;

  if (d == 0) {
    errorNo += 1;
    throw new Error('Number of intersection points is zero or infinity.');
  }

  // down part of intersection point formula
  var u1 = p1.x * p2.y - p1.y * p2.x; // (x1 * y2 - y1 * x2)
  var u4 = p3.x * p4.y - p3.y * p4.x; // (x3 * y4 - y3 * x4)

  var u2x = p3.x - p4.x; // (x3 - x4)
  var u3x = p1.x - p2.x; // (x1 - x2)
  var u2y = p3.y - p4.y; // (y3 - y4)
  var u3y = p1.y - p2.y; // (y1 - y2)

  // intersection point formula

  var px = (u1 * u2x - u3x * u4) / d;
  var py = (u1 * u2y - u3y * u4) / d;

  var p = { x: px, y: py };

  return p;
}

function distance(rssi) {
  var dist;
  var measured_power = -73;
  var n = 2;
  dist = Math.pow(10, (measured_power - rssi) / (10 * n));
  return dist;
  // console.log("Distance is :" + dist);
  //   Distance = 10 ^ ((Measured Power – RSSI)/(10 * N))

  // Where N=2
  // RSSI = -73/ -74
}
function intersection(x0, y0, r0, x1, y1, r1) {
  var a, dx, dy, d, h, rx, ry;
  var x2, y2;

  /* dx and dy are the vertical and horizontal distances between
   * the circle centers.
   */
  dx = x1 - x0;
  dy = y1 - y0;

  /* Determine the straight-line distance between the centers. */
  d = Math.sqrt(dy * dy + dx * dx);

  /* Check for solvability. */
  if (d > r0 + r1) {
    /* no solution. circles do not intersect. */
    errorNo += 1;
    return false;
  }
  if (d < Math.abs(r0 - r1)) {
    /* no solution. one circle is contained in the other */
    errorNo += 1;
    return false;
  }

  /* 'point 2' is the point where the line through the circle
   * intersection points crosses the line between the circle
   * centers.
   */

  /* Determine the distance from point 0 to point 2. */
  a = (r0 * r0 - r1 * r1 + d * d) / (2.0 * d);

  /* Determine the coordinates of point 2. */
  x2 = x0 + (dx * a) / d;
  y2 = y0 + (dy * a) / d;

  /* Determine the distance from point 2 to either of the
   * intersection points.
   */
  h = Math.sqrt(r0 * r0 - a * a);

  /* Now determine the offsets of the intersection points from
   * point 2.
   */
  rx = -dy * (h / d);
  ry = dx * (h / d);

  /* Determine the absolute intersection points. */
  var xi = x2 + rx;
  var xi_prime = x2 - rx;
  var yi = y2 + ry;
  var yi_prime = y2 - ry;

  var point1 = { x: xi, y: yi };
  var point2 = { x: xi_prime, y: yi_prime };
  return [point1, point2];
}
// ploating(2,2);
var global_count = 0;
var iteration = 5;
var avgx = 0;
var avgy = 0;
var errorNo = 0;
function ploating(x, y) {
  console.log('x = ' + x + 'y = ' + y);
  global_count++;
  if (global_count == iteration) {
    global_count = 0;
    console.log('Ploat zala ahe');
    var myPlot = document.getElementById('myDiv');
    var xy = new Float32Array([
      avgx / (iteration - errorNo),
      avgy / (iteration - errorNo),
    ]);
    errorNo = 0;

    data = [{ xy: xy, type: 'pointcloud' }];
    layout = {
      xaxis: {
        showgrid: true,
        zeroline: true,
        showline: true,
        mirror: 'ticks',
        gridcolor: '#bdbdbd',
        gridwidth: 2,
        zerolinecolor: '#969696',
        zerolinewidth: 4,
        linecolor: '#636363',
        linewidth: 6,
        range: [0, 20],
      },
      yaxis: {
        showgrid: true,
        zeroline: true,
        showline: true,
        mirror: 'ticks',
        gridcolor: '#bdbdbd',
        gridwidth: 2,
        zerolinecolor: '#969696',
        zerolinewidth: 4,
        linecolor: '#636363',
        linewidth: 6,
        range: [0, 20],
      },
    };

    Plotly.newPlot('myDiv', data, layout);
  } else {
    avgx += x;
    avgy += y;
    console.log('Thamba thoda!!' + (iteration - global_count));
  }
}
