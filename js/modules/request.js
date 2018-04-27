/*
    request.js
    Make URL requests to an address.
*/

// Create the request module.
export let request = (function() {
    
    // Factory function for a request.
    function HTTPRequest(options){
        let o = (options != null) ? options : {
            // optional name to include with the request.
            title: undefined,            
            
            action: "",
            url: undefined,
            
            // event listener method callbacks:
            progress: function(e){
                if(e.lengthComputable){
                    this.percentage = e.loaded / e.total * 100;
                } else {
                    this.percentage = 0;
                }
            },
            load: function(e){
                console.log("Request completed.");
            },
            error: function(e){
                console.log("An error occurred while processing the request.")
            },
            abort: function(e){
                console.log("Request has been cancelled by the user.");
            }
        };   
        
        this.percentage = 0;
        this.request = new XMLHttpRequest();
        
        // add the event listeners.
        this.request.addEventListener("progress", o.progress);
        this.request.addEventListener("load", o.load);
        this.request.addEventListener("error", o.error);
        this.request.addEventListener("abort", o.abort);
        
        // Open the request and then send it.
        this.request.open(o.action, o.url);
        this.request.send();
    }
    
    // Create a HTTPRequest from scratch.
    function CreateHTTPRequest(action, url, options){
        options = (options != null) ? options : {};
        options.action = (action != null) ? action : "";
        options.url = (url != null) ? url : "";
        return new HTTPRequest(options);        
    }
    
    return {
        CreateHTTPRequest,
        HTTPRequest
    }
    
    
})();