<?php

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
	$template = DOMDocument::load('../xml/new-template.xml');
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
	$tmpName = tempnam(null, null);
	$handle = fopen($tmpName.".xml", "w+");
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
<script language="javascript" type="text/javascript">window.top.window.stopUpload("<?php echo urlencode($tmpName); ?>")</script>   
