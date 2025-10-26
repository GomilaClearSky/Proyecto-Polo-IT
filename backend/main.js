const loginBtn = document.getElementById('loginBtn');
const userProfile = document.getElementById('userProfile');
const modalOverlay = document.getElementById('modalOverlay');
const modalForm = document.getElementById('modalForm');
const modalTitle = document.getElementById('modalTitle');
const toggleLink = document.getElementById('toggleLink');



const contenidoPrincipal = document.querySelector('.content'); // tu sección principal
const perfilSeccion = document.getElementById('perfilUsuario');

const btnInicio = document.getElementById('btnInicio');



let isLogin = true;

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
userProfile.addEventListener('click', () => {
    // Ocultamos otras secciones
    modalOverlay.style.display = 'none';
    contenidoPrincipal.style.display = 'none'; // ocultamos el contenido principal
    

    // Mostramos la sección de perfil
    document.getElementById('perfilUsuario').style.display = 'block';

    // Scroll suave hasta la sección
    document.getElementById('perfilUsuario').scrollIntoView({ behavior: 'smooth' });

    // Actualizamos el nombre de usuario dinámicamente
    const username = modalForm.username.value; // si querés usar lo que ingresó en login
    document.getElementById('nombreUsuario').textContent = username;

    // Fecha y cantidad de amigos random
    document.getElementById('fechaIngreso').textContent = "Se unió el: 15/03/2023";
    document.getElementById('cantidadAmigos').textContent = "Amigos: 12";
});

// ----------------------
// BOTON PARA IR A INICIO
// -----------------------

btnInicio.addEventListener('click', () => {
    // Ocultar la sección de perfil si está visible
    perfilSeccion.style.display = 'none';

    // Mostrar la sección principal
    contenidoPrincipal.style.display = 'block';

    // Hacer scroll suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
});



