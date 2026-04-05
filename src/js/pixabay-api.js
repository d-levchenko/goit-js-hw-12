import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const myAPI_Key = import.meta.env.VITE_API_KEY;
const defaultURL = (axios.defaults.baseURL = 'https://pixabay.com/api/');

export const getImagesByQuery = async (query, page) => {
  try {
    const response = await axios.get(defaultURL, {
      params: {
        key: `${myAPI_Key}`,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${page}`,
        per_page: 15,
      },
    });

    return response.data;
  } catch {
    iziToast.show({
      message: 'There is an error loading data from the server.',
      messageColor: '#fff',
      backgroundColor: '#ef4040',
      position: 'topRight',
      icon: 'bi bi-x-octagon',
      iconColor: '#fff',
    });
  }
};
