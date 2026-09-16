const body = document.querySelector("body");
body.addEventListener("click", (evenement) => {
    if (evenement.target && evenement.target.id === "FR") {
        document.cookie ="langue=fr; path=/; domain=vpinelcito.github.io; max-age=604800000; samesite=strict; secure" //domain=vpinelcito.github.io
        window.location.reload();
    } else if(evenement.target && evenement.target.id === "EN"){
        document.cookie ="langue=en; path=/; domain=vpinelcito.github.io; max-age=604800000; samesite=strict; secure" //domain=vpinelcito.github.io
        window.location.reload();
    }else if(evenement.target && evenement.target.id === "deploye"){
        document.getElementById(evenement.target.id).classList.toggle("fermeture");
    }else if(evenement.target && evenement.target.id === "cookie"){
        document.getElementById("cookie").style.display = "none";
    }else if(evenement.target && evenement.target.id === "site_iut"){
        document.location.href = "https://www.iut-cachan.universite-paris-saclay.fr/"
    }
});