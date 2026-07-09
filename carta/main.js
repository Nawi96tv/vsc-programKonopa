document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // MENÚ RESPONSIVO
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
    // NUESTRA "BASE DE DATOS" DE PLATOS
    const platos = [
        // === LA COSTA ===
        { categoria: "costa", nombre: "Ceviche Konopa", precio: 48, descripcion: "Cubos de pesca del día marinados al momento en jugo de limón de Chulucanas, ají limo, cebolla roja y culantro fresco. Acompañado de camote glaseado y choclo.", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7D4MAcj6qnwBLZ4XLMQJQb6VApcYpNvxanA&s" },
        { categoria: "costa", nombre: "Lomo Saltado al Jugo", precio: 55, descripcion: "Finos trozos de lomo fino de res salteados al fuego vivo en wok de hierro con cebolla, tomates, ají amarillo y un toque de pisco. Servido con papas nativas y arroz.", imagen: "https://www.recetasnestle.com.pe/sites/default/files/srh_recipes/d0bd5fbfcbb5231c896b8d33ff171a29.png" },
        { categoria: "costa", nombre: "Arroz con Mariscos", precio: 52, descripcion: "Arroz meloso cocido en coral de cangrejo, vino blanco y ají panca, con mixtura de calamares, langostinos y conchas al fuego vivo. Terminado con queso parmesano.", imagen: "https://www.nestleprofessional-latam.com/sites/default/files/styles/np_recipe_detail/public/2023-08/ARROZ-CON-MARISCOS.jpg" },
        { categoria: "costa", nombre: "Jalea Mixta Crocante", precio: 58, descripcion: "Trozos de pescado y mariscos empanizados y fritos hasta quedar extracrujientes. Servidos sobre yucas fritas, bañados con sarsa criolla y mayonesa tártara casera.", imagen: "https://peru.info/archivos/publicacion/254-imagen-101541122022.jpg" },

        // === LA SIERRA ===
        { categoria: "sierra", nombre: "Pachamanca Tres Carnes", precio: 58, descripcion: "Carnes de res, cerdo y pollo maceradas en chincho, huacatay, muña y ajíes. Cocido a fuego lento con papas nativas, camotes, habas y humitas.", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQATP6H0Px1MKk8xi_VaKmoc5qWECKluL-kow&s" },
        { categoria: "sierra", nombre: "Rocoto Relleno Arequipeño", precio: 42, descripcion: "Rocoto desvenado con toque picante, relleno de res picada a cuchillo, pasas, aceitunas y especias, cubierto de queso paria. Acompañado de pastel de papa.", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp5gtVK4Ygs1AYPSr0JPh_hg9W1SzIybYn8w&s" },
        { categoria: "sierra", nombre: "Chicharrón de Cerdo Andino", precio: 45, descripcion: "Trozos de cerdo confitados lentamente en su propia grasa hasta alcanzar un dorado perfecto y crujiente. Servido con mote, camote frito y zarza criolla.", imagen: "https://elcomercio.pe/resizer/v2/WHUQR2UA45GFFO6F2MPO4KKKNA.jpg?auth=07b85960c75c027855761be0c068e22544711b57e6cd35ce649a23461d9f6ffc&width=1200&height=900&quality=75&smart=true" },
        { categoria: "sierra", nombre: "Cuy Chactado Entero", precio: 65, descripcion: "Tradicional cuy frito bajo piedra hasta quedar extracrujiente, sazonado con ajo, comino y ají panca. Acompañado de papas doradas y ensalada andina.", imagen: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60" },

        // === LA SELVA ===
        { categoria: "selva", nombre: "Tacacho con Cecina Artesanal", precio: 46, descripcion: "Plátano bellaco asado y majado con manteca y chicharrón. Servido junto a jugosos cortes de cecina ahumada de Tarapoto y salsa de cocona con charapita.", imagen: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTcm2CcfSdkb7S7lAagthTJKhCiwkDgf-nqUuPumgoqHq4h0G3r" },
        { categoria: "selva", nombre: "Juane Tradicional de Gallina", precio: 44, descripcion: "Arroz sazonado con palillo y especias amazónicas, moldeado con presa de gallina, huevos y aceitunas, envuelto en hojas de bijao y cocido al vapor.", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdByJPMSYXp1nueayhIhW2cHsOR2nDchnCvg&s" },
        { categoria: "selva", nombre: "Chaufa Amazónico", precio: 40, descripcion: "Nuestra versión del arroz frito oriental con un toque selvático. Salteado al wok con cecina ahumada picada, chorizo regional, huevo y plátano maduro frito.", imagen: "https://jameaperu.com/assets/images/2026/02/chaufa-amazonico_800x534.webp" },
        { categoria: "selva", nombre: "Patarashca de Doncella", precio: 48, descripcion: "Fresco pescado de río aderezado con sacha culantro, ají dulce y cebolla, envuelto en hoja de bijao y asado lentamente a las brasas.", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNk9v_-EvwoC3C04QETglKZxklfTTMDiAr4Q&s" },

        // === BRASAS Y RÚSTICOS ===
        { categoria: "brasas", nombre: "1 Pollo a la Brasa", precio: 80, descripcion: "Pollo entero dorado a la leña. Acompañado de porción familiar de papas fritas peruanas, ensalada clásica con vinagreta y todas nuestras cremas caseras.", imagen: "https://imgmedia.buenazo.pe/1200x660/buenazo/original/2023/07/14/64ac3e8c599470217672a906.jpg" },
        { categoria: "brasas", nombre: "1/4 de Pollo", precio: 28, descripcion: "Un cuarto de pollo a la brasa acompañado de crocantes papas fritas y ensalada fresca.", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJgw-9zGlLPxKK4a4vi3uOXu2ohQHumEVVAQ&s" },
        { categoria: "brasas", nombre: "Chancho al Palo", precio: 55, descripcion: "Asado al aire libre frente al fuego vivo. Destaca por su sabor rústico a leña y una piel dorada extra crujiente (la famosa 'piel galleta'). Con sarsa criolla.", imagen: "https://t3.ftcdn.net/jpg/07/54/40/54/360_F_754405491_SvkJZEnfSqrRxNoe87sbHCZcMkQhlVs8.jpg" },
        { categoria: "brasas", nombre: "Chancho a la Caja China", precio: 48, descripcion: "Horneado lentamente en sus propios jugos bajo calor superior. Garantiza una carne súper tierna rematada con la piel más crocante de todas. Sale con papas.", imagen: "https://perudelights.com/wp-content/uploads/2018/04/1400000015479.jpg" },

        // === ORIENTAL ===
        { categoria: "oriental", nombre: "Pollo Chi Jau Kay", precio: 38, descripcion: "Trozos de pierna de pollo deshuesada crujiente, bañados en salsa Chi Jau Kay original salada con ajonjolí tostado. Sale con porción generosa de arroz chaufa.", imagen: "https://aceleralastatic.nyc3.cdn.digitaloceanspaces.com/files/uploads/764/1729895285-146-pollo-chijaukay-jpg.jpg" },
        { categoria: "oriental", nombre: "Chancho Asado Char Siu", precio: 45, descripcion: "Cerdo laqueado lentamente con salsa hoisin, miel y 5 especias chinas, asado a la leña al estilo cilindro. Servido en rodajas sobre una cama de fideos de arroz.", imagen: "https://www.196flavors.com/wp-content/uploads/2017/02/Char-Siu-FP.jpg" },
        { categoria: "oriental", nombre: "Arroz Chaufa Especial", precio: 35, descripcion: "Clásico arroz frito al wok a altísima temperatura, saltado con trozos de pollo, cerdo asado Char Siu, langostinos, huevo y cebollita china.", imagen: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=60" },
        { categoria: "oriental", nombre: "Tallarín Saltado Taypá", precio: 42, descripcion: "Fideos chinos salteados al wok con una sabrosa salsa de ostión, pac choy, pimientos, pollo, carne de res, cerdo asado, langostinos y huevos de codorniz.", imagen: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=500&q=60" },

        // === ANTOJOS URBANOS ===
        { categoria: "fastfood", nombre: "Salchipapa Royal", precio: 28, descripcion: "Una cama gigante de papas amarillas fritas crocantes, frankfurter artesanal, rodajas de chorizo, un huevo frito montado y abundante queso derretido.", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ3khFSgXUTKuNB3zVbYT-l6jm1jDt_B_rQQ&s" },
        { categoria: "fastfood", nombre: "Hamburguesa Konopa", precio: 32, descripcion: "Medallón de 200g de asado de tira a la parrilla, queso cheddar fundido, cebolla caramelizada, tocino ahumado y salsa especial de la casa en pan brioche. Con papas fritas.", imagen: "https://www.beloleum.com/wp-content/uploads/2023/11/hamburguesas-caseras-gourmet.png" },
        { categoria: "fastfood", nombre: "Club Sándwich Konopa", precio: 26, descripcion: "Triple piso de pan de molde tostado relleno de pechuga de pollo deshilachada con mayonesa, jamón, queso, huevo frito, tocino, tomate y lechuga. Con papas fritas.", imagen: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=60" },
        { categoria: "fastfood", nombre: "Alitas BBQ Crunch", precio: 25, descripcion: "Porción de 8 alitas de pollo fritas extracrujientes, bañadas completamente en salsa BBQ ahumada, acompañadas de bastones de apio y salsa ranch.", imagen: "https://www.salsasangucheria.com/wp-content/uploads/2022/03/alitasdoce.png" },

        // === POSTRES ===
        { categoria: "postres", nombre: "Suspiro a la Limeña", precio: 18, descripcion: "Delicado y tradicional postre limeño. Suave crema de manjar blanco de yemas cubierta con un ligero merengue italiano al oporto espolvoreado con canela.", imagen: "https://cdn0.recetasgratis.net/es/posts/2/6/2/suspiro_limeno_78262_paso_7_600.jpg" },
        { categoria: "postres", nombre: "Picarones Tradicionales", precio: 15, descripcion: "Anillos de masa a base de zapallo macre y camote, fritos hasta estar crujientes y bañados en una dulce miel caliente de chancaca, hojas de higo y naranja.", imagen: "https://www.perudelights.com/wp-content/uploads/2013/01/Picarones.jpg" },
        { categoria: "postres", nombre: "Torta de Chocolate Húmeda", precio: 20, descripcion: "Generosa porción de bizcocho de cacao peruano sumamente húmedo, relleno y cubierto por una gruesa capa de fudge de chocolate artesanal brillante.", imagen: "https://www.pasteleriamariate.com.pe/cdn/shop/files/MARIATE_ABRIL20244002_460x@2x.jpg" },
        { categoria: "postres", nombre: "Helados Artesanales (2 Bolas)", precio: 14, descripcion: "Helados de pura fruta hechos en casa. Sabores a elegir: Lúcuma peruana con trozos de chocolate, fresa natural, vainilla clásica o maracuyá refrescante.", imagen: "https://excelenciasgourmet.com/sites/default/files/2019-09/helado-artesanal_0.jpg" },

        // === BEBIDAS ===
        { categoria: "bebidas", nombre: "Pisco Sour Clásico", precio: 25, descripcion: "El cóctel bandera. Pisco Quebranta puro, jugo de limón recién exprimido, jarabe de goma, clara de huevo y unas gotas de amargo de Angostura. Batido a la perfección.", imagen: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=500&q=60" },
        { categoria: "bebidas", nombre: "Chicha Morada (Jarra 1L)", precio: 20, descripcion: "Néctar casero hervido a partir de maíz morado, piña, membrillo, manzana, canela y clavo de olor, endulzado y con el toque exacto de limón fresco.", imagen: "https://tofuu.getjusto.com/orioneat-local/resized2/KScvan2eQf2BeMqBS-2400-x.webp" },
        { categoria: "bebidas", nombre: "Limonada Frozen (Jarra 1L)", precio: 22, descripcion: "Bebida frozen extremadamente refrescante, elaborada con limones peruanos exprimidos al instante, jarabe casero y hielo licuado a punto nieve.", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT25t56mWp4-YpJZALgQtKCEC8d-s-f4ofB5Q&s" },
        { categoria: "bebidas", nombre: "Cerveza Cusqueña (620ml)", precio: 16, descripcion: "Cerveza peruana premium en tamaño grande. Puedes elegir entre la refreshing Dorada (Lager), Trigo, Negra o Roja, servidas bien heladas.", imagen: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=500&q=60" }
    ];

    // FUNCIÓN PARA RENDERIZAR LOS PLATOS EN SU CONTENEDOR
    function cargarCategoria(idCategoria) {
        // Buscamos el contenedor por su ID (ej. #grid-costa)
        const contenedor = document.querySelector(`#grid-${idCategoria}`);

        // Si el contenedor no existe en esta página, salimos de la función
        if (!contenedor) return;

        // Filtramos solo los platos que pertenecen a la categoría actual
        const platosFiltrados = platos.filter(plato => plato.categoria === idCategoria);

        // Recorremos los platos filtrados para inyectarlos en el HTML
        platosFiltrados.forEach(plato => {
            const article = document.createElement('article');
            article.classList.add('dish-card');

            // Creamos la estructura HTML usando Backticks (comillas invertidas)
            article.innerHTML = `
                <div class="dish-image-wrapper">
                    <img src="${plato.imagen}" alt="${plato.nombre}">
                </div>
                <div class="dish-info">
                    <div class="dish-header">
                        <h4>${plato.nombre}</h4><span class="price">S/ ${plato.precio}</span>
                    </div>
                    <p class="description">${plato.descripcion}</p>
                </div>
            `;

            // Pegamos el plato completo dentro del contenedor
            contenedor.appendChild(article);
        });
    }

    // EJECUTAMOS LA FUNCIÓN PARA CADA SECCIÓN DE LA CARTA
    cargarCategoria('costa');
    cargarCategoria('sierra');
    cargarCategoria('selva');
    cargarCategoria('brasas');
    cargarCategoria('oriental');
    cargarCategoria('fastfood');
    cargarCategoria('postres');
    cargarCategoria('bebidas');
    
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

});