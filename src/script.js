let celsiusActive = true;
let cityResult = "Melbourne";
let apiKey = "b2613fc2433dc611b2f664d7a243d6bd";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;

// update city name
function getCity(event) {
  event.preventDefault();
  let city = document.querySelector("#citySearch");
  if (city.value) {
    let cityResult = `${city.value}`;
    axios
      .get(`${apiUrl}${cityResult}&appid=${apiKey}&units=metric`)
      .then(showTemperature);
    celsiusActive = true;
  } else {
    alert("Please search for a city");
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
  let hour = currentDate.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = currentDate.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `${day}. ${hour}:${minute}`;
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
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${temperature}°C`;
  let temperatureDesc = document.querySelector("#temperature-description");
  temperatureDesc.innerHTML = response.data.weather[0].description;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Windspeed: ${Math.round(
    response.data.wind.speed
  )}km/h`;
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.name;
}
axios
  .get(`${apiUrl}${cityResult}&appid=${apiKey}&units=metric`)
  .then(showTemperature);

// show temperature of current location
function showPosition(position) {
  let long = position.coords.longitude;
  let lat = position.coords.latitude;
  let locUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(`${locUrl}`).then(showTemperature);
  celsiusActive = true;
}

function getCurrentPosition(position) {
  console.log(navigator.geolocation.getCurrentPosition(showPosition));
}

let currentLoc = document.querySelector("#location");
currentLoc.addEventListener("click", getCurrentPosition);
