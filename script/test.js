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

document.addEventListener("DOMContentLoaded",charger_menus);
