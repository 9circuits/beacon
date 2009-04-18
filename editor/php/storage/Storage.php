<?php

interface BeaconStorage
{
	public function createDocument($content = false);
	public function updateDocument($id, $content);
	public function fetchDocument($id);
}

?>