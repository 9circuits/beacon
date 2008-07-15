<?php

/* Uses the system temp to store data. Please send only decoded urls! 
And don't forget to add the file extensions while calling them! 
DB Wrapper Makers please parse the file name for a valid extension. */

// Create a temporary storage
function createStorage()
{
    return tempnam(null, null);
}

// Load a DOM document from a file (DB users will need a load-DOM-from-string function)
function loadDOM($id, $type)
{
    return DOMDocument::load($id);
}

// Write
function write($id, $text) 
{
    $html = fopen($id, "w+");

    fwrite($html, $text);

    fclose($html);
    
    return $html;
}

// Read
function read($id)
{
    $contents = file_get_contents($id);
	
	return $contents;
}

?>