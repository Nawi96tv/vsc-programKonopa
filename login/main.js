document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // MENÚ RESPONSIVO
    // ==========================================

    const btnMenu = document.querySelector('#btn-menu');
    const navMenu = document.querySelector('.nav-menu'); 

    if (btnMenu && navMenu) {
        btnMenu.addEventListener('click', () => {
            navMenu.classList.toggle('mostrar'); 
            btnMenu.classList.toggle('activo'); 
        });
    }

    // ==========================================
    // FUNCIÓN: CREAR EL MENÚ DESPLEGABLE (DROPDOWN)
    // ==========================================

    function verificarSesionActiva() {
        const sesionIniciada = localStorage.getItem('konopa_logeado');
        const nombreCompleto = localStorage.getItem('konopa_usuario_nombre');
        
        const enlacesMenu = document.querySelectorAll('.nav-menu a');
        let enlaceLogin = null;

        enlacesMenu.forEach(enlace => {
            if (enlace.textContent.includes('Login') || (nombreCompleto && enlace.textContent.includes(nombreCompleto.split(' ')[0]))) {
                enlaceLogin = enlace;
            }
        });
        
        if (sesionIniciada === 'true' && enlaceLogin && nombreCompleto) {
            const liPadre = enlaceLogin.parentElement;
            
            liPadre.classList.add('nav-user-item');
            liPadre.innerHTML = `
                <a href="#" id="btn-user-toggle"><i class="fa-regular fa-circle-user"></i> ${nombreCompleto.split(' ')[0]} <i class="fa-solid fa-chevron-down icon-chevron"></i></a>
                <ul class="dropdown-content" id="user-dropdown">
                    <li><a href="../perfil/index.html">Mi cuenta</a></li>
                    <li><a href="../perfil/index.html?seccion=pedidos">Mis pedidos</a></li>
                    <li><a href="../perfil/index.html?seccion=reclamos">Mis reclamos</a></li>
                    <li><a href="../perfil/index.html?seccion=reservas">Mis reservas</a></li>
                    <li><a href="#" id="btn-cerrar-sesion">Cerrar sesión</a></li>
                </ul>
            `;

            const btnUserToggle = document.getElementById('btn-user-toggle');
            const userDropdown = document.getElementById('user-dropdown');
            
            btnUserToggle.addEventListener('click', (e) => {
                e.preventDefault();
                userDropdown.classList.toggle('mostrar-dropdown');
            });

            document.addEventListener('click', (e) => {
                if (!liPadre.contains(e.target)) {
                    userDropdown.classList.remove('mostrar-dropdown');
                }
            });

            const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
            btnCerrarSesion.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('konopa_logeado', 'false');
                alert('Has cerrado sesión exitosamente. ¡Vuelve pronto!');
                window.location.href = '../index.html';
            });
        }
    }

    verificarSesionActiva();

    // ==========================================
    // VALIDACIÓN DEL LOGIN
    // ==========================================

    const btnLogin = document.querySelector('#btn-login');
    const inputUsuario = document.querySelector('#input-usuario');
    const inputClave = document.querySelector('#input-clave');

    if (btnLogin && inputUsuario && inputClave) {
        btnLogin.addEventListener('click', (evento) => {
            evento.preventDefault(); 

            if (inputUsuario.value === '' || inputClave.value === '') {
                alert('Por favor, completa correctamente ambos campos para ingresar.');
            } else {
                const correoRegistrado = localStorage.getItem('konopa_usuario_correo');
                const claveRegistrada = localStorage.getItem('konopa_usuario_clave');

                if (inputUsuario.value === correoRegistrado && inputClave.value === claveRegistrada) {
                    localStorage.setItem('konopa_logeado', 'true');
                    alert('¡Ingreso exitoso!');
                    window.location.href = '../index.html';
                    verificarSesionActiva();
                    
                } else {
                    alert('El correo o la contraseña no coinciden con ninguna cuenta registrada.');
                }
            }
        });
    }

    // ==========================================
    // VALIDACIÓN DE REGISTRO
    // ==========================================

    const btnRegistro = document.querySelector('#btn-registro');
    const inputRegNombre = document.querySelector('#reg-nombre');
    const inputRegTelefono = document.querySelector('#reg-telefono');
    const inputRegCorreo = document.querySelector('#reg-correo');
    const inputRegClave = document.querySelector('#reg-password');
    const inputRegDireccion = document.querySelector('#reg-direccion');

    if (btnRegistro && inputRegNombre && inputRegTelefono && inputRegCorreo && inputRegClave && inputRegDireccion) {
        btnRegistro.addEventListener('click', (evento) => {
            evento.preventDefault(); 

            if (inputRegNombre.value === '' || inputRegTelefono.value === '' || 
                inputRegCorreo.value === '' || inputRegClave.value === '' || inputRegDireccion.value === '') {
                
                alert('Por favor, completa todos los campos correctamente (incluyendo tu dirección) para registrarte en Konopa.');
            
            } else {

                localStorage.setItem('konopa_usuario_nombre', inputRegNombre.value);
                localStorage.setItem('konopa_usuario_telefono', inputRegTelefono.value);
                localStorage.setItem('konopa_usuario_correo', inputRegCorreo.value);
                localStorage.setItem('konopa_usuario_clave', inputRegClave.value);
                localStorage.setItem('konopa_usuario_direccion', inputRegDireccion.value);
                localStorage.setItem('konopa_logeado', 'false');

                alert(`¡Registro exitoso! Bienvenido a la familia Konopa, ${inputRegNombre.value}. Ya puedes iniciar sesión.`);
                
                window.location.reload();
                inputRegNombre.value = '';
                inputRegTelefono.value = '';
                inputRegCorreo.value = '';
                inputRegClave.value = '';
                inputRegDireccion.value = ''; 
                
            }
        });
    }
});