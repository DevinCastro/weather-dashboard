

// This first chunk of code is resposible for grabbing what was already in the local storage for a returning user, or starting off with an empty array if it is their first time
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []

// this loop cycles through the searchHistory array
for (i = 0; i < searchHistory.length; i++) {
  // create a list element for every item in the array
  let searchHistoryElem = document.createElement('li')
  // give that list element the following classes
  searchHistoryElem.className = 'card card-body recentCity'
  // now give each of those list elements the following data attribute and make it equal to the actual name of the city they searched
  searchHistoryElem.dataset.city = searchHistory[i]
  // Now we enter in the inner HTML of the list element witch will again be the name of the city that they enter
  searchHistoryElem.innerHTML = `
        ${searchHistory[i]}
        `
  // lastly we append these list elements to the unordered list element in our index.html file with the ID "recentSearchList"
  document.getElementById('recentSearchList').append(searchHistoryElem)
}

// ===================================
// This creates the function called getWeather with the parameter called CITY
const getWeather = (city) => {

  console.log(city)

  // This axios.get function makes a request to the following API, passing the 'city' parameter into the request along with my API key.  We also change here to imperial units
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=79e391b4652051f3f627b227f5ffcac5
  `)
    .then(res => {
      // The following is the response function
      console.log(res.data)

      // We now nest ANOTHER API request to get the UV index, because I needed to get the previous data from the first request to also aquire the longitude and lattitude to request the UV information
      axios.get(`http://api.openweathermap.org/data/2.5/uvi?appid=79e391b4652051f3f627b227f5ffcac5&lat=${res.data.coord.lat}&lon=${res.data.coord.lon}`)
        .then(result => {
          console.log(result.data.value)
          console.log(result.data)

          // Create a variable that grabs the exact value from the data of the API request and assign it to uvIndex
          let uvIndex = result.data.value
          // create a variable that will be used determine which UV button class we will use to color code whether the UV is favorable, moderate, or severe
          let uvButtonClass = ''
          // The following conditional logic determines which class of button I should use, based on the value of uvIndex
          if (uvIndex < 3) {
            uvButtonClass = 'btn-success'
          }
          else if (uvIndex >= 3 && uvIndex <= 7) {
            uvButtonClass = 'btn-warning'
          }
          else {
            uvButtonClass = 'btn-danger'
          }

          // Now assign the following to the inner HTML of the weather element.  We use temperate literals to display all the information we found in the data from the API request
          // I also used the moment.js library here to format the date information from the API request
          document.getElementById('weather').innerHTML = `
          <div class="card">
          <div class="card-body">
          <h2>${moment(res.data.dt_txt).format("MM/D/YYYY")}</h2>
          <h2>${res.data.name}: <img src="http://openweathermap.org/img/w/${res.data.weather[0].icon}.png" class="img-fluid" alt="Weather icon"></h2>
          <h3>Weather: ${res.data.weather[0].description}</h3>
          <h4>Temperature: ${res.data.main.temp}&deg</h4>
          <h4>Humidity: ${res.data.main.humidity}%</h4>
          <h4>Wind Speed: ${res.data.wind.speed} MPH</h4>
          <h4>UV Index: <button class="btn ${uvButtonClass}">${uvIndex}</btn></h4>
          </div>
          </div>  
          `
        })
        // The following is the function to execute if there is an error with the request
        .catch(err => { console.log(err) })
    })
    .catch(err => { console.log(err) })

  // ====================================
  // This is the API request to get the information for the 5 day forecast
  axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=79e391b4652051f3f627b227f5ffcac5`)
    .then(res => {
      console.log(res)
      // create this variable to help our notation not get too complex
      let forecast = res.data.list
      // This Clears out the forecast element in case this is not the first time we search for a city
      document.getElementById('forecast').innerHTML = ``
      // start a loop to cycle though the res.data.list array.  Starting at the fifth element and then cycling through every 8th item in the array cycles through full days to give us 5 total days.
      for (i = 5; i < forecast.length; i += 8) {
        console.log(forecast[i])
        // for every iteration of the loop, create a div element
        let forecastElem = document.createElement('div')
        // then give that div a col-sm class to make each iteration its own column
        forecastElem.className = 'col-sm'
        // now give that element the following HTML that will nest a bootsrap card into it as well.  That card will hold all the info about the 5 day forecast.  We use temperate literals to enter in the information from the data we got in the API request
        forecastElem.innerHTML = `
        <div class="card">
          <div class="card-body fiveDay">
            <p>${moment(forecast[i].dt_txt).format("MM/D/YYYY")}</p>
            <img src="http://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png" class="img-fluid" alt="Weather icon">
            <p>Temp: ${forecast[i].main.temp}&deg</p>
            <p>Humidity: ${forecast[i].main.humidity}%</p>
          </div>
        </div>
        `
        // Append each of these elements into the 'forecast' element of our index.html file
        document.getElementById('forecast').append(forecastElem)
      }
    })
    .catch(err => { console.log(err) })

}


// Create a function to store the recent user searches to the local storage and put them into a list on the screen
const storeCity = () => {

  // Push the users searched city into the searchHistory array that we have
  searchHistory.push(document.getElementById('city').value)
  // Now store it into the local storage
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
  // create a li element
  let searchHistoryElem = document.createElement('li')
  // give that element the following class names
  searchHistoryElem.className = 'card card-body recentCity'
  // also give it the unique data attribute that will be the exact name of the city that user searched
  searchHistoryElem.dataset.city = document.getElementById('city').value
  // now give that element the inner HTML and set it to the value that user typed in
  searchHistoryElem.innerHTML = `
    ${document.getElementById('city').value}
    `
  // Now append this element into our recentSearchList Element
  document.getElementById('recentSearchList').append(searchHistoryElem)
  // clear out the search form
  document.getElementById('city').value = ''

}


// =======================================

// Listen for the search button to get clicked and then execute the following function
document.getElementById('search').addEventListener('click', event => {
  event.preventDefault()

  // =================================
  // execute the getWeather function with the following value passed through the parameter
  getWeather(document.getElementById('city').value)
  
  // then execute the storeCity function
  storeCity()  
})


// ========================================
// This global listener listens for a click on the entire page, but we narrow it down to one specific event with conditional logic
// This is to find when a user clicks a previously searched city; we want to display all the information for that city
document.addEventListener('click', event => {
  event.preventDefault()
  // If the thing that is clicked is an element with the class "recentCity" then execute the following
  if (event.target.classList.contains('recentCity')) {
    console.log(event.target.dataset.city)

    // execute the getWeather function with the following parameter.  Notice this is why I needed to add a unique data attribute with the value that is actually the city name to the li elements.  So I can pass that city name into this function.
    getWeather(event.target.dataset.city)
  }
})
