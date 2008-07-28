var openImg = new Image();
openImg.src = "images/open.gif";
var closedImg = new Image();
closedImg.src = "images/closed.gif";

var src;

var iframe;

/* Say hello to everyone! */
function hello()
{
    alert('hello');
}

// Handles the exit event. I know I can't stop the browser from closing! :D
function exit(e) 
{
    //TODO: Collaborative stuff, if client then inform server, if server then disconnect clients
    
   // if (window.confirm('Would you like to keep the current document?')) {
        //Save the file
        //alert("Saved!");
    //}
    //else {
        //alert("Document Deleted") 
    //}
    
}

function initEditor() 
{       
    //Get the iframe's content window
    iframe = document.getElementById("design").contentWindow;
    
    //Make the document Editable
    iframe.document.designMode = 'On'; 
    //iframe.document.body.contentEditable = true;
    
    //Style the editable document
    iframe.document.getElementById("guide").style.margin = '5px';
        
    //Attach Event Listeners
    if (document.addEventListener) {
        iframe.document.addEventListener("keydown",keydown,false);
        iframe.document.addEventListener("keypress",keydown,false);
        iframe.document.addEventListener("keyup",keydown,false);
        
    } else if (document.attachEvent) {
        iframe.document.attachEvent("keydown", keydown);
        iframe.document.attachEvent("keypress",keydown);
        iframe.document.attachEvent("keyup",keydown);
    } else {
        iframe.document.onkeydown = keydown;
        iframe.document.onkeypress = keydown;
        iframe.document.onkeyup = keydown;
    }

    //Create the Document Tree
    createTree();
    
    //Save the contents every one minute
    window.setInterval(autoSave, 60000);

    //setFocus(iframe.document.getElementById('mainContent'), false, 0);
    //document.body.style.overflow = 'hidden';
    //iframe.document.getElementById("guide").onclick = klick;
}

function autoSave() 
{
    var gid = getVar('id');

    // Add the missing style
    var style= '<?xml version="1.0" encoding="UTF-8"?><style type="text/css" media="all">';
    style += '@import "../css/guide.css";';
    style += '</style><body>';
    var text = style+iframe.document.body.innerHTML+'</body>';

    text = encodeURIComponent(text);

    /* Thanks to the prototpye library AJAX is so much easier! XD */
    var myAjax = new Ajax.Request(
    "ajax/save.php", 
    {
        method: 'post', 
        parameters: "id="+gid+"&text="+text, 
        onComplete: function() {
            var exp = new Date();
            var time = exp.getHours()+":"+exp.getMinutes()+":"+exp.getSeconds();
            document.getElementById("savedStatus").innerHTML = "Draft Last Saved at - "+time;
        }
    }
    );
}

// The Core Function for checking user cursor location
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

/* Working hard every keystroke! To make your RTE idiot-proof! Brought to you by the Blah Blah Blah productions! XD */
function keydown(e)
{
    //alert(e.keyCode);
    if (!e) e = event;

    var theSelection = iframe.getSelection();
    var theRange = theSelection.getRangeAt(0);

    var start = theRange.startOffset;
    var end = theRange.endOffset;
    
    var text = theRange.commonAncestorContainer;
    
    var fullPath = getFullPath(text);
    
    //alert(path.length);

    var status = 'Status: title = '+text.title;
    status += ', startOffset = '+start;
    status += ', endOffset = '+end;
    status += ', nodeName = '+text.nodeName;
    status += ', nodeLength = '+text.length+'<br />';

    for (var i=0; i<fullPath.length; i++) {
        if (fullPath[i].title)
            status += fullPath[i].title+' &gt; '; 
        else 
            status += fullPath[i].id+' &gt; ';
            //alert(path.innerHTML);
    }
    
    /* This RTE is kinda like fill in the blanks. Only certain areas are editable. 
    This list will increase as the RTE is further developed */

    var allowed = new Array("guideParagraph", 
                            "guideChapterTitle", 
                            "guideSectionTitle", 
                            "guideList",
                            "guideAuthorTitle",
                            "guideAuthorName", 
                            "guideDateValue", 
                            "guideAbstractValue",
                            "guideCodeBox",
                            "guidePreTitle",
                            "guideNoteValue",
                            "guideWarnValue",
                            "guideImpoValue",
                            "guideTitle",
                            "guideBlock");

    var path = checkNodePath(text, allowed);

    if (path!=null)
        status += 'PATH = '+path.title;
    else 
        status += 'ERROR = This Part/Block/Selection in not editable!';

    document.getElementById("status").innerHTML = status;

    //Let the Arrow keys run free!
    if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
        return;

    if (path == null) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        return;
    }

    //if (e.preventDefault) e.preventDefault();
    //if (e.stopPropagation) e.stopPropagation();
    
    switch(e.keyCode) {
        //The three most damaging keys: DEL, BKSPCE, ENTER
        case 13:
            switch(path.title) {

                case 'guideCodeBox':
                    if(e.type == "keydown") {
                    //iframe.document.execCommand('inserthtml', false, "");
                    // get current selection
                    var html = '<br /> ';
                    var insertNode = document.createElement('span');
                    insertAtSelection(html, insertNode);
                    }
                    
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopPropagation) e.stopPropagation();
                    
                    break;
                    
                case 'guideParagraph':
                    if(e.type == "keydown" && start == end) {
                        
                        var index = pathHas(fullPath, path.title);
                        
                        var newText;
                        var oldText;
                        
                        var flag = 0;
                                                
                        for (var i=0; i < fullPath[index].childNodes.length; i++) {
                            if (fullPath[index].childNodes[i] == text.parentNode) {
                                newText = text.parentNode.innerHTML.substring(start, text.parentNode.innerHTML.length);
                                oldText = text.parentNode.innerHTML.substring(0, start);
                                flag = 1;
                                break;
                            }
                        }
                        
                        var knode = iframe.document.createElement('div');
                        var pnode = iframe.document.createElement('div');
                        
                        if (flag == 1) {
                            var beforeNode = text.parentNode.cloneNode(false);
                            beforeNode.innerHTML = newText;
                            knode.appendChild(beforeNode);
                            for (var j=i+1; j < fullPath[index].childNodes.length; j++) 
                                knode.appendChild(fullPath[index].childNodes[j].cloneNode(true));
                                
                            var afterNode = beforeNode.cloneNode(false);

                            afterNode.innerHTML = oldText;
                            pnode.appendChild(afterNode);

                            for (var k=i-1; k >= 0; k--)
                               pnode.insertBefore(fullPath[index].childNodes[k].cloneNode(true), pnode.childNodes[0]);
                               
                        } else {
                            var textNode = iframe.document.createTextNode(text.data.substring(start, text.data.length));
                            knode.appendChild(textNode);
                            var vtext = text.nextSibling;
                            while (vtext != null) {
                                knode.appendChild(vtext.cloneNode(true));                               
                                vtext = vtext.nextSibling;
                            }
                            
                            textNode = iframe.document.createTextNode(text.data.substring(0, start));
                            pnode.appendChild(textNode);
                            var ptext = text.previousSibling;
                            while (ptext != null) {
                                pnode.insertBefore(ptext.cloneNode(true), pnode.childNodes[0]);
                                ptext = ptext.previousSibling;
                            }
                        }
                        addParagraph(false, knode.innerHTML);
                        path.innerHTML = pnode.innerHTML;
                    //alert(pnode.innerHTML);
                    //alert(knode.innerHTML);
                    }
                    
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopPropagation) e.stopPropagation();
                    break;
                    
                case 'guideSectionTitle':
                    addParagraph(false);
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopPropagation) e.stopPropagation();
                    break;
                    
                case 'guideList':
                    if(e.type == "keydown") {
                        //alert(text.parentNode.nodeName);
                        
                        for (var i=0; i < path.childNodes.length; i++)
                            if (path.childNodes[i].nodeType == 3)
                                path.removeChild(path.childNodes[i]);
                        
                        while (text.nodeName.toLowerCase() != 'li')
                            text = text.parentNode;
                            
                        //alert(text.nextSibling);
                        
                        if (text.nextSibling == null) {
                            if (text.innerHTML == '-- Item --') {
                                addParagraph(false);
                                text.parentNode.removeChild(text);
                            }
                            else {
                                var li = iframe.document.createElement('li');
                                li.innerHTML = "-- Item --";
                                text.parentNode.appendChild(li);
                                setFocus(li, false, 0);
                            }
                        }
                        else {
                            var li = iframe.document.createElement('li');
                            li.innerHTML = "-- Item --";
                            text.parentNode.insertBefore(li, text);
                            setFocus(li, false, 0);
                            
                        }
                    }
                    
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopPropagation) e.stopPropagation();
                    break;
                
                default:
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopPropagation) e.stopPropagation();
            }
            break;

        case 8:
        case 46:
            switch(path.title) {
                case 'guideList':
                    for (var i=0; i < path.childNodes.length; i++)
                        if (path.childNodes[i].nodeType == 3)
                            path.removeChild(path.childNodes[i]);
                        
                    while (text.nodeName.toLowerCase() != 'li')
                        text = text.parentNode;
                    
                    if (start == 0) {
                        if (text.previousSibling == null) {
                            if (e.preventDefault) e.preventDefault();
                            if (e.stopPropagation) e.stopPropagation();
                        }
                    }    
                    break;
                    
                case 'guideAbstractValue':
                    if (start == 0) {
                        if (e.preventDefault) e.preventDefault();
                        if (e.stopPropagation) e.stopPropagation();
                    }
                    break;
                    
                default:          
                    //alert(text.parentNode.nodeName.toLowerCase());
                    
                    var sallowed = new Array("guideNoteValue",
                                         "guideWarnValue",
                                         "guideImpoValue",
                                         "guidePreTitle");
                                     
                    var spath = checkNodePath(text, sallowed);
                
                    if (spath!=null) // This solution ! working in Safari
                        if (start == 0) {
                            //hello();
                            if (e.preventDefault) e.preventDefault();
                            if (e.stopPropagation) e.stopPropagation();
                        }
                        
                        
                    if (start == 0) {
                        switch (text.parentNode.nodeName.toLowerCase()) {
                            case 'span':
                                break;
                                
                            case 'a':
                                break;
                            default:
                                if (e.preventDefault) e.preventDefault();
                                if (e.stopPropagation) e.stopPropagation();
                                break;
                        }
                    }
            }
            break;

        default:
            break;
    }
    
    switch(path.title) {
        case 'guideChapterTitle':
            document.getElementById('C_'+path.parentNode.id).innerHTML = path.innerHTML;            
            break;
        case 'guideSectionTitle':
            document.getElementById('S_'+path.parentNode.id).innerHTML = path.innerHTML;
            break;
    }
}

function insertAtSelection(html, insertNode)
{
    var sel = iframe.getSelection();   

    // get the first range of the selection
    // (there's almost always only one range)
    var range = sel.getRangeAt(0);

    // insert specified HTML into the node passed by argument
    insertNode.innerHTML = html;  

    // deselect everything
    sel.removeAllRanges();

    // remove content of current selection from document
    range.deleteContents();

    // get location of current selection
    var container = range.startContainer;
    var pos = range.startOffset;

    // make a new range for the new selection
    range=document.createRange();

    var afterNode;
    //container.insertData(pos, insertNode.nodeValue);

    if (container.nodeType==3 && insertNode.nodeType==3) {

      // if we insert text in a textnode, do optimized insertion
      container.insertData(pos, insertNode.nodeValue);

    } else {


      if (container.nodeType==3) {

        // when inserting into a textnode
        // we create 2 new textnodes
        // and put the insertNode in between

        var textNode = container;
        container = textNode.parentNode;
        var text = textNode.nodeValue;

        // text before the split
        var textBefore = text.substr(0,pos);
        // text after the split
        var textAfter = text.substr(pos);

        var beforeNode = document.createTextNode(textBefore);
        var afterNode = document.createTextNode(textAfter);

        // insert the 3 new nodes before the old one
        container.insertBefore(afterNode, textNode);
        container.insertBefore(insertNode, afterNode);
        container.insertBefore(beforeNode, insertNode);

        // remove the old node
        container.removeChild(textNode);

      } else {

        // else simply insert the node
        afterNode = container.childNodes[pos];
        container.insertBefore(insertNode, afterNode);
      }
    }

    // select the modified html
    s = iframe.getSelection();
    var r1 = iframe.document.createRange();
    
    r1.setStart(insertNode, 1);
    r1.setEnd(insertNode, 1);

    s.removeAllRanges(); 
    s.addRange(r1);

    iframe.focus();
}


function pathHas(fullPath, title)
{
    for (i=0; i<fullPath.length; i++)
        if (fullPath[i].title == title)
            return i;
    return null;
}


function getFullPath(node)
{
    var path = new Array();
    var i = 0;
    
    while (node.id != 'guide') {
        path[i] = node;
        i++;
        node = node.parentNode;
        
    }
    
    return path;
}




// Past this point: Completed functions and *sigh* well working...

// Set the focus of the cursor to the given node. Edit: Problem apparently solved.
function setFocus(node, flag, index) 
{
    s = iframe.getSelection();
    var r1 = iframe.document.createRange();
    r1.setStart(node.childNodes[index], 0);
    r1.setEnd(node.childNodes[index], 0);
    //r1.selectNode(node);
    //r1.setStartBefore(node.childNodes[1]);

    s.removeAllRanges(); 
    //r1.startOffset = 0;
    s.addRange(r1);

    iframe.focus();

    if (flag!=false) {
        node.scrollIntoView();

        iframe.scrollBy(0, -100);

        colorFade(node.id,'background','008C00','ffffff', 50,20);
    }
}



// Add a a little color to dull text :P
function addSpan(spanTitle, spanClass, spanDir)
{
    var allowed = new Array("guideParagraph", 
                            "guideList",
                            "guideNoteValue",
                            "guideWarnValue",
                            "guideImpoValue",
                            "guideCodeBox");
                            
    var theSelection = iframe.getSelection();
    var theRange = theSelection.getRangeAt(0);

    var text = theRange.commonAncestorContainer;  
                   
    var path = checkNodePath(text, allowed);       
    
    if (path == null)
        return;
    
    var span;
     
    span = '<span';
    if (spanTitle)
        span += ' title="'+spanTitle+'"';
    if (spanClass)
        span += ' class="'+spanClass+'"';
    if (spanDir)
        span += ' dir="'+spanDir+'"';
    span += '>';
    span += theSelection;
    span += '</span>';


    var start = theRange.startOffset;
    var end = theRange.endOffset;
    
    if (start == end)
        return;
        
    iframe.document.execCommand('inserthtml', false, span);
    //alert(span);
}



// Removes all styling from a text selection. Note: I need to find a better way to do this. Currently just a hack.
function clearFormat()
{
    var allowed = new Array("guideParagraph", 
                            "guideList",
                            "guideNoteValue",
                            "guideWarnValue",
                            "guideImpoValue",
                            "guideCodeBox");
                            
    var theSelection = iframe.getSelection();
    var theRange = theSelection.getRangeAt(0);

    var text = theRange.commonAncestorContainer;  
                   
    var path = checkNodePath(text, allowed);       
    
    if (path == null)
        return;
        
    var start = theRange.startOffset;
    var end = theRange.endOffset;

    if (start == end)
        return;

    iframe.document.execCommand('inserthtml', false, "</span>"+theSelection+"<span>");
}



//Adds an Author
function addAuthor(authorName, authorTitle, authorMail)
{
    var text = "";
    
    text = '\n<div title="guideAuthorName">';

    if (authorMail.length > 0) {
        text += '\n<a title="guideMail" linkval="'+authorMail+'" href="mailto:'+authorMail+'" class="altlink">';
        text += '<b title="guideMailValue">'+authorName+'</b></a>';
    } else {
        text += '\n<a title="guideMail" class="altlink">';
        text += '<b title="guideMailValue">'+authorName+'</b></a>';
    }
    
    /*else 
        text += authorName;*/

    text += '\n</div>';
    text += '\n<div title="guideAuthorTitle">'+authorTitle+'</div>';
    text += '\n</div><br />';
    
    var side = iframe.document.getElementById('sideContent');
    
    var author = iframe.document.createElement('div');
    author.title = "guideAuthor";
    author.className = "alttext";
    author.innerHTML = text;
        
    side.insertBefore(author, iframe.document.getElementById('authorBreak'));    
}



// Removes the anchor off the selected text
function removeLink()
{
    var theSelection = iframe.getSelection();
    var theRange = theSelection.getRangeAt(0);
    var text = theRange.commonAncestorContainer;

    var allowed = new Array("guideParagraph", 
                            "guideList",
                            "guideNoteValue",
                            "guideWarnValue",
                            "guideImpoValue");

    var path = checkNodePath(text, allowed);
    
    if(path!=null)
        iframe.document.execCommand('unlink', false, null);
}



// Add a link to selected text or where the cursor is. Takes care of guideXML formatting
function insertLink(displayText, link) 
{       
    var theSelection = iframe.getSelection();
    var theRange = theSelection.getRangeAt(0);
    var text = theRange.commonAncestorContainer;

    var allowed = new Array("guideParagraph", 
                            "guideList",
                            "guideNoteValue",
                            "guideWarnValue",
                            "guideImpoValue");
                            
    var path = checkNodePath(text, allowed);
    
    var linkText = '<a title="guideLink" href="'+link+'"';
    
    if (displayText.length != 0)
        linkText += ' linkval="'+link+'"';
    else
        linkText = displayText;
    
    linkText += '>';
	linkText +=	displayText+'</a>';
	
	if(path != null) {
	    iframe.document.execCommand('inserthtml', false, linkText);
	    //alert(linkText);
	}
}



// Deletes a node: Passed as a parameter or based on the current cursor position
function deleteNode(node)
{
    if (node!=null)
        var text = node;
    else  {
        var theSelection = iframe.getSelection();
        var theRange = theSelection.getRangeAt(0);
        var text = theRange.commonAncestorContainer;
    }
    
    var allowed = new Array("guideBlock",
                            "guideParagraph", 
                            "guideChapter", 
                            "guideSection",
                            "guideAuthor");
                            
    
    var path = checkNodePath(text, allowed);    
    
    var content = iframe.document.getElementById('mainContent');
    var side = iframe.document.getElementById('sideContent');
    
    if(path!=null) {
        path.style.border = '3px solid #D01F3C';
        
        if (window.confirm('Are you sure you want to delete current node?')) {
            switch(path.title) {
                case 'guideChapter':
                    content.removeChild(path);
                    reFactorChapters(content);
                    createTree();
                    break;
                    
                case 'guideSection':
                    allowed = new Array("guideChapter");
                    var chapter = checkNodePath(path, allowed);
                    if (chapter!=null) {
                        chapter.removeChild(path);
                        reFactorSections(chapter);
                        createTree();
                    }
                    break;
                    
                case 'guideBlock':
                    allowed = new Array("guideBody");
                    var body = checkNodePath(path, allowed);
                    //alert(body.childNodes[1].innerHTML);
                    if (body!=null) {
                        body.removeChild(path);
                    }
                    break;
                
                case 'guideParagraph':
                    allowed = new Array("guideBlock");
                    var body = checkNodePath(path, allowed);
                    //alert(body.childNodes[1].innerHTML);
                    if (body!=null) {
                        body.removeChild(path);
                    }
                    break;
                case 'guideAuthor':
                    side.removeChild(path);
                    break;
            }
            
        }
        else
            path.style.border = 'none';
    }
    else {
        alert('You cannot delete this node!');
    }

}



// Hmmm... This is what I have to do to get the GET variable
function getVar(name)
{
    get_string = document.location.search;         
    return_value = '';

    do { //This loop is made to catch all instances of any get variable.
        name_index = get_string.indexOf(name + '=');

        if(name_index != -1) {
            get_string = get_string.substr(name_index + name.length + 1, get_string.length - name_index);

            end_of_value = get_string.indexOf('&');
            if(end_of_value != -1)                
            value = get_string.substr(0, end_of_value);                
            else                
            value = get_string;                

            if(return_value == '' || value == '')
            return_value += value;
            else
            return_value += ', ' + value;
        }
       } while(name_index != -1)

    //Restores all the blank spaces.
    space = return_value.indexOf('+');
    while(space != -1) { 
        return_value = return_value.substr(0, space) + ' ' + 
        return_value.substr(space + 1, return_value.length);

        space = return_value.indexOf('+');
    }

    return(return_value);        
}



// Built in browser exec command running BLAH BLAH BLAH! Will get replaced by self written functions
function execute(command, value) 
{
    if (value == null)  {
        iframe.document.execCommand(command.id, false, null);
    }
    else if (value == 'note' || value == 'impo' || value == 'warn') {
        addNote(command, value);
    }
    else if (value == 'paragraph') {
        addParagraph();
    }
    else if (value == 'epigraph') {
        addEpigraph();
    }
    else if (value == 'code') {
        addCode();
    }
    else if (value == 'ol' || value == 'ul') {
        addList(value);
    }
}



// Adds Note/Warn/Impo
function addNote(command, value) 
{

    var insertText, pTitle, spanTitle, bgColor, spanText, pClass, bText;
    spanTitle = command.name;
    bText = command.title;
    pClass = value;
    spanText = 'Insert '+command.title+' Here';
    pTitle = 'guide'+command.title;
    bgColor = 'background: ';
    if (value == 'note')
    {bgColor += '#bbffbb;';}
    else if (value == 'warn')
    {bgColor += '#ffbbbb;';}
    else if (value == 'impo')
    {bgColor += '#ffffbb;';}
    insertText = '<p class="ncontent" style="'+bgColor+'">';
    insertText += '<span title="'+pTitle+'" class="'+pClass+'"><b>'+bText+': </b>';
    insertText += '<span title="'+spanTitle+'">'+spanText+'</span></span></p>';	

    addBlockType(getSel(), getSel(), insertText, 'null', true, 0);
}



/* Adds a Code Listing */
function addCode() 
{
    var insertText;
    insertText = '<div title="guidePreHeader" class="codetitle" style="background: #7a5ada; margin: 0px;">';
    insertText += 'Code Listing: <span title="guidePreTitle">Sample Caption</span></div>';
    insertText += '<div title="guidePreCode" style="background: #eeeeff;">';
    insertText += '<pre title="guideCodeBox">Insert Code Here</pre></div>';

    addBlockType(getSel(), getSel(), insertText, 'null', true, 1);
}



/* Adds a List (Ordered/Unordered) */
function addList(value) 
{
    var insertText;
    insertText = "<li>Sample List Item</li>";
    addBlockType(getSel(), getSel(), insertText, value, false, 1);
}



/* Adds a Paragraph */
function addParagraph(flag, text)
{
    var insertText = 'Sample Paragraph';

    if (text)
        insertText = text;

    return addBlockType(getSel(), getSel(), insertText, 'para', flag, 0);
}



/* Adds an Epigraph */
function addEpigraph(flag, text)
{
    var insertText = '\n<p title="guideEpigraph" class="epigraph">';
    
    insertText += 'I am an Epigraph!';
    insertText += '<br /><br />- <span title="guideSignature" class="episig">';
    insertText += 'Epigraph';
	insertText += '</span><br /><br /></p>';

    if (text)
        insertText = text;

    return addBlockType(getSel(), getSel(), insertText, 'null', flag, 0);
}



/* Add a block type element. Includes: Paragraph, List, Note/Warn/Impo, Pre. Not called directly!*/
function addBlockType(theAnchorNode, theBody, insertText, type, flag, index)
{
    var insert = 0;

    if (type == "para") {
        var newNode = document.createElement('div');
        newNode.title = 'guideBlock';
        var para = document.createElement('p');
        para.title = 'guideParagraph';
        para.innerHTML = insertText;
        newNode.appendChild(para);
    } else if (type == 'ol' || type == 'ul') {
        var newNode = document.createElement('div');
        newNode.title = 'guideBlock';
        var list = document.createElement(type);
        list.title = 'guideList';
        list.innerHTML = insertText;
        newNode.appendChild(list);
    } else  {
        var newNode = document.createElement('div');
        newNode.title = 'guideBlock';
        newNode.innerHTML = insertText;
    }

    var allowed = new Array("guideBody",
                            "guideSectionTitle");
    var path = checkNodePath(theAnchorNode, allowed);
    

    
    if(path == null || theAnchorNode == null)
        return;    
    
    switch(path.title) {
        case 'guideSectionTitle':
            while (path.title != 'guideBody')
                path = path.nextSibling;
                
            if (path.title != 'guideBody')
                return;
            else {
                path.insertBefore(newNode, path.childNodes[0].nextSibling);
                //path.insertBefore(iframe.document.createTextNode("\n\n"), newNode);
                setFocus(newNode, flag, index);
            }
            break;
                                
        case 'guideBody':
            cleanUp(path);
            if (path.childNodes.length == 0)
                path.appendChild(newNode);	
            else {
                allowed = new Array("guideBlock");
                theAnchorNode = checkNodePath(theAnchorNode, allowed);
                if (theAnchorNode != null)
                    path.insertBefore(newNode, theAnchorNode.nextSibling);
            }
            path.insertBefore(iframe.document.createTextNode("\n\n"), newNode);
            //path.insertBefore(iframe.document.createTextNode("\n\n"), newNode.nextSibling);
            
            setFocus(newNode, flag, index);
    }

    
    /*if (insert == 1)
    theBody.insertBefore(newNode, theAnchorNode.nextSibling);
    else
    theBody.appendChild(newNode);	

    setFocus(newNode, flag, index); */


    return newNode;
}



/* Adds a Chapter */
function addChapter(chapterTitle, sectionTitle) 
{
    var theAnchorNode = getAnchor('guideChapter', 'doc_chap0');
    var mainContent = getParent('mainContent', theAnchorNode);

    var insertText;
    insertText = '<p title="guideChapterTitle" class="chaphead">';
    insertText += chapterTitle+'</p>';
    insertText += '<div id="doc_chap_sec1" title="guideSection"><p title="guideSectionTitle" class="secthead">';
    insertText += sectionTitle+'</p>';
    insertText += '<div title="guideBody"><div title="guideBlock"><p title="guideParagraph">Insert Content Here!</p></div></div></div>';

    var theChapter = document.createElement("div");
    theChapter.id = "doc_chap";
    theChapter.title = 'guideChapter';
    theChapter.innerHTML = insertText;
   
    //This is basically insertAfter which Javascript doesn't have!
    if(theAnchorNode.nextSibling)
        mainContent.insertBefore(theChapter, theAnchorNode.nextSibling);
    else
        mainContent.appendChild(theChapter);

    // Renumber the Chapters
    reFactorChapters(mainContent);

    // Recreate the DOM tree
    createTree();

    // Set Cursor Focus to the Chapter - Not doing this now (bug in firefox!)
    //iframe.focus();

    // Scroll the Iframe to bring our chapter into view
    setFocus(theChapter, true, 0);

}



/* Refactors Chapter Numbers after Creation/Deletion of Chapters */
function reFactorChapters(mainContent)
{
    var j = 1; 
    for (var i = 0; i < mainContent.childNodes.length; i++) {	
        if(mainContent.childNodes[i].innerHTML != null) {
            if (mainContent.childNodes[i].title == 'guideChapter') {
                mainContent.childNodes[i].id = "doc_chap"+j;
                var x = 1;
                for (var z = 0; z < mainContent.childNodes[i].childNodes.length; z++) {
                    if (mainContent.childNodes[i].childNodes[z].title == 'guideSection') {
                        mainContent.childNodes[i].childNodes[z].id = "doc_chap"+j+"_sec"+x; 
                        x++;
                    }
                }
                j++;
            }
        }
    }
}



/* Adds a Section */
function addSection(sectionTitle) 
{
   
    var mainContent = getSel();

    while (mainContent.title != 'guideChapter') { 
        mainContent = mainContent.parentNode;
    }

    var insertText;
    insertText = '<p title="guideSectionTitle" class="secthead">';
    insertText += sectionTitle+'</p>';
    insertText += '<div title="guideBody"><div title="guideBlock"><p title="guideParagraph">Insert Content Here!</p></div></div>';

    var theSection = document.createElement("div");
    theSection.id = "doc_chap_sec";
    theSection.title = 'guideSection';
    theSection.innerHTML = insertText;
        
    var allowed = new Array("guideChapterTitle", "guideSection");
    
    var theAnchorNode = checkNodePath(getSel(), allowed);
    
    //This is basically insertAfter which Javascript doesn't have!
   
        mainContent.insertBefore(theSection, theAnchorNode.nextSibling);

    // Renumber the Chapters
    reFactorSections(mainContent);

    // Recreate the DOM tree
    createTree();

    // Set Cursor Focus to the Chapter - Not doing this now (bug in firefox!)
    //iframe.focus();

    // Scroll the Iframe to bring our chapter into view
    setFocus(theSection, true, 0)
}



/* Refactors Section Numbers after Creation/Deletion of Section */
function reFactorSections(mainContent)
{

    var the_length = mainContent.id.length;
    var last_char = mainContent.id.charAt(the_length-1);

    var j = 1; 
    for (var i = 0; i < mainContent.childNodes.length; i++) {	
        if(mainContent.childNodes[i].innerHTML != null) {
            if (mainContent.childNodes[i].title == 'guideSection') {	
                mainContent.childNodes[i].id = 'doc_chap'+last_char+'_sec'+j;
                j++;
            }
        }
    }	
}



/* Get the Current Selection from the Iframe */
function getSel() 
{
    var theSelection = iframe.getSelection();
    var theRange = theSelection.getRangeAt(0);
    return theRange.commonAncestorContainer;
}



/* Get the Anchor Node with the specified characteristics */
function getAnchor(nodeTitle, nodeId) 
{
    var theAnchorNode = getSel();

    while (theAnchorNode.title != nodeTitle) {
        if (theAnchorNode.id == nodeId) {
            break;
        }
        theAnchorNode = theAnchorNode.parentNode;
        if (theAnchorNode.id == 'sideContent') {
            alert('You cannot insert this type of a node here!');
            return;
        }
    }

    return theAnchorNode; 
}



/* Get the Specified Parent of a Given Node */
function getParent(parentTitle, node)
{
    var parent  = node.parentNode;

    while (parent.id != parentTitle) { 
        parent = parent.parentNode;
    }

    return parent;

}



/* Cleanup the body removing useless tags */
function cleanUp(theBody) 
{
    for (var i = 0; i < theBody.childNodes.length; i++) {
        var node = theBody.childNodes[i];
        if (node.nodeName.toLowerCase() == 'div')
        if (node.id == '')
        if (node.title == '')
        theBody.removeChild(node);
    }
}



/* Checks whether the given node title is a Block Type or not */
function checkBlock(title) 
{
    var elementList = new Array("guideParagraph", "guideBlock");

    for (var i = 0; i < elementList.length; i++) {
        if (title == elementList[i]) {
            return true;
        }
    }

    return false;

}



/* Creates our nifty DOM tree */
function createTree()
{
    var mainContent = iframe.document.getElementById("mainContent");

    var treeDisplay = document.getElementById("treeDisplay");

    //tree.innerHTML = content.id;

    var tree;

    tree = "<div>";

    for (var i = 0; i < mainContent.childNodes.length; i++) {
        if(mainContent.childNodes[i].innerHTML != null) {
            if (mainContent.childNodes[i].title == 'guideChapter') {
                for (var z = 0; z < mainContent.childNodes[i].childNodes.length; z++) {
                    if (mainContent.childNodes[i].childNodes[z].title == 'guideChapterTitle') {
                        var idc = "'"+mainContent.childNodes[i].id+"'";
                        var id = mainContent.childNodes[i].id;
                        tree += '<div class="trigger" id="t_'+id+'" onclick="showBranch('+idc+', true, this);">';
                        tree += '<img src="images/closed.gif" id="I'+id+'" name="I'+id+'"> ';
                        tree += '<span id="C_'+id+'">'+mainContent.childNodes[i].childNodes[z].innerHTML+'</span><br /></div>';
                        tree += '<div class="branch" id="'+id+'">';
                    }
                    if (mainContent.childNodes[i].childNodes[z].title == 'guideSection') {
                        section = mainContent.childNodes[i].childNodes[z];
                        var k = 0;
                        while (section.childNodes[k].title != 'guideSectionTitle') {
                            k++;
                        }
                        var qid = "'"+section.id+"'";
                        tree += '<p class="leaf"><img src="images/doc.gif">';
                        tree += '<a id="S_'+section.id+'" onclick="showBranch('+qid+');">'+section.childNodes[k].innerHTML+'</a><br /></p>';
                    }
                } 
                tree += '</div>';
            }
        }
    }

    tree += '</div>';
    //alert(tree);
    treeDisplay.innerHTML = tree;

}



/* Shows/Hides a branch in our nifty DOM tree */
function showBranch(branch, dflag)
{
    if (dflag != false) {
        iframe.document.getElementById(branch).scrollIntoView();

        var objBranch = document.getElementById(branch).style;
        if(objBranch.display=="block") {

            objBranch.display="none";
        }
        else {
            objBranch.display="block";

        }
        swapFolder('I' + branch);
    }
}



/* Swaps The Open/Close Folder Images in the Tree*/
function swapFolder(img)
{
    objImg = document.getElementById(img);
    if(objImg.src.indexOf('closed.gif')>-1)
        objImg.src = openImg.src;
    else
        objImg.src = closedImg.src;
}



// main function to process the fade request //
function colorFade(id,element,start,end,steps,speed) 
{
    var startrgb,endrgb,er,eg,eb,step,rint,gint,bint,step;
    var target = iframe.document.getElementById(id);
    steps = steps || 20;
    speed = speed || 20;
    clearInterval(target.timer);
    endrgb = colorConv(end);
    er = endrgb[0];
    eg = endrgb[1];
    eb = endrgb[2];
    if(!target.r) {
        startrgb = colorConv(start);
        r = startrgb[0];
        g = startrgb[1];
        b = startrgb[2];
        target.r = r;
        target.g = g;
        target.b = b;
    }
    rint = Math.round(Math.abs(target.r-er)/steps);
    gint = Math.round(Math.abs(target.g-eg)/steps);
    bint = Math.round(Math.abs(target.b-eb)/steps);
    if(rint == 0) { rint = 1 }
    if(gint == 0) { gint = 1 }
    if(bint == 0) { bint = 1 }
    target.step = 1;
    target.timer = setInterval( function() { animateColor(id,element,steps,er,eg,eb,rint,gint,bint) }, speed);
}



// incrementally close the gap between the two colors //
function animateColor(id,element,steps,er,eg,eb,rint,gint,bint) 
{
    var target = iframe.document.getElementById(id);
    var color;
    if(target.step <= steps) {
        var r = target.r;
        var g = target.g;
        var b = target.b;
        if(r >= er) {
            r = r - rint;
        } else {
            r = parseInt(r) + parseInt(rint);
        }
        if(g >= eg) {
            g = g - gint;
        } else {
            g = parseInt(g) + parseInt(gint);
        }
        if(b >= eb) {
            b = b - bint;
        } else {
            b = parseInt(b) + parseInt(bint);
        }
        color = 'rgb(' + r + ',' + g + ',' + b + ')';
        if(element == 'background') {
            target.style.backgroundColor = color;
        } else if(element == 'border') {
            target.style.borderColor = color;
        } else {
            target.style.color = color;
        }
        target.r = r;
        target.g = g;
        target.b = b;
        target.step = target.step + 1;
    } else {
        clearInterval(target.timer);
        color = 'rgb(' + er + ',' + eg + ',' + eb + ')';
        if(element == 'background') {
            target.style.backgroundColor = color;
        } else if(element == 'border') {
            target.style.borderColor = color;
        } else {
            target.style.color = color;
        }
    }
}



// convert the color to rgb from hex //
function colorConv(color) 
{
    var rgb = [parseInt(color.substring(0,2),16), 
    parseInt(color.substring(2,4),16), 
    parseInt(color.substring(4,6),16)];
    return rgb;
}




// Past this point: Debug functions, deprecated, etc. Maybe used later!
function tabs(view,hide) {
    if (view.style.visibility == "hidden") {

        if (view == document.getElementById("sourceview")) {
            document.getElementById("designTab").style.background = "url(images/editor-tab-design.png) top left no-repeat";
            document.getElementById("sourceTab").style.background = "url(images/editor-tab-source-select.png) top left no-repeat";
            view.style.width = "100px";

        }
        else if (view == document.getElementById("designview")) {
            document.getElementById("designTab").style.background = "url(images/editor-tab-design-select.png) top left no-repeat";
            document.getElementById("sourceTab").style.background = "url(images/editor-tab-source.png) top left no-repeat";
        }

        view.style.visibility = "visible";
        view.style.display = "block";
        hide.style.visibility = "hidden";
        hide.style.display = "none";
    }
}

function getHTML() {
    /*	var args='width=800,height=600,left=325,top=100,toolbar=0,';
    args+='location=0,status=0,menubar=0,scrollbars=1,resizable=0';

    var text = iframe.document.body.innerHTML;
    DialogWindow = window.open("","",args); 
    DialogWindow.document.open(); 
    DialogWindow.document.write('<a href="#" onclick="window.close();">Close</a><br />');
    DialogWindow.document.write('<textarea style="width: 770px; height: 600px;">'+text+'</textarea>');*/
    //document.getElementById("getHTML").value = iframe.document.body.innerHTML;
    alert('hello');

}

function getText(){
    var userSelection;
    if (iframe.getSelection) {
        userSelection = iframe.getSelection();
    }
    else if (iframe.document.selection) { // should come last; Opera!
        userSelection = iframe.document.selection.createRange();
    }
    return userSelection;
}

function junk() 
{
    if (e.keyCode == '8') 
    {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();

        //alert(start);
        /*if (start == 0)
        {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
        }

        else if(text == null)
        {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            }*/

            //var parent = text.parentNode;
        }

        // Handle Carriage Return
        else if (e.keyCode == '13')
        {
            //var node = text.parentNode;

            //if (node.title)

            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();


            /*if (start == end)
            {
                if ((end == text.length-1 || end == text.length))
                addParagraph(false);
                }*/

                //document.getElementById("status").innerHTML = status;

                /*		if (start == 0)
                {
                    var nodeText = text.parentNode.innerHTML;
                    alert(nodeText);
                    //addParagraph(false, text.parentNode.innerHTML);
                    //text.parentNode.innerHTML = "&nbsp;";
                }
                else if (end == text.length-1)
                addParagraph(false);
                else 
                {
                    addParagraph(false, text.parentNode.innerHTML.substring(start, text.length-1));

                    text.parentNode.innerHTML = text.parentNode.innerHTML.substring(0, start);

                    while (text.title != 'guideSection')
                    text = text.parentNode;
                    }*/
    }
    else 
    return;
}

function klick(e) 
{
    var theSelection = iframe.getSelection();
    var theRange = theSelection.getRangeAt(0);

    start = theRange.startOffset;
    end = theRange.endOffset;

    var text = theRange.commonAncestorContainer;

    var status = 'Status: title = '+text.title;
    status += ', startOffset = '+start;
    status += ', endOffset = '+end;
    status += ', nodeName = '+text.nodeName;
    status += ', nodeLength = '+text.length;

    document.getElementById("status").innerHTML = status;

    var status = 'Location: ';

    while (text.title != 'guideChapter')
    text = text.parentNode;

    if (text.title == 'guideChapter')
    {
        status += 'Chapter '+text.id.charAt(text.id.length-1)+' ';
    }

    text = theRange.commonAncestorContainer;

    while (text.title != 'guideSection')
    text = text.parentNode;

    if (text.title == 'guideSection')
    {
        status += ', Section: '+text.id.charAt(text.id.length-1);
    }

    document.getElementById("location").innerHTML = status;
}
