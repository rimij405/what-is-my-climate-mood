import {util} from './util.js';
import {printer} from './console.js';
import {request} from './request.js';
import {dom} from './dom.js';
import {weather} from './weather.js';

/*
    loader.js
    Runs methods on browser load.
*/

"use strict";

// Create the loader module.
export let loader = (function() {
    
    // Private data members.
    let config = undefined;
    
    // Initialize application.
    let init = function() {
        printer.setDebug(global.get("debug"));
        printer.debug(printer.type.WARN)("Running in debug mode.");
        printer.log(util.loadingModules(util, printer, request, weather, dom));
        printer.debug()("Application modules loaded into memory.");
    };
    
    // Load sources after window.onload.
    let load = function(){
        
        global.set("dom", dom);
        global.set("printer", printer);
        global.set("request", request);
        global.set("util", util);
        global.set("weather", weather);
                
        printer.debug()("Assigned loaded modules to global memory.");
                
    };
    
    // String to print when parsing this object.
    let toString = function(){
            return `[module Loader]`;
    }
        
    return {
        toString,
        init,
        load
    }    
    
})();