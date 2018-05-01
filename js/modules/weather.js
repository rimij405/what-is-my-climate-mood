/*
    weather.js
    Weather info.
*/

"use strict";

export let weather = (function(){
                
    // Get modules from global collection.
    let dispatcher = undefined;
    let printer = undefined;
    let request = undefined;
    let util = undefined;    
    let params = undefined;
        
    let settings = {
        paramsChanged: false,
        timeOfLastAPICall: 0,
        cachedResult: undefined,
        apiKey: undefined     
    };
    
    // Parameters object.
    const Parameters = (function(){
        
        const formats = {
            imperial: "imperial",
            metric: "metric",
            standard: "standard"
        }
        
        // Object representing API parameters.
        function Parameters(zipcode, country, units){
            this.__zipcode = zipcode ? zipcode : undefined;
            this.__country = country ? country : undefined;
            this.__units = undefined;
            
            if(units) {
                switch(units){
                    case formats.imperial:
                        this.setImperial();
                        break;
                    case formats.metric:
                        this.setMetric();
                        break;
                    case formats.standard:
                    default:
                        this.setStandard();
                        break;
                }
            }
        }
        
        // Getters and setters.
        Parameters.prototype = {
            get url(){
                return this.getURL();
            },
            get zipcode(){
                return this.__zipcode;
            },
            set zipcode(value){
                if(value && typeof value === 'string') { this.__zipcode = value; }  
            },
            get country(){
                return this.__country;
            },
            set country(value){
                if(value && typeof value === 'string') { this.__country = value; }  
            },
            get units(){
                return this.__units;
            },
            set units(value){
                if(value && typeof value === 'string') { this.__units = value; }
            }
        }

        // Get parameters as unencoded URL string.
        Parameters.prototype.toString = function() {
            return `zip=${this.zipcode},${this.country.toLowerCase()}${this.units ? `&units=${this.units}` : ''}`;
        }
        
        // Get encoded URL.
        Parameters.prototype.getURL  = function(){
            return encodeURI(this.toString());
        }
        
        Parameters.prototype.setImperial = function() {
            this.units = "imperial";
        }
        
        Parameters.prototype.setMetric = function(){
            this.units = "metric";
        }
        
        Parameters.prototype.setStandard = function(){
            this.units = undefined;
        }
        
        function CreateParameters(zipcode, country, units){
            return new Parameters(zipcode, country, units);
        }
        
        return CreateParameters;
        
    })();
    
    // Initialize the weather API.
    function init(callback) {

        // Set up modules.
        dispatcher = global.get("callbacks").EventDispatcher();        
        printer = global.get("printer");
        request = global.get("request");
        util = global.get("util");
        
        if(callback) { dispatcher.addEventListener(events.oninit, callback); }
        
        // Initialize parameters.
        params = Parameters();
        params.setImperial();   
        
        // Get the API Key.
        settings.apiKey = util.getItem(global.keys.apikeys.openweathermap);
        if(!settings.apiKey){       
            // Loading API keys.
            printer.debug()("Loading API Keys from config.json.");
            
            // Get the config.json object.
            let configJSON = global.get("configJSON");
            if(!configJSON){
                // Get the configuration.
                let req = request.Request(
                    request.RequestConfiguration({
                        url: 'config.json',
                        action: 'GET',
                        mimeType: 'application/json',
                        type: 'json',
                        cacheResults: true,
                        callbacks: {
                            load: function(){
                                global.set("configJSON", req.getXMLHttpRequest().response);
                                configJSON = global.get("configJSON");                                
                                util.setItem(global.keys.apikeys.openweathermap, configJSON.apiKeys.openWeatherMapAPI);       
                                settings.apiKey = util.getItem(global.keys.apikeys.openweathermap);
                                printer.debug()("OpenWeatherMap API KEY: " + settings.apiKey);
                            }
                        }
                    })        
                );
                req.open();
            }
        }
        
        // settings.
        settings.cachedResult = util.getItem(global.keys.cache.openweathermap);
        settings.timeOfLastAPICall = util.getItem(global.keys.lastAPICall.openweathermap);
        if(!settings.timeOfLastAPICall) { settings.timeOfLastAPICall = 0; }
        printer.debug(printer.type.DIR)(settings);
        
        dispatcher.dispatchEvent(events.oninit, this);        
    }
    
    // Pass in and bind form paramters to the parameters object.
    function bindParameters(paramData){
        settings.paramsChanged = true;
        params = Parameters(paramData.zipcode, paramData.country, paramData.units);
        printer.debug(printer.type.DIR)(params);
    }
    
    // Load data using the input parameters.
    function load(callback) {
        
        if(callback) { dispatcher.addEventListener(events.onload, callback); }
        
        let lastAPICall = util.getItem(global.keys.lastAPICall.openweathermap);
        settings.timeOfLastAPICall = lastAPICall ? lastAPICall : 0;        
        settings.cachedResult = util.getItem(global.keys.cache.openweathermap);
        
        // Check if we can use the old stash.
        if(!settings.paramsChanged && settings.cachedResult && settings.timeOfLastAPICall > 0){
            let differenceInTime = Date.now() - settings.timeOfLastAPICall;
            printer.debug()(`Time since last call: ${settings.timeOfLastAPICall}`);
            if(differenceInTime < 10000){
                // Just use the cached result.
                dispatcher.dispatchEvent(events.onload, this);
                return;
            }
        } 
        else
        {              
            // Get the current weather.        
            let reqConfig = request.RequestConfiguration({
                url: `https://api.openweathermap.org/data/2.5/weather?${params.url}&appid=${settings.apiKey}`,
                action: "GET",
                mimeType: "application/json",
                type: "json",
                cacheResults: false,
                callbacks: {
                    error: function(err) {
                        printer.error(`${err} - An error occured while requesting the resource '${this.url}'.`);                    
                    },
                    load: function() {
                        // Save the request response.
                        let weatherJSON = req.getXMLHttpRequest().response;                        
                        printer.debug()(`Requested resource from '${req.settings.url}'.`);
                        printer.debug()(weatherJSON);

                        // Cache the response.
                        settings.cachedResult = weatherJSON;
                        util.setItem(global.keys.lastAPICall.openweathermap, Date.now());
                        util.setItem(global.keys.cache.openweathermap, weatherJSON);
                                                
                        settings.paramsChanged = false;
                        dispatcher.dispatchEvent(events.onload, this);
                    }
                }
            });
            printer.debug(printer.type.DIR)(reqConfig);

            let req = request.Request(reqConfig);
            printer.debug(printer.type.DIR)(req);

            req.open();             
        }        
    }
        
    // Returns icon URL.
    function getIcon(){
        return `http://openweathermap.org/img/w/${this.weather[0].icon}.png`;        
    }
        
    // Get the weather code.
    function getCondition(){
        printer.debug()(this.weather[0]);        
        let code = this.weather[0].id.toString();
        return weatherCodes.get(code);
    }
    
    // Is daytime?
    function isDaytime(){
        let currentTime = Date.now();
        let sunrise = this.sys.sunrise;
        let sunset = this.sys.sunset;
        return (currentTime > sunrise && currentTime < sunset);
    }
    
    const weatherCodes = (function(){
        
        // Citation: [https://openweathermap.org/weather-conditions]
        
        let conditions = {
            thunderstorm: "Thunderstorm",
            drizzle: "Drizzle",
            rain: "Rain",
            snow: "Snow",
            hazard: "Atmosphere",
            clear: "Clear",
            cloudy: "Clouds"
        }
        
        function Condition(group, desc){
            this.name = group;
            this.description = desc;
        }
        
        Condition.prototype.toString = function(){
            return `[${this.name} Condition] - "${this.description}"`;
        }
        
        function CreateCondition(group, description){
            return new Condition(group, description);
        }
        
        let codeMap = new Map();
        
        // Group 2xx: Thunderstorm.
        codeMap.set('200', CreateCondition(conditions.thunderstorm, "Thunderstorm with light rain."));
        codeMap.set('201', CreateCondition(conditions.thunderstorm, "Thunderstorm with rain."));
        codeMap.set('202', CreateCondition(conditions.thunderstorm, "Thunderstorm with heavy rain."));
        codeMap.set('210', CreateCondition(conditions.thunderstorm, "Light thunderstorm."));
        codeMap.set('211', CreateCondition(conditions.thunderstorm, "Thunderstorm."));
        codeMap.set('212', CreateCondition(conditions.thunderstorm, "Heavy thunderstorm."));
        codeMap.set('221', CreateCondition(conditions.thunderstorm, "Ragged thunderstorm"));
        codeMap.set('230', CreateCondition(conditions.thunderstorm, "Thunderstorm with light drizzle."));
        codeMap.set('231', CreateCondition(conditions.thunderstorm, "Thunderstorm with drizzle."));
        codeMap.set('232', CreateCondition(conditions.thunderstorm, "Thunderstorm with heavy drizzle."));
        
        // Group 3xx: Drizzle.
        codeMap.set('300', CreateCondition(conditions.drizzle, "Light intensity drizzle."));
        codeMap.set('301', CreateCondition(conditions.drizzle, "Drizzle."));
        codeMap.set('302', CreateCondition(conditions.drizzle, "Heavy intensity drizzle."));
        codeMap.set('310', CreateCondition(conditions.drizzle, "Light intensity drizzle rain."));
        codeMap.set('311', CreateCondition(conditions.drizzle, "Drizzle rain."));
        codeMap.set('312', CreateCondition(conditions.drizzle, "Heavy intensity drizzle rain."));
        codeMap.set('313', CreateCondition(conditions.drizzle, "Shower rain and drizzle."));
        codeMap.set('314', CreateCondition(conditions.drizzle, "Heavy shower rain and drizzle."));
        codeMap.set('321', CreateCondition(conditions.drizzle, "Shower drizzle."));
                
        // Group 5xx: Rain.
        codeMap.set('500', CreateCondition(conditions.rain, "Light rain."));
        codeMap.set('502', CreateCondition(conditions.rain, "Moderate rain."));
        codeMap.set('503', CreateCondition(conditions.rain, "Heavy intensity rain."));
        codeMap.set('501', CreateCondition(conditions.rain, "Very heavy rain."));
        codeMap.set('504', CreateCondition(conditions.rain, "Extreme rain."));
        codeMap.set('511', CreateCondition(conditions.rain, "Freezing rain."));
        codeMap.set('520', CreateCondition(conditions.rain, "Light intensity shower rain."));
        codeMap.set('521', CreateCondition(conditions.rain, "Shower rain."));
        codeMap.set('522', CreateCondition(conditions.rain, "Heavy intensity shower rain."));
        codeMap.set('531', CreateCondition(conditions.rain, "Ragged shower rain."));
        
        // Group 6xx: Snow.
        codeMap.set('600', CreateCondition(conditions.snow, "Light snow."));
        codeMap.set('601', CreateCondition(conditions.snow, "Snow."));
        codeMap.set('602', CreateCondition(conditions.snow, "Heavy snow."));
        codeMap.set('611', CreateCondition(conditions.snow, "Sleet."));
        codeMap.set('612', CreateCondition(conditions.snow, "Shower sleet."));
        codeMap.set('615', CreateCondition(conditions.snow, "Light rain and snow."));
        codeMap.set('616', CreateCondition(conditions.snow, "Rain and snow."));
        codeMap.set('620', CreateCondition(conditions.snow, "Light shower snow."));
        codeMap.set('621', CreateCondition(conditions.snow, "Shower snow."));
        codeMap.set('622', CreateCondition(conditions.snow, "Heavy shower snow."));
        
        // Group 7xx: Atmosphere.
        codeMap.set('701', CreateCondition(conditions.hazard, "Mist."));
        codeMap.set('711', CreateCondition(conditions.hazard, "Smoke."));
        codeMap.set('721', CreateCondition(conditions.hazard, "Haze."));
        codeMap.set('731', CreateCondition(conditions.hazard, "Sand, dust whirls."));
        codeMap.set('741', CreateCondition(conditions.hazard, "Fog."));
        codeMap.set('751', CreateCondition(conditions.hazard, "Sand."));
        codeMap.set('761', CreateCondition(conditions.hazard, "Dust."));
        codeMap.set('762', CreateCondition(conditions.hazard, "Volcanic ash."));
        codeMap.set('771', CreateCondition(conditions.hazard, "Squalls."));
        codeMap.set('781', CreateCondition(conditions.hazard, "Tornado."));
        
        // Group 800: Clear.        
        codeMap.set('800', CreateCondition(conditions.clear, "Clear sky."));
        
        // Group 80x: Clouds.        
        codeMap.set('801', CreateCondition(conditions.cloudy, "Few clouds."));
        codeMap.set('802', CreateCondition(conditions.cloudy, "Scattered clouds."));
        codeMap.set('803', CreateCondition(conditions.cloudy, "Broken clouds."));
        codeMap.set('804', CreateCondition(conditions.cloudy, "Overcast clouds."));
        
        return codeMap;
        
    })();
    
    // String to print when parsing this object.
    let toString = function(){
            return `[module Weather]`;
    }
    
    return {
        toString,
        init,
        load,
        getIcon,
        getCondition,
        isDaytime,
        settings,
        parameters: params,
        bindParameters: bindParameters,
        set oninit(callback) {
            dispatcher.addEventListener(events.oninit, callback);  
        },
        set onload(callback) {
            dispatcher.addEventListener(events.onload, callback);
        }   
    }
    
    
})();