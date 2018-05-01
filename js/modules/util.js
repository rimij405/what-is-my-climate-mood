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
        
    // Get formatted local storage key.
    function getLocalStorageKey(key) {
        return `${global.get("localStorageID")}${key}`;
    }
    
    // Get an item from local storage.
    function getLocalStorageItem(key) {
        let item = localStorage.getItem(getLocalStorageKey(key));
        return item ? item : undefined;
    }
    
    // Set an item in local storage.
    function setLocalStorageItem(key, item){
        localStorage.setItem(getLocalStorageKey(key), item);
    }
    
    // Remvoe an item from local storage.
    function removeLocalStorageItem(key){
        localStorage.removeItem(getLocalStorageKey(key));
    }
    
    return {
        // String to print when parsing this module.
        toString: function(){
            return `[module Util]`;
        },
        loadingModules,
        getLocalStorageKey,
        setItem: setLocalStorageItem,
        getItem: getLocalStorageItem,
        removeItem: removeLocalStorageItem
    }
    
})();