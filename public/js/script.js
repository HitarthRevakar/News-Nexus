const toggleButton = document.querySelector("#theme-toggle");
const body = document.querySelector("body");
const currentTheme = localStorage.getItem("theme");

// Check if system prefers dark mode
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set initial theme based on system preferences or saved preference
if (currentTheme) {
  if (currentTheme === "dark") {
    body.classList.add('dark-mode');
  } else if (currentTheme === "light") {
    body.classList.add('light-mode');
  }
} else if (prefersDarkMode) {
  body.classList.add('dark-mode');
}

toggleButton.addEventListener("click", function () {
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");

  }
});


// Get the current vertical scroll position
var scrollPosition = window.scrollY;

// Store the scroll position in localStorage
localStorage.setItem('scrollPosition', scrollPosition);

// When the page loads, check if there is a stored scroll position
if (localStorage.getItem('scrollPosition')) {
  // Get the stored scroll position
  var storedScrollPosition = parseInt(localStorage.getItem('scrollPosition'));

  // Set the vertical scroll position to the stored value
  window.scrollTo(0, storedScrollPosition);

  // Remove the stored scroll position
  localStorage.removeItem('scrollPosition');
}


let weather = {
  apiKey: "d4f7ea656860531dd843fdf7ced89ba3",
  pexelsApiKey: "roNnEAsQKELBhgpGsopnggQm1V6mLybAHZUq6B4j7TvEnXzdvbWhhuvK",

  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },

  fetchPexelsImage: function () {
    query = 'nature'; // Replace with your desired search term
    fetch(`https://api.pexels.com/v1/search?query=${query}`, {
      headers: {
        Authorization: this.pexelsApiKey
      }
    })
    .then(response => response.json())
    .then(data => {
      const imageUrl = data.photos[0].src.original;
      document.body.style.backgroundImage = `url('${imageUrl}')`;
    })
    .catch(error => console.error('Error fetching image:', error));
  },

  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");

    this.fetchPexelsImage();
  },

  search: function () {
    const input = document.querySelector(".search-bar").value;
    if (input) {
      this.fetchWeather(input);
    } else {
      this.getLocation();
    }
  },

  getLocation: function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.fetchLocationWeather.bind(this), this.showLocationError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  },

  fetchLocationWeather: function (position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },

  showLocationError: function () {
    alert("Unable to retrieve your location. Please enter a city name manually.");
  },
};

document.querySelector(".search-img").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    weather.search();
  }
});

weather.getLocation();
weather.fetchPexelsImage(); // Fetch a random landscape image on initial load
