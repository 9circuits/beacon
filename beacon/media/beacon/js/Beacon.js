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

var Beacon = function(container, conf) {
    this.container = container;

    this.conf = conf;

    this.settings = {};

    this.strings = {};

    this.pluginManager = new BeaconPluginManager(this);

    this.tabs = [{name:"Welcome", plugin: "Beacon"}];

    this.uploading = false;
    this.uploadingFileName = "";
    this.uploadingID = "";

    // Boot up
    this.bootstrap();
};

Beacon.prototype.bootstrap = function() {
    // Load the config file
    $.ajaxq("bootstrap", {
        url: this.conf,
        dataType: "json",
        success: function(json) {
            // Fill up our object
            $.extend(this.settings, json);

            // Get the language pack
            $.ajaxq("bootstrap", {
                url: this.getURL("i18n", this.settings.language),
                dataType: "json",
                success: function(json) {
                    this.strings = json;
                    // Lets Init
                    this.init();

                }.attach(this)
            });

        }.attach(this)
    });
};

Beacon.prototype.getURL = function(type, str) {
    if (type === "script") {
        return (this.settings.url + this.settings[this.settings.backend].scriptpath + str);
    } else if (type === "plugin") {
        return (this.settings.url + this.settings[this.settings.backend].pluginpath + str + "/");
    } else if (type === "i18n") {
        return (this.settings.url + this.settings[this.settings.backend].i18npath + str + ".json");
    } else if (type === "html") {
        return (this.settings.url + this.settings[this.settings.backend].htmlpath + str);
    } else if (type === "handler") {
        return (this.settings.url + this.settings[this.settings.backend].handler);
    } else if (type === "css") {
        return (this.settings.url + this.settings[this.settings.backend].csspath + str);
    } else if (type === "image") {
        return (this.settings.url + this.settings[this.settings.backend].imagepath + str);
    }
    return "";
};

Beacon.prototype.tr = function(name, replace) {
    var str = this.strings.messages[name] || "";

    for (var r in replace){
        str = str.replace("{"+r+"}", replace[r]);
    }

    return str;
};

Beacon.prototype.showLoading = function(container, message) {
    var el = '<div>';
    el += '<p class="BeaconLoading">';
    el += '<span>'+message+'</span>';
    el += '<br /><img src="'+this.getURL("image", "loading.gif")+'" />';
    el += '</p></div>';

    $(container).html(el);
};

Beacon.prototype.init = function() {

    var obj = {}, url = "", i = 0;

    // List of scripts
    var scripts = ["BeaconAPI.js",
                    "jquery.ui.js",
                    "jquery.hotkeys.js",
                    "jquery.jgrowl.js",
                    "jquery.jstree.js",
                    "jquery.scrollTo.js"];

    // Show the loading message
    $(this.container).append("<p>" + this.tr("loadingObject", {name: "Beacon"}) + "</p>");


    // Loads scripts required by Beacon
    for (i = 0; i < scripts.length; i++) {

        // To pass to the success event
        obj = {
            beacon: this,
            container: this.container,
            script: scripts[i]
        };

        $.ajaxq("init", {
            url: this.getURL("script", scripts[i]),
            dataType: "script",
            success: function(data, textStatus) {
                $(this.container).append("<p>" + this.beacon.tr("hasLoaded", {name: this.script}) + "</p>");
            }.attach(obj)
        });
    }

    // Lets add the plugins
    for (i = 0; i < this.settings.plugins.length; i++) {

        // Build URL
        url = this.getURL("plugin", this.settings.plugins[i]) +
                    "js/" +
                    this.settings.plugins[i]+".js";

        // To pass to the success event
        obj = {
            beacon: this,
            container: this.container,
            plugin: this.settings.plugins[i]
        };

        $.ajaxq("init", {
           url: url,
           dataType: "script",
           success: function() {
               $(this.container).append("<p>"+this.beacon.tr("hasLoaded", {name: this.plugin})+"</p>");
               this.beacon.pluginManager.addPlugin(this.plugin);
           }.attach(obj)
        });
    }

    obj = {
        action: "beaconui"
    };

    $.ajaxq("init", {
	url: this.getURL("handler"),
	data: JSON.stringify(obj),
	type: "POST",
	success: function(html) {
	    $(this.container).html(html);

	    $(this.container).tabs();

	    $("#BeaconMenu").accordion({autoHeight: false});

            for (var i = 0; i < this.settings.plugins.length; i++) {
                $("#BeaconConfigPlugins").append("<span>" + this.settings.plugins[i] + " </span>");
                $("#BeaconNewDocType").append("<option value=\"" + i + "\">" + this.settings.plugins[i] + " </option>");
                $("#BeaconEditDocType").append("<option value=\"" + i + "\">" + this.settings.plugins[i] + " </option>");
            }

            $("#BeaconConfigLanguage").html(this.settings.language);
            $("#BeaconConfigTheme").html(this.settings.theme);

            resizeDocuments();

            // Attach all events
            $(window).bind("resize", resizeDocuments);

            $("#BeaconCreateNewButton").bind("click", this.newDoc.attach(this));

            //$("#BeaconFetchButton").bind("click", this.fetchDoc.attach(this));

            $(".BeaconEditDocumentButton").bind("click", this.editDoc.attach(this));
            $(".BeaconDeleteDocumentButton").bind("click", this.deleteDoc.attach(this));

            $("#BeaconRefreshDocumentList").bind("click", this.refreshDocumentList.attach(this));

            $("#BeaconLogOut").bind("click", this.logout.attach(this));

            window.onbeforeunload = this.beaconExit.attach(this)
	}.attach(this)
    });
};

Beacon.prototype.logout = function() {
    if (confirm("Are you sure you want to log out?")) {
        window.location = "logout";
    }
};

Beacon.prototype.beaconExit = function() {
    var str = "You are leaving Beacon. All unsaved documents will be lost.";

    return str;
};

Beacon.prototype.refreshDocumentList = function() {
    $("#BeaconDocumentList").html("Fetching...");

    var obj = {
        action: "getdoclist"
    };

    $.ajaxq("init", {
        url: this.getURL("handler"),
        data: JSON.stringify(obj),
        type: "POST",
        success: function(html) {
            $(".BeaconEditDocumentButton").unbind("click", this.editDoc.attach(this));
            $(".BeaconDeleteDocumentButton").unbind("click", this.deleteDoc.attach(this));

            $("#BeaconDocumentList").html(html);

            $(".BeaconEditDocumentButton").bind("click", this.editDoc.attach(this));
            $(".BeaconDeleteDocumentButton").bind("click", this.deleteDoc.attach(this));
        }.attach(this)
    });
};

// Keep this global
function resizeDocuments() {
    $(".BeaconContent").each(function (i) {
        var extra = 33;
        var tHeight = parseInt($("#BeaconTabList").height(), 10);
        var total = extra + tHeight;
        var th = $("#BeaconContainer").height() - total + 7;
        this.style.height = th + "px";
     });

     $(".BeaconSideBar").each(function (i) {
         var extra = 33;
         var tHeight = parseInt($("#BeaconTabList").height(), 10);
         var total = extra + tHeight;
         var th = $("#BeaconContainer").height() - total + 7;
         this.style.height = th + "px";
     });

     $(".BeaconIframe").each(function (i) {
         var extra = 33;
         var tHeight = parseInt($("#BeaconTabList").height(), 10);
         var total = extra + tHeight;
         var th = $("#BeaconContainer").height() - total - 54;
         this.style.height = th + "px";
     });

     $(".BeaconSourceView").each(function (i) {
         var extra = 33;
         var tHeight = parseInt($("#BeaconTabList").height(), 10);
         var total = extra + tHeight;
         var th = $("#BeaconContainer").height() - total - 54;
         this.style.height = th + "px";
     });

      $(".RevisionFrame").each(function (i) {
          var extra = 33;
          var tHeight = parseInt($("#BeaconTabList").height(), 10);
          var total = extra + tHeight;
          var th = $("#BeaconContainer").height() - total - 54;
          this.style.height = th + "px";
      });
};

Beacon.prototype.newDoc = function() {
    var filename = $.trim($("#BeaconNewFileName").val()),
        filetype = $.trim($("#BeaconNewDocType").val()),
        flag = true,
        id = 0,
        container = "";

    if (filetype === "-1") {
        $.jGrowl(this.strings.messages["noFileType"]);
        flag = false;
    }
    if (filename.length === 0) {
        $.jGrowl(this.strings.messages["noFileName"]);
        flag = false;
    }

    if (filename.substring(filename.length - 4)=== ".xml") {
        var lengthOfName = filename.length - 4;
        filename = filename.substring(0,lengthOfName);
    }

    if ((filename.indexOf(".")!= -1) && (filename.substring(filename.length - 4) !== ".xml")) {
        $.jGrowl("Invalid File Name. Do NOT Give File Extension");
        flag = false;
    }

    if (!flag) {
        return;
    }

    $("#BeaconNewFileName").val("");
    $("#BeaconNewDocType").val(-1);

    // To add some randomness to the tab id temporarily
    id = Math.floor(Math.random()*10001);

    this.initDoc(filename, id, "newdoc", this.settings.plugins[filetype]);
};


Beacon.prototype.editDoc = function(e) {
    if (!e) var obj = window.event.srcElement;
    else var obj = e.target;

    var id = obj.title;

    if (this.tabs[id]) {
        $.jGrowl("You are already editing this document!");
        // Let's prevent default action and propagation
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();

        return false;
    }

    var filename = obj.parentNode.previousSibling.innerHTML;

    container = '#' + filename + id;

    $(this.container).tabs("add", container, filename);
    $(container).addClass('BeaconDocumentTab');
    $(this.container).tabs('select', container);

    this.showLoading(container, "Please wait while the document is being created...");

    var o = {
        id: id
    };

    var data = {
        action: "editdoc",
        payload: o
    };

    var attached = {
        beacon: this,
        payload: o,
        tempid: '#' + filename + id,
    }

    $.ajax({
        url: this.getURL("handler"),
        data: JSON.stringify(data),
        type: "POST",
        dataType: "json",
        success: function(obj) {
            $(this.tempid).html(obj.payload.ui);

            resizeDocuments();

            var ooo = {
                plugin: obj.payload.plugin,
                id: obj.payload.id
            };

            this.beacon.tabs[ooo.id] = ooo;

            this.beacon.pluginManager.initDocument(ooo);

            this.beacon.refreshDocumentList();
        }.attach(attached)
    });

    // Let's prevent default action and propagation
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    return false;
};

Beacon.prototype.initDoc = function(filename, id, action, plugin) {
    var container = '#' + filename + id;

    $(this.container).tabs("add", container, filename);
    $(container).addClass('BeaconDocumentTab');
    $(this.container).tabs('select', container);

    this.showLoading(container, "Please wait while the document is being created...");

    var o = {
        plugin: plugin,
        filename: filename
    };

    var data = {
        action: action,
        payload: o
    };

    var attached = {
        beacon: this,
        payload: o,
        tempid: '#' + filename + id,
    }

    $.ajax({
        url: this.getURL("handler"),
        data: JSON.stringify(data),
        type: "POST",
        dataType: "json",
        success: function(obj) {
            $(this.tempid).html(obj.payload.ui);

            resizeDocuments();

            var ooo = {
                plugin: this.payload.plugin,
                id: obj.payload.id
            };

            this.beacon.tabs[ooo.id] = ooo;

            this.beacon.pluginManager.initDocument(ooo);

            this.beacon.refreshDocumentList();
        }.attach(attached)
    });
};


Beacon.prototype.deleteDoc = function(e) {
    if (!e) var obj = window.event.srcElement;
    else var obj = e.target;

    var id = obj.title;

    if (this.tabs[id]) {
        $.jGrowl("You are already editing this document! Close before deleting.");
        // Let's prevent default action and propagation
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();

        return false;
    }

    var o = {
        id: id
    };

    var data = {
        action: "deletedoc",
        payload: o
    };

    var attached = {
        beacon: this,
        payload: o,
    };

    $.ajax({
        url: this.getURL("handler"),
        data: JSON.stringify(data),
        type: "POST",
        dataType: "json",
        success: function(obj) {
            var o = {
                plugin: obj.plugin,
                id: obj.id
            };

            delete this.beacon.tabs[this.payload.id];

            this.beacon.pluginManager.destroyDocument(o);

            this.beacon.refreshDocumentList();
        }.attach(attached)
    });

    // Let's prevent default action and propagation
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    return false;
};


Beacon.prototype.closeDoc = function(id) {
    var o = {
        plugin: this.tabs[id].plugin,
        id: id
    };

    delete this.tabs[id];

    this.pluginManager.destroyDocument(o);

    this.refreshDocumentList();

    // Get the selected tab
    var selected = $(this.container).tabs('option', 'selected');

    $(this.container).tabs("remove", selected);
};

/*
 * Beacon Plugin Manager
 */
function BeaconPluginManager(o) {
    this.beacon = o;
    this.plugins = {};
};

// Add it to the plugin list
BeaconPluginManager.prototype.addPlugin = function(name) {
    // Attach the recieved JSON object
    this.plugins[name] = {};

    // Set a flag to enable lazy loading
    //this.plugins[name].hasLoaded = this.plugins[name].scripts.length !== 0 ? false : true;

    // Make a document list
    this.plugins[name].documents = {};
};

// Start up the plugin in a given tab
BeaconPluginManager.prototype.initDocument = function(o) {
    var doc = {};

    doc = new BeaconAPI(o, this.beacon);

    // Add it to the list
    this.plugins[o.plugin].documents[o.id] = doc;
};

BeaconPluginManager.prototype.destroyDocument = function(o) {
    delete this.plugins[o.plugin].documents[o.id];
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

/*$.fn.image = function(src, f){
   return this.each(function(){
     $("<img />").appendTo(this).each(function(){
       this.src = src;
       this.onload = f;
     });
   });
}*/

/*
    http://www.JSON.org/json2.js
    2009-04-16

    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*global JSON */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    JSON = {};
}
(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {


        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {


        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }


        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

            return String(value);



        case 'object':

            if (!value) {
                return 'null';
            }

            gap += indent;
            partial = [];

            if (Object.prototype.toString.apply(value) === '[object Array]') {

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

            } else if (typeof space === 'string') {
                indent = space;
            }

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            return str('', {'': value});
        };
    }


    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            var j;

            function walk(holder, key) {

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                j = eval('(' + text + ')');

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

            throw new SyntaxError('JSON.parse');
        };
    }
}());

/*
 * timeago: a jQuery plugin, version: 0.7.1 (2009-02-18)
 * @requires jQuery v1.2 or later
 *
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2008-2009, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
(function($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) return inWords(timestamp);
    else if (typeof timestamp == "string") return inWords($.timeago.parse(timestamp));
    else return inWords($.timeago.parse($(timestamp).attr("title")));
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        ago: null, // DEPRECATED, use suffixAgo
        fromNow: null, // DEPRECATED, use suffixFromNow
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years"
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo || $l.ago;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow || $l.fromNow;
        }
        distanceMillis = Math.abs(distanceMillis);
      }

      var seconds = distanceMillis / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 48 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.floor(days)) ||
        days < 60 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.floor(days / 30)) ||
        years < 2 && substitute($l.year, 1) ||
        substitute($l.years, Math.floor(years));

      return $.trim([prefix, words, suffix].join(" "));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    }
  });

  $.fn.timeago = function() {
    var self = this;
    self.each(refresh);

    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
    }
    return self;
  };

  function refresh() {
    var date = $t.parse(this.title);
    if (!isNaN(date)) {
      $(this).text(inWords(date));
    }
    return this;
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  function substitute(stringOrFunction, value) {
    var string = $.isFunction(stringOrFunction) ? stringOrFunction(value) : stringOrFunction;
    return string.replace(/%d/i, value);
  }

  // fix for IE6 suckage
  if ($.browser.msie && $.browser.version < 7.0) {
    document.createElement('abbr');
  }
})(jQuery);


var zeropad = function (num) {
  return ((num < 10) ? '0' : '') + num;
};

var iso8601 = function (date) {
  return date.getUTCFullYear()
    + "-" + zeropad(date.getUTCMonth()+1)
    + "-" + zeropad(date.getUTCDate())
    + "T" + zeropad(date.getUTCHours())
    + ":" + zeropad(date.getUTCMinutes())
    + ":" + zeropad(date.getUTCSeconds()) + "Z";
};



/*
 * css.js
 *
*/

function get_css(rule_name, stylesheet, delete_flag) {
    if (!document.styleSheets) return false;
    rule_name = rule_name.toLowerCase(); stylesheet = stylesheet || 0;
    for (var i = stylesheet; i < document.styleSheets.length; i++) {
        var styleSheet = document.styleSheets[i]; css_rules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
        if(!css_rules) continue;
        var j = 0;
        do {
            //if(i == 2 && j > 30) alert(css_rules[j].selectorText.toLowerCase() + " " + rule_name);
            if(css_rules.length && j > css_rules.length + 5) return false;
            if(css_rules[j].selectorText && css_rules[j].selectorText.toLowerCase() == rule_name) {
                if(delete_flag == true) {
                    if(document.styleSheets[i].removeRule) document.styleSheets[i].removeRule(j);
                    if(document.styleSheets[i].deleteRule) document.styleSheets[i].deleteRule(j);
                    return true;
                }
                else return css_rules[j];
            }
        }
        while (css_rules[++j]);
    }
    return false;
}
function add_css(rule_name, stylesheet) {
    rule_name = rule_name.toLowerCase(); stylesheet = stylesheet || 0;
    if (!document.styleSheets || get_css(rule_name, stylesheet)) return false;
    (document.styleSheets[stylesheet].insertRule) ? document.styleSheets[stylesheet].insertRule(rule_name+' { }', 0) : document.styleSheets[stylesheet].addRule(rule_name, null, 0);
    return get_css(rule_name, stylesheet);
}
function get_sheet_num (href_name) {
    if (!document.styleSheets) return false;
    for (var i = 0; i < document.styleSheets.length; i++) { if(document.styleSheets[i].href && document.styleSheets[i].href.toString().match(href_name)) return i; }
    return false;
}
function remove_css(rule_name, stylesheet) { return get_css(rule_name, stylesheet, true); }

function add_sheet(url, media) {
    if(document.createStyleSheet) {
        document.createStyleSheet(url);
    }
    else {
        var newSS  = document.createElement('link');
        newSS.rel  = 'stylesheet';
        newSS.type  = 'text/css';
        newSS.media  = media || "all";

        newSS.href  = url;
        // var styles  = "@import url(' " + url + " ');";
        // newSS.href  ='data:text/css,'+escape(styles);
        document.getElementsByTagName("head")[0].appendChild(newSS);
    }
}
