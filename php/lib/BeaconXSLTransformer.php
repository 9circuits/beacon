<?php

class BeaconXSLTransformer
{
    function BeaconXSLTransformer() {
    }

    function xslParse($text, $xsl) {
        $raw = $text;

        // TODO: Fix HRBR hack!
        $raw = str_replace('<br>', '<br />', $raw);
        $raw = str_replace('<hr>', '<hr />', $raw);

        $tSrc = new DOMDocument();

        // Critical. Must not output bad code.
        if (! $tSrc->loadXML($raw)) {
            return false;
        }

        $tXSL = new XSLTProcessor();
        $tXSL->importStyleSheet(DOMDocument::load($xsl));
        $ret = $tXSL->transformToXML(DOMDocument::loadXML($raw));

        return $ret;

    }
}


?>