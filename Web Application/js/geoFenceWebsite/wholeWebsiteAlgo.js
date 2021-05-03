import { intersection } from '../functions/intersection.js';
import { line_intersection } from '../functions/line-intersection.js';
import { seperateString, distance } from '../functions/genralFunctions.js';
import { receiverPositions } from '../setRoomDim.js';

var patientNameWithBandMac = {};

const bandRef = firebase.database().ref('Band');
const patientRef = firebase.database().ref('Patients');
const alertRef = firebase.database();

(function () {
  bandRef
    .orderByChild('allocated')
    .equalTo(true)
    .once('value', (snap) => {
      var equippedBands = snap.val();

      for (let firebaseKey in equippedBands) {
        patientRef
          .orderByChild('bandId')
          .equalTo(firebaseKey)
          .once('value', (patinetDetailsSnap) => {
            var patinetDetails = patinetDetailsSnap.val();

            var patinetId = equippedBands[firebaseKey].patientId;
            patientNameWithBandMac[firebaseKey] =
              patinetDetails[patinetId].patientName;
          });
      }
    });
})();

getDatafromFirebase();
function getDatafromFirebase() {
  const objectRef = firebase.database().ref('Nearby BLEs');
  objectRef.on('value', (snapshot) => {
    const data = snapshot.val();
    var s1 = data['Receiver 1'];
    var s2 = data['Receiver 2'];
    var s3 = data['Receiver 3'];

    var r1 = seperateString(s1);
    var r2 = seperateString(s2);
    var r3 = seperateString(s3);

    var bands = {
      '84:cc:a8:5e:a5:aa:': [],
      '84:cc:a8:5f:87:5a:': [],
    };

    for (var key in r1) {
      if (key == '84:cc:a8:5e:a5:aa:' || key == '84:cc:a8:5f:87:5a:') {
        bands[key].push(r1[key]);
      }
    }

    for (var key in r2) {
      if (key == '84:cc:a8:5e:a5:aa:' || key == '84:cc:a8:5f:87:5a:') {
        bands[key].push(r2[key]);
      }
    }

    for (var key in r3) {
      if (key == '84:cc:a8:5e:a5:aa:' || key == '84:cc:a8:5f:87:5a:') {
        bands[key].push(r3[key]);
      }
    }

    var ploatingObject = {};
    for (var key in bands) {
      if (bands[key].length == 3) {
        var p = super_ssva(bands[key][0], bands[key][1], bands[key][2]);
        console.log(`The ploated point of ${key} is => x:${p.x} y:${p.y}`);
        ploatingObject[key] = [p.x, p.y];

        // TODO: Geofence Log
        // NOTE: ALERT if patiend tries go out of Geofence
        if (
          ploatingObject[key][0] < receiverPositions.x_axis[0] ||
          ploatingObject[key][0] > receiverPositions.x_axis[1] ||
          ploatingObject[key][1] < receiverPositions.y_axis[0] ||
          ploatingObject[key][1] > receiverPositions.y_axis[1]
        ) {
          // pushGeoFenceToFirebae(key);
          console.error('Geofence');
          showToast(key);
        }
      } else if (bands[key].length == 2) {
        console.warn('Only Two Reciver Receives Signal From Band ', key);
      } else if (bands[key].length == 1) {
        console.warn(
          `Only One Reciver Receving Signal From Band ${key} => On Verge on Geofence`
        );
      } else {
        console.error('Geofence Error', key, bands);
      }
    }
  });
}

// NOTE: super_ssva takes rssi values of the 3 recivers and gives intersection point of two lines;
function super_ssva(rssi1, rssi2, rssi3) {
  var receiver1 = {
    x: receiverPositions.receiver1[0],
    y: receiverPositions.receiver1[1],
    r: distance(rssi1),
  };
  var receiver2 = {
    x: receiverPositions.receiver2[0],
    y: receiverPositions.receiver2[1],
    r: distance(rssi2),
  };
  var receiver3 = {
    x: receiverPositions.receiver3[0],
    y: receiverPositions.receiver3[1],
    r: distance(rssi3),
  };

  // var receiver1 = { x: 0, y: 0, r: 2.03 };
  // var receiver2 = { x: 0.06, y: 3.585, r: 2.53 };
  // var receiver3 = { x: 3.64, y: 2.07, r: 3.176 };

  console.log(`Radius of band from Rec1, Rec2, Rec3 Respectivley`);
  console.log(receiver1.r);
  console.log(receiver2.r);
  console.log(receiver3.r);
  return ssva(receiver1, receiver2, receiver3);
}

// NOTE: ssva takes 3 circle with there center and radius gives final point(ie. patient location)
function ssva(c1, c2, c3) {
  console.log('ssva called');
  try {
    var [m1, m2] = intersection(c1.x, c1.y, c1.r, c2.x, c2.y, c2.r);
  } catch (error) {
    var [m1, m2] = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ];
  }
  try {
    var [n1, n2] = intersection(c1.x, c1.y, c1.r, c3.x, c3.y, c3.r);
  } catch (error) {
    var [n1, n2] = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ];
  }
  return line_intersection(m1, m2, n1, n2);
}

function pushGeoFenceToFirebae(bandid) {
  var d = new Date();
  var dateInUTC = d.toUTCString();
  alertRef.ref('Alert/geofence/' + dateInUTC).set({
    bandid: bandid,
  });
}

function gettingPatientName(macAdd) {
  console.log(patientNameWithBandMac);
  console.log(macAdd);
  // for (const bandMac in patientNameWithBandMac) {
  //   if (bandMac == macAdd.slice(0, -1)) return patientNameWithBandMac[bandMac];
  // }

  for (const [bandMac, Value] of Object.entries(patientNameWithBandMac)) {
    console.log(Value);
    if (bandMac == macAdd.slice(0, -1)) return Value;
  }
}

function showToast(bandid) {
  var x = document.getElementById('geofenceToast');
  let patientName = gettingPatientName(bandid);
  x.innerText = `${patientName} Ran Out of GeoFence`;
  x.className = 'show';
  setTimeout(function () {
    x.className = x.className.replace('show', '');
  }, 5000);
}
