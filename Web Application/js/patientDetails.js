// const q = document.getElementById('content');
var tableTag = document.getElementById('tableid');

const objectRef = firebase.database().ref('Patients');

objectRef.once('value', (snap) => {
  var index = 0;

  var p = snap.val(); // only for simplicity
  console.log(p);

  for (var key of Object.keys(p)) {
    console.log(key + ' -> ' + JSON.stringify(p[key]));
    var patientDetails = p[key];

    index += 1;
    var row = tableTag.insertRow(index);

    var col0 = row.insertCell(0);
    var col1 = row.insertCell(1);
    var col2 = row.insertCell(2);
    var col3 = row.insertCell(3);
    var col4 = row.insertCell(4);
    var col5 = row.insertCell(5);

    col0.innerHTML = patientDetails['patientName'];
    col1.innerHTML = key;
    col2.innerHTML = patientDetails['bandId'];
    col3.innerHTML = patientDetails['roomAllocated'];
    col4.innerHTML = showDate(patientDetails['dischargeTime']);

    if (patientDetails['dischargeTime']) {
      col5.innerHTML = 'Patient discharged';
    } else {
      firebase
        .database()
        .ref('Battery/' + patientDetails.bandId)
        .once('value', (snap) => {
          var data = snap.val();
          console.log(data.Percentage);
          col5.innerHTML = data.Percentage;
        });
    }
  }
});

async function showBatteryPercentage(patientDetail) {
  console.log(patientDetail);

  let battery = batPercentage.val();
  console.log(battery);

  return battery['Percentage'].toString();
}

function showDate(date) {
  if (date == undefined) {
    return `Patient is not discharged Yet`;
  }
  const modifiedDate = new Date(date);
  var returnStr = `${modifiedDate.getDate()}/${
    modifiedDate.getMonth() + 1
  }/${modifiedDate.getFullYear()}-${modifiedDate.getHours()}:${modifiedDate.getMinutes()}`;
  console.log(returnStr);
  return returnStr;
}
