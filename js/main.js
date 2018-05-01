import {loader} from './modules/loader.js';

/*
    main.js
    This module is the entry point for the program.
    It imports the above files in order to 
    run the program.
*/

"use strict";

// Dependences.
let stateManager = undefined;
let callbacks = undefined;
let states = undefined;
let request = undefined;
let printer = undefined;
let weather = undefined;
let dom = undefined;
let util = undefined;

// Tracker.
let settings = {
    frameCounter: 0,
    lastFrame: 0,
    currentFrame: 0,
    timeSinceLastFrame: 0,
    fps: {
        limit: 15,
        collection: [0],
        calculate: function() {
            let rate = ((1000 * 10) / (settings.timeSinceLastFrame * 10)).toPrecision(3);
            settings.fps.collection.unshift(rate);
            if(settings.fps.collection.length > settings.fps.limit){
                settings.fps.collection.pop();
            } 
            return rate;
        },
        average: function() {
            let sum = 0;
            settings.fps.collectionCount = 0;
            for(let rate of settings.fps.collection){
                sum += parseFloat(rate);
                settings.fps.collectionCount++;
                if(settings.fps.collectionCount > settings.fps.limit) { break; }
            }
            return (sum / settings.fps.collectionCount).toPrecision(3);
        },
        collectionCount: 0,
        lastPrint: 0,
        currentPrint: 0
    }
}

// Called once the window has been loaded into memory.
window.onload = function(){    
    
    // Once loader is initialized, load all modules.
    loader.oninit = function(e){                         
        // Call the load function.
        loader.load();
    };
    
    // Once all modules are loaded.
    loader.onload = function(e){
        
        // Assign dependecies their values.        
        callbacks = global.get("callbacks");
        states = global.get("states");
        util = global.get("util");
        request = global.get("request");
        printer = global.get("printer");
        weather = global.get("weather");
        dom = global.get("dom");
        
        // Remove some values from local storage, if in debug mode.
        if(global.get("debug")){
            printer.debug(printer.type.WARN)("Removing API keys for debug mode testing.");            
            
            // Use of the utility to remove item from local storage: necessary since a unique key is appended to prevent overwriting.
            util.removeItem(global.keys.apikeys.openweathermap);     
            util.removeItem(global.keys.apikeys.youtube);
        }
        
        // Initialize the weather API.
        weather.init(function(e){
            printer.debug()(weather.settings.apiKey);            
        });
        
        // Create state manager.
        stateManager = states.StateManager();
        stateManager.changeState(states.States.COMPLETE);
        stateManager.changeState(states.States.PENDING);
        
        // Add more window listeners.
        window.onblur = onblur;
        window.onfocus = onfocus;
        
        // Set up the content.    
        global.set("form", document.forms.namedItem('location'));
        let form = global.get("form");
        printer.debug(printer.type.DIR)(form);
        form.addEventListener('submit', onsubmit, false);
                
        // Call the update method.
        global.set("updateAnimationID", requestAnimationFrame(update.bind(this)));
    };    
    
    // Initialize the loader.
    loader.init();
};

// Citation reference: FormData API [https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects]

// occurs on form submission.
let onsubmit = function(e) {
    
    // Get the form data.
    let formData = new FormData(global.get("form"));
    printer.debug(printer.type.DIR)(formData);
    
    // Get reference to the output element.
    let outputElement = document.getElementById("currentInfo");
    
    // Weather parameters.
    let parameters = {
        zipcode: formData.get("zipcode"),
        country: formData.get("countryCode"),
        units: formData.get("format")
    };    
    printer.debug(printer.type.DIR)(parameters);
        
    e.preventDefault();
    
    // Bind the parameters.
    weather.bindParameters(parameters);
    printer.debug()(weather.parameters);
    
    // Load the API results.
    weather.load(function(e){
        let r = weather.settings.cachedResult;
        printer.debug()(r);   
        printer.debug()("Is it daytime? " + weather.isDaytime.call(r));
        printer.debug()(`Icon URL: ${weather.getIcon.call(r)}`);
        printer.debug()(`Condition: ${weather.getCondition.call(r)}`);
        
        let condition = weather.getCondition.call(r);
        
        let location = `${r.name}, ${r.sys.country.toUpperCase()}`;
        let temperature = r.main.temp.toString();
        let unit = "Kelvin";
        switch(parameters.units){
            case "imperial":
                unit = "farenheit";
                break;
            case "metric":
                unit = "celsius";
                break;
        }
        
        let display = `Your current temperature for ${location} is ${temperature} ${unit}.`
                    + `<br/> ${condition.name}: ${condition.description}`;
        let elem = document.getElementById("currentInfo");
        elem.innerHTML = display;
        elem.classList.remove("hidden");
        elem.classList.add("visible");        
    });
}

let onblur = function() {
    
    if(!stateManager.isInState(states.States.INIT)){
        printer.debug()(`Window blured at ${new Date().toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}.`);
        printer.debug()("Current state: " + states.States.parse(stateManager.currentState));
        let animID = global.get("updateAnimationID");
        if(animID){ cancelAnimationFrame(animID); }
    }
    
}
    
let onfocus = function() {
    
    if(!stateManager.isInState(states.States.INIT)){
        printer.debug()(`Window focus regained at ${new Date().toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}.`);
        printer.debug()("Current state: " + states.States.parse(stateManager.currentState));
        global.set("updateAnimationID", requestAnimationFrame(update.bind(this)));
    }
}

let calculateFPSAverage = function() {
    // Update frame metadata.
    settings.frameCounter++;
    settings.lastFrame = settings.currentFrame;
    settings.currentFrame = Date.now();
    settings.timeSinceLastFrame = settings.currentFrame - settings.lastFrame;
    settings.fps.calculate();
    
    // Calculate FPS averages.
    settings.fps.currentPrint = settings.fps.average();  
    if((settings.fps.currentPrint - settings.fps.lastPrint) > 0.1) {
        printer.debug()(`FPS (avg. last ${settings.fps.collectionCount} frames): ${settings.fps.currentPrint} frames/sec.`);
        settings.fps.lastPrint = settings.fps.currentPrint;  
    }    
}

// Update the main application loop after loading the modules. 
let update = function() {

    // Calculate FPS if debug mode is on.
    if(global.get("debug")){
        calculateFPSAverage();
    }
    
    if(stateManager.currentState == states.States.PENDING){
        
        dom.HTMLContent.textContent = "Enter your information below to find relevant videos.";
                
    }
    
    
    
    
    // Loop the update method.
    requestAnimationFrame(update.bind(this));
}

    
    
    /*
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
    
    printer.dir(apiKeys);*/
    
    
