// Afficher les projets dans la galerie
// récupère éléments Works dans API avec fetch
async function showWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const works = await reponse.json();
  console.log(works);

  showProjects(works);

  showCategories(works);
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
    // crée un élément <ig>
    const img = document.createElement("img");
    img.src = work.imageUrl; // prend l'url de l'img du projet
    img.alt = work.title;
    // crée un élément <figcaption>
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    // ajoute <img> et <figcaption> à <figure>
    figure.appendChild(img);
    figure.appendChild(figcaption);

    // ajoute <figure> à la galerie
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

    // Ecoute événement pour afficher les projets de cette catégorie
    categoryButton.addEventListener("click", () => {
      const filteredWorks = works.filter(
        (work) => work.categoryId === category.id
      );
      showProjects(filteredWorks); // Affiche les projets filtrés
    });
  });
}

showWorks();
