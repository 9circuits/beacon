<?php

include "BeaconStorage.php";

class BeaconMySQL implements BeaconStorage
{
    private $beacon_db_connection;

    // Constructor
    function BeaconMySQL()
    {

    }

    public function init_db($host, $dbname, $user, $pass) {
        // Open the database connection
         if (!($this->beacon_db_connection = @mysql_connect($host, $user, $pass))) {
             return -1;
         }

         //Select DB
         if (!(mysql_select_db($dbname, $this->beacon_db_connection))) {
             return -2;
         }

         // Select all tables and see if they exist
         if (!($result = @mysql_query("SELECT * FROM beacon_users",
                                                $this->beacon_db_connection))) {
             return -3;
         }
         if (!($result = @mysql_query("SELECT * FROM beacon_documents",
                                                $this->beacon_db_connection))) {
             return -3;
         }
         if (!($result = @mysql_query("SELECT * FROM beacon_revisions",
                                                $this->beacon_db_connection))) {
             return -3;
         }
         if (!($result = @mysql_query("SELECT * FROM beacon_settings",
                                                $this->beacon_db_connection))) {
             return -3;
         }

         @mysql_query("SET NAMES 'utf8'");

         return 1;
    }

    // Create a new document
    public function create_document($filename, $html, $source, $time, $user, $plugin)
    {
        $fields = "`name`, `username`, `source`, `html`, `created`, `plugin`";
        $vals = "'$filename', '$user', '$source', '$html', '$time', '$plugin'";
        $dump = @mysql_query("INSERT INTO `beacon_documents` (".$fields.")
                              VALUES (".$vals.")", $this->beacon_db_connection);

        return mysql_insert_id();
    }

    // Update the document
    public function save_document($id, $html, $source, $time)
    {
        $result = @mysql_query("SELECT * FROM beacon_documents
                                WHERE id = '$id'");

        if(mysql_num_rows($result) != 1) {
            return false;
        }

        $old_src = mysql_result($result, 0, "source");
        $old_html = mysql_result($result, 0, "html");

        $result = @mysql_query("UPDATE beacon_documents
                                SET `source`='$source', `html`='$html'
                                WHERE  id = '$id'");

        $result = @mysql_query("SELECT * FROM beacon_revisions
                                WHERE docid = '$id'");

        $num = mysql_num_rows($result);

        $diff = "";

        $fields = "`docid`, `num`, `source`, `html`, `timestamp`, `diff`";
        $vals = "'$id', '$num', '$old_src', '$old_html', '$time', '$diff'";
        $dump = @mysql_query("INSERT INTO `beacon_revisions` (".$fields.")
                              VALUES (".$vals.")", $this->beacon_db_connection);

        return $dump;

    }

    // Fetch a document
    public function fetch_document($id)
    {
        $result = @mysql_query("SELECT * FROM beacon_documents
                                WHERE id = '$id'");

        if(mysql_num_rows($result) != 1) {
            return false;
        }

        $document['id'] = mysql_result($result, 0, "id");
        $document['name'] = mysql_result($result, 0, "name");
        $document['username'] = mysql_result($result, 0, "username");
        $document['source'] = mysql_result($result, 0, "source");
        $document['html'] = mysql_result($result, 0, "html");
        $document['created'] = mysql_result($result, 0, "created");
        $document['plugin'] = mysql_result($result, 0, "plugin");

        return $document;
    }

    public function fetch_revision($id)
    {
        $result = @mysql_query("SELECT * FROM beacon_revisions
                                WHERE id = '$id'");

        if(mysql_num_rows($result) != 1) {
            return false;
        }

        $revision['id'] = mysql_result($result, 0, "id");
        $revision['docid'] = mysql_result($result, 0, "docid");
        $revision['source'] = mysql_result($result, 0, "source");
        $revision['html'] = mysql_result($result, 0, "html");
        $revision['time'] = mysql_result($result, 0, "timestamp");
        $revision['num'] = mysql_result($result, 0, "num");
        $revision['diff'] = mysql_result($result, 0, "diff");

        return $revision;
    }

    public function fetch_revisions($id)
    {
        $result = @mysql_query("SELECT * FROM beacon_revisions
                                WHERE docid = '$id'");

        $i = 0;
        $arr = array();

        if(mysql_num_rows($result) > 0) {
            while ($i < mysql_num_rows($result)) {
                $revision['id'] = mysql_result($result, $i, "id");
                $revision['docid'] = mysql_result($result, $i, "docid");
                $revision['time'] = mysql_result($result, $i, "timestamp");
                $revision['num'] = mysql_result($result, $i, "num");
                $arr[$i] = $revision;

                $i++;
            }
        }

        return $arr;
    }

    // Fetch User Documents
    public function user_documents($user)
    {
        $result = @mysql_query("SELECT * FROM beacon_documents
                                WHERE username = '$user'");

        $i = 0;
        $arr = array();

        if(mysql_num_rows($result) > 0) {
            while ($i < mysql_num_rows($result)) {
                $document['id'] = mysql_result($result, $i, "id");
                $document['name'] = mysql_result($result, $i, "name");
                $document['username'] = mysql_result($result, $i, "username");
                $document['source'] = mysql_result($result, $i, "source");
                $document['html'] = mysql_result($result, $i, "html");
                $document['created'] = mysql_result($result, $i, "created");
                $document['plugin'] = mysql_result($result, $i, "plugin");

                $arr[$i] = $document;

                $i++;
            }
        }

        return $arr;
    }

    // Delete a document
    public function delete_document($id)
    {
        $result = @mysql_query("DELETE FROM `beacon`.`beacon_documents`
                                WHERE `beacon_documents`.`id` = '$id'");

        $result = @mysql_query("DELETE FROM `beacon`.`beacon_revisions`
                                WHERE `beacon_revisions`.`docid` = '$id'");

    }

    // Close the DB
    public function close_db()
    {
        // Close the database connection
        if (!mysql_close($connection)) {
            return false;
        }
    }

    public function install_db()
    {
        $beacon_create_users_table = "CREATE TABLE `beacon`.`beacon_users` (
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(32) NOT NULL,
        `password` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) NOT NULL
        )";

        $beacon_create_documents_table = "CREATE TABLE `beacon`.`beacon_documents` (
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(32) NOT NULL,
        `plugin` VARCHAR(32) NOT NULL,
        `username` VARCHAR(32) NOT NULL,
        `source` TEXT NOT NULL,
        `html` TEXT NOT NULL,
        `created` VARCHAR(64) NOT NULL
        )";

        $beacon_create_revisions_table = "CREATE TABLE `beacon`.`beacon_revisions` (
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `docid` VARCHAR(32) NOT NULL,
        `num` INT UNSIGNED NOT NULL,
        `source` TEXT NOT NULL,
        `html` TEXT NOT NULL,
        `timestamp` VARCHAR(64) NOT NULL,
        `diff` TEXT NOT NULL
        )";

        $beacon_create_settings_table = "CREATE TABLE `beacon`.`beacon_settings` (
        `uid` INT UNSIGNED NOT NULL PRIMARY KEY,
        `autosave` INT UNSIGNED NOT NULL
        )";

        $dump = @mysql_query($beacon_create_users_table, $this->beacon_db_connection);
        $dump = @mysql_query($beacon_create_documents_table, $this->beacon_db_connection);
        $dump = @mysql_query($beacon_create_revisions_table, $this->beacon_db_connection);
        $dump = @mysql_query($beacon_create_settings_table, $this->beacon_db_connection);
    }

    public function add_user($username, $password, $email)
    {
        $username = stripslashes($username);
        $password = stripslashes($password);
        $username = mysql_real_escape_string($username);
        $password = mysql_real_escape_string($password);

        $password = md5($password);
        $fields = "`username`, `password`, `email`";
        $vals = "'$username', '$password', '$email'";
        $dump = @mysql_query("INSERT INTO `beacon_users` (".$fields.")
                              VALUES (".$vals.")", $this->beacon_db_connection);
    }

    public function validate_user($username, $password)
    {
        $username = stripslashes($username);
        $password = stripslashes($password);
        $username = mysql_real_escape_string($username);
        $password = mysql_real_escape_string($password);

        $result = @mysql_query("SELECT * FROM beacon_users WHERE
                                username = '$username' AND
                                password = '$password'");

        if(mysql_num_rows($result) != 1) {
            return false;
        }

        $user['uid'] = mysql_result($result, 0, "id");
        $user['username'] = mysql_result($result, 0, "username");
        $user['password'] = mysql_result($result, 0, "password");
        $user['email'] = mysql_result($result, 0, "email");

        return $user;
    }
}
