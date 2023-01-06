import './css/styles.css';
import {CountriesService} from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchInput: document.querySelector("#search-box"),
    ulList: document.querySelector(".country-list"),
    divInfo: document.querySelector('.country-info'),
};

// Створюємо екземплр класу CountriesService
const countriesService = new CountriesService();

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

// отримання тексту введеного користувачем в input
function onSearch(event) {
    event.preventDefault();
    if (event.target.value.trim() === '') {
        clearPage();
        return
    };
    countriesService.searchInput = event.target.value.trim();
    countriesService.fetchCountries().then(data => renderMarkup(data)).catch(handleError);
}

// повідомлення користувачу про помилку
const handleError = () => {
    clearPage();
    Notify.failure('Oops, there is no country with that name')
}

// Ф-ція створення розмітки для однієї країни
function markupOneCountry(data) {
    return data.map(country => {
        return `<img src="${country.flags.svg}" alt="Flag" width="30" height="24"></img>
                <h2 class="country-info-title">${country.name.official}</h2>
            <p>Capital: <span>${country.capital}</span></p><p>Population: <span>${country.population }</span></p><p>Languages: <span>${Object.values(country.languages)}</span></p>`
    }).join('');
}

// створення розмітки для  2-10 країн
function markupMoreCountries(data) {
    return data.map(country => {
        return `<li class="country-list-item"><img src="${country.flags.svg}" alt="Flag" width="20" height="16"></img>${country.name.official}</li>`
    }).join('');
}

// рендерить розмітку в залежності від к-ті країн
function renderMarkup(data) {
    clearPage();
    if (data.length === 1) {
        refs.divInfo.insertAdjacentHTML('beforeend', markupOneCountry(data)) 
    } else if (data.length > 1 && data.length <= 10) {
        refs.ulList.insertAdjacentHTML('beforeend', markupMoreCountries(data))
    } else if (data.length > 10){
        Notify.info('Too many matches found. Please enter a more specific name.')
    }
}

// Ф-ція очищення розмітки
function clearPage() {
    refs.divInfo.innerHTML = '';
    refs.ulList.innerHTML = '';
}