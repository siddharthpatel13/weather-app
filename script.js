const apiKey = '0644368ef8a9f4cba772a0b783484c20'; // OpenWeatherMap API key
const resultDiv = document.getElementById('weather-result');
const appDiv = document.querySelector('.weather-app');

async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        return {
            name: data.name,
            country: data.sys.country,
            temp: data.main.temp,
            weather: data.weather[0].description,
            main: data.weather[0].main.toLowerCase()
        };
    } catch (err) {
        return { name: city, error: err.message };
    }
}

document.getElementById('weather-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const cityInput = document.getElementById('city-input').value;
    // Allow comma-separated city names
    const cities = cityInput.split(',').map(c => c.trim()).filter(Boolean);

    resultDiv.textContent = 'Loading...';
    appDiv.classList.remove('summer', 'winter', 'rain', 'cloud');
    document.body.classList.remove('cloudy-bg');

    const weatherData = await Promise.all(cities.map(fetchWeather));

    // Set background based on the first city's weather
    if (weatherData.length > 0 && !weatherData[0].error) {
        const weather = weatherData[0].main;
        const temp = weatherData[0].temp;
        if (weather && weather.includes('rain')) {
            appDiv.classList.add('rain');
        } else if (weather && weather.includes('cloud')) {
            appDiv.classList.add('cloud');
            document.body.classList.add('cloudy-bg');
        } else if (temp >= 25) {
            appDiv.classList.add('summer');
        } else if (temp <= 10) {
            appDiv.classList.add('winter');
        }
    }

    // Show all weather results
    resultDiv.innerHTML = weatherData.map(data => 
        data.error
        ? `<div><strong>${data.name}:</strong> ${data.error}</div>`
        : `<div>
            <h2>${data.name}, ${data.country}</h2>
            <p>Temperature: ${data.temp}°C</p>
            <p>Weather: ${data.weather}</p>
        </div>`
    ).join('<hr>');
});