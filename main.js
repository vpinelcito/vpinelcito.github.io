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
 */


const menu = {FR:'<div id="haut"></div><header><nav><div class="changement_langue"><span id="FR">FR</span>|<span id="EN">EN</span></div><label for="menu" id="deploye"></label><input type="checkbox" id="menu" role="button"><ul class="list_menu"><li><label><a href="../pages/index.html">Accueil</a></label></li><li class="deroulant"><label for="propos"><a>À&nbsp;propos&nbsp;</a></label><input type="checkbox" id="propos" role="button"><ul class="sous"><li><a href="../pages/a_propos.html">Présentation</a></li><li><a href="../pages/competences.html">Compétences</a></li><li><a href="../pages/centres_interieur.html">Centre d\'intêret</a></li></ul></li><li><label><a href="../pages/projets.html">Réalisations</a></label></li><li class="deroulant"><label for="experiences"><a>Expériences&nbsp;</a></label><input type="checkbox" id="experiences" role="button"><ul class="sous"><li><a href="../pages/experiences.html#professionelles">Professionelle</a></li><li><a href="../pages/experiences.html#associatives">Associative</a></li></ul></li></ul></nav><script>const deploye = document.getElementById("deploye");deploye.addEventListener("click", () => {deploye.classList.toggle("fermeture");});document.getElementById("FR").addEventListener("click", () => {document.cookie ="langue=FR; path=/; domain=vpinelcito.github.io; max-age=604800000; samesite=strict; secure";window.location.reload();});document.getElementById("EN").addEventListener("click", () => {document.cookie ="langue=EN; path=/; domain=vpinelcito.github.io; max-age=604800000; samesite=strict; secure";window.location.reload();});</script></header>',
    EN:'<div id="haut"></div><header><nav><div class="changement_langue"><span id="FR">FR</span>|<span id="EN">EN</span></div><label for="menu" id="deploye"></label><input type="checkbox" id="menu" role="button"><ul class="list_menu"><li><label><a href="../pages/index.html">Homepage</a></label></li><li class="deroulant"><label for="propos"><a>By&nbsp;the&nbsp;way&nbsp;</a></label><input type="checkbox" id="propos" role="button"><ul class="sous"><li><a href="../pages/a_propos.html">Presentation</a></li><li><a href="../pages/competences.html">Skills</a></li><li><a href="../pages/centres_interieur.html">Interest</a></li></ul></li><li><label><a href="../pages/projets.html">Realisations</a></label></li><li class="deroulant"><label for="experiences"><a>Experiences&nbsp;</a></label><input type="checkbox" id="experiences" role="button"><ul class="sous"><li><a href="../pages/experiences.html#professionelles">Professional</a></li><li><a href="../pages/experiences.html#associatives">Associative</a></li></ul></li></ul></nav><script>const deploye = document.getElementById("deploye");deploye.addEventListener("click", () => {deploye.classList.toggle("fermeture");});document.getElementById("FR").addEventListener("click", () => {document.cookie ="langue=FR; path=/; domain=vpinelcito.github.io; max-age=604800000; samesite=strict; secure";window.location.reload();});document.getElementById("EN").addEventListener("click", () => {document.cookie ="langue=EN; path=/; domain=vpinelcito.github.io; max-age=604800000; samesite=strict; secure";window.location.reload();});</script></header>'};
const pied_page= {FR:'<footer class="contact"><a class="remonte" href="#haut">▲</a><div class="mail">vincent.pinel-citolleux@universite-paris-saclay.fr</div><div class="linkedin"><a href="https://www.linkedin.com/in/vincent-pinel-citolleux-b712693a1/">LinkedIn</a></div><div class="infos">Ce site web a été créé par Vincent PINEL-CITOLLEUX lors d\'un travail sur le portfolio, dans le cadre du cours de Doria Dacien. Travail réalisé en 2026, en première année de BUT Génie Mécanique et Productique.<br>Pour des soucis de confidentialité, certaines informations sont imprécises. Pour plus de renseignements, merci de me contacter sur mon adresse e-mail. Vincent PINEL-CITOLLEUX, toute reproduction interdite.</div><img src="../images/logo_iut.png" class="logo_IUT" alt="Logo de l\'IUT de Cachan et de l\'université Paris Saclay"></img></footer>',
    EN:''};//<div class="information">Cliquez sur la flèche pour remontée en haut du document</div>
let langue = "EN";
const nom = "langue"

function code_commun() {
    const section = document.querySelector("section")
    section.insertAdjacentHTML("beforebegin", menu[langue]);
    section.insertAdjacentHTML("afterend",pied_page[langue]);
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

/*async function charger_langue() {
    try {
        const reponse = await fetch("../contenu/"+document.location.pathname.match(/\/Documents\/site_web\/cv\/pages\/(.+)\.html/)[1]+".json");
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);
        }
        const recu = await reponse.json();
        const contenu = JSON.parse(recu[langue]);
        const elements = Object.keys(contenu);
        elements.forEach(element => {
            document.getElementById(entete).textContent = contenu[element];
        });
    } catch (erreur) {
        console.error("Impossible de charger le fichier JSON :", erreur);
    }
}*/

initialisation_cookie();
document.addEventListener("DOMContentLoaded",code_commun)
