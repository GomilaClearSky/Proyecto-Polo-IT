const loginBtn = document.getElementById('loginBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalForm = document.getElementById('modalForm');
const modalTitle = document.getElementById('modalTitle');
const toggleLink = document.getElementById('toggleLink');
const userProfile = document.getElementById('userProfile');


const contenidoPrincipal = document.querySelector('.content'); // tu sección principal
const perfilSeccion = document.getElementById('perfilUsuario');




let isLogin = true;



const savedUser = localStorage.getItem("loggedUser");
const userId = localStorage.getItem("loggedUserId");

if (savedUser) {
                loginBtn.style.display = 'none';
                userProfile.style.display = 'flex';
                modalOverlay.style.display = 'none';
}

// Abrir modal al clickear botón
loginBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
});

// Cerrar modal al clickear afuera del cuadro
modalOverlay.addEventListener('click', (e) => {
    if(e.target === modalOverlay){
        modalOverlay.style.display = 'none';
    }
});

// Alternar login/registro
toggleLink.addEventListener('click', () => {
    isLogin = !isLogin;
    if (isLogin) {
        modalTitle.textContent = "Iniciar sesión";
        modalForm.querySelector('button').textContent = "Ingresar";
        toggleLink.textContent = "Registrate";
        toggleText.firstChild.textContent = "¿No tenés una cuenta? ";
    } else {
        modalTitle.textContent = "Registrarse";
        modalForm.querySelector('button').textContent = "Registrarse";
        toggleLink.textContent = "Iniciar sesión";
        toggleText.firstChild.textContent = "¿Ya tenés cuenta? ";
    }
    // reasignar event listener
    document.getElementById('toggleLink').addEventListener('click', arguments.callee);
});

// Submit del form
modalForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // 🔹 evita recargar la página

    const username = modalForm.username.value;
    const password = modalForm.password.value;

    const endpoint = isLogin ? 'login' : 'register';

    try {
        const res = await fetch(`http://localhost:3000/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem("loggedUser", username);
            localStorage.setItem("loggedUserId", data.user.id); // 🔹 guardamos el ID

            if (isLogin) {
                // Login exitoso
                loginBtn.style.display = 'none';
                userProfile.style.display = 'flex';
                modalOverlay.style.display = 'none';
                document.getElementById("nombreUsuario").textContent = username;
            } else {
                // Registro exitoso → cerrar modal y resetear a login
                alert(data.msg);
                modalOverlay.style.display = 'none';
                isLogin = true;
                modalTitle.textContent = "Iniciar sesión";
                modalForm.querySelector('button').textContent = "Ingresar";
                toggleLink.textContent = "Registrate";
                toggleText.firstChild.textContent = "¿No tenés una cuenta? ";
            }
        } else {
            alert(data.msg);
        }

    } catch (err) {
        console.error('Error al conectarse al servidor', err);
    }
});



const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        // Borrar el usuario del localStorage
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("loggedUserId");  // 🔹 borrar ID

        // Mostrar el botón de login y ocultar el perfil
        loginBtn.style.display = 'block';
        userProfile.style.display = 'none';

        // (Opcional) Redirigir al inicio
        // o simplemente:
        // location.reload();

        alert("Sesión cerrada correctamente 👋");
    });
}

// ----------------------
// BOTON PARA IR AL PERFIL
// -----------------------
// ----------------------
// SECCIONES
// ----------------------
const secciones = {
    inicio: document.getElementById('contenidoPrincipal'),
    perfil: document.getElementById('perfilUsuario'),
    misEventos: document.getElementById('misEventos'),
    crearEvento: document.getElementById('crearEvento'),
    listaAmigos: document.getElementById('listaAmigos')
};

// ----------------------
// BOTONES
// ----------------------
const btnInicio = document.getElementById('btnInicio');
const btnMisEventos = document.getElementById('btnMisEventos');


// ----------------------
// FUNCIONES UTILES
// ----------------------
function ocultarSecciones() {
    for (let key in secciones) {
        secciones[key].style.display = 'none';
    }
}

function mostrarSeccion(nombre) {
    ocultarSecciones();
    if (secciones[nombre]) {
        secciones[nombre].style.display = 'block';
        secciones[nombre].scrollIntoView({ behavior: 'smooth' });
    }
}

function actualizarPerfil(usuario) {
    const nombreUsuario = document.getElementById('nombreUsuario');
    const fechaIngreso = document.getElementById('fechaIngreso');
    const cantidadAmigos = document.getElementById('cantidadAmigos');

    nombreUsuario.textContent = usuario.nombre;
    fechaIngreso.textContent = `Se unió el: ${usuario.fecha}`;
    cantidadAmigos.textContent = `Amigos: ${usuario.amigos}`;

    // 🔹 Event listener para mostrar la lista de amigos
    cantidadAmigos.addEventListener("click", () => {
        mostrarSeccion('listaAmigos');
        console.log("Amigos apretado");
        const userId = localStorage.getItem("loggedUserId");
        if(userId) cargarAmigos(userId);
    });
}

// ----------------------
// EVENT LISTENERS
// ----------------------

// Inicio
btnInicio.addEventListener('click', () => mostrarSeccion('inicio'));

// Mis Eventos
btnMisEventos.addEventListener('click', () => {
    mostrarSeccion('misEventos');
    const userId = localStorage.getItem("loggedUserId");
    cargarMisEventos(userId); // 👈 esto vuelve a pedir los eventos
});


//PANTALLA DE MIS EVENTOS
//PANTALLA DE MIS EVENTOS
//PANTALLA DE MIS EVENTOS

 
async function cargarMisEventos(userId) {
    const divMisEventos = document.getElementById("misEventos");

    try {
        const res = await fetch(`http://localhost:3000/eventos/${userId}`);
        const data = await res.json();

        divMisEventos.innerHTML = ""; // limpiamos antes

        if(data.eventos && data.eventos.length > 0){
            // Tiene eventos
            divMisEventos.innerHTML = `
                <h1>Mis Eventos</h1>
                <p>Tienes ${data.eventos.length} evento(s) próximos:</p>
                <ul>
                    ${data.eventos.map(e => `<li>${e.nombre}</li>`).join('')}
                </ul>
                <button>Botón 1</button>
                <button>Botón 2</button>
            `;
        } else {
            // No tiene eventos
            divMisEventos.innerHTML = `
                <h1>Mis Eventos</h1>
                <p class="primero">¡Estas libre de eventos!</p>
                <p class="segundo">Intenta con</p>        
                <button id="btnDescubrir">Descubrir un evento</button>
                <button id="btnCrear">Crear un evento</button>
            `;
        }

        divMisEventos.style.display = "block";

        const btnDescubrir = document.getElementById("btnDescubrir");
        const btnCrear = document.getElementById("btnCrear");

        if(btnDescubrir) btnDescubrir.addEventListener("click", () => {
            mostrarSeccion('inicio'); // ejemplo: sección de descubrir eventos
            console.log("Hola, esto va a la consola");
        });

        if(btnCrear) btnCrear.addEventListener("click", () => {
            mostrarSeccion('crearEvento'); // ejemplo: sección para crear eventos
            console.log("Hola, esto va a la consola2");
        });


    } catch(err) {
        console.error("Error al cargar eventos", err);
        divMisEventos.innerHTML = `<p>Error al cargar los eventos</p>`;
        divMisEventos.style.display = "block";
    }
}



////

const formCrearEvento = document.getElementById("formCrearEvento");
const mensajeEvento = document.getElementById("mensajeEvento");




// --------------------------
// --------------------------
// --------------------------


// Mi Perfil
userProfile.addEventListener('click', () => {
  if (typeof modalOverlay !== 'undefined') modalOverlay.style.display = 'none';

  mostrarSeccion('perfil');

  // Traer el nombre desde localStorage
  const savedUser = localStorage.getItem("loggedUser");

  // Datos del usuario
  const usuario = {
    nombre: savedUser || "Usuario desconocido",
    fecha: "31/10/2024",
    amigos: 1
  };

  actualizarPerfil(usuario);
});

// Lista amigos

async function cargarAmigos(userId) {
    const listaAmigosDiv = document.getElementById("listaAmigos");
    listaAmigosDiv.innerHTML = ""; // limpiamos antes

    try {
        const res = await fetch(`http://localhost:3000/amigos/${userId}`);
        const data = await res.json();

        if(data.success && data.amigos.length > 0){
            data.amigos.forEach(amigo => {
                const amigoDiv = document.createElement("div");
                amigoDiv.classList.add("amigo");
                amigoDiv.style.display = "flex";
                amigoDiv.style.alignItems = "center";
                amigoDiv.style.cursor = "pointer";
                amigoDiv.style.marginBottom = "10px";

                amigoDiv.innerHTML = `
                    <img src="images/avatar.png" alt="Foto amigo" style="width:40px; height:40px; border-radius:50%; margin-right:10px;">
                    <span>${amigo.nombre}</span>
                `;

                // Función al click
                amigoDiv.addEventListener("click", () => {
                    // reemplazá esto por la acción real
                    alert(`Hiciste click en ${amigo.nombre}`);
                });

                listaAmigosDiv.appendChild(amigoDiv);
            });
        } else {
            // Si no tiene amigos
            listaAmigosDiv.innerHTML = `<p>No tenés amigos 😢</p>`;
        }

    } catch(err) {
        console.error("Error al cargar amigos:", err);
        listaAmigosDiv.innerHTML = `<p>Error al cargar los amigos 😬</p>`;
    }
}







// CREAR UN EVENTO
// OH YEAH BABYYYYYYYYYYYY

formCrearEvento.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre_evento = document.getElementById("nombre_evento").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const ubicacion = document.getElementById("ubicacion").value.trim();
  const fecha_inicio = document.getElementById("fecha_inicio").value;
  const fecha_fin = document.getElementById("fecha_fin").value;


  const userId = localStorage.getItem("loggedUserId");

  // Validación básica
  if (!nombre_evento || !descripcion || !ubicacion || !fecha_inicio || !fecha_fin) {
    mensajeEvento.textContent = "Por favor completá todos los campos 🫶";
    mensajeEvento.style.color = "red";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/crear_evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_evento, descripcion, ubicacion, fecha_inicio, fecha_fin, userId })
      
    });

    const data = await res.json();

    if (data.success) {
      mensajeEvento.textContent = data.msg;
      mensajeEvento.style.color = "green";
      formCrearEvento.reset();

      
    } else {
      mensajeEvento.textContent = data.msg || "Error al crear el evento 😕";
      mensajeEvento.style.color = "red";
    }

  } catch (err) {
    console.error("Error:", err);
    mensajeEvento.textContent = "Hubo un error al conectar con el servidor 😬";
    mensajeEvento.style.color = "red";
  }
});
