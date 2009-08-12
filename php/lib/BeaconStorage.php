<?php

interface BeaconStorage
{
    // Constructor
    function BeaconMySQL();

    // Init
    public function init_db($host, $db, $user, $pass);

    // Create a new document
    public function create_document($filename, $html, $source, $time, $user, $plugin);

    // Update the document
    public function save_document($id, $source, $html, $time);

    // Fetch a document
    public function fetch_document($id);

    // Delete a document
    public function delete_document($id);

    // Close the DB
    public function close_db();

    public function install_db();

    public function add_user($username, $password, $email);
}

?>
