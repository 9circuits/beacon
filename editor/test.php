<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<title>GuideXML plugin</title>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <link rel="stylesheet" href="css/main.css" type="text/css" />
     
     <style>
         * {margin: 0; padding: 0; }

        html, body {height: 100%; margin: 0; padding: 0; font-family: "Trebuchet MS", "Arial";}

        #container {
            height: 100%;
            border: 1px solid #000;
        }
     </style> 	
</head>

<body>
    
    <div id="container">
    </div>
    
    <!-- Better to load all javascript at the bottom of the page-->
    <script src="js/jquery-1.2.6.js" type="text/javascript"></script>        
    <script src="js/BeaconAPI.js" type="text/javascript"></script>
    <script src="js/Beacon.js" type="text/javascript"></script>
    
    <script src="plugins/guidexml/js/guidexml.js" type="text/javascript"></script>
    
    <script type="text/javascript">
        $(document).ready(function() {  
            guidexml("#container", "NEW");
        });        
    </script>
    
</body>
</html>
