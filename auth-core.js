/* Firebase Authentication — Ballknowledge Academy */
(function () {
  const USERS = {
    "Hori_mogger67": "gtelloolalla@gmail.com",
    "Sajón-sensei 999": "jarranztorrijos@gmail.com"
  };
  const EMAIL_TO_USERNAME = Object.fromEntries(
    Object.entries(USERS).map(([username, email]) => [email.toLowerCase(), username])
  );

  if (typeof firebase === "undefined" || typeof FIREBASE_CONFIG === "undefined") {
    console.error("No se ha podido cargar Firebase. Comprueba data.js y los SDK.");
    return;
  }
  if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);

  window.bkaAuth = firebase.auth();
  window.BKA_USERS = USERS;
  window.bkaUsernameForEmail = function (email) {
    return EMAIL_TO_USERNAME[String(email || "").toLowerCase()] || null;
  };
})();
