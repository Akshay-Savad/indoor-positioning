var geofenceTable = document.getElementById('geofenceTable');
var socialDistencingTable = document.getElementById('socialDistencingTable');

const alertRef = firebase.database().ref('Alert');
const patientRef = firebase.database().ref('Patients');

var patientName;

(function () {
  alertRef.get().then(async (snap) => {
    var patientInfo = await patientRef.get().then((snap) => {
      return snap.val();
    });
    var index = 0;

    var alerts = snap.val();
    var geoFenceAlert = alerts['geofence'];
    var socialDistencing = alerts['socialDistancing'];

    var patientInfoArray = Object.values(patientInfo);
    console.log(patientInfoArray);

    for (var key in geoFenceAlert) {
      var patient = patientInfoArray.find((element) => {
        var dateChecker = element.dischargeTime
          ? element.dischargeTime > key
          : true;
        return (
          element.issueDate < key &&
          dateChecker &&
          element.bandId == geoFenceAlert[key]['bandid'].slice(0, -1)
        );
      });

      if (!patient) {
        continue;
      }
      patientName = patient.patientName;

      var d = new Date(key);

      index += 1;
      var row = geofenceTable.insertRow(index);

      var col0 = row.insertCell(0);
      var col1 = row.insertCell(1);
      var col2 = row.insertCell(2);

      col0.innerHTML = `${d.getDate()}/${
        d.getMonth() + 1
      }/${d.getFullYear()}  ${d.getHours()}:${d.getMinutes()}`;
      col1.innerHTML = patientName;
      col2.innerHTML = `(${geoFenceAlert[key]['coOrdinate']['x'].toFixed(
        2
      )},${geoFenceAlert[key]['coOrdinate']['y'].toFixed(2)})`;
    }

    index = 0;

    for (var key in socialDistencing) {
      var patient = patientInfoArray.find((element) => {
        return (
          element.issueDate < key &&
          (element.dischargeTime ? element.dischargeTime > key : true) &&
          element.bandId == socialDistencing[key]['bandid']
        );
      });

      if (!patient) {
        continue;
      }

      patientName = patient.patientName;

      var d = new Date(key);

      index += 1;
      var row = socialDistencingTable.insertRow(index);

      var col0 = row.insertCell(0);
      var col1 = row.insertCell(1);

      col0.innerHTML = `${d.getDate()}/${
        d.getMonth() + 1
      }/${d.getFullYear()}  ${d.getHours()}:${d.getMinutes()}`;
      col1.innerHTML = patientName;
    }
  });
})();
