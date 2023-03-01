import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './js/fetchImages';

const search = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1 ;
let query = '';
let maxHits = 0;
const pageSize = 40;

function clearMarkup() {
  page;
  gallery.innerHTML = '';
}

function addElementMarkup(webformatURL, largeImageURL, tags, likes, views, comments, downloads) {
  const galleryMarkup = gallery.innerHTML;
  const newItem = `<a href='${largeImageURL}' class='photo-card'>
                        <img src='${webformatURL}' alt='${tags}' class='image-item' loading='lazy' />
                        <div class='info'>
                            <p class='info-item'>
                                <b>Likes</b>
                                ${likes}
                            </p>
                            <p class='info-item'>
                                <b>Views</b>
                                ${views}
                            </p>
                            <p class='info-item'>
                                <b>Comments</b>
                                ${comments}
                            </p>
                            <p class='info-item'>
                                <b>Downloads</b>
                                ${downloads}
                            </p>
                        </div>
                    </a>`;
  gallery.innerHTML = galleryMarkup + newItem;
}
function addMarkup(data) {
  data.map(({
              webformatURL,
              largeImageURL,
              tags,
              likes,
              views,
              comments,
              downloads,
            }) => addElementMarkup(webformatURL, largeImageURL, tags, likes, views, comments, downloads));
  var lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    spinner: true,
  });
  let coolDown = null;
  lightbox.on('shown.simplelightbox', () => {
    coolDown = setInterval(() => {
      lightbox.next();
    }, 7000);
  });
  lightbox.on('close.simplelightbox', () => {
    clearInterval(coolDown);
  });
}
function loadMore(query, page) {
  fetchImages(query, page)

    .then(resp => {
      if (resp.status !== 200) {}
      return resp.data;
    })
    .then(respData => {
      if (respData.totalHits === 0) {
        return Promise.reject({ message: `Sorry, there are no images matching your search query. Please try again.` });
      }
      return respData;
    })
    .then(respData => {
      maxHits = respData.totalHits;
      const maxPageNumber = Math.ceil(maxHits / 40);
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${maxHits} images.`);
      }
      if (maxPageNumber > 1) {
        Notiflix.Notify.info(`Pagination status: ${page} of ${maxPageNumber}`);
      }
      if (maxHits < pageSize * (page)) {
        toggleShowMoreButton(false);
        Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
      } else {
        toggleShowMoreButton(true);
      }
      return respData.hits;
    })
    .then(data => {
      addMarkup(data);
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
}

function onSubmit(event) {
  event.preventDefault();
  query = search.elements.searchQuery.value.trim();
  if (query.length === 0) {
    return clearMarkup();
  } else if (query.length === 1) {
    clearMarkup()
    loadMoreBtn;
    return Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`);
  } else {
    clearMarkup();
    return loadMore(query, page);
  }
}
function onNeedMore() {
  page++;
  loadMore(query, page);
}

const toggleShowMoreButton = (visible) => {
  if (visible) {
    loadMoreBtn.classList.remove('visually-hidden', );
  } else if (!visible) {
    loadMoreBtn.classList.add('visually-hidden');
  }
};

search.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onNeedMore);