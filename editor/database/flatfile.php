<?php

/*  
* flatfile.php
* 
* (Uses files as database)
*
* Write your database wrapper based on this file
*
* - Uses the database/tmp to store data. [TODO: check for write permissions]
* - Please send only decoded text! (urldecode)
* - And don't forget to add the file extensions while calling them! 
*
*/


/*
* Create a temporary storage. The generated file 
* name is used as the id for all transactions.
*/
function createStorage()
{
    return tempnam('../database/tmp', null);
}


/*
* Load a DOM document from a file 
*/
function loadDOM($id)
{
    $doc = new DOMDocument();
    $doc->preserveWhiteSpace = false;
    $doc->formatOutput   = true;
    $doc->load($id);
    
    return $doc;
}


/*
* Load a DOM document from a string
*/
function loadDOMString($string)
{
    $doc = new DOMDocument();
    $doc->preserveWhiteSpace = false;
    $doc->formatOutput   = true;
    $doc->loadXML($string);
    
    return $doc;
}


/*
* Elementary Write Function
*/
function write($id, $text) 
{
    $html = fopen($id, "w+");

    fwrite($html, $text);

    fclose($html);
    
    return $html;
}


/*
* Elementary Read Function
*/
function read($id)
{
    $contents = file_get_contents($id);
	
	return $contents;
}

function getXML($text)
{
    $template = loadDOMString($text);
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

    // TODO: Do this better with Reg Ex
    $output = str_replace("<title>", "\n<title>", $output);
    $output = str_replace("</title>", "</title>\n", $output);
    $output = str_replace("<author", "\n<author", $output);
    $output = str_replace("</author>", "\n</author>\n", $output);
    $output = str_replace("<mail", "\n  <mail", $output);
    $output = str_replace("<abstract>", "\n<abstract>", $output);
    $output = str_replace("</abstract>", "</abstract>\n", $output);

    $output = str_replace("<p>", "\n<p>", $output);
    $output = str_replace("</p>", "</p>\n", $output);
    
    return $output;
}

/*
* Post a chat message to the chat log
*/
function postChat($id, $username, $msg, $time)
{
    $msg = stripslashes(urldecode($msg));
    
    $chat = new DOMDocument();
    $chat->preserveWhiteSpace = false;
    $chat->formatOutput   = true;
    
    $chatFile = "";
    
    if (file_exists($id."_CHAT")) {
        $chatFile = read($id."_CHAT");
        $chat->loadXML($chatFile);
    } else {
        $container = $chat->createElement("chats");
        $container = $chat->appendChild($container);
        write($id."_CHAT", $chat->saveXML());
    }
    
    $container = $chat->getElementsByTagName('chats')->item(0);

    $message = $chat->createElement('message');
    $message->setAttribute('xml:id', md5($time.$username));
    $message->setAttribute('time', $time);
    $message->setAttribute('user', $username);
    $message->nodeValue = $msg;
    
    $container->appendChild($message);
        
    write($id."_CHAT", $chat->saveXML());
}


/*
* Get chat messages based on the last viewed message
*/
function getChat($id, $last_id) {
    
    //if ($last_id)
        //return;
    if (!file_exists($id."_CHAT")) 
        return;
        
    $chatFile = read($id."_CHAT");
    
    $chat = loadDOMString($chatFile);
    
    if (!$chat)
        return;
        
    $node = $chat->getElementById($last_id);
    $node = $node->previousSibling;
    
    $pnode = $node->parentNode;
    
    while($node)
    {
        $lastnode = $node->previousSibling;
        $pnode->removeChild($node);
        $node = $lastnode;
    }    
    
    return $chat->saveXML();
}


/*
* Create a new user
*/
function createUser($id, $username)
{
    $doc = new DOMDocument();
    $doc->preserveWhiteSpace = false;
    $doc->formatOutput   = true;
    
    $userFile = '';
    
    if (file_exists($id."_USERS")) {
        
        $userFile = read($id."_USERS");
        
        $doc->loadXML($userFile);
                
        if (!$doc->getElementById($username)) {
            
            $container = $doc->getElementsByTagName('users')->item(0);
                 
            $user = $doc->createElement( "user", $username);
            $user->setAttribute("xml:id", $username);
            
            $container->appendChild($user);
            
            write($id."_USERS", $doc->saveXML());
            
            // TODO: Use DOM
            echo '<?xml version="1.0" encoding="UTF-8"?><response><type>NEW_USER</type></response>';
        } else {
            // TODO: Use DOM
            echo '<?xml version="1.0" encoding="UTF-8"?><response><type>ERROR</type></response>';
        }
        
    } else {
        
        $container = $doc->createElement("users");
        $container = $doc->appendChild($container);
                
        $user = $doc->createElement('user', $username);
        $user->setAttribute("xml:id", $username);
        
        $container->appendChild($user);
                
        write($id."_USERS", $doc->saveXML());
        
        // TODO: Use DOM
        echo '<?xml version="1.0" encoding="UTF-8"?><response><type>NEW_USER</type></response>';
    }
}


/*
* Remove a user
*/
function removeUser($id, $username)
{
    // Erase from list
    $userFile = read($id."_USERS");
    $doc = new DOMDocument();
    $doc->preserveWhiteSpace = false;
    $doc->formatOutput   = true;
    $doc->loadXML($userFile);
    $container = $doc->getElementsByTagName('users')->item(0);
    $container->removeChild($doc->getElementById($username));
    write($id."_USERS", $doc->saveXML());
    
    //Delete the corresponding user state
    $userState = read($id."_USERS_STATE");
    $state = new DOMDocument();
    $state->preserveWhiteSpace = false;
    $state->formatOutput   = true;
    $state->loadXML($userState);
    $container = $state->getElementsByTagName('states')->item(0);
    $container->removeChild($state->getElementById($username));
    write($id."_USERS_STATE", $state->saveXML());
}


/*
* Get the user list in HTML
*/
function getUserList($id)
{
    $text = read($id."_USERS");
    $text = str_replace("<?xml version=\"1.0\"?>", "", $text);
    $text = preg_replace("/<user xml:id=\"(.*)\">/", "<li class=\"username\">", $text);
    $text = str_replace("</user>", "</li>", $text);
    $text = str_replace("<users>", "<div id=\"userlist\"><ol>", $text);
    $text = str_replace("</users>", "</ol></div>", $text);

    return $text;
}


/*
* Check if the user exists
*/
function userExists($id, $username)
{
    $userFile = read($id."_USERS");
    
    $doc = loadDOMString($userFile);
    
    return $doc->getElementById($username);
}


/*
* Remove all timeout'ed user
*/
function removeTimeout($id)
{
    $userState = '';
    
    if (file_exists($id."_USERS_STATE"))
        $userState = read($id."_USERS_STATE");
    
    $state = loadDOMString($userState);
        
    $container = $state->getElementsByTagName('states')->item(0);
    
    $list = $state->getElementsByTagName('userstate');
    
    foreach($list as $node) {
        $time = $node->firstChild->nodeValue;
        $currtime = date("H:i:s");
        $diff = getTimeDifference($time, $currtime);
       
        // Time out state (50 seconds passed)
        if ($diff['seconds'] > 50) {
            
            $username = $node->getAttribute('xml:id');
            
            // Remove from user state
            $container->removeChild($node);
            
            $userFile = read($id."_USERS");
            
            $doc = loadDOMString($userFile);
            
            $container = $doc->getElementsByTagName('users')->item(0);
            
            // Remove from user list
            $container->removeChild($doc->getElementById($username));
            
            // Commit changes
            write($id."_USERS", $doc->saveXML());
        }
    }
    
    // Finally commit the user state
    write($id."_USERS_STATE", $state->saveXML());
}


/*
* Create a state node in the State file (used for timeouts)
*/
function createUserState($id, $username)
{
    $state = new DOMDocument();
    $state->preserveWhiteSpace = false;
    $state->formatOutput   = true;
    
    $userState = '';
    
    // See if the file exists
    if (file_exists($id."_USERS_STATE")) {
        $userState = read($id."_USERS_STATE");
        $state->loadXML($userState);
    } else { // Or create from scratch
        $container = $state->createElement("states");
        $container = $state->appendChild($container);
        write($id."_USERS_STATE", $state->saveXML());
    }

    $container = $state->getElementsByTagName('states')->item(0);
    
    // Create a new user. (xml:id needed for letting getElementById work)
    $userstat = $state->createElement("userstate");
    $userstat->setAttribute("xml:id", $username);
    
    $userstat = $container->appendChild($userstat);
    
    // Add the current time
    $time = $state->createElement("time", date("H:i:s"));
    
    $userstat->appendChild($time);
        
    // Commit the new user to the state file
    write($id."_USERS_STATE", $state->saveXML());
}


/*
* Update a user to prevent his/her (yeah whatever) timeout
*/
function updateUserState($id, $username) 
{
    $userState = '';
    
    if (file_exists($id."_USERS_STATE"))
        $userState = read($id."_USERS_STATE");
    
    $state = loadDOMString($userState);
    
    // Find the user
    $usernode = $state->getElementById($username);
    
    // If not existing then return
    if(!$usernode)
        return;
    
    // Update the date   
    $usernode->firstChild->nodeValue = date("H:i:s");
    
    // Commit the changes
    write($id."_USERS_STATE", $state->saveXML());
}


/*
* Get time difference. No need to change in your wrapper.
*/
function getTimeDifference($start, $end)
{
    $uts['start'] = strtotime($start);
    $uts['end'] = strtotime($end);
    
    if ($uts['start']!==-1 && $uts['end']!==-1) {
        
        if ($uts['end'] >= $uts['start']) {
            
            $diff = $uts['end'] - $uts['start'];
            
            if ($days = intval((floor($diff/86400))))
                $diff = $diff % 86400;
                
            if ($hours = intval((floor($diff/3600))))
                $diff = $diff % 3600;
                
            if ($minutes = intval((floor($diff/60))))
                $diff = $diff % 60;
                
            $diff = intval($diff);  
                      
            return array('days'=>$days, 'hours'=>$hours, 'minutes'=>$minutes, 'seconds'=>$diff);
            
        } else {
            //trigger_error("Ending date/time is earlier than the start date/time", E_USER_WARNING);
            return;
        }
    } else {
        trigger_error("Invalid date/time data detected", E_USER_WARNING);
        return;
    }
    return false;
}


/*
* Set the document header as $type. No need to change in your wrapper.
*/
function setHeader($type)
{
    header('Content-Type: '.$type);
    header("Cache-Control: no-cache, must-revalidate");
}

?>