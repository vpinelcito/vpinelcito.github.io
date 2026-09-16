let donnes = "";
const langue = "fr"

async function charger_articles() {
    try {
        const reponse = await fetch("../contenu/projets_list.json");
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);
        }
        donnes = await reponse.json();
    } catch (erreur) {
        console.error("Impossible de charger le fichier JSON :", erreur);
    }
}

function trier_articles(liste) {
    return liste.sort((a, b) => {
        const convertirEnDate = (chaineDate) => {
            const [jour, mois, annee] = chaineDate.split('/');
            return new Date(annee, mois - 1, jour);
        };
        return convertirEnDate(b[1]) - convertirEnDate(a[1]);
    });
}

function affichage() {
    let liste_articles = []
    for (let i = 0; i < donnes["articles"].length; i++) {
        liste_articles[i] = [donnes["articles"][i][langue]["titre"],donnes["articles"][i][langue]["date"]]
    };
    trier_articles(liste_articles);
}

affichage();