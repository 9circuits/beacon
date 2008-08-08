<?php

// Simulate network lag
//sleep(3);

// Include the database wrapper
require_once "../database/database.php";

// Include the function library
require_once "collab_functions.php";

/* To check the type of request (TODO: implement all)
* types: 
*
*   CREATE_NEW      - Create a session with a new document [DONE] [TODO: Refinement of code]
*   CREATE_EDIT     - Create a session with an existing file [DONE] [TODO: Refinement of Code]
*   SAVE_TEMP       - Save the changes to a temp file
*   SAVE_COMMIT     - Save the changes to the master copy
*   DISCARD_TEMP    - Discard the changes in the temporary file
*   UPDATE_LOCK     - Update the lock on the server (AJAX poll function)
*   GET_LOCK        - Get a lock from the server
*   REMOVE_LOCK     - Remove the lock from the server
*   GET_NEW_TEXT    - Get the updated text from server (AJAX poll function)
*   NEW_USER        - Set a new user in the list [DONE] [TODO: Use functions]
*   REMOVE_USER     - Remove the user [DONE] [TODO: Use functions]
*   GET_USER_LIST   - Get the list of editing folks and update self (AJAX poll function) [DONE] [TODO: Use functions]
*   POST_CHAT       - Post the chat message to the chat file
*   GET_CHAT        - Get the chats from server
*
*/
$request = '';



// Get the request variable
if (isset($_POST['request']))
    $request = $_POST['request'];
else
    return;
    
if ($request == 'CREATE_EDIT' || $request == 'CREATE_NEW') {
    createNew();
}


if ($request == 'GET_USER_LIST') {
    
    $id = urldecode($_POST['id']);
    $username = urldecode($_POST['username']);
        
    updateUserState($id, $username);
    removeTimeout($id);

    $text = read($id."_USERS");
    $text = str_replace("<?xml version=\"1.0\"?>", "", $text);
    $text = preg_replace("/<user xml:id=\"(.*)\">/", "<li class=\"username\">", $text);
    $text = str_replace("</user>", "</li>", $text);
    $text = str_replace("<users>", "<div id=\"userlist\"><ol>", $text);
    $text = str_replace("</users>", "</ol></div>", $text);

    echo $text;  

}

if ($request == 'NEW_USER') {
    
    header('Content-Type: text/xml');
    header("Cache-Control: no-cache, must-revalidate");
    
    $id = urldecode($_POST['id']);
    $username = $_POST['username'];
    
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
    
        //sleep(3);
        
        //$newTime = date("H:i:s");
        
        //$diffTime = get_time_difference($lastTime, $newTime);
                
    } else {
        
        $container = $doc->createElement("users");
        $container = $doc->appendChild($container);
                
        $user = $doc->createElement('user', $username);
        $user->setAttribute("xml:id", $username);
        
        $container->appendChild($user);
        
        //$doc->loadXML($userFile);
        
        write($id."_USERS", $doc->saveXML());
        
        // TODO: Use DOM
        echo '<?xml version="1.0" encoding="UTF-8"?><response><type>NEW_USER</type></response>';
    }
    
    
    $state = new DOMDocument();
    $state->preserveWhiteSpace = false;
    $state->formatOutput   = true;
    $userState = '';
    
    if (file_exists($id."_USERS_STATE")) {
        $userState = read($id."_USERS_STATE");
        $state->loadXML($userState);
    } else {
        $container = $state->createElement("states");
        $container = $state->appendChild($container);
        write($id."_USERS_STATE", $state->saveXML());
    }

    $container = $state->getElementsByTagName('states')->item(0);
    
    $userstat = $state->createElement("userstate");
    $userstat->setAttribute("xml:id", $username);
    
    $userstat = $container->appendChild($userstat);
    
    $time = $state->createElement("time", date("H:i:s"));
    
    $userstat->appendChild($time);
        
    write($id."_USERS_STATE", $state->saveXML());
    
}

if ($request == 'REMOVE_USER') {
    $id = urldecode($_POST['id']);
    $username = $_POST['username'];
    
    // Delete the User
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

if ($request == 'SAVE_TEMP') {
    
    header('Content-Type: text/xml');
    header("Cache-Control: no-cache, must-revalidate");
    
    $text = '';
    $xml = '';
    
    if (isset($_POST['text'])) {
        $text = urldecode($_POST['text']);
        $text = stripslashes($text);
    }
    
    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    
    $xml .= '<response>';
    
    $xml .= '<type>'.$request.'</type>';
    
    $xml .= '<text>'.$text.'</text>';
    
    $xml .= '</response>';
    
    //echo $text;
    echo $xml;
}

if ($request == 'POST_CHAT') {
    
    header('Content-Type: text/xml');
    header("Cache-Control: no-cache, must-revalidate");
    
    $id = urldecode($_POST['id']);
    $username = $_POST['username'];
    $chat = urldecode($_POST['msg']);
    
    if (!userExists($id, $username))
        return;
    
    $time = date('H:i:s');
    
    postChat($id, $username, $chat, $time);
    
    $chatString = getChat($id, md5($time.$username));
    
    echo $chatString;
}

/* Perennial Function. 
* TODO: 
*   1. Implement Timeout, maybe set_time_limit()?
*   2. Delete old chats to keep the file size down
*/
if ($request == 'GET_CHAT') {
    
    header('Content-Type: text/xml');
    header("Cache-Control: no-cache, must-revalidate");
    
    $id = urldecode($_POST['id']);
    $username = $_POST['username'];
    $last_id = $_POST['last_id'];
    
    if (!userExists($id, $username))
        return;
        
    $chatString = stripslashes(getChat($id, $last_id));
    
    echo $chatString;

}



function postChat($id, $username, $msg, $time)
{
    $msg = stripslashes(urldecode($msg));
    //$text = "[".$time."] - ".$username.": ".$msg;
    
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

function getChat($id, $last_id) {
    
    //if ($last_id)
        //return;
        
    $chatFile = read($id."_CHAT");
    
    $chat = new DOMDocument();
    $chat->preserveWhiteSpace = false;
    $chat->formatOutput   = true;
    
    $chat->loadXML($chatFile);
    
    $node = $chat->getElementById($last_id);
    $node = $node->previousSibling;
    
    $pnode = $node->parentNode;
    
    while($node)
    {
        $lastnode = $node->previousSibling;
        $pnode->removeChild($node);
        $node = $lastnode;
    }    
    
    $pnode->setAttribute('last_id', $last_id);
    
    return $chat->saveXML();
}

function userExists($id, $username)
{
    $userFile = read($id."_USERS");
    $doc = new DOMDocument();
    $doc->preserveWhiteSpace = false;
    $doc->formatOutput   = true;
    $doc->loadXML($userFile);
    return $doc->getElementById($username);
}

function removeTimeout($id)
{
    $userState = '';
    
    if (file_exists($id."_USERS_STATE"))
        $userState = read($id."_USERS_STATE");
    
    $state = new DOMDocument();
    $state->preserveWhiteSpace = false;
    $state->formatOutput   = true;
    
    $state->loadXML($userState);
        
    $container = $state->getElementsByTagName('states')->item(0);
    
    $list = $state->getElementsByTagName('userstate');
    
    foreach($list as $node) {
        $time = $node->firstChild->nodeValue;
        $currtime = date("H:i:s");
        $diff = get_time_difference($time, $currtime);
       
        // Time out state
        if ($diff['seconds'] > 50) {
            
            $username = $node->getAttribute('xml:id');
            
            $container->removeChild($node);
            
            //echo $username;
            
            // Delete the User
            $userFile = read($id."_USERS");
            $doc = new DOMDocument();
            $doc->preserveWhiteSpace = false;
            $doc->formatOutput   = true;
            $doc->loadXML($userFile);
            $container = $doc->getElementsByTagName('users')->item(0);
            $container->removeChild($doc->getElementById($username));
            write($id."_USERS", $doc->saveXML());
            
            write($id."_USERS_STATE", $state->saveXML());
            
            //postChat($id, $username, "disconnected");
        }
    }
}

function updateUserState($id, $username) 
{
    $userState = '';
    
    if (file_exists($id."_USERS_STATE"))
        $userState = read($id."_USERS_STATE");
    
    $state = new DOMDocument();
    $state->preserveWhiteSpace = false;
    $state->formatOutput   = true;
    
    $state->loadXML($userState);
    
    //$container = $state->getElementsByTagName('states')->item(0);
    
    $usernode = $state->getElementById($username);
    
    if(!$usernode)
        return;
        
    $usernode->firstChild->nodeValue = date("H:i:s");
    
    //echo $usernode->firstChild->nodeValue;
    write($id."_USERS_STATE", $state->saveXML());
}

/*
while ($i < 10) {
    updateUserState($id, $username);
    removeTimeout($id);

    $text = read($id."_USERS");
    $text = str_replace("<?xml version=\"1.0\"?>", "", $text);
    $text = preg_replace("/<user xml:id=\"(.*)\">/", "<li class=\"username\">", $text);
    $text = str_replace("</user>", "</li>", $text);
    $text = str_replace("<users>", "<div id=\"userlist\"><ol>", $text);
    $text = str_replace("</users>", "</ol></div>", $text);

    echo $text;  
    flush(); 
    ob_flush();
    
    sleep(3); 
    $i++; 
}*/

?>






