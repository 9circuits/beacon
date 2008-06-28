<?php

if ($_GET['id'] == '')
{
	//echo 'Boohoo! No File selected??? Press the back button and try again!';
	header('Location: index.php');
}
require_once 'conf';
$theXML = DOMDocument::load('xml/default-config.xml');
$version = $theXML->getElementsByTagName('version');
$version = $version->item(0)->nodeValue;
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
            "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Beacon v<?php echo $version; ?></title>

 
<link rel="stylesheet" href="css/editor.css" type="text/css" media="screen" />

<script language="Javascript" type="text/javascript" src="js/edit_area/edit_area_full.js"></script>
<link rel="stylesheet" href="css/lightbox.css" type="text/css" />
<script language="JavaScript" src="js/prototype.js" type="text/javascript"></script>
<script language="JavaScript" src="js/lightbox.js" type="text/javascript"></script>

<script language="JavaScript" type="text/JavaScript" src="js/editor.js"></script>


</head>

<body class="tundra" onload="initEditor();">

	<div id="container">

		<div id="header">
			<div id="nav">
				<ul>
					<li><img src="images/editor-title.png" alt="Beacon | The GuideXML Editor" border="none"></li>
			        <!--<li id="nav01"><a href="#"><span>Create a new Document</span></a></li>
					<li id="nav02"><a href="#"><span>Edit a Document</span></a></li> -->
		    	</ul>
			</div>
		</div>

		<div id="content">
			
			<div id="left">
				
				<div id="tree">
					<p class="header">Document Tree: </p>
					<div id="treeDisplay">
					</div>
				</div>
				
				
			</div>
			
			<div id="right">	
					
					<div id="designview" >

					<div class="toolbar">
					<a class="lbOn" href="dialogs/sourceview.html">Get Source</a> 
					<input class="button" type="button" value="Get Text" onClick="alert(getText());" />
					<hr />

					<a class="lbOn" href="dialogs/addchapter.html">Add Chapter</a> 
					<a class="lbOn" href="dialogs/addsection.html">Add Section</a> 
					<span class="separator">|</span>
					<input class="button" type="button" value="Insert Paragraph" id="paragraph" onClick="execute(this, 'paragraph');" />
					<span class="separator">|</span>
					<input class="button" type="button" value="Insert Code Listing" id="code" onClick="execute(this, 'code');" />
					<span class="separator">|</span>
					<input class="button" type="button" value="Ordered List" id="ol" onClick="execute(this, 'ol');" />
					<input class="button" type="button" value="Unordered List" id="ul" onClick="execute(this, 'ul');" />
					<hr />

					<input class="button" type="button" value="Bold" id="bold" onClick="execute(this, null);" />
					<input class="button" type="button" value="Emphasis" id="italic" onClick="execute(this, null);" />
					<span class="separator">|</span>
					<input class="button" type="button" value="&lt;sub&gt;" id="subscript" onClick="execute(this, null);"/>
					<input class="button" type="button" value="&lt;sup&gt;" id="superscript" onClick="execute(this, null);" />
					<span class="separator">|</span>
					<input class="button" type="button" name="guideNoteValue" value="Note" id="note" onClick="execute(this, 'note');" />
					<input class="button" type="button" name="guideWarnValue" value="Warning" id="warning" onClick="execute(this, 'warn');" />	
					<input class="button" type="button" name="guideImpoValue" value="Important" id="Important" onClick="execute(this, 'impo');" />
					<span class="separator">|</span>
					</div>

					<iframe onclick="klick(event);" class="iframe" src="tmp/gethtml.php?id=<?php echo $_REQUEST['id']; ?>" id="design">
					</iframe>

					<div class="statusbar">
						<p><span id="location"></span> | <span id="status"></span></p>
					</div>

					</div>
			
			</div>	
			
		</div>

	</div>
	
</body>


</html>
















