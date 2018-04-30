/*
    console.js
    Wrapper for printing to the console.
*/

// Module controlling the printing of statements.
export let printer = (function() {
    
    // Flags for the debug module.
    const flags = {
        DEBUG_MODE: false,        
    };
    
    // Enum-like keys for message types.
    const type = {
        INFO: "Info",
        WARN: "Warning",
        ERROR: "Error",
        DIR: "List",
        MESSAGE: "Default"
    }
    
    // Return log function based on input type.
    function getLog(logType){
        switch(logType){
            case type.INFO:
                return console.info;
            case type.WARN:
                return console.warn;
            case type.ERROR:
                return console.error;
            case type.DIR:
                return console.dir;
            default:
                return console.log;
        }
    }
    
    // Return a log function, if in debug mode.
    function getDebug(logType){
        return flags.DEBUG_MODE ? getLog(logType) : function(){};
    }
    
    // Set a flag.
    function setFlag(flag, value){
        if(flag != null){
            flags[flag] = (value === true) ? value : false;
        }
    }
    
    // Set value of the debug mode flag.
    function setDebug(value){
        flags.DEBUG_MODE = (value === true) ? value : false;
    }    
        
    return {
        toString: function(){
            return `[module Printer]`;
        },
        type,
        setDebug,        
        debug: function(logType) {
            return getDebug(logType);    
        },
        log: (function(){
            return getLog(type.MESSAGE);
        })(),
        info: (function(){
            return getLog(type.INFO);
        })(),
        warn: (function(){
            return getLog(type.WARN);
        })(),        
        error: (function(){
            return getLog(type.ERROR);
        })(),        
        dir: (function(){
            return getLog(type.DIR);
        })()        
    }
    
})();