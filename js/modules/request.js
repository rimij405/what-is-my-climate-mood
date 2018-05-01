/*
    request.js
    Make URL requests to an address.
*/

"use strict";

// Create the request module.
export let request = (function() {
        
    /* RequestConfiguration namespace. */
    const configns = (function(){    
            
        // A request configuration object is used to prepare a request object.
        function RequestConfiguration(params){            
            // Create a callbacks object and a settings object.
            this.__callbacks = options.Options();            
            this.__settings = options.Options();
                                    
            // Parse the parameters if any were passed in.
            if(params){
                this.setCallbacks(params.callbacks)
                    .setMimeType(params.mimeType)
                    .setAction(params.action)
                    .setCacheResults(params.cacheResults)
                    .setURL(params.url)
                    .setType(params.type);
            }   
        }
        
        // Set up the RequestConfiguration properties.
        RequestConfiguration.prototype = {
            
            // Return reference to callbacks collection.
            get callbacks(){
                return this.__callbacks;
            },
            
            // Return reference to settings collection.
            get settings() {
                return this.__settings;
            },
            
            // Retrieve property value.
            get mimeType(){
                return this.settings.get("mimeType");
            },
            
            // Assign value for property.
            set mimeType(mimeType){
                this.setMimeType(mimeType);
            },
            
            // Retrieve property value.
            get cacheResults(){
                return this.settings.get("cacheResults");
            },
            
            // Assign value for property.
            set cacheResults(flag){
                this.setCacheResults(flag);
            },
            
            // Retrieve property value.
            get action(){
                return this.settings.get("action");
            },
            
            // Assign value for property.
            set action(action){
                this.setAction(action);
            },
            
            // Retrieve property value.
            get url() {
                return this.settings.get("url");
            },
            
            // Assign value for property.
            set url(url){
                this.setURL(url);
            },
            
            // Get the response type.
            get type(){
                return this.settings.get("type");
            },
            
            // Set response type.
            set type(type){
                this.setType(type);
            },
            
            // Return callback method if it exists.
            get load() {
                return this.callbacks.get("load");
            },
            
            // Assign callback for load event.
            set onload(callback) {
                this.setCallbacks({load: callback});
            },
            
            // Return callback method if it exists.
            get error() {
                return this.callbacks.get("error");
            },
            
            // Assign callback for error event.
            set onerror(callback) {
                this.setCallbacks({error: callback});
            },
            
            // Return callback method if it exists.
            get progress() {
                return this.callbacks.get("progress");
            },
            
            // Assign callback for progress event.
            set onprogress(callback) {
                this.setCallbacks({progress: callback});
            },
            
            // Return callback method if it exists.
            get abort() {
                return this.callbacks.get("abort");
            },
            
            // Assign callback for abort event.
            set onabort(callback) {
                this.setCallbacks({abort: callback})
            }
            
        };
        
        // Set the MIME type of the requested file, for overriding the server response.
        RequestConfiguration.prototype.setMimeType = function(value) {
            if(value){ this.settings.set("mimeType", value); }
            return this;                        
        }

        // Set the request's callback method.
        RequestConfiguration.prototype.setCallbacks = function(callbacks){
            if(callbacks) {
                this.callbacks.set("progress", callbacks.progress);
                this.callbacks.set("load", callbacks.load);
                this.callbacks.set("error", callbacks.error);
                this.callbacks.set("abort", callbacks.abort);
            }
            return this;
        }

        // Set the type of request action.
        RequestConfiguration.prototype.setAction = function(value){
            if(value){ this.settings.set("action", value ? value : "GET"); }
            return this;  
        }

        // Set the URL of the location to send request.
        RequestConfiguration.prototype.setURL = function(value){
            if(value){ this.settings.set("url", value ? value : "/"); }
            return this;  
        }

        // Set the response type.
        RequestConfiguration.prototype.setType = function(value){
            if(value) { this.settings.set("type", value ? value : "text"); }
            return this;
        }
        
        // Append value to url to bust the cache.
        RequestConfiguration.prototype.setCacheResults = function(flag){
            if(flag){ this.settings.set("cacheResults", flag ? flag : false); }
            return this;  
        }

        // Print the request configuration.
        RequestConfiguration.prototype.toString = function(){
            return `[Request Configuration]${this.action ? ` ${this.action}` : ``}${this.url ? ` ${this.url}` : ``}${this.mimeType ? ` ${this.mimeType}` : ``}${(this.action || this.mimeType || this.url) ? '.' : ''}`;
        }

        // Create a request configuration object.
        function CreateRequestConfiguration(options){
            let params = options ? options : {};
            return new RequestConfiguration(params);
        }

        return {
            toString: function(){
                return `[namespace RequestConfiguration]`;
            },
            RequestConfiguration: CreateRequestConfiguration
        }        
        
    })();
        
    /* Request namespace. */
    const requestns = (function(){
        
        // Wrapper for a XMLHttpRequest object.
        function Request(config){
            
            // Create data members.
            this.__settings = undefined;
            this.__response = undefined;
            this.__XMLHttpRequestObject = undefined;
            
            // Set the configuration.
            let params = config ? config : configns.RequestConfiguration({
                                                        mimeType: "application/json",
                                                        action: "GET",
                                                        url: "/"
                                                    });
            this.setConfiguration(params);   
            
        }
        
        // Create getters and setters.
        Request.prototype = {
            
            // Retrieve this request's settings.
            get settings(){
                return this.__settings;
            },
            
            // Assign the configuration to the request object.
            set settings(config){
                this.setConfiguration(config);
            },
            
            // Retrieve the property.
            get response(){
                return this.__response;
            },
            
            // Assign value to the property.
            set response(value){
                this.setResponse(value);
            },
            
            // Accessor to the XMLHttpRequest object.
            get XMLHttpRequestObject(){
                return this.getXMLHttpRequest();
            }
            
        };

        // Print the request.
        Request.prototype.toString = function(){
            return `[Request]${this.object ? ` ${this.object}` : ''}${this.response ? ` ${this.response.length} characters.` : ''} - ${this.options}`;
        }

        // Clear the request object resources.
        Request.prototype.clear = function(){
            this.__XMLHttpRequestObject = undefined;
        }
        
        // Get back a request object.
        Request.prototype.getXMLHttpRequest = function() {
            if(this.__XMLHttpRequestObject == null){
                this.__XMLHttpRequestObject = new XMLHttpRequest();
            }            
            return this.__XMLHttpRequestObject;
        }

        // Assign callback functions.
        Request.prototype.setCallbacks = function(callbacks){
            this.__settings.setCallbacks(callbacks);      
        }

        // Assign value to the response.
        Request.prototype.setResponse = function(body){
            this.__response = body ? body : undefined;
            return this;
        }
        
        // Assign a configuration object to the request.
        Request.prototype.setConfiguration = function(config){
            if(config){
                this.__settings = config;
            }
            return this;
        }
        
        // Open the request object.
        Request.prototype.open = function(body){
            let req = this.getXMLHttpRequest();

            // Add event listeners.
            if(this.settings.callbacks){
                if(this.settings.load) { req.addEventListener("load", this.settings.load); }
                if(this.settings.error) { req.addEventListener("error", this.settings.error); }
                if(this.settings.abort) { req.addEventListener("abort", this.settings.abort); }
                if(this.settings.progress) { req.addEventListener("progress", this.settings.progress); }
            }
            
            // Open the request.
            let address = `${this.settings.url}${this.settings.cacheResults ? `?${new Date().getTime()}` : ''}`;
            req.open(this.settings.action, address); 

            // Override MIME type.
            if(this.settings.mimeType != null){
                req.overrideMimeType(this.settings.mimeType);
            }
            
            // Set the response type.
            if(this.settings.type != null){
                req.responseType = this.settings.type;
            }

            // Send the request.
            if(this.settings.action != null && this.settings.action.toUpperCase() === "GET"){
                req.send(null);
            } else {
                req.send(body);
            }
        }

        // Create a request configuration object.
        function CreateRequest(config){
            return new Request(config);
        }
        
        return {
            toString: function() {
                return `[namespace Request]`;
            },
            Request: CreateRequest
        }
        
    })();
        
    return {
        toString: function(){
            return `[module Request]`;
        },
        RequestConfiguration: configns.RequestConfiguration,
        Request: requestns.Request
    }
    
})();