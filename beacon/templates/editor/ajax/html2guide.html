<?php

require_once "../database/database.php";

$text = urldecode($_POST['text']);
$text = stripslashes($text);
$id = urldecode($_POST['id']);

$text = str_replace('<hr>', '<hr />', $text);
$text = str_replace('<br>', '<br />', $text);

//$tidy = clean_html_code($text); //I want clean code!

write($id.".html", $text);


$template = loadDOM($id.".html");
$theXSL = loadDOM('../xml/html2guide.xsl');
$xslt = new XSLTProcessor();
$xslt->importStylesheet($theXSL);    
$output = $xslt->transformToXML($template);

$output = str_replace('&#10;', '', $output);
$output = str_replace("</author>", "</author>\n", $output);

$doc = new DOMDocument();
$doc->preserveWhiteSpace = false;
$doc->formatOutput   = false;
$doc->loadXML($output);

$output = $doc->saveXML();

$output = str_replace("<title>", "\n<title>", $output);
$output = str_replace("</title>", "</title>\n", $output);
$output = str_replace("<author", "\n<author", $output);
$output = str_replace("</author>", "\n</author>\n", $output);
$output = str_replace("<mail", "\n  <mail", $output);
$output = str_replace("<abstract>", "\n<abstract>", $output);
$output = str_replace("</abstract>", "</abstract>\n", $output);

$output = str_replace("<p>", "\n<p>", $output);
$output = str_replace("</p>", "</p>\n", $output);

echo $output;

$text = '<?xml version="1.0" encoding="UTF-8"?><style type="text/css" media="all">
        @import "../css/guide.css";
        </style>'.$text;

//$tidy = clean_html_code($text); //I want clean code!

write($id.".html", $text);

?>

<?php

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