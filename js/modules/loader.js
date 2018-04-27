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
        console.log("Application initialized.");
    };
    
    // Load sources after window.onload.
    let load = function(){
        console.log("Application loaded.");
        
       //  var results = JSON.parse()
        
    };
        
    return {
        init,
        load
    }    
    
})();