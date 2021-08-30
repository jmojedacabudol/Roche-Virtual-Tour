$(() => {
    $("#myModal-intro").modal('show');

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
})