/*
    request.js
    Make URL requests to an address.
*/

// Create the request module.
export let request = (function() {
        
    // A request configuration object is used to prepare a request object.
    function RequestConfiguration(mimeType, action, uri, callbacks){
        this.setMimeType(mimeType);
        this.setAction(action);
        this.setURL(uri);
        this.setCallbacks(callbacks);
    }
    
    // Set the MIME type of the requested file, for overriding the server response.
    RequestConfiguration.prototype.setMimeType = function(value) {
        this.mimeType = value ? value : undefined; // if undefined, will not override the response's MIME type.
    }
    
    // Set the request's callback method.
    RequestConfiguration.prototype.setCallbacks = function(callbacks){
        this.callbacks = this.callbacks ? {
            progress: callbacks.progress ? callbacks.progress : undefined,
            load: callbacks.load ? callbacks.load : undefined,
            error: callbacks.error ? callbacks.error : undefined,
            abort: callbacks.abort ? callbacks.abort : undefined,                        
        } : undefined;
    }
    
    // Set the type of request action.
    RequestConfiguration.prototype.setAction = function(value){
        this.action = value ? value : "GET";
    }
        
    // Set the URL of the location to send request.
    RequestConfiguration.prototype.setURL = function(value){
        this.url = value ? value : undefined;
    }
    
    // Print the request configuration.
    RequestConfiguration.prototype.toString = function(){
        return `[Request Configuration]${this.action ? ` ${this.action}` : ``}${this.url ? ` ${this.url}` : ``}${this.mimeType ? ` ${this.mimeType}` : ``}${(this.action || this.mimeType || this.url) ? '.' : ''}`;
    }
    
    // Create a request configuration object.
    function CreateRequestConfiguration(mimeType, action, uri, callback){
        return new RequestConfiguration(mimeType, action, uri, callback);
    }
            
    // Wrapper for a XMLHttpRequest object.
    function Request(config){
        this.options = config ? config : CreateRequestConfiguration(
            "application/json",
            "GET",
            "config.json"
        );
        this.object = undefined;
        this.response = undefined;
        if(config != null && config.callbacks != null) { this.setCallbacks(config.callbacks); }
    }
    
    // Print the request.
    Request.prototype.toString = function(){
        return `[Request]${this.object ? ` ${this.object}` : ''}${this.response ? ` ${this.response.length} characters.` : ''} - ${this.options}`;
    }
    
    // Get back a request object.
    Request.prototype.getRequest = function() {
        if(this.object == null){
            this.object = new XMLHttpRequest();
        }
        return this.object;
    }
    
    // Clear the request object resources.
    Request.prototype.clear = function(){
        this.object = undefined;
    }
    
    // Assign callback functions.
    Request.prototype.setCallbacks = function(callbacks){
        let req = this.getRequest();
        
        // Assign callback.
        if(callbacks != null){         
            if(callbacks.progress != null) { req.addEventListener("progress", callbacks.progress); }
            if(callbacks.load != null) { req.addEventListener("load", callbacks.load); }
            if(callbacks.error != null) { req.addEventListener("error", callbacks.error); }
            if(callbacks.abort != null) { req.addEventListener("abort", callbacks.abort); }
        }        
    }
    
    // Open the request object.
    Request.prototype.open = function(body){
        let req = this.getRequest();
        
        // Open the request.
        req.open(this.options.action, this.options.url);
        
        // Override MIME type.
        if(this.options.mimeType != null){
            req.overrideMimeType(this.options.mimeType);
        }
                
        // Send the request.
        if(this.options.action != null && this.options.action.toUpperCase() === "GET"){
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
        toString: function(){
            return `[module Request]`;
        },
        CreateConfiguration: CreateRequestConfiguration,
        CreateRequest: CreateRequest
    }
    
})();