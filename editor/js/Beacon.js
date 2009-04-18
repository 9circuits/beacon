 /**
 * Beacon - Core and Utils
 * 
 * Copyright (c) Beacon Dev Team
 * Licensed under GPLv3
 * 
 * Plugins belong to their respective
 * authors as mentioned.
 *
 */

var Beacon = function(opts) {
  
    // Set the defaults
    this.container = "#container";
    
    this.isRoot = true;
    
    this.lang = "en_US";
    
    this.plugins = ["guidexml"];
    
    this.intro = "dialogs/intro.php";
    
    // Override defaults with passed options
    $.extend(this, opts);
    
    // Object to store localized strings
    this.strings = {};

    this.urls = new BeaconURLSet(this);
    
    this.pluginManager = new BeaconPluginManager(this);
    
    this.helpOpen = false;
    
    // Load Beacon
    this.init();

};


// Helper to fetch the translated string
Beacon.prototype.getMessage = function(str) {
    return this.strings.messages[str];
};

/*
 * All the URLs beacon needs (to make it python friendly)
 * 
 * TODO: Possibly load them from a file
 *
 */
function BeaconURLSet(o) {
    this.urls = {
      coreuijs: "js/ui.core.js",
      tabjs: "js/ui.tabs.js",
      growljs: "js/jquery.jgrowl.js",
      modaljs: "js/jquery.simplemodal.js",
      beaconui: "dialogs/beaconui.html",
      beaconapi: "js/BeaconAPI.js",
      i18n: "i18n/"+o.lang+".txt",
      intro: o.intro,
      plugins: "plugins/",
      newform: "dialogs/newform.php"
    };
};

// Helper function to get the URL
BeaconURLSet.prototype.getURL = function(str) {
    return this.urls[str];
};


/*
 * Start up Beacon stage-wise:
 * - Load scripts
 * - Load Plugin Scripts
 * - Load Plugin Resource File
 * - Load the UI and render it
 * - Load the language pack and fill up the text
 * - Load the intro page and call the event binder
 * 
 * TODO: Load CSS dynamically
 * TODO: Currently an Ajax Queue. Shift to a function queue instead.
 * TODO: Remove the need of loading the UI from a file. (With a UI API?)
 * 
 */
Beacon.prototype.init = function() {

    var obj = {}, url = "", i = 0;
    
    // List of scripts
    var scripts = ["coreuijs",
                   "tabjs",
                   "growljs",
                   "modaljs",
                   "beaconapi"];
    
    // If Beacon is the only item on the page then fill up the page
    if (this.isRoot) {              
        this.resizeBeaconContainer();
        $(window).bind("resize", this.resizeBeaconContainer.attach(this));    
    }
    
    // Show the loading message
    $(this.container).append("<p>Loading Beacon...</p>");
    
    
    // Loads scripts required by Beacon                
    for (i = 0; i < scripts.length; i++) {
        
        // To pass to the success event
        obj = {
            container: this.container,
            script: scripts[i]
        };
        
        $.ajaxq("initqueue", {
            url: this.urls.getURL(scripts[i]),
            dataType: "script",
            success: function(data, textStatus) {
                $(this.container).append("<p>"+this.script+" has loaded.</p>");
            }.attach(obj)
        });
    } 
    
    // Loads the main script of each plugin
    for (i = 0; i < this.plugins.length; i++) {
        
        // Build URL
        url = this.urls.getURL("plugins")+
                    this.plugins[i]+"/js/"+
                    this.plugins[i]+".js";
        
        // To pass to the success event            
        obj = {
            container: this.container,
            plugin: this.plugins[i]
        };
        
        $.ajaxq("initqueue", {
           url: url,
           dataType: "script",
           success: function() {
               $(this.container).append("<p>Plugin '"+this.plugin+"' has loaded.</p>");
           }.attach(obj)
        });
    }

    /* 
     * Load the plugin specific resources
     * Loads a JSON file
     * Informs Beacon of which functions/scripts
     * etc are required to communicate with it
     */
    for (i = 0; i < this.plugins.length; i++) {
        
        // Build URL
        url = this.urls.getURL("plugins")+
                    this.plugins[i]+"/resources.txt";
                    
        // To pass to the success event
        obj = {
            beacon: this,
            pluginName: this.plugins[i]
        };
        
        $.ajaxq("initqueue", {
           url: url,
           dataType: "json",
           success: function(json) {
               this.beacon.pluginManager.addPlugin(this.pluginName, json);
               //this.beacon.plugin[this.pluginName] = json;
               //this.beacon.plugin[this.pluginName].initFunction(this.beacon);
           }.attach(obj)
        });
    }
    
    
    //return;
    
    // Load the UI and render it
    $.ajaxq("initqueue", {
        url: this.urls.getURL("beaconui"),
        success: function(html){
            
            // Clean the container of loading messages
            $(this.container).empty();
            
            // Fill 'er up
            $(this.container).append(html);
            
            // Hide the generic DOM resources
            $("#BeaconLoading").hide().end();
            $("#BeaconFail").hide().end();
            
            // Load up the tabs
            $('#BeaconTabList').tabs({
                show: this.resizeDocuments
            });
            
            // Draw the Tab container according to the height
            this.drawTabContainer();
           
        }.attach(this)
    });
    
    // Get the language pack
    $.ajaxq("initqueue", {
        url: this.urls.getURL("i18n"),
        dataType: "json",
        success: function(json) {
            this.strings = json;
            
            // Fill up the spans
            $.each(this.strings.uiText, function(i, val){
                $("#"+i).append(val);
            });
        }.attach(this)
    });
    
    /*
     * Load the intro page.
     * Fire up the bindGLobals method
     * on complete.
     */
    $.ajaxq("initqueue", {
        url: this.urls.getURL("intro"),
        success: function(html) {  
            // Append the intro to the welcome tab          
            $("#BeaconIntroTab").append(html);
            
            // All loading done
            // Attach Events
            this.bindGlobals();
            
        }.attach(this)
    });
    
};


// Bind global stuff to events
Beacon.prototype.bindGlobals = function() {
    // Funny eh? Dual binders! Gimme the this object!
    $("#BeaconTabClose").bind("click", this.closeDocument.attach(this));
    
    // Bind various renderers to resize event
    $(window).bind("resize", this.drawTabContainer.attach(this));
 
    // Bind menu actions
    $("#BeaconNew").bind("click", this.newDoc.attach(this));
    
    $("#BeaconEdit").bind("click", function() {
        $.jGrowl($("#BeaconTabList").height());
    });
    
    $("#BeaconHelp").bind("click", this.help.attach(this));
};


// Resize the main container
Beacon.prototype.resizeBeaconContainer = function(){
    
    var ms, top, wh, mrg, brd;
    
    ms = $(this.container);
    top = ms.offset().top;
    
    wh = $(window).height();
  
    // Account for margin or border on the container
    mrg = parseInt(ms.css("marginBottom"), 10) || 0;
    brd = parseInt(ms.css("borderBottomWidth"), 10) || 0;
    ms.css("height", (wh - top - mrg - brd) + "px");
};



// Draw the tab Container
Beacon.prototype.drawTabContainer = function() {
    
    var ms, top, wh, mrg, brd;
    
    // Set the tab container bottom align with window bottom
    ms = $("#BeaconTabContainer");
	top = ms.offset().top;		
	
    wh = $(this.container).height();
    
	// Account for margin or border on the container
	mrg = parseInt(ms.css("marginBottom"), 10) || 0;
	brd = parseInt(ms.css("borderBottomWidth"), 10) || 0;
	ms.css("height", (wh - top - mrg - brd) + "px");
    
    this.resizeDocuments();
};



// Resize the documents on addition and deletion of tabs
Beacon.prototype.resizeDocuments = function() {
    $(".BeaconDocumentTab").each(function (i) {
        var extra = 33;
        var tHeight = parseInt($("#BeaconTabList").height(), 10);
        var total = extra + tHeight;
        var th = $("#BeaconTabContainer").height() - total + 7;
        this.style.height = th + "px";
     });  
};

Beacon.prototype.closeDocument = function() {
    
    // TODO: Delete the document from the document list
    
    // TODO: Remove all rendering of the doc
    
    var selectedTab = $("#BeaconTabList").data("selected.tabs");
    //$("<p>"+selectedTab+"<\/p>").appendTo("#BeaconIntroTab");
    if (!selectedTab) {
        $.jGrowl(this.strings.messages["closeError"]);
        return;
    } 
    
    if (selectedTab === 1 && this.helpOpen) {
        $("#BeaconTabList").tabs("select", 0);
        this.helpOpen = false;
    }

    //$.jGrowl(selectedTab)

    $("#BeaconTabList").tabs("remove", selectedTab);
    
};

Beacon.prototype.help = function () {
    
    if (this.helpOpen) {
        $("#BeaconTabList").tabs('select', "#help");
        return;
    }
    
    var helpframe = '<iframe id="helproom" width="100%" height="100%" scrolling="no" style="border:0; display: none;"';
    helpframe += 'src="http://embed.mibbit.com/?';
    helpframe += 'server=irc.freenode.net&channel=%23beacon&';
    helpframe += 'noServerNotices=true&noServerMotd=true&forcePrompt=true"></iframe>';
    
    $("#BeaconTabList").tabs('add', "#help", "Help", 1);
    
    // Add the basic styling
    $("#help").addClass('BeaconDocumentTab');
    
    $("#BeaconTabList").tabs('select', "#help");
    
    $("<div id=\"chatroomloading\"><\/div>").appendTo("#help");
    
    var el = $("#BeaconLoading").clone();
    
    el.appendTo("#chatroomloading");
    el.show().end();
    
    $("#help").append(helpframe);
    
    $("#helproom").hide().end();
    
    $("#helproom").bind("load", function() {
        $("#chatroomloading").empty();
        $("#helproom").show().end();
    });
    
    $.jGrowl(this.strings.messages["liveHelp"]);
    
    this.helpOpen = true;
};


Beacon.prototype.newDoc = function() {
    
    var dialog = '<div id="boo"><\/div>';
    
    var el = $("#BeaconLoading").clone();
    
    $.modal(dialog, {
        onClose: function(dialog) {
            $.modal.close();
        }.attach(this)
    });
    
    el.appendTo("#boo");
    el.show().end();
    
    $.ajax({
        //async: false,
        url: this.urls.getURL("newform"),
        success: function(html) {
            $("#boo").empty();
            $("#boo").append(html);
            
            $.each(this.plugins, function() {
                $("<option value=\""+this+"\">"+this+"<\/option>").appendTo("#doctypeselect");
            });
            
            //$("#doctypeselect").change(this.fetchPluginForm.attach(this));
            $("#BeaconNewSubmit").bind("click", function(){
                var filename = $.trim($("#docname").val()),
                    filetype = $.trim($("#doctypeselect").val()),
                    flag = true,
                    id = 0,
                    container = "";

                if (filetype === "null") {
                    $.jGrowl(this.strings.messages["noFileType"]);
                    flag = false;
                } 
                if (filename.length === 0) {
                    $.jGrowl(this.strings.messages["noFileName"]);
                    flag = false;
                }

                if (!flag) {
                    return;
                }
                
                // To add some randomness to the tab id
                id = Math.floor(Math.random()*10001);
                
                container = '#' + filename + id;
                
                $("#BeaconTabList").tabs('add', container, filename);
                
                // Add the basic styling
                $(container).addClass('BeaconDocumentTab');

                $("#BeaconTabList").tabs('select', container);

                $.modal.close();
                
                this.pluginManager.initPlugin(filetype, container, "NEW");
                
            }.attach(this));
            
            // Show forms
            $('form.cmxform').show().end();
            
       }.attach(this)
       
    });

};

/*
 * Beacon Plugin Manager:
 * 
 * TODO: Complete the manager, duh!
 */
function BeaconPluginManager(o) {
    this.beacon = o;
    this.plugins = {};
};

// Add it to the plugin list
BeaconPluginManager.prototype.addPlugin = function(name, res) {
    
    // Attach the recieved JSON object
    this.plugins[name] = res;
    
    // Set a flag to enable lazy loading
    this.plugins[name].hasLoaded = this.plugins[name].scripts.length !== 0 ? false : true;
    
    // Make a document list
    this.plugins[name].documents = {};
    
};

// Start up the plugin in a given tab
BeaconPluginManager.prototype.initPlugin = function(name, container, action) {
    var doc = {},
        i = 0,
        url = "",
        scripts = [],
        o = {},
        el = $("#BeaconLoading").clone();
    
    // Check if the plugin's scripts have been loaded
    if (!this.plugins[name].hasLoaded) {
        
        // If yes show a load
        el.appendTo(container);
        el.show().end();
        $("<p align=\"center\">"+this.beacon.getMessage("loadingPluginScripts")+"<\/p>").appendTo(container);
        
        scripts = this.plugins[name].scripts;

        for (i = 0; i < scripts.length; i++) {
            url = this.beacon.urls.getURL("plugins")+
                  name+"/js/"+
                  scripts[i];
            
            // TODO: Stop sending the whole object everytime     
            o = {
                status: scripts.length - i - 1,
                manager: this,
                name: name,
                container: container,
                action: action
            };
            
            $.ajaxq(name, {
                url: url,
                dataType: "script",
                success: function() {
                    if (this.status === 0) {
                        $(this.container).empty();
                        this.manager.plugins[name].hasLoaded = true;
                        this.manager.initPlugin(this.name, this.container, this.action);
                    }
                }.attach(o)
            });
        }
    
        return; // Call the initFunction within the Ajax Request
    }
    
    // Call the init function of the plugin handing it the container
    doc = this.plugins[name].initFunction(container, action);
    
    // Add it to the list
    this.plugins[name].documents[container] = doc;
    
};


// Make an array out of a pseudo array
function toArray(pseudoArray) {
    var result = [];
    for (var i = 0; i < pseudoArray.length; i++) {
        result.push(pseudoArray[i]);
    }
    return result;
};

// Attach an object to a method to 'this'
Function.prototype.attach = function (object) {
    var method = this;
    var oldArguments = toArray(arguments).slice(1);
    return function () {
        var newArguments = toArray(arguments);
        return method.apply(object, oldArguments.concat(newArguments));
    };
};

// Attach an event to a method along with an object
Function.prototype.attachEvent = function (object) {
    var method = this;
    var oldArguments = toArray(arguments).slice(1);
    return function (event) {
        return method.apply(object, [event || window.event].concat(oldArguments));
    };
};



/*
 * jQuery AjaxQ - AJAX request queueing for jQuery
 *
 * Version: 0.0.1
 * Date: July 22, 2008
 *
 * Copyright (c) 2008 Oleg Podolsky (oleg.podolsky@gmail.com)
 * Licensed under the MIT (MIT-LICENSE.txt) license.
 *
 * http://plugins.jquery.com/project/ajaxq
 * http://code.google.com/p/jquery-ajaxq/
 */

jQuery.ajaxq = function (queue, options)
{
	// Initialize storage for request queues if it's not initialized yet
	if (typeof document.ajaxq == "undefined") document.ajaxq = {q:{}, r:null};

	// Initialize current queue if it's not initialized yet
	if (typeof document.ajaxq.q[queue] == "undefined") document.ajaxq.q[queue] = [];
	
	if (typeof options != "undefined") // Request settings are given, enqueue the new request
	{
		// Copy the original options, because options.complete is going to be overridden

		var optionsCopy = {};
		for (var o in options) optionsCopy[o] = options[o];
		options = optionsCopy;
		
		// Override the original callback

		var originalCompleteCallback = options.complete;

		options.complete = function (request, status)
		{
			// Dequeue the current request
			document.ajaxq.q[queue].shift ();
			document.ajaxq.r = null;
			
			// Run the original callback
			if (originalCompleteCallback) originalCompleteCallback (request, status);

			// Run the next request from the queue
			if (document.ajaxq.q[queue].length > 0) document.ajaxq.r = jQuery.ajax (document.ajaxq.q[queue][0]);
		};

		// Enqueue the request
		document.ajaxq.q[queue].push (options);

		// Also, if no request is currently running, start it
		if (document.ajaxq.q[queue].length == 1) document.ajaxq.r = jQuery.ajax (options);
	}
	else // No request settings are given, stop current request and clear the queue
	{
		if (document.ajaxq.r)
		{
			document.ajaxq.r.abort ();
			document.ajaxq.r = null;
		}

		document.ajaxq.q[queue] = [];
	}
}

/*
 * Dimensions
 * @author Dave Methvin (dave.methvin@gmail.com)
*/

// Override jQuery height function
jQuery.fn.height = function() {
	if ( this.get(0) == window )
		return self.innerHeight ||
			jQuery.boxModel && document.documentElement.clientHeight ||
			document.body.clientHeight;
	if ( this.get(0) == document )
		return Math.max( document.body.scrollHeight, document.body.offsetHeight );
	
	return parseInt(this.css("height", arguments[0]), 10);
};

// Override jQuery width function
jQuery.fn.width = function() {
	if ( this.get(0) == window )
		return self.innerWidth ||
			jQuery.boxModel && document.documentElement.clientWidth ||
			document.body.clientWidth;
	
	if ( this.get(0) == document )
		return Math.max( document.body.scrollWidth, document.body.offsetWidth );
	
	return this.css("width", arguments[0]);
};

jQuery.fn.innerHeight = function() {
	return this.get(0) == window || this.get(0) == document ?
		this.height() :
		this.get(0).offsetHeight - parseInt(this.css("borderTop") || 0, 10) - parseInt(this.css("borderBottom") || 0, 10);
};

jQuery.fn.innerWidth = function() {
	return this.get(0) == window || this.get(0) == document ?
		this.width() :
		this.get(0).offsetWidth - parseInt(this.css("borderLeft") || 0, 10) - parseInt(this.css("borderRight") || 0, 10);
};

jQuery.fn.outerHeight = function() {
	return this.get(0) == window || this.get(0) == document ?
		this.height() :
		this.get(0).offsetHeight;	
};

jQuery.fn.outerWidth = function() {
	return this.get(0) == window || this.get(0) == document ?
		this.width() :
		this.get(0).offsetWidth;	
};

jQuery.fn.scrollLeft = function() {
	if ( this.get(0) == window || this.get(0) == document )
		return self.pageXOffset ||
			jQuery.boxModel && document.documentElement.scrollLeft ||
			document.body.scrollLeft;
	
	return this.get(0).scrollLeft;
};

jQuery.fn.scrollTop = function() {
	if ( this.get(0) == window || this.get(0) == document )
		return self.pageYOffset ||
			jQuery.boxModel && document.documentElement.scrollTop ||
			document.body.scrollTop;

	return this.get(0).scrollTop;
};

jQuery.fn.offset = function(refElem) {
	if (!this[0]) throw 'jQuery.fn.offset requires an element.';

	refElem = (refElem) ? jQuery(refElem)[0] : null;
	var x = 0, y = 0, elem = this[0], parent = this[0], sl = 0, st = 0;
	do {
		if (parent.tagName == 'BODY' || parent.tagName == 'HTML') {
			// Safari and IE don't add margin for static and relative
			if ((jQuery.browser.safari || jQuery.browser.msie) && jQuery.css(parent, 'position') != 'absolute') {
				x += parseInt(jQuery.css(parent, 'marginLeft'), 10) || 0;
				y += parseInt(jQuery.css(parent, 'marginTop'), 10)  || 0;
			}
			break;
		}

		x += parent.offsetLeft || 0;
		y += parent.offsetTop  || 0;

		// Mozilla and IE do not add the border
		if (jQuery.browser.mozilla || jQuery.browser.msie) {
			x += parseInt(jQuery.css(parent, 'borderLeftWidth'), 10) || 0;
			y += parseInt(jQuery.css(parent, 'borderTopWidth'), 10)  || 0;
		}

		// Mozilla removes the border if the parent has overflow hidden
		if (jQuery.browser.mozilla && jQuery.css(parent, 'overflow') == 'hidden') {
			x += parseInt(jQuery.css(parent, 'borderLeftWidth'), 10) || 0;
			y += parseInt(jQuery.css(parent, 'borderTopWidth'), 10)  || 0;
		}

		// Need to get scroll offsets in-between offsetParents
		var op = parent.offsetParent;
		do {
			sl += parent.scrollLeft || 0;
			st += parent.scrollTop  || 0;
			parent = parent.parentNode;
		} while (parent != op);
	} while (parent);

	if (refElem) { // Get the relative offset
		var offset = jQuery(refElem).offset();
		x  = x  - offset.left;
		y  = y  - offset.top;
		sl = sl - offset.scrollLeft;
		st = st - offset.scrollTop;
	}

	// Safari and Opera do not add the border for the element
	if (jQuery.browser.safari || jQuery.browser.opera) {
		x += parseInt(jQuery.css(elem, 'borderLeftWidth'), 10) || 0;
		y += parseInt(jQuery.css(elem, 'borderTopWidth'), 10)  || 0;
	}

	return {
		top:  y - st,
		left: x - sl,
		width:  elem.offsetWidth,
		height: elem.offsetHeight,
		borderTop:  parseInt(jQuery.css(elem, 'borderTopWidth'), 10)  || 0,
		borderLeft: parseInt(jQuery.css(elem, 'borderLeftWidth'), 10) || 0,
		marginTop:  parseInt(jQuery.css(elem, 'marginTopWidth'), 10)  || 0,
		marginLeft: parseInt(jQuery.css(elem, 'marginLeftWidth'), 10) || 0,
		scrollTop:  st,
		scrollLeft: sl,
		pageYOffset: window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop  || 0,
		pageXOffset: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
	};
};

/*$.fn.image = function(src, f){
   return this.each(function(){
     $("<img />").appendTo(this).each(function(){
     	this.src = src;
     	this.onload = f;
     });
   });
}*/

