(function () {
  firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (!firebaseUser) {
      location.href = '../index.html';
    }
  });
})();
