/*
    util.js
    Methods shared across modules.
*/

// Functions are returned from IIFE util below.
export let util = (function(){
    
    // List modules that are being loaded.
    function loadingModules(){
        let message = 'Loading modules';
        let args = [...arguments]; // spread syntax!        
        for(let arg of args){
            message += `\n${arg}`;
        }        
        return message;
    }
    
    return {
        // String to print when parsing this module.
        toString: function(){
            return `[module Util]`;
        },
        loadingModules
    }
    
})();