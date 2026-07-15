document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. MENÚ RESPONSIVO
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
    // 2. LÓGICA DE RESERVAS (Formulario -> Modal -> Guardado)
    // ==========================================

    const btnEnviar = document.getElementById('btn-enviar-formulario');
    const btnGuardarFinal = document.getElementById('btn-guardar-reserva-final');
    const modal = document.getElementById('modal-confirmacion');
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    const resumenDiv = document.getElementById('datos-resumen');

    // Captura de elementos del formulario
    const inputNombre = document.getElementById('res-nombre');
    const inputCorreo = document.getElementById('res-correo');
    const inputTelefono = document.getElementById('res-telefono');
    const inputSede = document.getElementById('res-sede');
    const inputHora = document.getElementById('res-hora');
    const inputPersonas = document.getElementById('res-personas');
    const inputNotas = document.getElementById('res-notas');
    const inputFecha = document.getElementById('res-fecha');

    if (inputFecha) {
        const hoy = new Date();
        const offset = hoy.getTimezoneOffset();
        const fechaLocal = new Date(hoy.getTime() - (offset * 60 * 1000));
        const fechaMinima = fechaLocal.toISOString().split('T')[0];

        inputFecha.min = fechaMinima;

        inputFecha.addEventListener('input', () => {
            const fechaSeleccionada = new Date(inputFecha.value);
            const diaActual = new Date();
            diaActual.setHours(0, 0, 0, 0);

            if (inputFecha.value && fechaSeleccionada < diaActual) {
                inputFecha.classList.add('input-invalido');
                inputFecha.classList.remove('input-valido');
            } else if (inputFecha.value) {
                inputFecha.classList.add('input-valido');
                inputFecha.classList.remove('input-invalido');
            } else {
                inputFecha.classList.remove('input-valido', 'input-invalido');
            }
        });
    }

    if (btnEnviar) {
        btnEnviar.addEventListener('click', (e) => {
            e.preventDefault();

            if (!inputNombre.value || !inputCorreo.value || !inputTelefono.value ||
                !inputSede.value || !inputFecha.value || !inputHora.value || !inputPersonas.value) {
                alert("¡Por favor completa todos los campos!");
                return;
            }

            const cantidadPersonas = Number(inputPersonas.value);


            if (isNaN(cantidadPersonas) || cantidadPersonas < 1 || cantidadPersonas > 12 || !Number.isInteger(cantidadPersonas)) {
                alert("Error: El número de personas debe ser un número entero entre 1 y 12.");
                return;
            }

            const textoSede = inputSede.options[inputSede.selectedIndex].text;
            const textoHora = inputHora.options[inputHora.selectedIndex].text;
            const textoNotas = inputNotas.value ? inputNotas.value : "Ninguna";

            if (resumenDiv) {
                resumenDiv.innerHTML = `
                    <ul style="list-style: none; padding: 0; margin: 0; color: #333; font-size: 0.95rem;">
                        <li style="margin-bottom: 8px;"><strong>Cliente:</strong> ${inputNombre.value}</li>
                        <li style="margin-bottom: 8px;"><strong>Sede:</strong> ${textoSede}</li>
                        <li style="margin-bottom: 8px;"><strong>Fecha:</strong> ${inputFecha.value}</li>
                        <li style="margin-bottom: 8px;"><strong>Hora:</strong> ${textoHora}</li>
                        <li style="margin-bottom: 8px;"><strong>Personas:</strong> ${cantidadPersonas}</li>
                        <li style="margin-bottom: 8px;"><strong>Notas:</strong> ${textoNotas}</li>
                    </ul>
                `;
            }

            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }

    if (btnGuardarFinal) {
        btnGuardarFinal.addEventListener('click', () => {
            const logeado = localStorage.getItem('konopa_logeado') === 'true';
            if (!logeado) {
                alert("Debes iniciar sesión para realizar una reserva.");
                window.location.href = '../login/index.html';
                return;
            }

            const nuevaReserva = {
                id: 'RES-' + Math.floor(Math.random() * 10000),
                fecha: inputFecha.value,
                hora: inputHora.options[inputHora.selectedIndex].text,
                personas: inputPersonas.value,
                notas: inputNotas.value,
                estado: 'Confirmada'
            };

            const reservasGuardadas = JSON.parse(localStorage.getItem('konopa_reservas')) || [];
            reservasGuardadas.push(nuevaReserva);
            localStorage.setItem('konopa_reservas', JSON.stringify(reservasGuardadas));

            alert(`¡Reserva confirmada! Código: ${nuevaReserva.id}`);
            window.location.href = '../perfil/index.html?seccion=reservas';
        });
    }

    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ==========================================================
    // 3. VERIFICACIÓN DE SESIÓN ACTIVA GLOBAL
    // ==========================================================

    function verificarSesionActivaGlobal() {
        const sesionIniciada = localStorage.getItem('konopa_logeado');
        const nombreCompleto = localStorage.getItem('konopa_usuario_nombre');
        const navMenuUl = document.querySelector('.nav-menu ul');

        if (!navMenuUl) return;

        const enlaceLogin = Array.from(navMenuUl.querySelectorAll('a')).find(a => a.textContent.includes('Login'));

        if (sesionIniciada === 'true' && nombreCompleto && enlaceLogin) {
            const liPadre = enlaceLogin.parentElement;
            liPadre.classList.add('nav-user-item');

            liPadre.innerHTML = `
                <a href="#" id="btn-user-toggle">
                    <i class="fa-regular fa-circle-user"></i> ${nombreCompleto.split(' ')[0]} <i class="fa-solid fa-chevron-down icon-chevron"></i></a>
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
    verificarSesionActivaGlobal();
});