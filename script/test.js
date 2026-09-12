const menu = ''<div id="haut"></div><header><nav><div class="changement_langue"><span id="FR">FR</span>|<span id="EN">EN</span></div><label for="menu" id="deploye"></label><input type="checkbox" id="menu" role="button"><ul class="list_menu"><li><label>'

let langue = "EN";
const nom = "langue"

function code_commun() {
    const section = document.querySelector("section")
    section.insertAdjacentHTML("beforebegin", menu[langue]);
    section.insertAdjacentHTML("afterend",pied_page[langue]);
}

document.addEventListener("DOMContentLoaded",code_commun);
