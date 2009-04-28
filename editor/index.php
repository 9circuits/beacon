<?php
/*
 * Beacon Startup Script
 *
 * This is how to use the API.
 * This page should serve everything
 * required by Beacon.
 *
 */

// Include the API
require "php/beacon.php";

// Set the conf file path here
$confFile = "beacon.conf";

// Set the full path here
$fullPath = "/Library/WebServer/Documents/beacon/beacondev/trunk/editor/";

// Pick up any requests
$request = "";
$request = json_decode(file_get_contents("php://input"));

// Create a new Beacon object
$beacon = new Beacon($confFile, $request, $fullPath);

// Simulate Network Lag for local development
sleep(1);

// If none check if its a request to upload. If not load up Beacon.
if ($request == '') {

    if (isset($_POST["UPLOAD"])) {
        $text = file_get_contents($_FILES['xmlf']['tmp_name']);
        $id = $_POST["ID"];
        $plugin = $_POST["PLUGIN"];

        $response = $beacon->upload($id, $plugin, $text);

        echo $response;
    } else {
        // Fetch the content to be displayed
        $content = $beacon->init();

        // Echo the contents
        echo $content;
    }

} else {
    // All beacon requests if made to this file should be handled.
    // You can do your own stuff when actions are called.
    switch($request->action) {
        case "beaconui":
             $ui = $beacon->fetchui();
             echo $ui;
             break;

        case "newdoc":
            $newdoc = $beacon->newdoc();
            echo $newdoc;
            break;

        case "fetchdoc":
            $doc = $beacon->fetchdoc();
            echo $doc;
            break;

        case "documentui":
            $ui = $beacon->documentui();
            echo $ui;
            break;

        case "deletedoc":
            $deletedoc = $beacon->deletedoc();
            echo $deletedoc;
            break;

        case "getsrc":
            $src = $beacon->getsrc();
            echo $src;
            break;

        case "gethtml":
            $html = $beacon->gethtml();
            echo $html;
            break;
    }
}

?>

