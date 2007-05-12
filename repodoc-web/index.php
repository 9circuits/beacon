<?php

if (!isset($_POST['filesent'])) {
    include 'upload.html';
} else {
    $contents = file_get_contents($_FILES['xmlfile']['tmp_name']);
    $request =  'http://localhost/repodoc-web/validate/';

    $header[] = "Content-type: text/xml";
    $header[] = "Content-length: ".strlen($contents);
    $header[] = "Content-language: en";
    $header[] = "Cache-Control: no-cache";
    $header[] = "Connection: close \r\n";
    $header[] = $contents;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $request);
    //curl_setopt($ch, CURLOPT_HEADER, 1); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 4);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);

    $result = curl_exec($ch);

    $theXML = DOMDocument::loadXML($result);
    $theXSL = DOMDocument::load('transform.xsl');

    $xslt = new XSLTProcessor();
    $xslt->importStylesheet($theXSL);    
    $output = $xslt->transformToXML($theXML);
    
    if ($output) {
        echo $output;
    } else {
        echo "Sorry, an error occured!"; 
    }
}    

?>
