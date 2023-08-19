// sugested names
// Reference to the suggestions container
const suggestionsContainer = document.querySelector(".suggestions");

//Search cities weather info
const apiKey = "04a804817d46a473546171c049162702";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

const weatherIcon = document.querySelector(".weather-icon");

// Function to fetch and display city name suggestions based on input value
function displayCitySuggestions(inputValue) {
  fetch("cities15000.txt")
    .then((response) => response.text())
    .then((data) => {
      const cityData = data.split("\n");
      const citySuggestions = cityData
        .map((line) => line.split("\t")[1]) // Extract city names from the dataset
        .filter(
          (city) =>
            city && city.toLowerCase().includes(inputValue.toLowerCase())
        );

      // Clear previous suggestions
      suggestionsContainer.innerHTML = "";

      // Display suggestions
      citySuggestions.forEach((city) => {
        const suggestion = document.createElement("div");
        suggestion.className = "suggestion";
        suggestion.textContent = city;

        suggestion.addEventListener("click", () => {
          searchBox.value = city;
          suggestionsContainer.innerHTML = ""; // Clear suggestions
          checkWeather(city); // Perform weather check
        });

        suggestionsContainer.appendChild(suggestion);
      });
    })
    .catch((error) => console.error("Error loading city data:", error));
}

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status === 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    const data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".country").innerHTML = data.sys.country;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".feels-like").innerHTML =
      Math.round(data.main.feels_like) + "°C";

    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

    if (data.weather[0].main === "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (data.weather[0].main === "Clear") {
      weatherIcon.src = "images/clear.png";
    } else if (data.weather[0].main === "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (data.weather[0].main === "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (data.weather[0].main === "Mist") {
      weatherIcon.src = "images/mist.png";
    }

    // to display the weather field after inserting the city and search it
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
  }
}

//when the user click the searchBtn the check weather data will apear and will get the value that the user insert in the search box, so the city will be determined from the searchbox value
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

/// Attach input event listener
searchBox.addEventListener("input", () => {
  const inputValue = searchBox.value;
  console.log("Input Value:", inputValue); // Debugging
  if (inputValue.length > 2) {
    // Fetch suggestions after user has entered at least 3 characters
    console.log("Fetching suggestions...");
    displayCitySuggestions(inputValue);
  } else {
    suggestionsContainer.innerHTML = ""; // Clear suggestions if input is empty
  }
});
