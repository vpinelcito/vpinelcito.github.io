const menu = {fr:'<div id="haut"></div><header><nav><div class="changement_langue"><span id="FR">FR</span>|<span id="EN">EN</span></div><label for="menu" id="deploye"></label><input type="checkbox" id="menu" role="button"><ul class="list_menu"><li><label><a href="../pages/index.html">Accueil</a></label></li><li class="deroulant"><label for="propos"><a>À&nbsp;propos&nbsp;</a></label><input type="checkbox" id="propos" role="button"><ul class="sous"><li><a href="../pages/a_propos.html">Présentation</a></li><li><a href="../pages/competences.html">Compétences</a></li><li><a href="../pages/centres_interieur.html">Centre d\'intêret</a></li></ul></li><li><label><a href="../pages/projets.html">Réalisations</a></label></li><li class="deroulant"><label for="experiences"><a>Experiences&nbsp;</a></label><input type="checkbox" id="experiences" role="button"><ul class="sous"><li><a href="../pages/experiences.html#professionelles">Professionelle</a></li><li><a href="../pages/experiences.html#associatives">Associative</a></li></ul></li></ul></nav></header>'};
const pied_page = {fr:'<foorter class="contact"><a class="remonte" href="#haut"></a><div class="mail">vincent.pinel-citolleux@universite-paris-saclay.fr</div><div class="linkedin"><a href="https://www.linkedin.com/in/vincent-pinel-citolleux-b712693a1/">LinkedIn</a></div><div class="infos">Ce site web a été créé par Vincent PINEL-CITOLLEUX</footer>'};
let langue = "fr";
const nom = "langue"

function code_commun() {
    const section = document.querySelector("section")
    section.insertAdjacentHTML("beforebegin", menu[langue]);
    section.insertAdjacentHTML("afterend",pied_page[langue]);
}

document.addEventListener("DOMContentLoaded",code_commun);
