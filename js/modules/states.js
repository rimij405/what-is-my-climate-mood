/*
    state-manager.js
    Represents application state.
*/

"use strict";

// Represents a state manager.
export let states = (function(){
       
    // State manager.
    const StateManager = (function(){        
    
        // Track current state.
        function StateManager() {
            this.__history = [];
            this.__currentState = states.INIT;        
        }

        StateManager.prototype = {

            // Get the current state.
            get currentState() {
                return this.__currentState;
            },

            // Get the history.
            get history(){
                return this.__history;
            },

            // Return the previous state.
            get previousState() {
                let past = this.history.slice(this.history.length - 1, 1);
                return past[0];
            }
        }
        
        // toString method.
        StateManager.prototype.toString = function(){
            return `[object StateManager]`;
        }

        // Change the state.
        StateManager.prototype.changeState = function(state){
            this.history.push(this.currentState);
            this.__currentState = state;
            return this;
        }

        // Revert to the previous state.
        StateManager.prototype.revertState = function(state){
            if(this.history.length >= 2){
                this.currentState = this.previousState;
                this.history.pop();
            }
            return this;
        }

        // Check if currently is in state.    
        StateManager.prototype.isInState = function(state) {
            return (this.currentState === state);
        }

        // Factory function.
        function CreateStateManager(){
            return new StateManager();
        }
        
        return CreateStateManager;
    
    })();
    
    // States.
    const States = (function(){

        let stateMap = new Map();
        
        // Enumerated states.
        const ApplicationStates = {
            toString: function() {
                return `[enum States]`;              
            },
            parse: function(state){
                return stateMap.get(state);
            },
            INIT: 0,
            LOADING: 1,
            COMPLETE: 2,
            PENDING: 3,
            LOADING_WEATHER: 4,
            LOADING_CONFIG: 5
        }
        
        stateMap.set(ApplicationStates.INIT, 'Init State');
        stateMap.set(ApplicationStates.LOADING, 'Loading State');
        stateMap.set(ApplicationStates.COMPLETE, 'Loading Complete State');
        stateMap.set(ApplicationStates.PENDING, 'Pending User Input State');
        
        return ApplicationStates;

    })();
    
    let toString = function() {
        return `[module States]`;
    };
    
    return {
        toString,
        StateManager,
        States
    };
    
})();