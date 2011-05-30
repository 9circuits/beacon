<?

class BeaconDocbook {

    var $new_template = "xml/new-template.xml";
    var $html2xml = "xml/html2docbook.xsl";
    var $xml2html = "xml/docbook2html.xsl";
    var $css_path = "css/docbook.css";

    function newdoc($beacon) {
        $text = file_get_contents($beacon->path . $this->new_template);

        $text = $beacon->parser->xslParse($text,
                                          $beacon->path . $this->xml2html);

        return $text;
    }

    function getsrc($beacon) {
        $text = $beacon->parser->xslParse($beacon->html,
                                          $beacon->path . $this->html2xml);

        return $text;
    }

    function gethtml($beacon) {
        $text = $beacon->parser->xslParse($beacon->src,
                                          $beacon->path . $this->xml2html);

        return $text;
    }

    function get_css_path() {
        return $this->css_path;
    }
}


return new BeaconDocbook();