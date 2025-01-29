// Afficher les projets dans la galerie
// récupère éléments Works dans API avec fetch
async function showWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  console.log(works);

  showProjects(works);
  showCategories(works);
  showGalleryModal(works);
}

// récupère l'élément <gallery>
const gallery = document.querySelector(".gallery");

// Affiche les travaux dans la galerie
function showProjects(works) {
  // vide la gallery
  gallery.innerHTML = "";

  //parcour chaque projets
  works.forEach((work) => {
    // crée un élément <figure>
    const figure = document.createElement("figure");
    figure.id = work.id; // lie la propriété id du work à l'élément figure
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
  filtersButtons.innerHTML = ""; // vide les btn existants

  // crée le btn Tous
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  filtersButtons.appendChild(allButton);

  // évènement clic sur btn
  allButton.addEventListener("click", () => {
    showProjects(works); // affiche toutes les catégories
  });

  // Crée un bouton pour chaque catégorie
  // parcours chaque élément dans le tableau categories et prend comme variable category
  categories.forEach((category) => {
    const categoryButton = document.createElement("button");
    categoryButton.textContent = category.name; // affiche le name de l'objet category du tableau
    filtersButtons.appendChild(categoryButton);

    // Ecoute événement pour afficher les projets de chaque catégorie avc fct filter
    categoryButton.addEventListener("click", () => {
      // Filtre tab works pr garder que projets dt id de catégorie = category.id
      const filteredWorks = works.filter(
        (work) => work.categoryId === category.id
      );
      showProjects(filteredWorks); // Affiche les projets filtrés avec le tableau de projets filteredWorks
    });
  });
}

// Gestion du clic sur Login
const loginBtn = document.querySelector(".login-btn");
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    console.log("Redirection vers la page de connexion");
    window.location.href = "login.html";
  } else {
    console.log("Déconnexion en cours...");
    sessionStorage.removeItem("authToken");
    window.location.href = "index.html";
  }
});

// Afficher le mode édition si connecté
window.addEventListener("load", () => {
  const modeEdits = document.querySelector(".mode-edit");
  const btnEdits = document.querySelector(".btn-edit");
  const filters = document.querySelector(".filters");
  const loginBtn = document.querySelector(".login-btn");
  const token = sessionStorage.getItem("authToken"); // récupère le token

  if (token) {
    console.log("Utilisateur connecté");

    if (modeEdits) {
      modeEdits.classList.remove("hidden");
    }
    if (btnEdits) {
      btnEdits.classList.remove("hidden");
    }
    if (filters) {
      filters.classList.add("hidden");
    }
    if (loginBtn) {
      loginBtn.textContent = "logout";
    }
  } else {
    console.log("Utilisateur non connecté");

    // masque éléments mode édition
    if (modeEdits) {
      modeEdits.classList.add("hidden");
    }
    if (btnEdits) {
      btnEdits.classList.add("hidden");
    }
    if (filters) {
      filters.classList.remove("hidden");
    }
  }

  // Charger les projets
  showWorks();
});

//********* MODALE 1 ***********//
// fct pour ouvrir la modale
const openModal1 = function (e) {
  const modal1 = document.getElementById("modal1");
  modal1.classList.remove("hidden-modal");
};
// ouvre la modale en cliquant sur le bouton
document.querySelector(".btn-edit").addEventListener("click", openModal1); // appel la focntion openModal

// fct pour fermer la modale
const closeModal = function () {
  const modal1 = document.getElementById("modal1");
  modal1.classList.add("hidden-modal");
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
    figure.id = work.id;
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
    // suppression au clic
    deleteIcon.addEventListener("click", () => {
      deleteImg(work.id, figure);
    });
    figure.appendChild(deleteIcon);

    galleryModal.appendChild(figure);
  });
}

// fct supprimer une image
function deleteImg(workId) {
  const token = sessionStorage.getItem("authToken"); // récupère le token
  if (!token) {
    alert("Vous devez être connecté pour supprimer une image.");
    return;
  }

  // requête DELETE
  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // authentification avc le token
    },
  }).then((response) => {
    if (response.ok) {
      const figures = document.querySelectorAll(`figure[id="${workId}"]`); // associe l'id de l'img ajoutée a figures
      figures.forEach((figure) => figure.remove()); // supprime ds les 2 galleries
      console.log(`img avc id ${workId} supprimée`);
    } else {
      console.error("erreur lors de la suppression de l'img");
      alert("La suppression a échoué.");
    }
  });
}

//******** MODALE 2 ***********//
// fct pour ouvrir la modale 2
const openModal2 = function (e) {
  e.preventDefault();
  const modal1 = document.getElementById("modal1");
  const modal2 = document.getElementById("modal2");

  // ferme modale 1
  modal1.classList.add("hidden-modal");

  // ouvre modale 2
  modal2.classList.remove("hidden-modal");

  // charge les catéories
  loadCategories();
};
// ouvrir la modale 2
document.querySelector(".add-photo").addEventListener("click", openModal2);

// fct pour fermer la modale 2
const closeModal2 = function () {
  const modal2 = document.getElementById("modal2");
  modal2.classList.add("hidden-modal");
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
  openModal1();
};
// retour à modale 1
document
  .querySelector(".btn-back-modal")
  .addEventListener("click", returnModal1);

// fct ajouter une image à modale 2
const imgUpload = document.getElementById("btn-upload-img");
const imgPreview = document.getElementById("preview-img");

// écoute event sur input type=file
imgUpload.addEventListener("change", function () {
  const file = this.files[0]; // accède au premier fichier de la liste

  if (file) {
    const reader = new FileReader(); // permet de lire le contenu du fichier sélectionné

    // fct affiche preview de l'img
    reader.addEventListener("load", function () {
      imgPreview.setAttribute("src", this.result); // this.result=url img //attribut l'url img à src
      imgPreview.style.display = "block";
    });
    reader.readAsDataURL(file); // transforme l'img en URL utilisable dans balise <img>

    const invisibleUpload = document.querySelector(".block-upload-img");
    invisibleUpload.style.display = "none"; // enlève le block upload d'arrière plan
  }
});

// fct recupère catégories de l'API
function loadCategories() {
  const selectCategory = document.getElementById("category");

  // Vide les options existantes (sauf la première option)
  selectCategory.innerHTML = '<option value="">Choisir une catégorie</option>';

  fetch("http://localhost:5678/api/categories")
    .then((response) => {
      return response.json();
    })
    .then((categories) => {
      // ajoute les catégorie
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id; // utilise l'id pour la valeur
        option.textContent = category.name; // utilise le nom pour l'affichage
        selectCategory.appendChild(option);
      });
    });
}

// gestion remplissage formulaire
const form = document.querySelector(".form-upload-img");
const inputs = form.querySelectorAll("input[required]");
const selects = form.querySelectorAll("select[required]");
const submitBtn = document.getElementById("btn-validate");
// evenement remplissage des inputs
inputs.forEach((input) => {
  input.addEventListener("input", checkForm);
});
// evenement remplissage des select
selects.forEach((select) => {
  select.addEventListener("change", checkForm);
});
// fct vérif si ts les champs sont remplis
function checkForm() {
  let allFields = true;
  // vérifie chaque champs input
  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      allFields = false;
    }
  });
  // vérifie chaque champs select
  selects.forEach((select) => {
    if (select.value === "") {
      allFields = false;
    }
  });
  // active-désactive le btn
  submitBtn.disabled = !allFields;
}

// gestion btn submit & envoie requête
const uploadForm = document.querySelector(".form-upload-img");

uploadForm.addEventListener("submit", function (e) {
  e.preventDefault(); // bloque le rechargement de la page

  const token = sessionStorage.getItem("authToken"); // récupère le token
  const imgFile = document.getElementById("btn-upload-img").files[0]; // récupère le 1er élément img uploader
  const title = document.getElementById("title").value; // récupère la valeur de l'input titre
  const category = document.getElementById("category").value; // récupère la valeur du select catégorie

  // vérif des champs (2eme sécurité)
  if (!imgFile || !title || !category) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  // crée formData pr l'envoi du formulaire
  const formData = new FormData();
  formData.append("image", imgFile);
  formData.append("title", title);
  formData.append("category", category); // utilise l'ID

  // envoie requête POST à l'API
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // authentification (`` transforme en string)
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // récup données du new élément
      } else {
        console.log("Erreur lors de l'envoi de l'image");
      }
    })
    .then((newWork) => {
      console.log("Image ajoutée :", newWork);

      // met à jr galerie principale et la modale
      addImageToGallery(newWork);
      addImageToModal(newWork);

      // réinitialise le formulaire
      uploadForm.reset();
      submitBtn.disabled = true;
      imgPreview.style.display = "none";
      document.querySelector(".block-upload-img").style.display = "inline-flex";
      //returnModal1();
    });
});

// ajoute img à la galerie principale
function addImageToGallery(work) {
  const gallery = document.querySelector(".gallery");

  const figure = document.createElement("figure");
  figure.id = work.id;
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);

  gallery.appendChild(figure);
}

// ajoute img à la galerie modale
function addImageToModal(work) {
  const galleryModal = document.querySelector(".gallery-modal");

  const figure = document.createElement("figure");
  figure.id = work.id;
  figure.style.position = "relative";

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

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

  // icone supprimer img ajoutée
  deleteIcon.addEventListener("click", () => {
    deleteImg(work.id, figure);
  });

  figure.appendChild(img);
  figure.appendChild(deleteIcon);

  galleryModal.appendChild(figure);
}
