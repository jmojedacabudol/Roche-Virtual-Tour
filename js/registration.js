  $("#contactForm").submit(function (event) {
      event.preventDefault();
      // login - error
      const formData = new FormData(this);

      const name = formData.get("completeName");
      const affiliation = formData.get("affiliation");
      const specialization = formData.get("specialization");
      const email = formData.get("email");
      //validation for all inputs

      if (inputsEmpty(name, affiliation, specialization, email)) {
          if (nameNotValid(name)) {
              if (checkAffiliation(affiliation)) {
                  if (checkSpecilization(specialization)) {
                      emailValidation(email).then((emailResult) => {
                          if (emailResult === "No User") {
                              //generatepassword using generatePassword Function
                              const password = generateUserPassword();
                              Swal.fire({
                                  text: "Please Wait....",
                                  allowOutsideClick: false,
                                  showConfirmButton: false,

                                  willOpen: () => {
                                      Swal.showLoading();
                                  },
                              });
                              firebase.auth().createUserWithEmailAndPassword(email, password).then(function (userCreds) {
                                  const userData = {
                                      "name": name,
                                      "affiliation": affiliation,
                                      "specialization": specialization,
                                      "email": email,
                                      "password": password
                                  };

                                  var userRef = firebase.database().ref(`Users/${userCreds.user.uid}`);
                                  userRef.set(userData, function (error) {
                                      if (error) {
                                          Swal.close();
                                          var errorCode = error.code;
                                          var errorMessage = error.message;
                                          Swal.fire({
                                              icon: 'error',
                                              title: errorCode,
                                              text: errorMessage
                                          })
                                      } else {
                                          Swal.close();
                                          Swal.fire({
                                              position: 'center',
                                              icon: 'success',
                                              title: 'Successfully Registered!',
                                              text: 'Please wait for the Admin verification and Email Verification through your Email.',
                                              showConfirmButton: true,
                                          }).then(function (result) {
                                              if (result.value) {
                                                  window.location.href = "index.html"
                                              }
                                          })
                                      }
                                  });

                              }).catch(err => {
                                  console.log(err.message)
                              });
                          } else {
                              $("#registration-error").html('<div class="alert alert-danger" role="alert"> Email is already taken.</div>');
                          }
                      }).catch(err => {
                          $("#registration-error").html(`<div class="alert alert-danger" role="alert">${err}</div>`);
                      });
                  }
              }
          }
      }
      return false;
  });

  function inputsEmpty(name, affiliation, specialization, email) {
      if (name !== "" || affiliation !== "" || specialization !== "" || email !== "") {
          return true;
      } else {
          $("#registration-error").html('<div class="alert alert-danger" role="alert">Fillup Fields</div>');
          return false;
      }
  }


  function nameNotValid(completeName) {

      //Name should only consists of alphabets
      var letters = /^[A-Za-z ]+$/;
      if (completeName.match(letters)) {
          return true;
      } else {
          $("#registration-error").html('<div class="alert alert-danger" role="alert">Invalid Complete Name</div>');
          return false;
      }
  }

  function checkAffiliation(affiliation) {

      //Name should only consists of alphabets
      var letters = /^[A-Za-z ]+$/;
      if (affiliation.match(letters)) {
          return true;
      } else {
          $("#registration-error").html('<div class="alert alert-danger" role="alert">Invalid Affiliation</div>');
          return false;
      }

  }

  function checkSpecilization(specialization) {
      //Name should only consists of alphabets
      var letters = /^[A-Za-z ]+$/;
      if (specialization.match(letters)) {
          return true;
      } else {
          $("#registration-error").html('<div class="alert alert-danger" role="alert">Invalid Specialization!</div>');
          return false;
      }
  }


  //EMAIL VALIDATION
  function emailValidation(email) {
      return new Promise((resolve, reject) => {
          //email format validation values
          var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          var userRef = firebase.database().ref("Users");
          var resultEmail;
          if (email.match(regex)) {
              userRef.orderByChild('email').equalTo(email).once("value", function (snapshot) {
                  if (snapshot.exists()) {
                      resolve("Email is already taken.")
                  } else {
                      resolve("No User");
                  }
              })
          } else {
              reject('Email address should in "@ + any valid emails like gmail or yahoo."');
          }
      });
  }




  function generateUserPassword() {
      var length = 16,
          charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
          retVal = "";

      for (var i = 0, n = charset.length; i < length; ++i) {
          retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
  }