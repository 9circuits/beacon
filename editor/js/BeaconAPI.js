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

var BeaconAPI = function(o, beacon) {
    // Lets have our papa bear object
    this.beacon = beacon;

    // Store the id
    this.id = o.id;

    // Store the plugin name
    this.plugin = o.plugin;

    // Fetch the plugin specific DTD
    this.dtd = eval(this.plugin + "_dtd()");

    // All the UI elements
    this.uiElementNames = this.getUIList();

    // Cache
    this.src = "";
    this.html = "";

    // Our state object.
    this.state = {
        viewingSource: false,
        fetchingSource: false,
        fetchingHTML: false,
        saving: false,
        editing: false
    };

    // Storage for editables
    this.editingNode = null;
    this.currentEditor = null;


    // Init the UI storage
    this.ui = {};

    // Build up our UI quick reference
    for (var i = 0; i < this.uiElementNames.length; i++) {
        this.ui[this.uiElementNames[i]] = {};
        this.ui[this.uiElementNames[i]].id = "#" + this.id + this.uiElementNames[i];
    }

    // Save the iframe separately
    this.iframe = document.getElementById(this.id + "Iframe").contentWindow;

    // Show the pretty accordion
    $(this.ui["Accordion"].id).accordion();

    // Init the time stamps
    $(this.ui["TimeStamp"].id).attr("title", iso8601(new Date()));
    $(this.ui["TimeStamp"].id).timeago();

    $(this.ui["Iframe"].id).load(function() {
        // Store the html intially for emergency restore
        this.html = '<body>' + $(this.ui["Iframe"].id).contents().find("body").html() + '</body>';

        // Let us attach the events
        $(this.ui["SaveButton"].id).bind("click", this.saveDocument.attach(this));
        $(this.ui["ViewSourceButton"].id).bind("click", this.viewSource.attach(this));

        $(this.ui["InsertInlineButton"].id).bind("click", this.insertInline.attach(this));
        $(this.ui["InsertBlockButton"].id).bind("click", this.insertBlock.attach(this));

        // Make the iframe clickable
        $(this.ui["Iframe"].id).contents().bind("click", this.frameClick.attach(this));
        $(this.ui["Iframe"].id).contents().bind("keydown", this.frameKeyDown.attach(this));

    }.attach(this));
};


BeaconAPI.prototype.frameClick = function(e) {
     // Get the node which was clicked
    if (!e) var obj = window.event.srcElement;
    else var obj = e.target;

    if (this.state["editing"]) {
        // If already editing then see if the editor is removable
        if (this.cleanEditor(obj)) {
            // Clear the editing state
            this.state["editing"] = false;
        }
    } else {
        // Try and create an editor
        if (this.initEditor(obj)) {
            // Set editing state
            this.state["editing"] = true;
        }
    }

    // Let's prevent default action and propagation
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    return false;
};

BeaconAPI.prototype.frameKeyDown = function(e) {
    if (!e) e = window.event;

    switch(e.keyCode) {
        // Close any editor in case of Enter Key
        case 13:
            if (this.state["editing"]) {
                // If already editing then see if the editor is removable
                if (this.cleanEditor(false)) {
                    // Clear the editing state
                    this.state["editing"] = false;
                }
            }

            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
        break;
    }
};

BeaconAPI.prototype.initEditor = function(o) {
    // Copy over the DTD if exists
    var nodeDef = this.dtd[o.title] || null;

    // If not found in DTD let's move on
    if (!nodeDef) {
        //$.jGrowl("Not found in DTD!");
        return false;
    }

    // Check the node type
    if (nodeDef.type === "inline") {
        while (o.nodeName.toLowerCase() !== "body") {
            o = o.parentNode;
            nodeDef = this.dtd[o.title] || null;

            if (nodeDef) {
                if (nodeDef.type === "block") {
                    break;
                }
            }
        }
    }

    if (nodeDef.editorType) {
        switch (nodeDef.editorType) {
            case "richText":
                // Fire up the rich text editor
                this.currentEditor = new BeaconRichTextEditor(o, this.iframe);

                // Store the object we are editing
                this.editingNode = o;

                this.buildInlineInsertMenu(nodeDef);
                this.buildBlockInsertMenu(nodeDef);
                break;

            case "lineedit":
                // Fire up the line editor
                this.currentEditor = new BeaconLineEditor(o, this.iframe);

                // Store the object we are editing
                this.editingNode = o;

                this.buildBlockInsertMenu(nodeDef);
                break;

            case "plaintext":
                // Fire up the plain text editor
                this.currentEditor = new BeaconPlainTextEditor(o, this.iframe);

                // Store the object we are editing
                this.editingNode = o;

                this.buildBlockInsertMenu(nodeDef);
                break;

            default:
                return false;
        }
    } else {
        return false;
    }

    return true;
};

BeaconAPI.prototype.cleanEditor = function(o) {
    var nodeDef = this.dtd[o.title] || null;

    var editorType = this.currentEditor.getType();

    if (editorType === "richtext") {
        if (o === this.editingNode) {
            return false;
        }

        if (nodeDef) {
            if (nodeDef.type === "inline") {
                if ($(this.editingNode).find(o.tagName).index(o) > -1)
                    return false;
            }
        }

        this.buildInlineInsertMenu(false);
        this.buildBlockInsertMenu(false);
        this.currentEditor.restoreNode();
        this.currentEditor = {};
    } else if (editorType === "lineedit") {
        if (o === this.currentEditor.getNode()) {
            return false;
        }

        this.buildBlockInsertMenu(false);
        this.currentEditor.restoreNode();
        this.currentEditor = {}
    } else if (editorType === "plaintext") {
        if (o === this.currentEditor.getNode()) {
            return false;
        }

        this.buildBlockInsertMenu(false);
        this.currentEditor.restoreNode();
        this.currentEditor = {}
    } else {
        return false;
    }

    return true;
};

BeaconAPI.prototype.buildInlineInsertMenu = function(nodeDef) {
    var list = nodeDef.inlineChildren;

    if (this.list === false) {
        return;
    }

    var html = '<option value="-1">Select Any One</option>';

    if (!list) {
        $(this.ui["InsertInlineList"].id).html(html);
        return;
    }

    for (var i = 0; i < list.length; i++) {
        html += '<option value="'+list[i]+'">';
        html += list[i];
        html += '</option>';
    }

    $(this.ui["InsertInlineList"].id).html(html);
};

BeaconAPI.prototype.insertInline = function() {
    if (!this.state["editing"]) {
        $.jGrowl("You are not editing anything!");
        return;
    }

    if (this.currentEditor.getType() !== "richtext") {
        $.jGrowl("You cannot insert a node in non-richtext type editor.");
        return;
    }

    var val = $(this.ui["InsertInlineList"].id).val();

    if (val === "-1") {
        $.jGrowl("Select something!");
        return;
    }

    if (val.length !== 1) {
        $.jGrowl("I told you to select only option! :)");
        return;
    }

    var insertDef = this.dtd[val] || null;

    if (!insertDef) {
        return;
    }

    var text = this.iframe.getSelection();

    if (insertDef.inlineType === "generic") {
        // If its generic then just dump it in the iframe
        var html = this.buildHTML(val, insertDef.markup, text);
        this.currentEditor.insertText(html);
    }
};

BeaconAPI.prototype.buildHTML = function(title, markup, text) {
    // Build starting
    var html = '<' + markup.tag;

    // Add attributes
    for (var a in markup.attributes) {
        if (a === "className") {
            html += ' class="' + markup.attributes[a] + '"';
        } else {
            html += ' ' + a + '="' + markup.attributes[a] + '"';
        }
    }

    // Add the title attribute so it can be parse back
    html += ' title="' + title + '"';

    // If our HTML is empty and sampleText exists then add that instead
    if (markup.sampleText && $.trim(text) === "") {
        text = markup.sampleText;
    }

    // Add text and close tag
    html += '>' + text + '</' + markup.tag + '>';

    // Return
    return html;
};

BeaconAPI.prototype.buildBlockInsertMenu = function(nodeDef) {
    var list = nodeDef.siblings;

    if (this.list === false) {
        return;
    }

    var html = '<option value="-1">Select Any One</option>';

    if (!list) {
        $(this.ui["InsertBlockList"].id).html(html);
        return;
    }

    for (var i = 0; i < list.length; i++) {
        html += '<option value="'+list[i]+'">';
        html += list[i];
        html += '</option>';
    }

    $(this.ui["InsertBlockList"].id).html(html);
};

BeaconAPI.prototype.insertBlock = function() {
    if (!this.state["editing"]) {
        $.jGrowl("You are not editing anything!");
        return;
    }

    var name = $(this.ui["InsertBlockList"].id).val();

    var position = $('input[name=insertAt]:checked').val();

    if (name === "-1") {
        $.jGrowl("Select Something!");
        return;
    }

    var editingNodeDef = this.dtd[this.editingNode.title];

    if (editingNodeDef.standAlone) {
        var html = "";

        html = this.buildNodeStructure(name);

        var o = this.editingNode;

        if (position[0] === "before") {
            $(html).insertBefore(o);
        } else if (position[0] === "after") {
            $(html).insertAfter(o);
        }
    } else {
        var html = "";

        html = this.buildNodeStructure(name);

        var o = this.editingNode;

        while (o.nodeName.toLowerCase() !== "body") {
            o = o.parentNode;

            if (o.title === name[0]) {
                break;
            }
        }

        if (o.title !== name[0]) {
            return;
        }

        alert(html);

        if (position === "before") {
            $(html).insertBefore(o);
        } else if (position === "after") {
            $(html).insertAfter(o);
        }
    }
};

BeaconAPI.prototype.buildNodeStructure = function(title) {
    var nodeDef = this.dtd[title];

    var html = "";

    if (nodeDef.markup.requiredChildNodes) {
        for (var i = 0; i < nodeDef.markup.requiredChildNodes.length; i++) {
            html += this.buildNodeStructure(nodeDef.markup.requiredChildNodes[i]);
        }
    }

    html = this.buildHTML(title, nodeDef.markup, html);

    return html;
};

// Emergency Restore Function
BeaconAPI.prototype.restoreDocument = function() {
    $.jGrowl("The server could not parse! Restoring back to last known stable document.");

    document.getElementById(this.id+"Iframe").contentWindow.document.body.innerHTML = this.html;

    this.state = {
        viewingSource: false,
        fetchingSource: false,
        fetchingHTML: false,
        saving: false,
        editing: false
    };

    $(this.ui["SourceView"].id).hide();
    $(this.ui["Loading"].id).hide();
    $(this.ui["Iframe"].id).show();
};

// Emergency Restore Function
BeaconAPI.prototype.restoreSourceView = function() {
    $.jGrowl("The server could not parse the XML! Please check for any formatting errors.");

    this.state = {
        viewingSource: true,
        fetchingSource: false,
        fetchingHTML: false,
        saving: false,
        editing: false
    };

    $(this.ui["SourceView"].id).show();
    $(this.ui["Loading"].id).hide();
    $(this.ui["Iframe"].id).hide();
};

BeaconAPI.prototype.closeDocument = function() {
};

BeaconAPI.prototype.saveDocument = function() {
    if (this.state["fetchingSource"] || this.state["fetchingHTML"] || this.state["saving"]) {
        $.jGrowl("Please Wait for the current operation to be completed!");
        return;
    }

    if (this.state["editing"]) {
        $.jGrowl("Please finish editing before saving.");
        return;
    }

    $(this.ui["TimeStamp"].id).attr("title", iso8601(new Date()));
    $(this.ui["TimeStamp"].id).timeago();
};

BeaconAPI.prototype.viewSource = function() {
    if (this.state["fetchingSource"] || this.state["fetchingHTML"] || this.state["saving"]) {
        $.jGrowl("Please Wait for the current operation to be completed!");
        return;
    }

    if (this.state["editing"]) {
        $.jGrowl("Please finish editing before saving.");
        return;
    }

    if (!this.state["viewingSource"]) {
        $(this.ui["Iframe"].id).hide();
        $(this.ui["Loading"].id).show()

        this.state["viewingSource"] = true;

        this.getSource(true);
    } else {
        $(this.ui["SourceView"].id).hide();
        $(this.ui["Loading"].id).show();

        this.state["viewingSource"] = false;

        this.getHTML(true);
    }
};


BeaconAPI.prototype.getSource = function(displayFlag) {

    if (!displayFlag) {
        if (!this.state["fetchingSource"]) {
            return this.src;
        }
    } else {
        if (!this.state["fetchingSource"]) {
            this.state["fetchingSource"] = true;
        } else {
            $.jGrowl("Please Wait for the current operation to be completed!");
            return;
        }
    }

    var html = $(this.ui["Iframe"].id).contents().find("body").html();

    html = encodeURIComponent(html);

    var o = {
        action: "getsrc",
        payload: {
            id: this.id,
            plugin: this.plugin,
            html: html
        }
    };

    $.ajaxq("beaconapi", {
        url: this.beacon.getURL("handler"),
        type: "POST",
        data: JSON.stringify(o),
        success: function(src) {
            if (src === "FAIL") {
                this.restoreDocument();
                return;
            }
            src = decodeURIComponent(src);
            this.state["fetchingSource"] = false;
            this.src = src;
            if (displayFlag) {
                $(this.ui["SourceView"].id).val($.trim(src));
                $(this.ui["Loading"].id).hide();
                $(this.ui["SourceView"].id).show();
            } else {
                this.getSource(false);
            }
        }.attach(this)
    });

};

BeaconAPI.prototype.getHTML = function(displayFlag) {
    if (!displayFlag) {
        if (!this.state["fetchingHTML"]) {
            return this.html;
        }
    } else {
        if (!this.state["fetchingHTML"]) {
            this.state["fetchingHTML"] = true;
        } else {
            $.jGrowl("Please Wait for the current operation to be completed!");
            return;
        }
    }

    var src = $(this.ui["SourceView"].id).val();

    src = encodeURIComponent(src);

    var o = {
        action: "gethtml",
        payload: {
            id: this.id,
            plugin: this.plugin,
            src: src
        }
    };

    $.ajaxq("beaconapi", {
        url: this.beacon.getURL("handler"),
        type: "POST",
        data: JSON.stringify(o),
        success: function(html) {
            if ($.trim(html) === "FAIL") {
                this.restoreSourceView();
                return;
            }
            html = decodeURIComponent(html);
            this.state["fetchingHTML"] = false;
            this.html = html;
            if (displayFlag) {
                document.getElementById(this.id+"Iframe").contentWindow.document.body.innerHTML = html;
                $(this.ui["Loading"].id).hide();
                $(this.ui["Iframe"].id).show();
            } else {
                this.getHTML(false);
            }
        }.attach(this)
    });
};


BeaconAPI.prototype.getUIList = function() {
    var list = ["Document", "Content", "Sidebar", "RightToolBar", "Accordion",
              "ToolHolder", "Iframe", "SourceView", "CloseButton", "SaveButton",
              "ViewSourceButton", "DownloadButton", "TimeStamp", "Loading",
              "InsertInlineButton", "InsertBlockButton", "InsertInlineList",
              "InsertBlockList", "InsertAfter", "InserBefore", "DeleteButton"];

    return list;
};



var BeaconRichTextEditor = function(o, iframe) {
    // Store this node
    this.node = o;

    // Store the iframe reference
    this.iframe = iframe;

    // Store the initial HTML
    this.html = this.node.innerHTML;

    // Make the node Editable
    this.node.contentEditable = true

    // Copy over old styles
    this.style = {};
    this.style.oldBackground = this.node.style.background;

    // Set new styles
    this.node.style.background = "#FFFFCC";

    // Remove the fugly outline
    this.node.style.outline = "none"

    // Focus the node to set cursor
    this.node.focus();
};

BeaconRichTextEditor.prototype.restoreNode = function() {
    // Reset the old background
    this.node.style.background = this.style.oldBackground;

    // Make it uneditable
    this.node.contentEditable = false;
};

BeaconRichTextEditor.prototype.insertText =  function(html) {
    // Stuff it in
    this.iframe.document.execCommand('inserthtml', false, html);
};

BeaconRichTextEditor.prototype.keyPressed = function() {

};

BeaconRichTextEditor.prototype.getType = function() {
    // Return type
    return "richtext";
};



var BeaconLineEditor = function(o, iframe) {
    // Store this node
    this.node = o;

    // Store the iframe reference
    this.iframe = iframe;

    // Store the initial HTML
    var html = this.node.innerHTML;

    var editTitle = document.createElement('input');
    editTitle.type = "text";
    editTitle.value = $.trim(this.node.innerHTML);
    $(editTitle).addClass($(this.node).attr('class'));
    $(this.node).html("");
    $(this.node).append(editTitle);

    this.editor = editTitle;

    // Focus the node to set cursor
    editTitle.focus();
};

BeaconLineEditor.prototype.restoreNode = function() {
    var html = $(this.editor).val();
    $(this.node).html(html);
};


BeaconLineEditor.prototype.keyPressed = function() {

};

BeaconLineEditor.prototype.getType = function() {
    // Return type
    return "lineedit";
};

BeaconLineEditor.prototype.getNode = function() {
    // Return type
    return this.editor;
};



var BeaconPlainTextEditor = function(o, iframe) {
    // Store this node
    this.node = o;

    // Store the iframe reference
    this.iframe = iframe;

    // Store the initial HTML
    var html = this.node.innerHTML;

    var editText = document.createElement('textarea');
    editText.value = $.trim(this.node.innerHTML);
    $(editText).addClass($(this.node).attr('class'));
    editText.style.height = $(this.node).height();
    editText.style.width = "100%";
    $(this.node).html("");
    $(this.node).append(editText);

    this.editor = editText;

    // Focus the node to set cursor
    editText.focus();
};

BeaconPlainTextEditor.prototype.restoreNode = function() {
    var html = $(this.editor).val();
    $(this.node).html(html);
};


BeaconPlainTextEditor.prototype.keyPressed = function() {

};

BeaconPlainTextEditor.prototype.getType = function() {
    // Return type
    return "plaintext";
};

BeaconPlainTextEditor.prototype.getNode = function() {
    // Return type
    return this.editor;
};
