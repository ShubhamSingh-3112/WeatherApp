const city = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-button");
const weatherInfoSection = document.querySelector(".weather-info")
const notFoundSection = document.querySelector(".not-found");
const searchSection = document.querySelector(".search-city")
const apiKey = 'a0b1d2fb75f2a6409d7694b075cd3546';

const countryText = document.querySelector(".country-text");
const temptext = document.querySelector(".temp-text");
const conditionText = document.querySelector(".condition-text");

const humidityValue = document.querySelector(".humidity-value-text");
const windValue = document.querySelector(".wind-value-text");

const weatherSummaryImg = document.querySelector(".weather-summary-image");
const currentDate = document.querySelector(".current-date")

const forecastItemContainer = document.querySelector(".forecast-items-container");

searchBtn.addEventListener("click",()=>{
    if(city.value.trim() !== ""){
        updateWeather(city.value);
        city.value = '';
        city.blur();
    }
})

city.addEventListener("keydown",(evt)=>{
    if(evt.key === "Enter" && city.value.trim() !== ""){
        updateWeather(city.value);
        city.value = '';
        city.blur();
    }
})

const getFetchData = async (endPoint, city) => {
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiURL);
    return response.json();
}
const getWeatherIcon = (id) => {
    if(id<=232) return "thunderstorm.svg";
    if(id<=321) return "drizzle.svg";
    if(id<=531) return "rain.svg";
    if(id<=622) return "snow.svg";
    if(id<=781) return "atmosphere.svg";
    if(id<=800) return "clear.svg";
    else return "clouds.svg";
}

const getCurrentDate = () => {
    const current = new Date();
    const options = {
        weekday : "short",
        day : "2-digit",
        month : 'short'
    }
    return current.toLocaleDateString('en-GB',options);
}


const updateWeather = async (city) => {
    const weatherData = await getFetchData("weather", city);
    if(weatherData.cod !== 200){
        displaySection(notFoundSection);
        return;
    }
    const {
        name : country,
        main : {temp, humidity},
        weather : [{ id,main}],
        wind : {speed}
    } = weatherData;

    countryText.textContent = country;
    temptext.textContent = Math.round(temp) + ' °C';
    conditionText.textContent = main;
    humidityValue.textContent = humidity + '%';
    windValue.textContent = speed + " M/s";
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;
    currentDate.textContent = getCurrentDate();

    await updateForecast(city);
    displaySection(weatherInfoSection);
}

const updateForecast = async (city) => {
    const forecastData = await getFetchData("forecast",city);
    
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split("T")[0];
    forecastItemContainer.innerHTML = '';
    forecastData.list.forEach( forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken)&&!forecastWeather.dt_txt.includes(todayDate))
        updateForecastItems(forecastWeather);
    })
}   

const updateForecastItems = (forecastWeather) => {
    const {
        dt_txt : date,
        weather : [{ id }],
        main : { temp }
    } = forecastWeather;

    const dateTaken = new Date(date);
    const dateOption = {
        day : "2-digit",
        month : "short"
    }
    const finalDate = dateTaken.toLocaleDateString('en-US',dateOption)

    const forecastItem =
                `<div class="forecast-item">
                    <h5 class="forecast-date">${finalDate}</h5>
                    <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-image">
                    <h5 class="forecast-temp">${Math.round(temp)} °C</h5>
                </div>`

    forecastItemContainer.insertAdjacentHTML('beforeend', forecastItem)
}

const displaySection = (section) => {
    [weatherInfoSection, searchSection, notFoundSection].forEach(
        section => section.style.display = 'none'
    )
    section.style.display = 'flex';
}
window.addEventListener("load",()=>{
    [weatherInfoSection, searchSection, notFoundSection].forEach(
        section => section.style.display = 'none'
    )
    searchSection.style.display = 'flex';
})
