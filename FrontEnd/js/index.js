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

// Gérer la modale
// fct pour ouvrir la modale
const openModal = function (e) {
  e.preventDefault();
  const target = document.getElementById("modal1");
  target.classList.remove("hidden-modal");
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");

  //showGalleryModal(works);
};

// ouvre la modale en cliquant sur le bouton
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal); // appel la focntion openModal
});

// fct pour fermer la modale
const closeModal = function () {
  const target = document.getElementById("modal1");
  target.classList.add("hidden-modal");
  target.setAttribute("aria-hidden", "true");
  target.removeAttribute("aria-modal");
};

const modal = document.getElementById("modal1");
const modalContent = document.querySelector(".modal-wrapper");

// ferme la modale en cliquant sur le bouton
document.querySelector(".close-modal").addEventListener("click", closeModal);
// ferme la modale en cliquant en dehors
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
