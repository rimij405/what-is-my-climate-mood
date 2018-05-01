import {loader} from './modules/loader.js';

/*
    main.js
    This module is the entry point for the program.
    It imports the above files in order to 
    run the program.
*/

"use strict";

// Called once the window has been loaded into memory.
window.onload = function(){
        
    // Set the global value for debug mode.
    global.set("debug", true);
    global.set("localStorageID", "iae2784-");
    
    // Initialize the loader.
    loader.init();
    
    // Load the application resources.
    loader.load();
    
    // Get the modules that the loader loaded in.
    let request = global.get("request");
    let printer = global.get("printer");
    let weather = global.get("weather");
    let dom = global.get("dom");
    
    // init the weather module.
    weather.init();
    
    // Get a result.
    
    weather.onLoad(function(results){
        
        printer.dir(results);
        let mood = results.weather[0];
        printer.log(mood.id);
        printer.log(results.sys.sunrise);
        printer.log(Date.now());
        let daytime = (Date.now() < results.sys.sunset && Date.now() > results.sys.sunrise);
        let iconURL = `http://openweathermap.org/img/w/${weather.getIcon(mood.id)}${daytime ? "d" : "n"}.png`;
        
        let image = dom.HTMLElement.Image({}, iconURL);
        dom.HTMLContent.appendChild(image.element);
        
    });
    
    let currentWeather = weather.result;
    printer.log(currentWeather);
    
    
    // Retrieve the api keys.
    let apiKeys = {
        owm: localStorage.getItem(`${global.get("localStorageID")}apikey-owm`),
        ytd: localStorage.getItem(`${global.get("localStorageID")}apikey-ytd`)
    };
    
    printer.dir(apiKeys);
    
};
    
