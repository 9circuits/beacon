<?php

require_once "../database/database.php";

$text = urldecode($_POST['text']);
$text = stripslashes($text);
$id = urldecode($_POST['id']);

write($id.".xml", $text);

/*$xml = fopen($id.".xml", "w+");

fwrite($xml, $text);

fclose($xml);*/


// Am wondering how to handle the following in the Database Wrapper
$template = loadDOM($id.".xml");

$theXSL = loadDOM('../xml/guide2html-lite.xsl');
$xslt = new XSLTProcessor();
$xslt->importStylesheet($theXSL);    
$output = $xslt->transformToXML($template);

echo $output;

?>