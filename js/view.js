import {
    getCityData, favoriteCities, addToFavoriteCities, deleteFromFavoriteCities
} from './main.js'

export const UI_ELEMENTS = {
    FORM: document.querySelector('.header-form'),
    SEARCH_INPUT: document.querySelector('.header-input'),
    SEARCH_BUTTON: document.querySelector('.header-button'),
    LIKE_BUTTON: document.querySelector('.like-city'),
    CURRENT_INFO: {
        TEMPERATURE: document.querySelector('.main__block-info-now-temper'),
        IMAGE: document.querySelector('.main__block-info-now-weather-img'),
        CITY: document.querySelector('.city'),
    }
}

UI_ELEMENTS.FORM.addEventListener('submit', getCityData);
UI_ELEMENTS.LIKE_BUTTON.addEventListener('click', createFavoriteCity);

export function clearSearchInput() {
    UI_ELEMENTS.SEARCH_INPUT.value = '';
}

export function showCityData(result) {
    UI_ELEMENTS.CURRENT_INFO.TEMPERATURE.textContent = `${Math.round(result.main.temp)}°`;
    UI_ELEMENTS.CURRENT_INFO.IMAGE.src = `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`;
    UI_ELEMENTS.CURRENT_INFO.IMAGE.classList.add('img');
    UI_ELEMENTS.CURRENT_INFO.CITY.textContent = result.name;
    clearSearchInput();
}

function createFavoriteCity() {
    const isValid = (UI_ELEMENTS.CURRENT_INFO.CITY.textContent && (favoriteCities.findIndex(item => item.name === UI_ELEMENTS.CURRENT_INFO.CITY.textContent) < 0));
    const favoriteCitiesList = document.querySelector('.main__block-locations-list-items');
    const favoriteCityDiv = document.createElement('div');
    const favoriteCity = document.createElement('button');
    const deleteFavoriteCity = document.createElement('button')
    favoriteCityDiv.className = 'main__block-locations-item';
    favoriteCity.className = 'main__block-locations-item-link';
    deleteFavoriteCity.className = 'delete-button';
    favoriteCity.textContent = UI_ELEMENTS.CURRENT_INFO.CITY.textContent;
    if (isValid) {
        addToFavoriteCities(favoriteCities, favoriteCity);
        favoriteCitiesList.append(favoriteCityDiv);
        favoriteCityDiv.append(favoriteCity);
        favoriteCityDiv.append(deleteFavoriteCity);
        favoriteCity.addEventListener('click', clearSearchInput);
        favoriteCity.addEventListener('click', getCityData);
        deleteFavoriteCity.addEventListener('click', deleteCity);
    }
}

function deleteCity() {
    const city = this.closest('.main__block-locations-item').children[0].textContent;
    deleteFromFavoriteCities(favoriteCities, city);
    this.closest('.main__block-locations-item').remove();
}