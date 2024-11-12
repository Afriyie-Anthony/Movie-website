const API_KEY = `078dfb4f59005d801bf5ba4c470a918b`;
const image_path = `https://image.tmdb.org/t/p/w500`;
const triller = `https://api.themoviedb.org/3/movie/579/videos?language=en-US`;

const Search = document.getElementById("search");
const SearchBtn = document.getElementById("btn");
const main_grid_title = document.querySelector(".favorites h1");
const main_grid = document.querySelector(".favorites .movies-grid");
const popup_container = document.querySelector(".popup-container");
const trending_el = document.querySelector(".trending .movies-grid");
const main = document.getElementById("main-container");
const series = document.querySelector(".series .movies-grid-series");

const add_click_effect_to_card = (cards) => {
  cards.forEach((card) => {
    card.addEventListener("click", () => show_popup(card));
  });
};

//getMovieBySearch('game ')

SearchBtn.addEventListener("click", addSearchMoviesToDom);

async function addSearchMoviesToDom() {
  main.style.display = "none";
  const data = await getMovieBySearch(Search.value);
  // console.log(data);

  main_grid_title.innerText = `Search Results...`;
  main_grid.innerHTML = data
    .map((e) => {
      //console.log(e.title );
      return `
          <div class="card" data-id="${e.id}">
                <div class="img">
                    <img src="${image_path + e.poster_path}" alt="">
                </div>
                <div class="info">
                    <h2>${e.title}</h2>
                    <div class="single-info">
                        <span>Rate: </span>
                        <span>${e.vote_average}</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date: </span>
                        <span>${e.release_date}</span>
                    </div>
                </div>
            </div>`;
    })
    .join("");

  const cards = document.querySelectorAll(".card");
  add_click_effect_to_card(cards);
}

async function getMovieBySearch(search_item) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_item}`
  );

  const responseData = await response.json();
  // console.log(responseData.results);
  return responseData.results;
}

//popup

async function get_movie_by_id(id) {
  const resp = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
  );
  const respData = await resp.json();
  return respData;
}
async function get_movie_trailer(id) {
  const resp = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
  );
  const respData = await resp.json();
  return respData.results[0].key;
}

async function show_popup(card) {
  popup_container.classList.add("show-popup");

  const movie_id = card.getAttribute("data-id");
  const movie = await get_movie_by_id(movie_id);
  const movie_trailer = await get_movie_trailer(movie_id);

  popup_container.style.background = `linear-gradient(rgba(0, 0, 0, .9), rgba(0, 0, 0, 0.9)), url(${
    image_path + movie.poster_path
  })`;
  popup_container.style.backgroundSize = "cover";
  // popup_container.style.backgroundPosition = 'center'
  popup_container.style.backgroundRepeat = "no-repeat";

  popup_container.innerHTML = `
    <span class="x-icon">&#10006;</span>
    <div class="content">
        <div class="left">
            <div class="poster-img">
                <img src="${image_path + movie.poster_path}" alt="">
            </div>
            <div class="single-info">
                <span>Add to favorites:</span>
                <span class="heart-icon">&#9829;</span>
            </div>
        </div>
        <div class="right">
            <h1>${movie.title}</h1>
            <h3>${movie.tagline}</h3>
            <div class="single-info-container">
                <div class="single-info">
                    <span>Language:</span>
                    <span>${movie.spoken_languages[0].name}</span>
                </div>
                <div class="single-info">
                    <span>Length:</span>
                    <span>${movie.runtime} minutes</span>
                </div>
                <div class="single-info">
                    <span>Rate:</span>
                    <span>${movie.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Budget:</span>
                    <span>$ ${movie.budget}</span>
                </div>
                <div class="single-info">
                    <span>Release Date:</span>
                    <span>${movie.release_date}</span>
                </div>
            </div>
            <div class="genres">
                <h2>Genres</h2>
                <ul>
                    ${movie.genres.map((e) => `<li>${e.name}</li>`).join("")}
                </ul>
            </div>
            <div class="overview">
                <h2>Overview</h2>
                <p>${movie.overview}</p>
            </div>
            <div class="trailer">
                <h2>Trailer</h2>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${movie_trailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
    </div>
`;

  const x_icon = document.querySelector(".x-icon");
  x_icon.addEventListener("click", () =>
    popup_container.classList.remove("show-popup")
  );

  const heart_icon = popup_container.querySelector(".heart-icon");

  heart_icon.addEventListener("click", () => {
    if (heart_icon.classList.contains("change-color")) {
      remove_LS(movie_id);
      heart_icon.classList.remove("change-color");
    } else {
      add_to_LS(movie_id);
      heart_icon.classList.add("change-color");
    }

    fetch_favorite_movies();
  });
}

//Local Storage

function get_LS() {
  const movie_ids = JSON.parse(localStorage.getItem("movie-id"));
  return movie_ids === null ? [] : movie_ids;
}

function add_to_LS(id) {
  const movie_ids = get_LS();
  localStorage.setItem("movie-id", JSON.stringify([...movie_ids, id]));
}

function remove_LS(id) {
  const movie_ids = get_LS();
  localStorage.setItem(
    "movie-id",
    JSON.stringify(movie_ids.filter((e) => e !== id))
  );
}

fetch_favorite_movies();
async function fetch_favorite_movies() {
  main_grid.innerHTML = "";
  const movies_LS = await get_LS();
  const movies = [];
  for (let i = 0; i <= movies_LS.length - 1; i++) {
    const movie_id = movies_LS[i];
    let movie = await get_movie_by_id(movie_id);
    add_favorites_to_dom_from_LS(movie);
    movies.push(movie);
  }
}

function add_favorites_to_dom_from_LS(movie_data) {
  main_grid.innerHTML += `
  <div class="card" data-id="${movie_data.id}">
                <div class="img">
                    <img src="${image_path + movie_data.poster_path}" alt="">
                </div>
                <div class="info">
                    <h2>${movie_data.title}</h2>
                    <div class="single-info">
                        <span>Rate: </span>
                        <span>${movie_data.vote_average}</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date: </span>
                        <span>${movie_data.release_date}</span>
                    </div>
                </div>
            </div>
`;

  const cards = document.querySelectorAll(".card");
  add_click_effect_to_card(cards);
}

get_trending_movies();
async function get_trending_movies() {
  const resp = await fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`
  );
  const respData = await resp.json();
  return respData.results;
}

add_to_dom_trending();
async function add_to_dom_trending() {
  const data = await get_trending_movies();
  // console.log(data)

  trending_el.innerHTML = data
    .slice(0, 70)
    .map((e) => {
      // console.log(e)

      return `
    
  <div class="card" data-id="${e.id}">
    <div class="img">
        <img src="${image_path + e.poster_path}" alt="">
    </div>
    <div class="info">
        <h2>${e.title}</h2>
        <div class="single-info">
            <span>Rate: </span>
            <span>${e.vote_average}</span>
        </div>
        <div class="single-info">
            <span>Release Date: </span>
            <span>${e.release_date}</span>
        </div>
    </div>
</div>
`;
    })
    .join("");
}

get_series_movies();
async function get_series_movies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/?api_key=${API_KEY}`
  );
  const responseData = await response.json();
  return responseData.results;
}

async function add_to_dom_series() {
  const data = await get_series_movies();
  console.log(data1);

  series.innerHTML = data
    .slice(0, 10)
    .map((e) => {
      console.log(e);

      return `
    
    <div class="card" data-id="${e.id}">
    <div class="img">
        <img src="${image_path + e.poster_path}" alt="">
    </div>
    <div class="info">
        <h2>${e.title}</h2>
        <div class="single-info">
            <span>Rate: </span>
            <span>${e.vote_average}</span>
        </div>
        <div class="single-info">
            <span>Release Date: </span>
            <span>${e.release_date}</span>
        </div>
    </div>
   </div>
`;
    })
    .join("");
}

// Get elements by ID
const close = document.getElementById("close");
const navItems = document.getElementById("nav-items");
const SignupButton = document.getElementById("signup");
const Navigation = document.getElementById("nav");
const Menu = document.getElementById("bars");

// Event listener for the 'close' button to hide the navigation menu
close.addEventListener("click", () => {
  Navigation.style.display = "none";
});

// Event listener for the 'bars' button (menu icon) to show the navigation menu
Menu.addEventListener("click", () => {
  Navigation.style.display = "block";
});


// const Slider = document.getElementsByClassName('slider-wrapper')

// Slider.style.width = `${Slider.children.length * 300}px`;
