var selectTag = document.getElementById('BandId');

const bandRef = firebase.database().ref('Band');

bandRef
  .orderByChild('allocated')
  .equalTo(false)
  .on('value', (snap) => {
    var avaliableBands = snap.val();
    selectTag.innerHTML = '';

    if (!avaliableBands) {
      var optionTag = document.createElement('option');
      optionTag.text = 'No Bands Avaliable';
      selectTag.add(optionTag);
      document.getElementById('Abutton').className += ' ' + 'noBand';
      return;
    }

    document.getElementById('Abutton').className = document
      .getElementById('Abutton')
      .className.replace('noBand', '');
    for (var key in avaliableBands) {
      var optionTag = document.createElement('option');
      optionTag.value = key;
      optionTag.text = key;
      selectTag.add(optionTag);
    }
  });
