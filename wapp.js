//view
var bod = document.getElementsByTagName('body')[0];
bod.addEventListener("load",geoFindMe());
bod.innerHTML = `<header id="title">
<h1>My <span>Weather</span> Portal</h1>
</header>
<div class="headerBlock shadow">
<p id="hongkong">Hong Kong</p>
<div class="break"></div>
<img class ="weatherIcon" src="" alt="Weather icon :D">
<p class="temperature"></p>
<div class="break"></div>
<img src="images/drop-48.png" alt="humidityIcon" class="humidityIcon">
<p class="humidity"></p>
<div class="break"></div>
<img src="images/rain-48.png" alt="rainfallIcon" class="humidityIcon">
<p class="rainfall"></p>
<div class="break"></div>
<img src="images/UVindex-48.png" alt="" class="UVlevelIcon">
<p class="UVlevel"></p>
<div class="break"></div>
<div id="warning"></div>
<p class="lastUpdates"></p>
</div>
<div class="myLocation shadow">
<p>My Location</p>
<p class="district"></p>
<p class="suburb"></p>
<p class="myLocationTemp"></p>
<img src="images/rain-48.png" alt="" class="myLocationRainfallIcon">
<p class="myLocationRainfall"></p>
<img src="" alt="" class="myLocationAirquaIcon">
<p class="myLocationAirqua"></p>
</div>
<div class="temperatures shadow">
<p>Temperatures</p>
<label for="tempSel">Select the location</label>
<select name="tempSel" id="tempSel">
</select>
<p class="tempSelShow"></p>

</div>
<div class="days9WeatherForecast shadow">
<p>9-Day Forecast</p>
<div class="days9WeatherForecastWrap">
  <div class="forecastbox">
    <div class ="ForecastWeek"></div>
    <div class="ForecastDate"></div>
    <img src="" alt="" class="ForecastIcon">
    <div class ="ForecastTemperatures"></div>
    <div class ="ForecastHumidity"></div>
  </div>
  <div class="forecastbox">
    <div class ="ForecastWeek"></div>
    <div class="ForecastDate"></div>
    <img src="" alt="" class="ForecastIcon">
    <div class ="ForecastTemperatures"></div>
    <div class ="ForecastHumidity"></div>
  </div>
  <div class="forecastbox">
    <div class ="ForecastWeek"></div>
    <div class="ForecastDate"></div>
    <img src="" alt="" class="ForecastIcon">
    <div class ="ForecastTemperatures"></div>
    <div class ="ForecastHumidity"></div>
  </div>
  <div class="forecastbox">
    <div class ="ForecastWeek"></div>
    <div class="ForecastDate"></div>
    <img src="" alt="" class="ForecastIcon">
    <div class ="ForecastTemperatures"></div>
    <div class ="ForecastHumidity"></div>
  </div>
  <div class="forecastbox">
    <div class ="ForecastWeek"></div>
    <div class="ForecastDate"></div>
    <img src="" alt="" class="ForecastIcon">
    <div class ="ForecastTemperatures"></div>
    <div class ="ForecastHumidity"></div>
  </div>
  <div class="forecastbox">
    <div class ="ForecastWeek"></div>
    <div class="ForecastDate"></div>
    <img src="" alt="" class="ForecastIcon">
    <div class ="ForecastTemperatures"></div>
    <div class ="ForecastHumidity"></div>
  </div>
  <div class="forecastbox">
    <div class ="ForecastWeek"></div>
    <div class="ForecastDate"></div>
    <img src="" alt="" class="ForecastIcon">
    <div class ="ForecastTemperatures"></div>
    <div class ="ForecastHumidity"></div>
  </div>
  <div class="forecastbox">
    <div class ="ForecastWeek"></div>
    <div class="ForecastDate"></div>
    <img src="" alt="" class="ForecastIcon">
    <div class ="ForecastTemperatures"></div>
    <div class ="ForecastHumidity"></div>
  </div>
  <div class="forecastbox">
    <div class ="ForecastWeek"></div>
    <div class="ForecastDate"></div>
    <img src="" alt="" class="ForecastIcon">
    <div class ="ForecastTemperatures"></div>
    <div class ="ForecastHumidity"></div>
  </div>
</div>
</div>`

// var warningtag = document.createElement('div');
// warningtag.setAttribute('id','warning');
// document.querySelector('.headerBlock').appendChild(warningtag);
warningtag = document.querySelector('#warning');
warningtag.style.display="none";
warningtag.addEventListener('click', evt => {
    lastchild = document.querySelector('#warning p.hidden');
    if (lastchild.style.display == 'none'){
        lastchild.style.display = 'initial';
    } else {
        lastchild.style.display = 'none';
    }
})


//current weather
var CurrentWeatherIcon;
var CurrentTemperature;
var CurrentHumidity;
var CurrentRainfall;
var CurrentUVIndex;
var HKOLastUpdate; //timer!
var DistrictTemperatures;
var TempOfEachDistrict;

//weather forecast
var day9Forecast;
var ForecastIcon;
var ForecastDate;
var ForecastWeek;
var ForecastTemperatures;
var ForecastHumidity;
var day9LastUpdate; //timer!

//aqhi
var aqhiLastUpdate; //timer!

//other variables from data
var minLocationID2;
var WarningMsg;
let tempSel = document.getElementById('tempSel').value;
//fetch current weather report for selection -- updated hourly
document.getElementById('tempSel').addEventListener('change', (evt) => {
    tempSel = document.getElementById('tempSel').value;
    fetch(`https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en`)
    .then(response =>{
        if (response.status == 200) {
            response.json().then( WR0 => {
                for (let i=0; i<WR0.temperature.data.length; i++){
                    if (WR0.temperature.data[i].value || WR0.temperature.data[i].value==0) {
                        if (WR0.temperature.data[i].place == tempSel){
                            tempSelVal = WR0.temperature.data[i].value;
                            settempSel(tempSelVal);
                        }
                    } else {
                        // nth
                    }
                }
            });
        }
    });
});

//fetch current weather report -- updated hourly
function FetchCurrentWeatherReport() {
    fetch(`https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en`)
        .then(response =>{
            if (response.status == 200) { //receive response successfully
                response.json().then( WR => {
                    let output = "";
                    if (WR.icon[0] || WR.icon[0]==0) {
                        CurrentWeatherIcon = WR.icon[0];    
                        setCurrentWeatherIcon(CurrentWeatherIcon);
                    } else {
                        // nth
                    }
                    if (WR.temperature.data[1].value || WR.temperature.data[1].value==0) {
                        CurrentTemperature = WR.temperature.data[1].value;                    
                        setCurrentTemperature(CurrentTemperature);
                        settempSelChoices(WR.temperature.data);
                    } else {
                        // nth
                    }
                    if (WR.humidity.data[0].value || WR.humidity.data[0].value==0) {
                        CurrentHumidity = WR.humidity.data[0].value;                    
                        setCurrentHumidity(CurrentHumidity);
                    } else {
                        // nth
                    }
                    if (WR.rainfall.data[13].max || WR.rainfall.data[13].max==0) {
                        CurrentRainfall = WR.rainfall.data[13].max;                    
                        setCurrentRainfall(CurrentRainfall);
                    } else {
                        // nth
                    }
                    if (WR.uvindex){
                        if (WR.uvindex.data[0]) {
                            if (WR.uvindex.data[0].value || WR.uvindex.data[0].value==0){
                                CurrentUVIndex = WR.uvindex.data[0].value;
                                setCurrentUVIndex(CurrentUVIndex);
                            }
                        }
                    } else{
                        document.querySelector('.headerBlock .UVlevel').innerHTML="";
                        document.querySelector('.UVlevelIcon').style.display="none";
                        document.querySelector('.headerBlock').style.height="50vh";
                    }
                    if (WR.warningMessage) {
                        WarningMsg = WR.warningMessage;  
                        setWarningMsg(WarningMsg);           
                    } else {
                        warningtag.style.display="none";
                        // document.querySelector('.headerBlock').style.height= "70vh";
                    }
                    if (WR.updateTime || WR.updateTime==0) {
                        LastUpdate = WR.updateTime; 
                        setLastUpdate(LastUpdate);      
                    } else {
                        // nth
                    }
                    if (WR.temperature.data[0]) {
                        DistrictTemperatures = WR.temperature.data[0];                    
                    } else {
                        // nth
                    }
                    if (WR.temperature.data[0].place) {
                        TempOfEachDistrict = WR.temperature.data[0].place;                    
                    } else {
                        // nth
                    }
                });
            }
        });
}

//fetch 9-day Weather Forecast API -- updated twice daily
function Fetch9DayWeatherReport() {
    fetch(`https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en`)
        .then(response =>{
            if (response.status == 200) { //receive response successfully
                response.json().then( WF => {
                    day9Forecast=[];
                    ForecastIcon=[];
                    ForecastDate=[];
                    ForecastWeek=[];
                    ForecastTemperatures=[];
                    ForecastHumidity=[];
                    for (let i=0; i<9; i++){
                        if (WF.weatherForecast[i]){
                            day9Forecast.push(WF.weatherForecast[i]);   
                        }
                        if (WF.weatherForecast[i].ForecastIcon){
                            ForecastIcon.push(WF.weatherForecast[i].ForecastIcon);
                        }
                        if (WF.weatherForecast[i].forecastDate){
                            ForecastDate.push(WF.weatherForecast[i].forecastDate);
                        }
                        if (WF.weatherForecast[i].week){
                            ForecastWeek.push(WF.weatherForecast[i].week);
                        }
                        if (WF.weatherForecast[i].forecastMintemp && WF.weatherForecast[i].forecastMaxtemp){
                            ForecastTemperatures.push([WF.weatherForecast[i].forecastMintemp,WF.weatherForecast[i].forecastMaxtemp]);
                        }
                        if (WF.weatherForecast[i].forecastMinrh.value && WF.weatherForecast[i].forecastMaxrh.value){
                            ForecastHumidity.push([WF.weatherForecast[i].forecastMinrh.value, WF.weatherForecast[i].forecastMaxrh.value]);  
                        }
                    }
                    debug = []
                    debug.push(ForecastIcon[0]);
                    debug.push(ForecastDate[0]);
                    debug.push(ForecastWeek[0]);
                    debug.push(ForecastTemperatures[0]);
                    debug.push(ForecastHumidity[0]);
                    // document.write(debug);
                    // setday9Forecast(day9Forecast);
                    setForecastIcon(ForecastIcon);
                    setForecastDate(ForecastDate);
                    setForecastWeek(ForecastWeek);
                    setForecastTemperatures(ForecastTemperatures);
                    setForecastHumidity(ForecastHumidity);
                    day9LastUpdate = WF.updateTime.split("+")[0];
                });
            }
        });
}

// various functions
function testing(writesth){
    document.write(JSON.stringify(writesth));
}
function setCurrentWeatherIcon(iconNum){
    link = `https://www.hko.gov.hk/images/HKOWxIconOutline/pic${iconNum}.png` 
    document.querySelector('.headerBlock .weatherIcon').src=link;
}
function setCurrentTemperature(temp){
    document.querySelector('.headerBlock .temperature').innerHTML=temp+'<span>&#176;C</span>';
}
function setCurrentHumidity(humidity){
    document.querySelector('.headerBlock .humidity').innerHTML=humidity+'<span>%</span>';
}
function setCurrentRainfall(rainfall){
    document.querySelector('.headerBlock .rainfall').innerHTML=rainfall+'<span>mm</span>';
}
function setCurrentUVIndex(uv){
    document.querySelector('.headerBlock .UVlevel').innerHTML=uv;
    document.querySelector('.UVlevelIcon').style.display="initial";
    // document.querySelector('.headerBlock').style.height="60vh";
}
function setWarningMsg(warn){
    if (warn){
        warningtag.style.display="initial";
        document.querySelector('#warning').innerHTML=`<p>Warning</p><p class="hidden"> ${warn}</p>`;
        document.querySelector('#warning p.hidden').style.display="none";
    }
}
function setLastUpdate(lastupdate){
    HKOLastUpdate = LastUpdate;
    document.querySelector('.headerBlock .lastUpdates').innerHTML='last update: '+lastupdate.substring(11,16);
}
function settempSel(tempSelVal){
    document.querySelector('.temperatures .tempSelShow').innerHTML=tempSelVal+' &#8451;';
}
function settempSelChoices(CurrentTemperature){
    var tempSelOptions=[];
    for (let i=0; i<CurrentTemperature.length; i++){
        if (CurrentTemperature[i].value || CurrentTemperature[i].value==0){
            tempSelOptions.push({"placeName":CurrentTemperature[i].place, tag:`<option value="${CurrentTemperature[i].place}">${CurrentTemperature[i].place}</option>\n`});
        }
    }
    //sort according to place
    for (var i = 0; i < tempSelOptions.length ; i++) {
        for(var j = 0 ; j < tempSelOptions.length - i - 1; j++){
            if (tempSelOptions[j].placeName > tempSelOptions[j+1].placeName) {
            let temp = tempSelOptions[j];
            tempSelOptions[j] = tempSelOptions[j+1];
            tempSelOptions[j+1]= temp;
            }
        }
    }
    let selectOutput ='';
    for (let i=0; i<tempSelOptions.length; i++){
        selectOutput+=tempSelOptions[i].tag;
    }
    document.querySelector('#tempSel').innerHTML = selectOutput;
}

function setday9Forecast(day9Forecast){
    if(day9Forecast.length>=9){
        for (let i=0; i<9; i++){
            document.querySelector(`.day9Forecast${i}`).innerHTML='';
        }
    }
}
function setForecastIcon(ForecastIcon){
    if(ForecastIcon.length>=9){
        icons = document.querySelectorAll(`.ForecastIcon`);
        for (let i=0; i<9; i++){
            link = `https://www.hko.gov.hk/images/HKOWxIconOutline/pic${ForecastIcon[i]}.png`
            icons[i].src= link;
        }
    }
}
function setForecastDate(ForecastDate){
    if(ForecastDate.length>=9){
        dates = document.querySelectorAll(`.ForecastDate`);
        for (let i=0; i<9; i++){
            dd = ForecastDate[i].substring(6,8);
            mm = ForecastDate[i].substring(4,6);
            dd = Number(dd);
            mm = Number(mm);
            dates[i].innerHTML= dd+'/'+mm;
        }
    }
}
function setForecastWeek(ForecastWeek){
    if(ForecastWeek.length>=9){
        weeks = document.querySelectorAll(`.ForecastWeek`);
        for (let i=0; i<9; i++){
            week = ForecastWeek[i].substring(0,3);
            weeks[i].innerHTML= week;
        }
    }
}
function setForecastTemperatures(ForecastTemperatures){
    if(ForecastTemperatures.length>=9){
        temps = document.querySelectorAll(`.ForecastTemperatures`);
        for (let i=0; i<9; i++){
            temp = ForecastTemperatures[i][0].value+'-'+ForecastTemperatures[i][1].value+'&nbsp;&#176;C';
            temps[i].innerHTML= temp;
        }
    }
}
function setForecastHumidity(ForecastHumidity){
    if(ForecastHumidity.length>=9){
        humids = document.querySelectorAll(`.ForecastHumidity`);
        for (let i=0; i<9; i++){
            humid = ForecastHumidity[i][0]+'-'+ForecastHumidity[i][1]+'&nbsp;%';
            humids[i].innerHTML= humid;
        }
    }
}

// fetch geolocation using html5
let mylat;
let mylng;
let returnSub;
let returnDistrict;
function geoFindMe() {
    if (!navigator.geolocation){
        console.log("Geolocation is not supported by your browser");
        return;
    }
    function success(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        mylat = pos.lat;
        mylng = pos.lng;
        let url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${mylat}&lon=${mylng}&zoom=18&addressdetails=1`;
        let init1 = {
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'accept-language': 'en-US'}
        };
          fetch(url, init1)
          .then(response => response.json())
          .then(data => {
            let borough = data.address.borough;
            let suburb = data.address.suburb;
            let town = data.address.town;
            let county = data.address.county;
            let district = data.address.city_district;
            let city = data.address.city;
            let address = borough+suburb+town+county+district+city;
            let jrecord = JSON.stringify(data);
            if (suburb){
                returnSub = suburb;
            }
            else if (borough){
                returnSub = borough;
            }
            else if (town){
                returnSub = town;
            }
            else{
                returnSub = 'Unknown';
            }
            if (district){
                returnDistrict = district;
            }
            else if (county){
                returnDistrict = county;
            }
            else{
                returnDistrict = 'Unknown';
            }
            document.querySelector('.district').innerHTML=returnDistrict;
            document.querySelector('.suburb').innerHTML=returnSub;
            //fetch rainfall for mylocation
            fetch(`https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en`)
            .then(response =>{
                if (response.status == 200) { //receive response successfully
                    response.json().then( WR => {
                        if (WR.rainfall.data || WR.rainfall.data==0) {
                            myCurrentRainfall = WR.rainfall.data;    
                            returnDistrict01 = returnDistrict.split(" ")[0];
                            for (let i=0; i<myCurrentRainfall.length; i++){
                                if (myCurrentRainfall[i].place.split(" ")[0]== returnDistrict01){
                                    document.querySelector('.myLocationRainfall').innerHTML=myCurrentRainfall[i].max+'<span>mm</span>';
                                }
                            }
                        } else {
                            // nth
                        }
                    });
                }
            });    
            // calculate the nearest station base on my coordination
            const R = 6371e3;
            let lat1 = mylat * Math.PI/180;
            let lng1 = mylng * Math.PI/180;
            let minD1 = 999999999;
            let minLocationID1 = 0;
            let init = {
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            // for temperature
            // fetch OGCIO weather station info -- static
            fetch('./data/OGCIO_weather_url.json', init)
                .then(response => response.json())
                .then(data => {
                    for (let i=0; i<data.length; i++){
                        lat2 = data[i].latitude * Math.PI/180;
                        lng2 = data[i].longitude * Math.PI/180;
                        let x = (lng2-lng1) * Math.cos((lat1+lat2)/2);
                        let y = lat2-lat1;
                        let d = Math.sqrt(x*x + y*y) * R;
                        // console.log('compare with '+data[i].station_name_en+':'+d);
                        if (d<=minD1){
                            minD1=d;
                            minLocationID1 = i;
                        }

                        console.log('mylat')
                        console.log(mylat)
                        console.log(mylng)
                        console.log('his:lat')
                        console.log(data[minLocationID1].latitude)
                        console.log(data[minLocationID1].longitude)
                        console.log('dist')
                        console.log(minD1)
                    }
                    fetch(`https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en`)
                        .then(response =>{
                            if (response.status == 200) { //receive response successfully
                                response.json().then( WR => {
                                    for (let i=0; i<WR.temperature.data.length; i++){
                                        if (WR.temperature.data[i].place == data[minLocationID1].station_name_en){
                                            document.querySelector('.myLocationTemp').innerHTML=WR.temperature.data[i].value+'<span>&#176;C</span>';
                                        }
                                    }
                                });
                            }
                        });
                })
                .catch(err => {
                    console.log(err);
                })
            minD2 = 999999999;
            minLocationID2 = 0;
            // for aqhi
            // fetch AQ monitoring station info -- static
            fetch('./data/aqhi-station-info.json', init)
                .then(response => response.json())
                .then(data => {
                    for (let i=0; i<data.length; i++){
                        lat2 = data[i].lat * Math.PI/180;
                        lng2 = data[i].lng * Math.PI/180;
                        let x = (lng2-lng1) * Math.cos((lat1+lat2)/2);
                        let y = lat2-lat1;
                        let d = Math.sqrt(x*x + y*y) * R;

                        if (d<=minD2){
                            minD2=d;
                            minLocationID2 = i;
                        }
                    }
                    updateAQHI(data);
                })
                .catch(err => {
                    console.log(err);
                })
          })
          .catch(err => {
            console.log(err);
          })
    }
    function error() {
        console.log("Unable to retrieve your location");
    }
    navigator.geolocation.getCurrentPosition(success, error);
}

// fecth OGCI AQHI -- updated hourly
function updateAQHI(data){
    OGCIO_air_url = `https://dashboard.data.gov.hk/api/aqhi-individual?format=json`;
    fetch(OGCIO_air_url)
        .then(response => response.json())
        .then(dataaqhi => {
            for (let i=0; i<dataaqhi.length; i++){
                if (dataaqhi[i].station == data[minLocationID2].station){
                    aqhiLastUpdate = dataaqhi[i].publish_date;
                    var level='';
                    if (dataaqhi[i].aqhi>10)
                        level = 'Serious'
                    if (dataaqhi[i].aqhi>7)
                        level = 'Very High'
                    if (dataaqhi[i].aqhi>6)
                        level = 'High'
                    if (dataaqhi[i].aqhi>3)
                        level = 'Moderate'
                    if (dataaqhi[i].aqhi>0)
                        level = 'Low'
                    document.querySelector('.myLocationAirqua').innerHTML=dataaqhi[i].aqhi+`<span>${level}</span>`;
                    if (dataaqhi[i].aqhi<=3){
                        document.querySelector('.myLocationAirquaIcon').src='./images/aqhi-low.png';
                    }
                    else if (dataaqhi[i].aqhi>=4 || dataaqhi[i].aqhi<=6){
                        document.querySelector('.myLocationAirquaIcon').src='./images/aqhi-moderate.png';
                    }
                    else if (dataaqhi[i].aqhi==7){
                        document.querySelector('.myLocationAirquaIcon').src='./images/aqhi-high.png';
                    }
                    else if (dataaqhi[i].aqhi>=8 || dataaqhi[i].aqhi<=10){
                        document.querySelector('.myLocationAirquaIcon').src='./images/aqhi-very_high.png';
                    }
                    else if (dataaqhi[i].aqhi>10){
                        document.querySelector('.myLocationAirquaIcon').src='./images/aqhi-serious.png';
                    }
                }
            }
        })
        .catch(err => {
            console.log(err);
        });        
}

//initial
FetchCurrentWeatherReport();
Fetch9DayWeatherReport();

//timer
// padding one digit date or month
function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}
// decomepose formatted time to [year, month, date, hour, mins, sec]
function decomposeTime(str) {
    date = str.split("T")[0];
    clock = str.split("T")[1];
    yyyy = parseInt(date.split("-")[0]);
    mm = parseInt(date.split("-")[1]);
    dd = parseInt(date.split("-")[2]);
    hrs = parseInt(clock.split(":")[0]);
    mins = parseInt(clock.split(":")[1]);
    sec = parseInt(clock.split(":")[2]);
    return [yyyy, mm, dd, hrs, mins, sec];
}
//formatize time from [year, month, date, hour, mins, sec] to e.g. 2021-03-28T18:13:40
function formatize(timeList) {
    return `${timeList[0]}-${pad(timeList[1])}-${pad(timeList[2])}T${pad(timeList[3])}:${pad(timeList[4])}:${pad(timeList[5])}`
}

headerBlock = document.querySelector('div.shadow');
function checkTime(){
    var now = new Date();
    var yyyy = now.getFullYear();
    var mm = now.getMonth()+1;
    var dd = now.getDate();
    var hours=now.getHours();
    var mins=now.getMinutes();
    var sec=now.getSeconds();
    timeList = [yyyy,mm,dd,hours,mins,sec];
    //set background of header block
    if (hours<=18){
        if (CurrentRainfall){
            headerBlock.style.backgroundImage = "url('images/water-drops-glass-day.jpg')";
            headerBlock.style.color = "black";
        }
        else{
            headerBlock.style.backgroundImage = "url('images/blue-sky.jpg')";
            headerBlock.style.color = "black";
        }
    } 
    else {
        if (CurrentRainfall){
            headerBlock.style.backgroundImage = "url('images/water-drops-glass-night.jpg')";
            headerBlock.style.color = "white";
        }
        else{
            headerBlock.style.backgroundImage = "url('images/night-sky.jpg')";
            headerBlock.style.color = "white";
        }
    }



    //build date object refering to next update time
    if (HKOLastUpdate && day9LastUpdate && aqhiLastUpdate){
        nowTimeObj = new Date(yyyy, mm, dd, hours, mins, sec, 0);
        HKOTimeObj = decomposeTime(HKOLastUpdate);
        HKOTimeObj = new Date(HKOTimeObj[0], HKOTimeObj[1], HKOTimeObj[2], HKOTimeObj[3], HKOTimeObj[4], HKOTimeObj[5], 0);
        day9TimeObj = decomposeTime(day9LastUpdate);
        day9TimeObj = new Date(day9TimeObj[0], day9TimeObj[1], day9TimeObj[2], day9TimeObj[3], day9TimeObj[4], day9TimeObj[5], 0);
        aqhiTimeObj = decomposeTime(aqhiLastUpdate);
        aqhiTimeObj = new Date(aqhiTimeObj[0], aqhiTimeObj[1], aqhiTimeObj[2], aqhiTimeObj[3], aqhiTimeObj[4], aqhiTimeObj[5], 0);
        HKOTimeObj.setHours(HKOTimeObj.getHours() + 1);
        day9TimeObj.setHours(day9TimeObj.getHours() + 12);
        aqhiTimeObj.setHours(aqhiTimeObj.getHours() + 1);

        // console.log(nowTimeObj);
        // console.log("HKO : "+HKOTimeObj);
        // console.log("9day : "+day9TimeObj);
        // console.log("aqhi : "+aqhiTimeObj);

        //check if current time exceed next upate time
        if (nowTimeObj>HKOTimeObj){
            //fetch current weather report -- updated hourly
            FetchCurrentWeatherReport();
            console.log('updated hko');
        }
        if (nowTimeObj>day9TimeObj){
            //fetch 9-day Weather Forecast API -- updated twice daily
            Fetch9DayWeatherReport();
            console.log('updated hk9');
        }
        if (nowTimeObj>aqhiTimeObj){
            console.log('updated aqhi');
            let init = {
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            fetch('./data/aqhi-station-info.json', init)
                .then(response => response.json())
                .then(data => {
                    updateAQHI(data);
                })
        }
    }
}
setInterval("checkTime()",1000);

