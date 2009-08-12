<?php
/*
 * Beacon Standlone Version
 *
 */

//ini_set("display_errors", 0);

// Clean it up
session_start();
session_destroy();

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
        $beacon_error = "Error: Tables are not installed. Click install to setup.";
        $beacon_install = true;
        break;

    case 1:
        $beacon_error = "Database is setup. OK.";
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
                <div id="BeaconWelcome" style="text-align: center; margin: 5px;">
                    <img src="../beacon/img/beacon-logo.jpg" alt="Beacon Logo" />
                    <p>Welcome to Beacon. A WYSIWYG (and much more!) Editor.</p>
                </div>
                <hr />
                <p align="right"><b>Beacon Version: 0.5 Beta</b></p>
                <p><b>Status:</b></p>
                    <?php
                        $useragent = $_SERVER['HTTP_USER_AGENT'];
                        if(preg_match('|Firefox/([0-9\.]+)|', $useragent, $matched)) {
                            $browser_version=$matched[1];
                            $browser = 'Firefox';
                            if ((int)$browser_version[0] >= 3) {
                                echo '<p><span class="ui-state-default">
                                      Browser is Firefox 3.0+. OK. </span></p>';
                            } else {
                                echo '<p><span class="ui-state-error">
                                      Error: This version of firefox may not
                                      work well with Beacon. Use 3.0+ only.
                                      </span></p>';
                            }
                        } else {
                            echo '<p><span class="ui-state-error">Error:
                                  This browser maybe incompatible with Beacon.
                                  Please use Firefox 3.0+ only.</span></p>';
                        }
                    ?>

                    <script>
                        document.write('<p><span class="ui-state-default">Javascript is enabled. OK.</span></p>')
                    </script>
                    <noscript>
                        <p><span class="ui-state-error">Error: Javascript seems to be disabled!</span></p>
                    </noscript>

                    <?php
                        if (!$beacon_runnable) {
                            echo '<p><span class="ui-state-error">'.$beacon_error.'</span></p>';
                        } else {
                            echo '<p><span class="ui-state-default">'.$beacon_error.'</span></p>';
                        }
                    ?>
            </div>
        </div>


        <div class="actions">
            <div id="createUserDialog" title="Create new user">
                <p id="validateTips1">All form fields are required.</p>
                <form>
                    <fieldset>
                        <label for="name">Username</label>
                        <input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all" />
                        <label for="email">Email</label>
                        <input type="text" name="email" id="email" value="" class="text ui-widget-content ui-corner-all" />
                        <label for="password">Password</label>
                        <input type="password" name="password" id="password" value="" class="text ui-widget-content ui-corner-all" />
                    </fieldset>
                </form>
            </div>

            <div id="loginDialog" title="Login">
                <p id="validateTips2">All form fields are required.</p>
                <form id="loginForm" action="login.php" method="POST">
                    <fieldset>
                        <label for="name1">Username</label>
                        <input type="text" name="name1" id="name1" class="text ui-widget-content ui-corner-all" />
                        <label for="password1">Password</label>
                        <input type="password" name="password1" id="password1" value="" class="text ui-widget-content ui-corner-all" />
                    </fieldset>
                </form>
            </div>

            <div id="installDialog" title="Details for New Account">
                <p id="validateTips3">All form fields are required. At least one account is required for Beacon to run.</p>
                <form id="installForm" action="install.php" method="POST">
                    <fieldset>
                        <label for="name2">Username</label>
                        <input type="text" name="name2" id="name2" class="text ui-widget-content ui-corner-all" />
                        <label for="email2">Email</label>
                        <input type="text" name="email2" id="email2" value="" class="text ui-widget-content ui-corner-all" />
                        <label for="password2">Password</label>
                        <input type="password" name="password2" id="password2" value="" class="text ui-widget-content ui-corner-all" />
                    </fieldset>
                </form>
            </div>

            <?php
                if ($beacon_runnable) {
                    echo '<p><button id="login" class="ui-button ui-state-default ui-corner-all">Login</button></p>';

                    if ($beacon_create_user) {
                        echo '<p><button id="create-user" class="ui-button ui-state-default ui-corner-all">Register</button></p>';
                    }
                } else if ($beacon_install) {
                    echo '<p><button id="install" class="ui-button ui-state-default ui-corner-all">Install</button></p>';
                }
            ?>
        </div>

    </div>

    <script src="../beacon/js/jquery.js" type="text/javascript"></script>
    <script src="../beacon/js/jquery.ui.js" type="text/javascript"></script>
    <script src="js/main.js" type="text/javascript"></script>
</body>
</html>
