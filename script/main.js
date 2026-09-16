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

//ajouter date et tags
indication_date = {fr:"Publié le ",en:"Published on "}
async function info_article() {
    if(recu == "") await charger_langue();
    await charger_articles();
    liste_articles = [];
    for (let i = 0; i < donnes["articles"].length; i++) {
        liste_articles[i] = {[donnes["articles"][i][langue]["titre"]]: [donnes["articles"][i]["date"],donnes["articles"][i][langue]["tags"]]};//crochet [] pr mettre clé de l'objet
    };
    liste_articles=trier_articles(liste_articles);

    const titre_recherche = recu[langue]["titre"]; 
    const article_trouve = liste_articles.find(article => Object.keys(article)[0] === titre_recherche);
    if (!article_trouve) {
        console.error("Article introuvable dans la liste :", titre_recherche);
        return;
    }
    const infos = Object.values(article_trouve)[0]; 
    let element_afficher = "<p class='date'>"+indication_date[langue]+infos[0];
    infos[1].forEach(tag => {
        element_afficher += `&nbsp;<span class='tag'>${tag}</span>`;
    });
    document.getElementById("infos").innerHTML = element_afficher + "</p>";
}

//Faire liste article
async function insertion_articles() {
    if(recu == "") await charger_langue();
    await charger_articles();
    let table_articles = []
    donnes["articles"].forEach(d => {
        table_articles.push([d["date"],d[langue]["titre"],d[langue]["description"],d["img"],d[langue]["tags"],d["link"]]);
    });
    table_articles=table_articles.sort((a, b) => {
        const convertirEnDate = (chaineDate) => {
            const [jour, mois, annee] = chaineDate.split('/');
            return new Date(annee, mois - 1, jour);
        };
        const dateA = a[0]; 
        const dateB = b[0];
        return convertirEnDate(dateB) - convertirEnDate(dateA);
    });
    let contenu_tableau=""
    for (let i = 0; i < table_articles.length; i++) {
        const element_article = table_articles[i]
        if (i%3==0) {
            contenu_tableau += "<tr><td class='article'>";
        } else {
            contenu_tableau += "<td class='article'>";
        }
        contenu_tableau += `<div><img src="${element_article[3]}" /></div><div class="texte_article"><h3>${element_article[1]}</h3><p>`;
        element_article[4].forEach(tag => {
            contenu_tableau += `<span class='tag'>${tag}</span>&nbsp;`;
        });
        contenu_tableau += `<br>${element_article[2]}<br><a class="suivi" href="${element_article[5]}">Voir&nbsp;</a></p></div></td>`
        if (i%3==2) {
            contenu_tableau += "</tr>";
        }
    }
    document.getElementById("affichage_article").innerHTML = contenu_tableau;
}

initialisation_cookie();
document.addEventListener("DOMContentLoaded",charger_menus)
