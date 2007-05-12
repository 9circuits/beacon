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
    <meta name="description" content="Beacon: The GuideXML Editor" />
    <link rel="stylesheet" href="css/index.css" type="text/css" media="screen" />
    <script type="text/javascript" src="js/mochikit/uncomp/MochiKit.js"></script>
    <script type="text/javascript" src="js/mochikit/uncomp/Base.js"></script>
    <script type="text/javascript" src="js/mochikit/uncomp/New.js"></script>
    <script type="text/javascript" src="js/mochikit/uncomp/Visual.js"></script>
    <script type="text/javascript" src="js/mochikit/uncomp/Signal.js"></script>
</head>
<body>
    <div id="loading"><img src="images/loading.gif"/><br/>Loading</div>
    <div id="logo" align="center"><img src="images/logo.png"/></div>
    <div id="centre">The GuideXML Editor</div>
    <div id="newbox" class="box"><img src="images/new.png"/>&nbsp;&nbsp;Create a New Document</div>
    <div id="gobox" class="box"><img src="images/go.png"/><br/>Go!</div>
    <div id="editbox" class="box"><img src="images/edit.png"/>&nbsp;&nbsp;Edit an Existing Document</div>
      
    <div id="newmenu" class="menu">
        <div id="newform" class="aform">
            <form name="newform" action="ajax/new.php" method="POST">
                <table>
                <?php
                    for ($i = 0; $i < $fields->length; $i++) {
                        $field = $fields->item($i);
                        $icon = $field->getAttribute('icon');
                        $guide = $field->getAttribute('guide');
                        $label = $field->getAttribute('label');
                        $fnote = $field->getAttribute('fnote');
                        $caption = $field->getAttribute('caption');
                        
                        echo "\n<tr>";
                        echo "\n\t<td>".'<img src="images/'.$icon.'"/></td>';
                        echo "\n\t<td>".$label.'</td>';

                        switch ($guide) {
                        case 'abstract' : echo "\n\t<td>".'<textarea name="'.$guide.'"></textarea></td>';
                                          break;
                        default         : echo "\n\t<td>".'<input name="'.$guide.'" type="text"/></td>';
                        }
                        
                        echo "\n\t<td>".'<div id="'.$guide.'error" class="error"><img src="images/'.$errorIcon.'"/></div></td>';
                        echo "\n\t<td>".$caption.'. '.$fnote.'.</td>';
                        echo "\n</tr>";
                    }
                ?>
                </table>
            </form>
            <div id="newclose" class="cancel">
                <img src="images/<?php echo $cancelIcon; ?>"/><br/><?php echo $cancelLabel; ?>
            </div> 
        </div>
    </div>
    
    <div id="editmenu" class="menu">
        <div id="edit" class="aform">
            <form enctype="multipart/form-data" name="editform" action="ajax/new.php" method="POST">
                <input type="hidden" name="isedit" value="1"/>
                <input type="hidden" name="MAX_FILE_SIZE" value="102400"/>
                Select File:<br/><input name="xmlf" type="file"/>
            </form>
        <div id="editclose" class="cancel"><img src="images/cancel.png"/><br/>Cancel</div>
    </div>
    <script type="text/javascript" src="js/index.js"></script>
</body>
</html>
