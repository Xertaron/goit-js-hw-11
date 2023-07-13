import axios from 'axios';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createGalleryCards } from './gallery-card';
const form = document.querySelector('.search-form');
const input = document.querySelector('[name="searchQuery"]');
const searchBtn = document.querySelector('[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const body = document.querySelector('body');
const loader = document.querySelector('.loader-container');

gallery.style.display = 'none';
let cardPage = null;
let totalHits = null;
let searchValue = null;

const lightbox = new simpleLightbox('.gallery a');

function onBtnSearch(e) {
  e.preventDefault();
  if (input.value.trim() === '') {
    return;
  }
  loaderStart();
  cardPage = 1;
  searchValue = input.value;
  getCard().then(cardData => {
    if (!cardData) {
      gallery.innerHTML = '';
      loadMoreBtn.style.display = 'none';
    }
    gallery.innerHTML = createGalleryCards(cardData);
    gallery.style.marginTop = '60px';
    gallery.style.display = 'flex';
    lightbox.refresh();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    loadMoreBtn.style.display = 'block';

    loaderStop();

    if (totalHits <= 40) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.style.display = 'none';
    }
  });
}
const search = searchBtn.addEventListener('click', onBtnSearch);

function onLoadMoreCards(e) {
  cardPage += 1;

  getCard().then(cardData => {
    gallery.insertAdjacentHTML('beforeend', createGalleryCards(cardData));
    lightbox.refresh();

    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (cardPage === Math.ceil(totalHits / 40)) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.style.display = 'none';
    }
  });
}
loadMoreBtn.addEventListener('click', onLoadMoreCards);

async function getCard() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '38161796-6c90593725f00dcf882dd20e0',
        q: `${searchValue}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: `${cardPage}`,
        per_page: 40,
      },
    });
    const cardData = response.data.hits;
    totalHits = response.data.totalHits;
    if (cardData.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return cardData;
  } catch (error) {
    console.error(error);
  }
}

body.onscroll = function () {
  if (window.scrollY > document.body.offsetHeight - window.outerHeight) {
    loaderStart();
    body.style.height = document.body.offsetHeight;
    onLoadMoreCards(search);
    loaderStop();
  }
};

function loaderStart() {
  body.classList.add('loading');
}

function loaderStop() {
  window.setTimeout(function () {
    body.classList.remove('loading');
    body.classList.add('loaded');
  }, 1500);
}
loaderStart();

window.addEventListener('load', () => {
  loaderStop();
});
