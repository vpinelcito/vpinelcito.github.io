const db = new Dexie("QCM_Menu_Database");
db.version(3).stores({
    configuration: 'cle',
    stats_en_attente: '++id',
    cartes_difficiles: 'carte_id',
    session_en_cours: 'cle'
});

const API_URL = "https://script.google.com/macros/s/AKfycbyjEKyrWst5D_Cu_qyYLm0LE_orhk7Ng0S9-_rz6bI4vwJ2vftxFWS2-5IbnW6SWUjh/exec";
let all;
let chargement = false;
async function charger_menu() {
    afficher_bouton_utilisateur();
    const cacheLocal = await db.configuration.get("donnes");
    if (cacheLocal) {
        all = cacheLocal.donnees;
        mettre_a_jour_statut("Données stockées sur l'appareil utilsées");
    } else {
        mettre_a_jour_statut("Attention : Aucune donnée locale trouvée. Connectez-vous à Internet et appuyez sur le bouton de mise à jour");
        return;
    }
    traiter_donnes(all);
}

async function charger_donnes() {
    let tentatives = 3;
    let delai = 1000;
    let reponse;
    mettre_a_jour_statut("Vérification de la connexion et synchronisation...");
    for (let i = 0; i < tentatives; i++) {
        try {
            reponse = await fetch(API_URL);
            if (!reponse.ok) throw new Error(`Statut HTTP : ${reponse.status}`);
            break; 
        } catch (erreur) {
            console.warn(`Tentative ${i + 1} échouée (${erreur.message})...`);
            if (i === tentatives - 1) throw erreur;
            await new Promise(resolve => setTimeout(resolve, delai));
            delai *= 1.5;
        }
    }
    try {
        let paquet = await reponse.json();
        const donneesPropres = JSON.parse(JSON.stringify(paquet));
        await db.transaction('rw', db.configuration, async () => {
            await db.configuration.put({ cle: "donnes", donnees: donneesPropres });
        });
        all = donneesPropres; 
        mettre_a_jour_statut("Données synchronisées pour le mode hors ligne !");
        chargement = false;
        traiter_donnes(donneesPropres);
    } catch (erreur) {
        console.error("Erreur critique de stockage Dexie :", erreur);
        mettre_a_jour_statut("Erreur lors du traitement des données.");
        chargement = false;
        const cacheLocal = await db.configuration.get("donnes");
        if (cacheLocal) {
            all = cacheLocal.donnees;
            traiter_donnes(all);
        }
    }
}

function traiter_donnes(donnes) {
    //Categorisation éléments
    qcms=Object.keys(donnes);
    parents={};//Structure chaque sous categorie selon un degree d'antériorité
    qcms.forEach(qcm => {
        const arborescence = qcm.split("/");//sépare les chemins
        let niveau=parents;
        if (arborescence.length>1){
            dernier=arborescence.pop()
            arborescence.forEach(deg => {
                if (!niveau[deg]) {//Element absent ? => on le crée
                    niveau[deg] = {};
                }
                niveau = niveau[deg]; // on s'enfonce
            });
            niveau[dernier]=dernier
        }else{
            niveau[arborescence[0]]=arborescence[0]
        }
    });
    //Création html
    const section = document.querySelector("section");
    section.innerHTML=""
    creation_choix(parents,section);
}

function creation_choix(objet, boite, path_actuel = "") {
    //ul
    const ul = document.createElement('ul');
    ul.classList.add('sous');
    const categories = Object.keys(objet).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
    categories.forEach(key => {
        const valeur = objet[key];
        //chemin ds arborescence
        const actuel = key.replace(/[\s\/_]/g, ' ');
        const path = path_actuel ? `${path_actuel}/${actuel}` : actuel;
        //li
        const li = document.createElement("li");
        const label = document.createElement("label");
        label.innerHTML = "&nbsp;"+key;
        const input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("role", "button");
        //si autres elements => crée sous listes
        if (typeof valeur === "object" && valeur !== null) {
            label.setAttribute("for", path+"_deroule");
            input.setAttribute("id", path+"_deroule");
            li.classList.add("deroulant");
            li.appendChild(label);
            li.appendChild(input);
            creation_choix(valeur, li, path);
        } else {//sinon on ajoute une case à cocher visible pour choix qcm
            label.setAttribute("for", path);
            input.setAttribute("id", path);
            input.setAttribute("class","choix");
            li.appendChild(label);
            li.appendChild(input);
        }
        ul.appendChild(li);
    });
    boite.appendChild(ul);
}

// affiche avancement
function mettre_a_jour_statut(message) {
    const infoZone = document.getElementById("statut-reseau");
    if (infoZone) infoZone.textContent = message;
}

function choix_qcm() {
    if (all===undefined) return
    const choisi = document.querySelectorAll("input.choix:checked");
    if (choisi==[]){
        console.log("Aucun élément sélectionné")
        return
    }
    //création lien
    let paquet=[];
    choisi.forEach(choix => {
        paquet.push(choix.getAttribute("id"));
    });
    window.location.href=`./qcm.html?q=${encodeURIComponent(paquet.join("|"))}`
}


//Lancement partie
const body = document.querySelector("body");
body.addEventListener("click", async (evenement) => {
    if (evenement.target && evenement.target.id === "session") {
        choix_qcm()
    }
    if(evenement.target && evenement.target.id==="charger_donnes"){
        if (!chargement){
            mettre_a_jour_statut("Vérification de la connexion et synchronisation...")
            chargement=true
            await charger_donnes();
        }
    }
});

function verifier_utilisateur() {
    let utilisateur = localStorage.getItem("qcm_username");
    // nom utilisateur
    if (!utilisateur || utilisateur.trim() === "") {
        let boitePseudo = document.getElementById("boite-pseudo");
        if (!boitePseudo) {
            boitePseudo = document.createElement("div");
            boitePseudo.id = "boite-pseudo";
            boitePseudo.innerHTML = `<div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; justify-content:center; align-items:center;"><div style="background:white; padding:30px; border-radius:10px; text-align:center; max-width:400px; width:85%;"><p>Choisis ton nom, comme ça nos stats ne se mélangent pas :</p><input type="text" id="input-pseudo" placeholder="nom" style="width:90%; padding:10px; margin-bottom:15px; font-size:1.1em; border:1px solid #ccc; border-radius:5px;"><br><button id="valider-pseudo" style="padding:10px 20px; font-size:1em; background-color:#4CAF50; color:white; border:none; border-radius:5px; cursor:pointer;">Valider</button></div></div>`;
            document.body.appendChild(boitePseudo);
        }
        document.getElementById("valider-pseudo").addEventListener("click", () => {
            const nomSaisi = document.getElementById("input-pseudo").value.trim();
            if (nomSaisi !== "") {
                localStorage.setItem("qcm_username", nomSaisi); // Enregistrer memoire
                boitePseudo.remove();
                charger_menu();
            } else {
                alert("Le nom ne peut pas être vide.");
            }
        });
    } else {
        charger_menu();
    }
}

//Changement de nom
function afficher_bouton_utilisateur() {
    let boutonUser = document.getElementById("btn-changement-nom");
    const nomActuel = localStorage.getItem("qcm_username") || "";
    if (!boutonUser) {
        boutonUser = document.createElement("button");
        boutonUser.id = "btn-changement-nom";
        boutonUser.style = "position: absolute; top: 10px; right: 10px; padding: 8px 15px; font-size: 0.9em; background-color: #333; color: white; border: none; border-radius: 20px; cursor: pointer; z-index: 100;";
        document.body.appendChild(boutonUser);
        boutonUser.addEventListener("click", () => {
            localStorage.removeItem("qcm_username");
            verifier_utilisateur();
        });
    }
    
    boutonUser.textContent = nomActuel;
}

document.addEventListener("DOMContentLoaded", verifier_utilisateur);
window.addEventListener('online', charger_menu);
window.addEventListener('offline', charger_menu);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[PWA] Service Worker enregistré avec succès ! Scope :', reg.scope))
            .catch(err => console.error('[PWA] Échec de l\'enregistrement du Service Worker :', err));
    });
}