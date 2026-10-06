const db = new Dexie("QCM_Menu_Database");
db.version(2).stores({
    configuration: 'cle',
    stats_en_attente: '++id',
    cartes_difficiles: 'carte_id'
});

const API_URL = "https://script.google.com/macros/s/AKfycbyjEKyrWst5D_Cu_qyYLm0LE_orhk7Ng0S9-_rz6bI4vwJ2vftxFWS2-5IbnW6SWUjh/exec";
let all;
async function charger_menu() {
    try {
        afficher_bouton_utilisateur();

        // SI EN LIGNE : On télécharge les données fraîches depuis Google
        if (navigator.onLine) {
            const reponse = await fetch(API_URL);
            if (!reponse.ok) throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);
            
            all = await reponse.json();
            
            // CORRECTION : On stocke directement le JSON complet (avec le Base64 des images) dans IndexedDB
            await db.configuration.put({ cle: "donnes", donnees: all });
            mettre_a_jour_statut("Menu et images synchronisés pour le mode hors ligne !");
            
        } else { // SI HORS LIGNE : On pioche dans le stockage interne du smartphone
            const cacheLocal = await db.configuration.get("donnes");
            if (cacheLocal) {
                all = cacheLocal.donnees;
                mettre_a_jour_statut("Mode hors ligne actif.");
            } else {
                mettre_a_jour_statut("Attention : Aucune donnée locale trouvée. Connectez-vous à Internet.");
                return;
            }
        }
        traiter_donnes(all);
    } catch (erreur) {
        console.error("Erreur de chargement :", erreur);
        mettre_a_jour_statut("Erreur lors du chargement.");
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
    for (const key in objet) {
        if (!Object.hasOwn(objet, key)) continue;
        const valeur = objet[key];
        //chemin ds arborescence
        const actuel = key.replace(/[\s\/_]/g, ' ');
        const path = path_actuel ? `${path_actuel}/${actuel}` : actuel;
        //li
        const li = document.createElement("li");
        const label = document.createElement("label");
        label.textContent = key;
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
    }
    boite.appendChild(ul);
}

// Outil optionnel pour afficher un message à l'utilisateur sur l'écran
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
body.addEventListener("click", (evenement) => {
    if (evenement.target && evenement.target.id === "session") {
        choix_qcm()
    }
});

function verifier_utilisateur() {
    let utilisateur = localStorage.getItem("qcm_username");
    
    // Si l'utilisateur n'est pas enregistré, on affiche le formulaire d'identification
    if (!utilisateur || utilisateur.trim() === "") {
        // Crée dynamiquement une fenêtre pop-up si elle n'existe pas dans le HTML
        let boitePseudo = document.getElementById("boite-pseudo");
        if (!boitePseudo) {
            boitePseudo = document.createElement("div");
            boitePseudo.id = "boite-pseudo";
            boitePseudo.innerHTML = `
                <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; justify-content:center; align-items:center;">
                    <div style="background:white; padding:30px; border-radius:10px; text-align:center; max-width:400px; width:85%;">
                        <p>Choisis ton nom, comme ça nos stats ne se mélangent pas :</p>
                        <input type="text" id="input-pseudo" placeholder="nom" style="width:90%; padding:10px; margin-bottom:15px; font-size:1.1em; border:1px solid #ccc; border-radius:5px;">
                        <br>
                        <button id="valider-pseudo" style="padding:10px 20px; font-size:1em; background-color:#4CAF50; color:white; border:none; border-radius:5px; cursor:pointer;">Valider</button>
                    </div>
                </div>
            `;
            document.body.appendChild(boitePseudo);
        }

        // Écouteur sur le bouton de validation
        document.getElementById("valider-pseudo").addEventListener("click", () => {
            const nomSaisi = document.getElementById("input-pseudo").value.trim();
            if (nomSaisi !== "") {
                localStorage.setItem("qcm_username", nomSaisi); // Sauvegarde permanente sur le mobile
                boitePseudo.remove(); // Supprime l'écran de blocage
                charger_menu(); // Lance l'affichage classique
            } else {
                alert("Le nom ne peut pas être vide.");
            }
        });
    } else {
        // Si le nom existe déjà, on lance directement le menu
        charger_menu();
    }
}

function afficher_bouton_utilisateur() {
    let boutonUser = document.getElementById("btn-changement-nom");
    const nomActuel = localStorage.getItem("qcm_username") || "";
    
    if (!boutonUser) {
        boutonUser = document.createElement("button");
        boutonUser.id = "btn-changement-nom";
        boutonUser.style = "position: absolute; top: 10px; right: 10px; padding: 8px 15px; font-size: 0.9em; background-color: #333; color: white; border: none; border-radius: 20px; cursor: pointer; z-index: 100;";
        document.body.appendChild(boutonUser);
        boutonUser.addEventListener("click", () => {
            localStorage.removeItem("qcm_username"); // Supprime temporairement le profil local
            verifier_utilisateur(); // Relance la boîte pop-up de dialogue
        });
    }
    
    boutonUser.textContent = nomActuel;
}

document.addEventListener("DOMContentLoaded", verifier_utilisateur);
// Écouter les changements de connexion en direct pour réagir immédiatement
window.addEventListener('online', charger_menu);
window.addEventListener('offline', charger_menu);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[PWA] Service Worker enregistré avec succès ! Scope :', reg.scope))
            .catch(err => console.error('[PWA] Échec de l\'enregistrement du Service Worker :', err));
    });
}