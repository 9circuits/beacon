<?

function newdoc($beacon) {
    $text = file_get_contents($beacon->path . "xml/new-template.xml");
    $text = $beacon->parser->xslParse($text, $beacon->path . "xml/guide2html.xsl", true);
    $text =  str_replace("{css}", $beacon->url . "css/guide.css", $text);
    return $text;
}

function editdoc($beacon) {
    $text = $beacon->parser->xslParse($beacon->xml, $beacon->path . "xml/guide2html.xsl", true);
    return $text;
}

function getsrc($beacon) {
    $text = $beacon->parser->xslParse($beacon->html, $beacon->path . "xml/html2guide.xsl");
    return $text;
}

function gethtml($beacon) {
    $output = $beacon->parser->xslParse($beacon->src, $beacon->path . "xml/guide2html.xsl", true);
    $output = str_replace('&#10;', '', $output);
    return $output;
}

?>