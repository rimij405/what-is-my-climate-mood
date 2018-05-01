/*
    globals.js
    Contains values shared across modules.
*/

"use strict";

// Global options class.
const options = (function(){

    // Helper function that trims and lowercases a key, if possible.
    function getKey(value){
        if(value){
            let key = value.toString();
            value.trim().toLowerCase();
            return value;
        }
        return undefined;
    }
    
    // An option object holds a series of key/value pairs.
    function Options(pairs = []){
        for(let {key, value} of pairs){
            this.set(key, value);
        }
    }

    // Check if a value exists.
    Options.prototype.has = function(key){
        let validKey = getKey(key);
        if(validKey){
            if(this[validKey]){
                return true;
            }
        }
        return false;
    }
    
    // Retrieve a value.
    Options.prototype.get = function(key){            
        let validKey = getKey(key);
        if(!validKey) { return undefined; }
        return this[validKey];
    }

    // Set an option in the object.
    Options.prototype.set = function(key, value){          
        let validKey = getKey(key);
        if(!validKey) { return this; }
        this[validKey] = value ? value : undefined;
        return this;
    }
    
    // Create a property pair.
    function CreatePair(key, value){
        return {key, value};
    }
    
    // Create an option set.
    function CreateOptions(pairs = []){
        return new Options(pairs);
    }
    
    return {
        Options: CreateOptions,
        Pair: CreatePair
    }

})();

// Global class and values.
const global = {   
    
    // Keys used for local storage.
    keys: {
        lastAPICall: {
            openweathermap: "lasttime-owm",
            youtube: "lasttime-ytd"
        },
        apikeys: {
            openweathermap: "apikey-owm",
            youtube: "apikey-ytd"
        },        
        cache: {
            openweathermap: "cache-owm",
            youtube: "cache-ytd"
        }
    },
    
    // Retrieve a value associated with the key. If no modules apply, it will check preferences. If no preferences apply, it will return undefined.
    get: function(key){
        if(key){
            if(this.hasModule(key)){
                return this.getModule(key);
            }
            else if(this.hasPreference(key)){
                return this.getPreference(key);
            }
        }
        return undefined;        
    },
    
    // Set a value, based on the input. If it's an object, it will add a module. If 
    set: function(key, value){
        if(key){
            if(this.hasModule(key) 
               || this.hasPreference(key)
               || !value){
                return undefined;
            }    
            
            // Also add it to the global properties.
            this[key] = value;
            
            // if an object, it is assumed to be a module. Use a more specific setter to set objects as global preferences.
            if(typeof value === 'object'){
                return this.addModule(key, value);
            }
            
            // if it is not an object, it's a preference.
            else {
                return this.addPreference(key, value);
            }
        }
        return undefined;
    },
    
    // Global reference to modules needed by other classes.
    modules: options.Options(),
        
    // Check if there is reference for a global module.
    hasModule: function(key){
        if(key){
            return this.modules.has(key);
        }
        return false;
    },
    
    // Method to add module to the collection.
    addModule: function(key, unit){
        if(key){
            if(!this.modules.has(key)){
                this.modules.set(key, unit);
            }
            return this.modules.get(key);
        }
        return undefined;
    },
    
    // Return module associated with a particular key.
    getModule: function(key){
        if(key){
            return this.modules.get(key);
        }
        return undefined;
    },
    
    // Global reference to global preferences. (eg. Debug mode).
    preferences: options.Options(),
            
    // Check if there is reference for a global preference.
    hasPreference: function(key){
        if(key){
            return this.preferences.has(key);
        }
        return false;
    },
    
    // Method to add preference to the collection.
    addPreference: function(key, value){
        if(key){
            if(!this.preferences.has(key)){
                this.preferences.set(key, value);
            }
            return this.preferences.get(key);
        }
        return undefined;
    },
    
    // Return preference associated with a particular key.
    getPreference: function(key){
        if(key){
            return this.preferences.get(key);
        }
        return undefined;
    }    
};

// Event names.
const events = (function(){
    
    // Basic events that will be handled.
    const register = {
        oninit: 'init',
        onload: 'load',
        onerror: 'error',
        onabort: 'abort',
    }
    
    return register;
    
})();
