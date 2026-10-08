//Acces à la base de donnes
const db = new Dexie("QCM_Menu_Database");
db.version(3).stores({
    configuration: 'cle',
    stats_en_attente: '++id',
    cartes_difficiles: 'carte_id',
    session_en_cours: 'cle'
});

const body = document.querySelector("body");
let q = []; //paquet de questions
let statsSession = {};//Collecte donnés pour analyse
let cartesDifficilesSession = [];//collecte cartes difficiles
let sessionTerminee = false;
let nb_depart=0;
const API_URL = "https://script.google.com/macros/s/AKfycbyjEKyrWst5D_Cu_qyYLm0LE_orhk7Ng0S9-_rz6bI4vwJ2vftxFWS2-5IbnW6SWUjh/exec";

function initialiserEcouteurClic() {
    body.addEventListener("click", async (evenement) => {
        if (q.length === 0 || sessionTerminee) return; // Sécurité si QCM fini
        
        const targetId = evenement.target.id;
        const question = q[0]; // question en cours
        const zoneReponse = document.getElementById("choix_reponse");
        
        if (targetId === "quit") {
            finaliserEtSauvegarderSession();
            return;
        }
        
        if (zoneReponse.style.visibility === "hidden" || zoneReponse.style.visibility === "") {
            affichage(question, false);
            zoneReponse.style.visibility = "visible";
            return;
        }
        
        // Notation
        if (["parfait", "bon", "moyen", "mauvais"].includes(targetId)) {
            statsSession[targetId]++; // ajout score
            q.shift();
            
            // traitement question
            if (targetId === "bon") {
                q.push(question); // a la fin
            } else if (targetId === "moyen") {
                let pos = Math.min(q.length, 8); // plus tard
                q.splice(pos, 0, question);
            } else if (targetId === "mauvais") {
                let pos = Math.min(q.length, 3); // -plus tard
                if (!question.erreursSession) {
                    question.erreursSession = 0;
                }
                question.erreursSession++;
                if (question.erreursSession >= 2) {
                    if (!cartesDifficilesSession.some(c => c.question === question.question)) {
                        cartesDifficilesSession.push(question);
                    }
                    enregistrerCarteDifficile(question);
                }
                q.splice(pos, 0, question);
            }
            
            // Sauvegarde automatique de l'état restant
            try {
                await db.session_en_cours.put({
                    cle: "partie_sauvee",
                    questions_restantes: q,
                    stats: statsSession,
                    nb_depart: nb_depart
                });
            } catch (erreur) {
                console.error("Erreur lors de la sauvegarde automatique :", erreur);
            }
            suivante();
        }
    });
}

async function demarrer_page_qcm() {
    initialiserEcouteurClic();
    const parametres = new URLSearchParams(window.location.search);//récupèrer qcm ds l'url
    let qcms = parametres.get('q');
    if (!qcms) {
        console.error("Aucun QCM sélectionné");
        return;
    }
    const cacheLocal = await db.configuration.get("donnes");
    if (cacheLocal) {
        qcms = qcms.split("|");
        let questions = [];
        qcms.forEach(qcm => {
            let id = qcm.replace(/_/g, " ");
            if (cacheLocal.donnees[id]) {
                questions = questions.concat(cacheLocal.donnees[id]);
            }
        });
        if (questions.length > 0) {
            const partieSauvegardee = await db.session_en_cours.get("partie_sauvee");
            if (partieSauvegardee && partieSauvegardee.questions_restantes.length > 0) {
                q = partieSauvegardee.questions_restantes;
                statsSession = partieSauvegardee.stats;
                nb_depart = partieSauvegardee.nb_depart;
                partie(q, true);
                return;
            }
            partie(questions, false); 
        }
    } else {
        console.error("Impossible de trouver les questions de ce QCM en local.");
    }
}

// Mélange les questions sans détruire le tableau d'origine
function prepa(questions) {
    let copie = [...questions];
    let melange = [];
    while (copie.length > 0) {
        let nb = Math.floor(Math.random() * copie.length);
        melange.push(copie[nb]);
        copie.splice(nb, 1);
    }
    return melange;
}

// Déroulement de la partie (Logique événementielle)
function partie(questions, estUneRestauration = false) {
    sessionTerminee = false;
    if (!estUneRestauration) {
        q = prepa(questions);
        nb_depart = questions.length;
        const joueur = localStorage.getItem("qcm_username") || "";
        statsSession = {utilisateur: joueur, debut: Date.now(), total: q.length, parfait: 0, bon: 0, moyen: 0, mauvais: 0};
    }
    cartesDifficilesSession = [];
    document.getElementById("avance").textContent = `${statsSession.parfait} réponses parfaites sur ${nb_depart}`;
    suivante();
}


function suivante() {
    if (q.length > 0 && !sessionTerminee) {
        document.getElementById("avance").textContent = `${statsSession.parfait} réponses parfaites sur ${nb_depart}`;
        document.getElementById("choix_reponse").style.visibility = "hidden";
        affichage(q[0], true);
    } else if (!sessionTerminee) {
        finaliserEtSauvegarderSession();
    }
}
function affichage(donnes, question) {
    const boites = Object.keys(donnes);
    const mot = question ? "question" : "reponse";
    boites.forEach(conteneur => {
        const boite = document.getElementById(conteneur);
        if (!boite) return;
        if (conteneur.includes(mot) || conteneur == "categorie") {
            boite.innerHTML = ""; // Reset
            boite.style.visibility = "visible";
            const contenu = donnes[conteneur];
            if (contenu !== "") {
                if (!conteneur.startsWith("image")) {
                    boite.innerHTML = contenu;
                } else {
                    let img = document.createElement("img");
                    img.src = contenu;
                    boite.appendChild(img);
                }
            }
        } else {
            if (conteneur !== "quit" && conteneur !== "avance" && conteneur !== "choix_reponse") {
                boite.style.visibility = "hidden";
            }
        }
    });
}

//gestion cartes difficiles
async function enregistrerCarteDifficile(question) {
    // Utilisation des propriétés exactes "categorie" et "id" envoyées par votre Apps Script
    const uniqueId = question.categorie + "_" + question.id; 
    try {
        const carteExistante = await db.cartes_difficiles.get(uniqueId);
        if (carteExistante) {
            await db.cartes_difficiles.put({
                carte_id: uniqueId,
                total_alertes: carteExistante.total_alertes + 1,
                derniere_Erreur: new Date().toISOString(),
                donnees_carte: question
            });
        } else {
            await db.cartes_difficiles.add({
                carte_id: uniqueId,
                total_alertes: 1,
                derniere_Erreur: new Date().toISOString(),
                donnees_carte: question
            });
        }
    } catch (erreur) {
        console.error("Erreur lors de l'enregistrement du point faible :", erreur);
    }
}

async function sauvegarderStatsLocales(stats, listeCartesDifficiles) {
    const parametres = new URLSearchParams(window.location.search);
    const qcmId = parametres.get('q') || "Inconnu";

    stats.date = new Date().toISOString();
    stats.qcm_id = qcmId.replace(/_/g, " ");
    stats.questions_difficiles = listeCartesDifficiles.map(c => c.question).join(" | ");

    try {
        await db.stats_en_attente.add(stats);
        synchroniserStats();
    } catch (erreur) {
        console.error("Erreur de sauvegarde locale des stats :", erreur);
    }
}

async function synchroniserStats() {
    if (!navigator.onLine) return; 
    const fileAttente = await db.stats_en_attente.toArray();
    if (fileAttente.length === 0) return;

    for (let session of fileAttente) {
        try {
            const reponse = await fetch(API_URL, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(session)
            });
            const resultat = await reponse.json();
            console.log("Réponse Apps Script :", resultat);
            if (reponse.ok && resultat.statut === "success") {
                await db.stats_en_attente.delete(session.id);
            }
        } catch (erreur) {
            console.error("Échec de la synchronisation réseau :", erreur);
            break;
        }
    }
}

async function finaliserEtSauvegarderSession() {
    if (sessionTerminee) return;
    sessionTerminee = true;
    statsSession.duree = Math.floor((Date.now() - statsSession.debut) / 1000);
    delete statsSession.debut;
    let totalReponses = statsSession["parfait"] + statsSession["bon"] + statsSession["moyen"] + statsSession["mauvais"];
    let score = totalReponses > 0 ? (statsSession["parfait"] * 3 + statsSession["bon"] * 2 + statsSession["moyen"]) / (totalReponses * 3) : 0;
    document.getElementById("choix_reponse").style.visibility = "hidden";
    document.getElementById("conteneur").innerHTML = `
        <strong>Session terminée !</strong><br>
        Ta session a duré : ${statsSession.duree}s<br>
        Questions répondues : ${totalReponses} / ${statsSession.total}<br>
        Ton score de réussite est de : ${(score * 100).toFixed(1)}%<br><br>
        - Réponses parfaites : ${statsSession["parfait"]}<br>
        - Réponses correctes : ${statsSession["bon"]}<br>
        - Réponses fébriles : ${statsSession["moyen"]}<br>
        - Mauvaises réponses : ${statsSession["mauvais"]}<br><br>
        <button id="btn-retour-menu" style="padding:10px 20px; font-size:1em; background-color:#333; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">Accueil</button>
    `;
    document.getElementById("btn-retour-menu").addEventListener("click", () => {
        window.location.href = "./index.html";
    });
    sauvegarderStatsLocales(statsSession, cartesDifficilesSession);
    try {
        await db.session_en_cours.delete("partie_sauvee");
        console.log("Sauvegarde locale de session purgée avec succès.");
    } catch (erreur) {
        console.error("Erreur lors du nettoyage de la session de Dexie :", erreur);
    }
}

// Déclencheur réseau automatique
window.addEventListener('online', synchroniserStats);
document.addEventListener("DOMContentLoaded", demarrer_page_qcm);