<?php

require_once '../conf';

// set to the user defined error handler otherwise so many stupid warnings!
$old_error_handler = set_error_handler("errorHandler");

try {
    require_once $confdb.'.php';
} catch (Exception $e) {
    //echo 'Caught exception: ',  $e->getMessage(), "\n";
    return -1;
}

function errorHandler($errno, $errstr, $errfile, $errline)
{
    switch ($errno) {
    case E_USER_ERROR:
        // Do something
        exit(1);
        break;

    case E_USER_WARNING:
        //Do Something
        break;

    case E_USER_NOTICE:
        //Do Something
        break;

    default:
        //Do SOMETHING!!!
        break;
    }

    /* Don't execute PHP internal error handler */
    return true;
}

?>