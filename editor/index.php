<?php

$beaconDoneLoad = true;

$errors = "<p>Following Errors Occured:</p>";

// Check for conf file
if (file_exists(dirname(__FILE__).'/conf')) {
    require_once dirname(__FILE__).'/conf';
} else {
    $errors .= "<p>- <code>conf</code> file not found. Please create one.</p>";
    $beaconDoneLoad = false;
}

// Check for language file
if (file_exists(dirname(__FILE__).'/i18n/'.$conflang.'.xml')) {
    $theXML = DOMDocument::load(dirname(__FILE__).'/i18n/'.$conflang.'.xml');
} else {
    $errors .= "<p>- <code>i18n/".$conflang.".xml</code> file not found. Please get your translated XML copy.</p>";
    $beaconDoneLoad = false;
}

// If some error occured then inform user and stop execution
if (!$beaconDoneLoad) {
    echo $errors;
    return false;
}

// Start loading text
$version = $theXML->getElementsByTagName('version')->item(0)->nodeValue;
$welcome = $theXML->getElementsByTagName('welcome')->item(0)->nodeValue;

?>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $conflang; ?>">
<head>
    <title>Beacon v<?php echo $version; ?></title>
    <meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
    <meta name="author" content="Anant Narayanan" />
	<meta name="author" content="Nandeep Mali" />
    <meta name="description" content="Beacon: The GuideXML Editor" />
    <link rel="stylesheet" href="css/editor.css" type="text/css" media="screen" />    
    <link rel="stylesheet" href="css/pagestyle.css" type="text/css" media="screen" />    
    

    <?php if ($confdojo == 'local') { ?>
    	<style type="text/css">
    	        @import "js/dojoroot/dijit/themes/tundra/tundra.css";
    	        @import "js/dojoroot/dojo/resources/dojo.css";
    	</style>
        <script type="text/javascript" src="js/dojoroot/dojo/dojo.js"
    		djConfig="isDebug: false, parseOnLoad: true"></script>
	<?php } else if ($confdojo == 'remote') { ?>
	    <style type="text/css">
            @import "http://o.aolcdn.com/dojo/1.0.0/dijit/themes/tundra/tundra.css";
            @import "http://o.aolcdn.com/dojo/1.0.0/dojo/resources/dojo.css";
        </style>
        <script type="text/javascript" src="http://o.aolcdn.com/dojo/1.0.0/dojo/dojo.xd.js" 
            djConfig="parseOnLoad: true"></script>
	<?php } ?>

	<script language="JavaScript" type="text/JavaScript" src="js/index.js"></script>

</head>

<body class="tundra">

    <div id="container">

        <div id="header">
            <img src="images/editor-title.png" alt="Beacon | The GuideXML Editor" border="none">
        </div>

        <div id="content">
            <div id="left">
                <div id="lpanel">
                      <div style="text-align: center;">
                         <img src="images/beacon-logo.jpg" alt="Beacon" />
                      </div>
                      <p><?php echo $welcome; ?></p>
                      <ul>
                        <li><a class="op" onclick="dijit.byId('form').setHref('new-form.php')"><span>&gt; New Document</span></a></li>
                        <li><a class="op" onclick="dijit.byId('form').setHref('edit-form.php')"><span>&gt; Edit a Document</span></a></li>
                        <li><a class="op" onclick="dijit.byId('form').setHref('collab-form.php')"><span>&gt; Collaborate!</span></a></li>
                      </ul> 
                  </div>
            </div>
            <div id="right">
                <div id="rpanel">
            	    <div preload="true" id="form" dojoType="dijit.layout.ContentPane">
		                <div id="initial">Select a task.</div>
		            </div>
		        </div>
		
		    </div>
        </div>

    </div>


</body>
</html>
