<?php

if ($_GET['id'] == '')
{
    //echo 'Boohoo! No File selected???';
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
                        <?php require_once 'toolbar.php'; ?>
                    </div>

                    <iframe onclick="klick(event);" class="iframe" src="ajax/gethtml.php?id=<?php echo $_REQUEST['id']; ?>" id="design">
                    </iframe>

                    <div class="statusbar">
                        <p>
                            <span id="savedStatus"></span><br />
                            <span id="location"></span><span id="status"></span>
                        </p>
                    </div>

                </div>

            </div>	

        </div>

    </div>

</body>


</html>
















