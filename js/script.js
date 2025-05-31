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
        console.error('Error fetching movies:', error);
        return [];
    }

};

const renderMovies = (movies) => {

    if(!moviesContainer) return;

    moviesContainer.innerHTML = movies.map(movie=> `
        
       <div class=movie-card">

            <img src="${API_CONFIG.imgUrl}${movie.poster_path}"
            alt="${movie.title}"
            onerror="this.src'https://via.placeholder.com/500x750?text=No+Image'">
            <h3>${movie.title}</h3>

       </div> 
        
    `).join('');
};

document.addEventListener('DOMContentLoaded', async () => {
    // Verificamos que el token esté configurado
    if (!API_CONFIG.token) {
        console.error('API Token no configurado. Revisa tu archivo .env');
        return;
    }
    
    // Cargar las películas del momento
    const movies = await getNowPlayingMovies();
    renderMovies(movies);
});
