'use strict';
import {
    showCityData,
    showForecast,
    clearSearchInput,
    UI_ELEMENTS
} from './view.js'

const SERVER = {
    WEATHER_URL: 'http://api.openweathermap.org/data/2.5/weather',
    FORECAST_URL: `https://api.openweathermap.org/data/2.5/forecast/`,
    API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f'
}

export const favoriteCities = [];

window.addEventListener('unhandledrejection', function (event) {
    alert(event.promise);
    alert(event.reason);
});

function getCityName() {
    const cityName = UI_ELEMENTS.SEARCH_INPUT.value;
    return cityName;
}

export function getCityData() {
    try {
        const cityName = getCityName() || this.closest('.main__block-locations-item').children[0].textContent;
        const url = `${SERVER.WEATHER_URL}?q=${cityName}&appid=${SERVER.API_KEY}&units=metric`;

        clearSearchInput();

        fetch(url)
            .then(response => response.json())
            .catch(error => alert(`${error}`))
            .then(result => {
                showCityData(result);
            })
            .catch(error => alert(`${error.name}: can't find such city`));

        getCityForecast(cityName);
    }
    catch (error) {
        alert(`Enter or choose city to get data from`);
    }
}

export function addToFavoriteCities(list, city) {
    list.push({ name: city.textContent, });
}

export function deleteFromFavoriteCities(list, city) {
    let index = list.findIndex(item => item.name === city);
    if (index >= 0) {
        list.splice(index, 1);
    }
}

function getCityForecast(cityName) {
    const url = `${SERVER.FORECAST_URL}?q=${cityName}&appid=${SERVER.API_KEY}&units=metric&cnt=5`;

    fetch(url)
        .then(response => response.json())
        .catch(error => alert(`${error}`))
        .then(result => {
            showForecast(result);
        })
        .catch(error => alert(`${error.name}: can't find such city`));
}