/*
 * GuideXML Plugin for Beacon
 * 
 * Copyright Beacon Dev Team
 * Licensed under GPLv3
 *
 * This plugin also serves as a guideline on how to
 * create a plugin for Beacon.
 *
 */
 
/*
 * This is the default init function that Beacon
 * will use. Specify this in your resources.txt
 *
 * Arguments:
 * container - The display on which your document resides.
 * action - Type of action. Like "new", "edit", etc.
 *
 * Return Type:
 * A new instance of the Document Object
 *
 */
function guidexml(container, action) {
    
    // THIS IS WAY INCOMPLETE!!!
    
    var opts = {
        container: container,
        action: action
    };
    
    return new GuideXML(opts);
};

/*
 * This is the document object for the plugin.
 * 
 */
function GuideXML(opts) {
    
    $.extend(this, opts);
    if (this.action === "NEW") {
        this.newDoc("plugins/guidexml/xml/template1.html");
        //alert("hello")
    }
};

GuideXML.prototype.newDoc = function(src) {
    // Create an editor
    var editor = new BeaconEditor({
        container: this.container,
        src: src,
    });
    
    // Set the flagger for the styler tool
    editor.toolbar.setFlagger("styler", nodecheck.attach(editor.iframe.id));
    
    // Add a row to the toolbar
    editor.toolbar.addRow();
    
    // Add the Bold Button
    editor.toolbar.addButton({
        row: 0,
        name: "Bold",
        tooltip: "Bold the Selected Text",
        type: "styler",
        icon: "plugins/guidexml/img/bold.png",
        //onclick: nodecheck;
        markup: {
            nodeName: "span",
            className: "boldtext",
            title: "guideBold",
            
        }
    });
    
    // Add a separator
    editor.toolbar.addSeparator(0);
    
    editor.toolbar.addButton({
        row: 0,
        name: "XML",
        tooltip: "Convert current document to XML",
        handler: getSource,
        icon: "plugins/guidexml/img/xml.png",
        markup: {}
    });
    
    editor.toolbar.addSeparator(0);
};


function getSource() {
    
}

// Check whether the nodes are allowed or not
function nodecheck() {

    var allowed = new Array("guideParagraph", 
                            "guideList",
                            "guideNoteValue",
                            "guideWarnValue",
                            "guideImpoValue",
                            "guideCodeBox");
                            
    var iframe = document.getElementById(this).contentWindow;
    
    var theSelection = iframe.getSelection();
    var theRange = theSelection.getRangeAt(0);

    var text = theRange.commonAncestorContainer;  
                   
    var path = checkNodePath(text, allowed);       
    
    if (path == null)
        return false;
    else
        return true;
}


