<?php

if (isset($_POST['isedit']) and $_POST['isedit'] == '1') {
    $template = DOMDocument::load($_FILES['xmlf']['tmp_name']);
} else {
    $fields = array('title', 'author', 'abstract', 'date');
    $template = DOMDocument::load('../xml/new-template.xml');

    foreach ($fields as $field) {
	$value = $_POST[$field];
	$node =  $template->getElementsByTagName($field)->item(0);
	$node->nodeValue = $value;
    }
}

/* Store raw XML */
$tmpName = tempnam(null, null);
$handle = fopen($tmpName, "w+");
fwrite($handle, $template->saveXML());
fclose($handle);

/* Store equivalent HTML */
$theXSL = DOMDocument::load('../xml/guide2html.xsl');
$xslt = new XSLTProcessor();
$xslt->importStylesheet($theXSL);    
$output = $xslt->transformToXML($template);
if (!$output) {
    echo "Oops! An Error Occured";
    exit;
}
$html = fopen($tmpName.".html", "w+");
fwrite($html, $output);
fclose($html);

/* Store formatted XML */
include_once('geshi.php');
$source = $template->saveXML();
$lang = 'xml';
$obj = new Geshi($source, $lang);
$formatted = fopen($tmpName.".geshi", "w+");
fwrite($formatted, '<div id="source">'.$obj->parse_code().'</div>');
fclose($formatted);

/* Store initial Dojo Tree */
$config = DOMDocument::load('../xml/default-config.xml');
$icon = $config->getElementsByTagName('tree')->item(0)->getAttribute('icon');
$label = $config->getElementsByTagName('tree')->item(0)->getAttribute('label');

$guideTitle = $template->getElementsByTagName('title')->item(0)->nodeValue;
$guideChapters = $template->getElementsByTagName('chapter');
$tree = '<div class="menuTitle"><img src="../images/'.$icon.'">';
$tree .= '<span>'.$label.'</span></img></div>';
$tree .= '<dojo:TreeSelector
            widgetId="treeSelector"
            eventNames="select:nodeSelected">
            </dojo:TreeSelector>';
$tree .=  '<div dojoType="Tree"
            expandLevel="2"
            selector="treeSelector"
            toggle="wipe">';
$tree .= '<div dojoType="TreeNode" title="'.htmlspecialchars($guideTitle).'">';
    
for ($i = 0; $i < $guideChapters->length; $i++) {
    $chapter = $guideChapters->item($i);
    $sections = $chapter->getElementsByTagName('section');
    $chapterTitle = $chapter->getElementsByTagName('title')->item(0)->nodeValue;
    $tree .= '<div dojoType="TreeNode" title="'.htmlspecialchars($chapterTitle).'">';
    for ($j = 0; $j < $sections->length; $j++) {
        $section = $sections->item($j);
        $sectionTitle = $section->getElementsByTagName('title')->item(0)->nodeValue;
        $tree .= '<div dojoType="TreeNode" title="'.htmlspecialchars($sectionTitle).'"></div>';     
    }
    $tree .= '</div>';
}
$tree .= '</div></div>';

$treeFile = fopen($tmpName.".tree", "w+");
fwrite($treeFile, $tree);
fclose($treeFile);

/* Let's go! */
header('Location: ../editor.php?id='.urlencode($tmpName));

?>
