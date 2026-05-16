const prenom = document.getElementById("prenom");
const nom = document.querySelector("#nom");
const tel = document.getElementById("tel");
const btn = document.getElementById("btn-add");
const tbody = document.getElementById("liste_contact");
const indice_modifier = document.getElementById("indice");
const btn_left = document.getElementById("btn-left");
const btn_right = document.getElementById("btn-right");
const search = document.getElementById("search");
const btn_rech = document.getElementById("btn-rech");

let tab_contacts = [];

// --- Pagination ---
const CONTACTS_PAR_PAGE = 5;
let page_courante = 1;
let contacts_affiches = []; // contacts filtrés ou tous

// -------------------------------------------------------
// AJOUT / MODIFICATION
// -------------------------------------------------------
btn.onclick = function () {
    if (prenom.value.trim() === "" || nom.value.trim() === "" || tel.value.trim() === "") {
        alert("Tous les champs sont obligatoires");
        return;
    }

    let c = {
        prenom: prenom.value.trim(),
        nom: nom.value.trim(),
        tel: tel.value.trim()
    };

    if (indice_modifier.value === "") {
        tab_contacts.push(c);
    } else {
        tab_contacts[indice_modifier.value] = c;
        btn.innerText = "Ajouter";
        indice_modifier.value = "";
        btn.classList.remove("btn-warning");
        btn.classList.add("btn-success");
    }

    prenom.value = "";
    nom.value = ""; 
    tel.value = "";

    // Réinitialiser la recherche et afficher tout
    search.value = "";
    page_courante = 1;
    afficher(tab_contacts);
};

// -------------------------------------------------------
// RECHERCHE
// -------------------------------------------------------
btn_rech.onclick = function () {
    rechercher();
};

// Recherche en temps réel (optionnel : sur chaque frappe)
search.addEventListener("keyup", function (e) {
    if (e.key === "Enter") rechercher();
});

function rechercher() {
    const terme = search.value.trim().toLowerCase();
    page_courante = 1;

    if (terme === "") {
        afficher(tab_contacts);
        return;
    }

    const resultats = tab_contacts.filter(c =>
        c.prenom.toLowerCase().includes(terme) ||
        c.nom.toLowerCase().includes(terme) ||
        c.tel.includes(terme)
    );

    afficher(resultats);
}

// -------------------------------------------------------
// AFFICHAGE AVEC PAGINATION
// -------------------------------------------------------
function afficher(liste) {
    contacts_affiches = liste;
    remplirTable();
    mettreAJourBoutons();
}

function remplirTable() {
    tbody.innerHTML = "";

    const debut = (page_courante - 1) * CONTACTS_PAR_PAGE;
    const fin = debut + CONTACTS_PAR_PAGE;
    const page = contacts_affiches.slice(debut, fin);

    if (page.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Aucun contact trouvé</td></tr>`;
        return;
    }

    page.forEach((contact, i) => {
        const indice_reel = tab_contacts.indexOf(contact);
        const numero = debut + i + 1;
        tbody.innerHTML += `
            <tr>
                <td>${numero}</td>
                <td>${contact.prenom}</td>
                <td>${contact.nom}</td>
                <td>${contact.tel}</td>
                <td>
                    <button class="btn btn-sm btn-outline-warning" onclick="modifiercontact(${indice_reel})">✏️</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="supprimercontact(${indice_reel})">❌</button>
                </td>
            </tr>`;
    });
}

// -------------------------------------------------------
// PAGINATION : boutons retour / suivant
// -------------------------------------------------------
function totalPages() {
    return Math.ceil(contacts_affiches.length / CONTACTS_PAR_PAGE);
}

function mettreAJourBoutons() {
    btn_left.disabled = page_courante <= 1;
    btn_right.disabled = page_courante >= totalPages();
}

btn_left.onclick = function () {
    if (page_courante > 1) {
        page_courante--;
        remplirTable();
        mettreAJourBoutons();
    }
};

btn_right.onclick = function () {
    if (page_courante < totalPages()) {
        page_courante++;
        remplirTable();
        mettreAJourBoutons();
    }
};

// -------------------------------------------------------
// SUPPRIMER / MODIFIER
// -------------------------------------------------------
function supprimercontact(position) {
    if (confirm("Voulez-vous supprimer ce contact ?")) {
        tab_contacts.splice(position, 1);
        // Réajuster la page si elle devient vide
        if (page_courante > totalPages() && page_courante > 1) {
            page_courante--;
        }
        // Réappliquer la recherche en cours si besoin
        const terme = search.value.trim().toLowerCase();
        if (terme) {
            rechercher();
        } else {
            afficher(tab_contacts);
        }
    }
}

function modifiercontact(position) {
    indice_modifier.value = position;
    prenom.value = tab_contacts[position].prenom;
    nom.value = tab_contacts[position].nom;
    tel.value = tab_contacts[position].tel;
    btn.innerText = "Mettre à jour";
    btn.classList.remove("btn-success");
    btn.classList.add("btn-warning");
}
