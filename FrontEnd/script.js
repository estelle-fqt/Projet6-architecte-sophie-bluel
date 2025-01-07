// récupère éléments Works dans API avec fetch
async function showWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const works = await reponse.json();
  console.log(works);

  showProjects(works);
}

// récupère l'élément <gallery>
const gallery = document.querySelector(".gallery");

// Affiche les projets dans la galerie
function showProjects(works) {
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

showWorks();
