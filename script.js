/* =========================================
   1. BOTÓN MODO OSCURO (Sincronizado con CSS)
========================================= */
const btn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

// Si el usuario ya tenía guardado el modo oscuro, lo activamos al cargar
if (currentTheme === "dark") {
  document.body.classList.add("dark-mode");
}

if (btn) {
    btn.addEventListener("click", () => {
      // Alternamos la clase .dark-mode en el body
      document.body.classList.toggle("dark-mode");
      
      let theme = "light";
      if (document.body.classList.contains("dark-mode")) {
        theme = "dark";
      }
      localStorage.setItem("theme", theme);
    });
}

/* =========================================
   2. BASE DE DATOS DE PELÍCULAS
========================================= */
const peliculas = [
    {
        titulo: "Soul",
        estudio: "Pixar",
        año: 2020,
        duracion: "102 min",
        pais: "US",
        rating: 9.1,
        badge: "Destacada",
        tags: ["calma", "tristeza"]
    },
    {
        titulo: "Inside Out",
        estudio: "Pixar",
        año: 2015,
        duracion: "95 min",
        pais: "US",
        rating: 8.7,
        badge: "Clásico",
        tags: ["alegria", "tristeza"]
    },
    {
        titulo: "Spirited Away",
        estudio: "Studio Ghibli",
        año: 2001,
        duracion: "125 min",
        pais: "JP",
        rating: 9.3,
        badge: "Clásico",
        tags: ["enfado", "calma"]
    },
    {
        titulo: "Pinocchio",
        estudio: "Del Toro",
        año: 2022,
        duracion: "117 min",
        pais: "ES",
        rating: 7.2,
        badge: "Nuevo",
        tags: ["tristeza", "enfado"]
    },
    {
        titulo: "Wolfwalkers",
        estudio: "Cartoon Saloon",
        año: 2020,
        duracion: "103 min",
        pais: "IR",
        rating: 7.9,
        badge: "Destacada",
        tags: ["enfado", "alegria"]
    },
    {
        titulo: "Coraline",
        estudio: "Laika",
        año: 2009,
        duracion: "100 min",
        pais: "US",
        rating: 6.7,
        badge: "Clásico",
        tags: ["alegria", "miedo"]
    }
];

/* =========================================
   3. FUNCIÓN DE RENDERIZADO DE TARJETAS
========================================= */
function cargarPeliculas() {
    const contenedor = document.getElementById("explorar");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    peliculas.forEach(peli => {
        // Formateamos las etiquetas de texto de cada película
        const tagsHTML = peli.tags.map(tag => 
            `<span class="tag-${tag}">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`
        ).join("");

        // Estructura HTML limpia usando las clases que lee el CSS moderno
        const card = `
            <article class="card">
                <div class="card-visual">
                    <img src="img/${peli.titulo.toLowerCase().replace(/\s+/g, '-')}.jpg" 
                         alt="${peli.titulo}" 
                         style="width:100%; height:100%; object-fit:cover;">
                    <span class="card-rating">★ ${peli.rating}</span>
                    <span class="card-badge">${peli.badge}</span>
                </div>
                <div class="card-info-content">
                    <h3>${peli.titulo}</h3>
                    <span>${peli.estudio} · ${peli.año} · ${peli.duracion} · ${peli.pais}</span>
                </div>
                <div class="tags">
                    ${tagsHTML}
                </div>
            </article>
        `;
        contenedor.innerHTML += card;
    });
}

// Inicializar la carga cuando el documento esté listo
document.addEventListener("DOMContentLoaded", cargarPeliculas);