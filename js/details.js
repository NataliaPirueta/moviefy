import { API_CONFIG } from "./config.js";

//Peticiones
const API_HEADERS = {
    'Authorization': `Bearer ${API_CONFIG.token}`,
    'Content-Type': 'application/json'
};

//Selectores DOM
const movieDetailsContainer = document.querySelector('.movie-details');
const loadingText = document.querySelector('.loading-text');

//Obtener datos de la película seleccionada
const getMovieDetails = async (movieId) => {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/movie/${movieId}?language=es-MX`, {
            headers: API_HEADERS
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        alert("Error al obtener los detalles de la película: " + error.message);
        console.error('Error fetching movie details', error);
        return null;
    }
}

//Renderizar detalles
const renderMovieDetails = (movie) => {
    if(!movieDetailsContainer) return;

    const genres = movie.genres?.map(genre => genre.name).join(', ') || 'No disponible';

    const formatDate = (dateString) => {
        if(!dateString) return 'No disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    movieDetailsContainer.innerHTML = `
        <div class="movie-hero">
            <div class="movie-poster">
                <img src="${API_CONFIG.imgUrl}${movie.poster_path}" 
                     alt="${movie.title}"
                     onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'">
            </div>
            
            <div class="movie-info">
                <h1 class="movie-title">${movie.title}</h1>
                
                <div class="movie-meta">
                    <div class="meta-item">
                        <span class="meta-label">Calificación:</span>
                        <span class="rating">⭐ ${movie.vote_average?.toFixed(1) || 'N/A'}/10</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Fecha de lanzamiento:</span>
                        <span class="release-date">${formatDate(movie.release_date)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Géneros:</span>
                        <span class="genres">${genres}</span>
                    </div>
                </div>
                
                <div class="overview">
                    <h3>Sinopsis</h3>
                    <p>${movie.overview || 'No hay sinopsis disponible.'}</p>
                </div>
            </div>
        </div>
    `;
};

// Función que se ejecuta al cargar la página
const loadMovieDetails = async () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (!movieId) {
        alert('No se especificó una película válida');
        window.location.href = 'index.html';
        return;
    }

    try {
        // Obtener solo los detalles de la película
        const movieDetails = await getMovieDetails(movieId);

        if (movieDetails) {
            // Ocultar loading
            loadingText.style.display = 'none';
            movieDetailsContainer.style.display = 'block';
            
            renderMovieDetails(movieDetails);
            
            // Actualizar el título de la página
            document.title = `${movieDetails.title} - Moviefy`;
        } else {
            throw new Error('No se pudieron obtener los detalles de la película');
        }

    } catch (error) {
        loadingText.textContent = 'Error al cargar los detalles de la película';
        console.error('Error loading movie details:', error);
    }
};

// Ejecutar cuando se carga la página
document.addEventListener('DOMContentLoaded', loadMovieDetails);