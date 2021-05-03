var RoomAllocated = document.getElementById('Room-allocated');
var BandId = document.getElementById('BandId');
var PatientName = document.getElementById('Patient-name');
var submitButton = document.getElementById('Abutton');
var x = document.getElementById('Asnackbar');

async function AsubmitClick() {
  var today = new Date();

  if (submitButton.classList.contains('noBand')) {
    showSnakBar('No Band is Avaliable');
    return;
  }

  // Validating Fields
  if (
    RoomAllocated.value == '' ||
    BandId.value == '' ||
    PatientName.value == ''
  ) {
    showSnakBar('Fields Are Empty');
    return;
  }

  // firebase
  //   .database()
  //   .ref('Patients/' + PatientId.value)
  //   .set({
  //     roomAllocated: RoomAllocated.value,
  //     bandId: BandId.value,
  //     patientName: PatientName.value,
  //     active: true,
  //     issueDate: today.toString(),
  //   });

  // With Unique Id
  const response = await firebase.database().ref('Patients/').push({
    roomAllocated: RoomAllocated.value,
    bandId: BandId.value,
    patientName: PatientName.value,
    active: true,
    issueDate: today.toString(),
  });

  console.log(response.key);

  firebase
    .database()
    .ref('Band/' + BandId.value)
    .set({
      allocated: true,
      patientId: response.key,
    });

  showSnakBar('Patient Registered!');
  document.getElementById('addp').style.display = 'none';

  console.log('Written to firebase: ');
  return;
}

function showSnakBar(message) {
  x.innerText = message;
  x.className = 'show';
  setTimeout(function () {
    x.className = x.className.replace('show', '');
  }, 3000);
}
