<?php






function createNew() 
{
    $emsg = '<script language="javascript" type="text/javascript">
            window.top.window.document.getElementById("cool").style.visibility = "hidden";
            window.top.window.document.getElementById("message").innerHTML = \'<p><span class="error">Oops! BAD XML! O_O</span><p>\';
            </script>   
            <p class="ncontent" style="background:#ffbbbb; padding: 5px; margin-top: 0.5em; margin-bottom: 0.5em;
                font-family: sans-serif, Verdana, Arial, Helvetica; font-size: 0.9em;">
    		    <span title="guideNote" style="padding: 0.5em;">
    			    <b>Error: </b>
    			    <span title="guideNoteValue">The XML that you have entered is not valid! Please upload again!</span>
    		    </span>
    	    </p>';

    $flag = 0;
    
    if (isset($_POST['isedit']) and $_POST['isedit'] == '1') 
    {
    	$template = DOMDocument::load($_FILES['xmlf']['tmp_name']);

    	if($template == false) {
    	    echo $emsg;

    	return false;
        }
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
    	unlink($tmpName);

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

    	//$output = clean_html_code($output); //I want clean code!
        $output = str_replace("<p title=\"guideParagraph\">\n", "<p title=\"guideParagraph\">", $output);

    	write($tmpName.".html", $output);
    
    	if(isset($_POST['isnew']))
    		header('Location: ../collaborate.php?id='.urlencode($tmpName));
    	else
    	{
    		echo '<div style="font-size: 69%; padding: 3px;">';
    		echo '<b>Preview:</b> <br />';
    		?>
    		<script language="javascript" type="text/javascript">window.top.window.stopUpload("<?php echo urlencode($tmpName); ?>")</script>   
    		<div style="height: 230px; overflow: scroll; border: 1px inset #999;">
    			<?php echo $output; ?>
    		</div>
    		<?php
    		echo '</div>';
        }
    }
}


?>