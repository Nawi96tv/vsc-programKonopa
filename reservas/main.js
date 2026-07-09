document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 0. MENÚ RESPONSIVO (NUEVO MOTOR JS)
    // ==========================================
    const btnMenu = document.querySelector('#btn-menu');
    // Seleccionamos la etiqueta <nav> usando su clase original
    const navMenu = document.querySelector('.nav-menu');

    if (btnMenu && navMenu) {
        btnMenu.addEventListener('click', () => {
            // "Prende o apaga" la visualización de los enlaces
            navMenu.classList.toggle('mostrar');
            // "Prende o apaga" el ícono de la X
            btnMenu.classList.toggle('activo');
        });
    }

    // 2. VENTANA FLOTANTE / MODAL PARA FORMULARIOS
    const btnEnviar = document.getElementById('btn-enviar-formulario');
    const modal = document.getElementById('modal-confirmacion');
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    const resumenDiv = document.getElementById('datos-resumen');

    if (btnEnviar) {
        btnEnviar.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. CAPTURAR ELEMENTOS EXACTOS DEL HTML (Usando tus IDs reales)
            const inputNombre = document.getElementById('res-nombre');
            const inputCorreo = document.getElementById('res-correo');
            const inputTelefono = document.getElementById('res-telefono');
            const inputSede = document.getElementById('res-sede');
            const inputFecha = document.getElementById('res-fecha');
            const inputHora = document.getElementById('res-hora');
            const inputPersonas = document.getElementById('res-personas');
            const inputNotas = document.getElementById('res-notas');

            // 2. VALIDACIÓN ESTRICTA (Las notas son opcionales, así que no las validamos)
            if (!inputNombre.value || !inputCorreo.value || !inputTelefono.value ||
                !inputSede.value || !inputFecha.value || !inputHora.value || !inputPersonas.value) {

                alert("¡Atención! Por favor completa todos los campos obligatorios (*) antes de confirmar tu reserva.");
                return; // Bloquea el proceso, no abre el modal
            }

            // 3. EXTRAER LOS TEXTOS BONITOS DE LOS SELECTS Y LAS NOTAS
            const textoSede = inputSede.options[inputSede.selectedIndex].text;
            const textoHora = inputHora.options[inputHora.selectedIndex].text;
            const textoNotas = inputNotas.value ? inputNotas.value : "Ninguna";

            // 4. INYECTAR LOS DATOS CAPTURADOS
            if (resumenDiv) {
                resumenDiv.innerHTML = `
                    <ul style="list-style: none; padding: 0; margin: 0; color: #333; font-size: 0.95rem;">
                        <li style="margin-bottom: 8px;"><strong>Cliente:</strong> ${inputNombre.value}</li>
                        <li style="margin-bottom: 8px;"><strong>Correo:</strong> ${inputCorreo.value}</li>
                        <li style="margin-bottom: 8px;"><strong>Teléfono:</strong> ${inputTelefono.value}</li>
                        <li style="margin-bottom: 8px;"><strong>Sede:</strong> ${textoSede}</li>
                        <li style="margin-bottom: 8px;"><strong>Fecha:</strong> ${inputFecha.value}</li>
                        <li style="margin-bottom: 8px;"><strong>Hora:</strong> ${textoHora}</li>
                        <li style="margin-bottom: 8px;"><strong>Personas:</strong> ${inputPersonas.value}</li>
                        <li style="margin-bottom: 8px;"><strong>Notas:</strong> ${textoNotas}</li>
                    </ul>
                `;
            }

            // 5. MOSTRAR EL MODAL
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // 6. CERRAR EL MODAL CON LA "X"
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    // ==========================================================
    // FUNCIÓN GLOBAL: Cambiar "Login" por Menú de Usuario
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

            // Inyectamos el HTML del menú desplegable
            // NOTA: Ajusta los "../perfil/index.html" si estás en la raíz del proyecto a "./perfil/index.html"
            liPadre.innerHTML = `
                <a href="#" id="btn-user-toggle"><i class="fa-regular fa-circle-user"></i> ${nombreCompleto} ▾</a>
                <ul class="dropdown-content" id="user-dropdown">
                    <li><a href="../perfil/index.html">Mi cuenta</a></li>
                    <li><a href="../perfil/index.html">Mis pedidos</a></li>
                    <li><a href="#" id="btn-cerrar-sesion-top">Cerrar sesión</a></li>
                </ul>
            `;

            // Lógica para abrir y cerrar el menú al hacer clic en el nombre
            document.getElementById('btn-user-toggle').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Evita que el clic se propague al documento
                document.getElementById('user-dropdown').classList.toggle('mostrar-dropdown');
            });

            // Lógica para cerrar el menú si haces clic en otra parte de la pantalla
            document.addEventListener('click', (e) => {
                const userDropdown = document.getElementById('user-dropdown');
                if (userDropdown && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('mostrar-dropdown');
                }
            });

            // Lógica para Cerrar Sesión desde este menú
            document.getElementById('btn-cerrar-sesion-top').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('konopa_logeado', 'false');
                window.location.reload(); // Recarga la página para volver a mostrar "Login"
            });
        }
    }

    // Ejecutar la función al cargar la página
    verificarSesionActivaGlobal();
});