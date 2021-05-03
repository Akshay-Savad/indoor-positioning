var rec1x = document.getElementById('rec1x');
var rec1y = document.getElementById('rec1y');
var rec2x = document.getElementById('rec2x');
var rec2y = document.getElementById('rec2y');
var rec3x = document.getElementById('rec3x');
var rec3y = document.getElementById('rec3y');

var snakbar = document.getElementById('receiverSnackbar');

var receiverSubmitBUtton = document.getElementById('receiverSubmitBUtton');

(function () {
  receiverSubmitBUtton.onclick = function () {
    firebase.database().ref('Receivers/R1').set({
      X: rec1x.value,
      Y: rec1y.value,
    });

    firebase.database().ref('Receivers/R2').set({
      X: rec2x.value,
      Y: rec2y.value,
    });

    firebase.database().ref('Receivers/R3').set({
      X: rec3x.value,
      Y: rec3y.value,
    });

    snakbar.className = 'show';
    setTimeout(function () {
      snakbar.className = snakbar.className.replace('show', '');
      document.getElementById('receiverPositions').style.display = 'none';
    }, 3000);
  };
})();
