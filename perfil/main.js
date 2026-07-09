document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. MENÚ RESPONSIVO (Navegación Móvil)
    // ==========================================================
    const btnMenu = document.querySelector('#btn-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (btnMenu && navMenu) {
        btnMenu.addEventListener('click', () => {
            navMenu.classList.toggle('mostrar');
            btnMenu.classList.toggle('activo');
        });
    }

    // ==========================================================
    // 2. FUNCIÓN GLOBAL: Cambiar "Login" por Nombre de Usuario
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

    // ==========================================================
    // 3. LÓGICA DEL PERFIL (Pestañas y Datos)
    // ==========================================================
    const sesionIniciada = localStorage.getItem('konopa_logeado');
    const nombreGuardado = localStorage.getItem('konopa_usuario_nombre');

    if (sesionIniciada === 'true' && nombreGuardado) {
        // Llenar campos
        document.getElementById('nombre-perfil-sidebar').textContent = nombreGuardado;
        document.getElementById('avatar-inicial').textContent = nombreGuardado.charAt(0).toUpperCase();
        document.getElementById('perfil-nombre').value = nombreGuardado;
        document.getElementById('perfil-telefono').value = localStorage.getItem('konopa_usuario_telefono') || '';
        document.getElementById('perfil-correo').value = localStorage.getItem('konopa_usuario_correo') || '';
        document.getElementById('perfil-direccion').value = localStorage.getItem('konopa_usuario_direccion') || '';

        // Intercambiar pestañas
        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.menu-link').forEach(l => l.classList.remove('activo'));
                document.querySelectorAll('.perfil-contenido').forEach(s => s.style.display = 'none');

                link.classList.add('activo');
                document.getElementById(link.getAttribute('data-target')).style.display = 'block';
            });
        });
    } else {
        alert("Debes iniciar sesión para ver tu perfil.");
        window.location.href = "../login/index.html";
    }

    // ==========================================================
    // 4. ACCIONES (Actualizar, Eliminar, Cerrar Sesión)
    // ==========================================================

    // Botón Actualizar
    const btnActualizar = document.getElementById('btn-actualizar-datos');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', () => {
            localStorage.setItem('konopa_usuario_nombre', document.getElementById('perfil-nombre').value);
            localStorage.setItem('konopa_usuario_telefono', document.getElementById('perfil-telefono').value);
            localStorage.setItem('konopa_usuario_direccion', document.getElementById('perfil-direccion').value);

            document.getElementById('nombre-perfil-sidebar').textContent = document.getElementById('perfil-nombre').value.split(' ')[0];
            alert('Datos actualizados.');
        });
    }

    // Botón Eliminar
    const btnEliminar = document.getElementById('btn-eliminar-cuenta');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            if (confirm('¿Seguro que deseas eliminar tu cuenta?')) {
                localStorage.clear();
                window.location.href = "../index.html";
            }
        });
    }

    // Botón Cerrar Sesión (Protegido por si no existe)
    const btnCerrarSesionPerfil = document.getElementById('btn-cerrar-sesion-perfil');
    if (btnCerrarSesionPerfil) {
        btnCerrarSesionPerfil.addEventListener('click', () => {
            localStorage.setItem('konopa_logeado', 'false');
            window.location.href = "../index.html";
        });
    }

    // ==========================================================
    // 5. MOSTRAR PEDIDOS GUARDADOS
    // ==========================================================
    const contenedorPedidos = document.getElementById('lista-mis-pedidos');
    const mensajeVacio = document.getElementById('historial-pedidos'); // El div que dice "No tienes pedidos"

    if (contenedorPedidos) {
        const misPedidos = JSON.parse(localStorage.getItem('konopa_pedidos')) || [];

        if (misPedidos.length === 0) {
            // Si no hay pedidos, nos aseguramos de que el mensaje vacío sea visible
            if (mensajeVacio) mensajeVacio.style.display = 'block';
        } else {
            // Si SÍ hay pedidos, ocultamos el mensaje de "vació"
            if (mensajeVacio) mensajeVacio.style.display = 'none';

            let htmlPedidos = '';

            misPedidos.reverse().forEach(pedido => {
                htmlPedidos += `
                    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px; background: #fff;">
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                            <strong>Código: ${pedido.id}</strong>
                            <span style="color: #888; font-size: 0.9em;">${pedido.fecha} - ${pedido.hora}</span>
                        </div>
                        <ul style="list-style: none; padding: 0; margin: 0 0 10px 0; font-size: 0.9em;">
                            ${pedido.items.map(item => `<li>• ${item.nombre} <span style="float: right;">${item.precio}</span></li>`).join('')}
                        </ul>
                        <div style="text-align: right; color: #c5a880; font-weight: bold; font-size: 1.1em;">
                            Total: S/. ${pedido.total}
                        </div>
                    </div>
                `;
            });

            contenedorPedidos.innerHTML = htmlPedidos;
        }
    }
});
