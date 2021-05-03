import { distance } from './genralFunctions.js';
var patientNameWithBandMac = {};

const bandRef = firebase.database().ref('Band');
const patientRef = firebase.database().ref('Patients');

bandRef
  .orderByChild('allocated')
  .equalTo(true)
  .once('value', (snap) => {
    var equippedBands = snap.val();

    for (var key in equippedBands) {
      patientRef
        .orderByChild('bandId')
        .equalTo(key)
        .once('value', (patinetDetailsSnap) => {
          var patinetDetails = patinetDetailsSnap.val();
          var patinetId = equippedBands[key].patientId;
          patientNameWithBandMac[key] = patinetDetails[patinetId].patientName;
        });
    }
    console.log(patientNameWithBandMac, equippedBands);
  });

function ploating(ploatingObject, receiverPositions) {
  var myPlot = document.getElementById('myDiv');
  var trace = [],
    bgColor = '#ffffff';

  if (
    Object.keys(ploatingObject).length === 0 && // NOTE: Checking is points are not null, if they are null then plot at (0,0)
    ploatingObject.constructor === Object
  ) {
    var trace1 = {
      xy: new Float32Array([0, 0]),
      type: 'pointcloud',

      mode: 'markers+text',
      name: 'Markers and Text',
      text: [key],
      textposition: 'top',
      marker: {
        size: 20,
      },
    };

    trace.push(trace1);
  } else {
    for (var key in ploatingObject) {
      console.log(
        'Patient Location',
        ploatingObject[key][0],
        ploatingObject[key][1]
      );
      if (
        ploatingObject[key][0] < receiverPositions.x_axis[0] ||
        ploatingObject[key][0] > receiverPositions.x_axis[1] ||
        ploatingObject[key][1] < receiverPositions.y_axis[0] ||
        ploatingObject[key][1] > receiverPositions.y_axis[1]
      ) {
        bgColor = 'rgba(255,0,0,0.7)';
      }

      var trace1 = {
        xy: new Float32Array(ploatingObject[key]),
        type: 'pointcloud',

        mode: 'markers+text',
        name: 'Markers and Text',
        text: [gettingPatientName(key)],
        textposition: 'top',
        marker: {
          size: 20,
        },
      };

      trace.push(trace1);
    }
  }

  // NOTE: trace2 is object for design of receiver
  var trace2 = {
    type: 'pointcloud',
    marker: {
      sizemin: 0.5,
      sizemax: 50,
      border: {
        color: 'rgb(0, 0, 0)',
        arearatio: 0.7071,
      },
      color: 'green',
      opacity: 0.8,
      blend: true,
    },
    opacity: 0.7,
    x: [
      receiverPositions.receiver1[0],
      receiverPositions.receiver2[0],
      receiverPositions.receiver3[0],
    ],
    y: [
      receiverPositions.receiver1[1],
      receiverPositions.receiver2[1],
      receiverPositions.receiver3[1],
    ],
    mode: 'text',
    text: ['Receiver 1', 'Receiver 2', 'Receiver 3'],
    textposition: 'top',
  };

  trace.push(trace2);

  var layout = {
    plot_bgcolor: bgColor,
    showlegend: false,
    xaxis: {
      showgrid: true,
      zeroline: true,
      showline: true,
      mirror: 'ticks',
      gridcolor: '#bdbdbd',
      gridwidth: 2,
      zerolinecolor: '#969696',
      zerolinewidth: 4,
      linecolor: '#636363',
      linewidth: 6,
      range: receiverPositions.plotlyZoom_X,
    },

    yaxis: {
      showgrid: true,
      zeroline: true,
      showline: true,
      mirror: 'ticks',
      gridcolor: '#bdbdbd',
      gridwidth: 2,
      zerolinecolor: '#969696',
      zerolinewidth: 4,
      linecolor: '#636363',
      linewidth: 6,
      range: receiverPositions.plotlyZoom_Y,
    },

    annotations: [
      {
        x: receiverPositions.receiver1[0],
        y: receiverPositions.receiver1[1],
        xref: 'x',
        yref: 'y',
        text: 'Receiver 1',
        showarrow: true,
        font: {
          family: 'Courier New, monospace',
          size: 16,
          color: '#000000',
        },
        align: 'center',
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: 'black',
        ax: 20,
        ay: -30,
        bordercolor: '#c7c7c7',
        borderwidth: 2,
        borderpad: 4,
        bgcolor: '#f2cc54',
        opacity: 0.8,
      },
      {
        x: receiverPositions.receiver2[0],
        y: receiverPositions.receiver2[1],
        xref: 'x',
        yref: 'y',
        text: 'Receiver 2',
        showarrow: true,
        font: {
          family: 'Courier New, monospace',
          size: 16,
          color: '#000000',
        },
        align: 'center',
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: 'black',
        ax: 20,
        ay: -30,
        bordercolor: '#c7c7c7',
        borderwidth: 2,
        borderpad: 4,
        bgcolor: '#f2cc54',
        opacity: 0.8,
      },
      {
        x: receiverPositions.receiver3[0],
        y: receiverPositions.receiver3[1],
        xref: 'x',
        yref: 'y',
        text: 'Receiver 3',
        showarrow: true,
        font: {
          family: 'Courier New, monospace',
          size: 16,
          color: '#000000',
        },
        align: 'center',
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: 'black',
        ax: 20,
        ay: -30,
        bordercolor: '#c7c7c7',
        borderwidth: 2,
        borderpad: 4,
        bgcolor: '#f2cc54',
        opacity: 0.8,
      },
    ],
  };

  var temp = {};
  trace.forEach((singlePatient) => {
    if (singlePatient.mode == 'markers+text') {
      temp = {
        x: singlePatient.xy[0],
        y: singlePatient.xy[1],
        xref: 'x',
        yref: 'y',
        text: singlePatient.text[0],
        showarrow: true,
        arrowhead: 7,
        ax: 0,
        ay: -40,
      };

      layout.annotations.push(temp);
    }
  });

  var config = {
    // displayModeBar: false,
  };

  // NOTE: Using trace instead of data object
  Plotly.newPlot('myDiv', trace, layout, config);
}

function gettingPatientName(macAdd) {
  for (var key in patientNameWithBandMac) {
    if (key == macAdd.slice(0, -1)) return patientNameWithBandMac[key];
  }
}

export { ploating };
