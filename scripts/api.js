import { API_KEY, BASE_URL } from "./config.js";

export async function fetchWeather(city) {
  const response = await fetch(
    `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`,
  );

  const data = await response.json();

  return data;
}
