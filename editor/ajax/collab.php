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
*   NEW_USER        - Set a new user in the list [DONE]
*   REMOVE_USER     - Remove the user [DONE]
*   GET_USER_LIST   - Get the list of editing folks and update self (AJAX poll function) [DONE]
*   POST_CHAT       - Post the chat message to the chat file [DONE]
*   GET_CHAT        - Get the chats from server [DONE]
*   SAVE_TEMP       - Save the changes to a temp file
*   SAVE_COMMIT     - Save the changes to the master copy
*   DISCARD_TEMP    - Discard the changes in the temporary file
*   UPDATE_LOCK     - Update the lock on the server (AJAX poll function)
*   GET_LOCK        - Get a lock from the server
*   REMOVE_LOCK     - Remove the lock from the server
*   GET_NEW_TEXT    - Get the updated text from server (AJAX poll function)
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

if ($request == 'GET_XML'){
    $text = urldecode($_POST['text']);
    $text = stripslashes($text);
    $id = urldecode($_POST['id']);

    $text = str_replace('<hr>', '<hr />', $text);
    $text = str_replace('<br>', '<br />', $text);
    
    $output = getXML($text);

    echo $output;
}


if ($request == 'GET_USER_LIST') {
    
    // Get the vars
    $id = urldecode($_POST['id']);
    $username = urldecode($_POST['username']);
    
    // Return if the user does not exist
    if (!userExists($id, $username))
        return;
    
    // Update the user 
    updateUserState($id, $username);
    
    // Remove timeout'ed users
    removeTimeout($id);

    // Get the user list in HTML
    $text = getUserList($id);
    
    // Output it for the client
    echo $text;  
}


if ($request == 'NEW_USER') {
    
    setHeader('xml');
    
    $id = urldecode($_POST['id']);
    $username = $_POST['username'];
    
    // Create User
    createUser($id, $username);
    
    // Create User State
    createUserState($id, $username);
    
}


if ($request == 'REMOVE_USER') {
    $id = urldecode($_POST['id']);
    $username = $_POST['username'];
    
    // Delete the User
    removeUser($id, $username);
    
}


if ($request == 'SAVE_TEMP') {
    
    // Set Header
    setHeader('xml');
    
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
    
    // Set header = text/xml
    setHeader('text/xml');
    
    $id = urldecode($_POST['id']);
    $username = $_POST['username'];
    $chat = urldecode($_POST['msg']);
    $lastId = urldecode($_POST['last_id']);
    
    $chat = str_replace("&", "&amp;", $chat);
    // Return if the user does not exist
    if (!userExists($id, $username))
        return;
    
    // Get time
    $time = date('H:i:s');
    
    // Post chat
    postChat($id, $username, $chat, $time);
    
    // Get chat. (using md5 for unique message id)
    if ($lastId == 'NULL')
        $chatString = stripslashes(getChat($id, md5($time.$username)));
    else
        $chatString = stripslashes(getChat($id, $lastId));
        
    // Send it to user
    echo $chatString;
}


if ($request == 'GET_CHAT') {
    
    // Set header = text/xml
    setHeader('text/xml');
     
    $id = urldecode($_POST['id']);
    $username = $_POST['username'];
    $last_id = $_POST['last_id'];
    
    // Return if the user does not exist
    if (!userExists($id, $username))
        return;
      
     // Get chat by last message id 
    $chatString = stripslashes(getChat($id, $last_id));
    
    // Send it to user
    echo $chatString;
}

?>






