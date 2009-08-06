<?php

interface BeaconStorage
{
    public function createDocument($id, $content = false);
    public function updateDocument($id, $content);
    public function fetchDocument($id);
    public function deleteDocument($id);
}

?>
