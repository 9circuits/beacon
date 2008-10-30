<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<title>Beacon</title>

		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
       	
        <link rel="stylesheet" href="css/main.css" type="text/css" />
        <link rel="stylesheet" href="css/ui.tabs.css" type="text/css" media="print, projection, screen" />
        <link rel="stylesheet" href="css/jgrowl.css" type="text/css" />
		<link rel="stylesheet" href="css/modal.css" type="text/css" />
      
</head>

<body>

    <!-- 
    Leave the container Empty. 
    This is a sample container. 
    You can name your container anything.
    But do set the required option. 
    -->
    <div id="container">
    </div>
    
    <!-- Better to load all javascript at the bottom of the page-->
    <script src="js/jquery-1.2.6.js" type="text/javascript"></script>        
    <script src="js/Beacon.js" type="text/javascript"></script>
    <script type="text/javascript">
        
        $(document).ready(function() {  
            // Holds basic Beacon Config.
            // These options allow you to customize
            // Beacon's rendering, plugins and other stuff.
            // For all list of configs view the Documentation
            var opts = {
                // Set the display container.
                // If setting this then make sure you set the 
                // isRoot option below
                container: "#container",
                
                // Is the above container the only container in the page.
                // If true then Beacon will grab the whole of the page.
                // If false then make sure the height and width are set
                // in absolute numbers instead of relative
                // i.e. in 'px' instead of '%' !Very Important
                isRoot: true,
                
                // Set the language.
                // Will load the text on initialization
                // Make sure the server side has the corresponding 
                // Language Pack.
                lang: "en_US",
                
                // Choose the plugins to be loaded.
                // These plugins should be present in the 
                // /beacon/plugin directory.
                plugins: ["guidexml", "po"],
                
                // The intro content to be displayed.
                // The default welcome will display the content
                // from this page.
                intro: "dialogs/intro.php",
                
            };
            
            var beacon = new Beacon(opts);
            // And we are done... ^_^
            
        });
        
    </script>
    
</body>
</html>
