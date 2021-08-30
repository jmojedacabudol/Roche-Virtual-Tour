$(() => {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            // User logged in already or has just logged in.
            window.location.href = "index.html";
        } else {

            const bgMusic = document.getElementById("bgMusic").play();
            console.log(bgMusic)
            if (bgMusic !== undefined) {
                bgMusic.then(_ => {
                    document.getElementById("bgMusic").play();
                }).catch(error => {
                    // Autoplay was prevented.
                    Swal.fire({
                        icon: "info",
                        title: "This page has a music. Do you want to play it?",
                        showCancelButton: true,
                    }).then(result => {
                        if (result.value) {
                            document.getElementById("bgMusic").play();
                        }
                    })
                });
            }
            $("#myModal-info").modal('show');
        }
    });
});


function createBgMusic() {

}