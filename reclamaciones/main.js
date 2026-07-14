document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. MENÚ RESPONSIVO
    // ==========================================
    const btnMenu = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (btnMenu && navMenu) {
        btnMenu.addEventListener('click', () => {
            navMenu.classList.toggle('mostrar');
        });
    }

    // ==========================================
    // 2. VALIDACIÓN, GUARDADO Y NOTIFICACIÓN DE RECLAMOS
    // ==========================================
    const btnEnviar = document.querySelector('.btn-submit');
    const formReclamaciones = document.querySelector('.reclamaciones-form');

    // Seleccionamos todos los campos requeridos
    const inputNombre = document.querySelector('#rec-nombre');
    const inputDni = document.querySelector('#rec-dni');
    const inputTelefono = document.querySelector('#rec-telefono');
    const inputCorreo = document.querySelector('#rec-correo');
    const inputDomicilio = document.querySelector('#rec-domicilio');
    const inputTipoBien = document.querySelector('#rec-tipo-bien');
    const inputMonto = document.querySelector('#rec-monto');
    const inputDetalle = document.querySelector('#rec-detalle');
    const inputPedido = document.querySelector('#rec-pedido');

   // ==========================================
    // AUTOCOMPLETAR DATOS DEL USUARIO (INCLUIDA DIRECCIÓN)
    // ==========================================
    const nombreGuardado = localStorage.getItem('konopa_usuario_nombre');
    const correoGuardado = localStorage.getItem('konopa_usuario_correo');
    const telefonoGuardado = localStorage.getItem('konopa_usuario_telefono');
    const direccionGuardada = localStorage.getItem('konopa_usuario_direccion');

    if (nombreGuardado && inputNombre) inputNombre.value = nombreGuardado;
    if (correoGuardado && inputCorreo) inputCorreo.value = correoGuardado;
    if (telefonoGuardado && inputTelefono) inputTelefono.value = telefonoGuardado;
    if (direccionGuardada && inputDomicilio) inputDomicilio.value = direccionGuardada;

    if (btnEnviar && formReclamaciones) {
        btnEnviar.addEventListener('click', (evento) => {

            // Detenemos el envío automático del navegador
            evento.preventDefault();

            // Verificamos si algún campo obligatorio está vacío
            if (inputNombre.value === '' || inputDni.value === '' ||
                inputTelefono.value === '' || inputCorreo.value === '' ||
                inputDomicilio.value === '' || inputTipoBien.value === '' ||
                inputMonto.value === '' || inputDetalle.value === '' ||
                inputPedido.value === '') {

                alert('Por favor, complete todos los campos obligatorios para registrar su reclamación.');

            } else {
                // 1. Verificamos si el usuario inició sesión
                const logeado = localStorage.getItem('konopa_logeado') === 'true';
                if (!logeado) {
                    alert("Por seguridad, debes iniciar sesión en tu cuenta para registrar un reclamo o queja.");
                    window.location.href = '../login/index.html';
                    return;
                }

                // 2. Obtenemos si es Queja o Reclamo desde los Radio Buttons
                const tipoSeleccionado = document.querySelector('input[name="rec_tipo"]:checked').value;

                // 3. Creamos el objeto del reclamo para guardarlo
                const nuevoReclamo = {
                    id: 'REC-' + Math.floor(Math.random() * 100000), // Genera código aleatorio
                    fecha: new Date().toLocaleDateString('es-PE'),
                    tipo: tipoSeleccionado,
                    detalle: inputDetalle.value,
                    estado: 'En Revisión'
                };

                // 4. Guardamos en localStorage
                const reclamosGuardados = JSON.parse(localStorage.getItem('konopa_reclamos')) || [];
                reclamosGuardados.push(nuevoReclamo);
                localStorage.setItem('konopa_reclamos', JSON.stringify(reclamosGuardados));

                // 5. Lanzamos la notificación de éxito
                alert(`Su hoja de reclamación ha sido registrada formalmente, ${inputNombre.value}. Su código de seguimiento es ${nuevoReclamo.id}.`);

                formReclamaciones.reset();

                // 6. Redirigimos al perfil para que vea su historial (Ajusta la ruta si es necesario)
                window.location.href = '../index.html';
            }
        });
    }

    // ==========================================================
    // 3. FUNCIÓN GLOBAL: Cambiar "Login" por Menú de Usuario
    // ==========================================================
    function verificarSesionActivaGlobal() {
        const sesionIniciada = localStorage.getItem('konopa_logeado');
        const nombreCompleto = localStorage.getItem('konopa_usuario_nombre');

        // Buscar el menú principal
        const navMenuUl = document.querySelector('.nav-menu ul');
        if (!navMenuUl) return;

        // Buscar el enlace de Login
        const enlaceLogin = Array.from(navMenuUl.querySelectorAll('a')).find(a => a.textContent.includes('Login'));

        if (sesionIniciada === 'true' && nombreCompleto && enlaceLogin) {
            const liPadre = enlaceLogin.parentElement;
            liPadre.classList.add('nav-user-item');

            liPadre.innerHTML = `
                <a href="#" id="btn-user-toggle"><i class="fa-regular fa-circle-user"></i> ${nombreCompleto} ▾</a>
                <ul class="dropdown-content" id="user-dropdown">
                    <li><a href="../perfil/index.html">Mi cuenta</a></li>
                    <li><a href="../perfil/index.html?seccion=pedidos">Mis pedidos</a></li>
                    <li><a href="../perfil/index.html?seccion=reclamos">Mis reclamos</a></li>
                    <li><a href="../perfil/index.html?seccion=reservas">Mis reservas</a></li>
                    <li><a href="#" id="btn-cerrar-sesion-top">Cerrar sesión</a></li>
                </ul>
            `;

            document.getElementById('btn-user-toggle').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById('user-dropdown').classList.toggle('mostrar-dropdown');
            });

            document.addEventListener('click', (e) => {
                const userDropdown = document.getElementById('user-dropdown');
                if (userDropdown && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('mostrar-dropdown');
                }
            });

            document.getElementById('btn-cerrar-sesion-top').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('konopa_logeado', 'false');
                window.location.reload();
            });
        }
    }

    // Ejecutar la función al cargar la página
    verificarSesionActivaGlobal();
});