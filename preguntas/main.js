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
    // 2. BASE DE DATOS DE PREGUNTAS FRECUENTES (Arreglos Paralelos)
    // ==========================================
    const preguntasArray = [
        "¿Es necesario realizar una reserva antes de asistir al local?",
        "¿Cuentan con opciones vegetarianas, veganas o libres de gluten?",
        "¿Tienen una tolerancia de tiempo para las reservas?",
        "¿Ofrecen estacionamiento o servicio de valet parking?",
        "¿Se pueden realizar eventos corporativos o celebraciones privadas?"
    ];

    const respuestasArray = [
        "No es estrictamente obligatorio, pero lo <strong>recomendamos encarecidamente</strong>, especialmente para los turnos de cena los fines de semana y días feriados. Contar con una reserva asegura tu mesa de inmediato y nos permite brindarte una atención personalizada desde tu llegada.",
        "¡Por supuesto! En Konopa celebramos la diversidad. Contamos con versiones adaptadas de platos bandera, como nuestro Solterito de la Sierra, Cebiche de Champiñones y saltados a base de proteínas vegetales. Si tienes alguna alergia severa o eres celíaco, puedes indicarlo en el campo de notas del formulario de reservas.",
        "Sí, manejamos una tolerancia máxima de <strong>15 minutos</strong> de espera a partir de la hora pactada en tu reserva. Transcurrido ese tiempo, para garantizar el flujo y respeto de los horarios de los demás comensales, la mesa se liberará automáticamente para la lista de espera presencial.",
        "En nuestra Sede Principal de Lima (Miraflores) contamos con servicio de <strong>Valet Parking gratuito</strong> para todos nuestros clientes titulares. En las sedes de Cusco y Tarapoto, debido al diseño urbanístico histórico y natural, no disponemos de estacionamiento privado, pero contamos con zonas seguras de parqueo vigilado a menos de una cuadra.",
        "Efectivamente. Ponemos a tu disposición salones temáticos privados y menús de pasos especiales para grupos corporativos, cumpleaños o aniversarios. Para coordinar eventos de más de 12 personas, por favor comunícate directamente con nosotros a través de la pestaña de <strong>Contacto</strong> o déjanos un mensaje detallado."
    ];

    // ==========================================
    // 3. INYECCIÓN DINÁMICA AL HTML (Con ciclo for)
    // ==========================================
    const contenedorFaq = document.querySelector('#contenedor-preguntas');

    if (contenedorFaq) {

        contenedorFaq.innerHTML = ''; 

        for (let i = 0; i < preguntasArray.length; i++) {
            
            const detailsEstructura = document.createElement('details');
            detailsEstructura.classList.add('faq-item');
            
            detailsEstructura.innerHTML = `
                <summary>${preguntasArray[i]}</summary>
                <div class="faq-answer">
                    <p>${respuestasArray[i]}</p>
                </div>
            `;
            
            contenedorFaq.appendChild(detailsEstructura);
        }
    }

    // ==========================================================
    // VERIFICACIÓN DE SESIÓN ACTIVA
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