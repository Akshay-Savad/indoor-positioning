var addBandId = document.getElementById('addBandId');
var addBandButton = document.getElementById('addBandButton');
var addBandSnackbar = document.getElementById('snackbar');
var modal = document.getElementById('band');

async function submitClick() {
  console.log(addBandId, addBandButton);
  firebase
    .database()
    .ref('Band/' + addBandId.value)
    .set({
      allocated: false,
      patientId: false,
    });
  if (true) {
    // x.className = 'show';
    addBandSnackbar.classList.add('show');
    setTimeout(function () {
      addBandSnackbar.className = addBandSnackbar.className.replace('show', '');
    }, 3000);
  }
  console.log('Written to database: ');

  // const db = firebase.database().ref();

  // db.child("Text").set("Someevwhj");
}
