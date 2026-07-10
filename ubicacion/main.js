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
    // 2. BASE DE DATOS DE SEDES (Arreglos Paralelos)
    // ==========================================
    
    const imagenesSedes = [
        "img/UBILIMA.png",
        "img/UBICUSCO.png",
        "img/UBISELVA.png"
    ];

    const altSedes = [
        "Sede Miraflores, Lima",
        "Sede Centro Histórico, Cusco",
        "Sede Tarapoto"
    ];

    const titulosSedes = [
        "Sede Lima - Miraflores",
        "Sede Cusco - Centro Histórico",
        "Sede San Martín - Tarapoto"
    ];

    const direccionesSedes = [
        "Av. Larco 740, Miraflores",
        "Calle Palacio 120, Cusco",
        "Jr. Lamas 415, Tarapoto"
    ];

    const descripcionesSedes = [
        "Nuestra sede principal en la capital combina el estilo urbano contemporáneo con los toques rústicos andinos. Dispone de un salón de dos niveles, barra de coctelería amazónica y un área privada para reuniones corporativas.",
        "Ubicada en una antigua casona colonial con muros incas originales. El ambiente ideal para conectar con las raíces mágicas de nuestra historia. Cuenta con patio interior calefaccionado y horno a leña tradicional de piedra vista.",
        "Envuelta por la frescura y la vegetación de la selva alta peruana. Diseñada con arquitectura abierta, techos altos de palma tejida y una atmósfera relajante idónea para disfrutar de las mejores carnes ahumadas de la región."
    ];

    // ==========================================
    // 3. INYECCIÓN DINÁMICA AL HTML (Con ciclo for)
    // ==========================================
    const contenedorSedes = document.querySelector('#contenedor-sedes');

    if (contenedorSedes) {
        // Limpiamos el contenedor
        contenedorSedes.innerHTML = ''; 

        // Recorremos los arreglos paralelos usando el índice 'i'
        for (let i = 0; i < titulosSedes.length; i++) {
            
            const divSede = document.createElement('div');
            divSede.classList.add('branch-card');
            
            divSede.innerHTML = `
                <div class="branch-image-wrapper">
                    <img src="${imagenesSedes[i]}" alt="${altSedes[i]}">
                </div>
                <div class="branch-info">
                    <h4>${titulosSedes[i]}</h4>
                    <p class="address">${direccionesSedes[i]}</p>
                    <p class="description">${descripcionesSedes[i]}</p>
                </div>
            `;
            
            contenedorSedes.appendChild(divSede);
        }
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
                    <li><a href="../perfil/index.html?seccion=pedidos">Mis pedidos</a></li>
                    <li><a href="../perfil/index.html?seccion=reclamos">Mis reclamos</a></li>
                    <li><a href="../perfil/index.html?seccion=reservas">Mis reservas</a></li>
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