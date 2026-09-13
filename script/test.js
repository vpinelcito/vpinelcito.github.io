let langue = "fr";
const nom = "langue"

async function charger_menus() {
    try {
        const reponse = await fetch("../contenu/menus.json");
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);
        }
        const donnes = await reponse.json();
        const section = document.querySelector("section")
        section.insertAdjacentHTML("beforebegin", donnes[langue]["en_tete"]);
        section.insertAdjacentHTML("afterend",donnes[langue]["pied_page"]);
    } catch (erreur) {
        console.error("Impossible de charger le fichier JSON :", erreur);
    }
}

function initialisation_cookie() {
    let check = document.cookie.match(new RegExp("(?:^|; )" + nom.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    if (!check){
        document.cookie =nom+"="+langue+"; path=/; max-age=604800000; samesite=strict; secure" //domain=vpinelcito.github.io
    }else{
        langue = decodeURIComponent(check[1]);
    }
    //charger_langue();
}

initialisation_cookie();
document.addEventListener("DOMContentLoaded",charger_menus);
