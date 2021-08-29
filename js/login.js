  $("#loginForm").submit(function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      const email = formData.get("loginEmail");
      const userRef = firebase.database().ref("Users");
      Swal.fire({
          text: "Please Wait....",
          allowOutsideClick: false,
          showConfirmButton: false,

          willOpen: () => {
              Swal.showLoading();
          },
      });
      userRef.orderByChild('email').equalTo(email).once("value", function (snapshot) {
          if (snapshot.exists()) {
              Swal.close();
              snapshot.forEach(function (account) {
                  const password = account.val().password;
                  firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
                      Swal.fire({
                          icon: "info",
                          title: "Take the Surve",
                          text: "Please dont forget to take the Survery after you visit the site."
                      }).then(result => {
                          if (result.value) {
                              window.location.href = "mainhall.html"
                          }
                      })
                  }).catch(function (error) {
                      // Handle Errors here.
                      var errorCode = error.code;
                      var errorMessage = error.message;
                      Swal.fire({
                          icon: 'error',
                          title: errorCode,
                          text: errorMessage,

                      })

                  });
              });
          } else {
              Swal.close();
              Swal.fire({
                  icon: 'error',
                  title: 'Email not found. Please register First!',
                  confirmButtonColor: "#0f7ec3",
                  allowOutsideClick: true
              }).then(result => {
                  if (result.value) {
                      location.reload();
                  }

              });
          }
      }).catch(err => {
          Swal.fire({
              icon: 'error',
              title: "Error found!",
              text: err.message,
              allowOutsideClick: true
          })
      })
  });