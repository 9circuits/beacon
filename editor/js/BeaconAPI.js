/**
* Beacon - API
* 
* Copyright (c) Beacon Dev Team
* Licensed under GPLv3
* 
* Plugins belong to their respective
* authors as mentioned.
*
*/

/*
* Generic Beacon Editor Class
* 
* Sets up the usual editor elements handling
* the manual work by itself like creating the 
* toolbar, iframe, sidebar.
*
* TODO: Complete the thing!!! O_O
* TODO: Find a more funky dynamic layout algorithm.
*/
function BeaconEditor(opts) {
    
    // Take in the options
    $.extend(this, opts);
    
    // Create an iframe
    this.iframe = new BeaconIframe({
        container: this.container,
        src: this.src,
        height: "88%",
        width: "75%",
        align: "right"
    });
    
    // Create the toolbar. Hand the iframe.
    this.toolbar = new BeaconToolBar({
        container: this.container,
        height: "12%",
        width: "75%",
        align: "right",
        iframe: this.iframe
    });
    
    // Create the sidebar
    this.sidebar = new BeaconSideBar({
        container: this.container,
        height: "100%",
        width: "24%",
        align: "left"
    });
    
};

/*
* Beacon Sidebar Class
* 
* Creates a sidebar with an accordion.
*
* TODO: Make the accordion!
*/
function BeaconSideBar(opts) {
    
    // Grab the options
    $.extend(this,opts);
    
    // Create a random ID for the sidebar
    this.id = Math.floor(Math.random()*100001);
    
    // Attach the sidebar
    $(this.container).prepend("<div id=\""+this.id+"\" class=\"BeaconSideBar\">This is a sidebar.</div>");
    
    // Set up the styles
    this.sidebar = $("#"+this.id);
    this.sidebar.css("height", this.height || "50%");
    this.sidebar.css("width", this.width || "50%");
    this.sidebar.css("float", this.align || "left");
};


/*
* Beacon Toolbar Class
* 
* Creates a Toolbar with generic editor functions
* and ability to add custom buttons.
*
* TODO: Complete it!
*/
function BeaconToolBar(opts) {
    
    // Get the options
    $.extend(this,opts);
    
    // Generate a random id
    this.id = Math.floor(Math.random()*100001);
    
    // Attach
    $(this.container).prepend("<div id=\""+this.id+"\" class=\"BeaconToolBar\"></div>");
    
    // Set up styles
    this.toolbar = $("#"+this.id);
    this.toolbar.css("height", this.height || "50%");
    this.toolbar.css("width", this.width || "50%");
    this.toolbar.css("float", this.align || "left");
    
    this.rows = [];
    
    this.flaggers = {};
    
};

BeaconToolBar.prototype.setFlagger = function(name, func) {
    this.flaggers[name] = func;
};

// Add a new row to hold the buttons
BeaconToolBar.prototype.addRow = function() {
    var id = this.id+'row'+(this.rows.length);
    
    this.toolbar.append('<div id="'+id+'" class="BeaconToolHolder"></div>');
    
    this.rows.push(id);
};

// Add a separator to the toolbar
BeaconToolBar.prototype.addSeparator = function(num) {
    $("#"+this.rows[num]).append('<div class="BeaconSeparator"></div>');
};

// Attach a frame to the toolbar
BeaconToolBar.prototype.setFrame = function() {
    // TODO: Link the tool actions to a frame
};

// Attach a button to the toolbar
BeaconToolBar.prototype.addButton = function(opts) {

    // Create the button
    var button = document.createElement("a");
    button.title = opts.tooltip;
    button.className = "BeaconToolButton";
    
    // Create the icon
    var icon = document.createElement("img");
    icon.src = opts.icon;
    button.appendChild(icon);
    
    // Attach the button to the toolbar
    $("#"+this.rows[opts.row]).append(button);

    // Create the object to be passed to the editor
    var obj = {
        markup: opts.markup,
        toolbar: this
    };
    
    if (opts.hasOwnProperty('type')) {
        // If it's a type supported by the toolbar
        // Attach the event
        $(button).bind("click", this[opts.type].attach(obj));
    } else if (opts.hasOwnProperty('handler')) {
        // The button knows what handler to call when it is clicked
        $(button).bind("click", opts.handler.attach(obj));
    }
};

// Generic styler. Adds the given nodetype at the selection
BeaconToolBar.prototype.styler = function() {
    
    if (this.toolbar.flaggers.hasOwnProperty("styler"))
        if(!this.toolbar.flaggers["styler"]())
            return;
            
    // Store the iframe
    var iframe = document.getElementById(this.toolbar.iframe.id).contentWindow;
    
    // Get the selection
    var theSelection = iframe.getSelection();
    
    // If no selection then return
    if (theSelection.toString() === '')
        return;
    
    // Generate the markup
    var span = '<'+this.markup.nodeName;
    if (this.markup.title)
        span += ' title="'+this.markup.title+'"';
    if (this.markup.className)
        span += ' class="'+this.markup.className+'"';
    if (this.markup.dir)
        span += ' dir="'+this.markup.dir+'"';
    span += '>';
    span += theSelection;
    span += '</'+this.markup.nodeName+'>';
    
    // Plug it in
    iframe.document.execCommand('inserthtml', false, span);
    
    // Focus the frame again
    iframe.focus();
};



/*
* Beacon Iframe Class
* 
* Creates an Iframe wih some helper functions.
*
* TODO: Complete it!
*/
function BeaconIframe(opts) {
    
    // Grab the options
    $.extend(this, opts);
    
    // Generate a random ID
    this.id = Math.floor(Math.random()*100001);
    
    // Attach the iframe
    $(this.container).append("<iframe src=\""+this.src+"\" id=\""+this.id+"\" class=\"BeaconIframe\"></iframe>");
    
    // Apply styles
    this.frame = $("#"+this.id);
    this.frame.src = this.src;
    this.frame.css("height", this.height || "50%");
    this.frame.css("width", this.width || "50%");
    this.frame.css("float", this.align || "left");
    
    // Attach the onload event to set the designMode
    this.frame.bind("load", function() {
        this.contentWindow.document.designMode = "On";
    });

};

// Get the contents of the iframe
BeaconIframe.prototype.getContents = function() {
    return this.frame.contents().find("body").html();
};

// Set the contents of the iframe
BeaconIframe.prototype.setContent = function(markup) {
    this.frame.contents().find("body").html(markup);
};

