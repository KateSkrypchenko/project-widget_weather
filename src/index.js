import './sass/index.scss';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const refs = {
  inputWeather: document.querySelector('.form__input'),
  buttonWeather: document.querySelector('.form__button'),
  weatherBox: document.querySelector('.weather'),
  loadingBox: document.querySelector('.weather__loading'),
};

refs.inputWeather.addEventListener('input', inputNameCountry);

function inputNameCountry(event) {
  if (!event.target.value) {
    return;
  } else {
    refs.buttonWeather.disabled = false;
    refs.buttonWeather.addEventListener('click', searchWeather);
  }
}

function searchWeather() {
  refs.buttonWeather.disabled = true;
  refs.buttonWeather.removeEventListener('click', searchWeather);
  const nameCity = refs.inputWeather.value.trim();
  loadWeather();
  fetchWeather(nameCity).then(getWeather).catch(reject);
  refs.loadingBox.style.display = 'none';
  refs.inputWeather.value = '';
}

function loadWeather() {
  refs.loadingBox.style.display = 'block';
}

function fetchWeather(cityName) {
  const apiKey = '573f6fb0ff5cdca2d7a2390ecbfe3f81';
  const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${apiKey}`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function getWeather(data) {
  const location = data.name;
  const temp = Math.round(data.main.temp);
  const feelslike = Math.round(data.main.feels_like);
  const weatherStatus = data.weather[0].main;
  const weatherIcon = data.weather[0].icon;

  const template = `
          <p class="weather__city"><span>City:</span> ${location}</p>
          <p class="weather__status"><span>Weather:</span> ${weatherStatus}</p>
          <div class="weather__icon">
            <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Clouds" />
          </div>
          <p class="weather__temp"><span>Temperature</span> ${temp} &#8451;</p>
          <p class="weather__feels-like"><span>Feels like:</span> ${feelslike} &#8451;</p>
        `;

  refs.weatherBox.innerHTML = template;
}

function reject() {
  toastr.error('Oops, there is no city with that name');
}
