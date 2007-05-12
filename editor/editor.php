<?php

require_once 'conf';

$theXML = DOMDocument::load('xml/default-config.xml');

$tools = $theXML->getElementsByTagName('tools');
$tools = $tools->item(0);
$toolLabel = urlencode($tools->getAttribute('label'));
$toolIcon  = urlencode($tools->getAttribute('icon'));
$fields = $tools->getElementsByTagName('field');

$tree = $theXML->getElementsByTagName('tree');
$tree = $tree->item(0);
$treeLabel = $tree->getAttribute('label');
$treeIcon  = $tree->getAttribute('icon');

$tabs = $theXML->getElementsByTagName('tab');
$hTab = $tabs->item(0);
$sTab = $tabs->item(1);

$footer = $theXML->getElementsByTagName('footer');
$footer = $footer->item(0);
$footerText = $footer->nodeValue;

$version = $theXML->getElementsByTagName('version');
$version = $version->item(0)->nodeValue;

$getHtml = $confurl."ajax/document.php?id=".$_REQUEST['id']."&action=get";
$getXml  = $confurl."ajax/document.php?id=".$_REQUEST['id']."&action=getXml";
$getTree = $confurl."ajax/document.php?id=".$_REQUEST['id']."&action=getTree";

?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>Beacon v<?php echo $version; ?></title>
    <meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
    <meta name="author" content="Anant Narayanan" />
    <meta name="description" content="Beacon - Editor Screen" />
    <link rel="stylesheet" href="css/editor.css" type="text/css" media="screen" />
    <script type="text/javascript" src="js/dojo/dojo.js"></script>
    <script language="JavaScript" type="text/javascript">
	    dojo.require("dojo.widget.LayoutContainer");
	    dojo.require("dojo.widget.ContentPane");
	    dojo.require("dojo.widget.SplitContainer");
	    dojo.require("dojo.widget.TabContainer");
	    dojo.require("dojo.widget.Tooltip");
	    dojo.require("dojo.widget.InlineEditBox");
	    dojo.require("dojo.widget.Tree");
	    dojo.require("dojo.widget.TreeSelector");
	    dojo.require("dojo.dnd.*");
    </script>
    <script type="text/javascript" src="js/mochikit/MochiKit.js"></script>
    <script type="text/javascript" src="js/conf"></script>
</head>
<body>
    
    <div id="loading"><img src="images/loading.gif"/><br/>Loading</div>
    
    <div dojoType="LayoutContainer" layoutChildPriority='top-bottom' id="layout">
        <div dojoType="ContentPane" layoutAlign="bottom" id="footer" align="right"><?php echo "Beacon v".$version." - ".$footerText; ?></div>

        <div dojoType="SplitContainer" orientation="horizontal" sizerWidth="5" activeSizing="0" layoutAlign="client">
            <div dojoType="SplitContainer" orientation="vertical" sizerWidth="5" activeSizing="0" sizeMin="12" sizeShare="12" id="toolpane">
		        <div dojoType="ContentPane" sizeMin="10" sizeShare="10" id="toolbox">
                    <div class="menuTitle"><img src="images/<?php echo $toolIcon; ?>"><span><?php echo $toolLabel; ?></span></img></div>
			        <div class="controls">
                        <table border="0" width="100%">
                        <?php
                            for ($i = 0; $i < $fields->length; $i++) {
                                $field = $fields->item($i);
                                $icon  = $field->getAttribute('icon');
                                $guide = $field->getAttribute('guide');
                                $label = $field->getAttribute('label');
                                $caption = $field->getAttribute('caption');

                                echo "\n\t\t\t<tr>";
                                echo "\n\t\t\t\t".'<td><a href=""><div id="'.$guide.'" class="control">'.$label.'</div>';
                                echo '<span dojoType="tooltip" connectId="'.$guide.'" caption="'.$caption.'" toggle="explode"></span></a></td>';
                                echo "\n\t\t\t\t".'<td><img src="images/'.$icon.'"/></td>';
                                echo "\n\t\t\t</tr>\n";
                            }
                        ?>
                        </table>
                    </div>
                </div>

                <div dojoType="ContentPane" href="<?php echo $getTree;?>" refreshOnShow="true" sizeMin="10" sizeShare="10" id="domtree"></div>
                
                <div dojoType="ContentPane" sizeMin="10" sizeShare="10" id="savecontainer"> 
                    <div id="savebox"><img src="images/savexml.png"/><br/>Generate XML!</div>
                </div>
	        </div>

            <div id="content" dojoType="TabContainer" sizeMin="88" sizeShare="88" selectedTab="<?php $hTab->getAttribute('id'); ?>">
            <?php
                
                echo "\t".'<div id="'.$hTab->getAttribute('id').'" dojoType="ContentPane" href="'.$getHtml.'" refreshOnShow="true" label="'.$hTab->getAttribute('label').'"></div>';
                echo "\n";
                echo "\t".'<div id="'.$sTab->getAttribute('id').'" dojoType="ContentPane" href="'.$getXml.'" refreshOnShow="true" label="'.$sTab->getAttribute('label').'"></div>';
            ?>
            </div>	
	    </div>
    </div>

    <div id="docid">
	    <?php echo trim(urlencode($_REQUEST['id'])) ?>
    </div>

    <script type="text/javascript" src="js/editor.js"></script>

</body>
</html>
