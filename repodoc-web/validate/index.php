<?php

/* In most cases, you won't have to change the
 * next two lines.
 */
define('DS', DIRECTORY_SEPERATOR)
define('HTDOCS', $_SERVER['DOCUMENT_ROOT'].DS);

/* You may change this to point to the repodoc
 * executable, if your installation of repodoc
 * is non-standard!
 */
define('REPODOC', '/usr/bin/repodoc');

/* Change this to the value of your REPODOC_HOME
 * environment variable, if you chose not to use
 * the default. Make sure that the directory you
 * specify here is writeable by the web-server!
 */
define('REPOLOG', DS.'repodoc-web'.DS.'repotemp'.DS);

/* Do not Edit anything below this line ;) */
define('PATH', HTDOCS.'repodoc-web'.DS.'validate'.DS.'htdocs'.DS.'doc'.DS);
define('TEMPXML', 'foo-bar-kix.xml');
define('TEMPLATE', HTDOCS.'repodoc-web'.DS.'validate'.DS.'template.xml');

/* Get languages (after removing . and ..) */
global $languages;
$allDirs = scandir(PATH);
$languages = array_slice($allDirs, 2, -1);

/* Start output buffering and switch off error reporting */
ob_start();
error_reporting(0);

/* Change to current directory */
chdir(dirname($_SERVER['SCRIPT_FILENAME']));

/* Redirect if HTTP request is invalid */ 
if (!verifyRequest()) {
    header('Location: help.html');
    print_r($_SERVER);
    ob_end_flush();
    exit;
}

/* Load the XML into a DOMDocument */
$doc = DOMDocument::loadXML($HTTP_RAW_POST_DATA);
$lang = $_SERVER['HTTP_CONTENT_LANGUAGE'];

/* If basic DTD validation fails, redirect */
if (!$doc->validate()) {
    header('Location: basic.html');
    ob_end_flush();
    exit;
}

/* Save XML into file and start validation */
$filePath = PATH.$lang.DIRECTORY_SEPARATOR.TEMPXML;
$doc->save($filePath);
doValidate($filePath);

/* Checks whether the HTTP request is valid */
function verifyRequest()
{
    global $languages;

    if (trim($_SERVER['REQUEST_METHOD']) == 'POST' and
        trim($_SERVER['CONTENT_TYPE']) == 'text/xml' and
        $_SERVER['CONTENT_LENGTH'] != 0 and
        in_array(trim($_SERVER['HTTP_CONTENT_LANGUAGE']), $languages)) {
        return true;
    }
    
    /* All other cases means request is invalid */
    return false;
}

/* Perform repodoc validation and echo results */
function doValidate($file)
{
    $command = REPODOC." ".$file;
    $cwd = PATH; 
    $desc = array(
                0=>array("pipe", "r"),
                1=>array("pipe", "w"),
                2=>array("file", "/tmp/error.log", "a")
            );
    
    $proc = proc_open($command, $desc, $pipes, $cwd);

    if (is_resource($proc)) {

        fclose($pipes[0]);
        fclose($pipes[1]);
        proc_close($proc); 
    }

    $finalResult = parseOutput($result);
    echo($finalResult->saveXML());
    ob_end_flush();

    unlink($file);
    exit;
}
   
/* Parse repodoc's output */
function parseOutput()
{ 
    /* Load template result file and get XPath*/
    $resultXML = DOMDocument::load(TEMPLATE);
    $xpath = new DOMXPath($resultXML);

    /* Get module elements */
    $modules = $xpath->query('/repodoc-result/module');
    $banned = $modules->item(0);
    $header = $modules->item(1);
    $length = $modules->item(2);
    $links = $modules->item(3);
    $path = $modules->item(4);
    $utf8 = $modules->item(5);
    $xml = $modules->item(6);

    $toParse = file(REPOLOG.'repodoc.log');
    $i = 0;

    while ($i < count($toParse)) {
         
        $pos = strpos($toParse[$i], 'Module');
        $j = $i;

        if ($pos) {

            $daResult = explode(':', $toParse[$i+1]);
            $daResult = trim($daResult[1]);
             
            $daReason = '';

            if ($daResult != 'ok') {
                $j = $i+4;
                while (strpos($toParse[$j], '------- Module') === false) {
                    $daReason = $daReason.$toParse[$j];
                    $j++;
                }
                $j--;
            }
            
            switch (trim($toParse[$i])) {
            case '------- Module Banned -------':   $subst = 'banned';
                                                    break;
            case '------- Module Header -------':   $subst = 'header';
                                                    break;
            case '------- Module Length -------':   $subst = 'length';
                                                    break;
            case '------- Module Links -------':    $subst = 'links';
                                                    break;
            case '------- Module Path -------':     $subst = 'path';
                                                    break;
            case '------- Module UTF-8 -------':    $subst = 'utf8';
                                                    break;
            case '------- Module XML -------':      $subst = 'xml';
                                                    break;
            }

            $$subst->setAttribute('result', $daResult);

            if (trim($daReason) != '') {
                $reasons = $xpath->query('/repodoc-result/module[@id="'.$subst.'"]/reason');
                $reason = $reasons->item(0);
                $daData = $resultXML->createCDATASection("\n".$daReason."     ");
                $reason->appendChild($daData);
            }
            
            $i = $j;
        }
        $i++;
    }

    return $resultXML;
}


?>
