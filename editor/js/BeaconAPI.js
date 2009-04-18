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
    
    // Attach the toolbar to the top of the container
    $(this.container).prepend("<div id=\""+this.id+"\" class=\"BeaconToolBar\"></div>");
    
    // Set up styles
    this.toolbar = $("#"+this.id);
    //this.toolbar.css("height", this.height || "50%");
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
    
    this.iframe = document.getElementById(this.id);
    
    // To check if something's being edited
    this.editing = false;

    // Area being edited - Hidden
    this.edited = null;

    // Area being edited - Active
    this.editedActive = null;
    
    // Type of edit area
    this.editedActiveType = "";

    // EditBox
    this.editbox = null;

    // Wether saving in action
    this.saving = false;

    // Save time out function ID
    this.savetout = 0;
    
    this.rootNode = "";
    
    this.inlineEditorLocations = [];
    
    this.inlineTypes = {};
    
    

    // Attach the onload event to set the designMode
    this.frame.bind("load", function() {       
        $(this.iframe.contentWindow.document).click(this.frameclick.attachEvent(this));
    }.attach(this));

};

BeaconIframe.prototype.setInlineEditors = function(array) {
    this.inlineEditorLocations = array;
};

BeaconIframe.prototype.setInlineTypes = function(obj) {
    this.inlineTypes = obj;
};

BeaconIframe.prototype.frameclick = function(e) {
    var t = this;
                   
    // Get the node which was clicked
    if (!e) var obj = window.event.srcElement;
	else var obj = e.target;
    
   var editarea = checkNodePath(obj, this.inlineEditorLocations);
    
    if (!editarea)
        return;
        
    //alert(editarea.innerHTML);
    //alert(this.inlineTypes[editarea.title]);
    //return;
    
    // If no such node was found then exit
    if (!editarea) return;
    
    // If a section is already being edited then just return
    if (t.editing) return;
    
    t.editing = true;
    
    t.edited = editarea;
    
    var ID = editarea.id;
    
    // TODO: Check for lock on server
    // if (!t.hasLock(ID)) return;
    
    // TODO: Get a lock from server
    // if (!t.getLock(ID)) return;
    
    // TODO: Set a lock listener
    // t.lockListener.ID = ID;
    // t.setAJAXRequest(t.lockListener);
    
    // Make the area editable
    t.editbox = t.createForm(editarea, this.inlineTypes[editarea.title]);
};

BeaconIframe.prototype.createForm = function(editarea, type) {
    var t = this;
    
    var d = t.iframe.contentWindow.document;
    var editParent = editarea.parentNode;
    
    var editDiv = d.createElement('div');
    editDiv.id = "editBox";
    editDiv.style.border = "2px solid #00FF00";
    
    var form = d.createElement('div');
    form.style.display= "block";
    
    var saveCommit = d.createElement('a');
    saveCommit.innerHTML = "Save And Commit Changes";
    saveCommit.title = "Commit the changes to the master copy and close the editor box.";
    
    var saveContinue = d.createElement('a');
    saveContinue.innerHTML = "Save And Continue Editing | <span id=\"saveStatus\">Last saved at: Never</span>";
    saveContinue.title = "Save the changes to the temporary copy and continue editing.";
    
    var cancel = d.createElement('a');
    cancel.innerHTML = "Cancel";
    cancel.title = "Close the editor box and continue editing";
    
    var links = new Array(saveCommit, saveContinue, cancel);
    
    // Somehow the CSS styles were not being applied in FireFox, so doing it manually here
    for (var i=0; i < links.length; i++) {
        links[i].style.cursor = "pointer";
        links[i].style.border = "1px solid #999";
        links[i].style.margin = "3px";
        links[i].style.padding = "3px";
        links[i].style.display = "block";
        links[i].style.background = "#C3D9FF";
        links[i].className = "formButton";
        links[i].style.color = "#000000";
        form.appendChild(links[i]);
    }
    
    // TODO: Add Click Handlers
    $(saveCommit).click(t.editCommit.attach(this));
    $(saveContinue).click(t.editSave.attach(this));
    $(cancel).click(t.editCancel.attach(this));
    
    this.editedActiveType = type;
    
    editDiv.appendChild(form);
    
    // Hide the node
    $(editarea).attr("displaytype", editarea.style.display);
    editarea.style.display = 'none';
    
    editParent.insertBefore(editDiv, editarea.nextSibling);
    
    if (type === 'textbox') {
        var editTitle = d.createElement('input');
        editTitle.type = "text";
        editTitle.value = $.trim(editarea.innerHTML);
        $(editTitle).addClass($(editarea).attr('class'));
        $(editDiv).prepend(editTitle);
        t.editedActive = editTitle;
        //t.setFocus(editTitle, false, 0);
    } else if (type === 'richtext') {
        var editText = editarea.cloneNode(true);
        editText.contentEditable = true;
        editText.style.border = "2px ridge #FFF";
        editText.style.padding = "5px";
        editText.style.outline = "none";
        editText.style.display = "block";
        $(editDiv).prepend(editText);
        t.editedActive = editText;
    } else if (type === 'textarea') {
        var editText = d.createElement('textarea');
        editText.value = $.trim(editarea.innerHTML);
        editText.style.height = "100px";
        editText.style.width = "100%";
        $(editDiv).prepend(editText);
        t.editedActive = editText;
    }
    
    
    
    /*if (editarea.title == 'guideChapterTitle')
        t.editedActive.focus();
    else if (editarea.title == 'guideSection')        
        t.setFocus(t.editedActive, false, 1);*/
    
    return editDiv;
};

BeaconIframe.prototype.editCommit = function() {
    var t = this;
    //t.hello();
	
    // TODO: Remove AJAX Request
    // TODO: Release Lock
    // TODO: Save the Document to the permanent file
    
    // If already saving then just return the function
    if (t.saving) return;

    // If no active edit area then just return
    if (!t.editedActive) return;

    // Set the saving flag to true
    t.saving = true;

    // Set a timeout function - Throw a panic after 1 minute
    //t.savetout = t.w.setInterval(t.saveTimeout, 60000);
    
    
    if (t.editedActiveType === "textbox" || t.editedActiveType === "textarea") {            
        t.edited.innerHTML = $.trim(t.editedActive.value);
    } else if (t.editedActiveType === "richtext") {
        t.edited.innerHTML = $.trim(t.editedActive.innerHTML);
    }
    
    // Remove the editable window
    var editParent;
    try {
        editParent = t.edited.parentNode;
    } catch (err) {
        return;
    }
    try {
        editParent.removeChild(t.editbox);
    } catch (err) {
        return;
    }
    t.editbox = null;
    t.edited.style.display = $(t.edited).attr("displaytype");
    $(t.edited).removeAttr("displaytype");
    t.edited = null;
    t.editedActive = null;
    t.editing = false;
    t.saving = false;
    
};

BeaconIframe.prototype.editSave = function() {
    alert("am savin sam savin!");
};

BeaconIframe.prototype.editCancel = function () {
    var t = this;
    //t.hello();
    
    // TODO: Remove AJAX Request
    // TODO: Release Lock
    // TODO: Trash the temp file at server
    
    // If already saving then just return the function
    if (t.saving) return;
    
    // Remove the editable window
    var editParent;
    try {
        editParent = t.edited.parentNode;
    } catch (err) {
        return;
    }
    try {
        editParent.removeChild(t.editbox);
    } catch (err) {
        return;
    }
    t.editbox = null;
    t.edited.style.display = $(t.edited).attr("displaytype");
    $(t.edited).removeAttr("displaytype");
    t.edited = null;
    t.editedActive = null;
    t.editing = false;
    t.saving = false;
};


BeaconIframe.prototype.setFocus = function(node, flag, index) {
    var t = this;
    
    s = t.iframe.contentWindow.getSelection();
    var r1 = t.iframe.contentWindow.document.createRange();
    
    try {
        r1.setStart(node.childNodes[index], 0);
    } catch (err) {
        return;
    }
    
    try {
        r1.setEnd(node.childNodes[index], 0);
    } catch (err) {
        return;
    }
    
    //r1.selectNode(node);
    //r1.setStartBefore(node.childNodes[1]);

    s.removeAllRanges(); 
    //r1.startOffset = 0;
    s.addRange(r1);

    t.iframe.contentWindow.focus();

    if (flag!=false) {
        node.scrollIntoView();

        t.iframe.scrollBy(0, -100);

        //colorFade(node.id,'background','008C00','ffffff', 50,20);
    }  
};

// Get the contents of the iframe
BeaconIframe.prototype.getContents = function() {
    return this.frame.contents().find("body").html();
};

// Set the contents of the iframe
BeaconIframe.prototype.setContent = function(markup) {
    this.frame.contents().find("body").html(markup);
};

// The Core Function for checking user cursor location (only for guide)
function checkNodePath(node, allowed)
{
    var check = node;
    try {
        while (check.title != 'guide')
        {
            for (var i=0; i < allowed.length; i++)
            {
                //alert(check.title);
                if (check.title == allowed[i])
                return check;
            }
            check = check.parentNode;
        }
    }
    catch(err) {
        return null;
    }

    return null;
}
