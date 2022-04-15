import {
    getCityData,
    favoriteCities,
    addToFavoriteCities,
    deleteFromFavoriteCities
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
    },
    DETAILS: {
        CITY: document.querySelector('.main__block-details-city'),
        TEMPERATURE: document.querySelector('.weather-temperature'),
        FEELS_LIKE: document.querySelector('.weather-feels'),
        WEATHER_DESCRIPTION: document.querySelector('.weather-weather'),
        SUNRISE: document.querySelector('.weather-sunrise'),
        SUNSET: document.querySelector('.weather-sunset'),
    },
    FORECAST: {
        TAB: document.querySelector('#tab_3'),
    }
}

UI_ELEMENTS.FORM.addEventListener('submit', getCityData);
UI_ELEMENTS.LIKE_BUTTON.addEventListener('click', createFavoriteCity);

export function clearSearchInput() {
    UI_ELEMENTS.SEARCH_INPUT.value = '';
}

export function showCityData(result) {
    const temperature = `${Math.round(result.main.temp)}°`;
    const feelsLike = `${Math.round(result.main.feels_like)}°`;
    const weatherImage = `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`;
    const sunrise = new Date(result.sys.sunrise * 1000).toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
    });
    const sunset = new Date(result.sys.sunset * 1000).toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
    });

    UI_ELEMENTS.CURRENT_INFO.TEMPERATURE.textContent = temperature;
    UI_ELEMENTS.CURRENT_INFO.IMAGE.src = weatherImage;
    UI_ELEMENTS.CURRENT_INFO.IMAGE.classList.add('img');
    UI_ELEMENTS.CURRENT_INFO.CITY.textContent = result.name;

    UI_ELEMENTS.DETAILS.CITY.textContent = result.name;
    UI_ELEMENTS.DETAILS.TEMPERATURE.textContent = `Temperature: ${temperature}`;
    UI_ELEMENTS.DETAILS.FEELS_LIKE.textContent = `Feels like: ${feelsLike}`;
    UI_ELEMENTS.DETAILS.WEATHER_DESCRIPTION.textContent = `Weather: ${result.weather[0].main}`;
    UI_ELEMENTS.DETAILS.SUNRISE.textContent = `Sunrise: ${sunrise}`;
    UI_ELEMENTS.DETAILS.SUNSET.textContent = `Sunset: ${sunset}`;

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

export function showForecast(result) {
    eraseCurrentForecast();

    const newForecastCityName = document.querySelector('.template__city-name').content.firstElementChild.cloneNode(true);
    UI_ELEMENTS.FORECAST.TAB.appendChild(newForecastCityName);
    newForecastCityName.textContent = result.city.name;

    const forecastList = result.list;
    forecastList.forEach(item => createForecastItems(item));
}

function createForecastItems(item) {
    const newForecastItem = document.querySelector('.template').content.firstElementChild.cloneNode(true);
    UI_ELEMENTS.FORECAST.TAB.appendChild(newForecastItem);

    const forecastTime = newForecastItem.children[0];
    const forecastDate = forecastTime.children[0];
    const forecastHours = forecastTime.children[1];

    const forecastProperties = newForecastItem.children[1];
    const forecastTemperature = forecastProperties.children[0];
    const forecastActualTemperature = forecastTemperature.children[0];
    const forecastFeelsLike = forecastTemperature.children[1];
    const forecastWeather = forecastProperties.children[1];
    const forecastCondition = forecastWeather.children[0];
    const forecastConditionImage = forecastWeather.children[1];

    const temperature = `${Math.round(item.main.temp)}°`;
    const feelsLike = `${Math.round(item.main.feels_like)}°`;
    const weatherImage = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

    forecastDate.textContent = new Date(item.dt * 1000).toLocaleDateString('en-GB', {
        month: 'short',
        day: '2-digit',
    });
    forecastHours.textContent = new Date(item.dt * 1000).toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
    });
    forecastActualTemperature.textContent = `Temperature: ${temperature}`;
    forecastFeelsLike.textContent = `Feels like: ${feelsLike}`;
    forecastCondition.textContent = item.weather[0].main;
    forecastConditionImage.src = weatherImage;
    forecastConditionImage.classList.add('server-img');
}

function eraseCurrentForecast() {
    UI_ELEMENTS.FORECAST.TAB.innerHTML = ``;
}