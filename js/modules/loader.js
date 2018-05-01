import {util} from './util.js';
import {printer} from './console.js';
import {request} from './request.js';
import {dom} from './dom.js';
import {weather} from './weather.js';
import {callbacks} from './callbacks.js';
import {states} from './states.js';

/*
    loader.js
    Runs methods on browser load.
*/

"use strict";

// Create the loader module.
export let loader = (function() {
        
    // Get the event dispatcher.
    let dispatcher = callbacks.EventDispatcher();
    
    // Initialize application.
    let init = function(callback) {                
        // Register the callback.
        if(callback) { dispatcher.addEventListener(events.oninit, callback); }
        
        // Set the global value for debug mode.
        global.set("debug", true);
        global.set("localStorageID", "iae2784-");                
                
        // Set the debug value for the printer, using the global value.
        printer.setDebug(global.get("debug"));     
        printer.debug(printer.type.WARN)("Running in debug mode."); // Declare debug mode, if running in debug mode.   
                
        // Dispatch the initialization event.
        dispatcher.dispatchEvent(events.oninit, this); 
    };
    
    // Load sources after window.onload.
    let load = function(callback){
        // Register event.
        if(callback) { dispatcher.addEventListener(events.onload, callback); }
        
        // Assign modules to global scope.
        global.set("callbacks", callbacks);
        global.set("dom", dom);
        global.set("printer", printer);
        global.set("request", request);
        global.set("util", util);
        global.set("weather", weather);
        global.set("states", states);
        
        printer.log(util.loadingModules(dom, printer, request, util, weather, states));
        printer.debug()("Application modules loaded into memory.");
        
        dispatcher.dispatchEvent(events.onload, this);                
    };
    
    // String to print when parsing this object.
    let toString = function(){
        return `[module Loader]`;
    }
        
    return {
        toString,
        init,
        load,
        set oninit(callback) {
            dispatcher.addEventListener(events.oninit, callback);  
        },
        set onload(callback) {
            dispatcher.addEventListener(events.onload, callback);
        }        
    }    
    
})();