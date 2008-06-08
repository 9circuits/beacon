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

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
            "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>TabContainer Demo</title>
<style type="text/css">
        @import "js/dojoroot/dijit/themes/tundra/tundra.css";
        @import "js/dojoroot/dojo/resources/dojo.css";
</style>
<script type="text/javascript" src="js/dojoroot/dojo/dojo.js"
	djConfig="isDebug: false, parseOnLoad: true"></script>
    <script type="text/javascript">
       dojo.require("dojo.parser");
           dojo.require("dijit.layout.ContentPane");
           dojo.require("dijit.layout.TabContainer");
           dojo.require("dijit.form.Button");
     </script>
</head>
<body class="tundra">
   <div id="mainTabContainer" dojoType="dijit.layout.TabContainer" 
        style="width:500px;height:500px">
      	<?php
            
            echo "\t".'<div id="'.$hTab->getAttribute('id').'" dojoType="dijit.layout.ContentPane"  href="'.$getHtml.'" refreshOnShow="true" title="'.$hTab->getAttribute('label').'"></div>';
            echo "\n";
            echo "\t".'<div id="'.$sTab->getAttribute('id').'" dojoType="dijit.layout.ContentPane"  href="'.$getXml.'" refreshOnShow="true" title="'.$sTab->getAttribute('label').'"></div>';
        ?>
      <div id="HanselGretel" dojoType="dijit.layout.ContentPane" 
           title="Hansel and Gretel" selected="true">
      Hard by a great forest dwelt a poor wood-cutter with his wife 
      and his two children. The boy was called Hansel and the girl Gretel.
      He had little to bite and to break, and once when great dearth fell 
      on the land, he could no longer procure even daily bread. 
      </div>
      <div id="GreenTwigs" dojoType="dijit.layout.ContentPane" 
             title="The Three Green Twigs">
      There was once upon a time a hermit who lived in a forest at the foot 
      of a mountain, and passed his time in prayer and good works, 
      and every evening he carried, to the glory of God, two pails of water 
      up the mountain. 
      </div>
</div>
</body></html>