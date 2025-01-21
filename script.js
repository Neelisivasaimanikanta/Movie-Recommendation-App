const apiKey = 'YOUR_TMDB_API_KEY'; // Replace with your TMDb API key
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const movieCards = document.getElementById('movie-cards');
const trendingMovies = document.getElementById('trending-movies');
const genreSelect = document.getElementById('genre-select');
const genreBtn = document.getElementById('genre-btn');
const watchlistContainer = document.getElementById('watchlist');

let watchlist = [];

// Fetch and display trending movies
async function getTrendingMovies() {
  const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`);
  const data = await response.json();
  displayMovies(data.results, trendingMovies);
}

// Fetch and display movies based on search query
async function searchMovies(query) {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
  const data = await response.json();
  displayMovies(data.results, movieCards);
}

// Fetch and display movies based on selected genre
async function filterMoviesByGenre(genreId) {
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`);
  const data = await response.json();
  displayMovies(data.results, movieCards);
}

// Display movie cards
function displayMovies(movies, container) {
  container.innerHTML = ''; // Clear existing movies
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <div class="movie-info">
        <h4>${movie.title}</h4>
        <button class="add-to-watchlist-btn">Add to Watchlist</button>
      </div>
    `;
    container.appendChild(movieCard);

    // Add to watchlist functionality
    const addToWatchlistBtn = movieCard.querySelector('.add-to-watchlist-btn');
    addToWatchlistBtn.addEventListener('click', () => {
      addToWatchlist(movie);
    });
  });
}

// Add movie to watchlist
function addToWatchlist(movie) {
  if (!watchlist.some(item => item.id === movie.id)) {
    watchlist.push(movie);
    displayWatchlist();
  }
}

// Display watchlist
function displayWatchlist() {
  watchlistContainer.innerHTML = ''; // Clear existing watchlist
  watchlist.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <div class="movie-info">
        <h4>${movie.title}</h4>
      </div>
    `;
    watchlistContainer.appendChild(movieCard);
  });
}

// Get genres for filter
async function getGenres() {
  const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
  const data = await response.json();
  data.genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
}

// Event listeners
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
  }
});

genreBtn.addEventListener('click', () => {
  const genreId = genreSelect.value;
  if (genreId) {
    filterMoviesByGenre(genreId);
  }
});

// Initialize
getTrendingMovies();
getGenres();
