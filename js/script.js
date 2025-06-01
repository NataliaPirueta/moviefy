import { API_CONFIG } from "./config.js";

//Peticiones
const API_HEADERS = {
    'Authorization': `Bearer ${API_CONFIG.token}`,
    'Content-Type': 'application/json'
};


//Selectores DOM
const moviesContainer = document.querySelector('.movies')
const searchInput = document.querySelector('#search')
const searchButton = document.querySelector('#search-btn')


//Obtener películas recientes
const getNowPlayingMovies = async() => {

    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/movie/now_playing?language=es-MX&page=1`, {
            headers: API_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results;

    } catch (error) {
        alert("Error al obtener las películas: " + error.message);
        console.error('Error fetching movies:', error);
        return [];
    }

};

// Obtener película
const searchMovies = async(query) => {
    try{
        const response = await fetch(`${API_CONFIG.baseUrl}/search/movie?query=${encodeURIComponent(query)}&language=es-MX&page=1`, {
            headers: API_HEADERS
        });

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.results;

    } catch (error){
        alert("Error al obtener las películas: " + error.message);
        console.log('Error fetching movies: ', error);
        return[];
    }
}

//Renderizar películas
const renderMovies = (movies) => {

    if(!moviesContainer) return;

    moviesContainer.innerHTML = movies.map(movie=> `
        
       <div class="movie-card">

            <img src="${API_CONFIG.imgUrl}${movie.poster_path}"
            alt="${movie.title}"
            onerror="this.src'https://via.placeholder.com/500x750?text=No+Image'">
            <h3>${movie.title}</h3>

       </div> 
        
    `).join('');

};

// Acciones

document.addEventListener('DOMContentLoaded', async () => {
    // Verificamos que el token esté configurado
    if (!API_CONFIG.token) {
        alert("API Token no configurado. Revisa el archivo .env" + error.message)
        console.error('API Token no configurado. Revisa tu archivo .env');
        return;
    }
    
    // Cargar las películas del momento
    const movies = await getNowPlayingMovies();
    renderMovies(movies);
});


// Búsqueda por botón
if(searchButton) {

    searchButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const query = searchInput?.value.trim();
        if (query){
            const movies = await searchMovies(query);
            renderMovies(movies);
        }

    });
}

//Búsqueda por botón
if(searchButton){
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleSearch();
    })
}

//Búsqueda al presionar enter
if(searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    })
}

// Mostrar películas del momento al borrar el input
searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    if(!query){
        const movies = await getNowPlayingMovies();
        renderMovies(movies);
    }
})

//Manejo de la búsqueda
const handleSearch = async () => {
    const query = searchInput.value.trim();
    let movies;
    if(query) {
        movies = await searchMovies(query);
    }
    else{
        movies = await getNowPlayingMovies();
    }

    renderMovies(movies);
}
