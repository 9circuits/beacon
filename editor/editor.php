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
                    <p class="treeheader">Document Tree: </p>
                    <div id="treeDisplay">
                    </div>
                </div>
            </div>

            <div id="right">
                	
                <div id="designview" >
                    <div class="toolbar">
                            <div class="toolholder">
                                <a id="getSource" class="lbOn" href="dialogs/sourceview.php">
                                    <img src="images/sourceview.png" border="none" />
                                </a>
                                <div class="separator"></div>
                                <a class="lbOn" href="dialogs/addchapter.php">
                                    <img src="images/chapter.png" border="none" title="Chapter" />
                                </a> 
                                <a class="lbOn" href="dialogs/addsection.php">
                                    <img src="images/section.png" border="none" title="Section" />
                                </a>
                                <div class="separator"></div>
                                <a class="button" id="ol" onClick="execute(this, 'ol');" title="Ordered List">
                                    <img src="images/ol.png" border="none" />
                                </a>
                                <a class="button" id="ul" onClick="execute(this, 'ul');" title="Unordered List">
                                    <img src="images/ul.png" border="none" />
                                </a>
                                 <div class="separator"></div>
                                <a class="button" id="code" onClick="execute(this, 'code');" title="Code Listing">
                                    <img src="images/code.png" border="none" />
                                </a>
                                <div class="separator"></div>
                                <a class="button" name="guideNoteValue" title="Note" id="note" onClick="execute(this, 'note');">
                                    <img src="images/note.png" border="none" />
                                </a>
                                <a class="button" name="guideImpoValue" title="Important" id="impo" onClick="execute(this, 'impo');">
                                    <img src="images/impo.png" border="none" />
                                </a>
                                <a class="button" name="guideWarnValue" title="Warning" id="warn" onClick="execute(this, 'warn');">
                                    <img src="images/warn.png" border="none" />
                                </a>
                                <div class="separator"></div>
                                <a class="button" id="paragraph" onClick="execute(this, 'paragraph');" title="Paragraph">
                                    <img src="images/paragraph.png" border="none" />
                                </a>
                                <div class="separator"></div>
                                <a class="button" id="delete" onClick="deleteNode();" title="Delete Current Node">
                                    <img src="images/cancel.png" border="none" />
                                </a>
                            </div>
                            <div class="toolholder">
                                <a class="button" id="bold" onClick="execute(this, null);" title="Bold (Ctrl+B)">
                                    <img src="images/bold.png" border="none" />
                                </a>
                                <a class="button" id="italic" onClick="execute(this, null);" title="Italic (Ctrl+I)">
                                    <img src="images/italic.png" border="none" />
                                </a>
                                <div class="separator"></div>
                                <a class="button" id="subscript" onClick="execute(this, null);" title="Subscript">
                                    <img src="images/sub.png" border="none" />
                                </a>    
                                <a class="button" id="superscript" onClick="execute(this, null);" title="Superscript">
                                    <img src="images/sup.png" border="none" />
                                </a>
                                <div class="separator"></div>
                                 <a id="addLink" class="lbOn" href="dialogs/addlink.php" title="Link">
                                        <img src="images/link.png" border="none" />
                                </a>
                                <a class="button" id="unlink" onClick="removeLink()" title="Unlink">
                                    <img src="images/unlink.png" border="none" />
                                </a>
                            </div>
                    </div>

                    <iframe onclick="klick(event);" class="iframe" src="tmp/gethtml.php?id=<?php echo $_REQUEST['id']; ?>" id="design">
                    </iframe>

                    <div class="statusbar">
                        <p><span id="location"></span><span id="status"></span></p>
                    </div>

                </div>

            </div>	

        </div>

    </div>

</body>


</html>
















