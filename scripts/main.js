import {fetchWeather} from "./api.js"

fetchWeather("jaipur").then((data) => {console.log(data);})