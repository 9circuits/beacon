/*
* Beacon Collaborative Editor
*
*/

// Initialise Beacon
window.onload = loadEditor;

var lastLogId = "NULL";

function loadEditor() 
{
    BeaconEditor.username = window.prompt("Please enter a username:", "");
    
    if (!BeaconEditor.username)
        BeaconEditor.username = "Guest_"+Math.floor(Math.random()*101);
    
    var request = 'NEW_USER';
    var text = BeaconEditor.username;
    
    //userTout = window.setInterval(getUserTimeOut, 9000);alert('k');
    
    //alert("request="+request+"&username="+text+"&id="+BeaconEditor.getVar('id'));
    
    var myAjax = new Ajax.Request(
    "ajax/collab.php", 
    {
        method: 'post', 
        parameters: "request="+request+"&username="+text+"&id="+BeaconEditor.getVar('id'), 
        onComplete: function() {
            // If the response has failed then return
            if (myAjax.responseIsFailure()) alert("Something went bad! Try again...");
            //alert('k');
            
            // Store the response XML and parse it
            var responseXML = myAjax.transport.responseXML;
            var type = responseXML.getElementsByTagName('type')[0].firstChild.nodeValue;
            
            // TODO: Handle the server error here
            if (type == 'ERROR') {
                alert('The username you had selected has already been taken!');
                loadEditor();
                return; 
            }
            var userDisplay = document.getElementById('userDisplay');
            userDisplay.innerHTML = "<div id=\"userlist\"><ol><li class=\"username\">"+BeaconEditor.username+"</li><ol></div>";
            
            // If everything is fine then continue.
            
            document.getElementById('logDisplay').value = '';
            
            postChat("connected", true);
            
            //BeaconEditor.addEventSimple(document.getElementById('chatSubmit'), "click", submitChat);
            
            window.setInterval(getUsers, 3000);
            
            BeaconEditor.init();
        }
    });
    
    //postChat("connected", true);
    
}

// Doubles as a user update function
function getUsers()
{
    var request = 'GET_USER_LIST';
            
    var myAjax = new Ajax.Request(
    "ajax/collab.php", 
    {
        method: 'post', 
        parameters: "request="+request+"&id="+BeaconEditor.getVar('id')+"&username="+BeaconEditor.username, 
        onComplete: function() {
            // If the response has failed then return
            if (myAjax.responseIsFailure()) return;
                        
            var responseText = myAjax.transport.responseText;
            
            var userDisplay = document.getElementById('userDisplay');
            userDisplay.innerHTML = responseText;
        }
    });
}

function submitChat(e)
{
    var text = e.chattext.value;
    
    if (text == '')
        return;
        
    document.getElementById('chattext').value = '';
    postChat(text);
}

function postChat(msg, flag) 
{    
    var request = 'POST_CHAT';
    
    msg = encodeURIComponent(msg);
        
    var myAjax = new Ajax.Request(
    "ajax/collab.php", 
    {
        method: 'post', 
        parameters: 
            "request="+request+"&id="+BeaconEditor.getVar('id')+"&username="+BeaconEditor.username+"&msg="+msg+"&last_id="+lastLogId, 
        onComplete: function() {
            // If the response has failed then return
            if (myAjax.responseIsFailure()) return;
        
            var responseXML = myAjax.transport.responseXML;
        
            if (flag) {
                updateChatBox(responseXML, 0);
                window.setInterval(getChat, 3000);
            } else {
                updateChatBox(responseXML, 1);
            }

        }
    });
    
    
}

function getChat()
{
    //alert('hello');    
    var request = 'GET_CHAT';
        
    var myAjax = new Ajax.Request(
    "ajax/collab.php", 
    {
        method: 'post', 
        parameters: "request="+request+"&id="+BeaconEditor.getVar('id')+"&username="+BeaconEditor.username+"&last_id="+lastLogId, 
        onComplete: function() {
            // If the response has failed then return
            if (myAjax.responseIsFailure()) return;
            
            var responseXML = myAjax.transport.responseXML;
            
            updateChatBox(responseXML, 1);
        }
    });
}

function updateChatBox(responseXML, index)
{
    var chatDisplay = document.getElementById('logDisplay');
    
    var responseText = '\n';
    var chats = responseXML.getElementsByTagName('chats')[0];
        
    // Update only if chat received
    if (index)
        if (responseXML.getElementsByTagName('message')[1] == null)
            return;
            
    var messages = responseXML.getElementsByTagName('message');
    var lastnode = messages[messages.length - 1];
    
    for (var i = index; i < messages.length; i++) {
        var node = messages[i];
        responseText += "["+node.getAttribute('time')+"] - <"+node.getAttribute('user')+"> "+node.firstChild.nodeValue+"\n";
    }
    
    
    lastLogId = lastnode.getAttribute('xml:id');
    
    chatDisplay.value += responseText;
    
    chatDisplay.value = trim11(chatDisplay.value);
    
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// Fastest Trim Function I could find for large strings
function trim11 (str) 
{
	str = str.replace(/^\s+/, '');
	for (var i = str.length - 1; i >= 0; i--) {
		if (/\S/.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}


// Do stuff when user leaves
window.onbeforeunload = unloadEditor;

function unloadEditor() 
{    
    var username = BeaconEditor.username;
    
    postChat("disconnected", true);
    
    var request = 'REMOVE_USER';
    var myAjax = new Ajax.Request(
    "ajax/collab.php", 
    {
        method: 'post', 
        parameters: "request="+request+"&id="+BeaconEditor.getVar('id')+"&username="+username, 
        onComplete: function() {
            // If the response has failed then return
            if (myAjax.responseIsFailure()) return;
        }
    });
    
    BeaconEditor.exit();
}


// One Singleton to handle the editor 
var BeaconEditor = {
    
    // Get all the window vars in easy to use vars
    w: window,
    d: document,
    b: document.body,
    
    f: new Object(),
    
    // Username
    username: '',
    
    // To check if something's being edited
    editing: false,
    
    // Area being edited - Hidden
    edited: null,
    
    // Area being edited - Active
    editedActive: null,
    
    // EditBox
    editbox: null,
    
    // Wether saving in action
    saving: false,
    
    // Save time out function ID
    savetout: 0,
                            
    // Let's initialize out funky editor!
    init: function() {
                
        // Get the Iframe essentials
        this.f = {
            cw: document.getElementById("design").contentWindow,

            d: document.getElementById("design").contentWindow.document,

            b: document.getElementById("design").contentWindow.document.body,

            byID: function(id) {
                return this.d.getElementById(id);
            }
        };
        
        this.addEventSimple(this.f.d, "click", this.frameClick);
        
        iframe = this.f.cw;
        
        iframe.document.addEventListener("keydown",keydown,false);
        iframe.document.addEventListener("keypress",keydown,false);
        iframe.document.addEventListener("keyup",keydown,false);
        
        //this.w.setInterval(this.append, 1000);
        
    },
    
    

    // Return the element by ID
    byID: function(id) {
        return this.d.getElementById(id);
    },
    
    
    
    // Add Event script originally created by Peter Paul Koch at http://www.quirksmode.org/
    addEventSimple: function(obj, evt, fn) {
    	if (obj.addEventListener)
    		obj.addEventListener(evt, fn, false);
    	else if (obj.attachEvent)
    		obj.attachEvent('on' + evt, fn);
    },
    
    

    // Remove Event script originally created by Peter Paul Koch at http://www.quirksmode.org/
    removeEventSimple: function(obj, evt, fn) {
    	if (obj.removeEventListener)
    		obj.removeEventListener(evt, fn, false);
    	else if (obj.detachEvent)
    		obj.detachEvent('on' + evt, fn);
    },
    
    
    
    checkNodePath: function(node, allowed) {
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
    },
    
    
    
    frameClick: function(e) {
        var t = BeaconEditor;
                       
        // Get the node which was clicked
        if (!e) var obj = window.event.srcElement;
    	else var obj = e.target;
        
        // Only Section and the Chapter Titles are editable
        var allowed = new Array("guideSection", "guideChapterTitle");
        
        var editarea = t.checkNodePath(obj, allowed);
        
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
        t.editbox = t.createForm(editarea);
        
        t.byID('getSource').style.visibility = 'hidden';
        
        
    },
    
    
    
    append: function() {
        /*var t = BeaconEditor;
        var node = t.f.d.createElement('div')
        node.innerHTML = 'HELLO';
        t.f.byID('guide').insertBefore(node, t.f.byID('mainContent'));*/
    },
    
    
    
    // Create a Rich Text Editor for the section
    createForm: function(editarea) {        
        var t = this;
        
        var editParent = editarea.parentNode;
        
        var editDiv = t.d.createElement('div');
        editDiv.id = "editBox";
        editDiv.style.border = "2px solid #00FF00";
        
        var form = t.d.createElement('div');
        form.style.display= "block";
        
        var saveCommit = t.d.createElement('a');
        saveCommit.innerHTML = "Save And Commit Changes";
        saveCommit.title = "Commit the changes to the master copy and close the editor box.";
        
        var saveContinue = t.d.createElement('a');
        saveContinue.innerHTML = "Save And Continue Editing | <span id=\"saveStatus\">Last saved at: Never</span>";
        saveContinue.title = "Save the changes to the temporary copy and continue editing.";
        
        var cancel = t.d.createElement('a');
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
            form.appendChild(links[i]);
        }
        
        // TODO: Add Click Handlers
        this.addEventSimple(saveCommit, "click", t.editCommit);
        this.addEventSimple(saveContinue, "click", t.editSave);
        this.addEventSimple(cancel, "click", t.editCancel);
        
        if (editarea.title == 'guideChapterTitle') {
            var editTitle = t.d.createElement('input');
            editTitle.type = "text";
            editTitle.value = editarea.innerHTML;
            editTitle.style.fontSize = "1.3em";
            editTitle.style.fontWeight = "bold";
            editDiv.appendChild(editTitle);
            t.editedActive = editTitle;
            //t.setFocus(editTitle, false, 0);
        } else if (editarea.title == 'guideSection') {
            var editText = editarea.cloneNode(true);
            editText.contentEditable = true;
            editText.style.border = "2px ridge #FFF";
            editText.style.padding = "5px";
            editText.style.outline = "none";
            editDiv.appendChild(editText);
            t.editedActive = editText;
        }
        
        editDiv.appendChild(form);
        
        // Hide the node
        editarea.style.display = 'none';
        
        editParent.insertBefore(editDiv, editarea);
        
        if (editarea.title == 'guideChapterTitle')
            t.editedActive.focus();
        else if (editarea.title == 'guideSection')        
            t.setFocus(t.editedActive, false, 1);
        
        return editDiv;
        
    },
     
    editCommit: function(e) {
        var t = BeaconEditor;
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
        t.savetout = t.w.setInterval(t.saveTimeout, 60000);
        
        
        if (t.edited.title == 'guideChapterTitle') {            
            t.edited.innerHTML = t.editedActive.value;
        }
        else if (t.edited.title == 'guideSection')
            t.edited.innerHTML = t.editedActive.innerHTML;
        
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
        t.edited.style.display = 'block';
        t.edited = null;
        t.editedActive = null;
        t.editing = false;
        t.saving = false;
        
        t.byID('getSource').style.visibility = 'visible';
        
    },
   
   
    
    editSave: function(e) {
        var t = BeaconEditor;
        
        // If already saving then just return the function
        if (t.saving) return;
        
        // If no active edit area then just return
        if (!t.editedActive) return;
        
        // Set the saving flag to true
        t.saving = true;
        
        // Set a timeout function - Throw a panic after 1 minute
        t.savetout = t.w.setInterval(t.saveTimeout, 9000);
        
        // Display a message to the user
        try {
            t.f.byID("saveStatus").innerHTML = '<img src="../images/loading.gif" width="16px" height="16px" border="none" /> Saving... Please Wait!';
        } catch (err) {
            return;
        }
        
        // Set the type of request
        var request = 'SAVE_TEMP';
        
        // Store the text
        var text = '';
        if (t.edited.title == 'guideChapterTitle')
            text = '<div id="guideChapterTitle">'+t.editedActive.value+'</div>';
        else if (t.edited.title == 'guideSection')
            text = '<div id="'+t.editedActive.id+'">'+t.editedActive.innerHTML+'</div>';
        
        // Encode the text for AJAX transport
        text = encodeURIComponent(text);

        /* Thanks to the prototpye library AJAX is so much easier! XD */
        var myAjax = new Ajax.Request(
        "ajax/collab.php", 
        {
            method: 'post', 
            parameters: "request="+request+"&text="+text, 
            onComplete: function() {
                
                // If the response has failed then return
                if (myAjax.responseIsFailure()) return;
                
                // Store the response XML and parse it
                var responseXML = myAjax.transport.responseXML;
                var type = responseXML.getElementsByTagName('type')[0].firstChild.nodeValue;
                
                // TODO: Handle the server error here
                if (type == 'ERROR');
                
                // Show the time at which the document was last saved
                var exp = new Date();
                var time = exp.getHours()+":"+exp.getMinutes()+":"+exp.getSeconds();
                try {
                    t.f.byID("saveStatus").innerHTML = "Last Saved at: "+time;
                } catch (err) {
                    return;
                }
                
                // Set the save flag back to false on completion
                t.saving = false;
                
                t.w.clearInterval(t.savetout);
            }
        }
        
        );
        
    },
   
   
    
    editCancel: function(e) {
        var t = BeaconEditor;
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
        t.edited.style.display = 'block';
        t.edited = null;
        t.editedActive = null;
        t.editing = false;
        t.saving = false;
        
        t.byID('getSource').style.visibility = 'visible';
        
    },
   
   
    
    setFocus: function(node, flag, index) {
        var t = this;
        
        s = t.f.cw.getSelection();
        var r1 = t.f.d.createRange();
        
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

        t.f.cw.focus();

        if (flag!=false) {
            node.scrollIntoView();

            iframe.scrollBy(0, -100);

            //colorFade(node.id,'background','008C00','ffffff', 50,20);
        }  
    },
    
    
    
    // Clear the save block on editor button in case of a timeout. TODO: Find a better algo
    saveTimeout: function() {
        var t = BeaconEditor;
        if (t.saving) {
            t.saving = false;
            alert('Your connection was timed out! Please check your net connection!');
            t.f.byID("saveStatus").innerHTML = "Last Save Failed!";
            t.w.clearInterval(t.savetout);
        }
    },
    
    
    
    // Exit the editor gracefully
    exit: function() {
        
        //TODO: Collaborative stuff, if client then inform server, if server then disconnect clients    
        
    },
    
    
    
    getVar: function(name) {
        getString = this.d.location.search;         
        returnValue = '';

        do { //This loop is made to catch all instances of any get variable.
            nameIndex = getString.indexOf(name + '=');

            if(nameIndex != -1) {
                getString = getString.substr(nameIndex + name.length + 1, getString.length - nameIndex);

                end_of_value = getString.indexOf('&');
                if(end_of_value != -1)                
                value = getString.substr(0, end_of_value);                
                else                
                value = getString;                

                if(returnValue == '' || value == '')
                returnValue += value;
                else
                returnValue += ', ' + value;
            }
            
        } while(nameIndex != -1)

        //Restores all the blank spaces.
        space = returnValue.indexOf('+');
        while(space != -1) { 
            returnValue = returnValue.substr(0, space) + ' ' + 
            returnValue.substr(space + 1, returnValue.length);

            space = returnValue.indexOf('+');
        }

        return(returnValue);  
    },
    
    deleteNode: function(node)
    {
        var t = BeaconEditor;
        
        if (node!=null)
            var text = node;
        else  {
            var theSelection = t.f.cw.getSelection();
            var theRange = theSelection.getRangeAt(0);
            var text = theRange.commonAncestorContainer;
        }

        var allowed = new Array("guideBlock",
                                "guideParagraph");


        var path = t.checkNodePath(text, allowed);    

        var content = t.f.d.getElementById('mainContent');
        var side = t.f.d.getElementById('sideContent');

        if(path!=null) {
            path.style.border = '3px solid #D01F3C';

            if (window.confirm('Are you sure you want to delete current node?')) {
                switch(path.title) {
                    case 'guideBlock':
                        allowed = new Array("guideBody");
                        var body = t.checkNodePath(path, allowed);
                        //alert(body.childNodes[1].innerHTML);
                        if (body!=null) {
                            body.removeChild(path);
                        }
                        break;

                    case 'guideParagraph':
                        allowed = new Array("guideBlock");
                        var body = t.checkNodePath(path, allowed);
                        //alert(body.childNodes[1].innerHTML);
                        if (body!=null) {
                            body.removeChild(path);
                        }
                        break;
                }

            }
            else
                path.style.border = 'none';
        }
        else {
            alert('You cannot delete this node!');
        }

    },
    
    
    // Say hello to folks! 
    hello: function(string) {
        if (string) 
            alert(string);
        else
            alert("Hello");
    }
    
}