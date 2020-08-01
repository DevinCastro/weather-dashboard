

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []

for (i = 0; i < searchHistory.length; i++) {
  let searchHistoryElem = document.createElement('li')
  searchHistoryElem.className = 'card recentCity'
  searchHistoryElem.dataset.city = searchHistory[i]

  searchHistoryElem.innerHTML = `
        <div class="card-body recentCity">${searchHistory[i]}</div>
        `
  document.getElementById('recentSearchList').append(searchHistoryElem)
}




document.getElementById('search').addEventListener('click', event => {
  event.preventDefault()

  // =================================

  let city = document.getElementById('city').value 
  console.log(city)

  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=79e391b4652051f3f627b227f5ffcac5
  `)
    .then(res => {
      console.log(res.data)

      document.getElementById('weather').innerHTML = `
      <div class="card">
        <div class="card-body">
          <h1>${res.data.name} <img src="http://openweathermap.org/img/w/${res.data.weather[0].icon}.png" class="img-fluid" alt="Weather icon"></h1>
          <h2>Weather: ${res.data.weather[0].description}</h2>
          <h3>Temperature: ${res.data.main.temp}</h3>
          <h3>Humidity: ${res.data.main.humidity}</h3>
          <h3>Wind Speed: ${res.data.wind.speed}</h3>
        </div>
      </div>  
      `

    })
    .catch(err => { console.log(err) })

  // ====================================

  axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=79e391b4652051f3f627b227f5ffcac5`)
    .then(res => {
      console.log(res)
      let forecast = res.data.list

      document.getElementById('forecast').innerHTML = ``

      for (i = 6; i < forecast.length; i += 8) {

        console.log(forecast[i])
        let forecastElem = document.createElement('div')
        forecastElem.className = 'col-2'
        forecastElem.innerHTML = `
        <div class="card">
          <div class="card-body">
            <p>${moment(forecast[i].dt_txt).format("MM/D/YYYY")}</p>
            <p>Weather: ${forecast[i].weather[0].description}</p>
            <img src="http://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png" class="img-fluid" alt="Weather icon">
            <p>Temperature: ${forecast[i].main.temp}</p>
            <p>Humidity: ${forecast[i].main.humidity}</p>
            <p>Wind Speed: ${forecast[i].wind.speed}</p>
          </div>
        </div>

        `
        document.getElementById('forecast').append(forecastElem)
        console.log(moment(forecast[i].dt_txt).format("MM/D/YYYY"))
      }
    })
    .catch(err => { console.log(err) })


  // ========================================

// store recent searches in the local storage
  searchHistory.push(document.getElementById('city').value)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

  let searchHistoryElem = document.createElement('li')
  searchHistoryElem.className = 'card recentCity'
  searchHistoryElem.dataset.city = city
 
  searchHistoryElem.innerHTML = `
        <div class="card-body recentCity">${document.getElementById('city').value}</div>
        `
  document.getElementById('recentSearchList').append(searchHistoryElem)

  document.getElementById('city').value = ''

})




// ========================================

document.addEventListener('click',event => {
event.preventDefault()
  if (event.target.classList.contains('recentCity')) {
  console.log('works')


  
}

})








