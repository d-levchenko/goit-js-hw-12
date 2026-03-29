import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const galleryList = document.querySelector('.gallery');

export const createGallery = images => {
  if (images === undefined || images === null) {
    iziToast.show({
      message: 'Sorry, we cannot resolve your search request!',
      messageColor: '#fff',
      backgroundColor: '#ef4040',
      position: 'topRight',
      icon: 'bi bi-x-octagon',
      iconColor: '#fff',
    });
    return;
  }

  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<li class='gallery-item is-loading'>
        <a class='gallery-link' href='${largeImageURL}'>
          <img class='gallery-image' src='${webformatURL}' alt='${tags}'>
        </a>
        <div class='image-description-wrapper'>
          <p class='image-text-info'>Likes <span class='additional-text-info'>${likes}</span></p>
          <p class='image-text-info'>Views <span class='additional-text-info'>${views}</span></p>
          <p class='image-text-info'>Comments <span class='additional-text-info'>${comments}</span></p>
          <p class='image-text-info'>Downloads <span class='additional-text-info'>${downloads}</span></p>
        </div>
      </li>`,
    )
    .join('');

  galleryList.insertAdjacentHTML('beforeend', markup);
};

export let lightbox = new SimpleLightbox('.gallery-link', {
  overlayOpacity: 0.8,
  captionDelay: 250,
  captionsData: 'alt',
});

export const clearGallery = () => {
  galleryList.innerHTML = '';
};

const loader = document.querySelector('.loader');

export const showLoader = () => {
  loader.classList.remove('is-hidden');
};

export const hideLoader = () => {
  loader.classList.add('is-hidden');
};

export const showGallery = () => {
  galleryList.style.display = 'flex';
};

export const hideGallery = () => {
  galleryList.style.display = 'none';
};

export const imagePromisesLoading = async (
  numberOfNewImages,
  shouldScroll = false,
) => {
  const allListItems = document.querySelectorAll('.gallery-item');
  const newItems = Array.from(allListItems).slice(-numberOfNewImages);

  const newImages = newItems.map(item => item.querySelector('.gallery-image'));

  const allPromises = newImages.map(img => {
    return new Promise((resolve, reject) => {
      if (img.complete && img.naturalHeight !== 0) {
        resolve();
        return;
      }

      img.addEventListener('load', () => {
        resolve(img);
      });

      img.addEventListener('error', () => {
        resolve(img);
      });
    });
  });

  await Promise.allSettled(allPromises).then(() => {
    newItems.forEach(item => item.classList.remove('is-loading'));

    hideLoader();
    showGallery();
    showLoadMoreButton();

    // todo scroll
    if (shouldScroll) {
      const firstNewItem = newItems[0];
      const scroll = firstNewItem.getBoundingClientRect();

      window.scrollBy({
        top: scroll.height * 2,
        behavior: 'smooth',
      });
    }
  });
};

const loadBtn = document.querySelector('.load-more-btn');

export const showLoadMoreButton = () => {
  loadBtn.classList.remove('is-hidden-btn');
};

export const hideLoadMoreButton = () => {
  loadBtn.classList.add('is-hidden-btn');
};
