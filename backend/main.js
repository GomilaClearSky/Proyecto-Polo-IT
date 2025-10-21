document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------
  // LOGIN / REGISTRO
  // ---------------------------
  const loginBtn = document.getElementById("loginBtn");
  const userSection = document.getElementById("userSection");
  const modal = document.getElementById("authModal");
  const closeBtn = document.querySelector(".close");
  const authForm = document.getElementById("authForm");
  const authTitle = document.getElementById("authTitle");
  const toggleAuth = document.getElementById("toggleAuth");
  let isRegister = false;

  modal.style.display = "none";

  loginBtn.addEventListener("click", () => modal.style.display = "flex");
  closeBtn.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  toggleAuth.addEventListener("click", (e) => {
    if (e.target.id === "switchToRegister") {
      e.preventDefault();
      isRegister = !isRegister;
      if (isRegister) {
        authTitle.textContent = "Registrarse";
        toggleAuth.innerHTML = '¿Ya tenés cuenta? <a href="#" id="switchToRegister">Iniciá sesión</a>';
      } else {
        authTitle.textContent = "Iniciar Sesión";
        toggleAuth.innerHTML = '¿No tenés cuenta? <a href="#" id="switchToRegister">Registrate acá</a>';
      }
    }
  });

  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!username || !password) return;

    const url = isRegister ? "http://localhost:3000/register" : "http://localhost:3000/login";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.msg);

    if(data.success){
      showUserProfile(username);
      modal.style.display = "none";
    }
  });

  function showUserProfile(username) {
    userSection.innerHTML = `
      <img src="images/avatar.jpg" alt="">
      <h2>${username}</h2>
      <p>Usuario conectado</p>
      <button id="logoutBtn">Cerrar sesión</button>
    `;
    document.getElementById("logoutBtn").addEventListener("click", () => {
      location.reload();
    });
  }

  // ---------------------------
  // EVENTOS GENÉRICOS
  // ---------------------------
  const btnEventos = document.getElementById("btnEventos");
  const main = document.getElementById("main");

  let eventos = []; // Array para almacenar eventos temporales

  btnEventos.addEventListener("click", () => {
    main.innerHTML = `
      <h1>Eventos</h1>

      <!-- Crear Evento -->
      <div style="margin-bottom:20px;">
        <h3>Crear Evento</h3>
        <input type="text" id="eventNameInput" placeholder="Nombre del evento">
        <button id="createEventBtn">Crear</button>
        <p id="createMsg" style="color:green;"></p>
      </div>

      <!-- Unirse a Evento -->
      <div style="margin-bottom:20px;">
        <h3>Unirse a Evento</h3>
        <div id="joinList"></div>
        <p id="joinMsg" style="color:blue;"></p>
      </div>

      <!-- Mis Eventos -->
      <div>
        <h3>Mis Eventos</h3>
        <ul id="myEventsList"></ul>
      </div>
    `;

    const createEventBtn = document.getElementById("createEventBtn");
    const eventNameInput = document.getElementById("eventNameInput");
    const createMsg = document.getElementById("createMsg");
    const joinList = document.getElementById("joinList");
    const joinMsg = document.getElementById("joinMsg");
    const myEventsList = document.getElementById("myEventsList");

    // Función para actualizar la lista de eventos para unirse
    function updateJoinList() {
      joinList.innerHTML = "";
      if(eventos.length === 0){
        joinList.innerHTML = "<p>No hay eventos disponibles.</p>";
        return;
      }
      eventos.forEach((e, i) => {
        const btn = document.createElement("button");
        btn.textContent = `Unirse a "${e.nombre}"`;
        btn.style.margin = "5px";
        btn.addEventListener("click", () => {
          if(!e.participantes.includes("Tú")) e.participantes.push("Tú");
          joinMsg.textContent = `Te uniste al evento "${e.nombre}"`;
          updateMyEvents();
        });
        joinList.appendChild(btn);
      });
    }

    // Función para actualizar Mis Eventos
    function updateMyEvents() {
      myEventsList.innerHTML = "";
      eventos.forEach(e => {
        if(e.participantes.includes("Tú")){
          const li = document.createElement("li");
          li.textContent = e.nombre;
          myEventsList.appendChild(li);
        }
      });
    }

    // Crear evento
    createEventBtn.addEventListener("click", () => {
      const nombre = eventNameInput.value.trim();
      if(nombre){
        eventos.push({ nombre, participantes: [] });
        createMsg.textContent = `Evento "${nombre}" creado!`;
        eventNameInput.value = "";
        updateJoinList();
      } else {
        createMsg.textContent = "Por favor escribí un nombre válido.";
        createMsg.style.color = "red";
      }
    });

    updateJoinList();
    updateMyEvents();
  });

});