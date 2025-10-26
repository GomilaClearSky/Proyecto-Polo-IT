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
    if(isLogin){
        modalTitle.textContent = "Iniciar sesión";
        modalForm.querySelector('button').textContent = "Ingresar";
        document.getElementById('toggleText').innerHTML = '¿No tenés una cuenta? <span id="toggleLink">Registrate</span>';
    } else {
        modalTitle.textContent = "Registrarse";
        modalForm.querySelector('button').textContent = "Registrarse";
        document.getElementById('toggleText').innerHTML = '¿Ya tenés cuenta? <span id="toggleLink">Iniciar sesión</span>';
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

        if(data.success){
            localStorage.setItem("loggedUser", username);
            if(isLogin){

                loginBtn.style.display = 'none';
                userProfile.style.display = 'flex';
                modalOverlay.style.display = 'none';
            } else {
                alert(data.msg); // mensaje de registro exitoso
            }
        } else {
            alert(data.msg);
        }
    } catch(err){
        console.error('Error al conectarse al servidor', err);
    }
});

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
    crearEvento: document.getElementById('crearEvento')
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
    document.getElementById('nombreUsuario').textContent = usuario.nombre;
    document.getElementById('fechaIngreso').textContent = `Se unió el: ${usuario.fecha}`;
    document.getElementById('cantidadAmigos').textContent = `Amigos: ${usuario.amigos}`;
}

// ----------------------
// EVENT LISTENERS
// ----------------------

// Inicio
btnInicio.addEventListener('click', () => mostrarSeccion('inicio'));

// Mis Eventos
btnMisEventos.addEventListener('click', () => {
    mostrarSeccion('misEventos');
    const usuarioId = 1; // reemplazá con el ID real del usuario logueado
    cargarMisEventos(usuarioId);
});


//PANTALLA DE MIS EVENTOS
//PANTALLA DE MIS EVENTOS
//PANTALLA DE MIS EVENTOS


async function cargarMisEventos(usuarioId) {
    const divMisEventos = document.getElementById("misEventos");

    try {
        const res = await fetch(`http://localhost:3000/eventos/${usuarioId}`);
        const data = await res.json();

        divMisEventos.innerHTML = ""; // limpiamos antes

        if(data.eventos && data.eventos.length > 0){
            // Tiene eventos
            divMisEventos.innerHTML = `
                <h1>Mis Eventos</h1>
                <p>Tienes ${data.eventos.length} evento(s) próximos:</p>
                <ul>
                    ${data.eventos.map(e => `<li>${e.NombreEvento}</li>`).join('')}
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


//PANTALLA DE MIS EVENTOS
//PANTALLA DE MIS EVENTOS
//PANTALLA DE MIS EVENTOS




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
    amigos: 9
  };

  actualizarPerfil(usuario);
});
