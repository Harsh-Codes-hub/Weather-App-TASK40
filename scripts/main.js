import { fetchWeather } from "./api.js";

// ===== Elements =====
const elements = {
  searchForm: document.querySelector(".search-form"),

  searchInput: document.querySelector(".search-input"),

  weatherCard: document.querySelector(".weather-card"),

  weatherLocation: document.querySelector(".weather-card-location"),

  weatherDate: document.querySelector(".weather-card-date"),

  weatherIcon: document.querySelector(".weather-card-icon"),

  weatherTemperature: document.querySelector(".weather-card-temperature"),

  weatherCondition: document.querySelector(".weather-card-condition"),

  feelsLike: document.querySelectorAll(".weather-detail-value")[0],

  humidity: document.querySelectorAll(".weather-detail-value")[1],

  wind: document.querySelectorAll(".weather-detail-value")[2],

  weatherAlert: document.querySelector(".weather-alert"),

  weatherAlertText: document.querySelector(".weather-alert-text"),

  errorMessage: document.querySelector(".error-message"),

  errorMessageText: document.querySelector(".error-message-text"),

  loader: document.querySelector(".loader"),
};

// ===== Functions =====

// Render Weather Function
function renderWeather(data) {
  elements.weatherLocation.textContent = `${data.name}, ${data.sys.country}`;

  elements.weatherTemperature.textContent = `${Math.round(data.main.temp)}°`;

  elements.weatherCondition.textContent = data.weather[0].main;

  elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;

  elements.humidity.textContent = `${data.main.humidity}%`;

  elements.wind.textContent = `${data.wind.speed} km/h`;

  const weatherState = getWeatherState(data);

  elements.weatherIcon.textContent = getWeatherIcon(weatherState);

  applyTheme(weatherState);

  applyWeatherAlert(weatherState);
}

// Weather Icon Function

function getWeatherIcon(condition) {
  const weatherIcons = {
    calm: "☀️",
    rain: "🌧️",
    storm: "⛈️",
    cold: "❄️",
    heat: "🔥",
    windy: "🌪️",
  };

  return weatherIcons[condition] || "🌍";
}

// Weather State Function
function getWeatherState(data) {
  const condition = data.weather[0].main;

  const temperature = data.main.temp;

  const windSpeed = data.wind.speed;

  if (condition === "Thunderstorm") {
    return "storm";
  }

  if (condition === "Rain" || condition === "Drizzle") {
    return "rain";
  }

  if (temperature >= 35) {
    return "heat";
  }

  if (temperature <= 10) {
    return "cold";
  }

  if (windSpeed >= 12) {
    return "windy";
  }

  return "calm";
}

// Apply Theme Function
function applyTheme(weatherState) {
  document.body.className = `${weatherState}-theme`;
}

// Apply Weather Alert Function
function applyWeatherAlert(weatherState) {
  const alertMessages = {
    calm: "🌤 Calm and comfortable weather outside. Enjoy your day.",

    heat: "🔥 Extreme heat detected. Stay hydrated and avoid direct sunlight.",

    cold: "❄ Extremely cold weather. Wear warm protection before going outside.",

    rain: "🌧 Rainy conditions detected. Carry protection before going outside.",

    storm:
      "⛈ Thunderstorm conditions detected. Avoid unnecessary outdoor travel.",

    windy: "🌪 Strong winds detected. Travel carefully outdoors.",
  };

  elements.weatherAlert.className = `weather-alert weather-alert--${weatherState}`;

  elements.weatherAlertText.textContent = alertMessages[weatherState];
}

// Loader Functions
function showLoader() {
  elements.loader.classList.remove("hidden");
}

function hideLoader() {
  elements.loader.classList.add("hidden");
}

// Error Function

function showError(message) {
  elements.errorMessage.classList.remove("hidden");

  elements.errorMessageText.textContent = message;
}

function hideError() {
  elements.errorMessage.classList.add("hidden");
}

// Clear Weather Card Function
function clearWeather() {
  elements.weatherLocation.textContent = "--";

  elements.weatherTemperature.textContent = "--°";

  elements.weatherCondition.textContent = "No weather data";

  elements.feelsLike.textContent = "--°";

  elements.humidity.textContent = "--%";

  elements.wind.textContent = "-- km/h";

  elements.weatherIcon.textContent = "🌍";

  document.body.className = "default-theme";

  elements.weatherAlert.className = "weather-alert hidden";
}

// ===== Interactions Simulation =====

elements.searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = elements.searchInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");

    return;
  }

  try {
    hideError();

    showLoader();

    const data = await fetchWeather(city);

    if (data.cod === "404") {
      throw new Error("City not found.");
    }

    renderWeather(data);

    hideLoader();
  } catch (error) {
    hideLoader();

    clearWeather();

    showError(error.message);
  }
});
