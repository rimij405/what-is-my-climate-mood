/*
    dom.js
    Functions that allow modification of the website's DOM.
*/

"use strict";

// Create the dom module.
export let dom = (function() {
    
    /* Private helper methods. */
    
    // Get the printer module.
    let printer = global.get("printer");
        
    // Collection of methods that must be bound upon a particular HTMLElement.
    const services = {
        
        // ToString for printing the services object.
        toString: function(){
            return `[namespace Services]`;
        },
        
        // Set the ID for the element this is called on.
        setID: function(value){
            this.id = value ? value : undefined;
            return this;
        },
        
        // Check if it has an attribute.
        hasAttribute: function(attributeName){
            if(attributeName) { 
                return this.hasAttribute(name);
            }  
            return false;
        },
        
        // Set an attribute to the element.
        setAttribute: function(attributeNode){
            if(attributeNode) { this.setAttributeNode(attributeNode); }
            return this;
        },
        
        // Get value of an attribute.
        getAttribute: function(attributeName){
            if(attributeName) {
                return this.getAttribute(attributeName);
            }
            return undefined;
        },
        
        // Remove an attribute value.
        removeAttribute: function(attributeName){
            if(attributeName){
                return this.removeAttribute(attributeName);
            }
            return undefined;
        },
        
        // Citation: Add/Remove classes with raw JS. [https://jaketrent.com/post/addremove-classes-raw-javascript/]
        
        // Check if this has a class.
        hasClass: function(className){
            if(this.classList) {
                return this.classList.contains(className);
            }
            return false;
        },
        
        // Add class if possible.
        addClass: function(className){
            if(this.classList){
                this.classList.add(className);
            }
            return this;
        },
        
        // Remove class if possible.
        removeClass: function(className){
            if(this.classList){
                this.classList.remove(className);
                return className;
            }
            return undefined;
        },
        
        // Add child element.
        addChild: function(childNode){
            this.appendChild(childNode);
            return childNode;
        },
    
        // Remove child.
        removeChild: function(childNode){
            return this.removeChild(childNode);
        },
        
        // Insert before.
        insertBefore: function(childNode, indexNode){
            this.insertBefore(childNode, indexNode);
            return childNode;
        }
        
    };
    
    /* HTMLElement methods. */
    const elementns = (function(){
                
        /* Prototype methods. */
                
        // ctor: Create an HTMLElement for the dom.
        function HTMLElement(selector){
            this.selector = selector;
            this.element = document.createElement(selector);        
        }
        
        // ToString method for the HTMLElement itself.
        HTMLElement.prototype.toString = function() {
            return `[${this.selector} HTMLElement]`;
        };

        // Reference to the DOM element.
        HTMLElement.prototype.getElement = function(){
            return this.element;
        };

        // Set custom properties on the element.
        HTMLElement.prototype.setElementProperty = function(key, value){
            this.element[key] = value ? value : undefined;
            return this;
        };

        // Set several properties on the element.
        HTMLElement.prototype.setElementProperties = function(properties = []){
            for(let {key, value} of properties){ // use of destructuring syntax.
                this.setElementProperty(key, value);   
            }        
            return this;
        };

        // Clear a custom property on the element.
        HTMLElement.prototype.clearElementProperty = function(key){
            this.setElementProperty(key, undefined);
        };

        // Clear several properties on the element.
        HTMLElement.prototype.clearElementProperties = function(keys = []){
            for(let key of keys){ // use of destructuring syntax.
                this.clearElementProperty(key); 
            }        
            return this;
        };  

        // Set the ID for the element.
        HTMLElement.prototype.setID = function(id){
            services.setID.call(this.element, id);
            return this;
        };

        // Add class to the element.
        HTMLElement.prototype.addClass = function(className) {
            return services.addChild.call(this.element, className);        
        };

        // Add several classes to the element.
        HTMLElement.prototype.addClasses = function(classList){
            for(let className of classList){
                this.addClass(className);
            }
            return this;
        };

        // Remove class to the element.
        HTMLElement.prototype.removeClass = function(className){
            return services.removeClass.call(this.element, className);
        };

        // Remove several classes from the element.
        HTMLElement.prototype.removeClasses = function(classList){
            for(let className of classList){
                this.removeClass(className);
            }
            return this;
        };

        // Check if the element has a class.
        HTMLElement.prototype.hasClass = function(className){
            return services.hasClass.call(this.element, className);
        };

        // Add child element.
        HTMLElement.prototype.addChild = function(childNode){
            return services.addChild.call(this.element, childNode);
        };

        // Add several children.
        HTMLElement.prototype.addChildren = function(childNodes){
            for(let childNode of childNodes){
                this.addChild(childNode);
            }
            return this;
        };

        // Remove child element.
        HTMLElement.prototype.removeChild = function(childNode){
            return services.removeChild.call(this.element, childNode);
        };

        // Remove several children.
        HTMLElement.prototype.removeChildren = function(childNodes){
            for(let childNode of childNodes){
                this.removeChild(childNode);
            }
            return this;
        };

        // Insert an element before an input index node.
        HTMLElement.prototype.insertBefore = function(childNode, indexNode){
            return services.insertBefore.call(this.element, childNode, indexNode);
        };
        
        // Add a text node to the element.
        HTMLElement.prototype.addTextNode = function(content){
            let textNode = document.createTextNode(content);
            this.addChild(textNode);
            return textNode;
        }
        
        // Check if attribute exists.
        HTMLElement.prototype.hasAttribute = function(attributeName){
            return services.hasAttribute.call(this.element, attributeName);
        }
        
        // Add an attribute to the element.
        HTMLElement.prototype.addAttribute = function(attributeName, value){
            if(this.hasAttribute){
                return this.setAttribute(attributeName, value); 
            }
            let attr = document.createAttribute(attributeName, value);
            attr.value = value ? value : "";
            services.setAttribute.call(this.element, attr);
            return attr;
        }
        
        // Set a series of attributes.
        HTMLElement.prototype.addAttributes = function(attributes){
            for(let {attributeName, value} of attributes){
                this.addAttribute(attributeName, value);
            }
            return this;
        }
        
        // Remove an attribute.
        HTMLElement.prototype.removeAttribute = function(attributeName){
            return services.removeAttribute.call(this.element, attributeName);   
        }
        
        // Overwrite an attribute.
        HTMLElement.prototype.setAttribute = function(attributeName, value){
            let attr = services.getAttribute.call(this.element, attributeName);
            attr.value = value ? value : "";
            services.setAttribute.call(this.element, attr);
            return attr;
        }
        
        
        /* Factory methods. */
        
        // Create an HTMLElement option.
        function HTMLElementOptions({id, classList, children} = {}){
            let pairs = [];                        
            if(id) { pairs.push(options.Pair("id", id)); }
            if(classList) { pairs.push(options.Pair("classList", classList)); }
            if(children) { pairs.push(options.Pair("children", children)); }   
            return new options.Options(pairs);
        }
        
        // Create an HTML element using a selector and a set of options.
        function CreateHTMLElement(selector, options){
            let el = new HTMLElement(selector);
            
            let params = options ? options : {};
            if(params.id) { el.setID(params.id); }
            if(params.classList) { el.addClasses(params.classList); }
            if(params.children) { el.addChildren(params.children); }
            if(params.properties) { el.setElementProperties(params.properties); }
            if(params.src) { el.getElement().src = params.src; }
            if(params.href) { el.getElement().href = params.href; }
            if(params.title) { el.getElement().title = params.title; }
            if(params.content) { el.addTextNode(params.content); }
            if(params.attributes) { el.addAttributes(params.attributes); }
            
            return el;
        }
        
        // Create a paragraph.
        function CreateParagraph(options){            
            return CreateHTMLElement("p", options);
        }
        
        // Create a div.
        function CreateDIV(options){
            return CreateHTMLElement("div", options);
        }
        
        // Create a button.
        function CreateButton(options){
            return CreateHTMLElement("button", options);
        }
        
        // Create a section.
        function CreateSection(options){
            return CreateHTMLElement("section", options);
        }
        
        // Create a link.
        function CreateHyperlink(options, url, title){
            return CreateHTMLElement("a", options);
        }
        
        // Create image.
        function CreateImage(options, src, title){
            let el = CreateHTMLElement("img", options);
            return el;
        }
        
        return {
            // ToString for printing the services object.
            toString: function(){
                return `[namespace HTMLElement]`;
            },        
            HTMLElementOptions: HTMLElementOptions,
            HTMLElement: CreateHTMLElement,
            Paragraph: CreateParagraph,
            Div: CreateDIV,
            Button: CreateButton,
            Section: CreateSection,
            Hyperlink: CreateHyperlink,
            Image: CreateImage
        }       
        
    })();
        
    // Get important nodes.
    let getContent = function(){ return document.getElementById('content'); }
    
    // String to print on parse of this module.
    let toString = function(){
        return `[module DOM]`;
    };
    
    // Methods to return.
    return {
        toString,
        HTMLElement: elementns,
        HTMLContent: getContent()
    }
    
})();