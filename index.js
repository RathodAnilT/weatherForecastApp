const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-cantainer");
const grantAccessCantainer = document.querySelector(".grant-location-cantainer");

const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-cantainer");
const userInfoCantainer = document.querySelector(".user-info-cantainer");

// initianllt variables

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

currentTab.classList.add("current-tab");

getfromSessionStorage();


function switchTab(clickedTab){

    hideErrorContainer();
    if(clickedTab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {
            // kya search form wlaa cnatianer is invisible then make it visible
            userInfoCantainer.classList.remove("active");
            grantAccessCantainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else
        {
            //now currently i was insearch form tab now i want to go to your weather
            searchForm.classList.remove("active");
            userInfoCantainer.classList.remove("active");
            // .. ab main weather tab me hoon to weather display karte hain firstly check local storage then any other temp
            getfromSessionStorage();

        }
    }
}
userTab.addEventListener("click" , () =>{
    switchTab(userTab);
});

searchTab.addEventListener("click" , () =>{
    switchTab(searchTab)

});

// check if corduinates are stored in session storage
function getfromSessionStorage(){
    const localCordinates = sessionStorage.getItem("user-cordinates");
    if(!localCordinates)
    {
        grantAccessCantainer.classList.add("active");
    }
    else
    {
        const cordinates = JSON.parse(localCordinates);
        fetchWeatherInfo(cordinates);
    }
}

async function fetchWeatherInfo(cordinates)
{
    const {lat , long} = cordinates;
    // make grant cantaniner invuisble
    grantAccessCantainer.classList.remove("active");
    // visible loader 
    loadingScreen.classList.add("active");

    // api calling
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");

        userInfoCantainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch(err){
        console.error("Error during API request:", err.message);
        loadingScreen.classList.remove("active");

        clearWeatherInfo();
        // Display content and background for the "not found" state
        userInfoCantainer.classList.remove("active");
        const errorContainer = document.querySelector(".error-container");
        errorContainer.classList.add("active");
        setTimeout(() => {
            errorContainer.classList.remove("active");
        } , 3000)
    }

};

function renderWeatherInfo(weatherInfo){
    // firstlt we have to fetch the lements

    const cityName = document.querySelector("[data-cityName]");
    const CountryIcon = document.querySelector("[data-countryFlag]");

    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const weatherTemp = document.querySelector("[data-weatherTemp]");
    const WindSpeed = document.querySelector("[data-windSpeed]");
    const Humidity = document.querySelector("[data-Humidity]");
    const Cloudiness = document.querySelector("[data-Cloudiness]");

    // fetch values from weatherInfo object and put it into ui

    cityName.innerText = weatherInfo?.name;

    CountryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText = weatherInfo?.weather?.[0]?.description;

    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    weatherTemp.innerText = `${weatherInfo?.main?.temp} °C`;

    WindSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;

    Humidity.innerText = `${weatherInfo?.main?.humidity} %`;

    Cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}


function getLocation(){
    
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPsition);
        }
        else{
            loadingScreen.classList.remove("active");
            userInfoCantainer.classList.remove("active");
            const errorContainer = document.querySelector(".error-container");
            errorContainer.classList.add("active");
        }
}

function showPsition(position){
    const userCordinates = {
        lat: position.coords.latitude,
        long: position.coords.longitude,

    }

    sessionStorage.setItem("user-cordinates" , JSON.stringify(userCordinates));
    fetchWeatherInfo(userCordinates);
}



const grantAccessBtn = document.querySelector("[data-grantAccess]");

grantAccessBtn.addEventListener("click" , getLocation);


let SearchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" , (e) =>{
    e.preventDefault();
    let cityName = SearchInput.value;

    if(cityName === "")
    return;
    else
    fetchSearchWeatherInfo(cityName);
})

// Add a function to clear the content of the user info container
function clearWeatherInfo() {
    const cityName = document.querySelector("[data-cityName]");
    const CountryIcon = document.querySelector("[data-countryFlag]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const weatherTemp = document.querySelector("[data-weatherTemp]");
    const WindSpeed = document.querySelector("[data-windSpeed]");
    const Humidity = document.querySelector("[data-Humidity]");
    const Cloudiness = document.querySelector("[data-Cloudiness]");

    // Set content to an empty string or default values
    cityName.innerText = "";
    CountryIcon.src = "";
    desc.innerText = "";
    weatherIcon.src = "";
    weatherTemp.innerText = "";
    WindSpeed.innerText = "";
    Humidity.innerText = "";
    Cloudiness.innerText = "";
}


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoCantainer.classList.remove("active");
    grantAccessCantainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
         // Check if the response indicates an error
        if (!response.ok) {
            throw new Error("City not found");
        }
        
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoCantainer.classList.add("active");
        
        renderWeatherInfo(data);
    }
    catch(err){
        
        console.error("Error during API request:", err.message);
        loadingScreen.classList.remove("active");
        
        clearWeatherInfo();
        // Display content and background for the "not found" state
        const errorContainer = document.querySelector(".error-container");
        errorContainer.classList.add("active");
        userInfoCantainer.classList.remove("active");
        setTimeout(() => {
            errorContainer.classList.remove("active");
        } , 3000)

    }


};

function hideErrorContainer() {
    const errorContainer = document.querySelector(".error-container");
    errorContainer.classList.remove("active");
}
