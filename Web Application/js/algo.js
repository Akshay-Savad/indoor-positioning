import { intersection } from './functions/intersection.js';
import { line_intersection } from './functions/line-intersection.js';
import { seperateString, distance } from './functions/genralFunctions.js';
import { ploating } from './functions/ploating.js';
import { receiverPositions } from './setRoomDim.js';

var ALGO_ML_Switch = true; // NOTE: If false means ML is running, If true means ALGO is running

if (ALGO_ML_Switch) {
  getDatafromFirebase();
  showALGOploatly();
} else {
  plotUsingML();
}

function plotUsingML() {
  // NOTE: For Fetching Co-ordinates predict by ML from Firebase
  var ploatingObject = {};
  const reciverRef = firebase.database().ref('Distance');
  reciverRef.on('value', (snap) => {
    var patientLocation = snap.val();
    for (var macAdd in patientLocation) {
      ploatingObject[macAdd] = [
        patientLocation[macAdd]['X_coord'],
        patientLocation[macAdd]['Y_coord'],
      ];
    }

    // NOTE: Ploating Object = {
    // bandMacId : [x_co, y_co]
    // }

    // Creating ploating object
    ploatingObject = Object.create(ploatingObject);
    console.log('Ploating Object', ploatingObject);

    ploating(ploatingObject, receiverPositions);
  });
}

// getDatafromFirebase();
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
        if (p == false) {
          console.log('Circle Contain for this Patient => ', key);
          firebase
            .database()
            .ref('Distance/' + key)
            .once('value', (snap) => {
              var data = snap.val();
              firebase
                .database()
                .ref('PatientLocation/' + key)
                .set({
                  x_co: data.X_coord,
                  y_co: data.Y_coord,
                });
            });
        } else {
          console.log(`The ploated point of ${key} is: ${p}`);
          ploatingObject[key] = [p.x, p.y];

          // NOTE: Pushed co-ordinate from here.
          firebase
            .database()
            .ref('PatientLocation/' + key)
            .set({
              x_co: p.x,
              y_co: p.y,
            });
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

function showALGOploatly() {
  var receiverPositions = {},
    ploatingObject = {};

  firebase
    .database()
    .ref('Receivers')
    .once('value', (snap) => {
      // NOTE: Since receiver Positions Does not change Freauently hence using once
      var recivers = snap.val();
      var receiverPositions = {
        receiver1: [recivers.R1.X, recivers.R1.Y],
        receiver2: [recivers.R2.X, recivers.R2.Y],
        receiver3: [recivers.R3.X, recivers.R3.Y],
        x_axis: [recivers.Geofence.x1, recivers.Geofence.x2], // Length of the room
        y_axis: [recivers.Geofence.y1, recivers.Geofence.y2], // width of the room
        plotlyZoom_X: [recivers.Geofence.x1 - 2, recivers.Geofence.x2 + 2], // For Zoom level of ploaty
        plotlyZoom_Y: [recivers.Geofence.y1 - 2, recivers.Geofence.y2 + 2],
      };

      var flag = {
        '84:cc:a8:5f:87:5a:': true,
        '84:cc:a8:5e:a5:aa:': true,
      };

      firebase
        .database()
        .ref('PatientLocation')
        .on('value', (snap) => {
          var patientLocation = snap.val();
          console.log('Patient Locations', patientLocation);

          for (var key in patientLocation) {
            ploatingObject[key] = [
              patientLocation[key]['x_co'],
              patientLocation[key]['y_co'],
            ];

            if (
              ploatingObject[key][0] < receiverPositions.x_axis[0] ||
              ploatingObject[key][0] > receiverPositions.x_axis[1] ||
              ploatingObject[key][1] < receiverPositions.y_axis[0] ||
              ploatingObject[key][1] > receiverPositions.y_axis[1]
            ) {
              console.log(flag);
              if (flag[key]) {
                pushGeoFenceToFirebae(key, ploatingObject[key]);
                flag[key] = false;
              }
            } else {
              flag[key] = true;
            }
          }

          ploating(ploatingObject, receiverPositions);
        });
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

    return false;
  }
  try {
    var [n1, n2] = intersection(c1.x, c1.y, c1.r, c3.x, c3.y, c3.r);
  } catch (error) {
    var [n1, n2] = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ];

    return false;
  }
  return line_intersection(m1, m2, n1, n2);
}

function pushGeoFenceToFirebae(bandid, lastCoOrdinate) {
  const alertRef = firebase.database();
  var d = new Date();
  var dateInUTC = d.toUTCString();
  alertRef.ref('Alert/geofence/' + dateInUTC).set({
    bandid: bandid,
    coOrdinate: {
      x: lastCoOrdinate[0],
      y: lastCoOrdinate[1],
    },
  });
}
