import "./css/style.css";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages, resetPage } from "./js/fetchImages";
import { createImageCards } from "./js/createImageCards";

const refs = {
    form: document.querySelector('.search-form'),
    imagesContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}
let imageName = '';
let counterImages = 0;

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

let lightbox = new SimpleLightbox('.photo-card a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});

async function onFormSubmit(e) {
    e.preventDefault();
    clearGalleryContainer();

    imageName = refs.form.elements.searchQuery.value;

    try {
    resetPage();
    refs.loadMoreBtn.classList.remove('is-visible');
        await fetchImages(imageName).then(({ images, totalHits }) => {
            refs.imagesContainer.innerHTML = createImageCards(images);
            lightbox.refresh();
            refs.loadMoreBtn.classList.add('is-visible');
            counterImages = images.length;

            if (images.length === 0 || imageName === '') {
                clearGalleryContainer();
                refs.loadMoreBtn.classList.remove('is-visible');
                Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            } else {
                Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

async function onLoadMoreBtnClick() {
    try {
        await fetchImages(imageName).then(({ images, totalHits }) => {
            refs.imagesContainer.insertAdjacentHTML('beforeend', createImageCards(images));
            lightbox.refresh();
            counterImages += images.length;

            if (counterImages > totalHits) {
                refs.loadMoreBtn.classList.remove('is-visible');
                setTimeout(() => {
                    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
                }, 2000);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

function clearGalleryContainer() {
    refs.imagesContainer.innerHTML = '';
}