import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  imagePromisesLoading,
  lightbox,
  hideLoadMoreButton,
  hideGallery,
  showGallery,
} from './js/render-functions';

const searchForm = document.querySelector('.form');
const loadMoreButton = document.querySelector('.load-more-btn');

let userSearchText = '';
let page = 1;
const itemsPerPage = 15;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  userSearchText = searchForm.elements['search-text'].value.trim();

  if (userSearchText === '') {
    iziToast.show({
      message: 'Search field cannot be empty!',
      messageColor: '#fff',
      backgroundColor: '#ffa000',
      position: 'topRight',
      icon: 'bi bi-exclamation-triangle',
      iconColor: '#fff',
    });
    return;
  }

  clearGallery();
  showLoader();
  hideGallery();
  hideLoadMoreButton();

  page = 1;

  try {
    const data = await getImagesByQuery(userSearchText, page);

    if (data.totalHits === 0) {
      hideLoader();
      showGallery();

      iziToast.show({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        messageColor: '#fff',
        backgroundColor: '#ef4040',
        position: 'topRight',
        icon: 'bi bi-x-octagon',
        iconColor: '#fff',
      });

      return;
    }

    createGallery(data.hits);
    // lightbox.refresh();
    await imagePromisesLoading(data.hits.length);
  } catch (error) {
    hideLoader();
    showGallery();

    iziToast.show({
      message: 'Failed to load image. Please, try again!',
      messageColor: '#fff',
      backgroundColor: '#ef4040',
      position: 'topRight',
      icon: 'bi bi-x-octagon',
      iconColor: '#fff',
    });
  } finally {
    searchForm.reset();
  }
});

loadMoreButton.addEventListener('click', async () => {
  page += 1;

  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(userSearchText, page);
    const totalPages = Math.ceil(data.totalHits / itemsPerPage);

    if (page > totalPages) {
      iziToast.error({
        message: `We're sorry, but you've reached the end of search results.`,
        messageColor: '#fff',
        backgroundColor: '#09f',
        position: 'topRight',
        icon: 'bi bi-bell',
        iconColor: '#fff',
      });

      hideLoadMoreButton();
      hideLoader();
      showGallery();
      return;
    }

    createGallery(data.hits);
    // lightbox.refresh();
    // hideLoader();
    const newItems = await imagePromisesLoading(data.hits.length);
    const firstItem = newItems[0];
    const scroll = firstItem.getBoundingClientRect();

    window.scrollBy({
      top: scroll.height * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    hideLoader();

    iziToast.error({
      message: 'Failed to load new images!',
      messageColor: '#fff',
      backgroundColor: '#ef4040',
      position: 'topRight',
      icon: 'bi bi-x-octagon',
      iconColor: '#fff',
    });
  }
});
