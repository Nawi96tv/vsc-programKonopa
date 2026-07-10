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

        // Redirección automática si viene de la página de pago
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('seccion') === 'pedidos') {
            const btnUltimosPedidos = document.querySelector('.menu-link[data-target="sec-pedidos"]');
            if (btnUltimosPedidos) btnUltimosPedidos.click();
        }

    } else {
        alert("Debes iniciar sesión para ver tu perfil.");
        window.location.href = "../login/index.html";
    }

    // ==========================================================
    // 4. ACCIONES (Actualizar, Eliminar, Cerrar Sesión)
    // ==========================================================
    const btnActualizar = document.getElementById('btn-actualizar-datos');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', () => {
            localStorage.setItem('konopa_usuario_nombre', document.getElementById('perfil-nombre').value);
            localStorage.setItem('konopa_usuario_telefono', document.getElementById('perfil-telefono').value);
            localStorage.setItem('konopa_usuario_direccion', document.getElementById('perfil-direccion').value);

            document.getElementById('nombre-perfil-sidebar').textContent = document.getElementById('perfil-nombre').value.split(' ')[0];

            // Actualizar el header también
            const btnUserToggle = document.getElementById('btn-user-toggle');
            if (btnUserToggle) {
                btnUserToggle.innerHTML = `<i class="fa-regular fa-circle-user"></i> ${document.getElementById('perfil-nombre').value} ▾`;
            }

            alert('Datos actualizados.');
        });
    }

    const btnEliminar = document.getElementById('btn-eliminar-cuenta');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            if (confirm('¿Seguro que deseas eliminar tu cuenta?')) {
                localStorage.clear();
                window.location.href = "../index.html";
            }
        });
    }

    const btnCerrarSesionPerfil = document.getElementById('btn-cerrar-sesion-perfil');
    if (btnCerrarSesionPerfil) {
        btnCerrarSesionPerfil.addEventListener('click', () => {
            localStorage.setItem('konopa_logeado', 'false');
            window.location.href = "../index.html";
        });
    }

    // ==========================================================
    // 5. MOSTRAR PEDIDOS GUARDADOS (CON EL CSS NUEVO)
    // ==========================================================
    const contenedorPedidos = document.getElementById('lista-mis-pedidos');
    const mensajeVacio = document.getElementById('historial-pedidos');

    if (contenedorPedidos) {
        const misPedidos = JSON.parse(localStorage.getItem('konopa_pedidos')) || [];

        if (misPedidos.length === 0) {
            if (mensajeVacio) mensajeVacio.style.display = 'block';
        } else {
            if (mensajeVacio) mensajeVacio.style.display = 'none';
            contenedorPedidos.innerHTML = ''; // Limpiamos

            const pedidosRecientes = [...misPedidos].reverse();
            const fechasUnicas = [...new Set(pedidosRecientes.map(p => p.fecha))];

            fechasUnicas.forEach(fecha => {
                contenedorPedidos.innerHTML += `<h4 class="titulo-fecha-pedidos">Pedidos del ${fecha}</h4>`;
                const gridDiv = document.createElement('div');
                gridDiv.className = 'grid-tarjetas-pedidos';

                pedidosRecientes.filter(p => p.fecha === fecha).forEach(pedido => {
                    let listaPlatos = '';
                    pedido.items.forEach(item => {
                        listaPlatos += `<div class="fila-plato-historial"><span>1x ${item.nombre}</span></div>`;
                    });

                    gridDiv.innerHTML += `
                        <div class="tarjeta-historial-box">
                            <div class="tarjeta-historial-header">
                                <strong class="id-pedido"><i class="fa-solid fa-bag-shopping"></i> ${pedido.id}</strong>
                                <span class="total-pedido">S/. ${pedido.total}</span>
                            </div>
                            <p class="hora-pedido">Hora: ${pedido.hora}</p>
                            <div class="lista-platos-pedido">
                                ${listaPlatos}
                            </div>
                            <span class="badge-estado-proceso"><i class="fa-solid fa-clock"></i> En proceso</span>
                        </div>
                    `;
                });
                contenedorPedidos.appendChild(gridDiv);
            });
        }
    }

    // ==========================================================
    // 6. LÓGICA DEL MODAL DE TARJETAS Y MÉTODOS DE PAGO
    // ==========================================================
    const modalTarjeta = document.getElementById('modal-tarjeta');
    const btnAbrirModal = document.getElementById('btn-abrir-modal-tarjeta');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const formTarjeta = document.getElementById('form-nueva-tarjeta');
    const contenedorTarjetas = document.getElementById('contenedor-tarjetas');

    function renderizarTarjetas() {
        if (!contenedorTarjetas) return;
        const tarjetasGuardadas = JSON.parse(localStorage.getItem('konopa_tarjetas')) || [];

        if (tarjetasGuardadas.length === 0) {
            contenedorTarjetas.innerHTML = `
                <div style="text-align: center; padding: 1rem 0;">
                    <i class="fa-regular fa-credit-card" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p style="color: #666;">Aún no tienes tarjetas guardadas.</p>
                </div>
            `;
        } else {
            let html = '';
            tarjetasGuardadas.forEach(tarjeta => {
                const ultimos4 = tarjeta.numero.slice(-4);
                html += `
                    <div class="tarjeta-guardada-box">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <i class="fa-brands fa-cc-visa" style="font-size: 2rem; color: #1a1f71;"></i>
                            <div>
                                <strong style="display: block; font-size: 1.1rem; color: #111;">**** **** **** ${ultimos4}</strong>
                                <span style="font-size: 0.85rem; color: #666;">${tarjeta.titular} - Exp: ${tarjeta.exp}</span>
                            </div>
                        </div>
                        <button class="btn-eliminar-tarjeta" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 1.2rem;" title="Eliminar tarjeta">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
            });
            contenedorTarjetas.innerHTML = html;
        }
    }

    renderizarTarjetas();

    if (btnAbrirModal && modalTarjeta) {
        btnAbrirModal.addEventListener('click', () => {
            modalTarjeta.classList.add('mostrar-modal');
        });
    }

    if (btnCerrarModal && modalTarjeta) {
        btnCerrarModal.addEventListener('click', () => {
            modalTarjeta.classList.remove('mostrar-modal');
        });
    }

    if (modalTarjeta) {
        modalTarjeta.addEventListener('click', (e) => {
            if (e.target === modalTarjeta) {
                modalTarjeta.classList.remove('mostrar-modal');
            }
        });
    }

    if (formTarjeta) {
        formTarjeta.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputNum = document.getElementById('input-num-tarjeta').value;
            const inputNom = document.getElementById('input-nom-titular').value;
            const inputExp = document.getElementById('input-exp-tarjeta').value;

            const nuevaTarjeta = {
                numero: inputNum,
                titular: inputNom.toUpperCase(),
                exp: inputExp
            };

            const tarjetas = JSON.parse(localStorage.getItem('konopa_tarjetas')) || [];
            tarjetas.push(nuevaTarjeta);
            localStorage.setItem('konopa_tarjetas', JSON.stringify(tarjetas));

            formTarjeta.reset();
            modalTarjeta.classList.remove('mostrar-modal');
            renderizarTarjetas();

            alert("Tarjeta agregada exitosamente.");
        });
    }

    // ==========================================================
    // 7. DIBUJAR RECLAMOS GUARDADOS
    // ==========================================================
    const contenedorMisReclamos = document.getElementById('contenedor-mis-reclamos');

    function renderizarReclamos() {
        if (!contenedorMisReclamos) return;
        const reclamosGuardados = JSON.parse(localStorage.getItem('konopa_reclamos')) || [];

        if (reclamosGuardados.length === 0) {
            contenedorMisReclamos.innerHTML = `
                <div class="historial-vacio-box">
                    <i class="fa-solid fa-folder-open"></i>
                    <p class="mensaje-vacio">No tienes reclamos ni quejas registradas.</p>
                </div>`;
        } else {
            let html = '';
            [...reclamosGuardados].reverse().forEach(r => {
                html += `
                    <div class="tarjeta-historial-box" style="margin-bottom: 15px;">
                        <div class="tarjeta-historial-header">
                            <strong class="id-pedido"><i class="fa-solid fa-file-signature"></i> ${r.id} - ${r.tipo.toUpperCase()}</strong>
                            <span class="hora-pedido">${r.fecha}</span>
                        </div>
                        <p class="detalle-reclamo"><strong>Detalle:</strong> ${r.detalle}</p>
                        <span class="badge-estado-proceso"><i class="fa-solid fa-clock"></i> ${r.estado}</span>
                    </div>
                `;
            });
            contenedorMisReclamos.innerHTML = html;
        }
    }
    renderizarReclamos();

    // ==========================================================
    // CARGAR MIS RESERVAS
    // ==========================================================
    function cargarReservas() {
        const contenedor = document.getElementById('contenedor-mis-reservas');
        
        if (!contenedor) {
            console.error("Error: No se encontró el contenedor de reservas en el HTML.");
            return;
        }

        // Leemos las reservas guardadas
        const reservas = JSON.parse(localStorage.getItem('konopa_reservas')) || [];
        console.log("Reservas encontradas:", reservas); // Presiona F12 en tu navegador para ver esto

        // Si no hay reservas, mostramos el mensaje vacío
        if (reservas.length === 0) {
            contenedor.innerHTML = `
                <div style="text-align: center; padding: 2rem 0;">
                    <i class="fa-solid fa-calendar-xmark" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p style="color: #666; font-size: 1.1rem; margin-bottom: 15px;">No tienes ninguna reserva todavía.</p>
                    <a href="../reservas/index.html" style="background-color: #c5a880; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Hacer una reserva</a>
                </div>
            `;
            return;
        }

        // Si hay reservas, dibujamos las tarjetas
        let html = '';
        reservas.reverse().forEach(reserva => {
            // Colores dinámicos según el estado
            let colorEstado = reserva.estado === 'Confirmada' ? '#2ecc71' : (reserva.estado === 'Cancelada' ? '#e74c3c' : '#f39c12');
            
            html += `
                <div style="border: 1px solid #eee; border-left: 4px solid ${colorEstado}; border-radius: 6px; padding: 15px; margin-bottom: 15px; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #f5f5f5; padding-bottom: 10px;">
                        <strong style="color: #333; font-size: 1.1rem;"><i class="fa-solid fa-hashtag" style="color: #c5a880;"></i> ${reserva.id || 'RES-0000'}</strong>
                        <span style="background-color: ${colorEstado}; color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem; font-weight: bold;">
                            ${reserva.estado || 'Pendiente'}
                        </span>
                    </div>
                    <div style="color: #555; line-height: 1.6;">
                        <p style="margin: 5px 0;"><i class="fa-regular fa-calendar" style="color: #c5a880; width: 20px;"></i> <strong>Fecha:</strong> ${reserva.fecha}</p>
                        <p style="margin: 5px 0;"><i class="fa-regular fa-clock" style="color: #c5a880; width: 20px;"></i> <strong>Hora:</strong> ${reserva.hora}</p>
                        <p style="margin: 5px 0;"><i class="fa-solid fa-user-group" style="color: #c5a880; width: 20px;"></i> <strong>Personas:</strong> ${reserva.personas}</p>
                    </div>
                </div>
            `;
        });
        
        contenedor.innerHTML = html;
    }

    // ¡ESTA LÍNEA ES LA QUE HACE QUE TODO FUNCIONE!
    cargarReservas();
});
