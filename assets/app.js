

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []

for (i = 0; i < searchHistory.length; i++) {
  let searchHistoryElem = document.createElement('li')
  searchHistoryElem.className = 'card card-body recentCity'
  searchHistoryElem.dataset.city = searchHistory[i]

  searchHistoryElem.innerHTML = `
        ${searchHistory[i]}
        `
  document.getElementById('recentSearchList').append(searchHistoryElem)
}



const getWeather = (CITY) => {

  let city = CITY
  console.log(city)

  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=79e391b4652051f3f627b227f5ffcac5
  `)
    .then(res => {
      console.log(res.data)


      // i NEEDED the lat and long from the first request
      axios.get(`http://api.openweathermap.org/data/2.5/uvi?appid=79e391b4652051f3f627b227f5ffcac5&lat=${res.data.coord.lat}&lon=${res.data.coord.lon}`)
        .then(result => {
          console.log(result.data.value)
          console.log(result.data)
          let uvIndex = result.data.value
          let uvButtonClass = ''

          if (uvIndex < 3) {
            uvButtonClass = 'btn-success'
          }
          else if (uvIndex >= 3 && uvIndex <= 7) {
            uvButtonClass = 'btn-warning'
          }
          else {
            uvButtonClass = 'btn-danger'
          }


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


        .catch(err => { console.log(err) })
    })
    .catch(err => { console.log(err) })

  // ====================================

  axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=79e391b4652051f3f627b227f5ffcac5`)
    .then(res => {
      console.log(res)
      let forecast = res.data.list

      document.getElementById('forecast').innerHTML = ``

      for (i = 5; i < forecast.length; i += 8) {

        console.log(forecast[i])
        let forecastElem = document.createElement('div')
        forecastElem.className = 'col-sm'
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
        document.getElementById('forecast').append(forecastElem)
        console.log(moment(forecast[i].dt_txt).format("MM/D/YYYY"))
      }
    })
    .catch(err => { console.log(err) })

}



const storeCity = () => {

  // store recent searches in the local storage
  searchHistory.push(document.getElementById('city').value)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

  let searchHistoryElem = document.createElement('li')
  searchHistoryElem.className = 'card card-body recentCity'
  searchHistoryElem.dataset.city = document.getElementById('city').value

  searchHistoryElem.innerHTML = `
    ${document.getElementById('city').value}
    `
  document.getElementById('recentSearchList').append(searchHistoryElem)

  document.getElementById('city').value = ''

}


// =======================================


document.getElementById('search').addEventListener('click', event => {
  event.preventDefault()

  // =================================
  getWeather(document.getElementById('city').value)
  
  storeCity()
  
})


// ========================================

document.addEventListener('click', event => {
  event.preventDefault()
  if (event.target.classList.contains('recentCity')) {
    console.log(event.target.dataset.city)

    getWeather(event.target.dataset.city)

  }

})








