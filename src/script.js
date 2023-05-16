let cityResult = "Melbourne";
let apiKey = "dc051b10a64333cf3ob6tb0e6afc3da3";
let apiUrl = `https://api.shecodes.io/weather/v1/current?query=`;
// update city name
function getCity(event) {
  event.preventDefault();
  let city = document.querySelector("#citySearch");
  if (city.value) {
    let cityResult = `${city.value}`;
    axios
      .get(`${apiUrl}${cityResult}&key=${apiKey}&units=metric`)
      .then(showTemperature);
  } else {
  }
}
let citySearch = document.querySelector("#search");
citySearch.addEventListener("submit", getCity);

// show current date/time information
function updateDateTime() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currentDate.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let date = currentDate.getDate();
  let month = months[currentDate.getMonth()];
  let year = currentDate.getFullYear();
  let hour = currentDate.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = currentDate.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `${day} ${date} ${month} ${year}, ${hour}:${minute}`;
}
let date = document.querySelector("h2#datetime");
let currentDate = new Date();
date.innerHTML = updateDateTime(currentDate);

// show temperature of searched/geolocation city
function showTemperature(response) {
  let temperature = Math.round(response.data.temperature.current);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${temperature}°C`;
  let temperatureDesc = document.querySelector("#temperature-description");
  temperatureDesc.innerHTML = response.data.condition.description;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.temperature.humidity}%`;
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Windspeed: ${Math.round(
    response.data.wind.speed
  )}km/h`;
  let feelsLike = document.querySelector("#feels");
  feelsLike.innerHTML = `Feels like: ${Math.round(
    response.data.temperature.feels_like
  )}°C`;
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.city;
  let updateTime = document.querySelector(".last-updated");
  updateTime.innerHTML = formatDate(response.data.time * 1000);
  let currentIcon = document.querySelector("#main-icon");
  currentIcon.setAttribute("src", `${response.data.condition.icon_url}`);
  currentIcon.setAttribute("alt", `${response.data.condition.description}`);
  getForecast(response.data.coordinates);
}

axios
  .get(`${apiUrl}${cityResult}&key=${apiKey}&units=metric`)
  .then(showTemperature);

// API weather last updated
function formatDate(timestamp) {
  let updateDate = new Date(timestamp);
  let hours = updateDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = updateDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[updateDate.getDay()];
  let date = updateDate.getDate();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[updateDate.getMonth()];
  let year = updateDate.getFullYear();
  return `Weather data last updated: ${day} ${date} ${month} ${year}, ${hours}:${minutes}`;
}

// show temperature of current location
function showPosition(position) {
  let long = position.coords.longitude;
  let lat = position.coords.latitude;
  let locUrl = `https://api.shecodes.io/weather/v1/current?lon=${long}&lat=${lat}&key=${apiKey}`;
  axios.get(`${locUrl}`).then(showTemperature);
}

function getCurrentPosition(position) {
  console.log(navigator.geolocation.getCurrentPosition(showPosition));
}

let currentLoc = document.querySelector("#location");
currentLoc.addEventListener("click", getCurrentPosition);

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index < 7) {
      forecastHTML =
        forecastHTML +
        `<div class="col forecast-col h-100">
       <div class="row forecast-day">${formatDay(forecastDay.time)}</div>
       <div class="row">

       <div class="col forecast-icon">
         <img src=
        "${forecastDay.condition.icon_url}" alt=
      "${forecastDay.condition.description}"></div>

       </div>
       <div class="row forecast-desc">${forecastDay.condition.description}</div>
       <div class="row forecast-temp">
         <span class="forecast-min">${Math.round(
           forecastDay.temperature.minimum
         )}°C</span> |
         <span class="forecast-max">${Math.round(
           forecastDay.temperature.maximum
         )}°C</span>
       </div>
       
     </div>`;
    }
  });
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let apiKey = "dc051b10a64333cf3ob6tb0e6afc3da3";
  let locUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(`${locUrl}`).then(displayForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //let day = date.getDay();
  let day = days[date.getDay()];
  return day;
}
