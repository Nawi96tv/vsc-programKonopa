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
    // 2. VALIDACIÓN Y NOTIFICACIÓN DE RECLAMACIONES
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
                // Si todo está lleno, lanzamos la notificación de éxito
                alert(`Su hoja de reclamación ha sido registrada formalmente, ${inputNombre.value}. Se enviará una copia y nuestra respuesta a su correo: ${inputCorreo.value}.`);

                // Un truco genial: form.reset() limpia automáticamente TODO el formulario de un solo golpe
                formReclamaciones.reset();
            }
        });
    }
    const formReclamos = document.getElementById('form-libro-reclamaciones');

    if (formReclamos) {
        formReclamos.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que la página recargue

            // 1. Verificamos si el usuario inició sesión
            const logeado = localStorage.getItem('konopa_logeado') === 'true';

            if (!logeado) {
                alert("Por seguridad, debes iniciar sesión en tu cuenta para registrar un reclamo o queja.");
                // Redirigimos al login (ajusta la ruta si es necesario)
                window.location.href = '../login/index.html';
                return;
            }

            // 2. Capturamos los datos (Asegúrate de ponerle estos IDs a los inputs de tu HTML)
            // Ejemplo: <textarea id="detalle-reclamo"></textarea>
            const inputTipo = document.getElementById('tipo-reclamo') ? document.getElementById('tipo-reclamo').value : 'Reclamo';
            const inputDetalle = document.getElementById('detalle-reclamo') ? document.getElementById('detalle-reclamo').value : 'Sin detalles';

            // 3. Creamos el objeto del reclamo
            const nuevoReclamo = {
                id: 'REC-' + Math.floor(Math.random() * 100000), // Genera un código como REC-84932
                fecha: new Date().toLocaleDateString('es-PE'),
                tipo: inputTipo,
                detalle: inputDetalle,
                estado: 'En Revisión' // Estado inicial por defecto
            };

            // 4. Guardamos el reclamo en el LocalStorage
            const reclamosGuardados = JSON.parse(localStorage.getItem('konopa_reclamos')) || [];
            reclamosGuardados.push(nuevoReclamo);
            localStorage.setItem('konopa_reclamos', JSON.stringify(reclamosGuardados));

            // 5. Limpiamos y avisamos
            formReclamos.reset();
            alert("Tu solicitud ha sido registrada con el código " + nuevoReclamo.id + ". Serás redirigido a tu perfil.");

            // 6. Lo mandamos a su perfil para que vea que sí se guardó
            window.location.href = '../perfil/index.html';
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