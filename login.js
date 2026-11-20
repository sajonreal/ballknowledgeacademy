document.addEventListener("DOMContentLoaded", () => {
  const form=document.getElementById("login-form"), usernameInput=document.getElementById("login-usuario"), passwordInput=document.getElementById("login-clave"), errorEl=document.getElementById("login-error"), button=document.getElementById("login-submit");
  if (!window.bkaAuth) { errorEl.textContent="No se ha podido conectar con el servicio de acceso."; return; }
  const destination=()=>{ const next=new URLSearchParams(location.search).get("next"); return next && /^[a-z0-9-]+\.html$/i.test(next) ? next : "index.html"; };
  window.bkaAuth.onAuthStateChanged(user=>{ const name=user && window.bkaUsernameForEmail(user.email); if(name){localStorage.setItem("bka_usuario",name);location.replace(destination());} });
  form.addEventListener("submit",async event=>{
    event.preventDefault(); errorEl.textContent="";
    const username=usernameInput.value.trim(), email=window.BKA_USERS[username];
    if(!email){errorEl.textContent="Usuario o contraseña incorrectos.";return;}
    button.disabled=true;button.textContent="Entrando...";
    try{
      const credential=await window.bkaAuth.signInWithEmailAndPassword(email,passwordInput.value);
      const valid=window.bkaUsernameForEmail(credential.user.email);
      if(!valid){await window.bkaAuth.signOut();throw new Error("Cuenta no autorizada.");}
      localStorage.setItem("bka_usuario",valid);location.replace(destination());
    }catch(error){
      console.error("Error de inicio de sesión:",error);
      errorEl.textContent=error.code==="auth/too-many-requests"?"Demasiados intentos. Espera un poco y vuelve a probar.":"Usuario o contraseña incorrectos.";
      button.disabled=false;button.textContent="Entrar";passwordInput.value="";
    }
  });
});