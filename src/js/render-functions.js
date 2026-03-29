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
      }) => `<li class='gallery-item'>
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

  galleryList.insertAdjacentHTML('afterbegin', markup);
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
  galleryList.style.display = 'none';
  loader.classList.remove('is-hidden');
};

export const hideLoader = () => {
  loader.classList.add('is-hidden');
  galleryList.style.display = 'flex';
};

export const imagePromisesLoading = () => {
  const allImages = document.querySelectorAll('.gallery-image');

  const allPromises = Array.from(allImages).map(img => {
    return new Promise((resolve, reject) => {
      img.addEventListener('load', () => {
        resolve(img);
      });

      img.addEventListener('error', () => {
        resolve(img);
      });
    });
  });

  Promise.allSettled(allPromises).then(() => {
    hideLoader();
  });
};
