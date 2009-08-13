<?php
/*
 * Quick Beacon Install Script
 *
 */


require_once ('settings.php');
require_once ('lib/BeaconMySQL.php');

$beacon_db_instance = NULL;

$beacon_runnable = false;
$beacon_install = false;
$beacon_error = "";

if ($beacon_db_type == "mysql") {
    $beacon_db_instance = new BeaconMySQL();
}

switch ($beacon_db_instance->init_db($beacon_mysql_hostname,
                                     $beacon_mysql_database,
                                     $beacon_mysql_username,
                                     $beacon_mysql_password))
{
    case -1:
        $beacon_error = " Error: Could not connect to DB. Check your settings";
        break;

    case -2:
        $beacon_error = "Error: Please check the database name in your settings.";
        break;

    case -3:
        $beacon_install = true;
        break;

    case 1:
        $beacon_error = "Database is already setup.";
        $beacon_runnable = true;
        break;
}

$request = json_decode(file_get_contents($beacon_conf_path));

?>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>Beacon</title>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <link rel="stylesheet" href="css/main.css" type="text/css" />

    <!-- Jquery theming -->
    <link rel="stylesheet" href="../beacon/css/<?php echo $request->theme; ?>/jquery.ui.css" type="text/css" />

</head>

<body>

    <div id="container" class="ui-corner-all">
        <div class="BeaconContent">
            <div style="margin: 10px;">
                <p align="right"><b>Beacon Version: 0.5 Beta</b></p>
                <p><b>Status:</b></p>
                    <?php
                        if (!isset($_POST['name2'])) {
                            echo '<p><span class="ui-state-error">Please so not use this link directly.</span></p>';
                        } else {
                            if (!$beacon_install) {
                                if ($beacon_runnable) {
                                    echo '<p><span class="ui-state-default">'.$beacon_error.'</span></p>';
                                } else {
                                    echo '<p><span class="ui-state-error">'.$beacon_error.'</span></p>';
                                }
                            } else {
                                $beacon_db_instance->install_db();
                                $beacon_db_instance->add_user($_POST['name2'],
                                                              $_POST['password2'],
                                                              $_POST['email2']);

                                echo '<p><span class="ui-state-default">Installation Done!</span></p>';
                                echo '<p><b>Username: </b>'. $_POST['name2'];
                                echo '<p><b>Password: </b>'. $_POST['password2'];
                                echo '<p><b>Email: </b>'. $_POST['email2'];
                            }
                        }
                    ?>
                <p><a href="index.php">Go back to homepage.</a></p>
            </div>
        </div>

    </div>

</body>
</html>
