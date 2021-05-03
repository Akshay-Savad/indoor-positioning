(function () {
  var signOutButton = document.getElementById('logout');
  signOutButton.addEventListener('click', function () {
    firebase
      .auth()
      .signOut()
      .then(() => {
        location.href = '../index.html';
      })
      .catch((error) => {
        // An error happened.
      });
  });
})();
