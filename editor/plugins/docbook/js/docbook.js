/*
 * DocBookXML Plugin for Beacon
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
function docbook(container, action) {
    
    // THIS IS WAY INCOMPLETE!!!
    
    var opts = {
        container: container,
        action: action
    };

    return new DocBookXML(opts);
};

/*
 * This is the document object for the plugin.
 * 
 */
function DocBookXML(opts) {
    
    $.extend(this, opts);
    if (this.action === "NEW") {
        this.newDoc("plugins/docbook/xml/example.html");
    }
};

DocBookXML.prototype.newDoc = function(src) {
    // Create an editor
    var editor = new BeaconEditor({
        container: this.container,
        src: src,
    });
    
    editor.iframe.setInlineEditors([
        "docbookSectionTitle",
        "docbookParagraph",
        "docbookListItem",
        "docbookCode"
    ]);
    
    editor.iframe.setInlineTypes({
        docbookSectionTitle: "textbox",
        docbookParagraph: "richtext",
        docbookListItem: "richtext",
        docbookCode: "richtext"
    });
    
    editor.toolbar.addRow();
    
    editor.toolbar.addButton({
        row: 0,
        name: "Bold",
        tooltip: "Bold the Selected Text",
        type: "styler",
        icon: "plugins/docbook/img/bold.png",
        //onclick: nodecheck;
        markup: {
            nodeName: "span",
            className: "boldtext",
            title: "docbookBold",
        }
    });
    
    // Set the flagger for the styler tool
    /*editor.toolbar.setFlagger("styler", nodecheck.attach(editor.iframe.id));
    
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
    
    // Send an array of nodes to check
    editor.iframe.setInlineEditors([
        "guideChapterTitle", 
        "guideSectionTitle",
        "guideParagraph",
        "guideAbstractValue", 
        "guideDateValue",
        "guideTitle",
        "guidePreTitle",
        "guideCodeBox",
        "guideWarnValue"
    ]);
    
    // Send an object containing type of inline editor to be generated
    editor.iframe.setInlineTypes({
        guideChapterTitle: "textbox",
        guideSectionTitle: "textbox",
        guideParagraph: "textarea",
        guideAbstractValue: "textarea",
        guideDateValue: "textbox",
        guideTitle: "textbox",
        guidePreTitle: "textbox",
        guideCodeBox: "richtext",
        guideWarnValue: "richtext"
    });*/

};


function getSource() {
    
}


