document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. MENÚ RESPONSIVO (Navegación móvil)
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
    // 2. FUNCIÓN GLOBAL: Menú de Usuario Desplegable
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
                    <i class="fa-regular fa-circle-user"></i> ${nombreCompleto} 
                    <i class="fa-solid fa-chevron-down icon-chevron"></i>
                </a>
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

    // ==========================================================
    // 3. LÓGICA DEL PERFIL (Pestañas, Datos y Redirección)
    // ==========================================================
    const sesionIniciada = localStorage.getItem('konopa_logeado');
    const nombreGuardado = localStorage.getItem('konopa_usuario_nombre');

    if (sesionIniciada === 'true' && nombreGuardado) {
        document.getElementById('nombre-perfil-sidebar').textContent = nombreGuardado;
        document.getElementById('avatar-inicial').textContent = nombreGuardado.charAt(0).toUpperCase();
        document.getElementById('perfil-nombre').value = nombreGuardado;
        document.getElementById('perfil-telefono').value = localStorage.getItem('konopa_usuario_telefono') || '';
        document.getElementById('perfil-correo').value = localStorage.getItem('konopa_usuario_correo') || '';
        document.getElementById('perfil-direccion').value = localStorage.getItem('konopa_usuario_direccion') || '';

        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.menu-link').forEach(l => l.classList.remove('activo'));
                document.querySelectorAll('.perfil-contenido').forEach(s => s.style.display = 'none');

                link.classList.add('activo');
                const targetId = link.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                if (targetSection) targetSection.style.display = 'block';
            });
        });

        const urlParams = new URLSearchParams(window.location.search);
        const seccionSolicitada = urlParams.get('seccion');

        if (seccionSolicitada) {
            let botonDestino = null;
            if (seccionSolicitada === 'pedidos') {
                botonDestino = document.querySelector('.menu-link[data-target="sec-pedidos"]');
            } else if (seccionSolicitada === 'pagos') {
                botonDestino = document.querySelector('.menu-link[data-target="sec-pagos"]');
            } else if (seccionSolicitada === 'reclamos') {
                botonDestino = document.querySelector('.menu-link[data-target="sec-mis-reclamos"]');
            } else if (seccionSolicitada === 'reservas') {
                botonDestino = document.querySelector('.menu-link[data-target="sec-mis-reservas"]');
            }

            if (botonDestino) {
                botonDestino.click();
            }
        }

    } else {
        alert("Debes iniciar sesión para ver tu perfil.");
        window.location.href = "../login/index.html";
    }

    // ==========================================================
    // 4. ACCIONES (Actualizar, Eliminar Cuenta)
    // ==========================================================
    const btnActualizar = document.getElementById('btn-actualizar-datos');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', () => {
            localStorage.setItem('konopa_usuario_nombre', document.getElementById('perfil-nombre').value);
            localStorage.setItem('konopa_usuario_telefono', document.getElementById('perfil-telefono').value);
            localStorage.setItem('konopa_usuario_direccion', document.getElementById('perfil-direccion').value);

            document.getElementById('nombre-perfil-sidebar').textContent = document.getElementById('perfil-nombre').value.split(' ')[0];

            const btnUserToggle = document.getElementById('btn-user-toggle');
            if (btnUserToggle) {
                btnUserToggle.innerHTML = `<i class="fa-regular fa-circle-user"></i> ${document.getElementById('perfil-nombre').value.split(' ')[0]} <i class="fa-solid fa-chevron-down icon-chevron"></i>`;
            }
            alert('Datos actualizados exitosamente.');
        });
    }

    const btnEliminar = document.getElementById('btn-eliminar-cuenta');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            if (confirm('¿Seguro que deseas eliminar tu cuenta permanentemente?')) {
                localStorage.clear();
                window.location.href = "../index.html";
            }
        });
    }

    // ==========================================================
    // 5. MOSTRAR PEDIDOS GUARDADOS
    // ==========================================================
    const contenedorPedidos = document.getElementById('lista-mis-pedidos');
    const mensajeVacio = document.getElementById('historial-pedidos');

    if (contenedorPedidos) {
        const misPedidos = JSON.parse(localStorage.getItem('konopa_pedidos')) || [];
        if (misPedidos.length === 0) {
            if (mensajeVacio) mensajeVacio.style.display = 'block';
        } else {
            if (mensajeVacio) mensajeVacio.style.display = 'none';
            contenedorPedidos.innerHTML = '';
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
    // ==========================================================
    // 6. LÓGICA DEL MODAL DE TARJETAS Y MÉTODOS DE PAGO
    // ==========================================================
    const modalTarjeta = document.getElementById('modal-tarjeta');
    const btnAbrirModal = document.getElementById('btn-abrir-modal-tarjeta');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const formTarjeta = document.getElementById('form-nueva-tarjeta');
    const contenedorTarjetas = document.getElementById('contenedor-tarjetas');

    // Capturamos los inputs del modal
    const inputNum = document.getElementById('input-num-tarjeta');
    const inputNom = document.getElementById('input-nom-titular');
    const inputExp = document.getElementById('input-exp-tarjeta');
    const inputCvv = document.getElementById('input-cvv-tarjeta');

    window.eliminarTarjeta = function (index) {
        if (confirm("¿Seguro que deseas eliminar esta tarjeta de tu cuenta?")) {
            const tarjetas = JSON.parse(localStorage.getItem('konopa_tarjetas')) || [];
            tarjetas.splice(index, 1);
            localStorage.setItem('konopa_tarjetas', JSON.stringify(tarjetas));
            renderizarTarjetas();
        }
    };

    function renderizarTarjetas() {
        if (!contenedorTarjetas) return;
        const tarjetasGuardadas = JSON.parse(localStorage.getItem('konopa_tarjetas')) || [];

        if (tarjetasGuardadas.length === 0) {
            contenedorTarjetas.innerHTML = `
                <div class="historial-vacio-box">
                    <i class="fa-regular fa-credit-card"></i>
                    <p class="mensaje-vacio">Aún no tienes tarjetas guardadas.</p>
                </div>
            `;
        } else {
            let html = '';
            tarjetasGuardadas.forEach((tarjeta, index) => {
                const ultimos4 = tarjeta.numero.slice(-4);
                html += `
                    <div class="tarjeta-guardada-box">
                        <div class="tarjeta-info-flex">
                            <i class="fa-brands fa-cc-visa icon-tarjeta"></i>
                            <div>
                                <strong class="tarjeta-numero">**** **** **** ${ultimos4}</strong>
                                <span class="tarjeta-titular">${tarjeta.titular} - Exp: ${tarjeta.exp}</span>
                            </div>
                        </div>
                        <button class="btn-eliminar-tarjeta" onclick="eliminarTarjeta(${index})" title="Eliminar tarjeta">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
            });
            contenedorTarjetas.innerHTML = html;
        }
    }
    renderizarTarjetas();

    // --- MANEJO DE COLORES VERDE/ROJO ---
    function aplicarColor(input, esValido) {
        if (esValido) {
            input.classList.add('input-valido');
            input.classList.remove('input-invalido');
        } else {
            input.classList.add('input-invalido');
            input.classList.remove('input-valido');
        }
    }

    function limpiarColores() {
        [inputNum, inputNom, inputExp, inputCvv].forEach(inp => {
            if (inp) inp.classList.remove('input-valido', 'input-invalido');
        });
    }

    // --- VALIDACIÓN EN TIEMPO REAL ---
    if (inputNum) {
        inputNum.addEventListener('input', () => {
            const num = inputNum.value.replace(/\s+/g, ''); // Ignora espacios en blanco
            // Debe empezar en 4, tener exactamente 16 números y ser solo números
            const esValido = num.startsWith('4') && num.length === 16 && /^\d+$/.test(num);
            aplicarColor(inputNum, esValido);
        });
    }

    if (inputNom) {
        inputNom.addEventListener('input', () => {
            const esValido = inputNom.value.trim().length >= 3; // Mínimo 3 letras
            aplicarColor(inputNom, esValido);
        });
    }

    if (inputExp) {

        inputExp.addEventListener('input', () => {
            const valor = inputExp.value;
            const expRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

            if (expRegex.test(valor)) {
                const [mes, anio] = valor.split('/');
                const fechaActual = new Date();
                const mesActual = fechaActual.getMonth() + 1;
                const anioActual = parseInt(fechaActual.getFullYear().toString().slice(2));

                const anioInput = parseInt(anio);
                const mesInput = parseInt(mes);

                // Si es mayor o igual a hoy, es VÁLIDO (se pinta verde)
                if (anioInput > anioActual || (anioInput === anioActual && mesInput >= mesActual)) {
                    inputExp.setCustomValidity("");
                } else {
                    // Si es antiguo, lo marcamos como INVÁLIDO (se pinta rojo)
                    inputExp.setCustomValidity("Fecha vencida");
                }
            } else {
                // Si el formato es incompleto, es INVÁLIDO
                inputExp.setCustomValidity("Incompleto");
            }
        });
    }

    if (inputCvv) {
        inputCvv.addEventListener('input', () => {
            const esValido = /^\d{3,4}$/.test(inputCvv.value);
            aplicarColor(inputCvv, esValido);
        });
    }

    // --- ABRIR Y CERRAR MODAL ---
    if (btnAbrirModal && modalTarjeta) {
        btnAbrirModal.addEventListener('click', () => {
            modalTarjeta.classList.add('mostrar-modal');
        });
    }

    if (btnCerrarModal && modalTarjeta) {
        btnCerrarModal.addEventListener('click', () => {
            modalTarjeta.classList.remove('mostrar-modal');
            formTarjeta.reset();
            limpiarColores();
        });
    }

    if (modalTarjeta) {
        modalTarjeta.addEventListener('click', (e) => {
            if (e.target === modalTarjeta) {
                modalTarjeta.classList.remove('mostrar-modal');
                formTarjeta.reset();
                limpiarColores();
            }
        });
    }

    // --- ENVÍO DEL FORMULARIO FINAL ---
    if (formTarjeta) {
        formTarjeta.addEventListener('submit', (e) => {
            e.preventDefault();

            const num = inputNum.value.replace(/\s+/g, '');
            const nom = inputNom.value.trim();
            const exp = inputExp.value;
            const cvv = inputCvv ? inputCvv.value : '000';

            const numValido = num.startsWith('4') && num.length === 16 && /^\d+$/.test(num);
            const nomValido = nom.length >= 3;
            const cvvValido = /^\d{3,4}$/.test(cvv);

            let expValida = false;
            if (/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) {
                const [mes, anio] = exp.split('/');
                const fechaActual = new Date();
                const mesActual = fechaActual.getMonth() + 1;
                const anioActual = parseInt(fechaActual.getFullYear().toString().slice(2));

                if (parseInt(anio) > anioActual || (parseInt(anio) === anioActual && parseInt(mes) >= mesActual)) {
                    expValida = true;
                }
            }

            // Aplicamos colores finales por si le dio "enter" sin completar
            aplicarColor(inputNum, numValido);
            aplicarColor(inputNom, nomValido);
            aplicarColor(inputExp, expValida);
            if (inputCvv) aplicarColor(inputCvv, cvvValido);

            if (!numValido) {
                alert("El número de tarjeta debe tener exactamente 16 dígitos y empezar con 4 (Visa).");
                return;
            }
            if (!nomValido) {
                alert("Ingresa un nombre de titular válido.");
                return;
            }
            if (!expValida) {
                alert("La fecha de expiración es inválida o la tarjeta está vencida.");
                return;
            }
            if (!cvvValido) {
                alert("El CVV debe ser de 3 o 4 dígitos.");
                return;
            }

            const nuevaTarjeta = {
                numero: num,
                titular: nom.toUpperCase(),
                exp: exp
            };

            const tarjetas = JSON.parse(localStorage.getItem('konopa_tarjetas')) || [];
            tarjetas.push(nuevaTarjeta);
            localStorage.setItem('konopa_tarjetas', JSON.stringify(tarjetas));

            formTarjeta.reset();
            limpiarColores();
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
                    <div class="tarjeta-historial-box box-espaciado">
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
    // 8. CARGAR MIS RESERVAS
    // ==========================================================
    function cargarReservas() {
        const contenedor = document.getElementById('contenedor-mis-reservas');

        if (!contenedor) return;

        const reservas = JSON.parse(localStorage.getItem('konopa_reservas')) || [];

        if (reservas.length === 0) {
            contenedor.innerHTML = `
                <div class="historial-vacio-box">
                    <i class="fa-solid fa-calendar-xmark"></i>
                    <p class="mensaje-vacio">No tienes ninguna reserva todavía.</p>
                    <a href="../reservas/index.html" class="btn-nueva-direccion btn-enlace-reserva">Hacer una reserva</a>
                </div>
            `;
            return;
        }

        let html = '';
        reservas.reverse().forEach(reserva => {
            const estadoClass = reserva.estado === 'Confirmada' ? 'estado-confirmada' : (reserva.estado === 'Cancelada' ? 'estado-cancelada' : 'estado-pendiente');

            html += `
                <div class="tarjeta-historial-box box-espaciado border-${estadoClass}">
                    <div class="tarjeta-historial-header con-borde">
                        <strong class="id-pedido"><i class="fa-solid fa-hashtag"></i> ${reserva.id || 'RES-0000'}</strong>
                        <span class="badge-estado badge-${estadoClass}">
                            ${reserva.estado || 'Pendiente'}
                        </span>
                    </div>
                    <div class="resumen-body">
                        <p class="fila-detalle-reserva"><i class="fa-regular fa-calendar"></i> <strong>Fecha:</strong> ${reserva.fecha}</p>
                        <p class="fila-detalle-reserva"><i class="fa-regular fa-clock"></i> <strong>Hora:</strong> ${reserva.hora}</p>
                        <p class="fila-detalle-reserva"><i class="fa-solid fa-user-group"></i> <strong>Personas:</strong> ${reserva.personas}</p>
                    </div>
                </div>
            `;
        });

        contenedor.innerHTML = html;
    }
    cargarReservas();
});