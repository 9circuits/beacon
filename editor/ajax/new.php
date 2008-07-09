<?php

require_once "../database/database.php";

$flag = 0;

if (isset($_POST['isedit']) and $_POST['isedit'] == '1') 
{
	$template = DOMDocument::load($_FILES['xmlf']['tmp_name']);
	//echo "edit mode\n";
	$flag = 1;
} 
else if(isset($_POST['isnew']) and $_POST['isnew'] == '1') 
{
	$fields = array('title', 'author', 'abstract', 'date');
	$template = loadDOM('../xml/new-template.xml');
	//echo "new mode\n";
	foreach ($fields as $field) {
		$value = $_POST[$field];
		$node =  $template->getElementsByTagName($field)->item(0);
		$node->nodeValue = $value;
	}
	$flag = 1;
}

if ($flag == 1)
{
	/* Store raw XML */
	$tmpName = createStorage();
	
	//system('rm -rf '.getDirName($tmpName.'.html').'*.html '.getDirName($tmpName.'.xml').'*.xml ');
	
	write($tmpName.".xml", $template->saveXML());
    
	/* Store equivalent HTML */
	$theXSL = loadDOM('../xml/guide2html.xsl');
	$xslt = new XSLTProcessor();
	$xslt->importStylesheet($theXSL);    
	$output = $xslt->transformToXML($template);
	if (!$output) {
		echo "Oops! An Error Occured";
		exit;
	}
	
	write($tmpName.".html", $output);
	
	if(isset($_POST['isnew']))
		header('Location: ../editor.php?id='.urlencode($tmpName));
	else
	{
		echo '<div style="font-size: 69%; padding: 3px;">';
		echo '<b>Preview:</b> <br />';
		?>
		<div style="height: 230px; overflow: scroll; border: 1px inset #999;">
			<?php echo $output; ?>
		</div>
		<?php
		echo '</div>';
    }
}
?>
<?php
function getDirName($dir)
{
    $mainUrl = $dir; 

    $urlExplode = explode("/", $mainUrl); 

    $fileName = end($urlExplode); 

    $fileExplode = explode(".", $fileName); 

    $questExplode = explode("?", $fileName); 

    if(count($fileExplode) > 1) {
        $endIsFile = $fileExplode[1];}else{$endIsFile = "";
    } 

    if(count($questExplode) > 1) {
        $endIsQuest = $questExplode[1];}else{$endIsQuest = "";
    } 
    
    if ($endIsFile!= "") {  
        $resultUrl = str_replace($fileName, "", $mainUrl); 
        return $resultUrl; 
    } elseif ($endIsQuest!= "") { 
        $resultUrl = str_replace($fileName, "", $mainUrl); 
        return $resultUrl; 
    } else { 
        if(substr($mainUrl,-1,1)!= "/") { 
            $mainUrl .= "/"; 
        } 
        return $mainUrl; 
    } 
}
?>
<script language="javascript" type="text/javascript">window.top.window.stopUpload("<?php echo urlencode($tmpName); ?>")</script>   
