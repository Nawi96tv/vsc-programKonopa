document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 0. MENÚ RESPONSIVO (NUEVO MOTOR JS)
    // ==========================================
    const btnMenu = document.querySelector('#btn-menu');
    // Seleccionamos la etiqueta <nav> usando su clase original
    const navMenu = document.querySelector('.nav-menu');

    if (btnMenu && navMenu) {
        btnMenu.addEventListener('click', () => {
            // "Prende o apaga" la visualización de los enlaces
            navMenu.classList.toggle('mostrar');
            // "Prende o apaga" el ícono de la X
            btnMenu.classList.toggle('activo');
        });
    }
    // ==========================================
    // 1. BASE DE DATOS DE REGIONES CULINARIAS
    // ==========================================
    const regiones = [
        {
            enlace: "carta/index.html#costa",
            imagen: "https://i0.wp.com/illakunturtravel.com/wp-content/uploads/2025/03/la-costa-peruana.webp?fit=1200%2C660&ssl=1",
            alt: "Costa Peruana Mar y Acantilados",
            titulo: "Costa Seductora",
            descripcion: "Frescura marina directa a tu mesa con el toque perfecto de limón, ají limo y pescados del día en nuestros cebiches tradicionales."
        },
        {
            enlace: "carta/index.html#sierra",
            imagen: "https://elpopular.cronosmedia.glr.pe/original/2022/08/24/63065dc402438d2ab56319ca.jpg",
            alt: "Sierra Peruana Cordillera de los Andes",
            titulo: "Sierra Ancestral",
            descripcion: "Sabores andinos profundos a base de papas nativas, finas hierbas como el huacatay y carnes sazonadas a la perfección."
        },
        {
            enlace: "carta/index.html#selva",
            imagen: "https://concepto.de/wp-content/uploads/2019/06/selva-peruana-peru-amazonas-ubicacion-e1559963460654.jpg",
            alt: "Selva Peruana Río Amazonas",
            titulo: "Selva Exótica",
            descripcion: "Aromas del Amazonas en tu mesa. Disfruta de la mística cecina, el plátano bellaco y el picante ají charapita."
        },
        {
            enlace: "carta/index.html#brasas",
            imagen: "https://elcomercio.pe/resizer/v2/XFQ2EDOQB5AMPEQ5QDBROFK5YY.jfif?auth=08cb37aee241bd8ebb99e66ed749dd0541216915feae6418a5d5bc9e21debbd0&width=1200&height=900&quality=75&smart=true",
            alt: "Hornos rústicos y fuego",
            titulo: "El Alma de lo Rústico",
            descripcion: "Cocina ancestral con hornos de barro, leña de eucalipto y molienda manual en batán para lograr el ahumado peruano perfecto."
        },
        {
            enlace: "carta/index.html#oriental",
            imagen: "https://comercial.cronosmedia.glr.pe/original/2023/09/12/65007dc917493d64bd74efbf.jpg",
            alt: "Platos fusión peruanos",
            titulo: "Fusión Inédita",
            descripcion: "Un homenaje a la herencia e influencia asiática en la gastronomía peruana, destacando la clásica técnica del wok."
        },
        {
            enlace: "carta/index.html#fastfood",
            imagen: "https://www.perudelights.com/wp-content/uploads/2012/07/Salchipapas-412.jpg",
            alt: "Antojos Urbanos",
            titulo: "Urbano",
            descripcion: "El sabor de la calle elevado a otro nivel. Reinventamos los clásicos de la ciudad con cortes premium y nuestro toque ahumado."
        }
    ];

    // ==========================================
    // 2. BASE DE DATOS DE PLATOS ESTRELLA (Recomendados)
    // ==========================================
    const recomendados = [
        {
            nombre: "El Gran Cebiche Konopa",
            descripcion: "Cubos de pesca del día marinados al momento en jugo de limón de Chulucanas, ají limo, cebolla roja y culantro fresco. Acompañado de camote glaseado, choclo desgranado y canchita chulpi.",
            imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7D4MAcj6qnwBLZ4XLMQJQb6VApcYpNvxanA&s",
            enlace: "carta/index.html"
        },
        {
            nombre: "Pachamanca Tres Carnes",
            descripcion: "Tiernas carnes seleccionadas de res, cerdo y pollo maceradas en una mixtura andina de chincho, huacatay, muña y ajíes. Cocido a fuego lento con papas nativas, camotes, habas, choclo y humitas saladas.",
            imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQATP6H0Px1MKk8xi_VaKmoc5qWECKluL-kow&s",
            enlace: "carta/index.html"
        },
        {
            nombre: "Tacacho con Cecina",
            descripcion: "Finas esferas de plátano bellaco verde asado al carbón y majado con manteca y chicharrón crujiente de cerdo. Servido junto a jugosos cortes de cecina ahumada traída directamente de Tarapoto y salsa de cocona con ají charapita.",
            imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE_nWAvxY2rj4wvXftr8TCGTkDSyXU1PkcCA&s",
            enlace: "carta/index.html"
        }
    ];

    // ==========================================
    // 3. RENDERIZAR REGIONES EN EL DOM
    // ==========================================
    const contenedorRegiones = document.querySelector('#grid-regiones');

    if (contenedorRegiones) {
        contenedorRegiones.innerHTML = '';
        regiones.forEach(region => {
            const divRegion = document.createElement('div');
            divRegion.classList.add('region-card');

            divRegion.innerHTML = `
                <div class="card-image-wrapper">
                    <a href="${region.enlace}" class="cat-circle">
                        <img src="${region.imagen}" alt="${region.alt}">
                    </a>
                </div>
                <div class="card-text-wrapper">
                    <h4>${region.titulo}</h4>
                    <p>${region.descripcion}</p>
                </div>
            `;

            contenedorRegiones.appendChild(divRegion);
        });
    }

    // ==========================================
    // 4. RENDERIZAR RECOMENDADOS EN EL DOM
    // ==========================================
    const contenedorRecomendados = document.querySelector('#grid-recomendados');

    if (contenedorRecomendados) {
        contenedorRecomendados.innerHTML = '';
        recomendados.forEach(plato => {
            const article = document.createElement('article');
            article.classList.add('star-card');

            article.innerHTML = `
                <div class="star-img-wrapper">
                    <img src="${plato.imagen}" alt="${plato.nombre}">
                </div>
                <div class="star-info">
                    <h4>${plato.nombre}</h4>
                    <p>${plato.descripcion}</p>
                    <a href="${plato.enlace}" class="btn-star">Pedir este plato</a>
                </div>
            `;

            contenedorRecomendados.appendChild(article);
        });
    }
    // ==========================================
    // VERIFICACIÓN DE SESIÓN GLOBAL 
    // ==========================================
    function verificarSesionActivaGlobal() {
        const sesionIniciada = localStorage.getItem('konopa_logeado');
        const nombreGuardado = localStorage.getItem('konopa_usuario_nombre');

        const enlacesMenu = document.querySelectorAll('.nav-menu a');
        let enlaceLogin = null;

        enlacesMenu.forEach(enlace => {
            if (enlace.textContent.includes('Login') || (nombreGuardado && enlace.textContent.includes(nombreGuardado.split(' ')[0])) || enlace.textContent.includes('Mi cuenta')) {
                enlaceLogin = enlace;
            }
        });

        if (sesionIniciada === 'true' && enlaceLogin && nombreGuardado) {
            const liPadre = enlaceLogin.parentElement;
            liPadre.classList.add('nav-user-item');

            // Inyectamos el HTML. Nota que NO tiene 'mostrar-dropdown' en el <ul>
            liPadre.innerHTML = `
    <a href="#" id="btn-user-toggle"><i class="fa-regular fa-circle-user"></i> ${nombreGuardado} ▾</a>
    <ul class="dropdown-content" id="user-dropdown">
        <li><a href="../perfil/index.html">Mi cuenta</a></li>
        <li><a href="../perfil/index.html">Mis pedidos</a></li>
        <li><a href="#" id="btn-cerrar-sesion-top">Cerrar sesión</a></li>
    </ul>
`;

            // Ahora buscamos los elementos recién creados
            const btnUserToggle = document.getElementById('btn-user-toggle');
            const userDropdown = document.getElementById('user-dropdown');

            // Abrir/Cerrar
            btnUserToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Evita que se cierre inmediatamente
                userDropdown.classList.toggle('mostrar-dropdown');
            });

            // Cerrar si haces clic en cualquier otro lado
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target) && e.target !== btnUserToggle) {
                    userDropdown.classList.remove('mostrar-dropdown');
                }
            });

            // Logout
            document.getElementById('btn-cerrar-sesion-top').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('konopa_logeado', 'false');
                window.location.reload();
            });
        }
    }
    verificarSesionActivaGlobal();
});
