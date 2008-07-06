<?php

$text = urldecode($_POST['text']);
$text = stripslashes($text);
$id = urldecode($_POST['id']);

$xml = fopen($id.".xml", "w+");

fwrite($xml, $text);

fclose($xml);

$template = DOMDocument::load($id.".xml");

$theXSL = DOMDocument::load('../xml/guide2html-lite.xsl');
$xslt = new XSLTProcessor();
$xslt->importStylesheet($theXSL);    
$output = $xslt->transformToXML($template);

echo $output;

?>