function seperateString(str) {
  var bands = {};
  var res = str.split(',');

  for (var i = 0; i < res.length - 1; i++) {
    var s = res[i].split('-');
    s[1] = '-' + s[1];
    bands[s[0]] = s[1];
  }

  return bands;
}

function distance(rssi) {
  var dist;
  const measured_power = -73,
    n = 2;

  dist = Math.pow(10, (measured_power - rssi) / (10 * n));

  return dist;

  // NOTE: Distance Formula
  // Distance = 10 ^ ((Measured Power – RSSI)/(10 * N))
  // Where N => Enviroument Factor    Measured Power => Powerd at 1 Meter
}

export { seperateString, distance }; // Named Export
