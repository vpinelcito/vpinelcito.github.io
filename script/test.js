

let langue = "EN";
const nom = "langue"

function code_commun() {
    const section = document.querySelector("section")
    section.insertAdjacentHTML("beforebegin", menu[langue]);
    section.insertAdjacentHTML("afterend",pied_page[langue]);
}

document.addEventListener("DOMContentLoaded",code_commun);
