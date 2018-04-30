import {loader} from './modules/loader.js';

/*
    main.js
    This module is the entry point for the program.
    It imports the above files in order to 
    run the program.
*/

"use strict";

// Called once the window has been loaded into memory.
window.onload = function(){
        
    // Set the global value for debug mode.
    global.set("debug", true);
    
    // Initialize the loader.
    loader.init();
    
    // Load the application resources.
    loader.load();
    
    // Get the modules that the loader loaded in.
    let request = global.get("request");
    let printer = global.get("printer");
    let dom = global.get("dom");
    
    
};
    
