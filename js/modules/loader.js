import {util} from './util.js';
import {printer} from './console.js';
import {request} from './request.js';
import {dom} from './dom.js';

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
        printer.log(util.loadingModules(util, printer, request, dom));
        printer.debug()("Application modules loaded into memory.");
    };
    
    // Load sources after window.onload.
    let load = function(){
        
        global.set("dom", dom);
        global.set("printer", printer);
        global.set("request", request);  
        printer.debug()("Assigned loaded modules to global memory.");
        
        
        
        

        let configuration = request.RequestConfiguration();
        configuration.url = "config.json";
        configuration.action = "GET";
        configuration.mimeType = "application/json";
        configuration.cacheBuster = true;
        printer.dir(configuration);

        let req = request.Request(configuration);
        req.setCallbacks({
            load: function() {
                req.response = JSON.parse(req.object.responseText);
                printer.log(req.response);
            }
        });

        req.open();
        
        
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