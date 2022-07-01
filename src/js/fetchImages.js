import axios from "axios";

axios.defaults.baseURL = 'https://pixabay.com/api/';
const DEFAULT_PAGE = 1;
let page = DEFAULT_PAGE;

export const resetPage = () => {
    page = DEFAULT_PAGE;
};

export const fetchImages = async (imageName) => {
    try {
        const searchParams = new URLSearchParams({
            key: '28337578-4a6faed3a9785284bd8e8ad21',
            q: imageName,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page,
            per_page: 40,
        });
    
        const response = await axios.get(`?${searchParams}`);
        const data = response.data;
        page += 1;

        return {
            images: data.hits,
            totalHits: data.totalHits,
        };
    } catch (error) {
        console.log(error);
    }
};