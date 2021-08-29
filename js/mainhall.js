$(() => {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            // User logged in already or has just logged in.
            window.location.href = "index.html";
        } else {

            $("#myModal-info").modal('show');
        }
    });
});