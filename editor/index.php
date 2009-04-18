<?php
/*
 * Beacon Startup Script
 *
 * This is how to use the API.
 *
 */

// Include the API
include "php/beacon.php";

// Set the conf file path here
$confFile = "beacon.conf";

$request = "";

// Pick up any requests
$request = json_decode(file_get_contents("php://input"));

// If none do the default that is load the page
if ($request == '') {
    
    // Create a new Beacon object
    $beacon = new Beacon($confFile, $request);
    $content = $beacon->init();
    
    // Echo the contents
    echo $content;
    
} else {
    // All beacon requests if made to this file should be handled.
    // You can do your own stuff when actions are called.
    switch($request->action) {
        case "newdoc":
            break;
        case "editdoc":
            break;
    }
}

?>

