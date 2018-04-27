import {loader} from './modules/loader.js';
import {request} from './modules/request.js';

/*
    main.js
    This module is the entry point for the program.
    It imports the above files in order to 
    run the program.
*/

"use strict";

window.onload = loader.load();

console.log("Got the request module.");

let req = request.CreateHTTPRequest("", "google.com");