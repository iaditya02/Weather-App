

const API_KEY='86c928c0bf1240851c10150583c66cbd';


const userTab=document.querySelector("[user-dataWeather]");
const searchTab=document.querySelector("[search-dataWeather]");

const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchInfo]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-weatherinfo");

let currentTab=userTab;

currentTab.classList.add("current-tab");
getFromSessionStorage();


function switchTab(clickedTab){
    if(currentTab!=clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});


function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    console.log('hello');
    const {lat,lon}=coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response= await fetch( 
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data= await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderDataInfo(data);
    }

    catch(err){
        loadingScreen.classList.remove("active");
        //add more
    }

}

function renderDataInfo(weatherInfo){

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[wind-speed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloud=document.querySelector("[data-clouds]");

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org./img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloud.innerText=`${weatherInfo?.clouds?.all}%`;
    

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show alert
        console.log("not location supported");
    }
}


function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    console.log(userCoordinates);

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const getAccessButton=document.querySelector("[grant-dataAccess]");
getAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-srachInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName===""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(cityName){
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");


    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);

        const data=await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderDataInfo(data);

    }
    catch(err){
        userInfoContainer.classList.remove("active");
        alert("City not found!");

    }
}