console.log("Le script est bien chargé");

// Afficher les projets dans la galerie
// récupère éléments Works dans API avec fetch
async function showWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const works = await reponse.json();
  console.log(works);

  showProjects(works);
  showCategories(works);
  showGalleryModal(works);
}

// récupère l'élément <gallery>
const gallery = document.querySelector(".gallery");

// Affiche les projets dans la galerie
function showProjects(works) {
  // vide la gallery
  gallery.innerHTML = "";

  //parcour chaque projets
  works.forEach((work) => {
    // crée un élément <figure>
    const figure = document.createElement("figure");
    // crée un élément <img>
    const img = document.createElement("img");
    img.src = work.imageUrl; // prend l'url de l'img du projet
    img.alt = work.title;
    figure.appendChild(img);
    // crée un élément <figcaption>
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;
    figure.appendChild(figcaption);

    // ajoute conteneur à la galerie
    gallery.appendChild(figure);
  });
}

// Filtrer les projets
// récupère éléments categories dans API avec fetch
async function showCategories(works) {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  console.log(categories);

  // récupère élément HTML
  const filtersButtons = document.querySelector(".filters");

  // crée le btn Tous
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  filtersButtons.appendChild(allButton);

  // évènement clic sur btn
  allButton.addEventListener("click", () => {
    showProjects(works); // affiche toutes les catégories
  });

  // Crée un bouton pour chaque catégorie
  categories.forEach((category) => {
    const categoryButton = document.createElement("button");
    categoryButton.textContent = category.name;
    filtersButtons.appendChild(categoryButton);

    // Ecoute événement pour afficher les projets de chaque catégorie avc fct filter
    categoryButton.addEventListener("click", () => {
      const filteredWorks = works.filter(
        (work) => work.categoryId === category.id
      );
      showProjects(filteredWorks); // Affiche les projets filtrés
    });
  });
}

// Afficher le mode édition si connecté
window.addEventListener("load", () => {
  const modeEdits = document.querySelector(".mode-edit");
  const btnEdits = document.querySelector(".btn-edit");
  const login = document.querySelector(".login");
  const token = sessionStorage.getItem("authToken"); // récupère le token

  if (token) {
    console.log("Utilisateur connecté");
    if (modeEdits) {
      modeEdits.classList.remove("hidden");
    }
    if (btnEdits) {
      btnEdits.classList.remove("hidden");
    }
    if (login) {
      login.textContent = "logout";
      login.addEventListener("click", () => {
        sessionStorage.removeItem("authToken");
        window.location.reload();
      });
    }
  } else {
    console.log("Utilisateur non connecté");
  }

  // Charger les projets
  showWorks();
});

//********* MODALE 1 ***********//
// fct pour ouvrir la modale
const openModal1 = function (e) {
  e.preventDefault();
  const modal1 = document.getElementById("modal1");
  modal1.classList.remove("hidden-modal");
  modal1.removeAttribute("aria-hidden");
  modal1.setAttribute("aria-modal", "true");

  //showGalleryModal(works);
};

// ouvre la modale en cliquant sur le bouton
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal1); // appel la focntion openModal
});

// fct pour fermer la modale
const closeModal = function () {
  const modal1 = document.getElementById("modal1");
  modal1.classList.add("hidden-modal");
  modal1.setAttribute("aria-hidden", "true");
  modal1.removeAttribute("aria-modal");
};

// ferme la modale1 en cliquant sur le bouton
document.querySelector(".close-modal").addEventListener("click", closeModal);
// ferme la modale en cliquant en dehors
const modal = document.getElementById("modal1");
const modalContent = document.querySelector(".modal-wrapper");

modal.addEventListener("click", function (e) {
  if (!modalContent.contains(e.target)) {
    closeModal();
  }
});

// fct affiche gallerie modale

function showGalleryModal(works) {
  const galleryModal = document.querySelector(".gallery-modal");

  // vider la galerie modale
  galleryModal.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.style.position = "relative";

    const img = document.createElement("img");
    img.src = work.imageUrl; // prend l'url de l'img du projet
    img.alt = work.title;
    figure.appendChild(img);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash-alt");
    deleteIcon.style.position = "absolute";
    deleteIcon.style.top = "5px";
    deleteIcon.style.right = "5px";
    deleteIcon.style.color = "white";
    deleteIcon.style.backgroundColor = "black";
    deleteIcon.style.padding = "3px";
    deleteIcon.style.borderRadius = "2px";
    deleteIcon.style.cursor = "pointer";
    figure.appendChild(deleteIcon);

    galleryModal.appendChild(figure);
  });
}
console.log(showGalleryModal);

//******** MODALE 2 ***********//
// fct pour ouvrir la modale
const openModal2 = function (e) {
  e.preventDefault();
  const modal1 = document.getElementById("modal1");
  const modal2 = document.getElementById("modal2");

  // ferme la 1er modale
  modal1.classList.add("hidden-modal");
  modal1.setAttribute("aria-hidden", "true");

  // ouvre la seconde modale
  modal2.classList.remove("hidden-modal");
  modal2.removeAttribute("aria-hidden");
  modal2.setAttribute("aria-modal", "true");
};

// ouvrir la modale 2
document.querySelector(".add-photo").addEventListener("click", openModal2);

// fct pour fermer la modale 2
const closeModal2 = function () {
  const modal2 = document.getElementById("modal2");
  modal2.classList.add("hidden-modal");
  modal2.setAttribute("aria-hidden", "true");
  modal2.removeAttribute("aria-modal");
};
// ferme la modale 2 en cliquant sur le bouton
document.querySelector(".close-modal2").addEventListener("click", closeModal2);
// ferme la modale 2 en cliquant dehors
const modal2 = document.getElementById("modal2");
const modalContent2 = document.querySelector(".modal-wrapper2");

modal2.addEventListener("click", function (e) {
  if (!modalContent2.contains(e.target)) {
    closeModal2();
  }
});

// fct retour à modal 1
const returnModal1 = function () {
  const modal2 = document.getElementById("modal2");
  modal2.classList.add("hidden-modal");
  const modal1 = document.getElementById("modal1");
  modal.classList.remove("hidden-modal");
  openModal1();
};
// retour à modale 1
document
  .querySelector(".btn-back-modal")
  .addEventListener("click", returnModal1);
