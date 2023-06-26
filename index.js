// // url = "http://www.omdbapi.com/?s=tt3896198&apikey=7cbdd6c7"
// //https://www.omdbapi.com/?s=avengers&page=2&apikey=7cbdd6c7

const movieSearchBox = document.getElementById('movie-search-box'); //input tag for searching movi title 
const searchList = document.getElementById('search-list');    // search list where search result should display
const favoriteList = document.getElementById('favorite-list');  // container where favorate movi will get stored


let favoriteMovies = [];




movieSearchBox.addEventListener('input', debounce(findMovies, 300));


// function for fetch the api 
async function loadMovies(searchTerm) {
    const url = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=7cbdd6c7`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === 'True') {
            displayMovieList(data.Search);
        }
    } catch (error) {
        console.log('Error fetching data:', error);
    }
}

//function for find the movi 
function findMovies() {
    let searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        loadMovies(searchTerm);
        searchList.style.opacity = '1';// if user search something then only search list and result will  get visiable

    } else {
        searchList.innerHTML = '';
        searchList.style.opacity = '0';
    }
}



// function for display the movi list
function displayMovieList(movies) {
    searchList.innerHTML = '';

    movies.forEach(movie => {
        const movieListItem = document.createElement('div');
        movieListItem.dataset.id = movie.imdbID;
        movieListItem.classList.add('search-list-item');

        const moviePoster = movie.Poster !== 'N/A' ? movie.Poster : 'image_not_found.png';

        movieListItem.innerHTML = `<div  id ="list"class="search-item-thumbnail">
                                       <img src="${moviePoster}" alt="">
                                    </div>
                                   <div class="search-item-info">
                                      <h3>${movie.Title}</h3>
                                      <p>${movie.Type}, ${movie.Year}, <span>IMDB</span><i class="bi bi-star-fill"></i> ${movie.imdbRating}</p>
                                      </div>

                                  <div class="add-fav-btn">
                                        <button class="favorite-btn">Add to Favorites</button>

                                       </div>
                                       </div> `;

        const favoriteBtn = movieListItem.querySelector('.favorite-btn'); // button for add the favorate movi into movi list 
        favoriteBtn.addEventListener('click', () => addToFavorites(movie));

        searchList.appendChild(movieListItem); // adding child element into the search list 
    });
}






// 

// Debounce function to delay api requests while typing so that user can enter complete movi title
function debounce(func, delay) {
    let timeoutId;
    return function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, arguments);
        }, delay);
    };
}



const moviContent = document.querySelector('.movi-content'); // fetchng movi result into the container



// Function to display movie details
function displayMovieDetails(movie) {
    // Create HTML elements for movie details
    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie-info');
    movieInfo.innerHTML = `
        <div class="movie-thumbnail">
            <img src="${movie.Poster}" alt="">
        </div>
        <div class="movie-details">
            <h3>${movie.Title}</h3>
            <p>${movie.Type}, ${movie.Year}, <span>IMDB</span><i class="bi bi-star-fill"></i> ${movie.imdbRating}</p>
        </div>
    `;
    // Clear previous movie details
    moviContent.innerHTML = '';

    // Append movie details to the movi-content div
    // console.log(moviContent.appendChild(movieInfo))
    moviContent.appendChild(movieInfo);
}

// Add click event listener to search-list items
searchList.addEventListener('click', function (event) {
    const clickedItem = event.target.closest('.search-list-item');
    if (clickedItem) {
        const movieId = clickedItem.dataset.id;
        const selectedMovie = favoriteMovies.find(movie => movie.imdbID === movieId);
        if (selectedMovie) {
            displayMovieDetails(selectedMovie);
        }
    }
});



// Retrieve favorite movies from localStorage (if available)
if (localStorage.getItem('favoriteMovies')) {
    favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies'));
    updateFavoriteList();
}

// function for add the fevorite movi in to list
function addToFavorites(movie) {
    favoriteMovies.push(movie);
    updateFavoriteList(); // after addting movi into fav movi list  current list upadate
    updateLocalStorage();// upadting persistant movi list into local storage
}

// function for removing the movi form local storage and fav movi list 
function removeFromFavorites(movieId) {
    favoriteMovies = favoriteMovies.filter(movie => movie.imdbID !== movieId);
    updateFavoriteList(); // after  removing  movi form fav movi list  current list upadate
    updateLocalStorage();  // remvoing movi for form local storage 
}


  // function which update and perform opration of addding movi to fav lis 
function updateFavoriteList() {
    favoriteList.innerHTML = '';

    favoriteMovies.forEach(movie => {
        const favoriteListItem = document.createElement('div');
        favoriteListItem.classList.add('favorite-list-item');
        favoriteListItem.innerHTML = `
      <div class="favorite-item-thumbnail">
        <img src="${movie.Poster}" alt="">
      </div>
      <div class="favorite-item-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Type}, ${movie.Year}, <span>IMDB</span><i class="bi bi-star-fill"></i> ${movie.imdbRating}</p>
        <div class="fav-btn">
          <button class="remove-btn">Remove </button>
        </div>
      </div>`;

        const removeBtn = favoriteListItem.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => removeFromFavorites(movie.imdbID));

        favoriteList.appendChild(favoriteListItem);
    });
}

//function for upading local storge 
function updateLocalStorage() {
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}
