var patientId = document.getElementById('pid');
var button = document.getElementById('pbutton');
var x = document.getElementById('Psnackbar');

(function () {
  // TODO: Dropdown for empty list
  const patientsRef = firebase.database().ref('Patients');
  patientsRef
    .orderByChild('active')
    .equalTo(true)
    .on('value', (snap) => {
      patientId.innerHTML = '';
      for (var key in snap.val()) {
        var option = document.createElement('option');
        option.value = key;
        option.text = snap.val()[key].patientName;
        patientId.appendChild(option);
      }
    });
})();

async function PsubmitClick() {
  const today = new Date();
  const pid = patientId.value;

  const response = await firebase
    .database()
    .ref('Patients/' + pid)
    .update({
      active: false,
      dischargeTime: today.toString(),
    });

  console.log('Response after update Active as False in Patients', response);

  firebase
    .database()
    .ref('Patients/' + pid)
    .on('value', (snap) => {
      var data = snap.val();

      console.log('Patient Id', pid);
      console.log('Patinet Data', data.bandId);
      firebase
        .database()
        .ref('Band/' + data.bandId)
        .set({
          allocated: false,
        });

      document.getElementById('removep').style.display = 'none';
      showSnakBar('Patient Discharged');

      console.log('Written to database: ');
    });

  // const db = firebase.database().ref();

  // db.child("Text").set("Someevwhj");
}
function showSnakBar(message) {
  x.innerText = message;
  x.className = 'show';
  setTimeout(function () {
    x.className = x.className.replace('show', '');
  }, 3000);
}
