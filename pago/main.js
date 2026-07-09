document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. MENÚ RESPONSIVO (Global)
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
    // 2. SEGURIDAD: VERIFICAR QUE ESTÉ LOGUEADO AL ENTRAR A PAGAR
    // ==========================================================
    if (localStorage.getItem('konopa_logeado') !== 'true') {
        alert("Acceso denegado. Debes iniciar sesión para realizar pagos.");
        window.location.href = "../login/index.html";
        return; // Detiene la ejecución del resto del código de pago
    }

    // ==========================================================
    // 3. CARGAR DATOS DEL USUARIO (Dirección y Nombre)
    // ==========================================================
    const direccionGuardada = localStorage.getItem('konopa_usuario_direccion');
    const nombreGuardado = localStorage.getItem('konopa_usuario_nombre');
    
    const displayDireccion = document.getElementById('display-direccion');
    const displayNombreTarjeta = document.getElementById('display-nombre-tarjeta');

    if (displayDireccion) {
        displayDireccion.textContent = direccionGuardada ? direccionGuardada : "Dirección no registrada";
    }
    if (displayNombreTarjeta) {
        displayNombreTarjeta.textContent = nombreGuardado ? nombreGuardado : "USUARIO";
    }

    // ==========================================================
    // 4. CARGAR EL ÚLTIMO PEDIDO PARA EL RESUMEN
    // ==========================================================
    const misPedidos = JSON.parse(localStorage.getItem('konopa_pedidos')) || [];
    const listaResumen = document.getElementById('lista-resumen-items');
    
    if (listaResumen) {
        if (misPedidos.length > 0) {
            // Tomamos el último pedido de la lista
            const ultimoPedido = misPedidos[misPedidos.length - 1]; 
            
            // Mostrar los platos en la lista
            let itemsHtml = '';
            ultimoPedido.items.forEach(item => {
                itemsHtml += `
                    <div class="summary-item-row">
                        <span style="flex:1;">1x ${item.nombre}</span>
                        <span>${item.precio}</span>
                    </div>
                `;
            });
            listaResumen.innerHTML = itemsHtml;

            // Actualizar los totales
            const costoProductos = document.getElementById('costo-productos');
            const costoTotal = document.getElementById('costo-total');
            
            if (costoProductos) costoProductos.textContent = `S/ ${ultimoPedido.total}`;
            if (costoTotal) costoTotal.textContent = `S/ ${ultimoPedido.total}`;
        } else {
            listaResumen.innerHTML = '<p>No hay pedidos pendientes.</p>';
        }
    }

    // ==========================================================
    // 5. LÓGICA DEL BOTÓN FINAL "HACER PEDIDO"
    // ==========================================================
    const btnProcesar = document.getElementById('btn-procesar-pago');
    if (btnProcesar) {
        btnProcesar.addEventListener('click', () => {
            alert("¡Pago procesado con éxito! Tu pedido está en camino a tu domicilio. Gracias por elegir Konopa.");
            // Una vez pagado, lo redirigimos a su perfil para que vea el estado
            window.location.href = "../perfil/index.html";
        });
    }

    // Lógica visual para seleccionar el método de pago (Efectivo o Tarjeta)
    const opcionesPago = document.querySelectorAll('.payment-option');
    opcionesPago.forEach(opcion => {
        opcion.addEventListener('click', function() {
            opcionesPago.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            const radioInput = this.querySelector('input[type="radio"]');
            if(radioInput) radioInput.checked = true;
        });
    });

    // ==========================================================
    // 6. FUNCIÓN GLOBAL: SESIÓN ACTIVA (REEMPLAZO DE LOGIN A PERFIL)
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
                <a href="#" id="btn-user-toggle"><i class="fa-regular fa-circle-user"></i> ${nombreCompleto} ▾</a>
                <ul class="dropdown-content" id="user-dropdown">
                    <li><a href="../perfil/index.html">Mi cuenta</a></li>
                    <li><a href="../perfil/index.html">Mis pedidos</a></li>
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

    // Ejecutamos la validación de la barra de navegación superior
    verificarSesionActivaGlobal();
});