<?php
/*
 * Login Script
 */

session_start();

require_once("lib/BeaconAuthenticator.php");
require_once("lib/BeaconMySQL.php");
require_once ('settings.php');

$beacon_db_instance = NULL;

$beacon_runnable = false;

if ($beacon_db_type == "mysql") {
    $beacon_db_instance = new BeaconMySQL();
}

$beacon_runnable = $beacon_db_instance->init_db($beacon_mysql_hostname,
                                                $beacon_mysql_database,
                                                $beacon_mysql_username,
                                                $beacon_mysql_password);

if ($beacon_runnable < 0) {
    echo '<h3>Database Error. <a href="index.php">Go to main page</a> to review the problem.</h3>';
    @session_destroy();
}

$auth = new BeaconAuth($beacon_db_instance);

if (!$auth->check_session()) {
    if (!isset($_POST['name1'])) {
        echo '<h3>You are not authorized to view this page. <a href="index.php">Login Here.</a></h3>';
        @session_destroy();
    } else {
        $username = $_POST['name1'];
        $password = $_POST['password1'];


        /* BEGIN: Code for external auth */
        /*$output = "AAA";
        $return = false;

        exec("python auth.py " . $username . " " . $password, $output, $return);

        if ($output[0] == "no") {
            echo '<h3>Incorrect Login. <a href="index.php">Go Back.</a></h3>';
            @session_destroy();
        } else if ($output[0] == "yes") {
            // Check if the user exists in DB
            if (!$auth->login($username, md5($password))) {
                // Add the user (TODO: add email)
                $beacon_db_instance->add_user($username,
                                              $password,
                                              "foo@example.com");
            } else {
                // Let's move on normally
                header("Location: beacon.php");
            }

            // Try again
            if (!$auth->login($username, md5($password))) {
                // Something is horribly wrong
                echo '<h3>Bad login spree! Contact administrator. <a href="index.php">Go Back.</a></h3>';
                @session_destroy();
            } else {
                // Let's move on normally
                header("Location: beacon.php");
            }
        } else {
            echo '<h3>Login Error. $output <a href="index.php">Try Again.</a></h3>';
            @session_destroy();
        }*/
        /* END: Code for external auth */



        /* BEGIN: MySQL Login */
        if (!$auth->login($username, md5($password))) {
            echo '<h3>Incorrect Login. <a href="index.php">Go Back.</a></h3>';
            @session_destroy();
        } else {
            header("Location: beacon.php");
        }
        /* END: MySQL Login */

    }
} else {
    header("Location: beacon.php");
}
