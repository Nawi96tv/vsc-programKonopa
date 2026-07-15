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
    const inputNombre = document.querySelector('#rec-nombre');
    const inputDni = document.querySelector('#rec-dni');
    const inputTelefono = document.querySelector('#rec-telefono');
    const inputCorreo = document.querySelector('#rec-correo');
    const inputDomicilio = document.querySelector('#rec-domicilio');
    const inputTipoBien = document.querySelector('#rec-tipo-bien');
    const inputMonto = document.querySelector('#rec-monto');
    const inputDetalle = document.querySelector('#rec-detalle');
    const inputPedido = document.querySelector('#rec-pedido');

    if (inputMonto) {
        inputMonto.addEventListener('input', function (e) {
            let valor = e.target.value;

            if (valor.length > 1 && valor.startsWith('0') && valor[1] !== '.') {
                e.target.value = valor.replace(/^0+/, '');
            }
        });
    }

    if (btnEnviar && formReclamaciones) {
        btnEnviar.addEventListener('click', (evento) => {
            evento.preventDefault();

            if (inputNombre.value === '' || inputDni.value === '' ||
                inputTelefono.value === '' || inputCorreo.value === '' ||
                inputDomicilio.value === '' || inputTipoBien.value === '' ||
                inputMonto.value === '' || inputDetalle.value === '' ||
                inputPedido.value === '') {

                alert('Por favor, complete todos los campos obligatorios para registrar su reclamación.');
                return;
            }

            const logeado = localStorage.getItem('konopa_logeado') === 'true';

            if (!logeado) {
                alert("Por seguridad, debes iniciar sesión en tu cuenta para registrar un reclamo o queja.");
                window.location.href = '../login/index.html';
                return;
            }

            const tipoSeleccionado = document.querySelector('input[name="rec_tipo"]:checked').value;

            const nuevoReclamo = {
                id: 'REC-' + Math.floor(Math.random() * 100000),
                fecha: new Date().toLocaleDateString('es-PE'),
                tipo: tipoSeleccionado,
                monto: Number(inputMonto.value).toFixed(2),
                detalle: inputDetalle.value,
                estado: 'En Revisión'
            };

            const reclamosGuardados = JSON.parse(localStorage.getItem('konopa_reclamos')) || [];
            reclamosGuardados.push(nuevoReclamo);
            localStorage.setItem('konopa_reclamos', JSON.stringify(reclamosGuardados));

            alert(`Su hoja de reclamación ha sido registrada formalmente, ${inputNombre.value}. Su código de seguimiento es ${nuevoReclamo.id}.`);
            formReclamaciones.reset();
            window.location.href = '../index.html';

        });
    }

    // ==========================================================
    // 3. VERIFICACIÓN DE SESIÓN ACTIVA GLOBAL
    // ==========================================================

    function verificarSesionActivaGlobal() {
        const sesionIniciada = localStorage.getItem('konopa_logeado');
        const nombreCompleto = localStorage.getItem('konopa_usuario_nombre');

        // Buscar el menú principal
        const navMenuUl = document.querySelector('.nav-menu ul');
        if (!navMenuUl) return;

        const enlaceLogin = Array.from(navMenuUl.querySelectorAll('a')).find(a => a.textContent.includes('Login'));

        if (sesionIniciada === 'true' && nombreCompleto && enlaceLogin) {
            const liPadre = enlaceLogin.parentElement;
            liPadre.classList.add('nav-user-item');

            liPadre.innerHTML = `
                <a href="#" id="btn-user-toggle"><i class="fa-regular fa-circle-user"></i> ${nombreCompleto.split(' ')[0]}
                <i class="fa-solid fa-chevron-down icon-chevron"></i></a>
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