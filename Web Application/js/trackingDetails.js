var tableTag = document.getElementById('tableid');

const objectRef = firebase.database().ref('Patients');

objectRef
  .orderByChild('active')
  .equalTo(true)
  .on('value', async (snap) => {
    var index = 0;

    if (snap.val() === null) return;

    for (var key of Object.keys(snap.val())) {
      var values = snap.val()[key];

      firebase
        .database()
        .ref('PatientLocation/' + values.bandId + ':')
        .on('value', (snap) => {
          var data = snap.val();
          var patientLocation_x = data['x_co'];
          var patientLocation_y = data['y_co'];

          index += 1;
          var row = tableTag.insertRow(index);

          var col0 = row.insertCell(0);
          var col1 = row.insertCell(1);
          var col2 = row.insertCell(2);
          var col3 = row.insertCell(3);

          col0.innerHTML = key;
          col1.innerHTML = values['bandId'];
          col2.innerHTML = values['patientName'];
          col3.innerHTML = `(${patientLocation_x.toFixed(
            2
          )},${patientLocation_y.toFixed(2)})`;
        });
    }
  });
