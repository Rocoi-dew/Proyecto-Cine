import { BASE, API_KEY } from './api.js';
import { Movie } from './Movie.js';
import './storage.js';

async function obtenerPeliculas (){
    try {
    const res = await fetch(BASE + "/movie/popular?api_key=" + API_KEY + "&language=es-ES");
    const datos = await res.json();
    console.log(datos);
    return datos.results;

    }catch(e){
        console.log(e);
        return [];
    }
    finally {
    console.log("Well done");
}
}

const rawArray = await obtenerPeliculas(); 

const movieInstances = rawArray.map(data => new Movie(data));

const contenedor = document.getElementById('explorar');

movieInstances.forEach(movie => { 
    contenedor.append(movie.toCard());
});

