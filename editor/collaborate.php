<?php

if ($_GET['id'] == '')
{
    //echo 'Boohoo! No File selected???';
    header('Location: index.php');
}

$beaconDoneLoad = false;

$errors = "<p>Following Errors Occured:</p>";

if (file_exists(dirname(__FILE__).'/conf')) {
    require_once dirname(__FILE__).'/conf';
    $beaconDoneLoad = true;
}
else {
    $errors .= "<p>- <code>conf</code> file not found. Please create one.</p>";
    $beaconDoneLoad = false;
}

if (file_exists(dirname(__FILE__).'/i18n/'.$conflang.'.xml')) {
    $theXML = DOMDocument::load(dirname(__FILE__).'/i18n/'.$conflang.'.xml');
    $beaconDoneLoad = true;
}
else {
    $errors .= "<p>- <code>i18n/".$conflang.".xml</code> file not found. Please get your translated XML copy.</p>";
    $beaconDoneLoad = false;
}


if (!$beaconDoneLoad) {
    echo $errors;
    return false;
}

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

    <!--<script language="Javascript" type="text/javascript" src="js/edit_area/edit_area_full.js"></script>
    <link rel="stylesheet" href="css/lightbox.css" type="text/css" />
    <script language="JavaScript" src="js/prototype.js" type="text/javascript"></script>
    <script language="JavaScript" src="js/lightbox.js" type="text/javascript"></script>-->

    <script language="JavaScript" type="text/JavaScript" src="js/collaborate.js"></script>
    <script language="JavaScript" src="js/prototype.js" type="text/javascript"></script>    
    
</head>

<body class="tundra">

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
                <div id="console">
                    <p class="userheader">Currently Editing Users: </p>
                    <div id="userDisplay">
                        
                    </div>
                    <div id="logs">
                        <p class="userheader">Log:</p>  
                        <textarea id="logDisplay" class="logview" readonly="true"></textarea>
                    </div>
                    <div id="textbox">  
                        <p class="userheader">Chat:</p>  
                        <form onsubmit="submitChat(this); return false;">
                            <p><input id="chattext" type="text" name="chattext" /></p>
                            <p><input type="submit" id="chatSubmit" value="Send" /></p>
                        </form>
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
















