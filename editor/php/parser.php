<?php

class BeaconParser
{
    function BeaconParser($js=false) {
        $this->js = $js;
    }

    function xslParse($text, $xsl, $html_output=false) {
        $raw = $text;

        // TODO: Fix HRBR hack!
        $raw = str_replace('<br>', '<br />', $raw);
        $raw = str_replace('<hr>', '<hr />', $raw);

        $tSrc = new DOMDocument();

        // Critical. Must not output bad code.
        if (! $tSrc->loadXML($raw)) {
            if ($this->js) {
                echo '<script language="javascript" type="text/javascript">window.top.window.beacon.uploadFail()</script>';
            } else {
                echo "FAIL";
                exit;
            }
        }

        $tXSL = new XSLTProcessor();
        $tXSL->importStyleSheet(DOMDocument::load($xsl));
        $ret = $tXSL->transformToXML(DOMDocument::loadXML($raw));

        if ($html_output) {
            return $ret;
        } else {
            return $this->xmlpp($ret);
        }
    }

    function xmlpp($xml, $html_output=false) {
        $xml_obj = new SimpleXMLElement($xml);
        $level = 0;
        $indent = 0; // current indentation level
        $pretty = array();

        // get an array containing each XML element
        $xml = explode("\n", preg_replace('/>\s*</', ">\n<", $xml_obj->asXML()));

        // shift off opening XML tag if present
        if (count($xml) && preg_match('/^<\?\s*xml/', $xml[0])) {
            $pretty[] = array_shift($xml);
        }

        foreach ($xml as $el) {
            if (preg_match('/^<([\w])+[^>\/]*>$/U', $el)) {
                // opening tag, increase indent
                $pretty[] = str_repeat(' ', $indent) . $el;
                $indent += $level;
            } else {
                if (preg_match('/^<\/.+>$/', $el)) {
                    $indent -= $level;  // closing tag, decrease indent
                }
                if ($indent < 0) {
                    $indent += $level;
                }
                $pretty[] = str_repeat(' ', $indent) . $el;
            }
        }
        $xml = implode("\n", $pretty);
        return ($html_output) ? htmlentities($xml) : $xml;
    }
}


?>