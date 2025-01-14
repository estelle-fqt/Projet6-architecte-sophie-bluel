// Gestion de la connexion
const formConnection = document.querySelector(".form-connection");
const errorMessage = document.querySelector(".error-connection");

formConnection.addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche le rechargement de la page (cptm /defaut du nav)

  // Récupération des valeurs du formulaire
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  // Création de l'objet à envoyer = charge utile
  const connection = { email, password };

  // Conversion l'objt de charge utile en JSON
  const chargeUtile = JSON.stringify(connection);

  // Appel de l'API avec fetch (2 arguments : url & obj de config)
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Indique que le corps est en JSON
    },
    body: chargeUtile,
  })
    // Gestion de la réponse
    .then((response) => {
      console.log("Statut de la réponse:", response.status);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Erreur dans l'identifiant ou le mot de passe.");
        } else {
          throw new Error("Erreur serveur. Veillez réessayer plus tard.");
        }
      }
      return response.json(); // Traite la réponse JSON si la requête réussit
    })
    .then((data) => {
      console.log("Connexion réussie :", data);
      const token = data.token;
      if (token) {
        sessionStorage.setItem("authToken", token); // Stocke le token pour les futures requêtes
        window.location.href = "index.html"; // Redirige vers la page d'accueil
      }
    })
    .catch((error) => {
      console.error("Erreur :", error.message); // Affiche une erreur en cas d'échec
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";
    });
});
