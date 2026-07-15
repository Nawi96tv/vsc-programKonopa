document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================
    // 1. MENÚ RESPONSIVO Y SESIÓN EN EL HEADER
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
    // 2. SEGURIDAD: VERIFICAR SESIÓN
    // ==========================================================
    if (localStorage.getItem('konopa_logeado') !== 'true') {
        alert("Acceso denegado. Debes iniciar sesión para realizar pagos.");
        window.location.href = "../login/index.html";
        return; // Detiene la ejecución para proteger la página
    }

    // ==========================================================
    // 3. CARGAR DATOS DEL USUARIO (Dirección y Nombre)
    // ==========================================================
    const direccionGuardada = localStorage.getItem('konopa_usuario_direccion');
    const nombreGuardado = localStorage.getItem('konopa_usuario_nombre');

    const displayDireccion = document.getElementById('display-direccion');
    const displayNombre = document.getElementById('display-nombre-tarjeta');

    if (displayDireccion) {
        displayDireccion.textContent = direccionGuardada ? direccionGuardada : "Dirección no registrada";
    }
    if (displayNombre) {
        displayNombre.textContent = nombreGuardado ? nombreGuardado : "USUARIO";
    }

    // 2. CARGA DE TARJETAS (Lo que necesitábamos para que aparezcan)
    const contenedorPagoTarjetas = document.getElementById('contenedor-pago-tarjetas');

    if (contenedorPagoTarjetas) {
        const tarjetas = JSON.parse(localStorage.getItem('konopa_tarjetas')) || [];

        if (tarjetas.length === 0) {
            contenedorPagoTarjetas.innerHTML = '<p>No tienes tarjetas guardadas. <a href="../perfil/index.html?seccion=pagos">Añadir una aquí</a></p>';
        } else {
            let html = '';
            tarjetas.forEach((tarjeta, index) => {
                const ultimos4 = tarjeta.numero.slice(-4);
                html += `
                    <div class="tarjeta-opcion">
                        <input type="radio" name="metodo-pago" id="tarjeta-${index}" value="${index}">
                        <label for="tarjeta-${index}">
                            <i class="fa-brands fa-cc-visa"></i> **** **** **** ${ultimos4} - ${tarjeta.titular}
                        </label>
                    </div>
                `;
            });
            contenedorPagoTarjetas.innerHTML = html;
        }
    }


    // ==========================================================
    // 4. CARGAR EL PEDIDO TEMPORAL Y CALCULAR TOTALES
    // ==========================================================
    const pedidoTemporalStr = localStorage.getItem('konopa_pedido_temporal');
    const listaResumen = document.getElementById('lista-resumen-items');
    let pedidoPendiente = null;

    if (listaResumen && pedidoTemporalStr) {
        pedidoPendiente = JSON.parse(pedidoTemporalStr);

        let itemsHtml = '';
        pedidoPendiente.items.forEach(item => {
            // Diseño para la lista de resumen (1x Nombre ----- Precio)
            itemsHtml += `
                <div>
                    <span>1x ${item.nombre}</span>
                    <span>${item.precio}</span>
                </div>
            `;
        });
        listaResumen.innerHTML = itemsHtml;

        const totalPlatos = parseFloat(pedidoPendiente.total);
        const costoEnvio = 5.00;
        const totalConEnvio = (totalPlatos + costoEnvio).toFixed(2);

        pedidoPendiente.total = totalConEnvio;

        const domCostoProductos = document.getElementById('costo-productos');
        const domCostoTotal = document.getElementById('costo-total');

        if (domCostoProductos) domCostoProductos.textContent = `S/ ${totalPlatos.toFixed(2)}`;
        if (domCostoTotal) domCostoTotal.textContent = `S/ ${totalConEnvio}`;
    } else if (listaResumen) {
        listaResumen.innerHTML = '<p>No hay pedidos pendientes para pagar.</p>';
    }

    // ==========================================================
    // 5. LÓGICA DEL BOTÓN FINAL "HACER PEDIDO"
    // ==========================================================
    const btnProcesar = document.getElementById('btn-procesar-pago');

    if (btnProcesar) {
        btnProcesar.addEventListener('click', () => {
            if (pedidoPendiente) {

                const misPedidos = JSON.parse(localStorage.getItem('konopa_pedidos')) || [];
                misPedidos.push(pedidoPendiente);
                localStorage.setItem('konopa_pedidos', JSON.stringify(misPedidos));

                localStorage.removeItem('konopa_pedido_temporal');

                alert("¡Pago procesado con éxito! Tu pedido está en camino a tu domicilio.");
                window.location.href = "../index.html";
            } else {
                alert("No tienes ningún pedido pendiente por pagar.");
            }
        });
    }

    // ==========================================================
    // 6. Verificar sesión activa y actualizar menú de navegación
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
                <a href="#" id="btn-user-toggle"><i class="fa-regular fa-circle-user"></i> ${nombreCompleto.split(' ')[0]} <i class="fa-solid fa-chevron-down icon-chevron"></i></a>
                <ul class="dropdown-content" id="user-dropdown">
                    <li><a href="../perfil/index.html">Mi cuenta</a></li>
                    <li><a href="../perfil/index.html?seccion=pedidos">Mis pedidos</a></li>
                    <li><a href="../perfil/index.html?seccion=reclamos">Mis reclamos</a></li>
                    <li><a href="../perfil/index.html?seccion=reservas">Mis reservas</a></li>
                    <li><a href="#" id="btn-cerrar-sesion-top">Cerrar sesión</a></li>
                </ul>
            `;

            const btnToggle = document.getElementById('btn-user-toggle');
            const dropdown = document.getElementById('user-dropdown');

            if (btnToggle && dropdown) {
                btnToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('mostrar-dropdown');
                });

                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target)) {
                        dropdown.classList.remove('mostrar-dropdown');
                    }
                });
            }

            const btnCerrarSesion = document.getElementById('btn-cerrar-sesion-top');
            if (btnCerrarSesion) {
                btnCerrarSesion.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.setItem('konopa_logeado', 'false');
                    window.location.href = '../login/index.html'; // Lo sacamos del pago al cerrar sesión
                });
            }
        }
    }

    verificarSesionActivaGlobal();
});