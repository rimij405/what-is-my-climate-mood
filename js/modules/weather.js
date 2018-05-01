/*
    weather.js
    Weather info.
*/

"use strict";

export let weather = (function(){
                
    // Get modules from global collection.
    let printer = global.get("printer");
    let request = global.get("request");
    let util = global.get("util");
    
    let settings = {
        timeOfLastAPICall: 0,
        cachedResult: undefined,
        apiKey: undefined     
    };
    
    let parameters = {
        zipCode: undefined,
        countryCode: undefined
    }
        
    let onload = undefined;
    
    function getIcon(code){
        switch(code){
            case 200:
                return "11";
            case 300:
                return "09";
            case 600:
                return "13";
            case 701:
                return "50";
            case 800:
            default: 
                return "01";
        }
        
    }
    
    // Function that will load in the api keys via XHR request.
    function getAPIKey() {
                
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
                        let configJSON = req.getXMLHttpRequest().response;
                        util.setItem("apikey-owm", configJSON.apiKeys.openWeatherMapAPI);                        
                        util.setItem("apikey-ytd", configJSON.apiKeys.youtubeDataAPI);
                    }
                }
            })        
        );
        req.open();
    }
    
    function getResult() {
        
        // Update time since last API call value.
        let temp = util.getItem("timeOfLastAPICall-owm");
        settings.timeOfLastAPICall = temp ? temp : 0;
        
        // Check if we need to get a new cache?
        if(settings.timeSinceLastAPICall > 0 && cachedResult){
            let differenceInTime = Date.now() - settings.timeOfLastAPICall;
            printer.debug()(`Time since last call: ${settings.timeOfLastAPICall}`);
            if(differenceInTime < 10000){
                if(onload) { onload(settings.cachedResult); }
                return settings.cachedResult;
            }
        }
        
        // If we need to refresh the cache:
                
        // Get the current weather.        
        let reqConfig = request.RequestConfiguration({
            url: `https://api.openweathermap.org/data/2.5/weather?zip=${parameters.zipCode},${parameters.countryCode}&appid=${settings.apiKey}`,
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
                    util.setItem("timeOfLastAPICall-owm", Date.now());
                    if(onload) { onload(settings.cachedResult); }
                }
            }
        });
        printer.debug(printer.type.DIR)(reqConfig);

        let req = request.Request(reqConfig);
        printer.debug(printer.type.DIR)(req);
        
        req.open();
    }
    
    function init() {

        // Set up modules.
        printer = global.get("printer");
        request = global.get("request");
        util = global.get("util");
        
        // No call has been made yet.
        let temp = util.getItem("timeOfLastAPICall-owm");
        settings.timeOfLastAPICall = temp ? temp : 0;
        util.setItem("timeOfLastAPICall-owm", settings.timeOfLastAPICall);
        printer.debug()(`Time since last call: ${settings.timeOfLastAPICall}`);
        
        // Get the api key.
        settings.apiKey = util.getItem("apikey-owm");
        if(settings.apiKey == null){
            getAPIKey();
            settings.apiKey = util.getItem("apikey-owm");
        }       
        
        // Get the cached result if it exists.
        settings.cachedResult = util.getItem("cached-owm");   
        
        // Set the parameters.
        parameters.zipCode = "14623";
        parameters.countryCode = "US";
        
        // Print the settings.
        printer.debug(printer.type.DIR)(settings);
        
        getResult();
        
    }
    
    
    // String to print when parsing this object.
    let toString = function(){
            return `[module Weather]`;
    }
    
    return {
        toString,
        init,
        result: (function() { 
            return settings.cachedResult;
        })(),
        parameters,
        onLoad: function(eventHandler){
            onload = eventHandler;
        },
        getIcon
    }
    
    
})();