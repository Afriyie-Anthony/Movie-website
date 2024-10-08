const APIURL = "https://api.themoviedb.org/3/movie/11?api_key=078dfb4f59005d801bf5ba4c470a918b&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w80";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=078dfb4f59005d801bf5ba4c470a918b&query=";
const moiveBox = document.querySelector("#movie-box")
const getMovies = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    showMovies(data)
}
getMovies(APIURL);


const showMovies = (data) => {
    moiveBox.innerHTML = "";
    data.results.forEach(
        (result) => {
            const imagePath = result.poster_path === null ? "img/image-missing.png" : IMGPATH + result.poster_path;
            // const box = `
            // <div class="box">
            //     <img src="${IMGPATH+result}" alt="" />
            //     <div class="overlay">
            //         <h2>Overview:</h2>
            //         Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis iste doloribus quam voluptatum, illum unde nostrum dignissimos, mollitia, sapiente porro natus neque cupiditate distinctio quod possimus aliquid reiciendis vel. Soluta?
            //     </div>
            // </div>
            // `
            const box = document.createElement("div")
            box.classList.add("box")
            box.innerHTML = `
                <img src="${imagePath}" alt="" />
                <div class="overlay">
                    <div class="title"> 
                        <h2> ${result.original_title}  </h2>
                        <span> ${result.vote_average} <span>
                    </div>
                    <h3>Overview:</h3>
                    <p> 
                        ${result.overview}
                    </p>
                 </div>
            `
            moiveBox.appendChild(box)
        }
    )
}

document.querySelector("#SearchInput").addEventListener(
    "keyup",
    function (event) {
        if (event.target.value != "") {
            getMovies(SEARCHAPI + event.target.value)
        } else {
            getMovies(APIURL);
        }
    }
)