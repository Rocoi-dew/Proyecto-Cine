import { BASE, API_KEY } from './api.js';
import { Movie } from './Movie.js';
import './storage.js';

// DOM

const contenedor = document.getElementById('contenedor-peliculas');
const buscador = document.getElementById('search');
const botonesMood = document.querySelectorAll('.btn-mood');
const botonesFiltros = document.querySelectorAll('[data-filter]');
const botonesOrden = document.querySelectorAll('[data-order]');

// ESTADO GLOBAL

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

// FETCH PELÍCULAS

async function obtenerPeliculas() {

    try {

        let genres = currentGenres;

        // ESTILO

        if (currentStyle === "animacion") {

            genres += ",16";
        }

        let url =
            `${BASE}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${genres}&sort_by=${currentSort}&include_adult=false`;

        // PERSONAJES REALES

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

        // TOP

        if (currentVoteCount !== "") {

            url += `&vote_count.gte=${currentVoteCount}`;
        }

        // NUEVAS

        if (currentReleaseDate !== "") {

            url += `&primary_release_date.lte=${currentReleaseDate}`;
        }

        const res = await fetch(url);

        const datos = await res.json();

        return datos.results;

    } catch (e) {

        console.log(e);

        return [];
    }
}

// BUSCADOR

async function buscarPeliculas(texto) {

    try {

        const res = await fetch(
            `${BASE}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(texto)}&include_adult=false`
        );

        const datos = await res.json();

        return datos.results;

    } catch (e) {

        console.log(e);

        return [];
    }
}

// DEBOUNCE

function debounce(func, delay) {

    let timeoutId;

    return function (...args) {

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {

            func.apply(this, args);

        }, delay);
    }
}

// PINTAR

function pintarPeliculas(listaPeliculas) {

    contenedor.innerHTML = "";

    const movieInstances =
        listaPeliculas.map(data => new Movie(data));

    movieInstances.forEach(movie => {

        contenedor.append(movie.toCard());

    });
}

// ACTUALIZAR

async function actualizarPeliculas() {

    rawArray = await obtenerPeliculas();

    pintarPeliculas(rawArray);
}

// BUSCADOR INPUT

async function writeInSearch(event) {

    const texto = event.target.value.trim();

    if (texto === "") {

        pintarPeliculas(rawArray);

        return;
    }

    const resultados =
        await buscarPeliculas(texto);

    pintarPeliculas(resultados);

    irAPeliculas();
}

// EMOCIONES

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

        if (btn.classList.contains('btn-alegria')) {

            currentGenres = moods.alegria;
        }

        if (btn.classList.contains('btn-tristeza')) {

            currentGenres = moods.tristeza;
        }

        if (btn.classList.contains('btn-enfado')) {

            currentGenres = moods.enfado;
        }

        if (btn.classList.contains('btn-calma')) {

            currentGenres = moods.calma;
        }

        if (btn.classList.contains('btn-miedo')) {

            currentGenres = moods.miedo;
        }

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
            filtro === "corto" ||
            filtro === "normal" ||
            filtro === "largo"
        ) {

            currentRuntime = filtro;
        }

        // ESTILO

        if (
            filtro === "animacion" ||
            filtro === "real"
        ) {

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

        if (orden === "nuevo") {

            currentSort =
                "primary_release_date.desc";

            currentReleaseDate =
                "2026-12-31";

            currentVoteCount = "";
        }

        await actualizarPeliculas();

        irAPeliculas();
    });
});

// INICIO

rawArray = await obtenerPeliculas();

pintarPeliculas(rawArray);

// BUSCADOR

const debouncedSearch =
    debounce(writeInSearch, 400);

buscador.addEventListener(
    'input',
    debouncedSearch
);