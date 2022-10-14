const searchForm = document.getElementById("searchForm");
const findInput = document.querySelector("input[type='search']");
const findBtn = document.querySelector(".find");

const todayDate = document.getElementById("today-date");
const city = document.getElementById("city");
const wind = document.getElementById("wind");
const windDir = document.getElementById("wind-dir");
const chanceOfRain = document.getElementById("chanceOfRain");

const secondDegreeLow = document.getElementById("second-degree-low");
const thirdDegreeLow = document.getElementById("third-degree-low");

const dayName = document.querySelectorAll(".day-name");
const degree = document.querySelectorAll(".degree");
const statusText = document.querySelectorAll(".status");
const statusIcon = document.querySelectorAll(".status-icon");

async function getDegree(city) {
  let result = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=102d8d970bb34268a3d101122221110&q=${city}&days=7`
  );
  result = await result.json();
  return result;
}

function changeDateName(d) {
  let date = new Date(d);
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[date.getDay()];
}

findBtn.addEventListener("click", function (e) {
  e.preventDefault();
  displayDegree();
});
document.addEventListener("keypress", function (e) {
  if (e.key == "Enter") {
    e.preventDefault();
    displayDegree();
  }
});

displayDegree();

async function displayDegree() {
  let searchedCity = findInput.value || "cairo";
  let result = await getDegree(searchedCity);
  city.textContent = result.location.name;
  let datestr = result.forecast.forecastday[0].date;
  let realDate = new Date(datestr);
  let monthIndex = realDate.getMonth();
  let dayNumber = realDate.getDate();
  let monthNames = [
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

  todayDate.textContent = `${dayNumber} ${monthNames[monthIndex]}`;

  let nameDay;
  for (let d = 0; d < degree.length; d++) {
    nameDay = changeDateName(result.forecast.forecastday[d].date);
    dayName[d].textContent = nameDay;

    for (let i = 0; i < result.forecast.forecastday[d].hour.length; i++) {
      let thisHour = new Date().getHours();
      let hour = new Date(
        result.forecast.forecastday[d].hour[i].time
      ).getHours();

      if (thisHour === hour) {
        degree[
          d
        ].textContent = `${result.forecast.forecastday[d].hour[i].temp_c}° C`;

        statusText[d].textContent =
          result.forecast.forecastday[d].hour[i].condition.text;

        statusIcon[d].setAttribute(
          "src",
          `../images/conditions/${result.forecast.forecastday[d].hour[i].condition.text}.svg`
        );

        wind.textContent = result.forecast.forecastday[0].hour[i].wind_kph;
        chanceOfRain.textContent = `${result.forecast.forecastday[0].hour[i].chance_of_rain}%`;
        let windDirection = result.forecast.forecastday[0].hour[i].wind_dir;
        if (windDirection === "N") {
          windDir.textContent = "North";
        } else if (windDirection == "E") {
          windDir.textContent = "East";
        } else if (windDirection == "W") {
          windDir.textContent = "West";
        } else if (windDirection == "S") {
          windDir.textContent = "South";
        } else {
          windDir.textContent = windDirection;
        }
      }
    }
  }
  secondDegreeLow.textContent = `${result.forecast.forecastday[1].day.mintemp_c}° C`;
  thirdDegreeLow.textContent = `${result.forecast.forecastday[2].day.mintemp_c}° C`;
  findInput.value = "";
}
