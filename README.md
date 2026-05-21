# Movie Mood

Movie Mood es una aplicación web desarrollada en JavaScript que permite descubrir películas infantiles y familiares en función del estado de ánimo, el tiempo disponible y diferentes filtros personalizados.

La aplicación consume la API de The Movie Database (TMDB) para mostrar recomendaciones dinámicas y ofrecer una experiencia de búsqueda más visual e interactiva.

## Funcionalidades

- Búsqueda de películas por título
- Recomendaciones según estado de ánimo:
  - Alegría
  - Tristeza
  - Enfado
  - Calma
  - Miedo
- Filtros por duración:
  - Algo rápido
  - Película normal
  - Gran maratón
- Filtros por estilo:
  - Dibujos animados
  - Personajes reales
- Ordenación:
  - Las más top
  - Lo más nuevo
- Historial de últimas búsquedas usando localStorage
- Scroll automático hacia resultados al aplicar filtros
- Consumo de API con peticiones asíncronas (`fetch`)
- Optimización del buscador con debounce

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6 Modules)
- TMDB API
- LocalStorage

## Estructura del proyecto

```text
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── api.js
│   ├── script.js
│   ├── Movie.js
│   └── storage.js
```

## Organización de archivos

### api.js
Contiene la configuración y llamadas a la API de TMDB.

Responsabilidades:
- URL base
- API Key
- Peticiones de películas

### Movie.js
Clase que genera dinámicamente las tarjetas de películas.

Responsabilidades:
- Crear el HTML de cada película
- Pintar posters, títulos y datos

### script.js
Archivo principal de la aplicación.

Responsabilidades:
- Eventos del buscador
- Filtros
- Emociones
- Renderizado
- Scroll UX
- Lógica general

### storage.js
Gestiona el almacenamiento local del navegador.

Responsabilidades:
- Historial de búsquedas
- Persistencia de datos con localStorage

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/movie-mood.git
```

2. Accede al proyecto:

```bash
cd movie-mood
```

3. Añade tu API Key de TMDB en `api.js`

```js
export const API_KEY = "TU_API_KEY";
```

4. Abre `index.html` en el navegador.

## Cómo funciona

La aplicación realiza peticiones a TMDB usando `fetch` y construye dinámicamente la URL según los filtros seleccionados:

- Género
- Duración
- Estilo
- Popularidad
- Fecha de estreno

Cada vez que el usuario interactúa con la interfaz:

1. Se actualiza el estado global
2. Se construye una nueva URL
3. Se consulta la API
4. Se renderizan nuevas películas

## Historial de búsquedas

Las últimas 10 búsquedas del usuario se guardan en `localStorage`.

Características:

- No duplica búsquedas
- Guarda la más reciente primero
- Elimina automáticamente las más antiguas al superar 10

## Mejoras futuras

- Sistema de favoritos
- Recomendaciones más inteligentes
- Historial visual en interfaz
- Paginación
- Filtros por edad
- Integración con trailers

## API utilizada

The Movie Database (TMDB)

https://www.themoviedb.org/documentation/api

## Autor

Proyecto desarrollado como práctica de JavaScript moderno utilizando módulos, programación orientada a objetos, asincronía y manipulación del DOM.