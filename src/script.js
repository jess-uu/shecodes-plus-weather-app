let celsiusActive = true;
let cityResult = "Melbourne";
//let apiKey = "b2613fc2433dc611b2f664d7a243d6bd";
let apiKey = "dc051b10a64333cf3ob6tb0e6afc3da3";
//let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
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
    celsiusActive = true;
  } else {
  }
}

let citySearch = document.querySelector("#search");
citySearch.addEventListener("submit", getCity);

// convert to FH
function convertFH(event) {
  event.preventDefault();
  if (celsiusActive === true) {
    let updateFH = document.querySelector(".currentTemp");
    let temp = parseInt(updateFH.innerHTML);
    updateFH.innerHTML = `${Math.round((temp * 9) / 5 + 32)}°F`;
    celsiusActive = false;
    convertCelsius.classList.remove("active");
    convertFahrenheit.classList.add("active");
  } else {
  }
}
//convert to CS
function convertCS(event) {
  event.preventDefault();
  if (celsiusActive === false) {
    let tempToCS = document.querySelector(".currentTemp");
    let temp = parseInt(tempToCS.innerHTML);
    let updateCS = document.querySelector(".currentTemp");
    let convertCS = Math.round(((temp - 32) * 5) / 9);
    updateCS.innerHTML = `${convertCS}°C`;
    celsiusActive = true;
    convertFahrenheit.classList.remove("active");
    convertCelsius.classList.add("active");
  } else {
  }
}

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

// capture temp conversion clicks
let convertFahrenheit = document.querySelector("#convert-fahrenheit");
convertFahrenheit.addEventListener("click", convertFH);

let convertCelsius = document.querySelector("#convert-celsius");
convertCelsius.addEventListener("click", convertCS);

// show temperature of searched city
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
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.city;
  let updateTime = document.querySelector(".last-updated");
  updateTime.innerHTML = formatDate(response.data.time * 1000);
  let currentIcon = document.querySelector("#main-icon");
  currentIcon.setAttribute("src", `${response.data.condition.icon_url}`);
  currentIcon.setAttribute("alt", `${response.data.condition.description}`);
}
// show temperature of geolocation city
function showTemperatureLoc(response) {
  let temperature = Math.round(response.data.daily[0].temperature.day);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${temperature}°C`;
  let temperatureDesc = document.querySelector("#temperature-description");
  temperatureDesc.innerHTML = response.data.daily[0].condition.description;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.daily[0].temperature.humidity}%`;
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Windspeed: ${Math.round(
    response.data.daily[0].wind.speed
  )}km/h`;
  let currentIcon = document.querySelector("#main-icon");
  currentIcon.setAttribute(
    "src",
    `${response.data.daily[0].condition.icon_url}`
  );
  currentIcon.setAttribute(
    "alt",
    `${response.data.daily[0].condition.description}`
  );
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.city;
  let updateTime = document.querySelector(".last-updated");
  updateTime.innerHTML = formatDate(response.data.daily[0].time * 1000);
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
  return `Updated: ${day} ${date} ${month} ${year}, ${hours}:${minutes}`;
}

// show temperature of current location
function showPosition(position) {
  let long = position.coords.longitude;
  let lat = position.coords.latitude;
  let locUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${long}&lat=${lat}&key=${apiKey}`;
  axios.get(`${locUrl}`).then(showTemperatureLoc);
  celsiusActive = true;
}

function getCurrentPosition(position) {
  console.log(navigator.geolocation.getCurrentPosition(showPosition));
}

let currentLoc = document.querySelector("#location");
currentLoc.addEventListener("click", getCurrentPosition);
