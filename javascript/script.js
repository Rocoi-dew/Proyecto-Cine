import { BASE, API_KEY } from './api.js';
import { Movie } from './Movie.js';
import { inicializarModoOscuro } from './storage.js';


// ELEMENTOS DOM

const contenedor = document.getElementById('contenedor-peliculas');
const buscador = document.getElementById('search');
const botonesMood = document.querySelectorAll('.btn-mood');
const botonesFiltros = document.querySelectorAll('[data-filter]');
const botonesOrden = document.querySelectorAll('[data-order]');


//ELEMENTOS MODAL

const miModal = document.getElementById('miModal');
const btnCerrar = document.getElementById('cerrarModal');
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalVideo = document.getElementById("modalVideo");


// ESTADO GLOBAL DE LA APP

let rawArray = [];
let currentGenres = "35,10751,12,14";
let currentRuntime = "";
let currentStyle = "";
let currentSort = "popularity.desc";
let currentVoteCount = "";
let currentReleaseDate = "";


// SCROLL UX

function irAPeliculas() {
    document
        .getElementById('explorar')
        .scrollIntoView({
            behavior: 'smooth'
        });
}

// PETICION A LA API - DESCUBRIR PELÍCULAS

async function obtenerPeliculas() {

    try {
        //GENERO ANIMADDO
        let genres = currentGenres;
        if (currentStyle === "animacion") {
            genres += ",16";
        }
        let url = `${BASE}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${genres}&sort_by=${currentSort}&include_adult=false`;
        if (currentStyle === "real") {
            url += "&without_genres=16";
        }

        // DURACIÓN
        if (currentRuntime === "corto") {
            url += "&with_runtime.lte=90";
        }
        if (currentRuntime === "normal") {
            url += "&with_runtime.gte=90";
            url += "&with_runtime.lte=120";
        }
        if (currentRuntime === "largo") {
            url += "&with_runtime.gte=120";
        }

        // VOTOS Y FECHA DE ESTRENO
        if (currentVoteCount !== "") {
            url += `&vote_count.gte=${currentVoteCount}`;
        }
        if (currentReleaseDate !== "") {
            url += `&primary_release_date.gte=${currentReleaseDate}`;
        }

        const res = await fetch(url);
        const datos = await res.json();
        return datos.results;
    } catch (e) {
        console.log(e);
        return [];
    }
}

// PETICION BUSCAR PELÍCULAS

async function buscarPeliculas(texto) {
    try {
        const res = await fetch(`${BASE}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(texto)}&include_adult=false`);
        const datos = await res.json();
        return datos.results;
    } catch (e) {
        console.log(e);
        return [];
    }
}

// DEBOUNCE: Función optimizadora para controlar el flujo de llamadas al servidor

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
}

// ABRIR EL MODAL

async function abrirModal(pelicula) {
    modalTitle.textContent = pelicula.title || pelicula.name;
    modalDescription.textContent = pelicula.overview || "No hay descripción disponible.";
    
    try {
        const respuesta = await fetch(`${BASE}/movie/${pelicula.id}/videos?api_key=${API_KEY}&language=es-ES`);
        const datos = await respuesta.json();
        const trailer = datos.results.find(video => video.site === 'YouTube' && video.type === 'Trailer') 
                        || datos.results.find(video => video.site === 'YouTube');

        if (trailer) {
            modalVideo.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            modalVideo.style.display = 'block';
        } else {
            modalVideo.src = "";
            modalVideo.style.display = 'none';
        }
    } catch (error) {
        console.error(error);
        modalVideo.src = "";
    }

    miModal.style.display = 'flex';
}

// PINTAR: RENDERIZAR LAS PELÍCULAS EN EL DOM

function pintarPeliculas(listaPeliculas) {
    contenedor.innerHTML = "";
    const movieInstances = listaPeliculas.map(data => new Movie(data));
    movieInstances.forEach((movie, index) => {
        const tarjeta = movie.toCard();
        tarjeta.addEventListener('click', () => {
            abrirModal(listaPeliculas[index]);
        });
        contenedor.append(tarjeta);
    });
}

// ACTUALIZAR DATOS

async function actualizarPeliculas() {
    rawArray = await obtenerPeliculas();
    pintarPeliculas(rawArray);
}

// BUSCADOR INPUT

async function writeInSearch() {
    const texto = buscador.value.trim();
    if (texto === "") {
        await actualizarPeliculas();
        return;
    }

    const resultados = await buscarPeliculas(texto);
    pintarPeliculas(resultados);
    irAPeliculas();
}

// IDS --> EMOCIONES 

const moods = {

    alegria: "35,10751",
    tristeza: "18,10751",
    enfado: "28,12",
    calma: "14,10751",
    miedo: "9648,14"
};

// BOTONES EMOCIÓN

botonesMood.forEach(btn => {

    btn.addEventListener('click', async () => {
        if (btn.classList.contains('btn-alegria')) {currentGenres = moods.alegria;}
        if (btn.classList.contains('btn-tristeza')) {currentGenres = moods.tristeza;}
        if (btn.classList.contains('btn-enfado')) {currentGenres = moods.enfado;}
        if (btn.classList.contains('btn-calma')) {currentGenres = moods.calma;}
        if (btn.classList.contains('btn-miedo')) {currentGenres = moods.miedo;}
        await actualizarPeliculas();
        irAPeliculas();
    });
});

// FILTROS

botonesFiltros.forEach(btn => {
    btn.addEventListener('click', async () => {
        const filtro = btn.dataset.filter;

        // TIEMPO

        if (
            filtro === "corto" || filtro === "normal" || filtro === "largo") {
            currentRuntime = filtro;
        }

        // ESTILO

        if (
            filtro === "animacion" || filtro === "real" ) {

            currentStyle = filtro;
        }

        await actualizarPeliculas();
        irAPeliculas();
    });
});

// ORDEN

botonesOrden.forEach(btn => {

    btn.addEventListener('click', async () => {
        const orden = btn.dataset.order;

        // TOP
        if (orden === "rating") {
            currentSort = "vote_average.desc";
            currentVoteCount = 200;
            currentReleaseDate = "";
        }

        // NUEVAS
        if(orden === "nuevo") {
            currentSort = "primary_release_date.desc";
            currentReleaseDate = "2025-12-31";
            currentVoteCount = "";
        }

        await actualizarPeliculas();
        irAPeliculas();
    });
});


//CIERRE MODAL

btnCerrar.addEventListener('click', () => {
    miModal.style.display = 'none';
    
});

window.addEventListener('click', (evento) => {
    if (evento.target === miModal) {
        miModal.style.display = 'none';
        
    }
});

// INICIALIZACIÓN DE LA APP

document.addEventListener("DOMContentLoaded", async () => {

    inicializarModoOscuro();
    rawArray = await obtenerPeliculas();
    pintarPeliculas(rawArray);
    const formulario = document.querySelector('.form-registro');
    if (formulario) {
        formulario.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("¡Botón Buscar presionado con éxito!");
            await writeInSearch();
        });
    } else {
        console.error("No se encontró ningún formulario con la clase '.form-registro'");
    }
});