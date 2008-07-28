<?php

require_once "../database/database.php";

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
	unlink('../database/tmp/'.$tmpName);
	
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
	
	$output = clean_html_code($output); //I want clean code!

	write($tmpName.".html", $output);
	
	if(isset($_POST['isnew']))
		header('Location: ../editor.php?id='.urlencode($tmpName));
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

//Function to seperate multiple tags one line
function fix_newlines_for_clean_html($fixthistext)
{
	$fixthistext_array = explode("\n", $fixthistext);
	foreach ($fixthistext_array as $unfixedtextkey => $unfixedtextvalue)
	{
		//Makes sure empty lines are ignores
		if (!preg_match("/^(\s)*$/", $unfixedtextvalue))
		{
			$fixedtextvalue = preg_replace("/>(\s|\t)*</U", ">\n<", $unfixedtextvalue);
			$fixedtext_array[$unfixedtextkey] = $fixedtextvalue;
		}
	}
	return implode("\n", $fixedtext_array);
}

function clean_html_code($uncleanhtml)
{
	//Set wanted indentation
	$indent = "";


	//Uses previous function to seperate tags
	$fixed_uncleanhtml = fix_newlines_for_clean_html($uncleanhtml);
	$uncleanhtml_array = explode("\n", $fixed_uncleanhtml);
	//Sets no indentation
	$indentlevel = 0;
	foreach ($uncleanhtml_array as $uncleanhtml_key => $currentuncleanhtml)
	{
		//Removes all indentation
		$currentuncleanhtml = preg_replace("/\t+/", "", $currentuncleanhtml);
		$currentuncleanhtml = preg_replace("/^\s+/", "", $currentuncleanhtml);
		
		$replaceindent = "";
		
		//Sets the indentation from current indentlevel
		for ($o = 0; $o < $indentlevel; $o++)
		{
			$replaceindent .= $indent;
		}
		
		//If self-closing tag, simply apply indent
		if (preg_match("/<(.+)\/>/", $currentuncleanhtml))
		{ 
			$cleanhtml_array[$uncleanhtml_key] = $replaceindent.$currentuncleanhtml;
		}
		//If doctype declaration, simply apply indent
		else if (preg_match("/<!(.*)>/", $currentuncleanhtml))
		{ 
			$cleanhtml_array[$uncleanhtml_key] = $replaceindent.$currentuncleanhtml;
		}
		//If opening AND closing tag on same line, simply apply indent
		else if (preg_match("/<[^\/](.*)>/", $currentuncleanhtml) && preg_match("/<\/(.*)>/", $currentuncleanhtml))
		{ 
			$cleanhtml_array[$uncleanhtml_key] = $replaceindent.$currentuncleanhtml;
		}
		//If closing HTML tag or closing JavaScript clams, decrease indentation and then apply the new level
		else if (preg_match("/<\/(.*)>/", $currentuncleanhtml) || preg_match("/^(\s|\t)*\}{1}(\s|\t)*$/", $currentuncleanhtml))
		{
			$indentlevel--;
			$replaceindent = "";
			for ($o = 0; $o < $indentlevel; $o++)
			{
				$replaceindent .= $indent;
			}
			
			$cleanhtml_array[$uncleanhtml_key] = $replaceindent.$currentuncleanhtml;
		}
		//If opening HTML tag AND not a stand-alone tag, or opening JavaScript clams, increase indentation and then apply new level
		else if ((preg_match("/<[^\/](.*)>/", $currentuncleanhtml) && !preg_match("/<(link|meta|base|br|img|hr)(.*)>/", $currentuncleanhtml)) || preg_match("/^(\s|\t)*\{{1}(\s|\t)*$/", $currentuncleanhtml))
		{
			$cleanhtml_array[$uncleanhtml_key] = $replaceindent.$currentuncleanhtml;
			
			$indentlevel++;
			$replaceindent = "";
			for ($o = 0; $o < $indentlevel; $o++)
			{
				$replaceindent .= $indent;
			}
		}
		else
		//Else, only apply indentation
		{$cleanhtml_array[$uncleanhtml_key] = $replaceindent.$currentuncleanhtml;}
	}
	//Return single string seperated by newline
	return implode("\n", $cleanhtml_array);	
}

?>
