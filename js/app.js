const boton = document.getElementById("btnEntrar");

boton.addEventListener("click", () => {

    document.querySelector(".cards").scrollIntoView({
        behavior: "smooth"
    });

});

document
.getElementById("modoBtn")
.addEventListener("click", () => {

    document.body.classList.toggle("neon");

});