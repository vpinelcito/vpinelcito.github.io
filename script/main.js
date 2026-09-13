/**
 * Haut
<div id="haut"></div>
<header>
    <nav>
        <div class="changement_langue">
            <span id="FR">FR</span>|<span id="EN">EN</span>
        </div>
        <label for="menu" id="deploye"></label>
        <input type="checkbox" id="menu" role="button">
        <ul class="list_menu">
            <li><label><a href="../pages/index.html">Accueil</a></label></li>
            <li class="deroulant">
                <label for="propos"><a>À&nbsp;propos&nbsp;</a></label>
                <input type="checkbox" id="propos" role="button">
                <ul class="sous">
                    <li><a href="../pages/a_propos.html">Présentation</a></li>
                    <li><a href="../pages/competences.html">Compétences</a></li>
                    <li><a href="../pages/centres_interieur.html">Centre d'intêret</a></li>
                </ul>
            </li>
            <li><label><a href="../pages/projets.html">Projets</a></label></li>
            <li class="deroulant">
                <label for="experiences"><a>Expériences&nbsp;</a></label>
                <input type="checkbox" id="experiences" role="button">
                <ul class="sous">
                    <li><a href="../pages/experiences.html#professionelles">Professionelle</a></li>
                    <li><a href="../pages/experiences.html#associatives">Associative</a></li>
                </ul>
            </li>
        </ul>
    </nav>
    <script>
        const deploye = document.getElementById("deploye");
        deploye.addEventListener("click", () => {
            deploye.classList.toggle("fermeture");
        });
        document.getElementById("FR").addEventListener("click", () => {
            document.cookie ="langue=FR; path=/; max-age=604800000; samesite=strict; secure" //domain=vpinelcito.github.io
            window.location.reload();
        });
        document.getElementById("EN").addEventListener("click", () => {
            document.cookie ="langue=EN; path=/; max-age=604800000; samesite=strict; secure" //domain=vpinelcito.github.io
            window.location.reload();
        });
    </script>
</header>

<div id="haut"></div><header><nav><div class="changement_langue"><span id="FR">FR</span>|<span id="EN">EN</span></div><label for="menu" id="deploye"></label><input type="checkbox" id="menu" role="button"><ul class="list_menu"><li><label><a href="../pages/index.html">Accueil</a></label></li><li class="deroulant"><label for="propos"><a>À&nbsp;propos&nbsp;</a></label><input type="checkbox" id="propos" role="button"><ul class="sous"><li><a href="../pages/a_propos.html">Présentation</a></li><li><a href="../pages/competences.html">Compétences</a></li><li><a href="../pages/centres_interieur.html">Centre d'intêret</a></li></ul></li><li><label><a href="../pages/projets.html">Projets</a></label></li><li class="deroulant"><label for="experiences"><a>Expériences&nbsp;</a></label><input type="checkbox" id="experiences" role="button"><ul class="sous"><li><a href="../pages/experiences.html#professionelles">Professionelle</a></li><li><a href="../pages/experiences.html#associatives">Associative</a></li></ul></li></ul></nav><script>const deploye = document.getElementById("deploye");deploye.addEventListener("click", () => {deploye.classList.toggle("fermeture");});document.getElementById("FR").addEventListener("click", () => {document.cookie ="langue=FR; path=/; domain=vpinelcito.github.io; max-age=604800000; samesite=strict; secure";window.location.reload();});document.getElementById("EN").addEventListener("click", () => {document.cookie ="langue=EN; path=/; domain=vpinelcito.github.io; max-age=604800000; samesite=strict; secure";window.location.reload();});</script></header>

<script>const deploye = document.getElementById("deploye");deploye.addEventListener("click", () => {deploye.classList.toggle("fermeture");});document.getElementById("FR").addEventListener("click", () => {document.cookie ="langue=FR; path=/; domain=vpinelcito.github.io; max-age=604800000; samesite=strict; secure";window.location.reload();});document.getElementById("EN").addEventListener("click", () => {document.cookie ="langue=EN; path=/; domain=vpinelcito.github.io; max-age=604800000; samesite=strict; secure";window.location.reload();});</script>
*/

let langue = "en";
const nom = "langue"
let check = document.cookie.match(new RegExp("(?:^|; )" + nom.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));

async function charger_menus() {
    try {
        const reponse = await fetch("../contenu/menus.json");
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);
        }
        const menu = await reponse.json();
        const section = document.querySelector("section");
        section.insertAdjacentHTML("beforebegin", menu[langue]["en_tete"]);
        if (!check) section.insertAdjacentHTML("afterend",menu[langue]["cookie"]);
        section.insertAdjacentHTML("afterend",menu[langue]["pied_page"]);
    } catch (erreur) {
        console.error("Impossible de charger le fichier JSON :", erreur);
    }
}

function initialisation_cookie() {
    if (!check){
        document.cookie =nom+"="+langue+"; path=/; max-age=604800000; samesite=strict; secure" //domain=vpinelcito.github.io
    }else{
        langue = decodeURIComponent(check[1]);
    }
    console.log(check,document.cookie)
    charger_langue();
}

let recu ="";
async function charger_langue() {
    try {
        const reponsel = await fetch("../contenu/"+document.location.pathname.match(/\/pages\/(.+)\.html/)[1]+".json");
        if (!reponsel.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponsel.status}`);
        }
        recu = await reponsel.json();
        const elements = Object.keys(recu[langue]);
        elements.forEach(element => {
            const el = document.getElementById(element);
            if (el) el.innerHTML = recu[langue][element];
        });
    } catch (erreur) {
        console.error("Impossible de charger le fichier JSON :", erreur);
    }
}

//Elements articles
let liste_articles = [];
let donnes ="";
async function charger_articles() {
    try {
        const reponsea = await fetch("../contenu/projets_list.json");
        if (!reponsea.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponsea.status}`);
        }
        donnes = await reponsea.json();
        liste_articles = [];
        for (let i = 0; i < donnes["articles"].length; i++) {
            liste_articles[i] = {[donnes["articles"][i][langue]["titre"]]: [donnes["articles"][i][langue]["date"],donnes["articles"][i][langue]["tags"]]};//crochet [] pr mettre clé de l'objet
        };
        liste_articles=trier_articles(liste_articles);
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
        const dateB = Object.values(b)[0][0];
        const dateA = Object.values(a)[0][0];

        return convertirEnDate(dateB) - convertirEnDate(dateA);
    });
}

indication_date = {fr:"Publié le ",en:"Published on "}
async function info_article() {
    if(recu == "") await charger_langue();
    await charger_articles();

    const titreRecherche = recu[langue]["titre"]; 
    const articleTrouve = liste_articles.find(article => Object.keys(article)[0] === titreRecherche);
    if (!articleTrouve) {
        console.error("Article introuvable dans la liste :", titreRecherche);
        return;
    }
    const infos = Object.values(articleTrouve)[0]; 
    let element_afficher = "<p class='date'>"+indication_date[langue]+infos[0];
    infos[1].forEach(tag => {
        element_afficher += `&nbsp;<span class='tag'>${tag}</span>`;
    });
    document.getElementById("infos").innerHTML = element_afficher + "</p>";
}

initialisation_cookie();
document.addEventListener("DOMContentLoaded",charger_menus)
