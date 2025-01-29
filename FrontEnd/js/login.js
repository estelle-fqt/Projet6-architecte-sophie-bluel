// Gestion de la connexion
const formConnection = document.querySelector(".form-connection");
const errorMessage = document.querySelector(".error-connection");

formConnection.addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche le rechargement de la page (cptm /defaut du nav)

  // Récupération des valeurs du formulaire
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  // vérifie si champs vide
  if (email === "" || password === "") {
    errorMessage.textContent = "Veuillez remplir tous les champs";
    errorMessage.style.display = "block";
    return; // arrête l'exécution si un champ est vide
  }

  // Création de l'objet à envoyer = charge utile
  const connection = { email, password };

  // Conversion l'objt de charge utile en JSON
  const chargeUtile = JSON.stringify(connection);

  // Appel de l'API avec fetch (2 arguments : url & obj de config)
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Indique le format de la charge utile en JSON
    },
    body: chargeUtile,
  })
    // Gestion de la réponse
    .then((response) => {
      if (!response.ok) {
        //info authentification nn valide
        if (response.status === 401) {
          // lève une exception et crée obj d'erreur, transmise à catch
          throw new Error("Erreur dans l'identifiant ou le mot de passe.");
        }
      }
      return response.json(); // Traite la réponse JSON si la requête réussit
    })
    // traitement de la reponse réussi
    .then((data) => {
      const token = data.token; // extrait prop token de l'obj data
      if (token) {
        sessionStorage.setItem("authToken", token); // Stocke le token pour les futures requêtes
        window.location.href = "index.html"; // Redirige vers la page d'accueil
      }
    })
    // gestion des erreurs
    .catch((error) => {
      console.error("Erreur :", error.message); // Affiche une erreur en cas d'échec
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";
    });
});
