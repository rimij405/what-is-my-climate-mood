import {loader} from './modules/loader.js';
import {request} from './modules/request.js';
import {printer} from './modules/console.js';

/*
    main.js
    This module is the entry point for the program.
    It imports the above files in order to 
    run the program.
*/

"use strict";

printer.setDebug(true);

// Print modules that have loaded for this class.
printer.debug(printer.type.MESSAGE)(
    `Loading modules:
    ${loader}
    ${request}
    ${printer}`
);

window.onload = loader.load();

printer.log("Got the request module.");

let configuration = request.CreateConfiguration();
configuration.url = "config.json";
configuration.action = "GET";
configuration.mimeType = "application/json";
printer.log(`${configuration}`);

let req = request.CreateRequest(configuration);
req.setCallbacks({
    load: function() {
        req.response = req.object.responseText;
        printer.log(req.response);
    }
});

req.open();







