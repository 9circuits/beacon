<?

function newdoc($beacon) {
    $text = file_get_contents($beacon->path . "xml/new-template.xml");

    $text = $beacon->parser->xslParse($text,
                        $beacon->path . "xml/guide2html.xsl", true,
                        $beacon->url . "css/guide.css");

    return $text;
}

function getsrc($beacon) {
    $text = $beacon->parser->xslParse($beacon->html,
                        $beacon->path . "xml/html2guide.xsl");

    return $text;
}

function gethtml($beacon) {
    if ($beacon->wrap) {
        $text = $beacon->parser->xslParse($beacon->src,
                        $beacon->path . "xml/guide2html.xsl", true,
                        $beacon->url . "css/guide.css");
    } else {
        $text = $beacon->parser->xslParse($beacon->src,
                        $beacon->path . "xml/guide2html.xsl", true);
    }
    return $text;
}

?>