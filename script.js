function getWeather() {
    // Assigning variables
    const apiKey = '8f476abb635e3dc6f0ff1cddf34f4059';
    const city = document.getElementById('city').value;

    // Validation check
    if (!city) {
        alert('Please enter a city');
        return;
    }

    // Declaring the URLs for API data
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetching the current weather data
    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch current weather data');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data); // Display current weather
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetching the forecast data
    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch hourly forecast data');
            }
            return response.json();
        })
        .then(data => {
            displayHourlyForecast(data.list); // Display hourly forecast
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    // Declaring const variables using HTML elements
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const location = document.getElementById('search-location');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    // Check if received data contains an error code
    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        // Assigning API data to variables
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert Kelvin to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Updating the HTML content
        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHTML = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block'; // Show weather icon

        // Update the gradient background based on weather conditions
        changeBackground(description);
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8); // Get the next 8 hours

    hourlyForecastDiv.innerHTML = ''; // Clear previous content

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert Kelvin to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item text-center mx-2">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

// Function to change the background gradient based on weather conditions
function changeBackground(weatherCondition) {
    const bodyElement = document.getElementById('body'); // Target the #body element now

    // Set gradients based on weather conditions
    if (weatherCondition.includes('clear')) {
        bodyElement.style.background = 'linear-gradient(135deg, #f6d365, #fda085)'; // Sunny
    } else if (weatherCondition.includes('clouds')) {
        bodyElement.style.background = 'linear-gradient(135deg, #dfe9f3, #cfd9df)'; // Cloudy
    } else if (weatherCondition.includes('rain')) {
        bodyElement.style.background = 'linear-gradient(135deg, #00c6fb, #005bea)'; // Rainy
    } else if (weatherCondition.includes('thunderstorm')) {
        bodyElement.style.background = 'linear-gradient(135deg, #536976, #292e49)'; // Thunderstorm
    } else if (weatherCondition.includes('snow')) {
        bodyElement.style.background = 'linear-gradient(135deg, #e6f1ff, #d9e7ff)'; // Snow
    } else if (weatherCondition.includes('mist') || weatherCondition.includes('fog')) {
        bodyElement.style.background = 'linear-gradient(135deg, #8e9eab, #eef2f3)'; // Mist/Fog
    } else {
        bodyElement.style.background = 'linear-gradient(135deg, #667eea, #764ba2)'; // Default gradient
    }
}
