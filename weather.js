const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.container-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummerImg = document.querySelector('.weather-summery-img');
const currentDateTxt = document.querySelector('.current-date-txt');
const forecastContainer = document.querySelector('#forecast-container');  // اضافه کردن این خط برای forecast

const apikey = '0a9e5992157468289294525f17a548ab';

// Mapping of weather conditions to your custom images
const weatherImages = {
    'Clear': 'images/clear.png',
    'Clouds': 'images/cloudy.png',
    'Rain': 'images/rainy.png',
    'Thunderstorm': 'images/thunder.png',
    'Drizzle': 'images/drizzling.png',
    'Mist': 'images/mist.png',
    'Snow': 'images/snowy.png',
    'mist': 'images/mist.png',
    'Haze': 'images/haze.png',
};

// Event listeners to trigger weather info update
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

// Fetch weather data from API
async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// Update weather information in the DOM
async function updateWeatherInfo(city) {
    try {
        const weatherData = await getFetchData('weather', city);
        const forecastData = await getFetchData('forecast', city); // دریافت پیش‌بینی وضعیت آب و هوا

        if (weatherData.cod !== 200) {
            showDisplaySection(notFoundSection);
            return;
        }

        const {
            name: country,
            main: { temp, humidity },
            weather: [{ main: weatherCondition }],
            wind: { speed }
        } = weatherData;

        const normalizedWeatherCondition = weatherCondition.charAt(0).toUpperCase() + weatherCondition.slice(1).toLowerCase();

        // Update DOM with the fetched data
        countryTxt.textContent = country;
        tempTxt.textContent = `${temp}°C`;
        conditionTxt.textContent = weatherCondition;
        humidityValueTxt.textContent = `${humidity}%`;
        windValueTxt.textContent = `${speed} m/s`;

        const weatherImage = weatherImages[normalizedWeatherCondition] || 'images/default-image.png';
        weatherSummerImg.src = weatherImage;

        const currentDate = new Date();
        currentDateTxt.textContent = currentDate.toLocaleDateString();

        // Update forecast section
        updateForecast(forecastData);

        showDisplaySection(weatherInfoSection);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showDisplaySection(notFoundSection);
    }
}

// Update forecast data in the DOM
function updateForecast(forecastData) {
    forecastContainer.innerHTML = '';  // پاک کردن محتوای قبلی

    const forecastList = forecastData.list.slice(0, 4);  // فقط چهار پیش‌بینی اول
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' });
        const temp = Math.round(item.main.temp);
        const weatherCondition = item.weather[0].main;
        const weatherImage = weatherImages[weatherCondition.charAt(0).toUpperCase() + weatherCondition.slice(1).toLowerCase()] || 'images/default-image.png';

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        forecastItem.innerHTML = `
            <h5 class="forecast-item-date regular-txt">${day}</h5>
            <img src="${weatherImage}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${temp}°C</h5>
        `;

        forecastContainer.appendChild(forecastItem);
    });

    forecastContainer.style.display = 'flex';  // نمایش بخش پیش‌بینی
}

// Show or hide the relevant sections
function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach((sec) => {
        sec.style.display = 'none';
    });
    section.style.display = 'flex';
}
