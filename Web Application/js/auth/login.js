(function () {
  var email = document.getElementById('email');
  var password = document.getElementById('pwd');
  var submitButton = document.getElementById('submitBtn');

  firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      document.getElementById('loginBtn').setAttribute('onclick', 'logout()');
      document.getElementById(
        'loginBtn'
      ).innerHTML = `<a class="nav-link">Logout</a>`;
    }
  });

  submitButton.addEventListener('click', function (e) {
    e.preventDefault();
    console.log(email, password);
    showSpinner();
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then((userCredential) => {
        var user = userCredential.user;
        console.log(user);
        location.href = './html/categories.html';
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert('Invalid Email or Password');
        console.log(errorCode, errorMessage, error);
        hideSpinner();
      });
  });
})();

function showSpinner() {
  document.getElementById('loader').style.display = 'flex';
}

function hideSpinner() {
  document.getElementById('loader').style.display = 'none';
}

function logout() {
  showSpinner();
  firebase
    .auth()
    .signOut()
    .then(() => {
      location.href = '../index.html';
    })
    .catch((error) => {
      console.log(error);
      alert('Something Went Wrong');
    });
  hideSpinner();
}
