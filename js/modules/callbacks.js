/*
    callbacks.js
    A neat utility for handling events in classes.
    ----
    Citation: Building a standalone event system - [https://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript].
*/

"use strict";

// Allows creation of callback utilities.
export let callbacks = (function(){
    
    // Events that can be registered and called.
    const eventns = (function(){
        
        /* ctor: EventManager */
        
        // Creation of an event manager.
        function EventManager(){
            this.__events = undefined;
        }
        
        // Getters and setters.
        EventManager.prototype = {            
            // Reference to events property.
            get events() {
                if(!this.__events){
                    this.__events = new Map();
                }                
                return this.__events;
            },
            
            // Returns number of events.
            get count() {
                return this.events.size;
            }            
        }
        
        // Adds an event to the collection.
        EventManager.prototype.registerEvent = function(eventName){
            if(eventName && typeof eventName === 'string'){
                let name = eventName.trim().toLowerCase();
                if(name && name.length > 0){
                    let event = new Event(name);
                    this.events.set(event.name, event);
                }
            }
            return this;
        }
        
        // Retrieve an event from the collection.
        EventManager.prototype.getEvent = function(eventName){            
            if(eventName && typeof eventName === 'string'){
                let name = eventName.trim().toLowerCase();
                if(name && name.length > 0){
                    if(this.events.has(name)){                    
                        let event = this.events.get(name);
                        return event;
                    }
                }
            }            
            return undefined;
        }
                
        // Remove an event from the collection. Returns event that was removed.
        EventManager.prototype.unregisterEvent = function(eventName){            
            let event = this.getEvent(eventName);
            if(event) {
                this.events.delete(event.name);
                return event.name;
            }
            return undefined;
        }
        
        // Register a callback event with an event.
        EventManager.prototype.addEventListener = function(eventName, eventHandler){
            let event = this.getEvent(eventName);
            if(event){
                event.registerCallback(eventHandler);
                return this;
            }
            return undefined;
        }
        
        // Unregister a callback event from the event.
        EventManager.prototype.removeEventListener = function(eventName, eventHandler){
            let event = this.getEvent(eventName);
            if(event){
                event.unregisterCallback(eventHandler);
                return this;
            }
            return undefined;
        }
        
        // Dispatch events.
        EventManager.prototype.dispatchEvent = function(eventName, target, data){
            let event = this.getEvent(eventName);
            if(event){
                event.callbacks.forEach(function(callback){
                    callback({ target, data });
                });               
            }
            return undefined;
        }
           
        /* ctor: Event */
        
        // Creation of an event.
        function Event(name, callbacks){
            this.__name = undefined;
            this.__callbacks = [];
            
            // Set properties.
            if(name) { this.setName(name); }
            if(callbacks) { this.setCallbacks(callbacks); }
        }
        
        // Getters and setters for events.
        Event.prototype = {                        
            // Return property value.
            get name(){
                return this.__name;
            },
            
            // Assign value to property.
            set name(value){
                this.setName(value);
            },   
            
            get callbacks() {
                return this.__callbacks;
            }
        }
        
        // Get a callback index, if it exists in the array.
        Event.prototype.getIndex = function(callback){
            if(!callback) { return -1; }
            let currentIndex = 0;
            for(let el of this.callbacks){
                if(el === callback){                    
                    return currentIndex;
                }
                currentIndex++;
            }
            return -1;
        }
        
        // Register event callback.
        Event.prototype.registerCallback = function(callback){
            this.callbacks.push(callback);            
            return this;
        }
        
        // Unregister a callback.
        Event.prototype.unregisterCallback = function(callback){
            if(callback){
                let callbackIndex = this.getIndex(callback);
                if(callbackIndex && callbackIndex != -1) {
                    this.callbacks.splice(callbackIndex, 1);
                }
            }
            return this;
        }
        
        // Set the name of the event.
        Event.prototype.setName = function(value){            
            if(value && typeof value === 'string') { 
                let input = value.trim().toLowerCase();
                this.__name = (input.length > 0) ? input : undefined;
            }
            return this;
        }
        
        // Check if this matches.
        Event.prototype.hasName = function(eventName){
            if(eventName && typeof eventName === 'string'){
                let otherName = eventName.trim().toLowerCase();                  
                return (this.name === otherName) && (otherName.length > 0);                
            }
            return false;
        }
        
        /* Factory methods */
        
        // Construct an event object.
        function CreateEvent(eventName, eventHandlers = []){
            return new Event(eventName, eventHandlers);
        }
        
        // Construct an event manager object.
        function CreateEventManager(){
            return new EventManager();
        }
        
        return {
            Event: CreateEvent,
            EventManager: CreateEventManager
        }
        
    })();
    
    // Event dispatcher 'Hook'.
    let CreateEventDispatcher = function(){
        
        // Create hook.
        let hook = new eventns.EventManager();
    
        // Register all the events in the global events object.
        for(let eventKey in events){
            hook.registerEvent(events[eventKey]);
        }        
        
        return hook;
        
    };
        
    return {
        EventDispatcher: CreateEventDispatcher
    }
    
})();