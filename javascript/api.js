export const API_KEY = "60c06b5b4fd58c237d37642d2b6b68c2";
export const BASE = "https://api.themoviedb.org/3";
export const IMG = "https://image.tmdb.org/t/p/w500";

export async function obtenerPeliculas() {

    const endpoint =
        `${BASE}/movie/popular?api_key=${API_KEY}&language=es-ES`;

    try {

        const respuesta = await fetch(endpoint);

        const datos = await respuesta.json();

        return datos.results;

    } catch (error) {

        console.error("Error TMDB:", error);

        return [];
    }
}