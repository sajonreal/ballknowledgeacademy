/* Bloquea las páginas de la academia hasta validar la sesión Firebase. */
(function () {
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (page === "login.html") { document.documentElement.classList.remove("auth-pending"); return; }
  const auth = window.bkaAuth;
  if (!auth) { location.replace("login.html"); return; }
  auth.onAuthStateChanged(async user => {
    const username = user && window.bkaUsernameForEmail(user.email);
    if (!user || !username) {
      localStorage.removeItem("bka_usuario");
      if (user) { try { await auth.signOut(); } catch (_) {} }
      const next = location.pathname.split("/").pop() || "index.html";
      location.replace("login.html?next=" + encodeURIComponent(next)); return;
    }
    localStorage.setItem("bka_usuario", username);
    document.documentElement.classList.remove("auth-pending");
  }, error => { console.error("Error comprobando la sesión:", error); location.replace("login.html"); });
})();