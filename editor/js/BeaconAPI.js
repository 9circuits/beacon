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

    this.beacon = beacon;

    this.id = o.id;
    this.plugin = o.plugin;

    // All the UI elements
    this.uiElementNames = this.getUIList();

    this.ui = {};

    this.src = "";
    this.html = "";

    this.state = {
        viewingSource: false,
        fetchingSource: false,
        fetchingHTML: false,
        saving: false
    };

    this.viewingSource = false;

    for (var i = 0; i < this.uiElementNames.length; i++) {
        this.ui[this.uiElementNames[i]] = {};
        this.ui[this.uiElementNames[i]].id = "#" + this.id + this.uiElementNames[i];
    }

    $(this.ui["Accordion"].id).accordion();

    $(this.ui["TimeStamp"].id).attr("title", iso8601(new Date()));
    $(this.ui["TimeStamp"].id).timeago();

    // Store the html intially for emergency restore
    $(this.ui["Iframe"].id).load(function() {
        this.html = '<body>' + $(this.ui["Iframe"].id).contents().find("body").html() + '</body>';

        $(this.ui["SaveButton"].id).bind("click", this.saveDocument.attach(this));
        $(this.ui["ViewSourceButton"].id).bind("click", this.viewSource.attach(this));
    }.attach(this));

};

// Emergency Restore Function
BeaconAPI.prototype.restoreDocument = function() {
    $.jGrowl("The server could not parse! Restoring back to last known stable document.");

    document.getElementById(this.id+"Iframe").contentWindow.document.body.innerHTML = this.html;

    this.state = {
        viewingSource: false,
        fetchingSource: false,
        fetchingHTML: false,
        saving: false
    };

    this.viewingSource = false;

    $(this.ui["SourceView"].id).hide();
    $(this.ui["Loading"].id).hide();
    $(this.ui["Iframe"].id).show();
};

BeaconAPI.prototype.closeDocument = function() {
};

BeaconAPI.prototype.saveDocument = function() {
    if (this.state["fetchingSource"] || this.state["fetchingHTML"] || this.state["saving"]) {
        $.jGrowl("Please Wait for the current operation to be completed!");
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

    if (!this.state["viewingSource"]) {
        $(this.ui["Iframe"].id).hide();
        $(this.ui["Loading"].id).show();
        $(this.ui["ViewSourceButton"].id).html("Hide Source");

        this.state["viewingSource"] = true;

        this.getSource(true);
    } else {
        $(this.ui["SourceView"].id).hide();
        $(this.ui["Loading"].id).show();
        $(this.ui["ViewSourceButton"].id).html("View Source");

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
                this.restoreDocument();
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
    var list = ["Document",
              "Content",
              "Sidebar",
              "RightToolBar",
              "Accordion",
              "ToolHolder",
              "Iframe",
              "SourceView",
              "CloseButton",
              "SaveButton",
              "ViewSourceButton",
              "DownloadButton",
              "TimeStamp",
              "Loading"];

    return list;
};



