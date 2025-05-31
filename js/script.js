import { API_CONFIG } from "./config"

//Peticiones
const API_HEADERS = {
    'Authorization': `Bearer ${API_CONFIG.token}`,
    'Content-Type': 'application/json'
};

//Selectores DOM
const moviesContainer = document.querySelector('.movies')
const searchInput = document.querySelector('#search')
const searchButton = document.querySelector('#search-btn')

function getNowPlayingMovies(){

    try{
        const response = await fetch(`${API_CONFIG.baseUrl}/movie/now_playing?language=es-MX&page=1`,{
            headers: API_HEADERS
        });

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.results;

    } catch(error) {
        console.error('Error fetching movies: ', error);
        return[];
    }

};