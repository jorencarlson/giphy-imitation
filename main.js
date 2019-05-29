const mainContainer = document.querySelector('#main-container');
const form = document.querySelector('#search-form');

const loadMore = document.createElement('button');
loadMore.classList = 'btn btn-secondary w-50';
loadMore.innerHTML = 'Load More';
const loadMoreContainer = document.createElement('div');
loadMoreContainer.id = 'load-more-container';
loadMoreContainer.classList = 'd-flex justify-content-center align-items-center w-100';
loadMoreContainer.appendChild(loadMore);

const noGifsNotice = document.createElement('div');
noGifsNotice.id = 'no-gifs-notice';
noGifsNotice.classList = 'd-flex justify-content-center align-items-center alert alert-warning';
noGifsNotice.setAttribute('role', alert);

let page = {
    json: null,
    dataPosition: 0,
    type: 'trending',
    searchTerm: null,
    offset: 0,
    clearGifs: false
};

document.addEventListener('DOMContentLoaded', () => {
   loadAndDisplayGifs();
   loadMore.addEventListener('click', displayGifs);
   form.addEventListener('submit', formHandler);
});

function formHandler() {
    let searchTerm = document.forms['search-form']['search'].value;
    if (searchTerm === page.searchTerm || searchTerm === '') {
        return;
    }
    page.type = 'search';
    page.searchTerm = searchTerm;
    page.clearGifs = true;
    loadAndDisplayGifs();
}

function loadAndDisplayGifs() {
    let url;
    if (page.type === 'trending') {
        url = "https://api.giphy.com/v1/gifs/trending?api_key=cW2LdlV1oakMj85D2x8xGgsS7Yg3Ouxy&limit=100&rating=G"
    }
    else if (page.type === 'search') {
        url = `https://api.giphy.com/v1/gifs/search?api_key=cW2LdlV1oakMj85D2x8xGgsS7Yg3Ouxy&q=${page.searchTerm}&limit=100&offset=${page.offset}&rating=G&lang=en`;
    }

    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        if (json.data.length === 0) {
            if (page.clearGifs) {
                while (mainContainer.firstChild) {
                    mainContainer.removeChild(mainContainer.firstChild);
                }
                noGifsNotice.innerHTML = `No GIFs found for ${page.searchTerm}`;
                mainContainer.appendChild(noGifsNotice);
            }
            return;
        }
        page.json = json;
        page.dataPosition = 0;
        if (page.clearGifs) {
            while (mainContainer.firstChild) {
                mainContainer.removeChild(mainContainer.firstChild);
            }
        }
        displayGifs();
    })
    .catch((error) => {
        console.error(error);
    })
}

function displayGifs(json) {
    if (mainContainer.querySelector('#load-more-container') != null) {
        mainContainer.removeChild(loadMoreContainer);
    }
    for (let j = 0; j < 25 || page.dataPosition === page.json.data.length; j++) {
        let imgContainer = document.createElement('div');
        imgContainer.classList = 'my-img-container';
        let img = document.createElement('img');
        let url = page.json.data[page.dataPosition].images.fixed_height.url;
        img.setAttribute('src', url);
        imgContainer.appendChild(img);
        mainContainer.appendChild(imgContainer);
        page.dataPosition++;
    }
    if (page.dataPosition != page.json.data.length) {
        mainContainer.appendChild(loadMoreContainer);
    }
    else {
        if (page.type === 'search') {
            page.dataPosition = 0;
            page.clearGifs = false;
            page.offset = page.offset + 100;
            loadAndDisplayGifs();
        }
    }
}

