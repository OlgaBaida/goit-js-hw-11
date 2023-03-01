import axios from "axios";

const axios = require('axios').default;
 export default async function fetchImages(value, page) {
    try {
        const URL = 'https://pixabay.com/api/';
        const KEY = '33786745-ab504289eb25e6d76811a9796';
        const filter = `?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
        const response = await axios.get(`${URL}${filter}`);
        return response
        
    } catch (error) {
        console.error(error);
    }
};