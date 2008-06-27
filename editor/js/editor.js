var openImg = new Image();
openImg.src = "images/open.gif";
var closedImg = new Image();
closedImg.src = "images/closed.gif";

var src;

/*editAreaLoader.init({
	id: "source"	// id of the textarea to transform		
	,start_highlight: true	// if start with highlight
	,allow_resize: "no"
	,allow_toggle: false
	,language: "en"
	,syntax: "brainfuck"	
});*/

function initEditor() 
{
	//document.getElementById("design").contentWindow.document.body.contentEditable = true;
	document.getElementById("design").contentWindow.document.designMode = 'On'; 
	document.getElementById("design").contentWindow.document.getElementById("guide").style.margin = '5px';

	if (document.addEventListener)
    {
       document.getElementById("design").contentWindow.document.addEventListener("keydown",keydown,false);
    }
 	else if (document.attachEvent)
    {
       document.getElementById("design").contentWindow.document.attachEvent("onkeydown", keydown);
    }
    else
    {
       document.getElementById("design").contentWindow.document.onkeydown = keydown;
    }
	
	createTree();
	
	document.body.style.overflow = 'hidden';

}

function keydown(e)
{
	
	if (!e) e = event;
	
	if (e.keyCode == '8') 
	{
	
		var theSelection = document.getElementById("design").contentWindow.getSelection();
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
		
		if (start == 0 || text.length == null)
		{
			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
		}

		else
		{
		}

		var parent = text.parentNode;
	}

	else if (e.keyCode == '13')
	{
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();
		
		addParagraph();
	}
	return;
}

/* Set the focus of the cursor to the given node. Currently working only in Safari! */
function setFocus(node, flag) 
{
	s = document.getElementById("design").contentWindow.getSelection();
	var r1 = document.getElementById("design").contentWindow.document.createRange();
	r1.setStart(node, 0);
	r1.setEnd(node, 0);
	//r1.selectNode(node);
	//r1.setStartBefore(node.childNodes[1]);
	
	s.removeAllRanges(); 
	//r1.startOffset = 0;
	s.addRange(r1);

	document.getElementById("design").contentWindow.focus();
}

function checkPre() {
	
}

function getCurrentNode()
{
	var elementList = new Array("guideChapterTitle", "guideSectionTitle");
}





// Past this point: Completed functions

/* Built in browser exec command running BLAH BLAH BLAH! Will get replaced by self written functions */
function execute(command, value) 
{
	if (value == null) 
	{
		document.getElementById("design").contentWindow.document.execCommand(command.id, false, null);
	}
	else if (value == 'note' || value == 'impo' || value == 'warn')
	{
		addNote(command, value);
	}
	else if (value == 'chapter')
	{
		addChapter();
	}
	else if (value == 'section')
	{
		addSection();
	}
	else if (value == 'paragraph')
	{
		addParagraph();
	}
	else if (value == 'code')
	{
		addCode();
	}
	else if (value == 'ol' || value == 'ul')
	{
		addList(value);
	}
}



/* Adds Note/Warn/Impo */
function addNote(command, value) 
{
	
	var insertText, pTitle, spanTitle, bgColor, spanText, pClass, bText;
	spanTitle = command.name;
	bText = command.value;
	pClass = value;
	spanText = 'Insert '+command.value+' Here';
	pTitle = 'guide'+command.value;
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

	addBlockType(getSel(), getSel(), insertText);
}



/* Adds a Code Listing */
function addCode() 
{
	var insertText;
	insertText = '<div title="guidePreHeader" class="codetitle" style="background: #7a5ada; margin: 0px;">';
	insertText += 'Code Listing: <span title="guidePreTitle">Sample Caption</span></div>';
	insertText += '<div title="guidePreCode" style="background: #eeeeff;">';
	insertText += '<pre title="guideCodeBox">Insert Code Here</pre></div>';
	
	addBlockType(getSel(), getSel(), insertText);
}



/* Adds a List (Ordered/Unordered) */
function addList(value) 
{
	var insertText;
	insertText = "<li>Sample List Item</li>";
	addBlockType(getSel(), getSel(), insertText, value);
}



/* Adds a Paragraph */
function addParagraph()
{
	var insertText;
	insertText = '&nbsp;';
	
	return addBlockType(getSel(), getSel(), insertText, 'para');
}



/* Add a block type element. Includes: Paragraph, List, Note/Warn/Impo, Pre. Not called directly!*/
function addBlockType(theAnchorNode, theBody, insertText, type)
{
	var insert = 0;
	
	while (theBody.title != 'guideBody')
	{
		theBody = theBody.parentNode;
	}
	
	cleanUp(theBody);
	
	while (checkBlock(theAnchorNode.title) != true)
	{
		theAnchorNode = theAnchorNode.parentNode;
		insert = 1;
		
		if (theAnchorNode == null){
			insert = 0;
			break;
		}
		if (theAnchorNode != null)
			if (theAnchorNode.id == 'sideContent') {
				alert('You cannot insert Here!');
				return;
			}
	}

	if (type == "para")
	{
		var newNode = document.createElement('p');
		newNode.title = 'guideParagraph';
	}
	
	else if (type == 'ol' || type == 'ul')
	{
		var newNode = document.createElement(type);
		newNode.title = 'guideBlock';
	}
	
	else 
	{
		var newNode = document.createElement('div');
		newNode.title = 'guideBlock';
	}

	newNode.innerHTML = insertText;
		
	if (insert == 1)
		theBody.insertBefore(newNode, theAnchorNode.nextSibling);
	else
		theBody.appendChild(newNode);	
		
	setFocus(newNode, false); 
	
		
	return newNode;
}



/* Adds a Chapter */
function addChapter() 
{
	var theAnchorNode = getAnchor('guideChapter', 'doc_chap0');
	var mainContent = getParent('mainContent', theAnchorNode);

	var insertText;
	insertText = '<p title="guideChapterTitle" class="chaphead">';
	insertText += 'Sample Chapter Title</p>';
	insertText += '<div id="doc_chap_sec1" title="guideSection"><p title="guideSectionTitle" class="secthead">';
	insertText += 'Sample Section Title</p>';
	insertText += '<div title="guideBody"><p title="guideParagraph">Insert Content Here!</p></div></div>';

	var theChapter = document.createElement("div");
	theChapter.id = "doc_chap";
	theChapter.title = 'guideChapter';
	theChapter.innerHTML = insertText;
	
	//This is basically insertAfter which Javascript doesn't have!
	mainContent.insertBefore(theChapter, theAnchorNode.nextSibling);
	
	// Renumber the Chapters
	reFactorChapters(mainContent);
	
	// Recreate the DOM tree
	createTree();
	
	// Set Cursor Focus to the Chapter - Not doing this now (bug in firefox!)
	//document.getElementById("design").contentWindow.focus();
	
	// Scroll the Iframe to bring our chapter into view
	theChapter.scrollIntoView();
}



/* Refactors Chapter Numbers after Creation/Deletion of Chapters */
function reFactorChapters(mainContent)
{
	var j = 1; 
	for (var i = 0; i < mainContent.childNodes.length; i++)
	{	
		if(mainContent.childNodes[i].innerHTML != null)
		{
			if (mainContent.childNodes[i].title == 'guideChapter')
			{
				mainContent.childNodes[i].id = "doc_chap"+j;
				var x = 1;
				for (var z = 0; z < mainContent.childNodes[i].childNodes.length; z++)
				{
					if (mainContent.childNodes[i].childNodes[z].title == 'guideSection')
					{
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
function addSection() 
{
	var theAnchorNode = getAnchor('guideSection', 'doc_chap_sec0');
	var mainContent = theAnchorNode.parentNode;
	
	while (mainContent.title != 'guideChapter')
	{ 
		mainContent = mainContent.parentNode;
	}
	
	var insertText;
	insertText = '<p title="guideSectionTitle" class="secthead">';
	insertText += 'Sample Section Title</p>';
	insertText += '<div title="guideBody"><p title="guideParagraph">Insert Content Here!</p></div>';

	var theSection = document.createElement("div");
	theSection.id = "doc_chap_sec";
	theSection.title = 'guideSection';
	theSection.innerHTML = insertText;

	//This is basically insertAfter which Javascript doesn't have!
	mainContent.insertBefore(theSection, theAnchorNode.nextSibling);
	
	// Renumber the Chapters
	reFactorSections(mainContent);
	
	// Recreate the DOM tree
	createTree();
	
	// Set Cursor Focus to the Chapter - Not doing this now (bug in firefox!)
	//document.getElementById("design").contentWindow.focus();
	
	// Scroll the Iframe to bring our chapter into view
	theSection.scrollIntoView();
}



/* Refactors Section Numbers after Creation/Deletion of Section */
function reFactorSections(mainContent)
{
	
	var the_length = mainContent.id.length;
	var last_char = mainContent.id.charAt(the_length-1);
	
	var j = 1; 
	for (var i = 0; i < mainContent.childNodes.length; i++)
	{	
		if(mainContent.childNodes[i].innerHTML != null)
		{
			if (mainContent.childNodes[i].title == 'guideSection')
			{	
				mainContent.childNodes[i].id = 'doc_chap'+last_char+'_sec'+j;
				j++;
			}
		}
	}	
}



/* Get the Current Selection from the Iframe */
function getSel() 
{
	var theSelection = document.getElementById("design").contentWindow.getSelection();
	var theRange = theSelection.getRangeAt(0);
	return theRange.commonAncestorContainer;
}



/* Get the Anchor Node with the specified characteristics */
function getAnchor(nodeTitle, nodeId) 
{
	var theAnchorNode = getSel();

	while (theAnchorNode.title != nodeTitle)
	{
		if (theAnchorNode.id == nodeId)
		{
			break;
		}
		theAnchorNode = theAnchorNode.parentNode;
		if (theAnchorNode.id == 'sideContent') 
		{
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
	
	while (parent.id != parentTitle)
	{ 
		parent = parent.parentNode;
	}
	
	return parent;
	
}



/* Cleanup the body removing useless tags */
function cleanUp(theBody) 
{
	for (var i = 0; i < theBody.childNodes.length; i++)
	{
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
	
	for (var i = 0; i < elementList.length; i++)
	{
		if (title == elementList[i])
		{
			return true;
		}
	}
	
	return false;
	
}



/* Creates our nifty DOM tree */
function createTree()
{
	var mainContent = document.getElementById("design").contentWindow.document.getElementById("mainContent");
	
	var treeDisplay = document.getElementById("treeDisplay");
	
	//tree.innerHTML = content.id;
	
	var tree;
	
	tree = "<div>";
	
	for (var i = 0; i < mainContent.childNodes.length; i++)
	{
		if(mainContent.childNodes[i].innerHTML != null)
		{
			if (mainContent.childNodes[i].title == 'guideChapter')
			{
				for (var z = 0; z < mainContent.childNodes[i].childNodes.length; z++)
				{
					if (mainContent.childNodes[i].childNodes[z].title == 'guideChapterTitle')
					{
						var idc = "'"+mainContent.childNodes[i].id+"'";
						var id = mainContent.childNodes[i].id;
						tree += '<div class="trigger" onclick="showBranch('+idc+');">';
						tree += '<img src="images/closed.gif" id="I'+id+'" name="I'+id+'"> ';
						tree += mainContent.childNodes[i].childNodes[z].innerHTML+'<br /></div>';
						tree += '<div class="branch" id="'+id+'">';
					}
					if (mainContent.childNodes[i].childNodes[z].title == 'guideSection')
					{
						section = mainContent.childNodes[i].childNodes[z];
						var k = 0;
						while (section.childNodes[k].title != 'guideSectionTitle')
						{
							k++;
						}
						var qid = "'"+section.id+"'";
						tree += '<p class="leaf"><img src="images/doc.gif">';
						tree += '<a onclick="showBranch('+qid+');">'+section.childNodes[k].innerHTML+'</a><br /></p>';
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
function showBranch(branch)
{
	
	
	document.getElementById("design").contentWindow.document.getElementById(branch).scrollIntoView();
	
	//document.body.style.overflow = 'visible';
	
	var objBranch = document.getElementById(branch).style;
	if(objBranch.display=="block")
		objBranch.display="none";
	else {
		objBranch.display="block";
	}
	swapFolder('I' + branch);
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
	document.getElementById('htmlDisplay').value = document.getElementById("design").contentWindow.document.body.innerHTML;
}

function getText(){
	var userSelection;
	if (document.getElementById("design").contentWindow.getSelection) {
		userSelection = document.getElementById("design").contentWindow.getSelection();
	}
	else if (document.getElementById("design").contentWindow.document.selection) { // should come last; Opera!
		userSelection = document.getElementById("design").contentWindow.document.selection.createRange();
	}
	return userSelection;
}


