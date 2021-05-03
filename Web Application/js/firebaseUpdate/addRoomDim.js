var roomDimX0 = document.getElementById('roomDimX0');
var roomDimX1 = document.getElementById('roomDimX1');
var roomDimY0 = document.getElementById('roomDimY0');
var roomDimY1 = document.getElementById('roomDimY1');

var snakbar = document.getElementById('snackbar');

var addRoomDim = document.getElementById('addRoomDim');

(function () {
  addRoomDim.onclick = function () {
    console.log(roomDimX0.value);
    firebase.database().ref('Receivers/Geofence').set({
      x1: roomDimX0.value,
      x2: roomDimX1.value,
      y1: roomDimY0.value,
      y2: roomDimY1.value,
    });

    snakbar.className = 'show';
    setTimeout(function () {
      snakbar.className = snakbar.className.replace('show', '');
      document.getElementById('roomDim').style.display = 'none';
    }, 3000);
  };
})();
