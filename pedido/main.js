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
    // 3. RENDERIZAR PLATOS DE LA CARTA
    // ==========================================================
    if (contenedorCarta) {
        const categorias = [...new Set(productos.map(p => p.categoria))];
        
        categorias.forEach(cat => {
            const tituloFormateado = cat.toUpperCase();
            contenedorCarta.innerHTML += `<h3 class="region-title">${tituloFormateado}</h3>`;
            
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
                        <button class="btn-add-dish" onclick="agregarItem('${prod.nombre}', ${prod.precio})">
                            <i class="fa-solid fa-cart-plus"></i> Agregar
                        </button>
                    </div>
                `;
            });
            contenedorCarta.appendChild(gridDiv);
        });
    }

    // ==========================================================
    // 4. LÓGICA DEL CARRITO (Funciones Globales)
    // ==========================================================
    window.agregarItem = (nombre, precio) => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <span>${nombre}</span>
            <div>
                <span>S/. ${precio}</span>
                <button class="btn-remove-item" onclick="quitarItem(this, ${precio})"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
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
    // 5. MODAL DE PEDIDOS: MOSTRAR TICKET Y GUARDAR EN LOCALSTORAGE
    // ==========================================================
    const modalPedido = document.querySelector('#modal-pedido');
    const btnCerrarModalPedido = document.querySelector('#btn-cerrar-modal-pedido');
    const resumenPedidoDiv = document.querySelector('#datos-resumen-pedido');

    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            if (total > 0) {
                const items = document.querySelectorAll('#items-pedido .cart-item');
                let resumenHTML = '<ul style="list-style: none; padding: 0; margin: 0; color: #333; font-size: 0.95rem;">';
                const itemsParaGuardar = []; 
                
                // Recorrer carrito
                items.forEach(item => {
                    const nombrePlato = item.querySelector('span').textContent;
                    const precioPlato = item.querySelector('div span').textContent;
                    
                    resumenHTML += `
                        <li style="margin-bottom: 8px; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                            <strong>${nombrePlato}</strong> <span>${precioPlato}</span>
                        </li>`;
                    
                    itemsParaGuardar.push({ nombre: nombrePlato, precio: precioPlato });
                });
                
                resumenHTML += `</ul>`;
                resumenHTML += `
                    <div style="margin-top: 15px; padding-top: 10px; border-top: 2px dashed #ccc; text-align: right; font-size: 1.1rem; color: #c5a880;">
                        <strong>Total Pagado: S/. ${total.toFixed(2)}</strong>
                    </div>`;

                // Crear el objeto del pedido para guardar
                const nuevoPedido = {
                    id: 'PED-' + Math.floor(Math.random() * 1000000), 
                    fecha: new Date().toLocaleDateString('es-PE'),
                    hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
                    items: itemsParaGuardar,
                    total: total.toFixed(2),
                    estado: 'En preparación'
                };

                // Guardar en la "base de datos" del navegador
                const pedidosPrevios = JSON.parse(localStorage.getItem('konopa_pedidos')) || [];
                pedidosPrevios.push(nuevoPedido);
                localStorage.setItem('konopa_pedidos', JSON.stringify(pedidosPrevios));
                
                // Inyectar el HTML y abrir Modal
                if (resumenPedidoDiv) resumenPedidoDiv.innerHTML = resumenHTML;
                if (modalPedido) {
                    modalPedido.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }

                // Reiniciar el carrito
                if (itemsPedido) itemsPedido.innerHTML = '';
                total = 0;
                if (totalSpan) totalSpan.textContent = "0";

            } else {
                alert("Tu carrito está vacío. Por favor, selecciona al menos un plato de nuestra carta para continuar.");
            }
        });
    }

    // Cerrar Modal con la X o clic fuera
    if (btnCerrarModalPedido) {
        btnCerrarModalPedido.addEventListener('click', () => {
            if (modalPedido) {
                modalPedido.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    if (modalPedido) {
        window.addEventListener('click', (e) => {
            if (e.target === modalPedido) {
                modalPedido.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

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

    verificarSesionActivaGlobal();
});