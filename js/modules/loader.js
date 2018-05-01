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
                
        let configuration = request.RequestConfiguration({
            url: "config.json",
            action: "GET",
            mimeType: "application/json",
            type: "json",
            cacheResults: true,
            callbacks: {
                error: function(err) {
                    printer.error(`${err} - An error occured while requesting the resource '${this.url}'.`);                    
                },
                load: function() {
                    
                    // Save the request response.
                    req.response = req.getXMLHttpRequest().response;
                    printer.debug(printer.type.DIR)(req.response);
                    
                    // JSON values for the configuration JSON.
                    let configJSON = req.response;
                    
                    // Save values to the local storage.
                    printer.debug()(`API Keys:`);
                    printer.debug(printer.type.DIR)(configJSON);
                    
                }
            }
        });
        printer.debug(printer.type.DIR)(configuration);

        let req = request.Request(configuration);
        printer.debug(printer.type.DIR)(req);
        
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