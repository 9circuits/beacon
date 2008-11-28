<?php

interface BeaconStorage
{
	public function createDocument();
	public function updateDocument($id, $content);
	public function fetchDocument($id);
}

?>