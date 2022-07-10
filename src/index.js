import "./css/style.css";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages, resetPage } from "./js/fetchImages";
import { createImageCards } from "./js/createImageCards";

const refs = {
    form: document.querySelector('.search-form'),
    imagesContainer: document.querySelector('.gallery'),
    controllerScroll: document.querySelector('.scroll-guard'),
}
let imageName = '';
let counterImages = 0;

refs.form.addEventListener('submit', onFormSubmit);

let lightbox = new SimpleLightbox('.photo-card a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});

async function onFormSubmit(e) {
    e.preventDefault();
    clearGalleryContainer();

    imageName = refs.form.elements.searchQuery.value.trim();

    try {
        resetPage();
        
        const options = {
            rootMargin: '200px',
            threshold: 1.0,
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fetchImages(imageName).then(({ images, totalHits }) => {
                        if (images.length === 0 || imageName === '') {
                            clearGalleryContainer();
                            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                        } else {
                            refs.imagesContainer.insertAdjacentHTML('beforeend', createImageCards(images));
                            lightbox.refresh();
                            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
                        }
                    });
                }
            });
}, options);

    observer.observe(refs.controllerScroll);
    } catch (error) {
        console.log(error);
    }
}

function clearGalleryContainer() {
    refs.imagesContainer.innerHTML = '';
}