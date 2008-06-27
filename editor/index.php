<?php

$theXML = DOMDocument::load('xml/default-config.xml');
$metadata = $theXML->getElementsByTagName('metadata');
$metadata = $metadata->item(0);
$errorIcon = $metadata->getAttribute('errorIcon');
$cancelIcon = $metadata->getAttribute('cancelIcon');
$cancelLabel = $metadata->getAttribute('cancelLabel');
$fields = $metadata->getElementsByTagName('field');

$version = $theXML->getElementsByTagName('version');
$version = $version->item(0)->nodeValue;

?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>Beacon v<?php echo $version; ?></title>
    <meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
    <meta name="author" content="Anant Narayanan" />
	<meta name="author" content="Nandeep Mali" />
    <meta name="description" content="Beacon: The GuideXML Editor" />
    <link rel="stylesheet" href="css/pagestyle.css" type="text/css" media="screen" />

	<style type="text/css">
	        @import "js/dojoroot/dijit/themes/tundra/tundra.css";
	        @import "js/dojoroot/dojo/resources/dojo.css";
	</style>
    <script type="text/javascript" src="js/dojoroot/dojo/dojo.js"
		djConfig="isDebug: false, parseOnLoad: true"></script>
    <script type="text/javascript">
       	dojo.require("dojo.parser");
    	dojo.require("dijit.form.ValidationTextBox");
    	dojo.require("dijit.form.CheckBox");
    	dojo.require("dijit.form.DateTextBox");
        dojo.require("dijit.layout.ContentPane");
		dojo.require("dijit.form.Textarea");
    </script>

	<script language="javascript" type="text/javascript">



	function stopUpload(val){
	     
		  document.getElementById('var').value = val;
	      return true;   
	}

	</script>

</head>

<body class="tundra">
	<div id="container">
		<div id="header">
			
		</div>

		<div id="content">
			<div id="left">
				<a href="#" class="newlink" onclick="dijit.byId('form').setHref('new-form.php')"></a>
				<div class="breaker"></div>
				<a href="#" class="editlink" onclick="dijit.byId('form').setHref('edit-form.php')"></a>
				<div class="breaker"></div>
				<!--<a href="#" class="recentlink"></a>
				<div class="breaker"></div>-->
			</div>
			
			<div id="right">
				<div preload="true" id="form" dojoType="dijit.layout.ContentPane">
		                <div id="initial">Select a task.</div>
		        </div>
		
		
				
			</div>
			
			
		</div>
	</div>
</body>
</html>
