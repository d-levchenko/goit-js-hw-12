import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const myAPI_Key = '55171799-755350edf6c0ed064d9a514af';
const defaultURL = (axios.defaults.baseURL = 'https://pixabay.com/api/');

export const getImagesByQuery = query => {
  return axios
    .get(defaultURL, {
      params: {
        key: `${myAPI_Key}`,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    })
    .then(response => response.data)
    .catch(() => {
      iziToast.show({
        message: 'There is an error loading data from the server.',
        messageColor: '#fff',
        backgroundColor: '#ef4040',
        position: 'topRight',
        icon: 'bi bi-x-octagon',
        iconColor: '#fff',
      });
    });
};
