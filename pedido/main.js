document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================
    // 1. MENÚ RESPONSIVO
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
    // 2. BASE DE DATOS (CARTA KONOPA)
    // ==========================================================
    const productos = [
        { categoria: "costa", nombre: "Ceviche Konopa", precio: 48, descripcion: "Cubos de pesca del día marinados al momento en jugo de limón de Chulucanas, ají limo, cebolla roja y culantro fresco. Acompañado de camote glaseado y choclo." },
        { categoria: "costa", nombre: "Lomo Saltado al Jugo", precio: 55, descripcion: "Finos trozos de lomo fino de res salteados al fuego vivo en wok de hierro con cebolla, tomates, ají amarillo y un toque de pisco. Servido con papas nativas y arroz." },
        { categoria: "sierra", nombre: "Pachamanca Tres Carnes", precio: 58, descripcion: "Carnes de res, cerdo y pollo maceradas en chincho, huacatay, muña y ajíes. Cocido a fuego lento con papas nativas, camotes, habas y humitas." },
        { categoria: "sierra", nombre: "Rocoto Relleno Arequipeño", precio: 42, descripcion: "Rocoto desvenado con toque picante, relleno de res picada a cuchillo, pasas, aceitunas y especias, cubierto de queso paria. Acompañado de pastel de papa." },
        { categoria: "selva", nombre: "Tacacho con Cecina", precio: 46, descripcion: "Plátano bellaco asado y majado con manteca y chicharrón. Servido junto a jugosos cortes de cecina ahumada de Tarapoto y salsa de cocona con charapita." },
        { categoria: "selva", nombre: "Juane Tradicional de Gallina", precio: 44, descripcion: "Arroz sazonado con palillo y especias amazónicas, moldeado con presa de gallina, huevos y aceitunas, envuelto en hojas de bijao y cocido al vapor." },
        { categoria: "brasas", nombre: "1 Pollo a la Brasa", precio: 80, descripcion: "Pollo entero dorado a la leña. Acompañado de porción familiar de papas fritas peruanas, ensalada clásica con vinagreta y todas nuestras cremas caseras." },
        { categoria: "brasas", nombre: "Chancho al Palo", precio: 55, descripcion: "Asado al aire libre frente al fuego vivo. Destaca por su sabor rústico a leña y una piel dorada extra crujiente. Con sarsa criolla." }
    ];

    const contenedorCarta = document.querySelector('#contenedor-carta');
    const itemsPedido = document.querySelector('#items-pedido');
    const totalSpan = document.querySelector('#total');
    const btnFinalizar = document.querySelector('#btn-finalizar');
    let total = 0;

    // ==========================================================
    // 3. RENDERIZAR PLATOS
    // ==========================================================
    if (contenedorCarta) {
        const categorias = [...new Set(productos.map(p => p.categoria))];
        categorias.forEach(cat => {
            contenedorCarta.innerHTML += `<h3 class="region-title">${cat.toUpperCase()}</h3>`;
            const gridDiv = document.createElement('div');
            gridDiv.className = 'dishes-grid';
            productos.filter(p => p.categoria === cat).forEach(prod => {
                gridDiv.innerHTML += `
                    <div class="dish-card">
                        <div class="dish-header">
                            <h4>${prod.nombre}</h4>
                            <span class="price">S/. ${prod.precio}</span>
                        </div>
                        <p class="description">${prod.descripcion}</p>
                        <button class="btn-add-dish" onclick="agregarItem('${prod.nombre}', ${prod.precio})">Agregar</button>
                    </div>
                `;
            });
            contenedorCarta.appendChild(gridDiv);
        });
    }

    // ==========================================================
    // 4. LÓGICA CARRITO
    // ==========================================================
    window.agregarItem = (nombre, precio) => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `<span>${nombre}</span> <div><span>S/. ${precio}</span> <button class="btn-remove-item" onclick="quitarItem(this, ${precio})">X</button></div>`;
        if (itemsPedido) itemsPedido.appendChild(li);
        total += precio;
        if (totalSpan) totalSpan.textContent = total;
    };

    window.quitarItem = (btn, precio) => {
        btn.closest('li').remove();
        total -= precio;
        if (totalSpan) totalSpan.textContent = Math.max(0, total);
    };

    // ==========================================================
    // 5. MODAL Y PAGO
    // ==========================================================
    const modalPedido = document.querySelector('#modal-pedido');
    const btnCerrar = document.querySelector('#btn-cerrar-modal-pedido');
    const resumenPedidoDiv = document.querySelector('#datos-resumen-pedido');
    const btnIrPagar = document.querySelector('#btn-ir-pagar');

    let pedidoActual = null; // Variable para sostener el pedido sin guardarlo aún

    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            if (total > 0) {
                const items = document.querySelectorAll('#items-pedido .cart-item');
                let resumenHTML = '';
                const itemsParaGuardar = [];

                items.forEach(item => {
                    // Seleccionamos estrictamente el primer elemento (nombre) y el último (precio)
                    const nombre = item.firstElementChild.textContent.trim();
                    const precioTexto = item.querySelector('div > span').textContent.trim();

                    // Diseño tipo ticket sin puntos negros
                    resumenHTML += `
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ddd; font-size: 0.95rem;">
                            <span>${nombre}</span>
                            <strong>${precioTexto}</strong>
                        </div>`;

                    itemsParaGuardar.push({ nombre: nombre, precio: precioTexto });
                });

                resumenHTML += `
                    <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 1.15rem; border-top: 2px solid #c5a880; padding-top: 10px;">
                        <strong>Total a Pagar:</strong>
                        <strong>S/. ${total.toFixed(2)}</strong>
                    </div>`;

                if (resumenPedidoDiv) resumenPedidoDiv.innerHTML = resumenHTML;

                // Preparamos el pedido temporalmente
                pedidoActual = {
                    id: 'PED-' + Math.floor(Math.random() * 1000000),
                    items: itemsParaGuardar,
                    total: total.toFixed(2),
                    fecha: new Date().toLocaleDateString('es-PE'),
                    hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
                };

                if (modalPedido) {
                    modalPedido.classList.add('mostrar');
                    document.body.style.overflow = 'hidden';
                }
            } else {
                alert("Tu carrito está vacío. Agrega al menos un plato.");
            }
        });
    }

    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            if (modalPedido) {
                modalPedido.classList.remove('mostrar');
                document.body.style.overflow = 'auto';
                pedidoActual = null; // Cancelamos el pedido
            }
        });
    }

    if (btnIrPagar) {
        btnIrPagar.addEventListener('click', () => {
            const sesionIniciada = localStorage.getItem('konopa_logeado') === 'true';

            if (!sesionIniciada) {
                alert("Para procesar tu pago y confirmar el envío, por favor inicia sesión o regístrate.");
                window.location.href = '../login/index.html';
            } else {
                // Como 'pedidoActual' fue declarado arriba, este botón sí puede leerlo sin que el código explote
                if (pedidoActual) {
                    localStorage.setItem('konopa_pedido_temporal', JSON.stringify(pedidoActual));
                }
                window.location.href = '../pago/index.html';
            }
        });
    }

    // ==========================================================
    // 6. FUNCIÓN GLOBAL: SESIÓN ACTIVA
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

    // Ejecutamos la función al final de todo
    verificarSesionActivaGlobal();
});